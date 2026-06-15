"use client";

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, type PatientFormValues } from '@/lib/validation/patient';
import { putRecord } from '@/lib/db/indexeddb';
import { FormField, Button } from '@/components/ui';
import type { PatientRecord, SyncQueueItem } from '@/types';

export function PatientForm() {
  const [message, setMessage] = useState('');
  const resolver = zodResolver(patientSchema);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientFormValues>({
    resolver,
  });

  const [error, setError] = useState('');

  const onSubmit = async (values: PatientFormValues) => {
    setMessage('');
    setError('');

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

    try {
      await putRecord('patients', patient);
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to save patient record: ${detail}`);
      return;
    }

    try {
      const queueItem: SyncQueueItem = {
        id: crypto.randomUUID(),
        table: 'patients',
        operation: 'create',
        payload: patient,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      await putRecord('syncQueue', queueItem);
    } catch (err) {
      console.error('Failed to queue patient for sync', err);
    }

    setMessage(`Saved patient ${patient.full_name} offline.`);
  };

  const riskOptions = useMemo(() => ['Pre-eclampsia', 'Diabetes', 'Previous C-section', 'Anaemia'], []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Full name" registration={register('full_name')} error={errors.full_name?.message} />
        <FormField label="Age" registration={register('age')} error={errors.age?.message} type="number" />
        <FormField label="Phone" registration={register('phone')} error={errors.phone?.message} />
        <FormField label="Village" registration={register('village')} error={errors.village?.message} />
        <FormField label="Address" registration={register('address')} error={errors.address?.message} containerClassName="md:col-span-2" />
        <FormField label="EDD" registration={register('edd')} error={errors.edd?.message} type="date" />
        <FormField label="Gravida" registration={register('gravida')} error={errors.gravida?.message} type="number" />
        <FormField label="Para" registration={register('para')} error={errors.para?.message} type="number" />
        <FormField label="Emergency contact" registration={register('emergency_contact')} error={errors.emergency_contact?.message} containerClassName="md:col-span-2" />
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

      <Button type="submit" disabled={isSubmitting} fullWidth={false}>
        {isSubmitting ? 'Saving...' : 'Save patient offline'}
      </Button>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
