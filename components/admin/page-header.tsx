export default function AdminPageHeader({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {kicker && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-1.5">
          {kicker}
        </p>
      )}
      <h1 className="font-title text-3xl sm:text-[2.15rem] text-ink">{title}</h1>
      {description && (
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed max-w-lg">{description}</p>
      )}
    </div>
  );
}
