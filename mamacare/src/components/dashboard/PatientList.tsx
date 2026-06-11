"use client";

import { useEffect, useState, useMemo } from 'react';
import { getAllRecords } from '@/lib/db/indexeddb';
import type { PatientRecord, VisitRecord } from '@/types';
import { calculateTriage } from '@/lib/utils/triage';
import Link from 'next/link';
import { Search, Filter, MapPin, Calendar, ChevronRight, User } from 'lucide-react';

export function PatientList() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [villageFilter, setVillageFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      const [p, v] = await Promise.all([
        getAllRecords<PatientRecord>('patients'),
        getAllRecords<VisitRecord>('visits'),
      ]);
      setPatients(p);
      setVisits(v);
      setLoading(false);
    }
    loadData();
  }, []);

  const villages = useMemo(() => {
    const v = new Set(patients.map(p => p.village));
    return ['All', ...Array.from(v)];
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) || 
                           p.phone.includes(search);
      const matchesVillage = villageFilter === 'All' || p.village === villageFilter;
      return matchesSearch && matchesVillage;
    });
  }, [patients, search, villageFilter]);

  const getPatientStatus = (patientId: string) => {
    const patientVisits = visits.filter(v => v.patient_id === patientId)
      .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());
    
    if (patientVisits.length === 0) return { level: 'green', label: 'New' };
    
    const latestTriage = calculateTriage(patientVisits[0]);
    return { level: latestTriage.triage_level, label: latestTriage.triage_level.toUpperCase() };
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white outline-none"
          >
            {villages.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredPatients.length > 0 ? filteredPatients.map((patient) => {
          const status = getPatientStatus(patient.id);
          return (
            <Link 
              key={patient.id} 
              href={`/chw/patients/${patient.id}`}
              className="group flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-sm hover:border-teal-200 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  status.level === 'red' ? 'bg-rose-100 text-rose-600' :
                  status.level === 'yellow' ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{patient.full_name}</h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {patient.village}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> EDD: {new Date(patient.edd).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  status.level === 'red' ? 'bg-rose-100 text-rose-700' :
                  status.level === 'yellow' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {status.label}
                </span>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
              </div>
            </Link>
          );
        }) : (
          <div className="py-12 text-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-slate-500">No mothers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
