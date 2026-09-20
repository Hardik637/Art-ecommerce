export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 499;

/**
 * Authoritative Single Source of Truth for Shipping Calculations
 * Used across:
 * - Cart Drawer
 * - Checkout UI
 * - Server-Side Order Creation (/api/checkout)
 */
export function calculateShipping(subtotalWithFraming: number): number {
  if (subtotalWithFraming <= 0) {
    return 0;
  }
  return subtotalWithFraming >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}
