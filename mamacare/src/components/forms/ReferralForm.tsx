"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { referralSchema, type ReferralFormValues } from '@/lib/validation/referral';
import { putRecord } from '@/lib/db/indexeddb';
import type { SyncQueueItem } from '@/types';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReferralFormProps {
  patientId: string;
}

export function ReferralForm({ patientId }: ReferralFormProps) {
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReferralFormValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      patient_id: patientId,
      referral_date: new Date().toISOString().split('T')[0],
      urgency: 'routine',
      transport_arranged: false,
    },
  });

  const onSubmit: SubmitHandler<ReferralFormValues> = async (values) => {
    const referral = {
      ...values,
      id: crypto.randomUUID(),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Save locally
    await putRecord('syncQueue', {
      id: crypto.randomUUID(),
      table: 'referrals',
      operation: 'create',
      payload: referral,
      status: 'pending',
      created_at: new Date().toISOString(),
    } as SyncQueueItem);

    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {isSaved ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-emerald-50 p-10 text-center border border-emerald-100">
          <CheckCircle2 className="h-16 w-16 text-emerald-600 mb-4" />
          <h3 className="text-2xl font-black text-emerald-900">Referral Issued</h3>
          <p className="text-slate-600 mt-2">The referral has been logged and the facility will be notified upon sync.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-bold text-slate-700">Referral Date</span>
              <input type="date" {...register('referral_date')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-bold text-slate-700">Urgency</span>
              <select {...register('urgency')} className={`w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold ${
                errors.urgency ? 'bg-rose-50' : 'bg-slate-50'
              }`}>
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency (Immediate)</option>
              </select>
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-bold text-slate-700">Target Health Facility</span>
              <input placeholder="e.g., District General Hospital" {...register('facility_name')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              {errors.facility_name && <p className="text-xs text-rose-600">{errors.facility_name.message}</p>}
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-bold text-slate-700">Primary Reason for Referral</span>
              <textarea rows={3} placeholder="Describe the clinical findings and danger signs..." {...register('reason')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              {errors.reason && <p className="text-xs text-rose-600">{errors.reason.message}</p>}
            </label>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-bold text-amber-900">Logistics Check</span>
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register('transport_arranged')} className="h-6 w-6 rounded-lg border-slate-300 text-teal-700" />
              <span className="text-sm font-medium text-slate-700">Emergency transport has been arranged for the mother</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-rose-600 px-6 py-4 text-xl font-black text-white shadow-xl shadow-rose-100 hover:bg-rose-700 disabled:opacity-60 transition-all active:scale-95"
          >
            <Send className="h-6 w-6" />
            {isSubmitting ? 'Issuing Referral...' : 'Issue Referral'}
          </button>
        </form>
      )}
    </div>
  );
}
