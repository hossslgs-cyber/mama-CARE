"use client";

import { AnalyticsSummary } from '@/components/dashboard/AnalyticsSummary';
import { BarChart3, Download, Filter } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-700 font-bold">Analytics & Impact</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance Overview</h2>
          <p className="text-slate-500 mt-1">Real-time statistics from your local community health records.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 shadow-lg shadow-teal-100 transition-all">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </header>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Key Metrics
        </h3>
        <AnalyticsSummary />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Sync Health</h3>
          <p className="text-sm text-slate-500 mb-6">Status of local records pending synchronization with the central database.</p>
          <div className="space-y-4">
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[85%] bg-teal-500 rounded-full" />
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-500">
              <span>85% Synced</span>
              <span>15% Local-only</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Community Reach</h3>
          <p className="text-sm text-slate-500 mb-6">Mother registration progress vs. quarterly community targets.</p>
          <div className="flex items-end gap-2 h-20">
            <div className="w-full bg-slate-100 rounded-t-xl h-1/2" />
            <div className="w-full bg-teal-200 rounded-t-xl h-3/4" />
            <div className="w-full bg-teal-400 rounded-t-xl h-2/3" />
            <div className="w-full bg-teal-600 rounded-t-xl h-full" />
            <div className="w-full bg-teal-700 rounded-t-xl h-5/6" />
          </div>
          <p className="text-[10px] text-center mt-3 font-bold uppercase text-slate-400">Activity last 5 days</p>
        </div>
      </div>
    </div>
  );
}
