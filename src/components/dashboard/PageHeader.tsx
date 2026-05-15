export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        {badge && (
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            {badge}
          </span>
        )}
        <h1 className="font-(family-name:--font-display) text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-secondary text-sm mt-1.5 max-w-xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
