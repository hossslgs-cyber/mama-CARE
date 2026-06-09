import { PatientForm } from '@/components/forms/PatientForm';

export default function NewPatientPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-teal-700">New Patient</p>
        <h2 className="text-2xl font-semibold text-slate-900">Create a patient record</h2>
      </div>
      <PatientForm />
    </section>
  );
}
