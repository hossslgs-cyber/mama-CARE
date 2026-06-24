import { demoPatients } from './demo-data';
import { putRecord, getAllRecords } from './db/indexeddb';
import type { PatientRecord, VisitRecord } from '@/types';

export async function seedDemoDataIfNeeded(): Promise<void> {
  const existing = await getAllRecords<PatientRecord>('patients');
  if (existing.length > 0) return;

  const patientRecords: PatientRecord[] = demoPatients.map(p => ({
    id: p.id,
    full_name: p.fullName,
    age: p.age,
    phone: p.phone,
    village: p.village,
    address: p.village,
    edd: p.edd,
    gravida: p.gravida,
    para: p.para,
    risk_factors: p.riskFactors,
    risk_level: p.riskLevel,
    chw_id: p.visits[0]?.chwId ?? 'chw-demo',
    created_at: p.visits[0]?.visitDate + 'T08:00:00Z',
    updated_at: p.visits[p.visits.length - 1]?.visitDate + 'T08:00:00Z',
  }));

  const visitRecords: VisitRecord[] = demoPatients.flatMap(p =>
    p.visits.map(v => ({
      id: v.id,
      patient_id: p.id,
      visit_date: v.visitDate,
      visit_type: 'home' as const,
      blood_pressure: `${v.bpSystolic}/${v.bpDiastolic}`,
      weight: v.weight,
      notes: v.notes,
      chw_id: v.chwId,
      created_at: v.visitDate + 'T08:00:00Z',
    }))
  );

  for (const pr of patientRecords) {
    await putRecord('patients', pr);
  }
  for (const vr of visitRecords) {
    await putRecord('visits', vr);
  }
}
