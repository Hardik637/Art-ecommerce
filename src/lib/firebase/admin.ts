import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import { isFirebaseAdminConfigured } from './config';

let adminApp: App | null = null;
let adminFirestore: Firestore | null = null;
let adminAuth: Auth | null = null;
let adminStorage: Storage | null = null;

export function getAdminApp(): App | null {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL: Firebase Admin SDK must never be initialized on the client side.');
  }

  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  if (!isFirebaseAdminConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Firebase Admin] Missing server-side credentials in environment (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY). Server will use in-memory and local fallbacks.'
      );
    }
    return null;
  }

  try {
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      credential = cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key?.replace(/\\n/g, '\n'),
      });
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey) {
        credential = cert({
          projectId,
          clientEmail,
          privateKey,
        });
      }
    }

    if (!credential) return null;

    const storageBucket =
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      `${process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`;

    adminApp = initializeApp({
      credential,
      storageBucket,
    });

    return adminApp;
  } catch (err) {
    console.error('[Firebase Admin] Initialization failed:', err);
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  if (adminFirestore) return adminFirestore;
  const app = getAdminApp();
  if (!app) return null;
  try {
    adminFirestore = getFirestore(app);
    return adminFirestore;
  } catch (err) {
    console.error('[Firebase Admin] Firestore initialization error:', err);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  if (adminAuth) return adminAuth;
  const app = getAdminApp();
  if (!app) return null;
  try {
    adminAuth = getAuth(app);
    return adminAuth;
  } catch (err) {
    console.error('[Firebase Admin] Auth initialization error:', err);
    return null;
  }
}

export function getAdminStorage(): Storage | null {
  if (adminStorage) return adminStorage;
  const app = getAdminApp();
  if (!app) return null;
  try {
    adminStorage = getStorage(app);
    return adminStorage;
  } catch (err) {
    console.error('[Firebase Admin] Storage initialization error:', err);
    return null;
  }
}
