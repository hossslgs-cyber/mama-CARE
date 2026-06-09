import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'mamacare-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname === '/chw' || pathname === '/nurse';

  if (!isProtected) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = JSON.parse(decodeURIComponent(cookie)) as { role?: 'chw' | 'nurse'; expiresAt?: number };
    if (!payload.role || (payload.expiresAt ?? 0) < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === '/nurse' && payload.role !== 'nurse') {
      return NextResponse.redirect(new URL('/chw', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/chw', '/nurse'],
};
