import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminSession,
  validateAdminCredentials,
  saveAdminCredentials,
  createSessionToken,
  ADMIN_COOKIE_NAME,
  SESSION_EXPIRY_SECONDS,
} from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { currentPassword, newUsername, newPassword, confirmPassword } = body;

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json(
        { error: 'Current password verification is required.' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'New password is required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    // Verify current password in constant time
    const isCurrentValid = validateAdminCredentials(session.username, currentPassword);
    if (!isCurrentValid) {
      // Artificial delay to prevent timing discrepancy
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(
        { error: 'Current password is incorrect. Verification failed.' },
        { status: 400 }
      );
    }

    const targetUsername = (newUsername && typeof newUsername === 'string' && newUsername.trim())
      ? newUsername.trim()
      : session.username;

    // Save credentials persistently with PBKDF2 salt
    const saved = saveAdminCredentials(targetUsername, newPassword);
    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to write updated credentials. Please try again.' },
        { status: 500 }
      );
    }

    // Generate refreshed session token
    const newToken = createSessionToken(targetUsername);

    const response = NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully.',
      username: targetUsername,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_EXPIRY_SECONDS,
    });

    return response;
  } catch (err: any) {
    console.error('[Change Credentials API] Exception:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
