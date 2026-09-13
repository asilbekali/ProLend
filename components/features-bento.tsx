"use client";

import { motion, type Variants } from "motion/react";
import {
  AudioLines,
  Captions,
  Code2,
  Globe,
  ScanFace,
  Users,
} from "lucide-react";
import Frame, { Inner } from "./frame";
import SectionHead from "./section-head";

/* ── Mini area chart ─────────────────────────────────────────────────────────
   Values are normalised to the box, so the same component draws any series.
   Deterministic maths only — SSR and client must serialise identical paths. */

function Spark({ values, color }: { values: number[]; color: string }) {
  const w = 200;
  const h = 56;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pt = (v: number, i: number) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 8) - 4;
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100] as const;
  };
  const pts = values.map(pt);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}

const TILES = [
  {
    label: "Time to publish",
    value: "4 min",
    delta: "99% faster",
    caption: "vs. a booked studio",
    color: "#15803d",
    series: [42, 38, 30, 26, 20, 15, 11, 8, 6],
    axis: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
  },
  {
    label: "Cost per language",
    value: "−94%",
    delta: "per finished minute",
    caption: "vs. a voice actor",
    color: "#1d4ed8",
    series: [40, 36, 34, 25, 22, 14, 10, 7, 5],
    axis: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
  },
];

const FORMATS = [
  { label: "Creators", icon: <AudioLines className="h-4 w-4" /> },
  { label: "Courses", icon: <Users className="h-4 w-4" /> },
  { label: "Streams", icon: <Globe className="h-4 w-4" /> },
  { label: "Podcasts", icon: <Captions className="h-4 w-4" /> },
];

const FEATURES = [
  {
    title: "Voice cloning",
    body: "Reproduce a speaker's timbre from three seconds of reference audio, consistent across every translated line.",
    icon: <AudioLines className="h-4 w-4" />,
    tint: "bg-tint-violet-bg text-tint-violet-fg",
  },
  {
    title: "Lip sync",
    body: "Mouth movement realigned to the dubbed audio so it reads as spoken, not overdubbed.",
    icon: <ScanFace className="h-4 w-4" />,
    tint: "bg-tint-blue-bg text-tint-blue-fg",
  },
  {
    title: "40+ languages",
    body: "One source, many outputs — add a language without re-recording anything.",
    icon: <Globe className="h-4 w-4" />,
    tint: "bg-tint-green-bg text-tint-green-fg",
  },
  {
    title: "Speaker diarization",
    body: "Multiple voices on a track are separated and cloned individually — panels and interviews included.",
    icon: <Users className="h-4 w-4" />,
    tint: "bg-tint-orange-bg text-tint-orange-fg",
  },
  {
    title: "API access",
    body: "Drive the whole pipeline programmatically and wire dubbing into your own product.",
    icon: <Code2 className="h-4 w-4" />,
    tint: "bg-tint-rose-bg text-tint-rose-fg",
  },
  {
    title: "Subtitle export",
    body: "Download aligned captions in SRT and VTT alongside every dubbed track, ready to ship.",
    icon: <Captions className="h-4 w-4" />,
    tint: "bg-tint-amber-bg text-tint-amber-fg",
  },
];

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function FeaturesBento() {
  return (
    <Frame as="section" bleed id="features" className="border-b border-line">
      <Inner className="py-12 md:py-16">
        <SectionHead
          title="Everything the pipeline ships"
          sub="Six capabilities that together replace a studio, a translator, and a subtitling vendor."
        />

        {/* Two feature cards — the reference's light-grey panels holding white
            data tiles. */}
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-10 grid gap-4 md:grid-cols-2"
        >
          <motion.article variants={cell} className="rounded-2xl bg-surface p-6 sm:p-7">
            <h3 className="font-display text-lg font-medium text-text">
              Faster than a studio
            </h3>
            <p className="mt-1.5 text-sm text-text-2">
              Start publishing in minutes, not booking weeks out.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {TILES.map((t) => (
                <div key={t.label} className="rounded-xl border border-line bg-bg p-3.5">
                  <p className="text-[11px] text-text-2">{t.label}</p>
                  <p className="mt-0.5 font-display text-2xl font-medium text-text">
                    {t.value}
                  </p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium"
                      style={{ color: t.color, backgroundColor: `${t.color}14` }}
                    >
                      ↓ {t.delta}
                    </span>
                    <span className="text-[10px] text-text-3">{t.caption}</span>
                  </p>
                  <div className="mt-2">
                    <Spark values={t.series} color={t.color} />
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[9px] text-text-3">
                    {t.axis.map((a) => (
                      <span key={a}>{a}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article variants={cell} className="rounded-2xl bg-surface p-6 sm:p-7">
            <h3 className="font-display text-lg font-medium text-text">
              Built for how you publish
            </h3>
            <p className="mt-1.5 text-sm text-text-2">
              One pipeline behind every format you already ship.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {FORMATS.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-3 rounded-xl border border-line bg-bg px-4 py-3.5"
                >
                  <span className="text-accent" aria-hidden="true">
                    {f.icon}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-text">
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        </motion.div>

        {/* The six capabilities */}
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.article
              key={f.title}
              variants={cell}
              className="flex flex-col rounded-2xl bg-surface p-6 transition-colors duration-300 hover:bg-surface-2"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${f.tint}`}
                aria-hidden="true"
              >
                {f.icon}
              </span>
              <h3 className="mt-4 font-display text-base font-medium text-text">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-2">{f.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </Inner>
    </Frame>
  );
}
