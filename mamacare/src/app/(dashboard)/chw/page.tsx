import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { AnalyticsSummary } from '@/components/dashboard/AnalyticsSummary';
import Link from 'next/link';
import { UserPlus, ClipboardList } from 'lucide-react';

export default function CHWHomePage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-teal-700 font-bold">Community Dashboard</p>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Habari, Health Worker</h2>
      </header>

      <AnalyticsSummary />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/chw/patients/new" className="flex items-center gap-4 rounded-[2rem] bg-teal-700 p-6 text-white hover:bg-teal-800 transition-all shadow-lg shadow-teal-100">
          <div className="rounded-2xl bg-white/20 p-3"><UserPlus /></div>
          <div>
            <p className="font-bold">Register Mother</p>
            <p className="text-xs text-teal-100">Add a new pregnancy record</p>
          </div>
        </Link>
        <Link href="/chw/patients" className="flex items-center gap-4 rounded-[2rem] bg-slate-900 p-6 text-white hover:bg-black transition-all shadow-lg shadow-slate-200">
          <div className="rounded-2xl bg-white/20 p-3"><ClipboardList /></div>
          <div>
            <p className="font-bold">Patient List</p>
            <p className="text-xs text-slate-400">View all registered mothers</p>
          </div>
        </Link>
      </div>

      <section>
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">Recent Activity</h3>
        <RecentActivity />
      </section>
    </div>
  );
}
