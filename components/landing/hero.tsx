"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Headphones,
  Play,
  Presentation,
  Radio,
  Video,
  type LucideIcon,
} from "lucide-react";
import { StartButton, useCycle } from "./primitives";
import ContactButton from "./contact-button";
import LogoMark from "../logo-mark";

const EASE = [0.16, 1, 0.3, 1] as const;

// Real-time dubbing leads the page: the chips in the headline and the live
// card under it swap through moments people turn TH-Labs on for.
type Scene = {
  Icon: LucideIcon;
  what: string;
  from: [string, string];
  to: [string, string];
  /** One line as the speaker says it, and as the listener hears it. */
  said: string;
  heard: string;
};

const SCENES: Scene[] = [
  {
    Icon: Video,
    what: "your team call",
    from: ["EN", "English"],
    to: ["UZ", "O'zbek"],
    said: "Let's go through this week's numbers.",
    heard: "Keling, bu haftaning raqamlarini ko'rib chiqamiz.",
  },
  {
    Icon: Presentation,
    what: "a webinar",
    from: ["RU", "Русский"],
    to: ["EN", "English"],
    said: "Сегодня покажу, как это работает.",
    heard: "Today I'll show you how it works.",
  },
  {
    Icon: Radio,
    what: "a livestream",
    from: ["EN", "English"],
    to: ["RU", "Русский"],
    said: "Welcome back, everyone — we're live!",
    heard: "С возвращением, друзья — мы в эфире!",
  },
  // TODO(human): add one more scene — the moment you most want visitors to picture.
];

// Every language named on the site, with the code the Studio shows beside it.
const LANGUAGES = [
  { code: "UZ", name: "O'zbek" },
  { code: "EN", name: "English" },
  { code: "RU", name: "Русский" },
  { code: "TR", name: "Türkçe" },
  { code: "KK", name: "Қазақша" },
  { code: "AZ", name: "Azərbaycanca" },
  { code: "KY", name: "Кыргызча" },
  { code: "TK", name: "Türkmençe" },
  { code: "ES", name: "Español" },
  { code: "FR", name: "Français" },
  { code: "DE", name: "Deutsch" },
  { code: "PT", name: "Português" },
  { code: "AR", name: "العربية" },
  { code: "HI", name: "हिन्दी" },
  { code: "ZH", name: "中文" },
  { code: "JA", name: "日本語" },
  { code: "KO", name: "한국어" },
  { code: "IT", name: "Italiano" },
];

// Tinted like the reference's chips: the job in orange, the source neutral,
// the target in green.
const TINTS = {
  orange: "bg-[rgba(255,122,26,0.16)] border-[rgba(255,122,26,0.35)] text-[#ffd3b0]",
  neutral: "bg-white/[0.07] border-white/15 text-white",
  green: "bg-[rgba(25,195,125,0.16)] border-[rgba(25,195,125,0.4)] text-[#b6f5d8]",
} as const;

function Chip({
  children,
  Icon,
  code,
  tint,
}: {
  children: React.ReactNode;
  Icon?: LucideIcon;
  code?: string;
  tint: keyof typeof TINTS;
}) {
  return (
    <span
      className={`mx-[0.08em] inline-flex items-center gap-[0.28em] rounded-[0.45em] border px-[0.32em] py-[0.02em] align-middle backdrop-blur ${TINTS[tint]}`}
    >
      {Icon ? <Icon className="h-[0.68em] w-[0.68em]" strokeWidth={2.2} /> : null}
      {code ? (
        <span className="rounded-[0.25em] bg-white/15 px-[0.22em] font-mono text-[0.42em] leading-[1.5] tracking-wide">
          {code}
        </span>
      ) : null}
      {children}
    </span>
  );
}

