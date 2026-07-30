import CornerMarks from "./corner-marks";

// Placeholder partner wordmarks (mono, muted) in a shared hairline row. Swap the
// labels for real logos when they're available.
const PARTNERS = ["NORTHWIND", "AXIOM", "LUMEN", "CADENCE"];

export default function LogoStrip() {
  return (
    <section aria-label="Trusted by" className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
      <div className="relative">
        <CornerMarks />
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
          {PARTNERS.map((p) => (
            <div
              key={p}
              className="flex items-center justify-center bg-bg px-6 py-8 font-mono text-sm uppercase tracking-[0.2em] text-white/45 transition-colors duration-300 hover:text-white/80"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
