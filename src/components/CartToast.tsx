'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Check, X, ArrowRight } from 'lucide-react';

export default function CartToast() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const toast = useCartStore((state) => state.toast);
  const hideToast = useCartStore((state) => state.hideToast);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    if (!toast?.visible) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast?.visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto bg-black text-white px-4 py-3.5 border border-neutral-800 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        {toast.productImage ? (
          <div className="w-9 h-10 bg-neutral-900 border border-neutral-800 relative flex-shrink-0 overflow-hidden">
            <Image
              src={toast.productImage}
              alt=""
              fill
              className="object-contain p-0.5"
            />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
            <Check size={13} strokeWidth={2.5} />
          </div>
        )}

        <div className="min-w-0">
          <p className="text-xs font-sans font-bold uppercase tracking-wider text-white">
            {toast.message || 'Added to Cart'}
          </p>
          {toast.productName && (
            <p className="text-[11px] font-sans text-neutral-400 truncate max-w-[180px]">
              {toast.productName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 pl-2 border-l border-neutral-800">
        <button
          onClick={() => {
            hideToast();
            openCart();
          }}
          className="text-xs font-sans font-semibold uppercase tracking-wider text-white hover:text-neutral-300 underline underline-offset-4 flex items-center gap-1 transition-colors"
        >
          <span>View Cart</span>
          <ArrowRight size={12} />
        </button>

        <button
          onClick={hideToast}
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
