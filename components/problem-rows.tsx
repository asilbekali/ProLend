"use client";

import { motion, type Variants } from "motion/react";
import { AudioLines, Globe, Radio, ScanFace } from "lucide-react";
import Frame, { Inner } from "./frame";

const BARS = [
  { label: "Voice cloning", icon: <AudioLines className="h-4 w-4" />, bg: "bg-cat-voice" },
  { label: "Lip sync", icon: <ScanFace className="h-4 w-4" />, bg: "bg-cat-sync" },
  { label: "40+ languages", icon: <Globe className="h-4 w-4" />, bg: "bg-cat-lang" },
  { label: "Real time", icon: <Radio className="h-4 w-4" />, bg: "bg-cat-live" },
];

const stack: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
// Enters on the Y axis deliberately: an X-axis entrance pushes the full-width
// bars past the right edge of a narrow viewport and gives the whole document a
// horizontal scrollbar before the element is ever scrolled into view.
const bar: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProblemRows() {
  return (
    <Frame as="section" bleed className="border-b border-line">
      <Inner className="grid items-center gap-10 py-14 md:grid-cols-2 md:gap-14 md:py-18">
        {/* Copy — the two-tone headline: statement in ink, question in grey. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-[1.1]">
            <span className="block text-text">You&apos;re already making great work.</span>
            <span className="mt-1 block text-text-3">
              Why does it still stop at one language?
            </span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-2">
            Studio bookings, a separate voice actor per language, subtitle vendors, weeks
            of turnaround — none of that should decide who gets to watch. TH-LABS handles
            the whole pipeline so you can publish everywhere at once.
          </p>
        </motion.div>

        {/* Colored bars — a solid, saturated stack, the reference's loudest
            block of color on an otherwise white page. */}
        <motion.ul
          variants={stack}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15% 0px" }}
          className="flex flex-col gap-2.5"
        >
          {BARS.map((b) => (
            <motion.li
              key={b.label}
              variants={bar}
              className={`flex items-center gap-3 rounded-xl px-5 py-4 text-white ${b.bg}`}
            >
              <span aria-hidden="true">{b.icon}</span>
              <span className="font-display text-lg font-medium">{b.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </Inner>
    </Frame>
  );
}
