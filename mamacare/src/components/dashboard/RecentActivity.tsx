"use client";

import { useEffect, useState } from 'react';
import { getAllRecords } from '@/lib/db/indexeddb';
import type { VisitRecord, PatientRecord } from '@/types';
import { UserPlus, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      const [patients, visits] = await Promise.all([
        getAllRecords<PatientRecord>('patients'),
        getAllRecords<VisitRecord>('visits'),
      ]);

      const patientActivities = patients.map(p => ({
        id: p.id,
        type: 'registration',
        title: `Registered ${p.full_name}`,
        subtitle: `Village: ${p.village}`,
        date: new Date(p.created_at),
        icon: UserPlus,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        link: `/chw/patients/${p.id}`
      }));

      const visitActivities = visits.map(v => {
        const patient = patients.find(p => p.id === v.patient_id);
        return {
          id: v.id,
          type: 'visit',
          title: `Visit logged: ${patient?.full_name || 'Unknown'}`,
          subtitle: v.visit_type === 'home' ? 'Home Visit' : 'Clinic Visit',
          date: new Date(v.created_at),
          icon: Activity,
          color: 'text-teal-600',
          bg: 'bg-teal-50',
          link: `/chw/patients/${v.patient_id}`
        };
      });

      const combined = [...patientActivities, ...visitActivities]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

      setActivities(combined);
      setLoading(false);
    }
    loadActivities();
  }, []);

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-3">
      {activities.length > 0 ? activities.map((act) => (
        <Link key={act.id} href={act.link} className="group flex items-center justify-between rounded-2xl border border-slate-50 bg-white p-4 shadow-sm hover:border-teal-100 transition-all">
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${act.bg} ${act.color}`}>
              <act.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{act.title}</p>
              <p className="text-xs text-slate-500">{act.subtitle} • {act.date.toLocaleDateString()}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500" />
        </Link>
      )) : (
        <p className="py-8 text-center text-sm text-slate-400 italic">No recent activity found.</p>
      )}
    </div>
  );
}
