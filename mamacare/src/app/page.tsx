import { Activity, ShieldCheck, Smartphone } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_45%,#f0fdf4_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">MamaCare</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Offline-first maternal care for every community health worker.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            The foundation is now set up with PWA support, Supabase client wiring, IndexedDB storage,
            and shared health-tracking types for the next phases.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <ShieldCheck className="h-8 w-8 text-teal-700" />
              <h2 className="mt-3 text-lg font-semibold">Offline-first</h2>
              <p className="mt-2 text-sm text-slate-600">All core actions are ready to persist locally before sync.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <Smartphone className="h-8 w-8 text-teal-700" />
              <h2 className="mt-3 text-lg font-semibold">Mobile-ready</h2>
              <p className="mt-2 text-sm text-slate-600">Large touch targets and low-bandwidth-friendly structure are planned.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <Activity className="h-8 w-8 text-teal-700" />
              <h2 className="mt-3 text-lg font-semibold">Sync-ready</h2>
              <p className="mt-2 text-sm text-slate-600">Supabase and IndexedDB are wired for the later sync engine.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
