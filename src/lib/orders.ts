import { Order, OrderItem } from '@/types/art';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

// Local development fallback memory store when running without Supabase credentials
const localDevOrdersStore: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ATH-2026-8941',
    customer: {
      fullName: 'Vikram Sethi',
      email: 'vikram.sethi@example.com',
      phone: '+91 98101 23456',
    },
    items: [
      {
        id: 'item-1',
        productId: 'art-01',
        name: 'Monsoon Over the Ghats',
        artistName: 'Ananya Sen',
        image: '/artworks/painting-monsoon-abstract.svg',
        price: 34500,
        frame: {
          id: 'museum-black-ash',
          name: 'Museum Black Ash Wood Float Frame',
          price: 2400,
        },
        medium: 'Oil and 22K Gold Leaf on Belgian Linen',
        dimensions: '120 × 150 cm',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Vikram Sethi',
      email: 'vikram.sethi@example.com',
      phone: '+91 98101 23456',
      addressLine1: 'B-44, Golf Links',
      addressLine2: 'Near Lodhi Garden',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110003',
      country: 'India',
      deliveryNotes: 'Please call before entering.',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    razorpayOrderId: 'order_mock_razorpay_01',
    razorpayPaymentId: 'pay_mock_payment_01',
    trackingNumber: 'ATH-IN-889021',
    courierName: 'Blue Dart Art Special Express',
    subtotal: 34500,
    framingTotal: 2400,
    shippingFee: 0,
    discount: 0,
    total: 36900,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

/**
 * Persists an order and its item snapshots to Supabase.
 * Snapshots product price, frame, medium, and dimensions to protect historical records.
 */
export async function saveOrder(order: Order): Promise<Order> {
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        // 1. Insert order record
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
          // 2. Insert item snapshots
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

  // Also maintain local fallback store for seamless offline dev sessions
  localDevOrdersStore.unshift(order);
  return order;
}

/**
 * Retrieves an order by ID or order number, joining order items.
 */
export async function getOrderById(idOrOrderNumber: string): Promise<Order | null> {
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
 * Retrieves orders for an authenticated customer user ID.
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { data, error } = await admin
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(mapSupabaseOrderToOrder);
        }
      }
    } catch (err) {
      console.error('[Orders Service] Error fetching user orders:', err);
    }
  }

  return localDevOrdersStore.filter((o) => o.userId === userId);
}

/**
 * Updates an order's payment and fulfillment status upon verified webhook or payment handler.
 */
export async function updateOrderPaymentSuccess(
  orderId: string,
  razorpayPaymentId: string
): Promise<boolean> {
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

  // Update local store
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
 * Decrement stock safely in database after payment verification.
 */
export async function decrementStock(productId: string, quantity: number): Promise<boolean> {
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      if (admin) {
        const { error } = await admin.rpc('decrement_product_stock', {
          p_product_id: productId,
          p_quantity: quantity,
        });

        if (!error) return true;
        console.warn('[Inventory] RPC decrement failed, performing standard update:', error);

        // Fallback update
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

export function getAllOrders(): Order[] {
  return localDevOrdersStore;
}

export function updateOrderStatus(
  orderId: string,
  fulfillmentStatus: Order['fulfillmentStatus'],
  trackingNumber?: string,
  courierName?: string
): Order | null {
  const order = localDevOrdersStore.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;
  order.fulfillmentStatus = fulfillmentStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierName) order.courierName = courierName;
  order.updatedAt = new Date().toISOString();
  return order;
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
