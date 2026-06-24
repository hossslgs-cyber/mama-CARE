'use client';

import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { Plus } from 'lucide-react';
import type { LoginMethod, MessageState } from '@/types';
import LoginToggle from './LoginToggle';
import PhoneForm from './PhoneForm';
import EmailForm from './EmailForm';
import MessageBanner from './MessageBanner';

interface LoginCardProps {
  method: LoginMethod;
  message: MessageState | null;
  submitting: boolean;
  phone: string;
  pin: string;
  email: string;
  password: string;
  onMethodChange: (method: LoginMethod) => void;
  onPhoneChange: (value: string) => void;
  onPinChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPhoneSubmit: () => Promise<void>;
  onEmailSubmit: () => Promise<void>;
  onDismissMessage: () => void;
}

export default function LoginCard({
  method,
  message,
  submitting,
  phone,
  pin,
  email,
  password,
  onMethodChange,
  onPhoneChange,
  onPinChange,
  onEmailChange,
  onPasswordChange,
  onPhoneSubmit,
  onEmailSubmit,
  onDismissMessage,
}: LoginCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover || prefersReduced) return;

    const el = cardRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;
      setTilt({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleForgot = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <>
      <div className="scene perspective-[1000px] w-full max-w-[420px] relative z-10">
        <div
          ref={cardRef}
          className="tilt-card relative overflow-hidden rounded-[20px] border border-[rgba(0,212,170,0.3)] bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.85)] px-8 py-9 shadow-[0_0_40px_rgba(0,212,170,0.15),0_25px_50px_rgba(0,0,0,0.3)] motion-safe:animate-float"
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >
          {/* Scanline overlay */}
          <div className="pointer-events-none absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,212,170,0.03)_2px,rgba(0,212,170,0.03)_4px)] motion-safe:animate-[scanline_8s_linear_infinite]" />

          {/* Border glow */}
          <div className="pointer-events-none absolute -inset-[2px] rounded-[22px] bg-gradient-to-br from-transparent via-[#00d4aa] to-transparent opacity-0 motion-safe:animate-[borderGlow_3s_ease-in-out_infinite] -z-[1]" />

          {/* Logo */}
          <div className="relative z-[2] mb-6 text-center">
            <div className="relative mx-auto mb-3 flex h-[60px] w-[60px] items-center justify-center rounded-[16px] bg-gradient-to-br from-[#00d4aa] to-[#0891b2] shadow-[0_0_30px_rgba(0,212,170,0.4)] overflow-hidden">
              <Plus className="h-7 w-7 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent motion-safe:animate-ecg-sweep" />
            </div>
            <h1 className="text-[1.6rem] font-bold tracking-tight text-[#f0f9ff]">
              MamaCare
            </h1>
            <p className="text-[0.8rem] text-[#94a3b8]">
              Every Mother. Every Baby. Every Step.
            </p>
          </div>

          {/* Message */}
          <div className="relative z-[2] mb-3">
            <MessageBanner message={message} onDismiss={onDismissMessage} />
          </div>

          {/* Toggle */}
          <div className="relative z-[2] mb-5">
            <LoginToggle method={method} onChange={onMethodChange} />
          </div>

          {/* Forms */}
          <div className="relative z-[2]">
            {method === 'phone' ? (
              <PhoneForm
                phone={phone}
                pin={pin}
                onPhoneChange={onPhoneChange}
                onPinChange={onPinChange}
                onSubmit={onPhoneSubmit}
                submitting={submitting}
              />
            ) : (
              <EmailForm
                email={email}
                password={password}
                onEmailChange={onEmailChange}
                onPasswordChange={onPasswordChange}
                onSubmit={onEmailSubmit}
                submitting={submitting}
              />
            )}
          </div>

          {/* Footer */}
          <div className="relative z-[2] mt-5 text-center">
            <a
              href="#"
              onClick={handleForgot}
              className="text-xs text-slate-400 no-underline transition-colors hover:text-[#00d4aa]"
            >
              Forgot PIN or Password? &middot; Contact Supervisor
            </a>
          </div>
        </div>

        {/* Projection base */}
        <div className="relative -mt-2 h-[50px]">
          <div className="absolute bottom-0 left-1/2 h-[50px] w-[180px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.25)_0%,transparent_70%)] motion-safe:animate-pulse" />
          <div className="absolute bottom-2 left-1/2 h-4 w-[100px] -translate-x-1/2 rounded-full border-2 border-[rgba(0,212,170,0.25)] motion-safe:animate-ping-slow" />
        </div>
      </div>
    </>
  );
}
