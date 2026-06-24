// MODIFIED: Tests now await async middleware.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from './middleware';
import { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

// Stub env vars so @supabase/ssr doesn't throw at construction
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');

function makeRequest(pathname: string, cookie?: string): NextRequest {
  const url = new URL(pathname, 'http://localhost:3000');
  const headers = new Headers();
  if (cookie) {
    headers.set('cookie', cookie);
  }
  return new NextRequest(url, { headers });
}

function cookieValue(payload: Record<string, unknown>) {
  return `${AUTH_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload))}`;
}

describe('middleware', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  it('allows unprotected routes without a cookie', async () => {
    const response = await middleware(makeRequest('/login'));
    expect(response.status).toBe(200);
  });

  it('allows unprotected routes like /', async () => {
    const response = await middleware(makeRequest('/'));
    expect(response.status).toBe(200);
  });

  it('redirects to /login when /chw has no cookie', async () => {
    const response = await middleware(makeRequest('/chw'));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when /nurse has no cookie', async () => {
    const response = await middleware(makeRequest('/nurse'));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when cookie is invalid JSON', async () => {
    const response = await middleware(makeRequest('/chw', 'mamacare-auth=bad-json'));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when session is expired', async () => {
    const cookie = cookieValue({
      role: 'chw',
      expiresAt: Date.now() - 1000, // expired
    });
    const response = await middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when role is missing', async () => {
    const cookie = cookieValue({
      expiresAt: Date.now() + 60_000,
    });
    const response = await middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('allows CHW access to /chw with valid cookie', async () => {
    const cookie = cookieValue({
      role: 'chw',
      expiresAt: Date.now() + 60_000,
    });
    const response = await middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(200);
  });

  it('allows nurse access to /nurse with valid cookie', async () => {
    const cookie = cookieValue({
      role: 'nurse',
      expiresAt: Date.now() + 60_000,
    });
    const response = await middleware(makeRequest('/nurse', cookie));
    expect(response.status).toBe(200);
  });

  it('redirects CHW to /chw when trying to access /nurse', async () => {
    const cookie = cookieValue({
      role: 'chw',
      expiresAt: Date.now() + 60_000,
    });
    const response = await middleware(makeRequest('/nurse', cookie));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/chw');
  });

  it('allows nurse access to /chw (no nurse-only restriction on /chw)', async () => {
    const cookie = cookieValue({
      role: 'nurse',
      expiresAt: Date.now() + 60_000,
    });
    const response = await middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(200);
  });
});
