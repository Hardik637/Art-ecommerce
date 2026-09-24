import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';
import { fetchAllAdminOrders, updateOrderStatus, cancelOrder } from '@/lib/orders.server';
import { Order } from '@/types/art';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await fetchAllAdminOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, action, status, trackingNumber, courierName, reason } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    if (action === 'cancel') {
      const updated = await cancelOrder(orderId, reason);
      if (!updated) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated });
    }

    if (status) {
      const updated = await updateOrderStatus(
        orderId,
        status as Order['fulfillmentStatus'],
        trackingNumber,
        courierName
      );
      if (!updated) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
  } catch (err: any) {
    console.error('[Admin Orders API] Update error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
