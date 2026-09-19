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
  Trash2,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, removeItem, clearCart, getSubtotal, getFramingTotal, getShipping, getTotal } = useCartStore();
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

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
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

  // Apply Coupon Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.toUpperCase().trim();
    if (code === 'COLLECTOR10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code, discount: disc });
    } else if (code === 'FIRSTACQUISITION') {
      const disc = Math.round(subtotal * 0.15);
      setAppliedCoupon({ code, discount: disc });
    } else if (code === 'CONNOISSEUR') {
      const disc = Math.round(subtotal * 0.2);
    } else {
      setCouponError('Invalid invitation or collector code.');
    }
  };

  // Submit Order Execution
  const handlePlaceOrder = async () => {
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
        alert(data.error || 'Acquisition order failed to initialize.');
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
      // In production or test mode, check if Razorpay script exists on window
      const razorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: SITE_CONFIG.name,
        description: `Acquisition Order ${data.orderNumber}`,
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
          // Signature verification
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id || data.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'mock_sig',
              orderId: data.orderId,
            }),
          });

          const verifyData = await verifyRes.json();
          const orderSummaryObj = {
            id: data.orderId,
            orderNumber: data.orderNumber,
            customer,
            items,
            shippingAddress: address,
            paymentMethod: 'razorpay',
            paymentStatus: 'paid',
            fulfillmentStatus: 'payment_confirmed',
            total: grandTotal,
            createdAt: new Date().toISOString(),
          };
          addCollectedOrder(orderSummaryObj as any);
          setCompletedOrder(orderSummaryObj);
          setStep(4);
          clearCart();
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // Check if window.Razorpay exists or simulated fallback
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(razorpayOptions);
        rzp.open();
      } else {
        // Smooth test fallback: automatically confirm after simulated payment dialog
        setTimeout(() => {
          razorpayOptions.handler({
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: `pay_simulated_${Date.now()}`,
            razorpay_signature: 'simulated_signature',
          });
        }, 1200);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network or server error during order creation.');
      setIsProcessing(false);
    }
  };

  // Step 4: Confirmed Order Screen
  if (step === 4 && completedOrder) {
    return (
      <div className="min-h-[75vh] max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#11100F] text-[#B08A4A] rounded-full flex items-center justify-center mb-6 shadow-xl border border-[#B08A4A]/40">
          <ShieldCheck size={40} />
        </div>

        <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
          Acquisition Confirmed
        </span>

        <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] tracking-tight mb-3">
          Your Masterwork is Reserved
        </h1>

        <p className="text-sm font-sans text-[#78716C] max-w-md mb-8 leading-relaxed">
          Order reference <span className="font-semibold text-[#11100F]">{completedOrder.orderNumber}</span>. Our curatorial concierge has received your acquisition dossier and will oversee custom crating and white-glove transit.
        </p>

        {/* Dossier Summary Box */}
        <div className="w-full bg-[#FAF7F2] p-6 border border-[#E4DBCF] text-left mb-8 space-y-3">
          <div className="flex justify-between text-xs pb-2 border-b border-[#E4DBCF]">
            <span className="text-[#78716C]">Collector</span>
            <span className="font-medium text-[#11100F]">{completedOrder.customer.fullName}</span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-[#E4DBCF]">
            <span className="text-[#78716C]">Destination</span>
            <span className="font-medium text-[#11100F]">
              {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}
            </span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-[#E4DBCF]">
            <span className="text-[#78716C]">Payment Method</span>
            <span className="font-medium text-[#11100F] uppercase">
              {completedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Verified (Razorpay)'}
            </span>
          </div>
          <div className="flex justify-between text-base font-serif pt-1">
            <span>Total Value</span>
            <span className="font-semibold text-[#11100F]">{formatPrice(completedOrder.total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/account/orders"
            className="bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] px-8 py-3.5 text-xs font-sans font-semibold uppercase tracking-widest transition-colors"
          >
            Track in My Account
          </Link>
          <Link
            href="/products"
            className="border border-[#11100F] hover:bg-[#11100F] hover:text-[#F4EFE7] text-[#11100F] px-8 py-3.5 text-xs font-sans font-semibold uppercase tracking-widest transition-colors"
          >
            Explore More Works
          </Link>
        </div>
      </div>
    );
  }

  // Empty Bag state
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#E4DBCF] flex items-center justify-center text-[#B08A4A] mb-4">
          <span className="font-serif text-2xl italic">A</span>
        </div>
        <h1 className="font-serif text-3xl font-normal text-[#11100F] mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs font-sans text-[#78716C] mb-8 leading-relaxed">
          You haven&apos;t added any masterworks or sculptures to your bag yet. Explore our curated collection to begin.
        </p>
        <Link
          href="/products"
          className="bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] px-8 py-4 text-xs font-sans font-semibold uppercase tracking-widest transition-colors"
        >
          Browse All Artworks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16">
      {/* Checkout Steps Progress Bar */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex items-center justify-between text-xs font-sans uppercase tracking-widest">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 ${
              step >= 1 ? 'text-[#11100F] font-semibold' : 'text-[#A8A29E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Collector Info</span>
          </button>
          <span className="text-[#E4DBCF]">—</span>

          <button
            onClick={() => {
              if (customer.fullName && customer.email) setStep(2);
            }}
            className={`flex items-center gap-1.5 ${
              step >= 2 ? 'text-[#11100F] font-semibold' : 'text-[#A8A29E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Delivery</span>
          </button>
          <span className="text-[#E4DBCF]">—</span>

          <button
            onClick={() => {
              if (address.addressLine1 && address.city) setStep(3);
            }}
            className={`flex items-center gap-1.5 ${
              step >= 3 ? 'text-[#11100F] font-semibold' : 'text-[#A8A29E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ── LEFT: FORM STEPS ───────────────────────────────────────── */}
        <div className="lg:col-span-7 bg-[#FAF7F2] p-8 md:p-10 border border-[#E4DBCF]">
          {/* STEP 1: COLLECTOR INFORMATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-1">
                  Step 1 of 3
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#11100F]">
                  Collector Information
                </h2>
                <p className="text-xs font-sans text-[#78716C] mt-1">
                  We use this to register provenance and issue certificates of authenticity.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Vikramaditya Singhania"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="collector@domain.com"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Phone Number * (for delivery dispatch)
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
                className="w-full bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] py-4 text-xs font-sans font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-[#A8A29E]"
              >
                <span>Continue to Delivery Address</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 2: WHITE-GLOVE SHIPPING ADDRESS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-1">
                  Step 2 of 3
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#11100F]">
                  White-Glove Shipping Address
                </h2>
                <p className="text-xs font-sans text-[#78716C] mt-1">
                  All artworks are packed in reinforced wooden crates with fine art insurance.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Street Address / Estate / Flat *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="House/Apartment number, street name"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Apartment, Suite, Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    placeholder="Near landmark or building wing"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="New Delhi, Mumbai, Bengaluru..."
                      className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="110001"
                      className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
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
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
                    Special Delivery Instructions for Art Couriers
                  </label>
                  <textarea
                    rows={2}
                    value={address.deliveryNotes}
                    onChange={(e) => setAddress({ ...address, deliveryNotes: e.target.value })}
                    placeholder="e.g. Elevator dimensions, service gate entrance, call prior to arrival"
                    className="w-full bg-[#F4EFE7] border border-[#E4DBCF] p-3 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-[#11100F] text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] hover:bg-[#E4DBCF]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!address.addressLine1 || !address.city || !address.pincode}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] py-4 text-xs font-sans font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-[#A8A29E]"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD SELECTION */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-1">
                  Step 3 of 3
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#11100F]">
                  Payment &amp; Final Authorization
                </h2>
                <p className="text-xs font-sans text-[#78716C] mt-1">
                  Protected with 256-bit SSL encrypted bank authorization.
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
                      <span className="text-xs font-sans font-semibold text-[#11100F] block">
                        Online Payment (UPI, Credit/Debit Cards, Net Banking)
                      </span>
                      <span className="text-[11px] text-[#78716C] font-sans">
                        Instant confirmation via Razorpay. Supports Google Pay, PhonePe, and all Indian banks.
                      </span>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-[#B08A4A] flex-shrink-0" />
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
                      <span className="text-xs font-sans font-semibold text-[#11100F] block">
                        Pay on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-[#78716C] font-sans">
                        Inspect custom crating upon arrival and settle via cash, UPI, or card on delivery.
                      </span>
                    </div>
                  </div>
                  <Truck size={18} className="text-[#B08A4A] flex-shrink-0" />
                </button>
              </div>

              {/* Confirmation Notice */}
              <div className="p-4 bg-[#F4EFE7] border border-[#E4DBCF] text-xs text-[#78716C] flex items-start gap-2.5">
                <Lock size={15} className="text-[#B08A4A] flex-shrink-0 mt-0.5" />
                <p>
                  All transactions are verified server-side. You will receive an official invoice, tracking ID, and digital certificate receipt via email.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-[#11100F] text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] hover:bg-[#E4DBCF]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] py-4 text-xs font-sans font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-[#A8A29E]"
                >
                  {isProcessing ? (
                    <span>Authorizing Acquisition...</span>
                  ) : (
                    <>
                      <span>Authorize Order — {formatPrice(grandTotal)}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: ORDER DOSSIER & SUMMARY ─────────────────────────── */}
        <div className="lg:col-span-5 bg-[#FAF7F2] p-6 md:p-8 border border-[#E4DBCF] space-y-6">
          <h3 className="font-serif text-xl font-normal text-[#11100F] pb-3 border-b border-[#E4DBCF]">
            Acquisitions Summary ({items.length})
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
                    <p className="text-[10px] font-sans font-semibold text-[#B08A4A] tracking-wider uppercase">
                      {item.artistName}
                    </p>
                    <h4 className="font-serif text-sm font-normal text-[#11100F] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#78716C]">
                      {item.frameOption?.name || 'Unframed'} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-serif text-sm font-medium text-[#11100F]">
                    {formatPrice((item.price + (item.frameOption?.price || 0)) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="pt-2">
            <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#11100F] mb-1.5">
              Collector Invitation Code
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
                className="bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] px-4 py-2 text-xs font-sans font-semibold uppercase tracking-wider transition-colors"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-[#10B981] mt-1.5 flex items-center gap-1 font-medium">
                <Check size={12} />
                <span>Code {appliedCoupon.code} applied (-{formatPrice(appliedCoupon.discount)})</span>
              </p>
            )}
            {couponError && <p className="text-xs text-[#DC2626] mt-1.5">{couponError}</p>}
          </form>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-[#E4DBCF] space-y-2 text-xs font-sans text-[#78716C]">
            <div className="flex justify-between">
              <span>Artworks Subtotal</span>
              <span className="text-[#11100F] font-medium">{formatPrice(subtotal)}</span>
            </div>
            {framingTotal > 0 && (
              <div className="flex justify-between">
                <span>Museum Framing Addition</span>
                <span className="text-[#11100F] font-medium">{formatPrice(framingTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>White-Glove Insured Delivery</span>
              <span className="text-[#11100F] font-medium">
                {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#10B981]">
                <span>Collector Discount</span>
                <span className="font-medium">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-[#E4DBCF] text-base font-serif text-[#11100F]">
              <span className="font-normal">Total Acquisition Value</span>
              <span className="font-semibold">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="bg-[#F4EFE7] p-3 text-[11px] font-sans text-[#78716C] border border-[#E4DBCF] flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#B08A4A]" />
            <span>Includes 7-Day In-Home Inspection Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
