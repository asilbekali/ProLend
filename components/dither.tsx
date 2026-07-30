type Edge = "left" | "right" | "top" | "bottom";

const MASKS: Record<Edge, string> = {
  left: "linear-gradient(to right, black, transparent 62%)",
  right: "linear-gradient(to left, black, transparent 62%)",
  top: "linear-gradient(to bottom, black, transparent 62%)",
  bottom: "linear-gradient(to top, black, transparent 62%)",
};

/**
 * Halftone dot texture (Ref A) that bleeds in from one edge and fades out via a
 * mask. Absolutely positioned — drop it into a `relative` container. Decorative
 * only. Tint/opacity via `className` (the dots use `currentColor`).
 */
export default function Dither({
  edge = "left",
  className = "text-white/[0.16]",
}: {
  edge?: Edge;
  className?: string;
}) {
  const mask = MASKS[edge];
  return (
    <div
      aria-hidden="true"
      className={`dither-dots pointer-events-none absolute inset-0 ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}
