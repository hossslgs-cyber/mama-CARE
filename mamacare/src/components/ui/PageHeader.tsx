interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-teal-700">{label}</p>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {description ? <p className="text-slate-600">{description}</p> : null}
    </div>
  );
}
