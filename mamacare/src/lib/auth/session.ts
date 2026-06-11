export const AUTH_COOKIE_NAME = 'mamacare-auth';

export interface SessionCookiePayload {
  phone: string;
  role: 'chw' | 'nurse';
  expiresAt: number;
}

/**
 * Read the auth cookie from the client-side document.cookie.
 * NOTE: The cookie is set with HttpOnly in production via response headers,
 * so this client-side reader is only used as a fallback for the middleware
 * and for non-HttpOnly scenarios during local dev.
 */
export function getAuthCookie(): SessionCookiePayload | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${AUTH_COOKIE_NAME}=`));

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

  const isSecure = window.location.protocol === 'https:';
  const flags = [
    `Path=/`,
    `Max-Age=900`,
    `SameSite=Strict`,
    isSecure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload))}; ${flags}`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict`;
}
