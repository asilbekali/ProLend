"use client";

import { motion, type Variants } from "motion/react";
import SectionMarker from "./section-marker";
import CornerMarks from "./corner-marks";

type Feature = {
  title: string;
  body: string;
  span: string;
  glyph: React.ReactNode;
};

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 0.9,
};

const FEATURES: Feature[] = [
  {
    title: "Voice cloning",
    body: "Reproduce a speaker's timbre from three seconds of reference audio, consistent across every translated line.",
    span: "sm:col-span-2 lg:col-span-2",
    glyph: (
      <svg viewBox="0 0 120 40" className="h-10 w-28 text-white/30" {...stroke}>
        {Array.from({ length: 24 }).map((_, i) => {
          // Round so SSR and client serialize identical numbers (no float
          // precision hydration mismatch).
          const h = Math.round(4 + Math.abs(Math.sin(i * 0.9)) * 30);
          return <line key={i} x1={i * 5 + 2} y1={20 - h / 2} x2={i * 5 + 2} y2={20 + h / 2} />;
        })}
      </svg>
    ),
  },
  {
    title: "Lip sync",
    body: "Mouth movement realigned to the dubbed audio so it reads as spoken, not overdubbed.",
    span: "",
    glyph: (
      <svg viewBox="0 0 60 60" className="h-12 w-12 text-white/30" {...stroke}>
        <circle cx="30" cy="30" r="24" />
        <path d="M18 34 Q30 44 42 34" />
        <circle cx="22" cy="24" r="2" />
        <circle cx="38" cy="24" r="2" />
      </svg>
    ),
  },
  {
    title: "40+ languages",
    body: "One source, many outputs — add a language without re-recording anything.",
    span: "",
    glyph: (
      <svg viewBox="0 0 60 60" className="h-12 w-12 text-white/30" {...stroke}>
        <circle cx="30" cy="30" r="24" />
        <ellipse cx="30" cy="30" rx="24" ry="10" />
        <ellipse cx="30" cy="30" rx="10" ry="24" />
        <line x1="6" y1="30" x2="54" y2="30" />
      </svg>
    ),
  },
  {
    title: "Speaker diarization",
    body: "Multiple voices on a track are separated and cloned individually — panels and interviews included.",
    span: "",
    glyph: (
      <svg viewBox="0 0 60 60" className="h-12 w-12 text-white/30" {...stroke}>
        <circle cx="22" cy="26" r="9" />
        <circle cx="40" cy="34" r="9" />
        <path d="M8 52 Q22 40 34 52" />
      </svg>
    ),
  },
  {
    title: "API access",
    body: "Drive the whole pipeline programmatically and wire dubbing into your own product.",
    span: "",
    glyph: (
      <svg viewBox="0 0 80 40" className="h-10 w-16 text-white/30" {...stroke}>
        <path d="M22 8 L8 20 L22 32" />
        <path d="M58 8 L72 20 L58 32" />
        <line x1="46" y1="6" x2="34" y2="34" />
      </svg>
    ),
  },
  {
    title: "Subtitle export",
    body: "Download aligned captions in SRT and VTT alongside every dubbed track, ready to ship.",
    span: "sm:col-span-2 lg:col-span-3",
    glyph: (
      <svg viewBox="0 0 120 40" className="h-10 w-28 text-white/30" {...stroke}>
        <rect x="4" y="6" width="112" height="28" rx="3" />
        <line x1="14" y1="20" x2="70" y2="20" />
        <line x1="14" y1="27" x2="50" y2="27" />
      </svg>
    ),
  },
];

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const wipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  show: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function FeaturesBento() {
  return (
    <section
      id="features"
      className="relative mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 md:py-32 lg:px-12"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="mb-12 md:mb-16"
      >
        <SectionMarker index="03" label="FEATURES" />
        <motion.h2
          variants={wipe}
          className="mt-5 max-w-2xl text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-white"
        >
          Everything the pipeline ships.{" "}
          <span className="font-normal italic text-white/45">Nothing it doesn&apos;t.</span>
        </motion.h2>
      </motion.div>

      <div className="relative">
        <CornerMarks />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={grid}
          className="grid grid-cols-1 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.article
              key={f.title}
              variants={cell}
              className={`flex min-h-44 flex-col justify-between gap-6 bg-bg p-7 md:p-8 ${f.span}`}
            >
              <div aria-hidden="true">{f.glyph}</div>
              <div>
                <h3 className="font-mono text-lg font-medium tracking-tight text-white">{f.title}</h3>
                <p className="mt-2 max-w-[46ch] font-sans text-sm leading-relaxed text-white/55">
                  {f.body}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
