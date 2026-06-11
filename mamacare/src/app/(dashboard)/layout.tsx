"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Heart,
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart2,
  LogOut,
  Stethoscope,
  UserCheck,
} from 'lucide-react';

const chwNav = [
  { href: '/chw',          label: 'Overview',    icon: LayoutDashboard },
  { href: '/chw/patients', label: 'Patients',    icon: Users },
  { href: '/chw/reports',  label: 'Reports',     icon: ClipboardList },
];

const nurseNav = [
  { href: '/nurse',          label: 'Overview',  icon: LayoutDashboard },
  { href: '/nurse/patients', label: 'Patients',  icon: Users },
  { href: '/nurse/analytics',label: 'Analytics', icon: BarChart2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();

  if (!mounted) return null;

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0faf8]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="h-10 w-10 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading session…</p>
        </div>
      </div>
    );
  }

  const isNurse = session.role === 'nurse';
  const navLinks = isNurse ? nurseNav : chwNav;
  const roleLabel = isNurse ? 'Supervisor' : 'Health Worker';
  const RoleIcon = isNurse ? Stethoscope : UserCheck;
  const initials = session.userId
    ? session.userId.slice(0, 2).toUpperCase()
    : (isNurse ? 'NS' : 'CW');

  return (
    <div className="min-h-screen bg-[#f0faf8] text-slate-900">

      {/* ── Top nav bar ── */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

          {/* Brand */}
          <Link href={isNurse ? '/nurse' : '/chw'} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 shadow-md shadow-teal-200 group-hover:bg-teal-700 transition-colors">
              <Heart className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600 leading-none">MamaCare</p>
              <p className="text-sm font-semibold text-slate-800 leading-tight">Dashboard</p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/chw' && href !== '/nurse' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right: user pill + logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
              {/* Avatar */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-[11px] font-black text-white shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{roleLabel}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <RoleIcon className="h-3 w-3 text-teal-600" />
                  <p className="text-[10px] text-teal-600 font-semibold capitalize">{session.role}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-95 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-lg md:hidden">
        <div className="flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/chw' && href !== '/nurse' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  active ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-teal-600' : ''}`} />
                {label}
                {active && <span className="h-1 w-4 rounded-full bg-teal-600" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 md:pb-8 animate-fade-up">
        <main>{children}</main>
      </div>
    </div>
  );
}
