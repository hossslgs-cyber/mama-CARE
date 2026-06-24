"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Activity,
  Calendar,
  Baby,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  TrendingUp
} from 'lucide-react';

const DEMO_PATIENTS = [
  {
    id: 'demo-001',
    name: 'Aminata Conteh',
    village: 'Kono',
    edd: '2026-08-15',
    gravida: 2,
    para: 1,
    age: 24,
    phone: '+23276123456',
    risk_factors: ['severe_anemia', 'preeclampsia'],
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-15T14:30:00Z'
  },
  {
    id: 'demo-002',
    name: 'Fatima Kamara',
    village: 'Bo',
    edd: '2026-09-20',
    gravida: 1,
    para: 0,
    age: 19,
    phone: '+23276987654',
    risk_factors: [],
    created_at: '2026-06-05T09:00:00Z',
    updated_at: '2026-06-18T11:00:00Z'
  },
  {
    id: 'demo-003',
    name: 'Mariama Sesay',
    village: 'Makeni',
    edd: '2026-07-30',
    gravida: 3,
    para: 2,
    age: 28,
    phone: '+23276543210',
    risk_factors: ['gestational_diabetes'],
    created_at: '2026-05-20T08:00:00Z',
    updated_at: '2026-06-10T16:00:00Z'
  },
  {
    id: 'demo-004',
    name: 'Isatu Bangura',
    village: 'Kono',
    edd: '2026-10-05',
    gravida: 1,
    para: 0,
    age: 22,
    phone: '+23276111111',
    risk_factors: [],
    created_at: '2026-06-10T12:00:00Z',
    updated_at: '2026-06-20T10:00:00Z'
  },
  {
    id: 'demo-005',
    name: 'Adama Jalloh',
    village: 'Freetown',
    edd: '2026-08-01',
    gravida: 2,
    para: 1,
    age: 26,
    phone: '+23276222222',
    risk_factors: ['hypertension', 'previous_c_section'],
    created_at: '2026-04-15T07:00:00Z',
    updated_at: '2026-06-12T13:00:00Z'
  }
];

const DEMO_VISITS = [
  { id: 'v-001', patient_id: 'demo-001', visit_date: '2026-06-15', chw_id: 'chw-001', bp_systolic: 140, bp_diastolic: 90, weight: 68, notes: 'Patient reports headache' },
  { id: 'v-002', patient_id: 'demo-002', visit_date: '2026-06-18', chw_id: 'chw-002', bp_systolic: 120, bp_diastolic: 80, weight: 55, notes: 'Normal checkup' },
  { id: 'v-003', patient_id: 'demo-003', visit_date: '2026-06-10', chw_id: 'demo-001', bp_systolic: 130, bp_diastolic: 85, weight: 72, notes: 'Blood sugar elevated' },
  { id: 'v-004', patient_id: 'demo-001', visit_date: '2026-05-20', chw_id: 'chw-001', bp_systolic: 138, bp_diastolic: 88, weight: 66, notes: 'Follow-up required' },
  { id: 'v-005', patient_id: 'demo-005', visit_date: '2026-06-12', chw_id: 'chw-003', bp_systolic: 150, bp_diastolic: 95, weight: 70, notes: 'High BP, referred to clinic' }
];

