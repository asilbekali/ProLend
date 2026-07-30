/**
 * Thin-line wireframe globe (Ref A). Near-black-friendly white strokes, slowly
 * rotating. Decorative; size/position/tint via `className`.
 */
export default function WireGlobe({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-spin-slow ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        className="h-full w-full text-white/25"
      >
        <circle cx="100" cy="100" r="80" />
        <ellipse cx="100" cy="100" rx="80" ry="26" />
        <ellipse cx="100" cy="100" rx="80" ry="52" />
        <ellipse cx="100" cy="100" rx="26" ry="80" />
        <ellipse cx="100" cy="100" rx="52" ry="80" />
        <line x1="20" y1="100" x2="180" y2="100" />
        <line x1="100" y1="20" x2="100" y2="180" />
      </svg>
    </div>
  );
}
