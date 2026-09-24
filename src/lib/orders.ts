import { Order } from '@/types/art';

// Local development fallback memory store with rich sample orders across all 4 workflow buckets
export const localDevOrdersStore: Order[] = [
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
 * Returns all sample / in-memory orders (safe for client and server rendering).
 */
export function getAllOrders(): Order[] {
  return [...localDevOrdersStore];
}

/**
 * Client-safe order lookup by ID or order number.
 * When in browser, tries live endpoint `/api/orders/:id` before falling back to local samples.
 */
export async function getOrderById(idOrOrderNumber: string): Promise<Order | null> {
  const query = idOrOrderNumber.trim();
  if (!query) return null;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.order) return data.order;
      }
    } catch {
      // fallback to local dev store
    }
  }

  const local = localDevOrdersStore.find(
    (o) =>
      o.id.toLowerCase() === query.toLowerCase() ||
      o.orderNumber.toLowerCase() === query.toLowerCase() ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === query.toLowerCase())
  );
  return local || null;
}
