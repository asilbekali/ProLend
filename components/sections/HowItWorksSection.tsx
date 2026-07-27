"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionHeading from "./SectionHeading";

// 3-qadam: podcast — mikrofonda gapirayotgan odam (o'zingiznikiga almashtirsangiz bo'ladi)
const PODCAST_VIDEO_SRC = "https://assets.mixkit.co/videos/2955/2955-360.mp4";
// 4-qadam: YouTube stream — studiyada vlog yozayotgan yutuber
const LIVE_VIDEO_SRC = "https://assets.mixkit.co/videos/41272/41272-360.mp4";

const HOLD_AFTER_DONE = 1200; // animatsiya tugagach keyingisiga o'tishdan oldingi pauza (ms)
const LIVE_SCENE_DURATION = 9000; // live sahna qancha ko'rsatiladi (ms)

// Progress bar uchun taxminiy davomiyliklar (faqat vizual)
const EST_DURATIONS = [4400, 5000, 11000, LIVE_SCENE_DURATION];

const STEPS = [
  {
    title: "Upload your content",
    description:
      "Video, audio, podcast, course, or live stream — bring whatever you're creating.",
    url: "th-labs.ai/upload",
  },
  {
    title: "Choose target languages",
    description:
      "Pick as many languages as your audience speaks. No limits, no extra studios.",
    url: "th-labs.ai/languages",
  },
  {
    title: "Get natural multilingual output",
    description:
      "In minutes: voice cloned, lip-synced, and subtitled — ready to publish.",
    url: "th-labs.ai/export",
  },
  {
    title: "Go live in real time",
    description:
      "Dub YouTube streams, webinars, and live events on the fly — your audience hears you in their language, seconds behind.",
    url: "th-labs.ai/live",
  },
];

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

const SUBTITLES = [
  "Hola a todos 👋",
  "Bonjour à tous 👋",
  "皆さんこんにちは 👋",
];

