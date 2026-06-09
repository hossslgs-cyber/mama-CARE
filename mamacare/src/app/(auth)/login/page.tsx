"use client";

import { useState } from 'react';
import { ShieldCheck, Smartphone } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const { loginWithPhone, verifyOtp } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setMessage('Please enter a phone number.');
      return;
    }

    setSubmitting(true);
    const result = await loginWithPhone(phone.trim());
    setMessage(result.message);
    if (result.ok) setStep('otp');
    setSubmitting(false);
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setMessage('Please enter the OTP code.');
      return;
    }

    setSubmitting(true);
    const result = await verifyOtp(phone.trim(), code.trim());
    setMessage(result.message);
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#ecfeff_0%,#fff_45%,#f0fdf4_100%)] p-4 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <article className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200">
          <div className="flex items-center gap-3 text-teal-700">
            <ShieldCheck className="h-8 w-8" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em]">MamaCare</p>
              <h1 className="text-2xl font-semibold">Secure sign in</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Use your phone number and OTP to access the offline-first dashboard.</p>

          {step === 'phone' ? (
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Phone number</label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <Smartphone className="mr-2 h-5 w-5 text-slate-400" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  className="w-full bg-transparent text-base outline-none"
                  placeholder="+232 76 123 456"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={submitting}
                className="w-full rounded-2xl bg-teal-700 px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Verification code</label>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none"
                placeholder="Enter 6-digit code"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={submitting}
                className="w-full rounded-2xl bg-teal-700 px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Verifying...' : 'Verify code'}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
              >
                Change phone number
              </button>
            </div>
          )}

          {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
        </article>
      </section>
    </main>
  );
}
