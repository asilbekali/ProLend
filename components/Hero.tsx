"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, AudioLines, Captions, Radio } from "lucide-react";
import Navbar from "./navbar";
import JoinModal from "./JoinModal";
import Frame, { Inner } from "./frame";
import { DubbingPanel, LivePanel, SubtitlePanel } from "./product-preview";
import CursorGuide, { type GuideStep } from "./cursor-guide";
import { useEarlyUsersCount } from "@/lib/queries/useEarlyUsersCount";

const FALLBACK_SUPPORTER_COUNT = 24;
const EASE = [0.16, 1, 0.3, 1] as const;

const AVATARS = [
  { initials: "A", from: "#a78bfa", to: "#5b3fd9" },
  { initials: "G", from: "#6366f1", to: "#3730a3" },
  { initials: "S", from: "#64748b", to: "#334155" },
  { initials: "J", from: "#a3a3a3", to: "#525252" },
];

/**
 * The hero tabs. Each one owns a product panel *and* the tint of the grid it
 * sits on, so switching tabs re-colors the whole lower half of the hero — the
 * move that gives the reference layout its sense of depth.
 *
 * Every panel also ships a `guide`: a scripted cursor path that walks the
 * viewer through driving that screen, so each tab plays as a short how-to
 * instead of sitting there as a still.
 */
const TABS = [
  {
    id: "dubbing",
    label: "Dubbing",
    icon: <AudioLines className="h-3.5 w-3.5" />,
    chip: "bg-tint-violet-bg text-tint-violet-fg",
    grid: "grid-tint-violet",
    panel: <DubbingPanel />,
    guide: [
      { at: { x: 34, y: 22 }, caption: "Drop in your recording", hold: 1600 },
      { at: { x: 36, y: 42 }, caption: "Clone the original voice", hold: 1600 },
      { at: { x: 40, y: 72 }, caption: "Pick target languages", hold: 1600 },
      { at: { x: 76, y: 74 }, caption: "Choose what ships", hold: 1600 },
    ] satisfies GuideStep[],
  },
  {
    id: "live",
    label: "Live",
    icon: <Radio className="h-3.5 w-3.5" />,
    chip: "bg-tint-orange-bg text-tint-orange-fg",
    grid: "grid-tint-orange",
    panel: <LivePanel />,
    guide: [
      { at: { x: 32, y: 16 }, caption: "Go on air", hold: 1500 },
      { at: { x: 40, y: 33 }, caption: "Point it at your stream", hold: 1600 },
      { at: { x: 55, y: 55 }, caption: "Captions land live", hold: 1700 },
      { at: { x: 38, y: 88 }, caption: "Push to every platform", hold: 1600 },
    ] satisfies GuideStep[],
  },
  {
    id: "subtitles",
    label: "Subtitles",
    icon: <Captions className="h-3.5 w-3.5" />,
    chip: "bg-tint-blue-bg text-tint-blue-fg",
    grid: "grid-tint-blue",
    panel: <SubtitlePanel />,
    guide: [
      { at: { x: 33, y: 16 }, caption: "Switch language", hold: 1500 },
      { at: { x: 62, y: 42 }, caption: "Edit any line", hold: 1700 },
      { at: { x: 45, y: 62 }, caption: "Timings stay aligned", hold: 1600 },
      { at: { x: 50, y: 86 }, caption: "Scrub the waveform", hold: 1600 },
    ] satisfies GuideStep[],
  },
] as const;

