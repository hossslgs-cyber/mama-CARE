import { PageHeader } from '@/components/ui';

export default function CHWHomePage() {
  return (
    <section className="space-y-3">
      <PageHeader
        label="CHW Dashboard"
        title="Welcome to your home dashboard"
        description="This placeholder page will connect to patient, visit, and appointment workflows in later phases."
      />
    </section>
  );
}
