import { PageHeader } from '@/components/ui';
import { PatientForm } from '@/components/forms/PatientForm';

export default function PatientRegistrationPage() {
  return (
    <section className="space-y-4">
      <PageHeader
        label="Patient Registration"
        title="Register a new mother offline"
        description="The form saves immediately to IndexedDB and queues the record for sync when online."
      />
      <PatientForm />
    </section>
  );
}
