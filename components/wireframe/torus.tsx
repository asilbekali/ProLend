/**
 * Thin-line wireframe torus, approximated by concentric tilted ellipses.
 * Decorative; size/position/tint via `className`. Rotates slowly.
 */
export default function WireTorus({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-spin-slow ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        className="h-full w-full text-white/25"
      >
        <g transform="rotate(-20 100 100)">
          <ellipse cx="100" cy="100" rx="82" ry="34" />
          <ellipse cx="100" cy="100" rx="46" ry="18" />
          <ellipse cx="100" cy="100" rx="64" ry="26" />
          <ellipse cx="100" cy="100" rx="82" ry="34" transform="rotate(60 100 100)" />
          <ellipse cx="100" cy="100" rx="82" ry="34" transform="rotate(120 100 100)" />
        </g>
      </svg>
    </div>
  );
}
