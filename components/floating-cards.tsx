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
  show: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
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
  scrollStyle: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    opacity: MotionValue<number>;
  };
  floatVars: React.CSSProperties;
  children: React.ReactNode;
}) {
  const {
    attach: bindTilt,
    rotateX,
    rotateY,
    handlers,
  } = useTilt<HTMLDivElement>(6);
  return (
    <motion.div
      variants={cardEntrance}
      className={`pointer-events-auto absolute ${className}`}
    >
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

// Target languages for the "We can dub" cylinder. They ride a 3D wheel that
// spins on its X axis: each rotates up through the sharp centre band in turn
// while the ones curving away go soft — hinting at the 40+ beyond the window.
const TARGET_LANGS = [
  "Uzbek",
  "Russian",
  "Turkish",
  "Spanish",
  "French",
  "Japanese",
  "Arabic",
  "German",
  "Korean",
  "Hindi",
  "Kazakh",
  "Kirghiz",
  "Turkmen",
  "Tajik",
  "Persian",
  "Portuguese",
];
const CYL_STEP = 360 / TARGET_LANGS.length; // degrees between neighbours
const CYL_RADIUS = 56; // px — cylinder radius (spacing / height)

export default function FloatingCards({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const exitSpring = { stiffness: 90, damping: 28, mass: 0.5 } as const;

  const useExit = (x: number, y: number) => ({
    x: useSpring(
      useTransform(progress, [0, 1], [0, reduce ? 0 : x]),
      exitSpring,
    ),
    y: useSpring(
      useTransform(progress, [0, 1], [0, reduce ? 0 : y]),
      exitSpring,
    ),
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
        floatVars={
          {
            "--float-distance": "-14px",
            "--float-duration": "7s",
          } as React.CSSProperties
        }
      >
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-white/85">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Live dubbing
            </span>
            {/* Target pill sits atop two ghost pills — z-index fans them into a
                stack, so one live target implies the 40+ queued behind it. */}
            <div className="relative flex items-center">
              <span
                className="absolute right-0 h-5 w-full translate-x-2 -translate-y-1.5 rounded-full bg-accent/10"
                style={{ zIndex: 1 }}
              />
              <span
                className="absolute right-0 h-5 w-full translate-x-1 -translate-y-[3px] rounded-full bg-accent/15"
                style={{ zIndex: 2 }}
              />
              <span
                className="relative rounded-full bg-accent/25 px-2 py-0.5 font-mono text-[10px] font-medium text-accent"
                style={{ zIndex: 3 }}
              >
                EN → ES
              </span>
            </div>
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
          {/* Live-caption readout: the translated line types itself out (see
              .animate-type-caption), with a blinking caret + latency badge. */}
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
            <span
              className="animate-type-caption font-sans text-[11px] italic text-white/60"
              style={{ "--type-ch": "20ch" } as React.CSSProperties}
            >
              “Hola, bienvenidos…”
            </span>
            <span className="shrink-0 font-mono text-[10px] font-medium text-emerald-300">
              ~2s
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Language selector — right */}
      <GlassCard
        className="right-[2%] top-[27%] w-40"
        scrollStyle={lang}
        floatVars={
          {
            "--float-distance": "-11px",
            "--float-duration": "8.5s",
            "--float-delay": "0.8s",
          } as React.CSSProperties
        }
      >
        <div className="p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
              We can dub
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(139,92,246,0.7)]" />
          </div>
          {/* 3D cylinder: a fixed-height stage (perspective) with the language
              wheel spinning on its X axis. z-index stacks the layers — selection
              band (z0) · wheel (z10) · edge blur (z20) — inside the card. The
              outer mask fades the top/bottom so pairs dissolve as they curve off. */}
          <div className="relative mt-2.5 h-[84px] [mask-image:linear-gradient(to_bottom,transparent,black_26%,black_74%,transparent)] [perspective:440px]">
            {/* z0 — centre selection band */}
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 rounded-lg border border-accent/40 bg-accent/10"
              style={{ zIndex: 0 }}
              aria-hidden="true"
            />
            {/* z10 — the rotating wheel */}
            <div
              className="animate-cylinder absolute inset-0 [transform-style:preserve-3d]"
              style={
                {
                  zIndex: 10,
                  "--cylinder-duration": "16s",
                } as React.CSSProperties
              }
            >
              {TARGET_LANGS.map((l, i) => (
                <div
                  key={l}
                  className="absolute inset-x-0 top-1/2 flex h-7 -translate-y-1/2 items-center justify-center font-sans text-[13px] text-white [backface-visibility:hidden]"
                  style={{
                    transform: `rotateX(${i * CYL_STEP}deg) translateZ(${CYL_RADIUS}px)`,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            {/* z20 — top/bottom blur so only the centre stays sharp */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[40%] backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
              style={{ zIndex: 20 }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black,transparent)]"
              style={{ zIndex: 20 }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-mono text-lg font-semibold leading-none text-white">
              40+
            </span>
            <span className="font-mono text-[10px] text-white/50">
              languages ready
            </span>
          </div>
        </div>
      </GlassCard>

      {/* "Voice cloned" toast — lower-left */}
      <GlassCard
        className="bottom-[12%] left-[3%] w-max"
        scrollStyle={toast}
        floatVars={
          {
            "--float-distance": "-9px",
            "--float-duration": "6.5s",
            "--float-delay": "0.4s",
          } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          {/* Concentric rings stacked by z-index: faint halo → ring → solid
              badge → glyph, so the check reads as sitting on top of the depth. */}
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full bg-emerald-400/10"
              style={{ zIndex: 0 }}
            />
            <span
              className="absolute inset-0.5 rounded-full bg-emerald-400/20"
              style={{ zIndex: 1 }}
            />
            <span
              className="absolute inset-1.25 rounded-full bg-emerald-400/30"
              style={{ zIndex: 2 }}
            />
            <span
              className="relative text-xs text-emerald-200"
              style={{ zIndex: 3 }}
            >
              ✓
            </span>
          </span>
          <div className="leading-tight">
            <div className="font-mono text-[13px] font-medium text-white">
              Voice cloned
            </div>
            <div className="font-mono text-[10px] text-white/50">
              Ready in <span className="text-emerald-300">2.4s</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
