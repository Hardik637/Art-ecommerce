import { Order } from '@/types/art';

// In-memory fallback order store for demo / local development
const ordersDatabase: Order[] = [
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
      deliveryNotes: 'Please call security before entering the gate.',
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
  {
    id: 'ord-1002',
    orderNumber: 'ATH-2026-8942',
    customer: {
      fullName: 'Meenakshi Sundaram',
      email: 'meenakshi@example.com',
      phone: '+91 94440 98765',
    },
    items: [
      {
        id: 'item-2',
        productId: 'art-19',
        name: 'The Motion of Stillness',
        artistName: 'Tara Deshmukh',
        image: '/artworks/sculpture-bronze-dancer.svg',
        price: 45000,
        medium: 'Lost-Wax Cast Bronze with Verdigris Patina',
        dimensions: '32 × 68 × 28 cm',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Meenakshi Sundaram',
      email: 'meenakshi@example.com',
      phone: '+91 94440 98765',
      addressLine1: '12 Boat Club Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600028',
      country: 'India',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    trackingNumber: 'ATH-IN-992104',
    courierName: 'Sequel Secure Logistics (Fine Art)',
    subtotal: 45000,
    framingTotal: 0,
    shippingFee: 0,
    discount: 4500,
    couponCode: 'COLLECTOR10',
    total: 40500,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export function getAllOrders(): Order[] {
  return ordersDatabase;
}

export function getOrderById(id: string): Order | undefined {
  return ordersDatabase.find((o) => o.id === id || o.orderNumber === id);
}

export function saveOrder(order: Order): Order {
  ordersDatabase.unshift(order);
  return order;
}

export function updateOrderStatus(
  orderId: string,
  fulfillmentStatus: Order['fulfillmentStatus'],
  trackingNumber?: string,
  courierName?: string
): Order | null {
  const order = ordersDatabase.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;
  order.fulfillmentStatus = fulfillmentStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierName) order.courierName = courierName;
  order.updatedAt = new Date().toISOString();
  return order;
}
