import { Order, OrderItem } from '@/types/art';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

// Local development fallback memory store with rich sample orders across all 4 workflow buckets
const localDevOrdersStore: Order[] = [
  // Bucket 1: New / Placed Orders (When order anything)
  {
    id: 'ord-1004',
    orderNumber: 'ATH-2026-9045',
    customer: {
      fullName: 'Aarav Malhotra',
      email: 'aarav.malhotra@gmail.com',
      phone: '+91 98200 45678',
    },
    items: [
      {
        id: 'item-104',
        productId: 'art-03',
        name: 'Echoes of the Indus',
        artistName: 'Kabir Varma',
        image: '/artworks/painting-echoes-indus.svg',
        price: 42000,
        frame: {
          id: 'raw-natural-oak',
          name: 'Natural Raw White Oak Frame',
          price: 2200,
        },
        medium: 'Hand-Pigmented Natural Ink and Acrylic on Archival Cotton',
        dimensions: '100 × 120 cm',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Aarav Malhotra',
      email: 'aarav.malhotra@gmail.com',
      phone: '+91 98200 45678',
      addressLine1: 'Penthouse 14B, Oberoi Sky Heights',
      addressLine2: 'Lokhandwala Complex, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      country: 'India',
      deliveryNotes: 'Leave with concierge or ring bell 14B.',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    razorpayOrderId: 'order_rzp_aarav_9045',
    razorpayPaymentId: 'pay_rzp_live_9045',
    subtotal: 42000,
    framingTotal: 2200,
    shippingFee: 0,
    discount: 0,
    total: 44200,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'ord-1003',
    orderNumber: 'ATH-2026-9012',
    customer: {
      fullName: 'Pooja Singhania',
      email: 'pooja.s@singhaniagroup.in',
      phone: '+91 99301 98765',
    },
    items: [
      {
        id: 'item-103',
        productId: 'art-05',
        name: 'Vessel of Silence',
        artistName: 'Meera Nambiar',
        image: '/artworks/sculpture-vessel-silence.svg',
        price: 78000,
        medium: 'Lost-Wax Cast Bronze with Verdigris Patina',
        dimensions: '45 × 30 × 30 cm',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Pooja Singhania',
      email: 'pooja.s@singhaniagroup.in',
      phone: '+91 99301 98765',
      addressLine1: 'Villa 7, Palm Avenue, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      country: 'India',
      deliveryNotes: 'High-value sculpture, requires wooden crate handling.',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'in_framing',
    razorpayOrderId: 'order_rzp_pooja_9012',
    razorpayPaymentId: 'pay_rzp_live_9012',
    subtotal: 78000,
    framingTotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 78000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },

  // Bucket 2: Shipped Orders (In Transit)
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
        id: 'item-101',
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
      deliveryNotes: 'Please call before entering gate.',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    razorpayOrderId: 'order_mock_razorpay_01',
    razorpayPaymentId: 'pay_mock_payment_01',
    trackingNumber: 'BLUEDART-88902144',
    courierName: 'Blue Dart Art Special Express',
    subtotal: 34500,
    framingTotal: 2400,
    shippingFee: 0,
    discount: 0,
    total: 36900,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'ord-1002',
    orderNumber: 'ATH-2026-8874',
    customer: {
      fullName: 'Rohit Deshmukh',
      email: 'r.deshmukh@architects.in',
      phone: '+91 97690 11223',
    },
    items: [
      {
        id: 'item-102',
        productId: 'art-02',
        name: 'Terra Cotta Fragment No. 4',
        artistName: 'Ananya Sen',
        image: '/artworks/sculpture-geometric-terracotta.svg',
        price: 28000,
        medium: 'Terracotta and Smoked Ash',
        dimensions: '60 × 40 cm',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Rohit Deshmukh',
      email: 'r.deshmukh@architects.in',
      phone: '+91 97690 11223',
      addressLine1: '402, Sea Green Apartments, Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      country: 'India',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'out_for_delivery',
    razorpayOrderId: 'order_mock_razorpay_02',
    razorpayPaymentId: 'pay_mock_payment_02',
    trackingNumber: 'DELHIVERY-7740192',
    courierName: 'Delhivery Secure White Glove',
    subtotal: 28000,
    framingTotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 28000,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },

  // Bucket 3: Completed Orders (Delivered)
  {
    id: 'ord-1000',
    orderNumber: 'ATH-2026-8720',
    customer: {
      fullName: 'Sunita Mehra',
      email: 'sunitamehra@mehraart.com',
      phone: '+91 98110 54321',
    },
    items: [
      {
        id: 'item-100',
        productId: 'art-04',
        name: 'Golden Resonance',
        artistName: 'Devika Swamy',
        image: '/artworks/painting-gold-resonance.svg',
        price: 56000,
        frame: {
          id: 'antique-gold-leaf',
          name: 'Antique Gilt Gold Leaf Frame',
          price: 3200,
        },
        medium: '24K Gold Leaf and Mineral Tempera',
        dimensions: '140 × 100 cm',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Sunita Mehra',
      email: 'sunitamehra@mehraart.com',
      phone: '+91 98110 54321',
      addressLine1: '12, Koregaon Park Road 5',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      country: 'India',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    razorpayOrderId: 'order_mock_razorpay_00',
    razorpayPaymentId: 'pay_mock_payment_00',
    trackingNumber: 'BLUEDART-7651029',
    courierName: 'Blue Dart Art Special Express',
    subtotal: 56000,
    framingTotal: 3200,
    shippingFee: 0,
    discount: 0,
    total: 59200,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },

  // Bucket 4: Canceled Orders
  {
    id: 'ord-999',
    orderNumber: 'ATH-2026-8655',
    customer: {
      fullName: 'Kunal Kapoor',
      email: 'kunal.kapoor@outlook.com',
      phone: '+91 98450 67890',
    },
    items: [
      {
        id: 'item-99',
        productId: 'art-06',
        name: 'Shadows in Marble',
        artistName: 'Arjun Sen',
        image: '/artworks/sculpture-marble-shadows.svg',
        price: 38000,
        medium: 'Carved Makrana White Marble',
        dimensions: '50 × 25 × 25 cm',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Kunal Kapoor',
      email: 'kunal.kapoor@outlook.com',
      phone: '+91 98450 67890',
      addressLine1: 'Flat 801, Prestige Towers, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India',
      deliveryNotes: 'Order cancelled per customer request before dispatch.',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'refunded',
    fulfillmentStatus: 'cancelled',
    subtotal: 38000,
    framingTotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 38000,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
];

/**
 * Persists an order and its item snapshots to Supabase and in-memory store.
 */
export async function saveOrder(order: Order): Promise<Order> {
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
 * Retrieves an order by ID or order number.
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
 * Retrieves all orders for the store owner admin panel.
 */
export async function fetchAllAdminOrders(): Promise<Order[]> {
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

export function getAllOrders(): Order[] {
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
