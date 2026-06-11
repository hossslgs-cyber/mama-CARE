"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/db/supabase';
import { calculateTriage } from '@/lib/utils/triage';
import type { PatientRecord, VisitRecord } from '@/types';
import Link from 'next/link';
import { ArrowLeft, User, Stethoscope, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function NursePatientReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: p } = await supabase.from('patients').select('*').eq('id', id).single();
      const { data: v } = await supabase.from('visits').select('*').eq('patient_id', id).order('visit_date', { ascending: false });

      if (p) setPatient(p);
      if (v) setVisits(v);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading Clinical History...</div>;

  if (!patient) return <div className="p-12 text-center text-rose-600">Clinical record not found.</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-6">
        <Link href="/nurse" className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200 transition-all">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-700 font-black">Clinical Supervisor Review</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{patient.full_name}</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{patient.village} • District ANC-{id.slice(0, 4)}</p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900">
              <Stethoscope className="h-6 w-6 text-teal-600" />
              Visit Timeline & Nurse Notes
            </h3>
            <div className="space-y-6">
              {visits.map((visit) => {
                const triage = calculateTriage(visit);
                return (
                  <div key={visit.id} className={`rounded-3xl border p-6 transition-all ${
                    triage.triage_level === 'red' ? 'border-rose-200 bg-rose-50' : 'border-slate-50 bg-slate-50/50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-slate-900">{new Date(visit.visit_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${
                        triage.triage_level === 'red' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {triage.triage_level}
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Blood Pressure</p>
                        <p className="text-sm font-black text-slate-800">{visit.blood_pressure || 'Not taken'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Fetal Heart Rate</p>
                        <p className="text-sm font-black text-slate-800">{visit.fetal_heart_rate ? `${visit.fetal_heart_rate} bpm` : 'Not heard'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Fundal Height</p>
                        <p className="text-sm font-black text-slate-800">{visit.fundal_height ? `${visit.fundal_height} cm` : 'Not measured'}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Triage Summary</p>
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{triage.summary}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">Patient Stats</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">Obstetric History</p>
                <p className="text-2xl font-black">G{patient.gravida} P{patient.para}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">Estimated Due Date</p>
                <p className="text-2xl font-black text-teal-400">{new Date(patient.edd).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-rose-100 bg-rose-50 p-8">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-black uppercase tracking-widest">Risk Factors</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.risk_factors?.map((f: string) => (
                <span key={f} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm">{f}</span>
              ))}
              {!patient.risk_factors?.length && (
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase">
                  <ShieldCheck className="h-4 w-4" /> No high risk factors
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