export default function NurseAnalyticsPage() {
  const [patients] = useState(DEMO_PATIENTS);
  const [visits] = useState(DEMO_VISITS);

  const getRiskLevel = (riskFactors: string[] | null | undefined): 'Critical' | 'Moderate' | 'Normal' => {
    if (!riskFactors || riskFactors.length === 0) return 'Normal';
    const criticalTerms = ['critical', 'severe', 'preeclampsia', 'hemorrhage'];
    const hasCritical = riskFactors.some(factor =>
      criticalTerms.some(term => factor.toLowerCase().includes(term))
    );
    return hasCritical ? 'Critical' : 'Moderate';
  };

  // Calculate statistics
  const totalPatients = patients.length;
  const totalVisits = visits.length;

  const thisMonthVisits = visits.filter(visit => {
    const vDate = new Date(visit.visit_date);
    // Hardcoded current month check for mock presentation date context (June 2026)
    return vDate.getMonth() === 5 && vDate.getFullYear() === 2026;
  }).length;

  const avgVisits = totalPatients > 0 ? (totalVisits / totalPatients).toFixed(1) : '0';

  // Risk distribution
  let criticalCount = 0;
  let moderateCount = 0;
  let normalCount = 0;

  patients.forEach(p => {
    const risk = getRiskLevel(p.risk_factors);
    if (risk === 'Critical') criticalCount++;
    else if (risk === 'Moderate') moderateCount++;
    else normalCount++;
  });

  const criticalPercent = totalPatients > 0 ? Math.round((criticalCount / totalPatients) * 100) : 0;
  const moderatePercent = totalPatients > 0 ? Math.round((moderateCount / totalPatients) * 100) : 0;
  const normalPercent = totalPatients > 0 ? Math.round((normalCount / totalPatients) * 100) : 0;

  // Village rankings
  const villageCounts: { [key: string]: number } = {};
  patients.forEach(p => {
    if (p.village) {
      const v = p.village.trim();
      villageCounts[v] = (villageCounts[v] || 0) + 1;
    }
  });

  const sortedVillages = Object.entries(villageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxVillagePatients = sortedVillages[0]?.[1] || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center gap-6">
        <Link href="/nurse" className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200 transition-all">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-700 font-black">Health Insights</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Analytics Dashboard</h2>
        </div>
      </header>

      {/* Grid: Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="rounded-2xl bg-teal-50 p-3.5 text-teal-600 transition-transform duration-300 group-hover:scale-110">
              <Users className="h-6 w-6" />
            </span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Total Patients</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{totalPatients}</h3>
        </section>

        {/* Total Visits */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="rounded-2xl bg-slate-100 p-3.5 text-slate-600">
              <Activity className="h-6 w-6" />
            </span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Total Visits</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{totalVisits}</h3>
        </section>

        {/* Visits This Month */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="rounded-2xl bg-amber-50 p-3.5 text-amber-600">
              <Calendar className="h-6 w-6" />
            </span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Visits This Month</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{thisMonthVisits}</h3>
        </section>

        {/* Avg Visits Per Patient */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-600">
              <Baby className="h-6 w-6" />
            </span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Avg Visits / Patient</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{avgVisits}</h3>
        </section>
      </div>

      {/* Risk Distribution & Villages */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Risk Distribution */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="mb-8 flex items-center gap-2 text-xl font-black text-slate-900">
            <AlertTriangle className="h-6 w-6 text-teal-600" />
            Risk Distribution
          </h3>
          <div className="space-y-6">
            {/* Critical */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full uppercase text-xs tracking-wider">Critical Risk</span>
                <span className="font-black text-slate-900">{criticalCount} ({criticalPercent}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${criticalPercent}%` }}
                />
              </div>
            </div>

            {/* Moderate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase text-xs tracking-wider">Moderate Risk</span>
                <span className="font-black text-slate-900">{moderateCount} ({moderatePercent}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${moderatePercent}%` }}
                />
              </div>
            </div>

            {/* Normal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase text-xs tracking-wider">Normal Risk</span>
                <span className="font-black text-slate-900">{normalCount} ({normalPercent}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${normalPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Top Villages */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="mb-8 flex items-center gap-2 text-xl font-black text-slate-900">
            <MapPin className="h-6 w-6 text-teal-600" />
            Top Villages
          </h3>
          <div className="space-y-6">
            {sortedVillages.length === 0 ? (
              <p className="text-slate-500 text-center py-6 font-bold">No village data available.</p>
            ) : (
              sortedVillages.map(([village, count], index) => {
                const percent = Math.round((count / maxVillagePatients) * 100);
                return (
                  <div key={village} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-400">#{index + 1}</span>
                        <span className="font-bold text-slate-700">{village}</span>
                      </div>
                      <span className="font-black text-slate-900">{count} {count === 1 ? 'patient' : 'patients'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Quick Actions Footer */}
      <footer className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-black text-white">
          <TrendingUp className="h-5 w-5 text-teal-400" />
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/nurse/patients"
            className="rounded-2xl bg-teal-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-teal-500 transition-all"
          >
            Patient Registry
          </Link>
          <Link
            href="/nurse"
            className="rounded-2xl border border-slate-700 bg-transparent px-6 py-3.5 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            Nurse Hub
          </Link>
        </div>
      </footer>
    </div>
  );
}
