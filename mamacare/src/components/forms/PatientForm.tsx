"use client";

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, type PatientFormValues } from '@/lib/validation/patient';
import { putRecord } from '@/lib/db/indexeddb';
import type { PatientRecord, SyncQueueItem } from '@/types';

export function PatientForm() {
  const [message, setMessage] = useState('');
  const resolver = zodResolver(patientSchema);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientFormValues>({
    resolver,
  });

  const onSubmit = async (values: PatientFormValues) => {
    const patient: PatientRecord = {
      id: crypto.randomUUID(),
      full_name: values.full_name,
      age: Number(values.age),
      phone: values.phone,
      village: values.village,
      address: values.address,
      edd: values.edd,
      gravida: Number(values.gravida),
      para: Number(values.para),
      risk_factors: values.risk_factors ?? [],
      emergency_contact: values.emergency_contact || undefined,
      risk_level: 'low',
      chw_id: 'demo-chw',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await putRecord('patients', patient);

    const queueItem: SyncQueueItem = {
      id: crypto.randomUUID(),
      table: 'patients',
      operation: 'create',
      payload: patient,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    await putRecord('syncQueue', queueItem);
    setMessage(`Saved patient ${patient.full_name} offline.`);
  };

  const riskOptions = useMemo(() => ['Pre-eclampsia', 'Diabetes', 'Previous C-section', 'Anaemia'], []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input {...register('full_name')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.full_name ? <p className="text-xs text-rose-600">{errors.full_name.message}</p> : null}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Age</span>
          <input type="number" {...register('age')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.age ? <p className="text-xs text-rose-600">{errors.age.message}</p> : null}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input {...register('phone')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.phone ? <p className="text-xs text-rose-600">{errors.phone.message}</p> : null}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Village</span>
          <input {...register('village')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.village ? <p className="text-xs text-rose-600">{errors.village.message}</p> : null}
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Address</span>
          <input {...register('address')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.address ? <p className="text-xs text-rose-600">{errors.address.message}</p> : null}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">EDD</span>
          <input type="date" {...register('edd')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.edd ? <p className="text-xs text-rose-600">{errors.edd.message}</p> : null}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Gravida</span>
          <input type="number" {...register('gravida')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.gravida ? <p className="text-xs text-rose-600">{errors.gravida.message}</p> : null}
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Para</span>
          <input type="number" {...register('para')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          {errors.para ? <p className="text-xs text-rose-600">{errors.para.message}</p> : null}
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Emergency contact</span>
          <input {...register('emergency_contact')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">Risk factors</legend>
        <div className="flex flex-wrap gap-2">
          {riskOptions.map((option) => (
            <label key={option} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <input type="checkbox" value={option} {...register('risk_factors')} className="mr-2" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-teal-700 px-4 py-3 text-base font-semibold text-white disabled:opacity-60">
        {isSubmitting ? 'Saving...' : 'Save patient offline'}
      </button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
