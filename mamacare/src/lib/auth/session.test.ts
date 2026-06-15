import { describe, it, expect, beforeEach } from 'vitest';
import {
  AUTH_COOKIE_NAME,
  getAuthCookie,
  setAuthCookie,
  clearAuthCookie,
  type SessionCookiePayload,
} from './session';

beforeEach(() => {
  // Clear all cookies before each test
  document.cookie.split(';').forEach((c) => {
    const name = c.trim().split('=')[0];
    document.cookie = `${name}=; Max-Age=0; Path=/;`;
  });
});

describe('AUTH_COOKIE_NAME', () => {
  it('is "mamacare-auth"', () => {
    expect(AUTH_COOKIE_NAME).toBe('mamacare-auth');
  });
});

describe('setAuthCookie', () => {
  it('sets a cookie with the payload', () => {
    const payload: SessionCookiePayload = {
      phone: '+23276123456',
      role: 'chw',
      expiresAt: Date.now() + 900_000,
    };

    setAuthCookie(payload);
    expect(document.cookie).toContain(AUTH_COOKIE_NAME);
  });
});

describe('getAuthCookie', () => {
  it('returns null when no cookie is set', () => {
    expect(getAuthCookie()).toBeNull();
  });

  it('returns the payload when cookie is set', () => {
    const payload: SessionCookiePayload = {
      phone: '+23276123456',
      role: 'nurse',
      expiresAt: Date.now() + 900_000,
    };

    setAuthCookie(payload);
    const result = getAuthCookie();

    expect(result).not.toBeNull();
    expect(result!.phone).toBe('+23276123456');
    expect(result!.role).toBe('nurse');
  });

  it('returns null for a malformed cookie value', () => {
    document.cookie = `${AUTH_COOKIE_NAME}=not-json; Path=/;`;
    expect(getAuthCookie()).toBeNull();
  });
});

describe('clearAuthCookie', () => {
  it('removes the auth cookie', () => {
    setAuthCookie({ phone: '1234', role: 'chw', expiresAt: Date.now() + 60_000 });
    expect(getAuthCookie()).not.toBeNull();

    clearAuthCookie();
    expect(getAuthCookie()).toBeNull();
  });
});
