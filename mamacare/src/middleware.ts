import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; font-src 'self'; frame-ancestors 'none';"
  );
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/chw') || pathname.startsWith('/nurse');

  if (!isProtected) {
    return addSecurityHeaders(NextResponse.next());
  }

  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = JSON.parse(decodeURIComponent(cookie)) as { role?: 'chw' | 'nurse'; expiresAt?: number };
    
    // Verify the cookie has both 'role' and 'expiresAt' fields
    if (!payload.role || payload.expiresAt === undefined) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }

    // If expiresAt is in the past, clear the cookie and redirect to /login
    if (payload.expiresAt < Date.now()) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }

    if (pathname.startsWith('/nurse') && payload.role !== 'nurse') {
      return NextResponse.redirect(new URL('/chw', request.url));
    }

    return addSecurityHeaders(NextResponse.next());
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }
}

export const config = {
<<<<<<< HEAD
  matcher: ['/chw/:path*', '/nurse/:path*'],
=======
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.svg$|login).*)'],
>>>>>>> 581de9dc37b8db1e8a90e9efd8be6cf815f89f4c
};
