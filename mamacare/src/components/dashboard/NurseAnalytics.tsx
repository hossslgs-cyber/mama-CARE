"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/supabase';
import { calculateTriage } from '@/lib/utils/triage';
import { ShieldCheck, Users, AlertTriangle, TrendingUp } from 'lucide-react';

export function NurseAnalytics() {
  const [stats, setStats] = useState({
    totalMothers: 0,
    redCount: 0,
    yellowCount: 0,
    greenCount: 0,
    villageStats: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { data: visits } = await supabase.from('visits').select('*, patients(*)').limit(100);
      const { data: patients } = await supabase.from('patients').select('village');

      if (visits && patients) {
        let red = 0, yellow = 0, green = 0;
        visits.forEach(v => {
          const level = calculateTriage(v).triage_level;
          if (level === 'red') red++;
          else if (level === 'yellow') yellow++;
          else green++;
        });

        // Simple village aggregation
        const villageMap = new Map();
        patients.forEach(p => {
          villageMap.set(p.village, (villageMap.get(p.village) || 0) + 1);
        });

        setStats({
          totalMothers: patients.length,
          redCount: red,
          yellowCount: yellow,
          greenCount: green,
          villageStats: Array.from(villageMap.entries()).map(([name, count]) => ({ name, count }))
        });
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) return <div className="h-48 animate-pulse rounded-[2.5rem] bg-slate-50" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Population</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-3xl font-black text-slate-900">{stats.totalMothers}</h4>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Critical (Red)</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-3xl font-black text-rose-600">{stats.redCount}</h4>
            <AlertTriangle className="h-6 w-6 text-rose-500" />
          </div>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Moderate (Yellow)</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-3xl font-black text-amber-600">{stats.yellowCount}</h4>
            <TrendingUp className="h-6 w-6 text-amber-500" />
          </div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Normal (Green)</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-3xl font-black text-emerald-600">{stats.greenCount}</h4>
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-slate-900">District Coverage by Village</h3>
        <div className="space-y-4">
          {stats.villageStats.map(v => (
            <div key={v.name} className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{v.name}</span>
                <span>{v.count} mothers</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-teal-500 transition-all" 
                  style={{ width: `${(v.count / stats.totalMothers) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
