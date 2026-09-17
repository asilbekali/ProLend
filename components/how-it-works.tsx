"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowRight, AudioLines, Globe, Radio, Upload } from "lucide-react";
import Frame, { Inner } from "./frame";
import SectionHead from "./section-head";

// Real footage in the dubbing rows. Row 3: a person speaking into a mic
// (podcast). Row 4: a creator recording a live stream.
const PODCAST_VIDEO_SRC = "https://assets.mixkit.co/videos/2955/2955-360.mp4";
const LIVE_VIDEO_SRC = "https://assets.mixkit.co/videos/41272/41272-360.mp4";

const LANGUAGES = [
  { label: "🇪🇸 Spanish", selected: true },
  { label: "🇫🇷 French", selected: true },
  { label: "🇩🇪 German", selected: false },
  { label: "🇯🇵 Japanese", selected: true },
  { label: "🇧🇷 Portuguese", selected: false },
  { label: "🇰🇷 Korean", selected: true },
  { label: "🇮🇹 Italian", selected: false },
  { label: "🇸🇦 Arabic", selected: true },
];

const SUBTITLES = ["Hola a todos 👋", "Bonjour à tous 👋", "皆さんこんにちは 👋"];

const LIVE_CAPTIONS = [
  { lang: "🇪🇸 ES", text: "…y hoy vamos a hablar de IA" },
  { lang: "🇫🇷 FR", text: "…et aujourd'hui on parle d'IA" },
  { lang: "🇯🇵 JA", text: "…今日はAIについて話します" },
  { lang: "🇰🇷 KO", text: "…오늘은 AI에 대해 이야기해요" },
];

/* ── Row shell ───────────────────────────────────────────────────────────────
   The reference's core feature-row: copy on one side, a product visual sitting
   on a tinted fine grid on the other, sides alternating down the page. The
   visual only mounts once the row is actually in view, so each scene's timed
   animation plays for the reader rather than finishing off-screen. */

type Row = {
  id?: string;
  chip: string;
  chipClass: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  body: string;
  link: string;
  grid: string;
  visual: React.ReactNode;
};

