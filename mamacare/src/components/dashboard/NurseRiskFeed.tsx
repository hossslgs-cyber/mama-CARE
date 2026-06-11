"use client";

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/db/supabase';
import type { PatientRecord, VisitRecord } from '@/types';
import { calculateTriage } from '@/lib/utils/triage';
import { AlertCircle, User, MapPin, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function NurseRiskFeed() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHighRiskCases() {
      // Fetch latest visits and patients from Supabase
      const { data: visits, error: visitsError } = await supabase
        .from('visits')
        .select('*, patients(*)')
        .order('visit_date', { ascending: false })
        .limit(50);

      if (visitsError) {
        console.error('Failed to load risk alerts:', visitsError);
        setError('Failed to load risk alerts');
        setLoading(false);
        return;
      }

      if (visits) {
        const highRisk = visits
          .filter(v => calculateTriage(v).triage_level === 'red')
          .slice(0, 10);
        
        setAlerts(highRisk);
      }
      setLoading(false);
    }
    loadHighRiskCases();
  }, []);

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-[2rem]" />)}</div>;

  if (error) {
    return (
      <div className="py-12 text-center rounded-[2.5rem] border border-rose-100 bg-rose-50 text-rose-800 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.length > 0 ? alerts.map((visit) => {
        const triage = calculateTriage(visit);
        return (
          <div key={visit.id} className="group relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-rose-500" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{visit.patients?.full_name}</h4>
                  <div className="flex flex-wrap gap-x-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {visit.patients?.village}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Visit: {new Date(visit.visit_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right sm:block hidden">
                  <p className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Critical Trigger</p>
                  <p className="text-xs font-medium text-slate-600 max-w-[200px] truncate">{triage.action_steps[0]}</p>
                </div>
                <Link 
                  href={`/nurse/patients/${visit.patient_id}` as any}
                  className="rounded-full bg-slate-900 p-2 text-white hover:bg-black transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      }) : (
        <div className="py-12 text-center rounded-[2.5rem] border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-400">No active high-risk alerts found.</p>
        </div>
      )}
    </div>
  );
}
