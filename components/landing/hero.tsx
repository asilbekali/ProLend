"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Clapperboard,
  Link2,
  Mic,
  Play,
  Upload,
  Radio,
  type LucideIcon,
} from "lucide-react";
import { StartButton, useCycle } from "./primitives";
import ContactButton from "./contact-button";

const EASE = [0.16, 1, 0.3, 1] as const;

// What gets dubbed, from what, into what — the chips in the headline swap
// through real jobs people bring to TH-Labs.
const JOBS: {
  Icon: LucideIcon;
  what: string;
  from: [string, string];
  to: [string, string];
}[] = [
  { Icon: Play, what: "your vlog", from: ["EN", "English"], to: ["UZ", "O'zbek"] },
  { Icon: Mic, what: "your podcast", from: ["RU", "Русский"], to: ["EN", "English"] },
  { Icon: Clapperboard, what: "your short film", from: ["UZ", "O'zbek"], to: ["ES", "Español"] },
  { Icon: Radio, what: "your live stream", from: ["EN", "English"], to: ["TR", "Türkçe"] },
];

const LINKS = [
  "https://youtu.be/your-vlog",
  "https://vimeo.com/your-short-film",
  "https://drive.google.com/podcast-ep-12.mp4",
];

const LANGUAGES = [
  "O'zbek",
  "English",
  "Русский",
  "Türkçe",
  "Қазақша",
  "Azərbaycanca",
  "Кыргызча",
  "Türkmençe",
  "Español",
  "Français",
  "Deutsch",
  "Português",
  "العربية",
  "हिन्दी",
  "中文",
  "日本語",
  "한국어",
  "Italiano",
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

/** Types a link out, holds it, clears it, moves to the next. */
function useTypedLink() {
  const [state, setState] = useState({ i: 0, n: 0, hold: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      setState(({ i, n, hold }) => {
        const full = LINKS[i].length;
        if (n < full) return { i, n: n + 1, hold };
        if (hold < 28) return { i, n, hold: hold + 1 };
        return { i: (i + 1) % LINKS.length, n: 0, hold: 0 };
      });
    }, 55);
    return () => clearInterval(id);
  }, []);
  return LINKS[state.i].slice(0, state.n);
}

export default function Hero() {
  const [job] = useCycle(JOBS.length, 2800);
  const j = JOBS[job];
  const typed = useTypedLink();
  const [tab, setTab] = useState<"link" | "file">("link");
  // The hero sinks into the dark as the next scene arrives.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
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
        {/* Stacked one phrase per line on phones, one sentence from lg up —
            as the reference does it. */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.22] text-white/40"
        >
          <span className="block lg:inline">
            Dub{" "}
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
            into{" "}
            <Swap k={j.to[1] + job}>
              <Chip code={j.to[0]} tint="green">
                {j.to[1]}
              </Chip>
            </Swap>
          </span>
          <span className="mt-1 block text-white">In your own voice. Every time.</span>
        </motion.h1>

        {/* The Studio's own first screen: paste a link or upload a file,
            pick a language, go. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="panel mt-8 w-full max-w-xl rounded-2xl p-2 text-left shadow-[0_30px_80px_-30px_rgba(255,120,30,0.35)] sm:mt-10"
        >
          <div className="flex gap-1 p-1">
            {(
              [
                { id: "link", label: "Paste a link", Icon: Link2 },
                { id: "file", label: "Upload a file", Icon: Upload },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-colors ${
                  tab === t.id ? "bg-white/10 text-white" : "text-white/45 hover:text-white/75"
                }`}
              >
                <t.Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="min-h-[72px] px-3 pb-2 pt-2 text-[15px]">
            {tab === "link" ? (
              <p className="break-all text-white/85">
                {typed}
                <span className="ml-px inline-block h-[1.05em] w-px translate-y-[3px] animate-pulse bg-[var(--orange)]" />
              </p>
            ) : (
              <p className="flex items-center gap-2 text-white/55">
                <Upload className="h-4 w-4" /> Drop a video or audio file · MP4, MOV, WAV, MP3
              </p>
            )}
            <p className="mt-1 text-[12px] text-white/35">
              The Studio takes it from here: source language, voice cloning and quality.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-white/[0.07] px-2 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/80">
              <span className="font-mono text-[10px] text-[var(--orange)]">UZ</span>
              O&rsquo;zbek
              <ChevronDown className="h-3.5 w-3.5 text-white/40" />
            </span>
            <StartButton tone="orange" size="sm" className="!w-9 !px-0" label="Start dubbing">
              <ArrowUp className="h-4 w-4" />
            </StartButton>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 max-w-md text-[12px] leading-relaxed text-white/40"
        >
          Paste a link or upload a file. TH-Labs transcribes it, translates it, clones the
          speaker&rsquo;s voice and syncs the lips — in 42+ languages.
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
          href="#outputs"
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
                {l}
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
