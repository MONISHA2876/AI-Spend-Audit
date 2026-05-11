export default function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 max-w-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        <span className="text-xs font-medium text-yellow-500 tracking-widest uppercase">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
