"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import { NurseRiskFeed } from '@/components/dashboard/NurseRiskFeed';
import { NurseAnalytics } from '@/components/dashboard/NurseAnalytics';
import { Search, Filter, Download } from 'lucide-react';

export default function NurseHomePage() {
  const [chwActivity, setChwActivity] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function fetchChwActivity() {
      const { data } = await supabase
        .from('visits')
        .select('chw_id, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) {
        const map = new Map();
        data.forEach(v => {
          if (v.chw_id && !map.has(v.chw_id)) {
            map.set(v.chw_id, v.created_at);
          }
        });
        setChwActivity(Array.from(map.entries()).map(([chw_id, lastSync]) => ({ chw_id, lastSync })));
      }
    }
    fetchChwActivity();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase
        .from('patients')
        .select('id, full_name, village')
        .or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .limit(5);
      
      if (data) {
        setSearchResults(data);
      }
      setSearching(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const getRelativeTime = (timeStr: string) => {
    const elapsed = Date.now() - new Date(timeStr).getTime();
    const mins = Math.floor(elapsed / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return new Date(timeStr).toLocaleDateString();
  };

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
              {chwActivity.length > 0 ? (
                chwActivity.map(act => (
                  <div key={act.chw_id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{act.chw_id}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Last active: {getRelativeTime(act.lastSync)}</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">No recent CHW activity</p>
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="mb-2 text-lg font-bold">Quick Search</h3>
            <p className="mb-6 text-xs text-slate-400">Locate any mother in the district by name or ID.</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input 
                placeholder="Search by name or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-white/10 border border-white/20 py-3 pl-11 pr-4 text-sm outline-none focus:bg-white/20 transition-all"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {(searching || searchResults.length > 0) && (
              <div className="mt-4 rounded-2xl bg-slate-800 border border-slate-700 p-2 max-h-60 overflow-y-auto space-y-1">
                {searching ? (
                  <p className="p-3 text-xs text-slate-400 text-center animate-pulse">Searching...</p>
                ) : (
                  searchResults.map(patient => (
                    <Link 
                      key={patient.id} 
                      href={`/nurse/patients/${patient.id}` as any}
                      className="block p-3 rounded-xl hover:bg-slate-700 transition-colors text-left text-white"
                    >
                      <p className="text-sm font-bold">{patient.full_name}</p>
                      <p className="text-[10px] text-slate-400">Village: {patient.village}</p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
