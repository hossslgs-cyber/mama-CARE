"use client";

import { useEffect, useState } from 'react';
import { getAllRecords } from '@/lib/db/indexeddb';
import type { PatientRecord, AppointmentRecord, SyncQueueItem, VisitRecord } from '@/types';
import { Users, AlertTriangle, CalendarClock, CloudSync, Activity } from 'lucide-react';
import { calculateTriage } from '@/lib/utils/triage';

export function AnalyticsSummary() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRiskCount: 0,
    upcomingAppointments: 0,
    pendingSync: 0,
    totalVisits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [patients, appointments, syncQueue, visits] = await Promise.all([
        getAllRecords<PatientRecord>('patients'),
        getAllRecords<AppointmentRecord>('appointments'),
        getAllRecords<SyncQueueItem>('syncQueue'),
        getAllRecords<VisitRecord>('visits'),
      ]);

      // Calculate high risk from latest visits
      const redVisits = visits.filter(v => calculateTriage(v).triage_level === 'red').length;

      setStats({
        totalPatients: patients.length,
        highRiskCount: redVisits,
        upcomingAppointments: appointments.filter(a => a.status === 'scheduled').length,
        pendingSync: syncQueue.filter(s => s.status === 'pending').length,
        totalVisits: visits.length,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-3xl" />;

  const cards = [
    { label: 'Total Mothers', value: stats.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Risk (Red)', value: stats.highRiskCount, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Upcoming', value: stats.upcomingAppointments, icon: CalendarClock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Pending Sync', value: stats.pendingSync, icon: CloudSync, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Visits Recorded', value: stats.totalVisits, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-3xl p-5 border border-slate-100 shadow-sm bg-white`}>
          <div className={`mb-3 inline-flex rounded-2xl ${card.bg} p-2`}>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          <p className="text-xs font-medium text-slate-500">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
