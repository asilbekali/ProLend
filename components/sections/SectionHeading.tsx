export default function SectionHeading({
  eyebrow,
  title,
  subtitle
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 text-center">
      {eyebrow && <span className="text-xs uppercase tracking-widest text-accent">{eyebrow}</span>}
      <h2 className="font-pixel text-base leading-relaxed tracking-wide text-foreground sm:text-2xl">{title}</h2>
      {subtitle && <p className="text-balance text-base text-muted sm:text-lg">{subtitle}</p>}
    </div>
  );
}
