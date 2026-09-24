import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirebaseClientConfig, isFirebaseConfigured } from './config';

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;
let clientDb: Firestore | null = null;
let clientStorage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    // Prevent client SDK instantiation on server SSR pass if not needed
    return null;
  }

  if (clientApp) return clientApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    clientApp = existingApps[0];
    return clientApp;
  }

  const config = getFirebaseClientConfig();
  if (!config || !isFirebaseConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Firebase Client] Firebase credentials are not configured in environment. Operating in local fallback mode.'
      );
    }
    return null;
  }

  try {
    clientApp = initializeApp(config);
    return clientApp;
  } catch (err) {
    console.error('[Firebase Client] Initialization error:', err);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (clientAuth) return clientAuth;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    clientAuth = getAuth(app);
    return clientAuth;
  } catch {
    return null;
  }
}

export function getFirebaseDb(): Firestore | null {
  if (clientDb) return clientDb;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    clientDb = getFirestore(app);
    return clientDb;
  } catch {
    return null;
  }
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (clientStorage) return clientStorage;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    clientStorage = getStorage(app);
    return clientStorage;
  } catch {
    return null;
  }
}