function FeatureRow({ row, flip }: { row: Row; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <div id={row.id} ref={ref} className="w-full border-b border-line last:border-b-0">
      <Inner className="grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 md:py-12">
      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={flip ? "md:order-2" : ""}
      >
        <span
          className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium ${row.chipClass}`}
        >
          <span aria-hidden="true">{row.icon}</span>
          {row.chip}
        </span>
        <h3 className="mt-5 max-w-md text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-[1.14] text-text">
          {row.title}
        </h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text-2">{row.body}</p>
        <a
          href="#community"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-text underline decoration-line-strong underline-offset-4 outline-none transition-colors hover:decoration-text focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {row.link}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
        </motion.div>

        {/* Visual on its tinted grid */}
        <div
          className={`field-grid ${row.grid} flex h-[300px] items-center justify-center overflow-hidden rounded-xl border border-line p-5 sm:h-[340px] ${
            flip ? "md:order-1" : ""
          }`}
        >
          {inView && row.visual}
        </div>
      </Inner>
    </div>
  );
}

export default function HowItWorks() {
  const rows: Row[] = [
    {
      chip: "Upload",
      chipClass: "bg-tint-green-bg text-tint-green-fg",
      icon: <Upload className="h-3.5 w-3.5" />,
      title: (
        <>
          Bring whatever you&apos;re
          <br className="hidden sm:block" /> already making.
        </>
      ),
      body: "Video, audio, a podcast, a course, or a live stream. Drop it in and TH-Labs handles ingest, speaker detection, and transcription before you've finished your coffee.",
      link: "Learn more about ingest",
      grid: "grid-tint-green",
      visual: <UploadScene />,
    },
    {
      chip: "Languages",
      chipClass: "bg-tint-blue-bg text-tint-blue-fg",
      icon: <Globe className="h-3.5 w-3.5" />,
      title: (
        <>
          Pick every language
          <br className="hidden sm:block" /> your audience speaks.
        </>
      ),
      body: "Forty-plus languages, in both directions, with no per-language studio cost. Select five or fifty — the pipeline runs them all in parallel from the one recording.",
      link: "Learn more about languages",
      grid: "grid-tint-blue",
      visual: <LanguagesScene />,
    },
    {
      chip: "Dubbing",
      chipClass: "bg-tint-violet-bg text-tint-violet-fg",
      icon: <AudioLines className="h-3.5 w-3.5" />,
      title: (
        <>
          Your voice, speaking
          <br className="hidden sm:block" /> their language.
        </>
      ),
      body: "Three seconds of reference audio is enough to clone a timbre. Lip sync realigns mouth movement to the new track, and the final mix sets it back against the original music and effects.",
      link: "Learn more about voice cloning",
      grid: "grid-tint-violet",
      visual: <OutputScene />,
    },
    {
      id: "live",
      chip: "Live",
      chipClass: "bg-tint-orange-bg text-tint-orange-fg",
      icon: <Radio className="h-3.5 w-3.5" />,
      title: (
        <>
          Go live in real time,
          <br className="hidden sm:block" /> two seconds behind.
        </>
      ),
      body: "Dub YouTube streams, webinars, and conference keynotes as they happen. Your audience picks a language in the player and hears you in it, live.",
      link: "Learn more about live dubbing",
      grid: "grid-tint-orange",
      visual: <LiveScene />,
    },
  ];

  return (
    <Frame as="section" bleed id="how-it-works" className="border-b border-line">
      <Inner className="py-12 md:py-16">
        <SectionHead
          title="The complete dubbing pipeline"
          sub="From raw upload to a lip-synced, subtitled, live-ready track — every stage handled, with no extra engineering."
        />
      </Inner>
      <div className="border-t border-line">
        {rows.map((r, i) => (
          <FeatureRow key={r.chip} row={r} flip={i % 2 === 1} />
        ))}
      </div>
    </Frame>
  );
}

/* ── Scene 1: Upload ─────────────────────────────────────────────────────── */
function UploadScene() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center rounded-xl border-2 border-dashed border-line-strong bg-bg/70 px-6 py-8 backdrop-blur-sm">
      <motion.div
        initial={{ y: -20, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 18 }}
        className="flex w-full items-center gap-3 rounded-lg border border-line bg-bg px-3.5 py-3 shadow-sm"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-tint-green-bg text-tint-green-fg">
          <AudioLines className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-mono text-[13px] font-medium text-text">
            course-episode-01.mp4
          </span>
          <span className="block font-mono text-[11px] text-text-3">248 MB · English</span>
        </span>
      </motion.div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full rounded-full bg-tint-green-fg"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.6, duration: 2.1, ease: "easeInOut" }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="mt-3 flex items-center gap-1.5 font-mono text-xs font-medium text-tint-green-fg"
      >
        <Check /> Upload complete
      </motion.p>
    </div>
  );
}

/* ── Scene 2: Languages ──────────────────────────────────────────────────── */
function LanguagesScene() {
  return (
    <div className="w-full max-w-sm">
      <p className="mb-3.5 text-center font-mono text-xs text-text-2">
        Select target languages
      </p>
      <div className="grid grid-cols-2 gap-2">
        {LANGUAGES.map((lang, i) => (
          <motion.div
            key={lang.label}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.07 }}
            className="relative"
          >
            <div
              className={`rounded-lg border px-2.5 py-2 text-center text-xs ${
                lang.selected
                  ? "border-tint-blue-fg/40 bg-tint-blue-bg text-text"
                  : "border-line bg-bg text-text-3"
              }`}
            >
              {lang.label}
            </div>
            {lang.selected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.8 + i * 0.13,
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-tint-blue-fg text-white"
              >
                <Check size={9} />
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.4 }}
        className="mt-4 text-center font-mono text-[11px] text-text-2"
      >
        5 languages selected · <span className="text-tint-blue-fg">no limits</span>
      </motion.p>
    </div>
  );
}

/* ── Scene 3: Output (podcast video) ─────────────────────────────────────── */
function OutputScene() {
  const [sub, setSub] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSub((s) => (s + 1) % SUBTITLES.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-sm">
      <div className="relative flex h-40 items-end justify-center overflow-hidden rounded-xl bg-black pb-3.5 shadow-lg sm:h-48">
        <video
          src={PODCAST_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute bottom-11 flex items-end gap-1">
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-white/50"
              animate={{ height: [4, 8 + ((i * 7) % 16), 4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.06 }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={sub}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="relative rounded bg-black/65 px-2.5 py-1 text-xs text-white"
          >
            {SUBTITLES[sub]}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
        {["Voice cloned", "Lip-synced", "Subtitled"].map((b, i) => (
          <motion.span
            key={b}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.25 }}
            className="flex items-center gap-1.5 rounded-full border border-tint-violet-fg/35 bg-tint-violet-bg px-2.5 py-1 font-mono text-[11px] text-text"
          >
            <span className="text-accent">
              <Check size={10} />
            </span>
            {b}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ── Scene 4: Real-time dubbing (live stream) ────────────────────────────── */
function LiveScene() {
  const [cap, setCap] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCap((c) => (c + 1) % LIVE_CAPTIONS.length), 1900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-sm">
      <div className="relative h-40 overflow-hidden rounded-xl bg-black shadow-lg sm:h-48">
        <video
          src={LIVE_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent" />

        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="flex items-center gap-1.5 rounded bg-live px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            Live
          </span>
          <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white">
            12.4K watching
          </span>
        </div>

        <div className="absolute inset-x-2.5 bottom-2.5 flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur">
            🇬🇧 EN
          </span>
          <motion.span
            className="shrink-0 text-white/60"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            aria-hidden="true"
          >
            <ArrowRight className="h-3 w-3" />
          </motion.span>
          <AnimatePresence mode="wait">
            <motion.span
              key={cap}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex min-w-0 items-center gap-1.5 rounded bg-black/65 px-2 py-1 text-[11px] text-white"
            >
              <span className="shrink-0 font-mono font-medium text-orange-300">
                {LIVE_CAPTIONS[cap].lang}
              </span>
              <span className="truncate">{LIVE_CAPTIONS[cap].text}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-line bg-bg px-3 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tint-orange-bg text-tint-orange-fg">
          <Radio className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-mono text-[12px] font-medium text-text">
            Tech Talks — Live from San Francisco
          </span>
          <span className="block text-[11px] text-text-2">
            Streaming in <span className="text-tint-orange-fg">5 languages</span> · ~2s delay
          </span>
        </span>
      </div>
    </div>
  );
}

function Check({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}
