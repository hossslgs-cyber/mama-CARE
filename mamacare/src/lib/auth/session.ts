export const AUTH_COOKIE_NAME = 'mamacare-auth';

export interface SessionCookiePayload {
  phone: string;
  role: 'chw' | 'nurse';
  expiresAt: number;
}

export function getAuthCookie(): SessionCookiePayload | null {
  if (typeof document === 'undefined') {
    return null;
  }

  // Try to parse 'mamacare-auth' cookie first
  let cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('mamacare-auth='));

  // Fall back to existing cookie logic if not found
  if (!cookie && AUTH_COOKIE_NAME !== 'mamacare-auth') {
    cookie = document.cookie
      .split('; ')
      .find((item) => item.startsWith(`${AUTH_COOKIE_NAME}=`));
  }

  if (!cookie) {
    return null;
  }

  try {
    const value = decodeURIComponent(cookie.split('=')[1] ?? '');
    return JSON.parse(value) as SessionCookiePayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(payload: SessionCookiePayload) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload))}; Path=/; Max-Age=900; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
