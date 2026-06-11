"use client";

import { useEffect, useState } from 'react';
import { getAllRecords, getRecord } from '@/lib/db/indexeddb';
import type { PatientRecord, VisitRecord, AppointmentRecord } from '@/types';
import { calculateTriage } from '@/lib/utils/triage';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Phone, User, Activity, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { SMSButton } from '@/components/ui/SMSButton';

interface PatientProfileProps {
  patientId: string;
}

export function PatientProfile({ patientId }: PatientProfileProps) {
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [p, allV, allA] = await Promise.all([
        getRecord<PatientRecord>('patients', patientId),
        getAllRecords<VisitRecord>('visits'),
        getAllRecords<AppointmentRecord>('appointments'),
      ]);

      setPatient(p || null);
      setVisits(allV.filter(v => v.patient_id === patientId).sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()));
      setAppointments(allA.filter(a => a.patient_id === patientId).sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()));
      setLoading(false);
    }
    loadData();
  }, [patientId]);

  if (loading) return <div className="animate-pulse space-y-6">
    <div className="h-40 bg-slate-50 rounded-3xl" />
    <div className="h-64 bg-slate-50 rounded-3xl" />
  </div>;

  if (!patient) return <div className="p-8 text-center text-rose-600">Patient not found.</div>;

  const latestTriage = visits.length > 0 ? calculateTriage(visits[0]) : null;

  return (
    <div className="space-y-8 pb-12">
      {/* Patient Header Card */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] shadow-inner ${
              latestTriage?.triage_level === 'red' ? 'bg-rose-100 text-rose-600' :
              latestTriage?.triage_level === 'yellow' ? 'bg-amber-100 text-amber-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              <User className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{patient.full_name}</h2>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {patient.village}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {patient.phone}</span>
                <span className="flex items-center gap-1.5 font-bold text-teal-700">EDD: {new Date(patient.edd).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link href={`/chw/patients/${patientId}/visit` as any} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3 font-bold text-white hover:bg-teal-800 transition-all active:scale-95 shadow-lg shadow-teal-100 md:flex-none">
              <Plus className="h-5 w-5" /> Log Visit
            </Link>
            <Link href={`/chw/patients/${patientId}/appointment/new` as any} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-black transition-all active:scale-95 md:flex-none">
              <Calendar className="h-5 w-5" /> Schedule
            </Link>
            <WhatsAppButton phone={patient.phone} motherName={patient.full_name} type="follow_up" variant="secondary" />
          </div>
        </div>

        {/* Quick Stats Overlay */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-8 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Gravida/Para</p>
            <p className="text-xl font-black text-slate-900">G{patient.gravida} P{patient.para}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Age</p>
            <p className="text-xl font-black text-slate-900">{patient.age}y</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Visits</p>
            <p className="text-xl font-black text-slate-900">{visits.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
            <p className={`text-xl font-black uppercase ${
              latestTriage?.triage_level === 'red' ? 'text-rose-600' :
              latestTriage?.triage_level === 'yellow' ? 'text-amber-600' :
              'text-emerald-600'
            }`}>
              {latestTriage?.triage_level || 'New'}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Longitudinal Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Activity className="h-5 w-5 text-teal-600" />
            Visit History & Triage
          </h3>
          <div className="relative space-y-6 before:absolute before:left-6 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100">
            {visits.length > 0 ? visits.map((visit) => {
              const triage = calculateTriage(visit);
              return (
                <div key={visit.id} className="relative pl-14">
                  <div className={`absolute left-3 top-1 h-6 w-6 rounded-full border-4 border-white shadow-sm ring-2 ${
                    triage.triage_level === 'red' ? 'bg-rose-500 ring-rose-100' :
                    triage.triage_level === 'yellow' ? 'bg-amber-500 ring-amber-100' :
                    'bg-emerald-500 ring-emerald-100'
                  }`} />
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {new Date(visit.visit_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${
                        triage.triage_level === 'red' ? 'bg-rose-100 text-rose-700' :
                        triage.triage_level === 'yellow' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {triage.triage_level}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed mb-4">{triage.summary}</p>
                    {visit.blood_pressure && (
                      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
                        <span>BP: {visit.blood_pressure}</span>
                        <span>FHR: {visit.fetal_heart_rate} bpm</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="pl-14 py-8">
                <p className="text-slate-400 italic">No visits recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Upcoming & Risk Factors */}
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Upcoming Appointments</h3>
            <div className="space-y-3">
              {appointments.length > 0 ? appointments.map((appt) => (
                <div key={appt.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-teal-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{new Date(appt.appointment_date).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-500">{appt.purpose}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400 italic">None scheduled.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Clinical Risk Factors</h3>
            <div className="flex flex-wrap gap-2">
              {patient.risk_factors.length > 0 ? patient.risk_factors.map((factor) => (
                <span key={factor} className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">
                  <AlertCircle className="h-3 w-3" /> {factor}
                </span>
              )) : (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> No known risks
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
