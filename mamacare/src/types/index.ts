export type UserRole = 'chw' | 'nurse';

export interface PatientRecord {
  id: string;
  full_name: string;
  age: number;
  phone: string;
  village: string;
  address: string;
  edd: string;
  gravida: number;
  para: number;
  risk_factors: string[];
  emergency_contact?: string;
  chw_id?: string;
  risk_level?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface VisitRecord {
  id: string;
  patient_id: string;
  visit_date: string;
  visit_type: 'home' | 'clinic';
  blood_pressure?: string;
  weight?: number;
  fundal_height?: number;
  fetal_heart_rate?: number;
  urine?: string;
  symptoms?: string[];
  notes?: string;
  chw_id?: string;
  created_at: string;
}

export interface AppointmentRecord {
  id: string;
  patient_id: string;
  appointment_date: string;
  location: 'home' | 'clinic';
  purpose: string;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
  reminder_enabled?: boolean;
  created_at: string;
}

export interface SyncQueueItem {
  id: string;
  table: string;
  operation: 'create' | 'update' | 'delete';
  payload: unknown;
  status: 'pending' | 'synced' | 'failed';
  created_at: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  role: UserRole;
  name?: string;
}

export interface DecisionTreeResult {
  triage_level: 'green' | 'yellow' | 'red';
  summary: string;
  action_steps: string[];
  referral_needed: boolean;
}
