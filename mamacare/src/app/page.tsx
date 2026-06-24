"use client";

import { useEffect, useRef, useState, useCallback, MouseEvent as RMouseEvent } from 'react';
import { Activity, ShieldCheck, Smartphone, ArrowRight, Heart, Wifi, Users } from 'lucide-react';
import Link from 'next/link';

/* ── Ripple hook ─────────────────────────────────────────────── */
function useRipple() {
  const trigger = useCallback((e: RMouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const circle = document.createElement('span');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple-circle';
    circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    el.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }, []);
  return trigger;
}

/* ── Counting stat ───────────────────────────────────────────── */
function CountStat({ target, suffix, label, icon: Icon }: { target: number; suffix: string; label: string; icon: React.ElementType }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 animate-count-up">
      <Icon className="h-5 w-5 text-teal-500 mb-1" />
      <p className="stat-number text-2xl font-black text-slate-900">
        {visible ? count.toLocaleString() : 0}{suffix}
      </p>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ── Tilt card ───────────────────────────────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: RMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function Home() {
  const ripple = useRipple();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f0faf8] text-slate-900">

      {/* ── Background blobs ── */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-teal-200/40 blur-3xl animate-blob" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 -right-48 h-[400px] w-[400px] rounded-full bg-indigo-200/30 blur-3xl animate-blob delay-300" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-emerald-200/30 blur-3xl animate-blob delay-500" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">

        {/* ── Hero card ── */}
        <div className="glass rounded-[2.5rem] p-8 shadow-2xl shadow-teal-100/60 sm:p-12 lg:p-16 animate-fade-up">

          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between">

            {/* Left: copy */}
            <div className="max-w-2xl space-y-7">

              {/* Status pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full bg-teal-50 border border-teal-100 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm animate-slide-left">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-500" />
                </span>
                Field Ready · Phase 9 Complete
              </div>

              {/* Headline */}
              <h1 className="text-5xl font-black tracking-tight leading-[1.08] sm:text-6xl lg:text-7xl animate-fade-up delay-100">
                Maternal care for{' '}
                <span className="gradient-text-animate">every</span>{' '}
                village.
              </h1>

              {/* Subheading */}
              <p className="text-lg text-slate-600 leading-relaxed animate-fade-up delay-200">
                MamaCare is an <strong className="text-slate-800 font-semibold">offline-first</strong> clinical tracking system
                for Community Health Workers. Register mothers, log visits, and assess triage—even with zero internet.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-300">
                <Link
                  href="/login"
                  id="hero-cta"
                  onClick={ripple as any}
                  className="group btn-ripple inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-teal-300 hover:-translate-y-1 active:scale-95 press-scale"
                >
                  Enter Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1.5" />
                </Link>
                <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-500">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  HIPAA Compliant Design
                </div>
              </div>
            </div>

            {/* Right: floating stat card */}
            <div className="hidden lg:block relative shrink-0 animate-fade-up delay-400">
              <div className="absolute -inset-6 rounded-full bg-teal-400/20 blur-2xl" aria-hidden />
              <div className="relative animate-float">
                <div className="w-52 rounded-[2rem] bg-slate-900 p-7 shadow-2xl text-white">
                  <Activity className="h-10 w-10 text-teal-400 mb-4" />
                  <p className="stat-number text-4xl font-black">100%</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Offline Reliability</p>
                </div>
                <div className="absolute -right-8 -bottom-6 rounded-2xl bg-white border border-slate-100 px-4 py-3 shadow-lg text-sm font-bold text-teal-700 flex items-center gap-2 animate-scale-in delay-500">
                  <Heart className="h-4 w-4 text-rose-500" />
                  Lives Saved
                </div>
              </div>
            </div>
          </div>

          {/* ── Feature grid with tilt ── */}
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, color: 'text-teal-600', bg: 'bg-teal-50',    title: 'Smart Triage',   desc: 'Built-in clinical decision trees automatically identify high-risk pregnancies.', delay: 'delay-200' },
              { icon: Smartphone,  color: 'text-indigo-600', bg: 'bg-indigo-50', title: 'WhatsApp Sync',  desc: 'Instant maternal reminders via WhatsApp and native SMS integration.',         delay: 'delay-300' },
              { icon: Wifi,        color: 'text-emerald-600',bg: 'bg-emerald-50',title: 'Local Priority', desc: 'IndexedDB ensures health records are accessible in the remotest areas.',       delay: 'delay-400' },
            ].map(({ icon: Icon, color, bg, title, desc, delay }) => (
              <TiltCard
                key={title}
                className={`animate-fade-up rounded-[1.75rem] border border-slate-100 bg-white/70 p-7 cursor-default ${delay}`}
              >
                <div className={`inline-flex rounded-2xl ${bg} p-3 mb-4 transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{desc}</p>
              </TiltCard>
            ))}
          </div>

          {/* ── Animated stat strip ── */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-10 border-t border-slate-100 pt-8 text-center">
            <CountStat target={340}   suffix="+" label="Villages Covered"   icon={Users}    />
            <CountStat target={12000} suffix="+" label="Mothers Registered" icon={Heart}    />
            <CountStat target={58000} suffix="+" label="Visits Logged"      icon={Activity} />
          </div>

        </div>
      </div>
    </main>
  );
}
