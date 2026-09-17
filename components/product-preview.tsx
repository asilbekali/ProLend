"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  AudioLines,
  Bell,
  Captions,
  Check,
  ChevronDown,
  CircleDot,
  Clock,
  Globe,
  Home,
  Radio,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import LogoMark from "./logo-mark";

/* ── Shared dashboard chrome ──────────────────────────────────────────────────
   Every hero/feature preview is framed as a screenshot of the TH-Labs Studio:
   a slim left rail, a title bar, and the panel body. Keeping the chrome in one
   place is what makes three different panels read as one product. */

const RAIL = [
  { icon: <Home className="h-4 w-4" />, label: "Home" },
  { icon: <AudioLines className="h-4 w-4" />, label: "Dubs" },
  { icon: <Globe className="h-4 w-4" />, label: "Languages" },
  { icon: <Radio className="h-4 w-4" />, label: "Live" },
  { icon: <Captions className="h-4 w-4" />, label: "Subtitles" },
  { icon: <Users className="h-4 w-4" />, label: "Speakers" },
  { icon: <Settings className="h-4 w-4" />, label: "Settings" },
];

export function DashboardFrame({
  title,
  active,
  children,
}: {
  title: string;
  /** Which rail item is highlighted — matches the panel being shown. */
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-line bg-bg shadow-[0_30px_70px_-30px_rgba(11,11,12,0.3)]">
      {/* Left rail */}
      <div className="hidden w-[172px] shrink-0 flex-col border-r border-line bg-surface/60 p-3 sm:flex">
        <div className="flex items-center gap-2 px-2 py-1.5">
          {/* The mark is its own rounded-square badge, so it stands in for the
              accent tile that used to sit here rather than nesting inside one. */}
          <LogoMark className="h-6 w-6 shrink-0 text-accent" />
          <span className="font-display text-sm font-medium text-text">Studio</span>
          <ChevronDown className="ml-auto h-3.5 w-3.5 text-text-3" />
        </div>
        <ul className="mt-3 flex flex-col gap-0.5">
          {RAIL.map((r) => (
            <li key={r.label}>
              <span
                className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] ${
                  r.label === active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-text-2"
                }`}
              >
                {r.icon}
                {r.label}
              </span>
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-md bg-tint-green-bg px-2 py-1 font-mono text-[10px] font-medium text-tint-green-fg">
          <span className="h-1.5 w-1.5 rounded-full bg-tint-green-fg" />
          Live
        </span>
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="font-display text-sm font-medium text-text">{title}</span>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <span className="flex h-7 w-40 items-center gap-1.5 rounded-md border border-line px-2 text-[11px] text-text-3">
              <Search className="h-3 w-3" />
              Search
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-text-3">
              <Bell className="h-3.5 w-3.5" />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-text-3">
              <User className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Panel 1 — Dubbing job ──────────────────────────────────────────────────
   Mirrors the reference's "New Product" form: a radio row of modes, then a
   two-column field grid. */

const MODES = [
  { title: "Voice clone", body: "Keep the original speaker" },
  { title: "Studio voice", body: "Pick from our library" },
  { title: "Multi-speaker", body: "Separate every voice" },
];

const TARGETS = ["🇪🇸 Spanish", "🇫🇷 French", "🇯🇵 Japanese", "🇰🇷 Korean", "🇸🇦 Arabic"];

export function DubbingPanel() {
  return (
    <DashboardFrame title="New dub" active="Dubs">
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-display text-[15px] font-medium text-text">Source</p>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
              <AudioLines className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-mono text-[12px] text-text">
                course-episode-01.mp4
              </span>
              <span className="block font-mono text-[11px] text-text-3">
                248 MB · English · 12:04
              </span>
            </span>
            <span className="ml-auto hidden shrink-0 rounded-md bg-tint-green-bg px-2 py-1 font-mono text-[10px] font-medium text-tint-green-fg sm:block">
              Ready
            </span>
          </div>
        </div>

        <div>
          <p className="font-display text-[15px] font-medium text-text">Voice mode</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {MODES.map((m, i) => (
              <div
                key={m.title}
                className={`rounded-lg border px-3 py-2.5 ${
                  i === 0 ? "border-accent bg-accent-soft/60" : "border-line"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`flex h-3 w-3 items-center justify-center rounded-full border ${
                      i === 0 ? "border-accent bg-accent" : "border-line-strong"
                    }`}
                  >
                    {i === 0 && <span className="h-1 w-1 rounded-full bg-white" />}
                  </span>
                  <span className="text-[12px] font-medium text-text">{m.title}</span>
                </span>
                <span className="mt-1 block text-[11px] leading-snug text-text-3">
                  {m.body}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[12px] font-medium text-text">
              Target languages <span className="text-live">*</span>
            </p>
            <p className="mt-0.5 text-[11px] text-text-3">Add as many as you need.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TARGETS.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent-soft px-2 py-1 text-[11px] text-text"
                >
                  {t}
                  <Check className="h-2.5 w-2.5 text-accent" />
                </span>
              ))}
              <span className="inline-flex items-center rounded-md border border-dashed border-line-strong px-2 py-1 text-[11px] text-text-3">
                + Add
              </span>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-medium text-text">Output</p>
            <p className="mt-0.5 text-[11px] text-text-3">What ships with every track.</p>
            <div className="mt-2 flex flex-col gap-1.5">
              {["Lip-synced video", "Aligned SRT + VTT", "Isolated music & FX stem"].map(
                (o) => (
                  <span
                    key={o}
                    className="flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-[11px] text-text-2"
                  >
                    <Check className="h-3 w-3 shrink-0 text-accent" />
                    {o}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
}

/* ── Panel 2 — Live stream ─────────────────────────────────────────────────── */

const LIVE_FEED = [
  { lang: "ES", text: "…y hoy vamos a hablar de IA", tone: "text-tint-orange-fg" },
  { lang: "FR", text: "…et aujourd'hui on parle d'IA", tone: "text-tint-blue-fg" },
  { lang: "JA", text: "…今日はAIについて話します", tone: "text-tint-violet-fg" },
  { lang: "KO", text: "…오늘은 AI에 대해 이야기해요", tone: "text-tint-green-fg" },
];

export function LivePanel() {
  return (
    <DashboardFrame title="Live session" active="Live">
      <div className="flex h-full flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-live px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-white">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-white"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            On air
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[10px] text-text-2">
            <Users className="h-3 w-3" />
            12,418 watching
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[10px] text-text-2">
            <Clock className="h-3 w-3" />
            ~2s delay
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface/60 px-3 py-2">
          <span className="rounded bg-bg px-1.5 py-0.5 font-mono text-[10px] font-medium text-text">
            🇬🇧 EN
          </span>
          <span className="text-text-3">→</span>
          <span className="truncate font-mono text-[11px] text-text-2">
            Tech Talks — Live from San Francisco
          </span>
          <span className="ml-auto hidden shrink-0 font-mono text-[10px] text-text-3 sm:block">
            4 outputs
          </span>
        </div>

        <ul className="flex flex-col gap-1.5">
          {LIVE_FEED.map((f, i) => (
            <motion.li
              key={f.lang}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
              className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2"
            >
              <span className={`shrink-0 font-mono text-[11px] font-semibold ${f.tone}`}>
                {f.lang}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12px] text-text-2">
                {f.text}
              </span>
              <span className="flex shrink-0 items-end gap-px" aria-hidden="true">
                {Array.from({ length: 7 }).map((_, b) => (
                  <motion.span
                    key={b}
                    className="w-0.5 rounded-full bg-accent/45"
                    animate={{ height: [3, 5 + ((b * 5 + i * 3) % 11), 3] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: b * 0.07 + i * 0.1,
                    }}
                  />
                ))}
              </span>
            </motion.li>
          ))}
        </ul>

        <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-md bg-accent-soft px-2.5 py-1.5 font-mono text-[10px] text-accent">
          <CircleDot className="h-3 w-3" />
          Streaming to YouTube, Twitch &amp; Zoom
        </span>
      </div>
    </DashboardFrame>
  );
}

/* ── Panel 3 — Subtitle editor ─────────────────────────────────────────────── */

const CUES = [
  { t: "00:04.120", en: "Welcome back to the show.", tr: "Bienvenidos de nuevo al programa." },
  { t: "00:06.480", en: "Today we're talking about AI.", tr: "Hoy hablamos de la IA." },
  { t: "00:09.010", en: "Let's get straight into it.", tr: "Vamos directo al grano." },
  { t: "00:11.640", en: "First, a quick recap.", tr: "Primero, un repaso rápido." },
];

export function SubtitlePanel() {
  return (
    <DashboardFrame title="Subtitles" active="Subtitles">
      <div className="flex h-full flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {["🇪🇸 ES", "🇫🇷 FR", "🇯🇵 JA", "🇰🇷 KO"].map((l, i) => (
            <span
              key={l}
              className={`rounded-md px-2 py-1 font-mono text-[10px] ${
                i === 0
                  ? "bg-accent text-white"
                  : "border border-line text-text-2"
              }`}
            >
              {l}
            </span>
          ))}
          <span className="ml-auto hidden items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[10px] text-text-2 sm:inline-flex">
            <Sparkles className="h-3 w-3 text-accent" />
            Auto-aligned
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-[76px_1fr_1fr] gap-px bg-line">
            <span className="bg-surface px-2.5 py-2 font-mono text-[10px] uppercase tracking-wider text-text-3">
              Time
            </span>
            <span className="bg-surface px-2.5 py-2 font-mono text-[10px] uppercase tracking-wider text-text-3">
              Source
            </span>
            <span className="bg-surface px-2.5 py-2 font-mono text-[10px] uppercase tracking-wider text-text-3">
              Spanish
            </span>
            {CUES.map((c) => (
              <div key={c.t} className="contents">
                <span className="bg-bg px-2.5 py-2 font-mono text-[10px] text-text-3">
                  {c.t}
                </span>
                <span className="bg-bg px-2.5 py-2 text-[11px] leading-snug text-text-2">
                  {c.en}
                </span>
                <span className="bg-bg px-2.5 py-2 text-[11px] leading-snug text-text">
                  {c.tr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Waveform scrub track */}
        <div className="mt-auto rounded-lg border border-line px-3 py-2.5">
          <div className="flex h-8 items-center gap-px" aria-hidden="true">
            {Array.from({ length: 64 }).map((_, i) => {
              // Rounded so SSR and client serialize identical numbers.
              const h = Math.round(3 + Math.abs(Math.sin(i * 0.7)) * 22);
              return (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`w-full rounded-full ${i < 26 ? "bg-accent/60" : "bg-line-strong"}`}
                />
              );
            })}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9px] text-text-3">
            <span>00:00</span>
            <span>12:04</span>
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
}
