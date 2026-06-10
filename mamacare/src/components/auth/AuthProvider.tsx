"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/db/supabase';
import { clearAuthCookie, getAuthCookie, setAuthCookie } from '@/lib/auth/session';
import { SESSION_TIMEOUT_MS } from '@/lib/constants';
import type { UserProfile } from '@/types';
const SESSION_STORAGE_KEY = 'mamacare-session';

interface AuthSession extends UserProfile {
  name: string;
  lastActiveAt: number;
}

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  loginWithPhone: (phone: string) => Promise<{ ok: boolean; message: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function saveStoredSession(session: AuthSession | null) {
  if (typeof window === 'undefined') return;

  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = getStoredSession();
    const cookie = getAuthCookie();

    if (stored && cookie && stored.phone === cookie.phone && Date.now() - stored.lastActiveAt < SESSION_TIMEOUT_MS) {
      return { ...stored, lastActiveAt: Date.now() };
    }

    clearAuthCookie();
    saveStoredSession(null);
    return null;
  });
  const [loading] = useState(false);
  const router = useRouter();

  const logout = useCallback(() => {
    clearAuthCookie();
    saveStoredSession(null);
    setSession(null);
    void supabase.auth.signOut().catch((err: unknown) => {
      console.error('Supabase signOut failed', err);
    });
    router.push('/login');
  }, [router]);

  useEffect(() => {
    if (!session) return;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - session.lastActiveAt;
      if (elapsed >= SESSION_TIMEOUT_MS) {
        logout();
      }
    }, 60_000);

    const resetTimer = () => {
      setSession((current) => {
        if (!current) return current;

        const next = { ...current, lastActiveAt: Date.now() };
        saveStoredSession(next);
        setAuthCookie({ phone: next.phone, role: next.role, expiresAt: Date.now() + SESSION_TIMEOUT_MS });
        return next;
      });
    };

    window.addEventListener('click', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [logout, session]);

  const loginWithPhone = useCallback(async (phone: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        return { ok: true, message: 'OTP sent. Enter the code to continue.' };
      }

      return { ok: true, message: 'Demo mode: OTP is not sent without Supabase credentials.' };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to send OTP right now.',
      };
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    try {
      let role: UserProfile['role'] = 'chw';

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
        if (error || !data.session) throw error ?? new Error('No session returned.');

        // Derive role from Supabase user metadata (set by admin), default to 'chw'
        const userRole = data.user?.user_metadata?.role as string | undefined;
        if (userRole === 'nurse') {
          role = 'nurse';
        }
      }

      const nextSession: AuthSession = {
        id: phone,
        phone,
        role,
        name: role === 'nurse' ? 'District Nurse' : 'Community Health Worker',
        lastActiveAt: Date.now(),
      };

      setSession(nextSession);
      saveStoredSession(nextSession);
      setAuthCookie({ phone, role, expiresAt: Date.now() + SESSION_TIMEOUT_MS });
      router.push(role === 'nurse' ? '/nurse' : '/chw');

      return { ok: true, message: 'Signed in successfully.' };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to verify the OTP code.',
      };
    }
  }, [router]);

  const value = useMemo(
    () => ({ session, loading, loginWithPhone, verifyOtp, logout }),
    [session, loading, loginWithPhone, verifyOtp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