// Live sahna uchun real-time dublyaj oqimi
const LIVE_CAPTIONS = [
  { lang: "🇪🇸 ES", text: "…y hoy vamos a hablar de IA" },
  { lang: "🇫🇷 FR", text: "…et aujourd'hui on parle d'IA" },
  { lang: "🇯🇵 JA", text: "…今日はAIについて話します" },
  { lang: "🇰🇷 KO", text: "…오늘은 AI에 대해 이야기해요" },
];

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingNext = useRef(false);

  const goNext = useCallback(() => {
    setActive((s) => (s + 1) % STEPS.length);
  }, []);

  // Sahna animatsiyasi tugaganda chaqiriladi — hold'dan keyin keyingi qadamga o'tadi
  const handleSceneDone = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => {
      if (pausedRef.current) {
        pendingNext.current = true; // hover paytida kutib turadi
      } else {
        goNext();
      }
    }, HOLD_AFTER_DONE);
  }, [goNext]);

  const setPaused = (v: boolean) => {
    pausedRef.current = v;
    if (!v && pendingNext.current) {
      pendingNext.current = false;
      goNext();
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow="How it works"
        title="From upload to global audience"
      />
      <p className="mb-12 text-center text-sm text-muted sm:text-base">
        Unlike traditional dubbing — no studios, no voice actors, no weeks of
        waiting.
      </p>

      {/* ── Safari browser mockup ─────────────────────────────── */}
      <div
        className="overflow-hidden rounded-xl border border-black/10 bg-surface shadow-2xl shadow-black/10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-black/10 bg-black/[0.04] px-4 py-2.5">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          {/* Sidebar + back */}
          <div className="hidden items-center gap-2 text-muted sm:flex">
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
              <path d="M6 2.5v11" />
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 3 5 8l5 5" />
            </svg>
          </div>
          {/* URL bar */}
          <div className="mx-auto flex h-7 w-full max-w-sm items-center justify-center gap-1.5 rounded-md bg-black/[0.06] px-3">
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted"
            >
              <rect x="3" y="7" width="10" height="7" rx="1.5" />
              <path d="M5 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            <AnimatePresence mode="wait">
              <motion.span
                key={STEPS[active].url}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-muted"
              >
                {STEPS[active].url}
              </motion.span>
            </AnimatePresence>
          </div>
          {/* Right icons */}
          <div className="hidden items-center gap-2.5 text-muted sm:flex">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <path d="M8 1.5v8M5 4l3-2.5L11 4M3.5 7.5h-1v7h11v-7h-1" />
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <rect x="4.5" y="1.5" width="10" height="10" rx="1.5" />
              <path d="M11.5 11.5v1.5a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 3 4.5h1.5" />
            </svg>
          </div>
        </div>

        {/* Viewport */}
        <div className="relative h-[340px] sm:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center p-6 sm:p-10"
            >
              {active === 0 && <UploadScene onDone={handleSceneDone} />}
              {active === 1 && <LanguagesScene onDone={handleSceneDone} />}
              {active === 2 && <OutputScene onDone={handleSceneDone} />}
              {active === 3 && <LiveScene onDone={handleSceneDone} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Step controls ─────────────────────────────────────── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-lg border p-4 text-left transition ${
              i === active
                ? "border-accent/40 bg-accent/5"
                : "border-black/10 opacity-60 hover:opacity-100"
            }`}
          >
            <div className="mb-2 h-0.5 w-full overflow-hidden rounded-full bg-black/10">
              {i === active && (
                <motion.div
                  key={`bar-${active}`}
                  className="h-full bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: (EST_DURATIONS[i] + HOLD_AFTER_DONE) / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </div>
            <h3 className="font-pixel text-sm text-foreground sm:text-base">
              <span className="mr-1.5 text-accent">{i + 1}.</span>
              {step.title}
            </h3>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              {step.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ── Scene 1: Upload ─────────────────────────────────────────── */
function UploadScene({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-xl border-2 border-dashed border-black/15 px-8 py-10">
      <motion.div
        initial={{ y: -24, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 18 }}
        className="flex items-center gap-3 rounded-lg border border-black/10 bg-surface px-4 py-3 shadow-sm"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 3.5a1 1 0 0 1 1.55-.83l7 4.5a1 1 0 0 1 0 1.66l-7 4.5A1 1 0 0 1 4 12.5v-9Z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            course-episode-01.mp4
          </p>
          <p className="text-xs text-muted">248 MB · English</p>
        </div>
      </motion.div>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.7, duration: 2.2, ease: "easeInOut" }}
        />
      </div>

      {/* Oxirgi element — animatsiyasi tugashi bilan onDone chaqiriladi */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        onAnimationComplete={onDone}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent"
      >
        <Check /> Upload complete
      </motion.p>
    </div>
  );
}

/* ── Scene 2: Languages ──────────────────────────────────────── */
function LanguagesScene({ onDone }: { onDone: () => void }) {
  return (
    <div className="w-full max-w-md">
      <p className="mb-4 text-center text-sm text-muted">
        Select target languages
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {LANGUAGES.map((lang, i) => (
          <motion.div
            key={lang.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="relative"
          >
            <div
              className={`rounded-lg border px-2.5 py-2 text-center text-xs sm:text-sm ${
                lang.selected
                  ? "border-accent/50 bg-accent/5 text-foreground"
                  : "border-black/10 text-muted"
              }`}
            >
              {lang.label}
            </div>
            {lang.selected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.9 + i * 0.15,
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white"
              >
                <Check size={9} />
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      {/* Oxirgi element — animatsiyasi tugashi bilan onDone chaqiriladi */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.4 }}
        onAnimationComplete={onDone}
        className="mt-5 text-center text-xs text-muted"
      >
        5 languages selected · <span className="text-accent">no limits</span>
      </motion.p>
    </div>
  );
}

/* ── Scene 3: Output (mikrofonda gapirayotgan odam — podcast) ── */
function OutputScene({ onDone }: { onDone: () => void }) {
  const [sub, setSub] = useState(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const t = setInterval(
      () => setSub((s) => (s + 1) % SUBTITLES.length),
      1400,
    );
    // Video yuklanmasa ham qotib qolmasligi uchun zaxira taymer
    const fallback = setTimeout(() => finish(), 12000);
    return () => {
      clearInterval(t);
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-md">
      {/* Player — podcast videosi */}
      <div className="relative flex h-44 items-end justify-center overflow-hidden rounded-xl bg-black pb-4 sm:h-52">
        <video
          src={PODCAST_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          onEnded={finish}
          onError={finish}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Pastki gradient — subtitr o'qilishi uchun */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Waveform */}
        <div className="absolute bottom-12 flex items-end gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-white/40"
              animate={{ height: [4, 8 + ((i * 7) % 16), 4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.06 }}
            />
          ))}
        </div>
        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.span
            key={sub}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="relative rounded bg-black/60 px-2.5 py-1 text-xs text-white"
          >
            {SUBTITLES[sub]}
          </motion.span>
        </AnimatePresence>
      </div>
      {/* Badges */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {["Voice cloned", "Lip-synced", "Subtitled"].map((b, i) => (
          <motion.span
            key={b}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.3 }}
            className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-foreground"
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

/* ── Scene 4: Real-time dubbing (YouTube live stream) ────────── */
function LiveScene({ onDone }: { onDone: () => void }) {
  const [cap, setCap] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    // Real-time dublyaj: tillar navbat bilan almashib turadi
    const t = setInterval(
      () => setCap((c) => (c + 1) % LIVE_CAPTIONS.length),
      1800,
    );
    const end = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, LIVE_SCENE_DURATION);
    return () => {
      clearInterval(t);
      clearTimeout(end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-md">
      {/* YouTube uslubidagi live player */}
      <div className="relative h-44 overflow-hidden rounded-xl bg-black sm:h-52">
        <video
          src={LIVE_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent" />

        {/* LIVE badge + tomoshabinlar */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1.5 rounded bg-[#f00] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            Live
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded bg-black/60 px-2 py-0.5 text-[10px] text-white"
          >
            12.4K watching
          </motion.span>
        </div>

        {/* Real-time dublyaj oqimi: EN → tanlangan til */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded bg-white/15 px-1.5 py-0.5 text-[10px] text-white/80 backdrop-blur">
              🇬🇧 EN
            </span>
            <motion.span
              className="shrink-0 text-white/60"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 8h11M9 4l4 4-4 4" />
              </svg>
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.span
                key={cap}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex min-w-0 items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-[11px] text-white"
              >
                <span className="shrink-0 font-medium text-accent">
                  {LIVE_CAPTIONS[cap].lang}
                </span>
                <span className="truncate">{LIVE_CAPTIONS[cap].text}</span>
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* YouTube uslubidagi sarlavha qatori */}
      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 7.5a4 4 0 0 0-2.8-2.9C18.2 4 12 4 12 4s-6.2 0-8.2.6A4 4 0 0 0 1 7.5 42 42 0 0 0 .5 12 42 42 0 0 0 1 16.5a4 4 0 0 0 2.8 2.9c2 .6 8.2.6 8.2.6s6.2 0 8.2-.6a4 4 0 0 0 2.8-2.9A42 42 0 0 0 23.5 12 42 42 0 0 0 23 7.5ZM9.8 15.3V8.7l6 3.3-6 3.3Z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            Tech Talks — Live from San Francisco
          </p>
          <p className="text-xs text-muted">
            Streaming in <span className="text-accent">5 languages</span> · ~2s
            delay
          </p>
        </div>
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-3 flex justify-center"
      >
        <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-foreground">
          <span className="text-accent">
            <Check size={10} />
          </span>
          Real-time dubbing — YouTube, Twitch, webinars &amp; more
        </span>
      </motion.div>
    </div>
  );
}

/* ── Shared check icon ───────────────────────────────────────── */
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
    >
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}
