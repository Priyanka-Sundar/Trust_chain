interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-3xl text-ink-900">{title}</h1>
        {badge && (
          <span className="pill bg-cream-200 text-ink-900">{badge}</span>
        )}
      </div>
      {subtitle && <p className="text-ink-900/60 mt-1.5 text-sm">{subtitle}</p>}
    </div>
  );
}
