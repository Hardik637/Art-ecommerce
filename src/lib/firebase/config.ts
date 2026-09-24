/**
 * Firebase Client & Admin Configuration
 * Provides type-safe validation and credential resolution for Firebase services.
 */

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getFirebaseClientConfig(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !projectId) {
    return null;
  }

  return {
    apiKey,
    authDomain: authDomain || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: storageBucket || `${projectId}.appspot.com`,
    messagingSenderId: messagingSenderId || '',
    appId: appId || '',
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseClientConfig();
  if (!config) return false;
  return (
    Boolean(config.apiKey && config.projectId) &&
    !config.apiKey.includes('your-api-key') &&
    !config.projectId.includes('your-project-id')
  );
}

export function isFirebaseAdminConfigured(): boolean {
  if (typeof window !== 'undefined') {
    return false;
  }
  // Check either full service account JSON or individual environment variables
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return Boolean(parsed.project_id && parsed.client_email && parsed.private_key);
    } catch {
      return false;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  return Boolean(
    projectId &&
    clientEmail &&
    privateKey &&
    !clientEmail.includes('your-service-account') &&
    !privateKey.includes('your-private-key')
  );
}
