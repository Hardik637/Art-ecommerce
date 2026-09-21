import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // 1. DEDICATED STORE OWNER ADMIN ROUTE HANDLING
  if (pathname.startsWith('/admin')) {
    const hasAdminSession = Boolean(request.cookies.get('admin_session')?.value);

    // Admin login page must ALWAYS be accessible - NEVER redirect to customer /login!
    if (pathname === '/admin/login') {
      if (hasAdminSession) {
        // Already logged into admin, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      // Allow access to the dedicated admin login page
      return NextResponse.next();
    }

    // Protect all other /admin routes (/admin, /admin/orders, /admin/products, etc.)
    if (!hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 2. SUPABASE CUSTOMER / PATRON SESSIONS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not configured yet, allow browsing and demo access
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseUrl.includes('mock-atelier-art')
  ) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check for demo patron cookie
    const hasDemoPatronCookie = Boolean(request.cookies.get('atelier_demo_user')?.value);

    // Protect customer /account routes
    if (pathname.startsWith('/account') && !user && !hasDemoPatronCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Redirect logged-in customer users away from customer auth pages
    if ((pathname === '/login' || pathname === '/register') && user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return supabaseResponse;
  } catch {
    // If Supabase communication fails, don't crash the entire application
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
