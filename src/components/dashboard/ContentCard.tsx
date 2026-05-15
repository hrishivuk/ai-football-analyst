export default function ContentCard({
  children,
  className = "",
  title,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={`content-card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 mb-5">
          {title && (
            <h2 className="font-(family-name:--font-display) text-base font-bold text-primary">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
