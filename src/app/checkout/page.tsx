'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { formatPrice } from '@/lib/artCatalog';
import { SITE_CONFIG } from '@/config/site';
import {
  ShieldCheck,
  ArrowRight,
  Check,
  CreditCard,
  Truck,
  Lock,
  AlertCircle,
  ChevronDown,
  ShoppingBag,
  RotateCw,
} from 'lucide-react';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, clearCart, getSubtotal, getFramingTotal, getShipping } = useCartStore();
  const addCollectedOrder = useUserStore((state) => state.addCollectedOrder);

  const [mounted, setMounted] = useState(false);
  // Simple 2-phase progression before confirmation:
  // Step 1: 01 DELIVERY
  // Step 2: 02 PAYMENT
  // Step 3: 03 CONFIRMATION
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Form State
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    country: 'India',
    deliveryNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isCouponValidating, setIsCouponValidating] = useState(false);

  // Processing & Errors
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const framingTotal = getFramingTotal();
  const shipping = getShipping();
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + framingTotal + shipping - discountAmount);

  // Server-Authoritative Coupon Application
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    setIsCouponValidating(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: code,
          subtotal: subtotal + framingTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Invalid or expired coupon code.');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
        });
        setCouponInput('');
      }
    } catch {
      setCouponError('Unable to validate coupon at this time. Please try again.');
    } finally {
      setIsCouponValidating(false);
    }
  };

  // Submit Order Execution
  const handlePlaceOrder = async () => {
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          frameOptionId: i.frameOption?.id || 'unframed',
          quantity: i.quantity,
        })),
        customer,
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'PAYMENT COULD NOT BE COMPLETED. Please review your details and try again.');
        setIsProcessing(false);
        return;
      }

      // If Cash on Delivery:
      if (paymentMethod === 'cod') {
        const orderSummaryObj = {
          id: data.orderId,
          orderNumber: data.orderNumber,
          customer,
          items,
          shippingAddress: address,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          fulfillmentStatus: 'processing',
          total: grandTotal,
          createdAt: new Date().toISOString(),
        };
        addCollectedOrder(orderSummaryObj as any);
        setCompletedOrder(orderSummaryObj);
        setStep(3);
        clearCart();
        setIsProcessing(false);
        return;
      }

      // If Razorpay:
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        setErrorMessage(
          'PAYMENT COULD NOT BE COMPLETED: Gateway failed to load. Please check your connection or choose Cash on Delivery.'
        );
        setIsProcessing(false);
        return;
      }

      const razorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: SITE_CONFIG.name,
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: '#000000',
        },
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            setErrorMessage('');

            // Strict server-side HMAC signature verification
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
              setErrorMessage(
                verifyData.error ||
                  'PAYMENT COULD NOT BE COMPLETED. Payment verification failed on server. Please contact support with payment ID: ' +
                    response.razorpay_payment_id
              );
              setIsProcessing(false);
              return;
            }

            const orderSummaryObj = {
              id: data.orderId,
              orderNumber: verifyData.orderNumber || data.orderNumber,
              customer,
              items,
              shippingAddress: address,
              paymentMethod: 'razorpay',
              paymentStatus: 'paid',
              fulfillmentStatus: 'confirmed',
              total: grandTotal,
              createdAt: new Date().toISOString(),
            };

            addCollectedOrder(orderSummaryObj as any);
            setCompletedOrder(orderSummaryObj);
            setStep(3);
            clearCart();
          } catch (err: any) {
            console.error('Payment verification failed:', err);
            setErrorMessage('PAYMENT COULD NOT BE COMPLETED: Network error verifying payment. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setErrorMessage('PAYMENT COULD NOT BE COMPLETED: Payment window was closed. Please try again or choose another payment method.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(razorpayOptions);
      rzp.on('payment.failed', function (resp: any) {
        setErrorMessage(
          resp.error?.description
            ? `PAYMENT COULD NOT BE COMPLETED: ${resp.error.description}`
            : 'PAYMENT COULD NOT BE COMPLETED. Please try again or choose another payment method.'
        );
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('PAYMENT COULD NOT BE COMPLETED: A network error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  // STEP 3: ORDER CONFIRMED SCREEN (Section 18)
  if (step === 3 && completedOrder) {
    return (
      <div className="min-h-[75vh] max-w-2xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-md">
          <Check size={32} strokeWidth={2.5} />
        </div>

        <span className="text-[11px] font-sans font-bold tracking-widest text-neutral-500 uppercase block mb-1">
          ✓ Order Confirmed
        </span>

        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-black uppercase tracking-tight mb-2">
          Thank You For Your Order
        </h1>

        <p className="text-sm font-sans text-neutral-600 max-w-md mb-8 leading-relaxed">
          Order reference <span className="font-bold text-black">{completedOrder.orderNumber}</span>. We
          have sent a confirmation email with invoice and white-glove transit details.
        </p>

        {/* Structured Order Summary */}
        <div className="w-full bg-white p-6 border border-neutral-200 text-left mb-8 space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-100">
            <span className="text-neutral-500 uppercase font-sans tracking-wider">Order Reference</span>
            <span className="font-bold font-sans text-black">{completedOrder.orderNumber}</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-100">
            <span className="text-neutral-500 uppercase font-sans tracking-wider">Customer</span>
            <span className="font-semibold text-black font-sans">{completedOrder.customer.fullName} ({completedOrder.customer.phone})</span>
          </div>

          <div className="flex justify-between items-start text-xs pb-3 border-b border-neutral-100">
            <span className="text-neutral-500 uppercase font-sans tracking-wider">Delivery Address</span>
            <span className="font-medium text-black font-sans text-right max-w-xs">
              {completedOrder.shippingAddress.addressLine1}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} — {completedOrder.shippingAddress.pincode}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-100">
            <span className="text-neutral-500 uppercase font-sans tracking-wider">Payment Method</span>
            <span className="font-bold font-sans text-black uppercase">
              {completedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Paid Online (Razorpay)'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-100">
            <span className="text-neutral-500 uppercase font-sans tracking-wider">Expected Delivery</span>
            <span className="font-bold font-sans text-black">
              4–7 Business Days (Insured White-Glove Transit)
            </span>
          </div>

          <div className="flex justify-between items-center text-base font-sans pt-1">
            <span className="font-normal text-black">Total Paid</span>
            <span className="font-extrabold text-black text-lg">{formatPrice(completedOrder.total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3.5 justify-center">
          <Link
            href="/products"
            className="bg-black hover:bg-neutral-800 text-white px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-widest transition-colors shadow-xs"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="border border-black hover:bg-neutral-100 text-black px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-widest transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART STATE (Section 22)
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
          <ShoppingBag size={24} />
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-black uppercase tracking-tight mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-xs text-neutral-500 font-sans mb-8 leading-relaxed">
          Your cart is waiting for something special. Explore our collection of wall art, sculptures, and decorative pieces.
        </p>
        <Link
          href="/products"
          className="bg-black hover:bg-neutral-800 text-white px-8 py-4 text-xs font-sans font-bold uppercase tracking-widest transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const isDeliveryValid = Boolean(
    customer.fullName.trim() &&
    customer.email.trim() &&
    customer.phone.trim() &&
    address.addressLine1.trim() &&
    address.city.trim() &&
    address.pincode.trim()
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-14">
      {/* ── SIMPLE 01 DELIVERY -> 02 PAYMENT PROGRESSION ─────────────── */}
      <div className="max-w-md mx-auto mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-6 text-xs font-sans uppercase tracking-widest">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
              step === 1 ? 'border-black text-black font-bold' : 'border-transparent text-neutral-400'
            }`}
          >
            <span>01 DELIVERY</span>
          </button>
          <span className="text-neutral-300">/</span>
          <button
            onClick={() => {
              if (isDeliveryValid) setStep(2);
            }}
            disabled={!isDeliveryValid}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
              step === 2
                ? 'border-black text-black font-bold'
                : isDeliveryValid
                ? 'border-transparent text-neutral-700 hover:text-black'
                : 'border-transparent text-neutral-300 cursor-not-allowed'
            }`}
          >
            <span>02 PAYMENT</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold mb-0.5 uppercase tracking-wide">Payment Notice</p>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden mb-6 bg-white border border-neutral-200 p-3.5">
        <button
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full flex items-center justify-between text-xs font-sans"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={14} className="text-black" />
            <span className="font-bold uppercase tracking-wider text-black">
              {mobileSummaryOpen ? 'Hide' : 'Show'} Order Summary ({items.length})
            </span>
            <ChevronDown
              size={13}
              className={`text-neutral-500 transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`}
            />
          </div>
          <span className="font-bold text-black text-sm">{formatPrice(grandTotal)}</span>
        </button>

        {mobileSummaryOpen && (
          <div className="pt-3 mt-3 border-t border-neutral-100 space-y-3">
            <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <div className="w-12 h-14 bg-neutral-100 relative overflow-hidden flex-shrink-0 border border-neutral-200">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans font-bold text-black truncate uppercase">{item.name}</p>
                    <p className="text-[10px] text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-sans font-bold text-black">
                    {formatPrice((item.price + (item.frameOption?.price || 0)) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-neutral-100 text-xs font-sans space-y-1 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal + framingTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* ── LEFT: FORM STEPS ───────────────────────────────────────── */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 md:p-10 border border-neutral-200 shadow-xs">
          {/* STEP 1: DELIVERY INFORMATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                  01 of 02
                </span>
                <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-black uppercase tracking-tight">
                  Delivery Information
                </h2>
                <p className="text-xs font-sans text-neutral-500 mt-1">
                  Enter your recipient contact and shipping address for insured white-glove transit.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-black pt-2 border-t border-neutral-100">
                  Recipient Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Vikram Sethi"
                      className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                      Phone Number * (for delivery courier)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+91 98100 12345"
                      className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                    Email Address * (for receipt &amp; tracking)
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-black pt-2 border-t border-neutral-100">
                  Shipping Address
                </h3>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="Apartment, building, house number, street"
                    className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    placeholder="Suite, landmark, floor"
                    className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 110001"
                      className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs font-sans text-black outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-black mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full bg-neutral-100 border border-neutral-300 p-3 text-xs font-sans text-neutral-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!isDeliveryValid}
                onClick={() => setStep(2)}
                className="w-full bg-black hover:bg-neutral-800 text-white py-4 text-xs font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed shadow-xs"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD (Section 17) */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-500 uppercase block mb-1">
                  02 of 02
                </span>
                <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-black uppercase tracking-tight">
                  Payment Method
                </h2>
                <p className="text-xs font-sans text-neutral-500 mt-1">
                  Select your preferred payment method. Encrypted 256-bit checkout.
                </p>
              </div>

              {/* Delivery Summary Banner */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 text-xs font-sans flex items-center justify-between">
                <div>
                  <span className="font-bold text-black uppercase block">Delivering To:</span>
                  <span className="text-neutral-600">{customer.fullName} • {address.city}, {address.state} ({address.pincode})</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-sans font-bold text-black uppercase underline underline-offset-4 hover:text-neutral-600"
                >
                  Edit
                </button>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                {/* Razorpay Online */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`w-full p-4 border text-left flex items-start justify-between transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-black bg-neutral-50 ring-1 ring-black shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center mt-0.5">
                      {paymentMethod === 'razorpay' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-sans font-bold text-black block uppercase tracking-wider">
                        Online Payment (UPI, Cards, Net Banking)
                      </span>
                      <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block leading-relaxed">
                        Instant, secure processing via Razorpay. Supports UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.
                      </span>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-black flex-shrink-0 mt-0.5" />
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 border text-left flex items-start justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-black bg-neutral-50 ring-1 ring-black shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center mt-0.5">
                      {paymentMethod === 'cod' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-sans font-bold text-black block uppercase tracking-wider">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-neutral-500 font-sans mt-0.5 block leading-relaxed">
                        Pay upon delivery of your packaged art piece.
                      </span>
                    </div>
                  </div>
                  <Truck size={18} className="text-black flex-shrink-0 mt-0.5" />
                </button>
              </div>

              {/* Secure Notice */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
                <Lock size={15} className="text-black flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-sans">
                  Transactions are secured via 256-bit encryption. An itemized invoice and tracking code will be dispatched to your email immediately upon placement.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-black text-xs font-sans font-bold uppercase tracking-wider text-black hover:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-black hover:bg-neutral-800 text-white py-4 text-xs font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed shadow-xs"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <RotateCw size={14} className="animate-spin" />
                      <span>Securing payment session...</span>
                    </span>
                  ) : (
                    <>
                      <span>Place Order — {formatPrice(grandTotal)}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: DESKTOP ORDER SUMMARY ─────────────────────────── */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6 sticky top-[80px]">
          <h3 className="font-sans text-sm font-bold text-black pb-3 border-b border-neutral-200 uppercase tracking-widest">
            Order Summary ({items.length})
          </h3>

          {/* Items List */}
          <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3.5 flex gap-3.5 first:pt-0">
                <div className="w-16 h-20 bg-neutral-100 relative overflow-hidden flex-shrink-0 border border-neutral-200">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold text-black uppercase truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                      {item.frameOption?.name || 'Standard Framing'} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-sans text-xs font-bold text-black">
                    {formatPrice((item.price + (item.frameOption?.price || 0)) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-neutral-100">
            <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-black mb-1.5">
              Promo Code / Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="e.g. COLLECTOR10"
                className="flex-1 bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs font-sans text-black outline-none focus:border-black uppercase"
              />
              <button
                type="submit"
                disabled={isCouponValidating}
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isCouponValidating ? '...' : 'Apply'}
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                <Check size={12} />
                <span>Coupon {appliedCoupon.code} applied (-{formatPrice(appliedCoupon.discount)})</span>
              </p>
            )}
            {couponError && <p className="text-xs text-red-600 mt-1.5">{couponError}</p>}
          </form>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs font-sans text-neutral-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-black font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {framingTotal > 0 && (
              <div className="flex justify-between">
                <span>Custom Framing</span>
                <span className="text-black font-semibold">{formatPrice(framingTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Transit</span>
              <span className="text-black font-semibold">
                {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-neutral-200 text-base font-sans text-black">
              <span className="font-bold uppercase tracking-wider">Total</span>
              <span className="font-extrabold text-lg">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="bg-neutral-50 p-3 text-[11px] font-sans text-neutral-500 border border-neutral-200 flex items-center gap-2">
            <ShieldCheck size={16} className="text-black flex-shrink-0" />
            <span>Complimentary white-glove transit across India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
