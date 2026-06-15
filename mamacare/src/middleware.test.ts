import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from './middleware';
import { NextRequest } from 'next/server';

function makeRequest(pathname: string, cookie?: string): NextRequest {
  const url = new URL(pathname, 'http://localhost:3000');
  const headers = new Headers();
  if (cookie) {
    headers.set('cookie', cookie);
  }
  return new NextRequest(url, { headers });
}

function cookieValue(payload: Record<string, unknown>) {
  return `mamacare-auth=${encodeURIComponent(JSON.stringify(payload))}`;
}

describe('middleware', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  it('allows unprotected routes without a cookie', () => {
    const response = middleware(makeRequest('/login'));
    expect(response.status).toBe(200);
  });

  it('allows unprotected routes like /', () => {
    const response = middleware(makeRequest('/'));
    expect(response.status).toBe(200);
  });

  it('redirects to /login when /chw has no cookie', () => {
    const response = middleware(makeRequest('/chw'));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when /nurse has no cookie', () => {
    const response = middleware(makeRequest('/nurse'));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when cookie is invalid JSON', () => {
    const response = middleware(makeRequest('/chw', 'mamacare-auth=bad-json'));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when session is expired', () => {
    const cookie = cookieValue({
      role: 'chw',
      expiresAt: Date.now() - 1000, // expired
    });
    const response = middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('redirects to /login when role is missing', () => {
    const cookie = cookieValue({
      expiresAt: Date.now() + 60_000,
    });
    const response = middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
  });

  it('allows CHW access to /chw with valid cookie', () => {
    const cookie = cookieValue({
      role: 'chw',
      expiresAt: Date.now() + 60_000,
    });
    const response = middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(200);
  });

  it('allows nurse access to /nurse with valid cookie', () => {
    const cookie = cookieValue({
      role: 'nurse',
      expiresAt: Date.now() + 60_000,
    });
    const response = middleware(makeRequest('/nurse', cookie));
    expect(response.status).toBe(200);
  });

  it('redirects CHW to /chw when trying to access /nurse', () => {
    const cookie = cookieValue({
      role: 'chw',
      expiresAt: Date.now() + 60_000,
    });
    const response = middleware(makeRequest('/nurse', cookie));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/chw');
  });

  it('allows nurse access to /chw (no nurse-only restriction on /chw)', () => {
    const cookie = cookieValue({
      role: 'nurse',
      expiresAt: Date.now() + 60_000,
    });
    const response = middleware(makeRequest('/chw', cookie));
    expect(response.status).toBe(200);
  });
});
