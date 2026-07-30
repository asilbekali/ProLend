"use client";

import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018 } },
};
const glyph: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.12 } },
};

/**
 * Editorial section marker in the Ref B style: `/ 01 — HOW IT WORKS`.
 * Mono, uppercase, wide tracking; types in glyph-by-glyph when scrolled into
 * view (collapses to a plain fade under reduced-motion via the global CSS + the
 * short per-glyph duration). The full string is exposed to AT via `aria-label`.
 */
export default function SectionMarker({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  const text = `/ ${index} — ${label}`;
  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      aria-label={text}
      className={`inline-flex font-mono text-xs uppercase tracking-[0.2em] text-white/40 ${className}`}
    >
      {text.split("").map((c, i) => (
        <motion.span key={i} variants={glyph} aria-hidden="true" className="whitespace-pre">
          {c}
        </motion.span>
      ))}
    </motion.span>
  );
}
