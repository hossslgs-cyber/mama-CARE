import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'mamacare-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/chw') || pathname.startsWith('/nurse');

  if (!isProtected) {
    return NextResponse.next();
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

    if (pathname === '/nurse' && payload.role !== 'nurse') {
      return NextResponse.redirect(new URL('/chw', request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/chw/:path*', '/nurse/:path*'],
};
