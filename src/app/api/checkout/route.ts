import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getArtworkById, STANDARD_FRAME_OPTIONS } from '@/lib/artCatalog';
import { saveOrder } from '@/lib/orders';
import { Order, OrderItem } from '@/types/art';
import { SITE_CONFIG } from '@/config/site';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, shippingAddress, paymentMethod, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Acquisitions list cannot be empty' }, { status: 400 });
    }

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return NextResponse.json({ error: 'Complete collector contact information is required' }, { status: 400 });
    }

    if (!shippingAddress?.addressLine1 || !shippingAddress?.city || !shippingAddress?.pincode) {
      return NextResponse.json({ error: 'Complete delivery address is required' }, { status: 400 });
    }

    // ── Server-Side Price & Framing Validation ──────────────────────────
    let validatedSubtotal = 0;
    let validatedFramingTotal = 0;
    const validatedOrderItems: OrderItem[] = [];

    for (const item of items) {
      const artwork = getArtworkById(item.productId);
      if (!artwork) {
        return NextResponse.json(
          { error: `Artwork with ID ${item.productId} is no longer in catalog` },
          { status: 400 }
        );
      }

      if (artwork.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for masterwork "${artwork.name}"` },
          { status: 400 }
        );
      }

      // Check framing
      let frameObj: { id: string; name: string; price: number } | undefined = undefined;
      if (item.frameOptionId && item.frameOptionId !== 'unframed') {
        const frame = STANDARD_FRAME_OPTIONS.find((f) => f.id === item.frameOptionId);
        if (frame) {
          frameObj = {
            id: frame.id,
            name: frame.name,
            price: frame.price,
          };
          validatedFramingTotal += frame.price * item.quantity;
        }
      }

      validatedSubtotal += artwork.price * item.quantity;

      validatedOrderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        productId: artwork.id,
        name: artwork.name,
        artistName: artwork.artistName,
        image: artwork.images[0] || artwork.thumbnail,
        price: artwork.price,
        frame: frameObj,
        medium: artwork.medium,
        dimensions: `${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}`,
        quantity: item.quantity,
      });
    }

    // Shipping calculation
    const shippingFee =
      validatedSubtotal + validatedFramingTotal >= SITE_CONFIG.freeShippingThreshold
        ? 0
        : 499;

    // Coupon discount calculation
    let discount = 0;
    const cleanCoupon = (couponCode || '').toUpperCase().trim();
    if (cleanCoupon === 'COLLECTOR10') {
      discount = Math.round(validatedSubtotal * 0.1);
    } else if (cleanCoupon === 'FIRSTACQUISITION') {
      discount = Math.round(validatedSubtotal * 0.15);
    } else if (cleanCoupon === 'CONNOISSEUR') {
      discount = Math.round(validatedSubtotal * 0.2);
    }

    const finalTotal = Math.max(0, validatedSubtotal + validatedFramingTotal + shippingFee - discount);
    const orderNumber = `ATH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;

    // Create Order Record
    const orderRecord: Order = {
      id: orderId,
      orderNumber,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
      items: validatedOrderItems,
      shippingAddress: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state || 'Delhi',
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India',
        deliveryNotes: shippingAddress.deliveryNotes || '',
      },
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
      paymentStatus: 'pending',
      fulfillmentStatus: 'payment_confirmed',
      subtotal: validatedSubtotal,
      framingTotal: validatedFramingTotal,
      shippingFee,
      discount,
      couponCode: discount > 0 ? cleanCoupon : undefined,
      total: finalTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If Cash on Delivery:
    if (paymentMethod === 'cod') {
      orderRecord.paymentStatus = 'pending';
      orderRecord.fulfillmentStatus = 'processing';
      saveOrder(orderRecord);

      return NextResponse.json({
        success: true,
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        total: finalTotal,
        paymentMethod: 'cod',
      });
    }

    // Razorpay Integration
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let razorpayOrderId = `order_mock_${Date.now()}`;

    if (keyId && keySecret && !keyId.includes('mock')) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(finalTotal * 100), // paise
          currency: 'INR',
          receipt: orderNumber,
        });

        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.warn('Live Razorpay initialization error, using simulated order:', rzpErr);
      }
    }

    orderRecord.razorpayOrderId = razorpayOrderId;
    saveOrder(orderRecord);

    return NextResponse.json({
      success: true,
      orderId: orderRecord.id,
      orderNumber: orderRecord.orderNumber,
      razorpayOrderId,
      amount: Math.round(finalTotal * 100),
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId || 'rzp_test_mock_key',
      orderSummary: {
        subtotal: validatedSubtotal,
        framingTotal: validatedFramingTotal,
        shippingFee,
        discount,
        total: finalTotal,
      },
    });
  } catch (error) {
    console.error('Checkout API Server Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during order preparation.' },
      { status: 500 }
    );
  }
}
