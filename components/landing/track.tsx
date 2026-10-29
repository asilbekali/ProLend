"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Lock } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import Live from "./live";
import { ExportCard } from "./cards";
import { CtaPair, Eyebrow, Waveform } from "./primitives";

/** "Your voice, built in." — the voice kit every dub draws from. */
function VoicePanel() {
  return (
    <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-0">
      <div className="text-center lg:text-left">
        <Eyebrow>Voice cloning</Eyebrow>
        <h2 className="mt-3 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.04] text-white">
          Your voice,
          <br />
          built in.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/50 lg:mx-0">
          Clone it once from about three seconds of audio. Every dub after that — any video, any
          language — speaks in it.
        </p>
        <CtaPair className="mt-6" />
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="panel w-full max-w-[300px] rounded-3xl p-4">
          <p className="flex items-center gap-1.5 text-[12px] text-white/70">
            Voice kit <Lock className="h-3 w-3 text-[var(--orange)]" />
          </p>
          <p className="mt-1 text-lg font-medium text-white">Your voice</p>
          <div className="mt-3 rounded-2xl bg-white/[0.05] p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">Reference · 3 s</p>
            <Waveform
              seed={9.3}
              count={30}
              className="mt-2 h-8 w-full justify-between"
              barClassName="bg-[var(--orange)]"
            />
          </div>
          <div className="mt-2 rounded-2xl bg-white/[0.05] p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">Speaks</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["O'zbek", "English", "Русский", "Español", "Türkçe", "+37"].map((l) => (
                <span
                  key={l}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 rounded-2xl bg-white/[0.05] p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">Keeps</p>
            <div className="mt-2 flex gap-1.5">
              {[
                ["Tone", "#ff7a1a"],
                ["Emotion", "#19c37d"],
                ["Pace", "#ffc128"],
              ].map(([k, c]) => (
                <span key={k} className="flex items-center gap-1 text-[11px] text-white/70">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /> {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-[260px] flex-col gap-3">
          <ExportCard name="vlog-12_uz.mp4" />
          <ExportCard name="podcast-12_ru.mp4" />
          <ExportCard name="launch-video_es.mp4" />
        </div>
      </div>
    </div>
  );
}

/** "Weeks become minutes." — the studio route against TH-Labs. */
function SpeedPanel() {
  const rows = [
    {
      name: "Dubbing studio",
      verdict: "Weeks · thousands of dollars",
      fill: 0.92,
      color: "linear-gradient(90deg,#ffc128,#ff5a3c)",
      tone: "text-[#ff8a70]",
      dots: 1,
    },
    {
      name: "TH-Labs",
      verdict: "Minutes · from $1.19",
      fill: 0.12,
      color: "var(--green)",
      tone: "text-[var(--green)]",
      dots: 42,
    },
  ];
  return (
    <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-0">
      <div className="text-center lg:text-left">
        <Eyebrow>The speed gap</Eyebrow>
        <h2 className="mt-3 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.04] text-white">
          Weeks become
          <br />
          minutes.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/50 lg:mx-0">
          Studios cost thousands and take weeks. TH-Labs dubs while you wait — and the same upload
          goes into every language you need.
        </p>
        <CtaPair className="mt-6" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.name} className="panel rounded-3xl p-4">
            <p className="text-[13px] font-medium text-white">{r.name}</p>
            <p className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-white/40">
              Time to a dub{" "}
              <span className={`normal-case tracking-normal ${r.tone}`}>{r.verdict}</span>
            </p>
            <div className="mt-2 flex h-3 gap-[2px] overflow-hidden rounded">
              {Array.from({ length: 30 }, (_, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-[1px]"
                  style={{ background: i / 30 < r.fill ? r.color : "rgba(255,255,255,0.08)" }}
                />
              ))}
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-white/40">
              Languages per upload
            </p>
            <div className="mt-2 grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1 sm:grid-cols-7 sm:gap-1.5">
              {Array.from({ length: 42 }, (_, i) => (
                <span
                  key={i}
                  className={`aspect-square rounded-full border ${
                    i < r.dots ? "border-[var(--green)] bg-[var(--green)]/25" : "border-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANELS = [Live, VoicePanel, SpeedPanel];

/**
 * The reference's sideways run: on desktop, scrolling down slides three
 * panels across, with the green stroke drawn through them. Phones stack the
 * same panels.
 */
export default function Track() {
  const ref = useRef<HTMLElement>(null);
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(
    scrollYProgress,
    [0.05, 0.95],
    ["0%", `-${((PANELS.length - 1) / PANELS.length) * 100}%`],
  );
  const draw = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  if (!wide) {
    return (
      <section ref={ref}>
        {PANELS.map((P, i) => (
          <P key={i} />
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: `${PANELS.length * 110}svh` }} className="relative">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          style={{ x, width: `${PANELS.length * 100}vw` }}
          className="relative flex h-full"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 3000 1000"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          >
            <motion.path
              d="M -40 860 C 300 1000, 420 640, 760 700 S 1200 980, 1500 760 S 1900 60, 2300 220 S 2900 760, 3060 520"
              fill="none"
              stroke="var(--green)"
              strokeWidth="70"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduce ? 1 : draw }}
            />
          </svg>
          {PANELS.map((P, i) => (
            <div key={i} className="relative z-10 flex h-full w-screen shrink-0 items-center">
              <P />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
