"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import SectionMarker from "./section-marker";
import CornerMarks from "./corner-marks";
import WireGlobe from "./wireframe/globe";
import WireCube from "./wireframe/cube";
import WireTorus from "./wireframe/torus";
import { useMediaQuery } from "@/hooks/use-media-query";

const CASES = [
  {
    tag: "Creators",
    body: "Ship every video in every language your viewers speak — no studio booking and no second take.",
    stat: "Reach 3–5× more viewers",
    visual: <WireGlobe className="h-full w-full" />,
  },
  {
    tag: "Educators",
    body: "Turn one course recording into a full multilingual catalog students can actually follow along with.",
    stat: "One record, many cohorts",
    visual: <WireTorus className="h-full w-full" />,
  },
  {
    tag: "Enterprise",
    body: "Localize all-hands, onboarding, and product videos while keeping each speaker's real voice.",
    stat: "Speaker identity preserved",
    visual: <WireCube className="h-full w-full" />,
  },
  {
    tag: "Live events",
    body: "Dub keynotes, webinars, and streams as they happen, with captions available in every seat.",
    stat: "~2s live latency",
    visual: <WireGlobe className="h-full w-full" />,
  },
];

function StackCard({
  index,
  total,
  progress,
  wide,
  data,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  wide: boolean;
  data: (typeof CASES)[number];
}) {
  const start = index / total;
  const targetScale = 1 - (total - index) * 0.04;
  // Desktop-only sticky-stack effect. Kept on a WRAPPER (transform + opacity
  // only) so it can never leave a stale filter/opacity on the article — the
  // article's own entrance reveal runs on every viewport and stays the single
  // owner of opacity/blur.
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const stackOpacity = useTransform(progress, [start, Math.min(start + 0.3, 1)], [1, 0.5]);

  return (
    <div className="md:sticky md:top-24" style={{ zIndex: index }}>
      <motion.div style={wide ? { scale, opacity: stackOpacity } : undefined} className="origin-top">
        <motion.article
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-start justify-between gap-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-surface p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] sm:p-10"
        >
          <CornerMarks />
        <div className="max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-2xl font-medium tracking-tight text-white sm:text-3xl">
            {data.tag}
          </h3>
          <p className="mt-3 font-sans text-white/60">{data.body}</p>
          <p className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-white">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {data.stat}
          </p>
        </div>
          <div aria-hidden="true" className="hidden h-24 w-24 shrink-0 text-white/25 sm:block">
            {data.visual}
          </div>
        </motion.article>
      </motion.div>
    </div>
  );
}

export default function UseCasesStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="use-cases"
      className="relative mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 md:py-32 lg:px-12"
    >
      <div className="mb-12 md:mb-16">
        <SectionMarker index="05" label="USE CASES" />
        <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-white">
          Built for whoever&apos;s{" "}
          <span className="font-normal italic text-white/45">talking to the world.</span>
        </h2>
      </div>

      <div ref={containerRef} className="flex flex-col gap-6 md:gap-[16vh] md:pb-[30vh]">
        {CASES.map((c, i) => (
          <StackCard
            key={c.tag}
            index={i}
            total={CASES.length}
            progress={scrollYProgress}
            wide={wide}
            data={c}
          />
        ))}
      </div>
    </section>
  );
}
