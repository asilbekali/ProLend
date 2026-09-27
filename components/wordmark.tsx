"use client";

import type { ElementType } from "react";
import { motion, type Variants } from "motion/react";

const TEXT = "TH-Labs";

// Per-character entrance: rise + blur-to-focus. Consumed by the hero's master
// timeline — the container inherits `show` from its parent and cascades to the
// chars, so the reveal fires in sequence after the badge.
const charContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const charItem: Variants = {
  hidden: { y: 40, opacity: 0, filter: "blur(12px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

type WordmarkProps = {
  /** Element to render as (plain mode only). Defaults to <span>. */
  as?: ElementType;
  className?: string;
  /**
   * Render each character as an individually-animated span driven by the parent
   * Framer timeline (the hero headline "money shot"). Omit for a static mark.
   */
  charReveal?: boolean;
  /** Extra classes applied to every character span (e.g. the gradient fill). */
  charClassName?: string;
};

/**
 * The single source of truth for the "TH-Labs" wordmark — always the brand face
 * (`font-brand` → Archivo 700), set tight and near-black so it reads as the same
 * cut letters as the signage beside the mark. Never hardcode it elsewhere.
 *
 * Two modes:
 *  • default — static text, used in the navbar.
 *  • `charReveal` — a motion container of per-character spans for the hero
 *    headline. The gradient fill is passed via `charClassName` and applied
 *    per-char; because the fill is a *vertical* gradient, per-char and
 *    whole-word rendering are visually identical (no seams).
 */
export default function Wordmark({
  as: Tag = "span",
  className = "",
  charReveal = false,
  charClassName = "",
}: WordmarkProps) {
  // No `uppercase` here: the brand is cased "TH-Labs", not "TH-LABS". The
  // negative tracking is what makes the hyphen sit inside the word rather than
  // spacing it out — the pixel face needed the opposite.
  const base = "font-brand font-bold select-none leading-none tracking-[-0.03em]";

  if (charReveal) {
    return (
      <motion.span
        variants={charContainer}
        aria-label={TEXT}
        className={`${base} inline-flex ${className}`}
      >
        {TEXT.split("").map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            variants={charItem}
            aria-hidden="true"
            className={`inline-block ${charClassName}`}
          >
            {ch}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return <Tag className={`${base} ${className}`}>{TEXT}</Tag>;
}
