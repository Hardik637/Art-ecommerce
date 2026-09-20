import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = body.code || body.couponCode || '';
    const subtotal = Number(body.subtotal);

    if (isNaN(subtotal) || subtotal < 0) {
      return NextResponse.json(
        { valid: false, error: 'Valid order subtotal is required for coupon calculation.' },
        { status: 400 }
      );
    }

    const result = validateCoupon(code, subtotal);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error || 'Invalid promotional code.' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Coupon validation endpoint error:', err);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon code.' },
      { status: 500 }
    );
  }
}
