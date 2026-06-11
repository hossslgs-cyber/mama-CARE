"use client";

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

const subscribe = () => () => {};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAuth();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  if (!hydrated || !session) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-700">Loading session…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-teal-700">MamaCare</p>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-800">{session.role}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:w-64">
          <nav className="grid gap-2 text-sm font-medium">
            <Link href="/chw" className="rounded-2xl px-3 py-2 hover:bg-slate-100">CHW Home</Link>
            <Link href="/nurse" className="rounded-2xl px-3 py-2 hover:bg-slate-100">Nurse Home</Link>
          </nav>
        </aside>
        <main className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
}
