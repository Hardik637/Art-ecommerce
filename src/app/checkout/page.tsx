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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

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
        setErrorMessage(data.error || 'Failed to initialize checkout. Please review your cart and details.');
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
        setStep(4);
        clearCart();
        setIsProcessing(false);
        return;
      }

      // If Razorpay:
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        setErrorMessage(
          'Unable to load Razorpay payment gateway. Please check your internet connection or choose Cash on Delivery.'
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
          color: '#11100F',
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
                  'Payment verification failed on the server. Please contact support with payment ID: ' +
                    response.razorpay_payment_id
              );
              setIsProcessing(false);
              return;
            }

            // Only mark order confirmed when server cryptographically confirms verification
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
            setStep(4);
            clearCart();
          } catch (err: any) {
            console.error('Payment verification failed:', err);
            setErrorMessage('Network error confirming payment. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(razorpayOptions);
      rzp.on('payment.failed', function (resp: any) {
        setErrorMessage(resp.error?.description || 'Payment was declined or cancelled by the provider.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('A network or server error occurred during checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  // Step 4: Confirmed Order Screen
  if (step === 4 && completedOrder) {
    return (
      <div className="min-h-[75vh] max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#11100F] text-[#F4EFE7] rounded-full flex items-center justify-center mb-6 shadow-md">
          <Check size={32} />
        </div>

        <span className="text-[11px] font-sans font-bold tracking-wider text-[#78716C] uppercase block mb-2">
          Order Confirmed
        </span>

        <h1 className="font-sans text-3xl md:text-4xl font-bold text-[#11100F] uppercase tracking-tight mb-3">
          Thank You For Your Order
        </h1>

        <p className="text-sm font-sans text-[#78716C] max-w-md mb-8 leading-relaxed">
          Order reference <span className="font-bold text-[#11100F]">{completedOrder.orderNumber}</span>. We
          have sent an email receipt with order details and tracking updates.
        </p>

        {/* Order Summary Box */}
        <div className="w-full bg-[#FAF7F2] p-6 border border-[#E4DBCF] text-left mb-8 space-y-3">
          <div className="flex justify-between text-xs pb-2 border-b border-[#E4DBCF]">
            <span className="text-[#78716C]">Customer</span>
            <span className="font-medium text-[#11100F]">{completedOrder.customer.fullName}</span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-[#E4DBCF]">
            <span className="text-[#78716C]">Delivery To</span>
            <span className="font-medium text-[#11100F]">
              {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}
            </span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-[#E4DBCF]">
            <span className="text-[#78716C]">Payment Method</span>
            <span className="font-medium text-[#11100F] uppercase">
              {completedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
            </span>
          </div>
          <div className="flex justify-between text-base font-sans pt-1">
            <span>Total Paid</span>
            <span className="font-bold text-[#11100F]">{formatPrice(completedOrder.total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/account/orders"
            className="bg-[#11100F] hover:bg-[#2D2A26] text-[#F4EFE7] px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="border border-[#11100F] hover:bg-[#11100F] hover:text-[#F4EFE7] text-[#11100F] px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart state
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E4DBCF] flex items-center justify-center text-[#11100F] mb-4">
          <Truck size={24} />
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#11100F] uppercase tracking-tight mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-xs font-sans text-[#78716C] mb-8 leading-relaxed">
          Explore our collection of wall art, sculptures, and decorative pieces to add items to your cart.
        </p>
        <Link
          href="/products"
          className="bg-[#11100F] hover:bg-[#2D2A26] text-[#F4EFE7] px-8 py-4 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16">
      {/* Checkout Steps Progress Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 ${
              step >= 1 ? 'text-[#11100F] font-bold' : 'text-[#A8A29E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Contact</span>
          </button>
          <span className="text-[#E4DBCF]">—</span>

          <button
            onClick={() => {
              if (customer.fullName && customer.email) setStep(2);
            }}
            className={`flex items-center gap-1.5 ${
              step >= 2 ? 'text-[#11100F] font-bold' : 'text-[#A8A29E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Shipping</span>
          </button>
          <span className="text-[#E4DBCF]">—</span>

          <button
            onClick={() => {
              if (address.addressLine1 && address.city) setStep(3);
            }}
            className={`flex items-center gap-1.5 ${
              step >= 3 ? 'text-[#11100F] font-bold' : 'text-[#A8A29E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Payment</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold mb-0.5">Order Notice</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ── LEFT: FORM STEPS ───────────────────────────────────────── */}
        <div className="lg:col-span-7 bg-[#FAF7F2] p-8 md:p-10 border border-[#E4DBCF]">
          {/* STEP 1: CUSTOMER INFORMATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-wider text-[#78716C] uppercase block mb-1">
                  Step 1 of 3
                </span>
                <h2 className="font-sans text-xl md:text-2xl font-bold text-[#11100F] uppercase tracking-tight">
                  Customer Contact
                </h2>
                <p className="text-xs font-sans text-[#78716C] mt-1">
                  We use this for order confirmation, invoices, and shipping updates.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Vikram Sethi"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Phone Number * (for delivery courier)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+91 98100 12345"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={!customer.fullName || !customer.email || !customer.phone}
                onClick={() => setStep(2)}
                className="w-full bg-[#11100F] hover:bg-[#2D2A26] text-[#F4EFE7] py-4 text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:bg-[#A8A29E]"
              >
                <span>Continue to Shipping</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-wider text-[#78716C] uppercase block mb-1">
                  Step 2 of 3
                </span>
                <h2 className="font-sans text-xl md:text-2xl font-bold text-[#11100F] uppercase tracking-tight">
                  Shipping Address
                </h2>
                <p className="text-xs font-sans text-[#78716C] mt-1">
                  All items are securely packaged with transit protection.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="House / Apartment number, Street name"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    placeholder="Suite, building wing, landmark"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="e.g. 110001"
                      className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={address.deliveryNotes}
                    onChange={(e) => setAddress({ ...address, deliveryNotes: e.target.value })}
                    placeholder="Special delivery instructions or gate code"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-[#11100F] text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] hover:bg-[#E4DBCF]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!address.addressLine1 || !address.city || !address.pincode}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#11100F] hover:bg-[#2D2A26] text-[#F4EFE7] py-4 text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:bg-[#A8A29E]"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-wider text-[#78716C] uppercase block mb-1">
                  Step 3 of 3
                </span>
                <h2 className="font-sans text-xl md:text-2xl font-bold text-[#11100F] uppercase tracking-tight">
                  Payment Method
                </h2>
                <p className="text-xs font-sans text-[#78716C] mt-1">
                  Secure checkout with instant verification.
                </p>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`w-full p-4 border text-left flex items-start justify-between transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#11100F] bg-[#F4EFE7] shadow-sm'
                      : 'border-[#E4DBCF] hover:border-[#11100F]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-[#11100F] flex items-center justify-center mt-0.5">
                      {paymentMethod === 'razorpay' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#11100F]" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-sans font-bold text-[#11100F] block">
                        Online Payment (UPI, Cards, Net Banking)
                      </span>
                      <span className="text-[11px] text-[#78716C] font-sans">
                        Instant, secure processing via Razorpay. Supports UPI (GPay, PhonePe), Cards &amp; Net Banking.
                      </span>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-[#11100F] flex-shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 border text-left flex items-start justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#11100F] bg-[#F4EFE7] shadow-sm'
                      : 'border-[#E4DBCF] hover:border-[#11100F]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-[#11100F] flex items-center justify-center mt-0.5">
                      {paymentMethod === 'cod' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#11100F]" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-sans font-bold text-[#11100F] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-[#78716C] font-sans">
                        Pay upon delivery of your packaged art piece.
                      </span>
                    </div>
                  </div>
                  <Truck size={18} className="text-[#11100F] flex-shrink-0" />
                </button>
              </div>

              {/* Secure Notice */}
              <div className="p-4 bg-[#F4EFE7] border border-[#E4DBCF] text-xs text-[#78716C] flex items-start gap-2.5">
                <Lock size={15} className="text-[#11100F] flex-shrink-0 mt-0.5" />
                <p>
                  Transactions are encrypted and verified server-side. Order confirmation will be sent directly to your email.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-[#11100F] text-xs font-sans font-bold uppercase tracking-wider text-[#11100F] hover:bg-[#E4DBCF]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-[#11100F] hover:bg-[#2D2A26] text-[#F4EFE7] py-4 text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:bg-[#A8A29E]"
                >
                  {isProcessing ? (
                    <span>Processing Order...</span>
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

        {/* ── RIGHT: ORDER SUMMARY ─────────────────────────── */}
        <div className="lg:col-span-5 bg-[#FAF7F2] p-6 md:p-8 border border-[#E4DBCF] space-y-6">
          <h3 className="font-sans text-base font-bold text-[#11100F] pb-3 border-b border-[#E4DBCF] uppercase tracking-wider">
            Order Summary ({items.length})
          </h3>

          {/* Items List */}
          <div className="divide-y divide-[#E4DBCF] max-h-80 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 first:pt-0">
                <div className="w-16 h-20 bg-[#E4DBCF] relative overflow-hidden flex-shrink-0 border border-[#D6CDBF]">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold text-[#11100F] uppercase truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#78716C]">
                      {item.frameOption?.name || 'Standard'} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-sans text-xs font-bold text-[#11100F]">
                    {formatPrice((item.price + (item.frameOption?.price || 0)) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="pt-2">
            <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#11100F] mb-1.5">
              Promo Code / Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="e.g. COLLECTOR10"
                className="flex-1 bg-[#F4EFE7] border border-[#E4DBCF] px-3 py-2 text-xs font-sans text-[#11100F] outline-none uppercase"
              />
              <button
                type="submit"
                disabled={isCouponValidating}
                className="bg-[#11100F] hover:bg-[#2D2A26] text-[#F4EFE7] px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isCouponValidating ? '...' : 'Apply'}
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-[#10B981] mt-1.5 flex items-center gap-1 font-medium">
                <Check size={12} />
                <span>Coupon {appliedCoupon.code} applied (-{formatPrice(appliedCoupon.discount)})</span>
              </p>
            )}
            {couponError && <p className="text-xs text-[#DC2626] mt-1.5">{couponError}</p>}
          </form>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-[#E4DBCF] space-y-2 text-xs font-sans text-[#78716C]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-[#11100F] font-medium">{formatPrice(subtotal)}</span>
            </div>
            {framingTotal > 0 && (
              <div className="flex justify-between">
                <span>Custom Framing</span>
                <span className="text-[#11100F] font-medium">{formatPrice(framingTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-[#11100F] font-medium">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#10B981]">
                <span>Discount</span>
                <span className="font-medium">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-[#E4DBCF] text-base font-sans text-[#11100F]">
              <span className="font-normal">Total</span>
              <span className="font-bold">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="bg-[#F4EFE7] p-3 text-[11px] font-sans text-[#78716C] border border-[#E4DBCF] flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#11100F]" />
            <span>Secure 256-bit encrypted checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
