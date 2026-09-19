import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;

  // If Supabase credentials are not configured yet, gracefully allow browsing and demo access
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

    // Protect /admin routes in production
    if (pathname.startsWith('/admin')) {
      if (!user && !hasDemoPatronCookie && process.env.NODE_ENV === 'production') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      if (user) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const isAdmin =
          user.user_metadata?.role === 'admin' || (adminEmail && user.email === adminEmail);

        if (!isAdmin && process.env.NODE_ENV === 'production') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }

    // Protect /account routes
    if (pathname.startsWith('/account') && !user && !hasDemoPatronCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Redirect logged-in users away from auth pages
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
