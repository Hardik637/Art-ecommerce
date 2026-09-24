import { Order, OrderItem } from '@/types/art';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import {
  isFirebaseAdminConfigured,
  saveFirebaseOrder,
  getFirebaseOrderById as getFirebaseOrderByIdAdmin,
  getAllFirebaseOrders,
  getFirebaseOrdersByCustomerEmail,
  updateFirebaseOrderStatus,
  updateFirebaseOrderPayment,
} from '@/lib/firebase/server';
import { localDevOrdersStore } from './orders';

/**
 * Persists an order and its item snapshots to Firebase Firestore, Supabase, and in-memory fallback.
 */
export async function saveOrder(order: Order): Promise<Order> {
  // 1. Persist to Firebase Firestore if configured
  if (isFirebaseAdminConfigured()) {
    try {
      await saveFirebaseOrder(order);
    } catch (err) {
      console.error('[Orders Service] Error saving order to Firebase:', err);
    }
  }

  // 2. Persist to Supabase if configured
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { error: orderError } = await admin.from('orders').insert({
          id: order.id,
          order_number: order.orderNumber,
          user_id: order.userId || null,
          customer_name: order.customer.fullName,
          customer_email: order.customer.email,
          customer_phone: order.customer.phone,
          shipping_address: order.shippingAddress,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          fulfillment_status: order.fulfillmentStatus,
          razorpay_order_id: order.razorpayOrderId || null,
          razorpay_payment_id: order.razorpayPaymentId || null,
          subtotal: order.subtotal,
          framing_total: order.framingTotal,
          shipping_fee: order.shippingFee,
          discount: order.discount,
          coupon_code: order.couponCode || null,
          total: order.total,
          created_at: order.createdAt,
          updated_at: order.updatedAt,
        });

        if (orderError) {
          console.error('[Orders Service] Error saving order to Supabase:', orderError);
        } else {
          const itemsPayload = order.items.map((item) => ({
            id: item.id,
            order_id: order.id,
            product_id: item.productId,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            frame_option: item.frame || null,
            medium: item.medium,
            dimensions: item.dimensions,
          }));

          const { error: itemsError } = await admin.from('order_items').insert(itemsPayload);
          if (itemsError) {
            console.error('[Orders Service] Error saving order items to Supabase:', itemsError);
          }
        }
      }
    } catch (err) {
      console.error('[Orders Service] Exception persisting order to Supabase:', err);
    }
  }

  // Also maintain local fallback store
  localDevOrdersStore.unshift(order);
  return order;
}

/**
 * Retrieves an order by ID or order number from Firebase, Supabase, or in-memory fallback.
 */
export async function getOrderById(idOrOrderNumber: string): Promise<Order | null> {
  // 1. Check Firebase Firestore
  if (isFirebaseAdminConfigured()) {
    try {
      const fbOrder = await getFirebaseOrderByIdAdmin(idOrOrderNumber);
      if (fbOrder) return fbOrder;
    } catch (err) {
      console.error('[Orders Service] Error fetching order from Firebase:', err);
    }
  }

  // 2. Check Supabase
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { data: orderRow, error } = await admin
          .from('orders')
          .select('*, order_items(*)')
          .or(`id.eq.${idOrOrderNumber},order_number.eq.${idOrOrderNumber}`)
          .single();

        if (!error && orderRow) {
          return mapSupabaseOrderToOrder(orderRow);
        }
      }
    } catch (err) {
      console.error('[Orders Service] Error fetching order from Supabase:', err);
    }
  }

  const local = localDevOrdersStore.find(
    (o) => o.id === idOrOrderNumber || o.orderNumber === idOrOrderNumber
  );
  return local || null;
}

/**
 * Retrieves all orders for the store owner admin panel.
 */
export async function fetchAllAdminOrders(): Promise<Order[]> {
  // 1. Check Firebase Firestore
  if (isFirebaseAdminConfigured()) {
    try {
      const fbOrders = await getAllFirebaseOrders();
      if (fbOrders.length > 0) return fbOrders;
    } catch (err) {
      console.error('[Orders Service] Error fetching all orders from Firebase:', err);
    }
  }

  // 2. Check Supabase
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { data, error } = await admin
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapSupabaseOrderToOrder);
        }
      }
    } catch (err) {
      console.error('[Orders Service] Error fetching all orders from Supabase:', err);
    }
  }

  return [...localDevOrdersStore];
}

/**
 * Updates an order's fulfillment status, courier, and tracking waybill.
 */
