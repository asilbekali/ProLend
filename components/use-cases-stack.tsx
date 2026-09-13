"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Frame from "./frame";
import SectionHead from "./section-head";
import WireGlobe from "./wireframe/globe";
import WireCube from "./wireframe/cube";
import WireTorus from "./wireframe/torus";
import { useMediaQuery } from "@/hooks/use-media-query";

const CASES = [
  {
    tag: "Creators",
    body: "Ship every video in every language your viewers speak — no studio booking and no second take.",
    stat: "Reach 3–5× more viewers",
    tint: "bg-tint-violet-bg text-tint-violet-fg",
    dot: "bg-tint-violet-fg",
    visual: <WireGlobe className="h-full w-full" />,
  },
  {
    tag: "Educators",
    body: "Turn one course recording into a full multilingual catalog students can actually follow along with.",
    stat: "One record, many cohorts",
    tint: "bg-tint-green-bg text-tint-green-fg",
    dot: "bg-tint-green-fg",
    visual: <WireTorus className="h-full w-full" />,
  },
  {
    tag: "Enterprise",
    body: "Localize all-hands, onboarding, and product videos while keeping each speaker's real voice.",
    stat: "Speaker identity preserved",
    tint: "bg-tint-blue-bg text-tint-blue-fg",
    dot: "bg-tint-blue-fg",
    visual: <WireCube className="h-full w-full" />,
  },
  {
    tag: "Live events",
    body: "Dub keynotes, webinars, and streams as they happen, with captions available in every seat.",
    stat: "~2s live latency",
    tint: "bg-tint-orange-bg text-tint-orange-fg",
    dot: "bg-tint-orange-fg",
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
  const targetScale = 1 - (total - index) * 0.035;
  // Desktop-only sticky-stack effect. Kept on a WRAPPER (transform only) so it
  // can never leave a stale filter/opacity on the article — the article's own
  // entrance reveal stays the single owner of opacity.
  const scale = useTransform(progress, [start, 1], [1, targetScale]);

  return (
    <div className="md:sticky md:top-28" style={{ zIndex: index }}>
      <motion.div style={wide ? { scale } : undefined} className="origin-top">
        <motion.article
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between gap-6 rounded-2xl border border-line bg-bg p-7 shadow-[0_24px_60px_-34px_rgba(11,11,12,0.4)] sm:p-9"
        >
          <div className="max-w-xl">
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 font-mono text-[11px] font-medium ${data.tint}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3.5 font-display text-2xl font-medium text-text sm:text-3xl">
              {data.tag}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-text-2">{data.body}</p>
            <p className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-text">
              <span className={`h-1.5 w-1.5 rounded-full ${data.dot}`} />
              {data.stat}
            </p>
          </div>
          <div
            aria-hidden="true"
            className="hidden h-24 w-24 shrink-0 text-line-strong sm:block"
          >
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
    <Frame as="section" id="use-cases" className="border-b border-line">
      <div className="py-12 md:py-16">
        <SectionHead
          title="Built for whoever's talking to the world"
          sub="The same pipeline, pointed at four very different problems."
        />
      </div>

      <div
        ref={containerRef}
        // No large trailing padding: the extra scroll room the sticky stack
        // used to reserve after its last card showed up as a dead band between
        // this section and the FAQ. The stack still reads because the gap
        // *between* cards supplies the travel.
        className="flex flex-col gap-5 pb-10 md:gap-[8vh] md:pb-12"
      >
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
    </Frame>
  );
}
