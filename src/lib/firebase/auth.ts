import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from './client';

export async function signInWithEmail(email: string, pass: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth is not configured.');
  return signInWithEmailAndPassword(auth, email, pass);
}

export async function signUpWithEmail(email: string, pass: string, displayName?: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth is not configured.');
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && cred.user) {
    await updateProfile(cred.user, { displayName });
  }
  return cred;
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth is not configured.');
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  const auth = getFirebaseAuth();
  if (!auth) return;
  return signOut(auth);
}

export async function sendUserPasswordReset(email: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth is not configured.');
  return sendPasswordResetEmail(auth, email);
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
