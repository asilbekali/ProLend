"use client";

import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useTilt } from "@/hooks/use-tilt";

/**
 * Floating glass UI cards — the Ref A "planes at different distances" hallmark.
 * Their own z-cards layer above the hero content, bleeding toward the edges.
 * Four nested motion layers keep transforms from colliding:
 *   L1 entrance (variants) · L2 scroll fly-out (style) · L3 idle float (CSS) ·
 *   L4 hover tilt.
 * Layer is pointer-events-none; only the cards opt back in (for tilt) and they
 * sit clear of the centered CTAs. Shown only ≥1440px, where there's room beside
 * the content column — below that they'd overlap or clip, so they hide.
 */

const cardEntrance: Variants = {
  hidden: { scale: 0.9, opacity: 0, y: 30 },
  show: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const layerVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 1, staggerChildren: 0.15 } },
};

const GLASS =
  "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-[0_40px_120px_-20px_rgba(139,92,246,0.45)] [transform-style:preserve-3d]";

function GlassCard({
  className,
  scrollStyle,
  floatVars,
  children,
}: {
  className: string;
  scrollStyle: { x: MotionValue<number>; y: MotionValue<number>; opacity: MotionValue<number> };
  floatVars: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { attach: bindTilt, rotateX, rotateY, handlers } = useTilt<HTMLDivElement>(6);
  return (
    <motion.div variants={cardEntrance} className={`pointer-events-auto absolute ${className}`}>
      <motion.div style={scrollStyle}>
        <div className="animate-float" style={floatVars}>
          <motion.div
            ref={bindTilt}
            onPointerMove={handlers.onPointerMove}
            onPointerLeave={handlers.onPointerLeave}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className={GLASS}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const LANGUAGES = [
  { label: "Spanish", active: true },
  { label: "French", active: false },
  { label: "Japanese", active: false },
];

export default function FloatingCards({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const exitSpring = { stiffness: 90, damping: 28, mass: 0.5 } as const;

  const useExit = (x: number, y: number) => ({
    x: useSpring(useTransform(progress, [0, 1], [0, reduce ? 0 : x]), exitSpring),
    y: useSpring(useTransform(progress, [0, 1], [0, reduce ? 0 : y]), exitSpring),
    opacity: useTransform(progress, [0, 0.8], [1, reduce ? 1 : 0]),
  });

  const wave = useExit(-190, -40);
  const lang = useExit(210, -20);
  const toast = useExit(-150, 60);

  return (
    <motion.div
      aria-hidden="true"
      variants={layerVariants}
      initial={reduce ? false : "hidden"}
      animate="show"
      className="z-cards pointer-events-none absolute inset-0 hidden min-[1440px]:block"
    >
      {/* Waveform visualizer — top-left */}
      <GlassCard
        className="left-[2%] top-[16%] w-52"
        scrollStyle={wave}
        floatVars={{ "--float-distance": "-14px", "--float-duration": "7s" } as React.CSSProperties}
      >
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-white/85">Live dubbing</span>
            <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-medium text-accent">
              EN → ES
            </span>
          </div>
          <div className="flex h-12 items-end gap-1">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className="animate-wave-bar w-1 flex-1 origin-bottom rounded-full bg-gradient-to-t from-[#6d28d9] to-accent"
                style={{ animationDelay: `${(i % 11) * 0.09}s` }}
              />
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Language selector — right */}
      <GlassCard
        className="right-[2%] top-[27%] w-48"
        scrollStyle={lang}
        floatVars={{ "--float-distance": "-11px", "--float-duration": "8.5s", "--float-delay": "0.8s" } as React.CSSProperties}
      >
        <div className="p-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            Target language
          </span>
          <ul className="mt-3 flex flex-col gap-1.5">
            {LANGUAGES.map((l) => (
              <li
                key={l.label}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 font-sans text-sm ${
                  l.active ? "bg-accent/15 text-white" : "text-white/60"
                }`}
              >
                {l.label}
                {l.active && <span className="text-accent">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* "Voice cloned" toast — lower-left */}
      <GlassCard
        className="bottom-[12%] left-[3%] w-max"
        scrollStyle={toast}
        floatVars={{ "--float-distance": "-9px", "--float-duration": "6.5s", "--float-delay": "0.4s" } as React.CSSProperties}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-sm text-emerald-300">
            ✓
          </span>
          <div className="leading-tight">
            <div className="font-mono text-sm font-medium text-white">Voice cloned</div>
            <div className="font-mono text-[11px] text-white/50">Ready in 2.4s</div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
