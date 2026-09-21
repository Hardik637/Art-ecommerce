import { NextRequest, NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  createSessionToken,
  ADMIN_COOKIE_NAME,
  SESSION_EXPIRY_SECONDS,
} from '@/lib/adminAuth';

// In-memory rate limiting to prevent brute force attacks: max 10 attempts per 15 minutes per IP
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { attempts: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    // Window expired, reset
    rateLimitMap.set(ip, { attempts: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    const remainingSeconds = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 1000);
    return { allowed: false, remainingSeconds };
  }

  record.attempts += 1;
  return { allowed: true };
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${rateCheck.remainingSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const { username, password } = body;
    const isValid = validateAdminCredentials(username, password);

    if (!isValid) {
      // Artificial delay to prevent timing discrepancy
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(
        { error: 'Invalid admin username or password.' },
        { status: 401 }
      );
    }

    // Generate signed HMAC session token
    const token = createSessionToken(username);

    // Build response with secure HttpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful',
        user: { username, role: 'super_admin' },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_EXPIRY_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('[Admin Login API] Internal error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
