import { Activity, ShieldCheck, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_45%,#f0fdf4_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200 sm:p-12 lg:p-16">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Field Ready • Phase 9 Complete
              </div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl">
                Maternal care for <span className="text-teal-600 underline decoration-teal-100 underline-offset-8">every</span> village.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                MamaCare is an offline-first clinical tracking system designed for Community Health Workers. 
                Register mothers, log visits, and assess triage—even with zero internet.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-lg font-bold text-white hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-300"
                >
                  Enter Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-3 px-4 py-4 text-sm font-bold text-slate-500">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  HIPAA Compliant Design
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-teal-100/50 rounded-full blur-3xl"></div>
              <div className="relative rounded-[2.5rem] bg-white p-8 shadow-2xl border border-slate-100 transform rotate-3">
                <Activity className="h-12 w-12 text-teal-600 mb-4" />
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="text-xs font-bold uppercase text-slate-400 tracking-widest">Offline Reliability</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8">
              <ShieldCheck className="h-10 w-10 text-teal-700 mb-4" />
              <h2 className="text-xl font-bold">Smart Triage</h2>
              <p className="mt-2 text-sm text-slate-600">Built-in clinical decision trees automatically identify high-risk pregnancies.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8">
              <Smartphone className="h-10 w-10 text-teal-700 mb-4" />
              <h2 className="text-xl font-bold">WhatsApp Sync</h2>
              <p className="mt-2 text-sm text-slate-600">Instant maternal reminders via WhatsApp and native SMS integration.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8">
              <Activity className="h-10 w-10 text-teal-700 mb-4" />
              <h2 className="text-xl font-bold">Local Priority</h2>
              <p className="mt-2 text-sm text-slate-600">IndexedDB ensures health records are accessible in the remotest areas.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
