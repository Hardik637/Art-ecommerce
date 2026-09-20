export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discount: number;
  discountPercent?: number;
  error?: string;
}

export const ACTIVE_COUPONS: Record<string, { percent: number; minOrder?: number; label: string }> = {
  COLLECTOR10: {
    percent: 10,
    label: '10% Collector Welcome Privilege',
  },
  FIRSTACQUISITION: {
    percent: 15,
    label: '15% First Order Benefit',
  },
  CONNOISSEUR: {
    percent: 20,
    label: '20% Connoisseur VIP Privilege',
  },
};

/**
 * Server-authoritative coupon validation function.
 * Fixes the CONNOISSEUR bug and ensures discounts are never trusted from client inputs.
 */
export function validateCoupon(code: string, subtotal: number): CouponValidationResult {
  const cleanCode = (code || '').toUpperCase().trim();

  if (!cleanCode) {
    return {
      valid: false,
      code: '',
      discount: 0,
      error: 'Please enter a coupon code.',
    };
  }

  const coupon = ACTIVE_COUPONS[cleanCode];

  if (!coupon) {
    return {
      valid: false,
      code: cleanCode,
      discount: 0,
      error: 'Invalid or expired promotional code.',
    };
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      code: cleanCode,
      discount: 0,
      error: `Minimum order amount of ₹${coupon.minOrder} required for this coupon.`,
    };
  }

  const calculatedDiscount = Math.round((subtotal * coupon.percent) / 100);

  return {
    valid: true,
    code: cleanCode,
    discount: calculatedDiscount,
    discountPercent: coupon.percent,
  };
}
