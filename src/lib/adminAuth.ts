import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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
 * - Persistent admin credentials file with PBKDF2 hashes (.admin_credentials.json)
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

const CREDENTIALS_FILE = path.join(process.cwd(), '.admin_credentials.json');

interface PersistedAdminCredentials {
  username: string;
  passwordHash: string; // salt:derivedKey
  updatedAt: string;
}

export function getPersistedCredentials(): PersistedAdminCredentials | null {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const content = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (data && typeof data.username === 'string' && typeof data.passwordHash === 'string') {
        return data;
      }
    }
  } catch (err) {
    console.error('[Admin Auth] Error reading persisted credentials:', err);
  }
  return null;
}

export function saveAdminCredentials(username: string, newPlaintextPassword: string): boolean {
  try {
    const passwordHash = hashPassword(newPlaintextPassword);
    const payload: PersistedAdminCredentials = {
      username: username.trim(),
      passwordHash,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Admin Auth] Error saving credentials:', err);
    return false;
  }
}

export function getActiveAdminUsername(): string {
  const persisted = getPersistedCredentials();
  if (persisted) return persisted.username;
  return process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
}

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

    if (!timingSafeCompare(signature, expectedSignature)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadEncoded, 'base64url').toString('utf8')
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Validate incoming login credentials against persisted credentials or environment variables.
 */
export function validateAdminCredentials(usernameAttempt: string, passwordAttempt: string): boolean {
  // 1. Check persisted credentials file first
  const persisted = getPersistedCredentials();
  if (persisted) {
    const usernameMatch = timingSafeCompare(usernameAttempt.trim(), persisted.username.trim());
    if (!usernameMatch) return false;
    return verifyPassword(passwordAttempt, persisted.passwordHash);
  }

  // 2. Fallback to configured environment variables
  const configuredUsername = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  const usernameMatch = timingSafeCompare(usernameAttempt.trim(), configuredUsername.trim());
  if (!usernameMatch) {
    return false;
  }

  if (configuredHash && configuredHash.includes(':')) {
    return verifyPassword(passwordAttempt, configuredHash);
  }

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
