"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Eyebrow, Squiggle, useStep } from "./primitives";
import { ExportCard, LangCard, SubtitleCard, TrackCard, VoiceCard } from "./cards";

const STATES = [
  {
    eyebrow: "Real outputs",
    word: "Dubbed",
    body: "Upload a video and get it back in another language, spoken in the original speaker's own voice.",
  },
  {
    eyebrow: "Natural sync",
    word: "Lip-synced",
    body: "The new track is timed to the picture, with lips matched to the dubbed words on close-up footage.",
  },
  {
    eyebrow: "Every format",
    word: "Subtitled",
    body: "Captions and subtitle files come with every dub, in every language you choose, ready to publish.",
  },
];

type Float = {
  node: React.ReactNode;
  /** Position on desktop and on phones, % of the stage. */
  x: number;
  y: number;
  mx: number;
  my: number;
  w: number;
  /** How fast it drifts against the scroll. */
  speed: number;
  rotate: number;
  /** Shown only from md up. */
  wide?: boolean;
};

const FLOATS: Float[] = [
  { node: <VoiceCard />, x: 14, y: 22, mx: 22, my: 13, w: 220, speed: 160, rotate: -4 },
  {
    node: <LangCard word="O'zbek" code="EN → UZ" />,
    x: 84,
    y: 18,
    mx: 80,
    my: 12,
    w: 170,
    speed: 240,
    rotate: 5,
  },
  {
    node: (
      <SubtitleCard
        lang="Русский"
        lines={[
          ["00:00:01,200", "Сегодня мы запускаем кое-что новое."],
          ["00:00:04,050", "Это переводит ваше видео."],
        ]}
      />
    ),
    x: 86,
    y: 70,
    mx: 76,
    my: 86,
    w: 210,
    speed: 120,
    rotate: -3,
  },
  { node: <TrackCard />, x: 13, y: 74, mx: 26, my: 88, w: 230, speed: 200, rotate: 3 },
  {
    node: <ExportCard name="vlog-12_uz.mp4" />,
    x: 30,
    y: 92,
    mx: 0,
    my: 0,
    w: 230,
    speed: 300,
    rotate: -2,
    wide: true,
  },
  {
    node: <VoiceCard lang="Español" seed={7.2} />,
    x: 70,
    y: 94,
    mx: 0,
    my: 0,
    w: 230,
    speed: 260,
    rotate: 2,
    wide: true,
  },
  {
    node: <LangCard word="Español" code="RU → ES" />,
    x: 4,
    y: 48,
    mx: 0,
    my: 0,
    w: 140,
    speed: 90,
    rotate: 6,
    wide: true,
  },
  {
    node: <LangCard word="Türkçe" code="UZ → TR" />,
    x: 97,
    y: 45,
    mx: 0,
    my: 0,
    w: 140,
    speed: 110,
    rotate: -6,
    wide: true,
  },
];

function Floating({ f, progress }: { f: Float; progress: MotionValue<number> }) {
  // As in the reference: each card flies in from beyond its own edge of the
  // screen, drifts while the scene holds, then flies back out the far side.
  const dx = Math.sign(f.x - 50) || 1;
  const dy = Math.sign(f.y - 50) || 1;
  const x = useTransform(progress, [0, 0.16, 0.84, 1], [dx * 520, 0, 0, dx * 520]);
  const y = useTransform(
    progress,
    [0, 0.16, 0.84, 1],
    [dy * 260 + f.speed, f.speed * 0.4, -f.speed * 0.4, dy * 260 - f.speed],
  );
  const scale = useTransform(progress, [0, 0.16, 0.84, 1], [0.6, 1, 1.05, 1.25]);
  const opacity = useTransform(progress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  return (
    <div
      className={`absolute left-[var(--mx)] top-[var(--my)] -translate-x-1/2 -translate-y-1/2 md:left-[var(--x)] md:top-[var(--y)] ${
        f.wide ? "hidden md:block" : ""
      }`}
      style={
        {
          "--x": `${f.x}%`,
          "--y": `${f.y}%`,
          "--mx": `${f.mx}%`,
          "--my": `${f.my}%`,
          width: f.w,
          scale: "var(--s)",
        } as React.CSSProperties
      }
    >
      <motion.div style={{ x, y, scale, opacity, rotate: f.rotate }}>{f.node}</motion.div>
    </div>
  );
}

/**
 * Pinned, like the reference: one headline whose first word swaps through
 * what a dub comes back as, with the outputs themselves drifting past.
 */
export default function Outputs() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const step = useStep(scrollYProgress, STATES.length - 1);
  const glow = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [0, 1, 1, 0]);
  const copy = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.25, 1, 1, 0.25]);
  const s = STATES[step];

  return (
    <section ref={ref} id="outputs" className="relative h-[340svh]">
      <div className="sticky top-0 h-svh overflow-hidden [--s:0.62] sm:[--s:0.8] lg:[--s:1]">
        {/* The reference lights this scene from its edges: dark as it
            arrives, glowing while it holds, dark again as it leaves. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: glow,
            boxShadow:
              "inset 60px 0 120px -30px rgba(25,195,125,0.75), inset -60px 0 120px -30px rgba(255,90,40,0.6), inset 0 -60px 120px -30px rgba(255,200,40,0.55), inset 0 60px 120px -40px rgba(25,195,125,0.35)",
          }}
        />
        {FLOATS.map((f, i) => (
          <Floating key={i} f={f} progress={scrollYProgress} />
        ))}

        <motion.div
          style={{ opacity: copy }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] text-white">
            <span key={s.word} className="inline-block animate-[fadeUp_.5s_ease-out]">
              <Squiggle>{s.word}</Squiggle>
            </span>
            <br />
            in seconds.
            <br />
            In your own voice.
          </h2>
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {STATES.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === step ? "w-5 bg-white" : "w-1 bg-white/30"
                }`}
              />
            ))}
          </div>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/50">{s.body}</p>
        </motion.div>
      </div>
    </section>
  );
}
