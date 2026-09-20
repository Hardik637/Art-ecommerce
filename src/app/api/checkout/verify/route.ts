import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrderById, updateOrderPaymentSuccess, decrementStock } from '@/lib/orders';

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('[Payment Verification] RAZORPAY_KEY_SECRET is not configured.');
      return NextResponse.json(
        { error: 'Server payment configuration error: Razorpay secret is missing' },
        { status: 500 }
      );
    }

    // 1. Verify HMAC SHA-256 signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.warn('[Payment Verification] Signature mismatch:', {
        expected: generatedSignature,
        received: razorpaySignature,
      });
      return NextResponse.json(
        { error: 'Payment signature verification failed. Invalid signature.' },
        { status: 400 }
      );
    }

    // 2. Authoritative order lookup
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: `Order ${orderId} not found in database` },
        { status: 404 }
      );
    }

    // 3. Verify order-payment relationship
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json(
        { error: 'Razorpay order mismatch with internal order record' },
        { status: 400 }
      );
    }

    // 4. Mark order paid in Supabase / order database
    await updateOrderPaymentSuccess(order.id, razorpayPaymentId);

    // 5. Decrement inventory safely for each purchased product
    for (const item of order.items) {
      if (item.productId) {
        await decrementStock(item.productId, item.quantity);
      }
    }

    return NextResponse.json({
      verified: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      message: 'Payment verified and order confirmed successfully',
    });
  } catch (error: any) {
    console.error('[Payment Verification Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Server error during payment verification' },
      { status: 500 }
    );
  }
}

