"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Globe,
  Home,
  LayoutGrid,
  Mic,
  Moon,
  PanelLeft,
  Pencil,
  Radio,
  Search,
  Settings,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import LogoMark from "./logo-mark";

/* ── Studio chrome ───────────────────────────────────────────────────────────
   These panels are screenshots of the real TH-Labs Studio, so they carry the
   Studio's palette rather than the marketing site's tokens — warm near-black,
   hairline cards, one violet accent. They stay dark in both site themes for
   the same reason a product screenshot in a press kit does: it is a picture of
   the app, not a surface of this page. The grid behind them supplies the
   contrast either way.

   The palette lives as custom properties on the frame root so every panel
   below reads from one place instead of repeating hex codes. */

const STUDIO = {
  "--st-bg": "#0d0c0c",
  "--st-rail": "#121110",
  "--st-card": "#161514",
  "--st-card-2": "#1d1b19",
  "--st-line": "#272422",
  "--st-line-2": "#332f2c",
  "--st-text": "#ece8e4",
  "--st-text-2": "#9b948d",
  "--st-text-3": "#6d6762",
  "--st-accent": "#8b5cf6",
  "--st-amber": "#f5b544",
  "--st-green": "#4ade80",
} as CSSProperties;

const NAV_MAIN = [
  { icon: Home, label: "Home" },
  { icon: Mic, label: "Studio" },
  { icon: LayoutGrid, label: "My works" },
];

const NAV_FOOT = [
  { icon: BookOpen, label: "Docs" },
  { icon: Terminal, label: "Developers" },
  { icon: CreditCard, label: "Plans & billing" },
  { icon: Settings, label: "Settings" },
];

function NavRow({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Home;
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12.5px] ${
        active
          ? "bg-[var(--st-card-2)] font-medium text-[var(--st-text)]"
          : "text-[var(--st-text-2)]"
      }`}
    >
      <Icon className="h-[15px] w-[15px] shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function DashboardFrame({
  crumb,
  active,
  children,
}: {
  /** Breadcrumb tail shown beside "Home" — omit on the Home screen itself. */
  crumb?: string;
  /** Which rail item is highlighted. */
  active: string;
  children: ReactNode;
}) {
  return (
    <div
      style={STUDIO}
      className="flex h-full overflow-hidden rounded-xl border border-[var(--st-line)] bg-[var(--st-bg)] shadow-[0_34px_80px_-34px_rgba(0,0,0,0.75)]"
    >
      {/* ── Left rail ─────────────────────────────────────────────────────
          Hidden below sm: at phone width it would eat half the panel and the
          panel body is what actually sells the product. */}
      <div className="hidden w-[168px] shrink-0 flex-col border-r border-[var(--st-line)] bg-[var(--st-rail)] p-2.5 sm:flex">
        <div className="flex items-center gap-2 px-1.5 py-1">
          <LogoMark className="h-[18px] w-[18px] shrink-0 text-[var(--st-text)]" />
          <span className="font-brand text-[13px] font-bold tracking-[-0.03em] text-[var(--st-text)]">
            TH-Labs
          </span>
        </div>

        {/* Plan chip */}
        <div className="mt-2 flex items-center gap-2 rounded-md border border-[var(--st-line)] bg-[var(--st-card)] px-2.5 py-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--st-accent)]" />
          <span className="truncate text-[12px] text-[var(--st-text-2)]">TH-Labs Free</span>
        </div>

        <ul className="mt-3 flex flex-col gap-0.5">
          {NAV_MAIN.map((n) => (
            <li key={n.label}>
              <NavRow icon={n.icon} label={n.label} active={n.label === active} />
            </li>
          ))}
        </ul>

        <ul className="mt-auto flex flex-col gap-0.5 border-t border-[var(--st-line)] pt-2.5">
          {NAV_FOOT.map((n) => (
            <li key={n.label}>
              <NavRow icon={n.icon} label={n.label} active={n.label === active} />
            </li>
          ))}
        </ul>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="flex h-11 shrink-0 items-center gap-3 border-b border-[var(--st-line)] px-3">
          <PanelLeft className="h-4 w-4 shrink-0 text-[var(--st-text-3)]" />
          <span className="flex shrink-0 items-center gap-1.5 text-[12.5px] text-[var(--st-text-2)]">
            Home
            {crumb && (
              <>
                <span className="text-[var(--st-text-3)]">›</span>
                <span className="font-medium text-[var(--st-text)]">{crumb}</span>
              </>
            )}
          </span>

          <span className="mx-auto hidden h-7 w-[210px] items-center gap-2 rounded-md border border-[var(--st-line)] bg-[var(--st-card)] px-2.5 text-[11.5px] text-[var(--st-text-3)] md:flex">
            <Search className="h-3 w-3 shrink-0" />
            Search everything…
            <span className="ml-auto flex gap-1">
              {["⌘", "K"].map((k) => (
                <span
                  key={k}
                  className="rounded border border-[var(--st-line-2)] px-1 text-[9.5px] leading-[14px]"
                >
                  {k}
                </span>
              ))}
            </span>
          </span>

          <span className="ml-auto flex shrink-0 items-center gap-2.5 md:ml-0">
            <span className="hidden text-[12px] text-[var(--st-text-2)] lg:inline">
              Feedback
            </span>
            <span className="hidden text-[12px] text-[var(--st-text-2)] lg:inline">Docs</span>
            <Bell className="hidden h-[15px] w-[15px] text-[var(--st-text-3)] sm:block" />
            <Moon className="hidden h-[15px] w-[15px] text-[var(--st-text-3)] sm:block" />
            <span className="flex items-center gap-1 rounded-md border border-[var(--st-line)] bg-[var(--st-card)] px-2 py-1 text-[11px] text-[var(--st-text)]">
              <Zap className="h-3 w-3 text-[var(--st-amber)]" />
              60
              <span className="text-[var(--st-text-3)]">credits</span>
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--st-card-2)] text-[10px] font-medium text-[var(--st-text-2)]">
              AA
            </span>
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

/* Small shared pieces ------------------------------------------------------ */

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[var(--st-line)] bg-[var(--st-card)] ${className}`}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--st-text-3)]">
      {children}
    </span>
  );
}

