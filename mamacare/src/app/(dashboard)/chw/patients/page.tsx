import { PatientForm } from '@/components/forms/PatientForm';

export default function PatientRegistrationPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-teal-700">Patient Registration</p>
        <h2 className="text-2xl font-semibold text-slate-900">Register a new mother offline</h2>
        <p className="text-slate-600">The form saves immediately to IndexedDB and queues the record for sync when online.</p>
      </div>
      <PatientForm />
    </section>
  );
}
