"use client";

import { useEffect, useState, use } from 'react';
import { VisitForm } from '@/components/forms/VisitForm';
import { getRecord } from '@/lib/db/indexeddb';
import type { PatientRecord } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PatientVisitPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading patient details...</div>;

  if (!patient) {
    return (
      <div className="space-y-4 p-8 text-center">
        <p className="text-rose-600 font-medium">Patient record not found.</p>
        <Link href="/chw" className="inline-block rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <Link href={`/chw/patients/${id}`} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-700">New ANC Visit</p>
          <h2 className="text-2xl font-bold text-slate-900">{patient.full_name}</h2>
          <p className="text-sm text-slate-500">Age: {patient.age} • Village: {patient.village}</p>
        </div>
      </header>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <VisitForm patientId={id} />
      </div>
    </div>
  );
}
