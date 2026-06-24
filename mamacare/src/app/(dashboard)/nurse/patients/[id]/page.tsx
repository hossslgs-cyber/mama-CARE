"use client";

import { useEffect, useState, use } from 'react';
import { calculateTriage } from '@/lib/utils/triage';
import { demoPatients } from '@/lib/demo-data';
import Link from 'next/link';
import { ArrowLeft, Stethoscope, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Patient {
  id: string;
  full_name: string;
  village: string;
  age: number;
  phone: string;
  edd: string;
  gravida: number;
  para: number;
  risk_factors: string[];
  created_at: string;
  updated_at: string;
}

const PATIENTS_MAP: Record<string, Patient> = Object.fromEntries(
  demoPatients.map(p => [
    p.id,
    {
      id: p.id,
      full_name: p.fullName,
      village: p.village,
      age: p.age,
      phone: p.phone,
      edd: p.edd,
      gravida: p.gravida,
      para: p.para,
      risk_factors: p.riskFactors,
      created_at: p.visits[0]?.visitDate + 'T00:00:00Z',
      updated_at: p.visits[p.visits.length - 1]?.visitDate + 'T00:00:00Z',
    },
  ])
);

const ALL_VISITS = demoPatients.flatMap(p =>
  p.visits.map(v => ({
    id: v.id,
    patient_id: p.id,
    visit_date: v.visitDate,
    chw_id: v.chwId,
    bp_systolic: v.bpSystolic,
    bp_diastolic: v.bpDiastolic,
    weight: v.weight,
    notes: v.notes,
  }))
);

export default function NursePatientReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadData() {
      const p = PATIENTS_MAP[id] || PATIENTS_MAP['SL-001'];
      const v = ALL_VISITS.filter(visit => visit.patient_id === p.id);

      // Map visits to align with UI expectations (e.g. blood_pressure, summary, etc.)
      const mappedVisits = v.map(visit => ({
        ...visit,
        blood_pressure: `${visit.bp_systolic}/${visit.bp_diastolic}`,
        fetal_heart_rate: 140, // demo default
        fundal_height: 28, // demo default
      }));

      setPatient(p);
      setVisits(mappedVisits);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading Clinical History...</div>;

  if (!patient) return <div className="p-12 text-center text-rose-600">Clinical record not found.</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-6">
        <Link href="/nurse/patients" className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200 transition-all">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-700 font-black">Clinical Supervisor Review</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{patient.full_name}</h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{patient.village} • District ANC-{patient.id.slice(0, 4)}</p>
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
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{visit.notes || triage.summary}"</p>
                    </div>
                  </div>
                );
              })}
              {visits.length === 0 && (
                <p className="text-slate-500 text-center py-6 font-bold">No visit records logged.</p>
              )}
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
