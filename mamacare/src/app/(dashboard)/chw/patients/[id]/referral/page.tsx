"use client";

import { useEffect, useState, use } from 'react';
import { ReferralForm } from '@/components/forms/ReferralForm';
import { getRecord } from '@/lib/db/indexeddb';
import type { PatientRecord } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Landmark } from 'lucide-react';

export default function ReferralPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatient() {
      try {
        const record = await getRecord<PatientRecord>('patients', id);
        if (record) setPatient(record);
      } finally {
        setLoading(false);
      }
    }
    loadPatient();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Establishing secure link...</div>;

  if (!patient) return <div className="p-8 text-center text-rose-600">Patient record not found.</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <Link href={`/chw/patients/${id}`} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-rose-700 font-black">Emergency Referral</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{patient.full_name}</h2>
        </div>
      </header>

      <div className="flex items-start gap-4 rounded-[2rem] bg-rose-50 p-8 border border-rose-100">
        <Landmark className="h-8 w-8 text-rose-600 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-rose-900 leading-none">Referral Instruction</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Please fill out this form to formalize the transfer of care to a health facility. 
            Once submitted, this information is stored as a clinical priority for district oversight.
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
        <ReferralForm patientId={id} />
      </div>
    </div>
  );
}
