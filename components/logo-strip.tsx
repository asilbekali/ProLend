import Frame from "./frame";

// Placeholder partner wordmarks. Swap the labels for real logos when they're
// available — the row is built to take an <Image/> in place of the text.
const PARTNERS = ["NORTHWIND", "AXIOM", "LUMEN", "CADENCE", "MERIDIAN", "HALCYON"];

export default function LogoStrip() {
  return (
    <Frame as="section" bleed aria-label="Trusted by" className="border-b border-line">
      <p className="border-b border-line px-5 py-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-3 sm:px-8 sm:text-[11px] lg:px-12">
        Trusted by teams publishing in every language
      </p>
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
        {PARTNERS.map((p) => (
          <div
            key={p}
            className="flex items-center justify-center bg-bg px-4 py-7 font-display text-sm font-medium uppercase tracking-[0.14em] text-text-3 transition-colors duration-300 hover:text-text"
          >
            {p}
          </div>
        ))}
      </div>
    </Frame>
  );
}
