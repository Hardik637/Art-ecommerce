import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * Zorodoor Store Owner Admin Authentication & Cryptographic Utilities
 *
 * Security guarantees:
 * - Constant-time comparison via crypto.timingSafeEqual against timing attacks
 * - PBKDF2 key derivation with 100,000 iterations and cryptographic salt
 * - HMAC-SHA256 cryptographically signed session tokens
 * - HttpOnly, Secure, SameSite=Strict session cookie to prevent XSS/CSRF
 * - Server-only execution: no secrets or password hashes are ever leaked to the client
 */

const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Default credentials - override in .env.local with ADMIN_USERNAME and ADMIN_PASSWORD
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ZorodoorAdmin@2026!#';

// Server-side HMAC secret for signing tokens
const ADMIN_SECRET =
  process.env.ADMIN_SECRET ||
  process.env.ADMIN_SESSION_SECRET ||
  'zorodoor_master_admin_secret_key_8941729384719283749182374918273';

/**
 * Generate a salted PBKDF2 hash of a password.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verify a plaintext password against a stored salted PBKDF2 hash using constant-time comparison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, key] = parts;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
  } catch (err) {
    console.error('[Admin Auth] Error verifying password:', err);
    return false;
  }
}

/**
 * Timing-safe string comparison to protect against side-channel timing attacks.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Hash both to equalize lengths before constant-time compare to avoid length leakage
      const hashA = crypto.createHash('sha256').update(bufA).digest();
      const hashB = crypto.createHash('sha256').update(bufB).digest();
      return crypto.timingSafeEqual(hashA, hashB) && false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export interface SessionPayload {
  username: string;
  role: 'super_admin';
  iat: number;
  exp: number;
}

/**
 * Sign an HMAC-SHA256 session token.
 */
export function createSessionToken(username: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    username,
    role: 'super_admin',
    iat: now,
    exp: now + SESSION_EXPIRY_SECONDS,
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadEncoded)
    .digest('base64url');

  return `${payloadEncoded}.${signature}`;
}

/**
 * Verify an HMAC-SHA256 session token.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadEncoded, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(payloadEncoded)
      .digest('base64url');

    // Constant-time compare signature
    if (!timingSafeCompare(signature, expectedSignature)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadEncoded, 'base64url').toString('utf8')
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Validate incoming login credentials against configured admin environment variables.
 */
export function validateAdminCredentials(usernameAttempt: string, passwordAttempt: string): boolean {
  const configuredUsername = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  // 1. Verify username in constant time
  const usernameMatch = timingSafeCompare(usernameAttempt.trim(), configuredUsername.trim());
  if (!usernameMatch) {
    return false;
  }

  // 2. Verify password: If ADMIN_PASSWORD_HASH is set, verify via PBKDF2 hash.
  if (configuredHash && configuredHash.includes(':')) {
    return verifyPassword(passwordAttempt, configuredHash);
  }

  // Otherwise, verify configured plaintext password using constant-time comparison
  return timingSafeCompare(passwordAttempt, configuredPassword);
}

/**
 * Server-side session verification helper for App Router Server Components & API routes.
 */
export async function getAdminSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export { ADMIN_COOKIE_NAME, SESSION_EXPIRY_SECONDS };
