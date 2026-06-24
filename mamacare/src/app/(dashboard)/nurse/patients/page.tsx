"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { demoPatients } from '@/lib/demo-data';

const mappedPatients = demoPatients.map(p => ({
  id: p.id,
  name: p.fullName,
  full_name: p.fullName,
  village: p.village,
  edd: p.edd,
  gravida: p.gravida,
  para: p.para,
  age: p.age,
  phone: p.phone,
  risk_factors: p.riskLevel === 'low' ? [] : p.riskFactors,
  created_at: p.visits[0]?.visitDate + 'T00:00:00Z',
  updated_at: p.visits[p.visits.length - 1]?.visitDate + 'T00:00:00Z',
}));

export default function NursePatientsPage() {
  const [patients] = useState(mappedPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'Moderate' | 'Normal'>('All');

  const getRiskLevel = (riskFactors: string[] | null | undefined): 'Critical' | 'Moderate' | 'Normal' => {
    if (!riskFactors || riskFactors.length === 0) return 'Normal';
    const criticalTerms = ['critical', 'severe', 'preeclampsia', 'hemorrhage'];
    const hasCritical = riskFactors.some(factor =>
      criticalTerms.some(term => factor.toLowerCase().includes(term))
    );
    return hasCritical ? 'Critical' : 'Moderate';
  };

  const getRiskBadgeStyles = (risk: 'Critical' | 'Moderate' | 'Normal') => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700';
      case 'Normal':
        return 'bg-emerald-50 text-emerald-700';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const risk = getRiskLevel(patient.risk_factors);
    const matchesFilter = activeFilter === 'All' || risk === activeFilter;

    const query = searchTerm.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(query) ||
      patient.village.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex items-center gap-6">
        <Link href="/nurse" className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200 transition-all">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-teal-700 font-black">All Patients</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Patient Registry</h2>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, village, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-100 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Critical', 'Moderate', 'Normal'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-2xl px-5 py-3 text-xs uppercase tracking-widest transition-all ${
                activeFilter === filter
                  ? 'bg-teal-600 text-white font-black'
                  : 'bg-slate-100 text-slate-600 font-bold hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500 font-bold">No patients found matching your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const risk = getRiskLevel(patient.risk_factors);
            return (
              <Link href={`/nurse/patients/${patient.id}`} key={patient.id} className="group block">
                <section className="h-full rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100 hover:border-teal-500/20 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Top Row: Risk Level & Chevron */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider ${getRiskBadgeStyles(risk)}`}>
                        {risk === 'Normal' ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className={`h-4 w-4 ${risk === 'Critical' ? 'animate-heartbeat' : ''}`} />
                        )}
                        {risk}
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Name & ID */}
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                        {patient.name}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                        ID: ANC-{patient.id.slice(0, 8)}
                      </p>
                    </div>

                    {/* Stats & Gravida/Para */}
                    <div className="pt-2 border-t border-slate-50 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{patient.village}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>EDD: {new Date(patient.edd).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gravida & Para Footer */}
                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Gravida</p>
                      <p className="text-lg font-black text-slate-900">G{patient.gravida}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Para</p>
                      <p className="text-lg font-black text-slate-900">P{patient.para}</p>
                    </div>
                  </div>
                </section>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
