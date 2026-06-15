import { PageHeader } from '@/components/ui';
import { PatientForm } from '@/components/forms/PatientForm';

export default function NewPatientPage() {
  return (
    <section className="space-y-4">
      <PageHeader
        label="New Patient"
        title="Create a patient record"
      />
      <PatientForm />
    </section>
  );
}
