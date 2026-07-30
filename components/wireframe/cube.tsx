/**
 * Thin-line wireframe cube (two offset faces + connecting edges). Decorative;
 * size/position/tint via `className`. Rotates slowly.
 */
export default function WireCube({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-spin-slower ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        className="h-full w-full text-white/25"
      >
        {/* back face */}
        <rect x="60" y="40" width="90" height="90" />
        {/* front face */}
        <rect x="40" y="70" width="90" height="90" />
        {/* connecting edges */}
        <line x1="60" y1="40" x2="40" y2="70" />
        <line x1="150" y1="40" x2="130" y2="70" />
        <line x1="60" y1="130" x2="40" y2="160" />
        <line x1="150" y1="130" x2="130" y2="160" />
      </svg>
    </div>
  );
}
