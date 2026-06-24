"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentFormValues } from '@/lib/validation/appointment';
import { putRecord } from '@/lib/db/indexeddb';
import type { AppointmentRecord, SyncQueueItem } from '@/types';
import { Calendar, CheckCircle } from 'lucide-react';

interface AppointmentFormProps {
  patientId: string;
}

export function AppointmentForm({ patientId }: AppointmentFormProps) {
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      appointment_date: '',
      location: 'home',
      purpose: '',
      reminder_enabled: true,
    },
  });

  const onSubmit: SubmitHandler<AppointmentFormValues> = async (values) => {
    const appointment: AppointmentRecord = {
      id: crypto.randomUUID(),
      patient_id: patientId,
      appointment_date: values.appointment_date,
      location: values.location,
      purpose: values.purpose,
      status: 'scheduled',
      reminder_enabled: values.reminder_enabled,
      created_at: new Date().toISOString(),
    };

    await putRecord('appointments', appointment);

    const queueItem: SyncQueueItem = {
      id: crypto.randomUUID(),
      table: 'appointments',
      operation: 'create',
      payload: appointment,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    await putRecord('syncQueue', queueItem);

    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {isSaved ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-emerald-50 p-8 text-center border border-emerald-100">
          <CheckCircle className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-xl font-bold text-emerald-900">Appointment Scheduled!</h3>
          <p className="text-slate-600">The follow-up has been recorded and queued for sync.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium text-slate-700">Date and Time</span>
              <input type="datetime-local" {...register('appointment_date')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              {errors.appointment_date && <p className="text-xs text-rose-600">{errors.appointment_date.message}</p>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-slate-700">Location</span>
              <select {...register('location')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="home">Home Visit</option>
                <option value="clinic">Clinic Referral</option>
              </select>
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Purpose of Visit</span>
              <input placeholder="e.g., Routine ANC check, BP monitoring" {...register('purpose')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              {errors.purpose && <p className="text-xs text-rose-600">{errors.purpose.message}</p>}
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <input type="checkbox" {...register('reminder_enabled')} className="h-5 w-5 rounded border-slate-300 text-teal-700" />
            <span className="text-sm font-medium text-slate-700">Enable SMS reminder for mother</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-4 text-lg font-bold text-white hover:bg-black disabled:opacity-60 transition-all active:scale-95"
          >
            <Calendar className="h-5 w-5" />
            {isSubmitting ? 'Scheduling...' : 'Confirm Appointment'}
          </button>
        </form>
      )}
    </div>
  );
}
