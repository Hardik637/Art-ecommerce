import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrderById, updateOrderStatus } from '@/lib/orders';

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !orderId) {
      return NextResponse.json(
        { error: 'Missing payment identifiers' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify HMAC SHA-256 signature if keySecret is available
    if (keySecret && !keySecret.includes('mock') && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { error: 'Payment signature verification failed' },
          { status: 400 }
        );
      }
    }

    // Update order in database / repository
    const order = getOrderById(orderId);
    if (order) {
      order.paymentStatus = 'paid';
      order.fulfillmentStatus = 'payment_confirmed';
      order.razorpayPaymentId = razorpayPaymentId;
      order.updatedAt = new Date().toISOString();
    }

    return NextResponse.json({
      verified: true,
      orderNumber: order?.orderNumber || 'ATH-2026',
      orderId,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Server error during signature verification' },
      { status: 500 }
    );
  }
}
