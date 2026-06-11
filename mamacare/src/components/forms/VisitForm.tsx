"use client";

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { visitSchema, type VisitFormValues } from '@/lib/validation/visit';
import { calculateTriage } from '@/lib/utils/triage';
import { putRecord } from '@/lib/db/indexeddb';
import type { VisitRecord, SyncQueueItem, DecisionTreeResult } from '@/types';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface VisitFormProps {
  patientId: string;
}

export function VisitForm({ patientId }: VisitFormProps) {
  const [triage, setTriage] = useState<DecisionTreeResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      visit_date: new Date().toISOString().split('T')[0],
      visit_type: 'home',
      symptoms: [],
    },
  });

  const onSubmit = async (values: VisitFormValues) => {
    const visit: VisitRecord = {
      id: crypto.randomUUID(),
      patient_id: patientId,
      visit_date: values.visit_date,
      visit_type: values.visit_type,
      blood_pressure: values.blood_pressure || undefined,
      weight: values.weight ? Number(values.weight) : undefined,
      fundal_height: values.fundal_height ? Number(values.fundal_height) : undefined,
      fetal_heart_rate: values.fetal_heart_rate ? Number(values.fetal_heart_rate) : undefined,
      urine: values.urine || undefined,
      symptoms: values.symptoms,
      notes: values.notes || undefined,
      chw_id: (typeof window !== 'undefined' ? (localStorage.getItem('mamacare-user-id') || (() => {
        try {
          const match = document.cookie.match(/mamacare-auth=([^;]+)/);
          if (match) {
            const payload = JSON.parse(decodeURIComponent(match[1]));
            return payload.userId || payload.id || null;
          }
        } catch {}
        return null;
      })()) : null) || 'demo-chw',
      created_at: new Date().toISOString(),
    };

    // Calculate Triage
    const triageResult = calculateTriage(visit);

    try {
      // Save to IDB
      await putRecord('visits', visit);

      // Queue for sync
      const queueItem: SyncQueueItem = {
        id: crypto.randomUUID(),
        table: 'visits',
        operation: 'create',
        payload: visit,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      await putRecord('syncQueue', queueItem);

      setTriage(triageResult);
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to save. Please try again.");
    }
  };

  const symptomOptions = useMemo(() => [
    'Headache', 'Blurred vision', 'Severe abdominal pain', 'Vaginal bleeding',
    'Swelling (Edema)', 'Fever', 'Reduced fetal movement'
  ], []);

  return (
    <div className="space-y-6">
      {triage && (
        <div className={`rounded-3xl border p-6 ${
          triage.triage_level === 'red' ? 'border-rose-200 bg-rose-50' :
          triage.triage_level === 'yellow' ? 'border-amber-200 bg-amber-50' :
          'border-emerald-200 bg-emerald-50'
        }`}>
          <div className="flex items-start gap-4">
            {triage.triage_level === 'red' ? <AlertCircle className="h-6 w-6 text-rose-600" /> :
             triage.triage_level === 'yellow' ? <Info className="h-6 w-6 text-amber-600" /> :
             <CheckCircle className="h-6 w-6 text-emerald-600" />}
            <div className="space-y-2">
              <h3 className={`text-lg font-bold uppercase tracking-tight ${
                triage.triage_level === 'red' ? 'text-rose-900' :
                triage.triage_level === 'yellow' ? 'text-amber-900' :
                'text-emerald-900'
              }`}>
                Triage Result: {triage.triage_level}
              </h3>
              <p className="text-sm text-slate-700">{triage.summary}</p>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Action Steps:</p>
                <ul className="list-inside list-disc text-sm text-slate-800">
                  {triage.action_steps.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Visit Date</span>
            <input type="date" {...register('visit_date')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Visit Type</span>
            <select {...register('visit_type')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <option value="home">Home Visit</option>
              <option value="clinic">Clinic Visit</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Blood Pressure (mmHg)</span>
            <input placeholder="120/80" {...register('blood_pressure')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            {errors.blood_pressure && <p className="text-xs text-rose-600">{errors.blood_pressure.message}</p>}
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Weight (kg)</span>
            <input type="number" step="0.1" {...register('weight')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Fundal Height (cm)</span>
            <input type="number" {...register('fundal_height')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Fetal Heart Rate (bpm)</span>
            <input type="number" {...register('fetal_heart_rate')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">Symptoms Observed</legend>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((option) => (
              <label key={option} className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                <input type="checkbox" value={option} {...register('symptoms')} className="mr-2 h-4 w-4 rounded border-slate-300 text-teal-700" />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Clinical Notes</span>
          <textarea {...register('notes')} rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
        </label>

        {submitError && (
          <p className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-4">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isSaved}
          className="w-full rounded-2xl bg-teal-700 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-teal-100 hover:bg-teal-800 disabled:opacity-60 transition-all active:scale-95"
        >
          {isSubmitting ? 'Processing...' : isSaved ? 'Visit Logged' : 'Log Visit & Assess Triage'}
        </button>
      </form>
    </div>
  );
}
