import { Order, OrderStatus, PaymentStatus } from '@/types/art';
import { getAdminFirestore } from './admin';

const ORDERS_COLLECTION = 'orders';

/**
 * Persist an order to Firebase Firestore
 */
export async function saveFirebaseOrder(order: Order): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    const docRef = db.collection(ORDERS_COLLECTION).doc(order.id);
    await docRef.set({
      ...order,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('[Firebase Orders] Error saving order:', err);
    return false;
  }
}

/**
 * Fetch a single order by ID or orderNumber from Firestore
 */
export async function getFirebaseOrderById(orderId: string): Promise<Order | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  try {
    // Try by document ID first
    const docRef = db.collection(ORDERS_COLLECTION).doc(orderId);
    const snap = await docRef.get();
    if (snap.exists) {
      return snap.data() as Order;
    }

    // Try by orderNumber query
    const querySnap = await db
      .collection(ORDERS_COLLECTION)
      .where('orderNumber', '==', orderId)
      .limit(1)
      .get();

    if (!querySnap.empty) {
      return querySnap.docs[0].data() as Order;
    }

    return null;
  } catch (err) {
    console.error('[Firebase Orders] Error fetching order by id:', err);
    return null;
  }
}

/**
 * Fetch all orders from Firestore, ordered by createdAt descending
 */
export async function getAllFirebaseOrders(): Promise<Order[]> {
  const db = getAdminFirestore();
  if (!db) return [];

  try {
    const querySnap = await db
      .collection(ORDERS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();

    return querySnap.docs.map((doc) => doc.data() as Order);
  } catch (err) {
    console.error('[Firebase Orders] Error fetching all orders:', err);
    return [];
  }
}

/**
 * Fetch orders for a specific customer email
 */
export async function getFirebaseOrdersByCustomerEmail(email: string): Promise<Order[]> {
  const db = getAdminFirestore();
  if (!db) return [];

  try {
    const querySnap = await db
      .collection(ORDERS_COLLECTION)
      .where('customer.email', '==', email.toLowerCase().trim())
      .orderBy('createdAt', 'desc')
      .get();

    return querySnap.docs.map((doc) => doc.data() as Order);
  } catch (err) {
    console.error('[Firebase Orders] Error fetching orders by email:', err);
    return [];
  }
}

/**
 * Update fulfillment/order status
 */
export async function updateFirebaseOrderStatus(
  orderId: string,
  fulfillmentStatus: OrderStatus,
  extra: { trackingNumber?: string; courierName?: string } = {}
): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    const docRef = db.collection(ORDERS_COLLECTION).doc(orderId);
    await docRef.update({
      fulfillmentStatus,
      ...extra,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('[Firebase Orders] Error updating order status:', err);
    return false;
  }
}

/**
 * Update payment status
 */
export async function updateFirebaseOrderPayment(
  orderId: string,
  paymentStatus: PaymentStatus,
  razorpayPaymentId?: string
): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    const docRef = db.collection(ORDERS_COLLECTION).doc(orderId);
    const updatePayload: Record<string, any> = {
      paymentStatus,
      updatedAt: new Date().toISOString(),
    };
    if (razorpayPaymentId) {
      updatePayload.razorpayPaymentId = razorpayPaymentId;
    }
    await docRef.update(updatePayload);
    return true;
  } catch (err) {
    console.error('[Firebase Orders] Error updating order payment:', err);
    return false;
  }
}
