"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, Clapperboard, FileVideo, Headphones, type LucideIcon } from "lucide-react";
import { Eyebrow, useCycle } from "./primitives";

const EASE = [0.16, 1, 0.3, 1] as const;

const LIVE_LINES = [
  { said: "Let's go through this week's numbers.", heard: "Keling, bu haftaning raqamlarini ko'rib chiqamiz." },
  { said: "Сегодня покажу, как это работает.", heard: "Today I'll show you how it works." },
  { said: "Welcome back, everyone — we're live!", heard: "С возвращением, друзья — мы в эфире!" },
];

/** Speaker → TH-Labs → you, with the words travelling along the wire. */
function LiveDemo() {
  const [i] = useCycle(LIVE_LINES.length, 3200);
  const l = LIVE_LINES[i];
  return (
    <div className="rounded-2xl bg-white/[0.04] p-3 sm:p-4">
      <p
        key={`s${i}`}
        className="animate-[fadeUp_.4s_ease-out] truncate rounded-xl bg-white/[0.06] px-3 py-2 text-[12px] text-white/55"
      >
        <span className="mr-1.5 text-white/35">Speaker:</span>
        {l.said}
      </p>
      {/* The wire: dots run down it while the dub is on. */}
      <div className="relative mx-auto my-1 h-8 w-px bg-white/10">
        {[0, 0.4, 0.8].map((d) => (
          <motion.span
            key={d}
            className="absolute -left-[2px] h-[5px] w-[5px] rounded-full bg-[var(--orange)]"
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, delay: d, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
      <p
        key={`h${i}`}
        className="flex animate-[fadeUp_.5s_ease-out] items-start gap-2 rounded-xl border border-[var(--green)]/30 bg-[var(--green)]/10 px-3 py-2 text-[13px] leading-snug text-white"
      >
        <Headphones className="mt-[2px] h-3.5 w-3.5 shrink-0 text-[var(--green)]" />
        <span>
          <span className="mr-1.5 text-[var(--green)]">You hear:</span>
          {l.heard}
        </span>
      </p>
    </div>
  );
}

/** A file uploads, then comes back in one language after another. */
function StudioDemo() {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--orange)]/15 text-[var(--orange)]">
          <FileVideo className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] text-white">vlog-12.mp4</p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[var(--orange)]"
              animate={{ width: ["0%", "100%", "100%"] }}
              transition={{ duration: 4, times: [0, 0.45, 1], repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {["O'zbek", "Русский", "Español", "Türkçe"].map((n, k) => (
          <motion.li
            key={n}
            className="flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/80"
            animate={{ opacity: [0.25, 0.25, 1, 1], scale: [0.92, 0.92, 1, 1] }}
            transition={{
              duration: 4,
              times: [0, 0.45 + k * 0.1, 0.5 + k * 0.1, 1],
              repeat: Infinity,
            }}
          >
            <Check className="h-3 w-3 text-[var(--green)]" /> {n}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Feature({
  main,
  Icon,
  tag,
  title,
  body,
  points,
  href,
  demo,
  delay,
}: {
  main?: boolean;
  Icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  demo: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`panel flex min-w-0 flex-col rounded-3xl p-5 sm:p-6 ${
        main ? "shadow-[0_30px_80px_-40px_rgba(255,120,30,0.45)] !border-[var(--orange)]/30" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            main ? "bg-[var(--orange)] text-white" : "bg-white/[0.08] text-white/80"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] ${
            main ? "bg-[var(--green)]/15 text-[var(--green)]" : "bg-white/[0.06] text-white/55"
          }`}
        >
          {tag}
        </span>
      </div>
      <h3 className="mt-4 text-[22px] font-medium tracking-[-0.02em] text-white sm:text-[26px]">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-white/55">{body}</p>
      <div className="mt-5">{demo}</div>
      <ul className="mt-5 flex flex-col gap-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-[13px] text-white/70">
            <Check className="mt-[2px] h-3.5 w-3.5 shrink-0 text-[var(--green)]" />
            {p}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-medium text-white hover:text-[var(--orange)]"
      >
        See how it works <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </motion.article>
  );
}

/**
 * The page's map: what TH-Labs does, in two products. Real-time dubbing is
 * the main one, so it comes first and carries the weight; each card links
 * to its own walkthrough further down.
 */
export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <Eyebrow>What TH-Labs does</Eyebrow>
          <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.06] text-white">
            Two ways to understand
            <br />
            any language.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/50">
            Happening right now? Hear it live in your language. Already recorded? Dub the file.
            One TH-Labs account works for both.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Feature
            main
            Icon={Headphones}
            tag="Main feature · Live"
            title="Real-time dubbing"
            body="For things happening now. Turn it on during a call, meeting or livestream and hear every speaker in your own language — no subtitles to read."
            points={[
              "Google Meet, Zoom, Teams, YouTube — any tab in Chrome",
              "About two seconds behind the speaker",
              "Chrome extension today · mobile and web apps soon",
            ]}
            href="#how"
            demo={<LiveDemo />}
            delay={0}
          />
          <Feature
            Icon={Clapperboard}
            tag="For recordings"
            title="AI video dubbing"
            body="For things you've already recorded. Upload a vlog, podcast or film and get it back in other languages, in the speaker's own voice."
            points={[
              "Voice cloned from about three seconds of audio",
              "Lips in sync, subtitles included",
              "Many languages from one upload",
            ]}
            href="#studio"
            demo={<StudioDemo />}
            delay={0.12}
          />
        </div>
      </div>
    </section>
  );
}
