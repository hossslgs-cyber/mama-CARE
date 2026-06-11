import { NurseRiskFeed } from '@/components/dashboard/NurseRiskFeed';
import { NurseAnalytics } from '@/components/dashboard/NurseAnalytics';
import { Search, Filter, Download } from 'lucide-react';

export default function NurseHomePage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-700 font-bold">Supervisor Dashboard</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">District Oversight</h2>
          <p className="text-slate-500 mt-1">Reviewing community health data and prioritizing high-risk cases.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
            <Filter className="h-4 w-4" />
            Advanced Filter
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 shadow-lg shadow-teal-100 transition-all">
            <Download className="h-4 w-4" />
            Report Export
          </button>
        </div>
      </header>

      <section>
        <NurseAnalytics />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-rose-500">Critical Risk Alerts</h3>
          <NurseRiskFeed />
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">CHW Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-slate-900">CHW Area {i}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Last sync: 14 mins ago</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="mb-2 text-lg font-bold">Quick Search</h3>
            <p className="mb-6 text-xs text-slate-400">Locate any mother in the district by name or ID.</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input 
                placeholder="Search..." 
                className="w-full rounded-2xl bg-white/10 border border-white/20 py-3 pl-11 pr-4 text-sm outline-none focus:bg-white/20 transition-all"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