function Swap({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={k}
        initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(8px)", y: -6 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

/** The target-language pill: opens the full list, closes on pick, Esc or a click outside. */
function LanguagePicker() {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Hear it in ${lang.name}`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/80 transition-colors hover:bg-white/10"
      >
        <span className="font-mono text-[10px] text-[var(--orange)]">{lang.code}</span>
        {lang.name}
        <ChevronDown
          className={`h-3.5 w-3.5 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label="Target language"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE }}
            // Lenis would otherwise swallow the wheel and scroll the page.
            data-lenis-prevent
            className="absolute left-0 top-[calc(100%+6px)] z-30 grid max-h-64 w-[min(320px,calc(100vw-48px))] grid-cols-2 gap-0.5 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#141416] p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]"
          >
            {LANGUAGES.map((l) => {
              const on = l.code === lang.code;
              return (
                <li key={l.code} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => {
                      setLang(l);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors ${
                      on
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="w-5 font-mono text-[10px] text-[var(--orange)]">{l.code}</span>
                    <span className="truncate">{l.name}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const [job] = useCycle(SCENES.length, 3400);
  const j = SCENES[job];
  // The hero sinks into the dark as the next scene arrives.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sink = useTransform(scrollYProgress, [0, 0.7], [1, 0.94]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col px-4 pt-24 sm:px-6 sm:pt-28"
    >
      <motion.div
        style={{ opacity: fade, scale: sink }}
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center text-center"
      >
        {/* The headline is real-time dubbing; this pill is the way to the
            second feature, for people who came with a recording. */}
        <motion.a
          href="#studio"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="pill-dark mb-6 inline-flex h-8 items-center gap-2 rounded-full pl-1.5 pr-3 text-[12px] text-white/75 transition-colors hover:text-white"
        >
          <span className="rounded-full bg-[var(--orange)] px-2 py-0.5 text-[10px] font-semibold text-white">
            Also
          </span>
          AI dubbing for your recorded videos
          <ArrowRight className="h-3 w-3 text-white/50" />
        </motion.a>

        {/* Stacked one phrase per line on phones, one sentence from lg up —
            as the reference does it. */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.22] text-white/40"
        >
          <span className="block lg:inline">
            Hear{" "}
            <Swap k={j.what}>
              <Chip Icon={j.Icon} tint="orange">
                {j.what}
              </Chip>
            </Swap>
          </span>{" "}
          <span className="block lg:inline">
            from{" "}
            <Swap k={j.from[1] + job}>
              <Chip code={j.from[0]} tint="neutral">
                {j.from[1]}
              </Chip>
            </Swap>
          </span>{" "}
          <span className="block lg:inline">
            in{" "}
            <Swap k={j.to[1] + job}>
              <Chip code={j.to[0]} tint="green">
                {j.to[1]}
              </Chip>
            </Swap>
          </span>
          <span className="mt-1 block text-white">Live, while it&rsquo;s happening.</span>
        </motion.h1>

        {/* Real-time dubbing in one card: the speaker's line goes in, your
            language comes out. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="panel mt-8 w-full max-w-xl rounded-2xl p-2 text-left shadow-[0_30px_80px_-30px_rgba(255,120,30,0.35)] sm:mt-10"
        >
          <div className="flex items-center justify-between gap-2 px-2 pb-1 pt-1">
            <span className="flex items-center gap-1.5 text-[12px] text-white">
              <LogoMark className="h-3.5 w-3.5" /> TH-Labs Real-Time Dubbing
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-black">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e0322b]" /> LIVE
            </span>
          </div>
          {/* Fixed height: a longer line swapping in must not shove the page
              down (Safari has no scroll anchoring to hide it). */}
          <div className="relative h-[92px] overflow-hidden px-3 pt-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={job}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="flex items-center gap-2 text-[12px] text-white/40">
                  <span className="font-mono text-[10px] text-white/50">{j.from[0]}</span>
                  <span className="truncate">{j.said}</span>
                </p>
                <p className="mt-1.5 flex items-start gap-2 text-[15px] leading-snug text-white">
                  <Headphones className="mt-[3px] h-4 w-4 shrink-0 text-[var(--green)]" />
                  {j.heard}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-white/[0.07] px-2 pt-2">
            <span className="flex items-center gap-2 text-[12px] text-white/45">
              Hear it in <LanguagePicker />
            </span>
            <span className="text-[11px] text-white/40">
              <span className="font-num text-white">~2</span> s behind
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 max-w-md text-[12px] leading-relaxed text-white/40"
        >
          Calls, meetings and livestreams, dubbed into your language with a natural AI voice as
          they happen. Works in Chrome today — mobile and web apps are on the way.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          <StartButton>Get started</StartButton>
          <ContactButton />
        </motion.div>

        <a
          href="#features"
          className="mt-10 flex flex-col items-center gap-1 text-[12px] text-white/35 hover:text-white/60"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-90" />
          Scroll down to explore
        </a>
      </motion.div>

      {/* Bottom bar: the demo, the languages scrolling past, the count. */}
      <div className="mx-auto mt-8 flex w-full max-w-[1280px] items-center gap-4 border-t border-white/[0.07] py-4">
        <a
          href="https://www.youtube.com/@th_labs_i"
          target="_blank"
          rel="noreferrer"
          className="hidden shrink-0 items-center gap-2 text-[12px] text-white/50 hover:text-white sm:flex"
        >
          <span className="pill-dark flex h-7 w-9 items-center justify-center rounded-lg">
            <Play className="h-3 w-3 fill-white" />
          </span>
          Watch TH-Labs on YouTube
        </a>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <ul className="animate-marquee-x flex w-max gap-8 text-[14px] font-medium text-white/45">
            {[...LANGUAGES, ...LANGUAGES].map((l, i) => (
              <li key={i} aria-hidden={i >= LANGUAGES.length}>
                {l.name}
              </li>
            ))}
          </ul>
        </div>
        <span className="hidden shrink-0 text-[12px] text-white/50 sm:block">
          <span className="font-num text-white">42</span>+ languages · and counting
        </span>
      </div>
    </section>
  );
}
