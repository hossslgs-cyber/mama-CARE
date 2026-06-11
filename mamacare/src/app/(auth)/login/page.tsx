"use client";

import { useState, useCallback, MouseEvent as RMouseEvent } from 'react';
import { ShieldCheck, Smartphone, KeyRound, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

/* ── Ripple ── */
function useRipple() {
  return useCallback((e: RMouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const circle = document.createElement('span');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple-circle';
    circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    el.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }, []);
}

export default function LoginPage() {
  const { loginWithPhone, verifyOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');
  const [submitting, setSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);   // increment to re-trigger shake

  const ripple = useRipple();

  const showMsg = (text: string, type: 'ok' | 'err') => {
    setMessage(text);
    setMsgType(type);
    if (type === 'err') setShakeKey(k => k + 1);
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) { showMsg('Please enter a phone number.', 'err'); return; }
    setSubmitting(true);
    const result = await loginWithPhone(phone.trim());
    showMsg(result.message, result.ok ? 'ok' : 'err');
    if (result.ok) setStep('otp');
    setSubmitting(false);
  };

  const handleVerify = async () => {
    if (!code.trim()) { showMsg('Please enter the OTP code.', 'err'); return; }
    setSubmitting(true);
    const result = await verifyOtp(phone.trim(), code.trim());
    showMsg(result.message, result.ok ? 'ok' : 'err');
    setSubmitting(false);
  };

  const handleDemoLogin = (role: 'chw' | 'nurse') => {
    const payload = { role, userId: `demo-${role}`, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
    document.cookie = `mamacare-auth=${encodeURIComponent(JSON.stringify(payload))}; path=/; max-age=86400; SameSite=Lax`;
    window.location.href = role === 'nurse' ? '/nurse' : '/chw';
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f0faf8]">

      {/* ── Blobs ── */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-300/30 blur-3xl animate-blob" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 -right-24 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl animate-blob delay-300" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/20 blur-3xl animate-blob delay-500" />

      <section className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-12">

        {/* ── Brand mark ── */}
        <div className="mb-6 flex flex-col items-center gap-2 animate-scale-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-teal-600 shadow-lg shadow-teal-200 animate-glow-pulse">
            <Heart className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-700">MamaCare</p>
        </div>

        {/* ── Card ── */}
        <article
          key={shakeKey}
          className={`glass w-full rounded-[2rem] p-8 shadow-2xl shadow-teal-100/50 animate-fade-up delay-100 ${shakeKey > 0 ? 'animate-shake' : ''}`}
        >
          {/* Header */}
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-black text-slate-900 animate-slide-left">
              {step === 'phone' ? 'Welcome back' : 'Check your phone'}
            </h1>
            <p className="text-sm text-slate-500 animate-slide-left delay-100">
              {step === 'phone'
                ? 'Sign in with your registered phone number.'
                : `We sent a code to ${phone}. Enter it below.`}
            </p>
          </div>

          {/* ── Phone step ── */}
          {step === 'phone' ? (
            <div className="space-y-4 animate-slide-right">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="phone-input">
                Phone number
              </label>
              <div className="input-group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Smartphone className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  id="phone-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  inputMode="tel"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="+232 76 123 456"
                />
              </div>
              <button
                id="send-otp-btn"
                type="button"
                onClick={e => { ripple(e); handleSendOtp(); }}
                disabled={submitting}
                className="group btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-200 hover:bg-teal-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed press-scale"
              >
                {submitting
                  ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Sending…</span>
                  : <><span>Send OTP</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                }
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-right">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="otp-input">
                Verification code
              </label>
              <div className="input-group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <KeyRound className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  id="otp-input"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full bg-transparent text-sm tracking-widest outline-none placeholder:text-slate-400"
                  placeholder="● ● ● ● ● ●"
                />
              </div>
              <button
                id="verify-otp-btn"
                type="button"
                onClick={e => { ripple(e); handleVerify(); }}
                disabled={submitting}
                className="group btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-200 hover:bg-teal-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed press-scale"
              >
                {submitting
                  ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Verifying…</span>
                  : <><span>Verify code</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                }
              </button>
              <button
                type="button"
                onClick={() => { setStep('phone'); setMessage(''); }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 press-scale"
              >
                ← Change phone number
              </button>
            </div>
          )}

          {/* ── Message ── */}
          {message && (
            <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium animate-scale-in ${
              msgType === 'err'
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-teal-50 text-teal-700 border border-teal-100'
            }`}>
              {msgType === 'err' ? '⚠ ' : '✓ '}{message}
            </p>
          )}

          {/* ── Demo access ── */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Hackathon Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="demo-chw-btn"
                type="button"
                onClick={e => { ripple(e as any); setTimeout(() => handleDemoLogin('chw'), 120); }}
                className="btn-ripple group flex flex-col items-center gap-1.5 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 hover:-translate-y-0.5 hover:shadow-md press-scale"
              >
                <span className="text-xl transition-transform duration-200 group-hover:scale-110">👩‍⚕️</span>
                CHW Login
              </button>
              <button
                id="demo-nurse-btn"
                type="button"
                onClick={e => { ripple(e as any); setTimeout(() => handleDemoLogin('nurse'), 120); }}
                className="btn-ripple group flex flex-col items-center gap-1.5 rounded-xl border-2 border-violet-200 bg-violet-50 px-4 py-3.5 text-sm font-bold text-violet-700 hover:bg-violet-100 hover:-translate-y-0.5 hover:shadow-md press-scale"
              >
                <span className="text-xl transition-transform duration-200 group-hover:scale-110">👨‍⚕️</span>
                Nurse Login
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              Bypasses phone OTP · For demo purposes only
            </p>
          </div>
        </article>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400 animate-fade-up delay-200">
          <ShieldCheck className="inline h-3.5 w-3.5 text-teal-500 mr-1 -mt-0.5" />
          End-to-end encrypted · Offline-first · HIPAA compliant
        </p>
      </section>
    </main>
  );
}