/* ── Panel 1 — Studio: set up your dub ───────────────────────────────────────
   The product's core screen: four numbered decisions down the left, the route
   they add up to on the right. */

const STEPS = [
  { n: "01", title: "Source", sub: "Nothing chosen yet" },
  { n: "02", title: "Languages", sub: "Auto-detect → Uzbek" },
  { n: "03", title: "Voice & mix", sub: "Voice clone · Keep background" },
];

const PIPELINE = [
  { icon: Mic, title: "Transcribe", sub: "Whisper", on: true },
  { icon: Globe, title: "Translate", sub: "UZ", on: true },
  { icon: Sparkles, title: "Clone voice", sub: "same speaker", on: true },
  { icon: Radio, title: "Sync lips", sub: "off", on: false },
];

export function DubbingPanel() {
  return (
    <DashboardFrame crumb="Studio" active="Studio">
      <div className="grid h-full min-h-0 gap-3 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        {/* Left — the four decisions */}
        <div className="flex min-h-0 flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-medium text-[var(--st-text)]">
              Set up your dub
            </span>
            <span className="text-[11.5px] text-[var(--st-text-3)]">0/4</span>
            <span className="ml-auto flex items-center gap-1.5 rounded-md border border-[var(--st-line)] px-2 py-1 text-[11px] text-[var(--st-text-2)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--st-text-3)]" />
              Guide
            </span>
          </div>

          {STEPS.map((s) => (
            <Card key={s.n} className="flex items-center gap-2.5 px-2.5 py-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--st-card-2)] font-mono text-[10px] text-[var(--st-text-3)]">
                {s.n}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-medium text-[var(--st-text)]">
                  {s.title}
                </span>
                <span className="block truncate text-[11px] text-[var(--st-text-3)]">
                  {s.sub}
                </span>
              </span>
              <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--st-text-3)]" />
            </Card>
          ))}

          {/* Step 4 is the open one — the segmented quality control is the most
              recognisable control on the screen, so it is the one shown live. */}
          <Card className="border-[var(--st-line-2)] px-2.5 py-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--st-accent)] font-mono text-[10px] font-medium text-white">
                04
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-medium text-[var(--st-text)]">
                  Quality
                </span>
                <span className="block text-[11px] text-[var(--st-text-3)]">Editing</span>
              </span>
              <ChevronUp className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--st-text-3)]" />
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-md bg-[var(--st-bg)] p-1">
              {["Fast", "Balanced", "Studio"].map((q) => (
                <span
                  key={q}
                  className={`rounded px-2 py-1 text-center text-[11.5px] ${
                    q === "Balanced"
                      ? "bg-[var(--st-card-2)] font-medium text-[var(--st-text)]"
                      : "text-[var(--st-text-3)]"
                  }`}
                >
                  {q}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-[var(--st-text-3)]">
              Balanced — separation + voice cloning on.
            </p>
          </Card>

          <div className="mt-auto hidden items-center gap-2 rounded-lg border border-[var(--st-line)] bg-[var(--st-card)] px-2.5 py-2 sm:flex">
            <CardLabel>This run</CardLabel>
            <span className="ml-auto font-mono text-[11px] text-[var(--st-text-2)]">
              10 <span className="text-[var(--st-text-3)]">/ 60 cr</span>
            </span>
          </div>
        </div>

        {/* Right — the route those decisions build */}
        <div className="hidden min-h-0 flex-col gap-3 md:flex">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-medium text-[var(--st-text)]">Route</span>
              <span className="ml-auto text-[11px] text-[var(--st-text-3)]">
                Waiting for a clip
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-[12.5px] text-[var(--st-text)]">
                <Globe className="h-4 w-4 text-[var(--st-accent)]" />
                Auto-detect
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--st-text-3)]" />
              <span className="flex items-center gap-1.5 rounded-md bg-[var(--st-card-2)] px-2 py-1 text-[12.5px] text-[var(--st-text)]">
                🇺🇿 Uzbek
              </span>
            </div>

            {/* The pipeline. Each stage lights up as the run reaches it; the
                connectors between them carry a travelling pulse so the row
                reads as a flow rather than four unrelated icons. */}
            <div className="mt-3.5 flex items-start">
              {PIPELINE.map((p, i) => (
                <div key={p.title} className="flex min-w-0 flex-1 items-start">
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <motion.span
                      className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                        p.on
                          ? "border-[var(--st-line-2)] bg-[var(--st-card-2)] text-[var(--st-text)]"
                          : "border-[var(--st-line)] text-[var(--st-text-3)]"
                      }`}
                      animate={p.on ? { opacity: [0.55, 1, 0.55] } : undefined}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: i * 0.45,
                        ease: "easeInOut",
                      }}
                    >
                      <p.icon className="h-3.5 w-3.5" />
                    </motion.span>
                    <span className="mt-1.5 truncate text-[10.5px] text-[var(--st-text-2)]">
                      {p.title}
                    </span>
                    <span className="truncate text-[10px] text-[var(--st-text-3)]">
                      {p.sub}
                    </span>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <span className="mt-3.5 h-px w-3 shrink-0 bg-[var(--st-line-2)] sm:w-5" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-3">
            <CardLabel>Estimate</CardLabel>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[26px] font-medium leading-none text-[var(--st-text)]">
                10
              </span>
              <span className="text-[12px] text-[var(--st-text-2)]">credits</span>
              <span className="ml-auto text-[10.5px] uppercase tracking-[0.12em] text-[var(--st-text-3)]">
                Balanced run
              </span>
            </div>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--st-bg)]">
              <motion.div
                className="h-full rounded-full bg-[var(--st-accent)]"
                initial={{ width: "0%" }}
                animate={{ width: "17%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />
            </div>
            <div className="mt-1.5 flex text-[10.5px] text-[var(--st-text-3)]">
              Balance 60<span className="ml-auto">After 50</span>
            </div>
          </Card>

          <div className="mt-auto flex items-center gap-2 text-[11px] text-[var(--st-text-3)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--st-green)]" />
            Pipeline online
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
}

/* ── Panel 2 — Live ──────────────────────────────────────────────────────── */

const LIVE_OUT = [
  { flag: "🇪🇸", lang: "Spanish", ms: "1.9s" },
  { flag: "🇫🇷", lang: "French", ms: "2.0s" },
  { flag: "🇯🇵", lang: "Japanese", ms: "2.2s" },
];

export function LivePanel() {
  return (
    <DashboardFrame crumb="Live" active="Studio">
      <div className="grid h-full min-h-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)]">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-[#3a1512] px-2 py-1 text-[11px] font-medium text-[#f87171]">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-[#f87171]"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              ON AIR
            </span>
            <span className="truncate font-mono text-[11px] text-[var(--st-text-3)]">
              rtmp://live.th-labs.uz/stream
            </span>
          </div>

          {/* Waveform — the incoming feed. Bars are seeded from their index so
              the shape is stable across renders and never hydration-mismatches. */}
          <Card className="flex min-h-0 flex-1 flex-col justify-center p-3">
            <div className="flex h-16 items-center justify-center gap-[3px]">
              {Array.from({ length: 44 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] shrink-0 rounded-full bg-[var(--st-accent)]"
                  style={{ opacity: 0.35 + ((i * 7) % 10) / 15 }}
                  animate={{
                    height: [
                      `${12 + ((i * 13) % 28)}%`,
                      `${34 + ((i * 29) % 62)}%`,
                      `${12 + ((i * 13) % 28)}%`,
                    ],
                  }}
                  transition={{
                    duration: 0.9 + ((i * 3) % 7) / 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 rounded-md bg-[var(--st-bg)] px-2.5 py-2 text-center">
              <span className="text-[12.5px] text-[var(--st-text)]">
                皆さん、こんにちは 👋
              </span>
              <span className="mt-0.5 block text-[10.5px] text-[var(--st-text-3)]">
                live caption · ja
              </span>
            </div>
          </Card>
        </div>

        <div className="hidden min-h-0 flex-col gap-3 md:flex">
          <Card className="p-3">
            <CardLabel>Latency</CardLabel>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[26px] font-medium leading-none text-[var(--st-text)]">
                2.0
              </span>
              <span className="text-[12px] text-[var(--st-text-2)]">seconds</span>
            </div>
            <p className="mt-1.5 text-[10.5px] text-[var(--st-text-3)]">
              Speech in, dubbed speech out.
            </p>
          </Card>

          <Card className="p-3">
            <CardLabel>Outputs</CardLabel>
            <ul className="mt-2 flex flex-col gap-1.5">
              {LIVE_OUT.map((o) => (
                <li
                  key={o.lang}
                  className="flex items-center gap-2 rounded-md bg-[var(--st-bg)] px-2 py-1.5"
                >
                  <span className="text-[12px]">{o.flag}</span>
                  <span className="truncate text-[11.5px] text-[var(--st-text-2)]">
                    {o.lang}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[10.5px] text-[var(--st-text-3)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--st-green)]" />
                    {o.ms}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="mt-auto flex items-center gap-2 text-[11px] text-[var(--st-text-3)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--st-green)]" />
            3 destinations connected
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
}

/* ── Panel 3 — Subtitles ─────────────────────────────────────────────────── */

const CUES = [
  { t: "00:04.120", s: "Bienvenidos de nuevo al programa.", active: false },
  { t: "00:07.480", s: "Hoy hablamos de sincronización labial.", active: true },
  { t: "00:11.900", s: "Empecemos por el principio.", active: false },
];

export function SubtitlePanel() {
  return (
    <DashboardFrame crumb="Subtitles" active="My works">
      <div className="grid h-full min-h-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)]">
        <div className="flex min-h-0 flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-[var(--st-card-2)] px-2 py-1 text-[11.5px] text-[var(--st-text)]">
              🇪🇸 Spanish
              <ChevronDown className="h-3 w-3 text-[var(--st-text-3)]" />
            </span>
            <span className="text-[11px] text-[var(--st-text-3)]">142 cues · aligned</span>
            <span className="ml-auto flex items-center gap-1 text-[11px] text-[var(--st-text-2)]">
              <Pencil className="h-3 w-3" />
              Edit
            </span>
          </div>

          <ul className="flex flex-col gap-1.5">
            {CUES.map((c) => (
              <li
                key={c.t}
                className={`rounded-lg border px-2.5 py-2 ${
                  c.active
                    ? "border-[var(--st-accent)]/45 bg-[var(--st-card-2)]"
                    : "border-[var(--st-line)] bg-[var(--st-card)]"
                }`}
              >
                <span className="font-mono text-[10px] text-[var(--st-text-3)]">{c.t}</span>
                <span className="mt-0.5 flex items-center gap-1.5">
                  <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--st-text)]">
                    {c.s}
                  </span>
                  {c.active && (
                    <motion.span
                      className="h-3 w-px shrink-0 bg-[var(--st-accent)]"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                    />
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Scrubber */}
          <Card className="mt-auto p-2.5">
            <div className="flex h-8 items-end gap-[2px]">
              {Array.from({ length: 56 }).map((_, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-[var(--st-line-2)]"
                  style={{ height: `${18 + ((i * 17) % 80)}%` }}
                />
              ))}
            </div>
            <motion.div
              className="mt-1.5 h-px bg-[var(--st-accent)]"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />
          </Card>
        </div>

        <div className="hidden min-h-0 flex-col gap-3 md:flex">
          <Card className="p-3">
            <CardLabel>Export</CardLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["SRT", "VTT", "TTML", "Burn-in"].map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1 rounded-md border border-[var(--st-line-2)] bg-[var(--st-bg)] px-2 py-1 font-mono text-[10.5px] text-[var(--st-text-2)]"
                >
                  <Check className="h-2.5 w-2.5 text-[var(--st-green)]" />
                  {f}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-3">
            <CardLabel>Alignment</CardLabel>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[26px] font-medium leading-none text-[var(--st-text)]">
                99.4
              </span>
              <span className="text-[12px] text-[var(--st-text-2)]">%</span>
            </div>
            <p className="mt-1.5 text-[10.5px] text-[var(--st-text-3)]">
              Cue timings matched to the dubbed track.
            </p>
          </Card>

          <div className="mt-auto flex items-center gap-2 text-[11px] text-[var(--st-text-3)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--st-green)]" />
            Saved to My works
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
}
