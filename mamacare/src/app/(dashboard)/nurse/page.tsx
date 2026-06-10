import { PageHeader } from '@/components/ui';

export default function NurseHomePage() {
  return (
    <section className="space-y-3">
      <PageHeader
        label="Nurse Dashboard"
        title="District nurse overview"
        description="Role-based access is now in place. Later phases will add the full patient reviews and filters here."
      />
    </section>
  );
}
