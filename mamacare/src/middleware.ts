// MODIFIED: Uses @supabase/ssr for session refresh and auth checks.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';
import { updateSession } from '@/lib/supabase/middleware';

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; font-src 'self'; frame-ancestors 'none';",
  );
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/chw') || pathname.startsWith('/nurse');
  const isAuthPage = pathname === '/login' || pathname === '/';

  // Refresh Supabase session and get user
  const { supabaseResponse, user } = await updateSession(request);

  if (isProtected) {
    if (!user) {
      // Not authenticated — check legacy auth cookie as fallback
      const legacyCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (!legacyCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }

      try {
        const payload = JSON.parse(decodeURIComponent(legacyCookie)) as {
          role?: 'chw' | 'nurse';
          expiresAt?: number;
        };
        if (!payload.role || payload.expiresAt === undefined || payload.expiresAt < Date.now()) {
          const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.delete(AUTH_COOKIE_NAME);
          return addSecurityHeaders(response);
        }

        if (pathname.startsWith('/nurse') && payload.role !== 'nurse') {
          return NextResponse.redirect(new URL('/chw', request.url));
        }

        return addSecurityHeaders(supabaseResponse);
      } catch {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete(AUTH_COOKIE_NAME);
        return addSecurityHeaders(response);
      }
    }

    // Authenticated via Supabase — derive role from user metadata
    const role = (user.user_metadata?.role as string) ?? 'chw';

    if (pathname.startsWith('/nurse') && role !== 'nurse') {
      return NextResponse.redirect(new URL('/chw', request.url));
    }

    return addSecurityHeaders(supabaseResponse);
  }

  // Auth pages: redirect authenticated users to dashboard
  if (isAuthPage && user) {
    const role = (user.user_metadata?.role as string) ?? 'chw';
    const url = request.nextUrl.clone();
    url.pathname = role === 'nurse' ? '/nurse' : '/chw';
    return NextResponse.redirect(url);
  }

  return addSecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: ['/chw/:path*', '/nurse/:path*'],
};
