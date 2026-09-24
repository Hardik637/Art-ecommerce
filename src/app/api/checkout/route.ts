import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getProductById } from '@/lib/products';
import { STANDARD_FRAME_OPTIONS } from '@/lib/artCatalog';
import { saveOrder } from '@/lib/orders.server';
import { calculateShipping } from '@/lib/shipping';
import { validateCoupon } from '@/lib/coupons';
import { Order, OrderItem } from '@/types/art';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, shippingAddress, paymentMethod, couponCode, userId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Shopping cart cannot be empty.' },
        { status: 400 }
      );
    }

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: 'Complete customer contact information is required.' },
        { status: 400 }
      );
    }

    if (!shippingAddress?.addressLine1 || !shippingAddress?.city || !shippingAddress?.pincode) {
      return NextResponse.json(
        { error: 'Complete shipping address is required.' },
        { status: 400 }
      );
    }

    // ── Server-Side Authoritative Product, Price & Stock Validation ─────
    let validatedSubtotal = 0;
    let validatedFramingTotal = 0;
    const validatedOrderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.productId}" is no longer available in catalog.` },
          { status: 400 }
        );
      }

      // Stock check
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
          },
          { status: 400 }
        );
      }

      // Framing validation
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

      const itemTotal = product.price * item.quantity;
      validatedSubtotal += itemTotal;

      const dim = product.dimensions;
      const dimStr = `${dim.width} × ${dim.height} ${dim.unit || 'cm'}`;

      validatedOrderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        productId: product.id,
        name: product.name,
        artistName: product.artistName || 'Studio',
        image: product.thumbnail || product.images[0] || '',
        price: product.price,
        frame: frameObj,
        medium: product.medium,
        dimensions: dimStr,
        quantity: item.quantity,
      });
    }

    // ── Authoritative Shipping Calculation ──────────────────────────────
    const shippingFee = calculateShipping(validatedSubtotal + validatedFramingTotal);

    // ── Authoritative Coupon Discount Calculation ───────────────────────
    let discount = 0;
    let validatedCouponCode: string | undefined = undefined;

    if (couponCode) {
      const couponResult = validateCoupon(couponCode, validatedSubtotal);
      if (couponResult.valid) {
        discount = couponResult.discount;
        validatedCouponCode = couponResult.code;
      }
    }

    const finalTotal = Math.max(0, validatedSubtotal + validatedFramingTotal + shippingFee - discount);
    const orderNumber = `ATH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // ── Prepare Order Record ────────────────────────────────────────────
    const orderRecord: Order = {
      id: orderId,
      orderNumber,
      userId: userId || undefined,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
      },
      items: validatedOrderItems,
      shippingAddress: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        addressLine2: (shippingAddress.addressLine2 || '').trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state || 'Delhi',
        pincode: shippingAddress.pincode.trim(),
        country: shippingAddress.country || 'India',
        deliveryNotes: (shippingAddress.deliveryNotes || '').trim(),
      },
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
      paymentStatus: 'pending',
      fulfillmentStatus: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      subtotal: validatedSubtotal,
      framingTotal: validatedFramingTotal,
      shippingFee,
      discount,
      couponCode: validatedCouponCode,
      total: finalTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ── Cash On Delivery Path ───────────────────────────────────────────
    if (paymentMethod === 'cod') {
      await saveOrder(orderRecord);

      return NextResponse.json({
        success: true,
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        total: finalTotal,
        paymentMethod: 'cod',
      });
    }

    // ── Razorpay Online Payment Gateway Path ────────────────────────────
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Strict validation: Reject checkout if Razorpay credentials are not configured in production
    const isConfigured = Boolean(
      keyId &&
      keySecret &&
      !keyId.includes('your_key') &&
      !keySecret.includes('your_razorpay_secret')
    );

    if (!isConfigured) {
      return NextResponse.json(
        {
          error:
            'Razorpay payment gateway is not configured on this server. Please choose Cash on Delivery or contact store support.',
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId!,
      key_secret: keySecret!,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100), // amount in paise
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        customerEmail: customer.email,
      },
    });

    orderRecord.razorpayOrderId = rzpOrder.id;
    await saveOrder(orderRecord);

    return NextResponse.json({
      success: true,
      orderId: orderRecord.id,
      orderNumber: orderRecord.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: Math.round(finalTotal * 100),
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
      orderSummary: {
        subtotal: validatedSubtotal,
        framingTotal: validatedFramingTotal,
        shippingFee,
        discount,
        total: finalTotal,
      },
    });
  } catch (error: any) {
    console.error('[Checkout API] Error preparing order:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during order preparation.' },
      { status: 500 }
    );
  }
}