export async function updateOrderStatus(
  orderId: string,
  fulfillmentStatus: Order['fulfillmentStatus'],
  trackingNumber?: string,
  courierName?: string
): Promise<Order | null> {
  // 1. Update in Firebase Firestore
  if (isFirebaseAdminConfigured()) {
    try {
      await updateFirebaseOrderStatus(orderId, fulfillmentStatus, { trackingNumber, courierName });
    } catch (err) {
      console.error('[Orders Service] Error updating order status in Firebase:', err);
    }
  }

  // 2. Update in Supabase
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const updatePayload: Record<string, any> = {
          fulfillment_status: fulfillmentStatus,
          updated_at: new Date().toISOString(),
        };
        if (trackingNumber) updatePayload.tracking_number = trackingNumber;
        if (courierName) updatePayload.courier_name = courierName;

        await admin
          .from('orders')
          .update(updatePayload)
          .or(`id.eq.${orderId},order_number.eq.${orderId}`);
      }
    } catch (err) {
      console.error('[Orders Service] Supabase status update exception:', err);
    }
  }

  const order = localDevOrdersStore.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.fulfillmentStatus = fulfillmentStatus;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (courierName !== undefined) order.courierName = courierName;
  order.updatedAt = new Date().toISOString();
  return { ...order };
}

/**
 * Cancels an order.
 */
export async function cancelOrder(orderId: string, cancelReason?: string): Promise<Order | null> {
  // 1. Cancel in Firebase
  if (isFirebaseAdminConfigured()) {
    try {
      await updateFirebaseOrderStatus(orderId, 'cancelled');
      await updateFirebaseOrderPayment(orderId, 'refunded');
    } catch (err) {
      console.error('[Orders Service] Error canceling order in Firebase:', err);
    }
  }

  // 2. Cancel in Supabase
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        await admin
          .from('orders')
          .update({
            fulfillment_status: 'cancelled',
            payment_status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .or(`id.eq.${orderId},order_number.eq.${orderId}`);
      }
    } catch (err) {
      console.error('[Orders Service] Error canceling order in Supabase:', err);
    }
  }

  const order = localDevOrdersStore.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.fulfillmentStatus = 'cancelled';
  order.paymentStatus = 'refunded';
  order.updatedAt = new Date().toISOString();
  if (cancelReason && order.shippingAddress) {
    order.shippingAddress.deliveryNotes = `Cancelled: ${cancelReason}. Previous notes: ${order.shippingAddress.deliveryNotes || 'None'}`;
  }
  return { ...order };
}

/**
 * Updates an order's payment and fulfillment status upon verified webhook.
 */
export async function updateOrderPaymentSuccess(
  orderId: string,
  razorpayPaymentId: string
): Promise<boolean> {
  // 1. Update Firebase
  if (isFirebaseAdminConfigured()) {
    try {
      await updateFirebaseOrderPayment(orderId, 'paid', razorpayPaymentId);
      await updateFirebaseOrderStatus(orderId, 'confirmed');
    } catch (err) {
      console.error('[Orders Service] Error updating order payment in Firebase:', err);
    }
  }

  // 2. Update Supabase
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { error } = await admin
          .from('orders')
          .update({
            payment_status: 'paid',
            fulfillment_status: 'confirmed',
            razorpay_payment_id: razorpayPaymentId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (!error) return true;
      }
    } catch (err) {
      console.error('[Orders Service] Error updating order payment in Supabase:', err);
    }
  }

  const local = localDevOrdersStore.find((o) => o.id === orderId);
  if (local) {
    local.paymentStatus = 'paid';
    local.fulfillmentStatus = 'confirmed';
    local.razorpayPaymentId = razorpayPaymentId;
    local.updatedAt = new Date().toISOString();
    return true;
  }

  return false;
}

/**
 * Fetch orders for a specific customer email
 */
export async function getCustomerOrders(email: string): Promise<Order[]> {
  if (isFirebaseAdminConfigured()) {
    try {
      const fbOrders = await getFirebaseOrdersByCustomerEmail(email);
      if (fbOrders.length > 0) return fbOrders;
    } catch (err) {
      console.error('[Orders Service] Error fetching customer orders from Firebase:', err);
    }
  }

  return localDevOrdersStore.filter(
    (o) => o.customer.email.toLowerCase() === email.toLowerCase().trim()
  );
}

export async function decrementStock(productId: string, quantity: number): Promise<boolean> {
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { data: prod } = await admin.from('products').select('stock').eq('id', productId).single();
        if (prod && prod.stock >= quantity) {
          await admin.from('products').update({ stock: prod.stock - quantity }).eq('id', productId);
          return true;
        }
      }
    } catch (err) {
      console.error('[Inventory] Error decrementing stock:', err);
    }
  }
  return true;
}

function mapSupabaseOrderToOrder(row: any): Order {
  const items: OrderItem[] = Array.isArray(row.order_items)
    ? row.order_items.map((i: any) => ({
        id: i.id,
        productId: i.product_id,
        name: i.product_name,
        artistName: '',
        image: i.image,
        price: Number(i.price),
        frame: i.frame_option,
        medium: i.medium || '',
        dimensions: i.dimensions || '',
        quantity: Number(i.quantity),
      }))
    : [];

  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    customer: {
      fullName: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
    },
    items,
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    trackingNumber: row.tracking_number,
    courierName: row.courier_name,
    subtotal: Number(row.subtotal),
    framingTotal: Number(row.framing_total || 0),
    shippingFee: Number(row.shipping_fee || 0),
    discount: Number(row.discount || 0),
    couponCode: row.coupon_code,
    total: Number(row.total),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
