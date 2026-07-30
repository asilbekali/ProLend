/**
 * Four `+` crosshair glyphs sitting *on* the corners of the nearest positioned
 * ancestor (Ref A blueprint detail). The parent must be `relative`. Purely
 * decorative — `aria-hidden`, no pointer events. Pass `className` to retint.
 */
export default function CornerMarks({ className = "text-white/20" }: { className?: string }) {
  const base = `pointer-events-none absolute select-none font-mono text-[11px] leading-none ${className}`;
  return (
    <span aria-hidden="true">
      <span className={`${base} left-0 top-0 -translate-x-1/2 -translate-y-1/2`}>+</span>
      <span className={`${base} right-0 top-0 translate-x-1/2 -translate-y-1/2`}>+</span>
      <span className={`${base} bottom-0 left-0 -translate-x-1/2 translate-y-1/2`}>+</span>
      <span className={`${base} bottom-0 right-0 translate-x-1/2 translate-y-1/2`}>+</span>
    </span>
  );
}