const master: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const [communityOpen, setCommunityOpen] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("dubbing");

  const { data: earlyUsers } = useEarlyUsersCount();
  const supporters = earlyUsers?.count ?? FALLBACK_SUPPORTER_COUNT;

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <>
      <Navbar />

      <section id="top">
        {/* ── Pastel mesh + dot field ───────────────────────────────────
            Sized to fill exactly one viewport minus the sticky navbar, so the
            product panel below starts off-screen on load and is only revealed
            once the visitor scrolls. `svh` keeps that true on mobile browsers
            whose toolbars resize the viewport. */}
        <Frame
          bleed
          className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden border-b border-line"
        >
          {/* z-base — the drifting pastel wash */}
          <div
            aria-hidden="true"
            className="z-base animate-mesh field-mesh absolute inset-0"
          />
          {/* z-grid — the dot field, faded out at the edges */}
          <div
            aria-hidden="true"
            className="z-grid field-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]"
          />

          <motion.div
            variants={master}
            // `initial` must not depend on useReducedMotion: that hook is
            // client-only, so branching here makes the server and first client
            // render disagree and React reports a hydration mismatch. Always
            // start hidden and collapse the *duration* instead.
            initial="hidden"
            animate="show"
            className="z-content relative flex w-full flex-1 flex-col items-center px-5 pb-5 pt-10 text-center sm:px-8 sm:pb-6"
          >
            {/* `m-auto` lets this block absorb the free space above it, which
                centres the pitch in the viewport while leaving the tab row
                sitting on the section's bottom rule. */}
            <div className="m-auto flex w-full max-w-3xl flex-col items-center">
            {/* Announcement pill */}
            <motion.a
              variants={item}
              href="#live"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-bg/80 py-1.5 pl-3.5 pr-3 text-sm text-text-2 shadow-sm backdrop-blur outline-none transition-colors hover:text-text focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Introducing real-time live dubbing
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.a>

            <motion.h1
              variants={item}
              className="mt-7 text-[clamp(2rem,5.6vw,4.2rem)] font-medium leading-[1.04] text-text"
            >
              <span className="block text-balance">The AI Dubbing Platform</span>
              <span className="mt-1 block text-balance text-text-2">
                for every audience you have
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-text-2 sm:text-base"
            >
              From voice cloning and lip sync to live stream translation — everything you
              need to reach every audience in their own language, without a studio, a
              voice actor, or a second take.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
            >
              <button
                type="button"
                onClick={() => setCommunityOpen(true)}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent px-7 text-sm font-medium text-white shadow-[0_8px_24px_-10px_rgba(109,40,217,0.8)] outline-none transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 sm:w-auto"
              >
                Join Community
              </button>
              <a
                href="#how-it-works"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-line bg-bg px-7 text-sm font-medium text-text shadow-sm outline-none transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent/40 sm:w-auto"
              >
                See how it works
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={item} className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a) => (
                  <span
                    key={a.initials}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-bg font-mono text-[10px] font-medium text-white"
                    style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <span className="font-mono text-xs text-text-2">
                +{supporters} creators already in the community
              </span>
              </motion.div>
            </div>

            {/* ── Tab switcher ──────────────────────────────────────────
                Lives inside the hero, directly under the social-proof line and
                sitting on the rule at the section's bottom edge — so the active
                tab reads as attached to the product panel underneath it rather
                than floating in a white strip of its own. */}
            <motion.div
              variants={item}
              role="tablist"
              aria-label="Product preview"
              className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            >
              {TABS.map((t) => {
                const isActive = t.id === tab;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    id={`hero-tab-${t.id}`}
                    aria-selected={isActive}
                    aria-controls="hero-tabpanel"
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/40 sm:px-4 ${
                      isActive
                        ? "border border-line bg-bg font-medium text-text shadow-sm"
                        : "border border-transparent text-text-2 hover:text-text"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded ${
                        isActive ? t.chip : "bg-surface-2 text-text-3"
                      }`}
                    >
                      {t.icon}
                    </span>
                    {t.label}
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        </Frame>

        {/* ── Tinted product grid ─────────────────────────────────────── */}
        <Frame bleed className="border-b border-line">
          <div
            id="hero-tabpanel"
            role="tabpanel"
            aria-labelledby={`hero-tab-${active.id}`}
            className={`field-grid ${active.grid} py-5 transition-colors duration-500 sm:py-8`}
          >
            <Inner>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                className="mx-auto h-[420px] max-w-4xl sm:h-[480px]"
              >
                <CursorGuide key={active.id} steps={active.guide} className="h-full">
                  {active.panel}
                </CursorGuide>
              </motion.div>
            </Inner>
          </div>
        </Frame>
      </section>

      <JoinModal
        kind="community"
        accent="purple"
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
      />
    </>
  );
}
