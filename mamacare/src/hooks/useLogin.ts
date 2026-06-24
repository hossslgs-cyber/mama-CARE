'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AUTH_COOKIE_NAME } from '@/lib/constants';
import { formatPhoneNumber, normalizePhoneNumber } from '@/lib/utils/phoneFormatter';
import { validatePin, validateEmail, validatePassword, validatePhone } from '@/lib/utils/validators';
import type { LoginMethod, MessageState } from '@/types';

function setAuthCookie(role: 'chw' | 'nurse', userId: string, maxAge = 86400) {
  if (typeof document === 'undefined') return;
  const payload = { role, userId, expiresAt: Date.now() + maxAge * 1000 };
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload))}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function useLogin() {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>('phone');
  const [message, setMessage] = useState<MessageState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = useMemo(() => createClient(), []);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = useCallback((text: string, type: MessageState['type']) => {
    if (messageTimer.current) clearTimeout(messageTimer.current);
    setMessage({ text, type });
    messageTimer.current = setTimeout(() => setMessage(null), 4000);
  }, []);

  const dismissMessage = useCallback(() => {
    if (messageTimer.current) clearTimeout(messageTimer.current);
    setMessage(null);
  }, []);

  const switchMethod = useCallback((newMethod: LoginMethod) => {
    setMethod(newMethod);
    dismissMessage();
  }, [dismissMessage]);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(formatPhoneNumber(value));
  }, []);

  const handlePinChange = useCallback((value: string) => {
    setPin(value.replace(/\D/g, '').slice(0, 4));
  }, []);

  const handlePhoneSubmit = useCallback(async () => {
    const phoneResult = validatePhone(phone);
    if (!phoneResult.valid) {
      showMessage(phoneResult.message, 'error');
      return;
    }
    const pinResult = validatePin(pin);
    if (!pinResult.valid) {
      showMessage(pinResult.message, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const normalizedPhone = normalizePhoneNumber(phone);
      const { error } = await supabase.auth.signInWithOtp({ phone: normalizedPhone });
      if (error) throw error;
      showMessage('Welcome back! Redirecting...', 'success');
      setAuthCookie('chw', normalizedPhone);
      router.push('/chw');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to sign in right now.';
      showMessage(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  }, [phone, pin, showMessage, router]);

  const handleEmailSubmit = useCallback(async () => {
    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      showMessage(emailResult.message, 'error');
      return;
    }
    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) {
      showMessage(passwordResult.message, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      if (data.user) {
        showMessage('Welcome back! Redirecting...', 'success');
        setAuthCookie('nurse', data.user.id);
        router.push('/nurse');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed.';
      showMessage(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  }, [email, password, showMessage, router]);

  return {
    method,
    message,
    submitting,
    phone,
    pin,
    email,
    password,
    switchMethod,
    dismissMessage,
    showMessage,
    setPhone: handlePhoneChange,
    setPin: handlePinChange,
    setEmail,
    setPassword,
    handlePhoneSubmit,
    handleEmailSubmit,
  };
}
