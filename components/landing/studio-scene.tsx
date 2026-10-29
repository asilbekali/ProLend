"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScroll } from "motion/react";
import {
  AudioLines,
  Check,
  Download,
  Film,
  Languages,
  Mic,
  Music,
  Smile,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { AnimatedNumber, SceneHead, useStep } from "./primitives";
import { V, thumb } from "./media";

/*
 * The Studio, as a visitor would actually use it — taken from a real run on
 * the live Studio: four short choices on the left (source, languages, voice,
 * quality), then the pipeline on the right filling in stage by stage until the
 * original and the dub sit side by side. Scroll drives every beat.
 */

const CLIP = V.mkbhdPhone;

const STAGES: { label: string; Icon: LucideIcon }[] = [
  { label: "Speech-to-text", Icon: Mic },
  { label: "Translation", Icon: Languages },
  { label: "Voice cloning", Icon: AudioLines },
  { label: "Background kept", Icon: Music },
  { label: "Lip-sync", Icon: Smile },
  { label: "Sync & mix", Icon: Film },
];

// Figures from that real test run (a short English clip dubbed into Uzbek).
const METRICS = [
  { value: 89.9, decimals: 1, unit: "%", label: "Speech recognised" },
  { value: 75.5, decimals: 1, unit: "%", label: "Speaker similarity" },
  { value: 37.9, decimals: 1, unit: " ms", label: "Lip-sync offset" },
];

// Step plan (0–12): 0 empty · 1 uploaded · 2 language · 3 voice · 4 quality ·
// 5 start · 6–10 stages · 11 complete · 12 result
const STEPS = 12;

function SetupRow({
  n,
  title,
  done,
  active,
  children,
}: {
  n: string;
  title: string;
  done: boolean;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border px-3.5 py-3 transition-colors duration-500 ${
        active ? "border-white/25 bg-white/[0.06]" : "border-white/[0.07] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] transition-colors duration-500 ${
            done ? "bg-[#1f3d2b] text-[#6ee7a0]" : "bg-white/[0.06] text-white/50"
          }`}
        >
          {done ? <Check className="h-3.5 w-3.5" /> : <span className="font-num">{n}</span>}
        </span>
        <span className="text-[13px] font-medium text-white">{title}</span>
      </div>
      <div className="mt-2 pl-10 text-[12px] text-white/55">{children}</div>
    </div>
  );
}

function Seg({ options, on }: { options: string[]; on: number }) {
  return (
    <div className="inline-flex rounded-lg bg-white/[0.05] p-0.5">
      {options.map((o, i) => (
        <span
          key={o}
          className={`rounded-md px-2.5 py-1 text-[11px] transition-colors duration-500 ${
            i === on ? "bg-white/15 text-white" : "text-white/40"
          }`}
        >
          {o}
        </span>
      ))}
    </div>
  );
}

export default function StudioScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const step = useStep(scrollYProgress, STEPS);

  const running = step >= 5;
  const stagesDone = Math.max(0, Math.min(STAGES.length, step - 5));
  const complete = step >= 11;
  const showResult = step >= 12;
  const percent = complete ? 100 : running ? Math.round((stagesDone / STAGES.length) * 100) : 0;

  return (
    <section ref={ref} id="studio" className="relative h-[420svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-4 sm:px-6">
        <SceneHead
          title="Upload. Choose. Dub."
          sub="Drop in a video, pick a language and a voice — the Studio does the rest."
        />

        {/* One panel at a time on phones (setup, then the run), side by side
            from lg — both live in the same grid cell until then. */}
        <div className="mx-auto mt-6 grid w-full max-w-5xl gap-4 sm:mt-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* ── Setup ─────────────────────────────────────────────── */}
          <div
            className={`col-start-1 row-start-1 flex flex-col gap-2 transition-opacity duration-500 lg:opacity-100 ${
              running ? "pointer-events-none opacity-0 lg:pointer-events-auto" : "opacity-100"
            }`}
          >
            <SetupRow n="01" title="Source" done={step >= 1} active={step === 0}>
              {step >= 1 ? (
                <span className="flex items-center gap-2">
                  <span className="relative block aspect-video w-14 overflow-hidden rounded">
                    <Image src={thumb(CLIP.id)} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  launch-video.mp4 · <span className="font-num">4:12</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 px-3 py-2.5">
                  <Upload className="h-4 w-4 animate-pulse" />
                  Drop a video or audio file · MP4, MOV, MP3
                </span>
              )}
            </SetupRow>
            <SetupRow n="02" title="Languages" done={step >= 2} active={step === 1}>
              <span className="inline-flex items-center gap-1.5">
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5">Auto-detect · English</span>
                →
                <span
                  className={`rounded px-1.5 py-0.5 transition-colors duration-500 ${
                    step >= 2 ? "bg-[var(--chip-bg)] text-[var(--chip-fg)]" : "bg-white/[0.06]"
                  }`}
                >
                  O&rsquo;zbek
                </span>
              </span>
            </SetupRow>
            <SetupRow n="03" title="Voice & mix" done={step >= 3} active={step === 2}>
              <Seg
                options={["Their voice", "Native speaker", "Another voice"]}
                on={step >= 3 ? 0 : -1}
              />
            </SetupRow>
            <SetupRow n="04" title="Quality" done={step >= 4} active={step === 3}>
              <Seg options={["Fast", "Balanced", "Studio"]} on={step >= 4 ? 1 : -1} />
            </SetupRow>
            <div
              className={`mt-1 flex h-11 items-center justify-center rounded-xl text-[13px] font-medium transition-all duration-500 ${
                step >= 4 ? "bg-white text-black" : "bg-white/[0.06] text-white/35"
              } ${step === 5 ? "scale-[0.97]" : ""}`}
            >
              {running ? "Dubbing…" : "Start dubbing →"}
            </div>
          </div>

          {/* ── The run ───────────────────────────────────────────── */}
          <div
            className={`col-start-1 row-start-1 flex flex-col rounded-2xl border border-white/10 bg-[#0b0b0b] p-4 transition-opacity duration-500 sm:p-5 lg:col-start-2 ${
              running ? "opacity-100" : "opacity-0 lg:opacity-40"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[13px] text-white">
                  {complete ? "Dub complete" : running ? "Running pipeline" : "Waiting for a clip"}
                  {running ? (
                    <span className="rounded-full bg-[#1f3d2b] px-1.5 text-[9px] font-medium tracking-wide text-[#6ee7a0]">
                      LIVE
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-white/35">
                  launch-video.mp4 · EN → UZ
                </p>
              </div>
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,.08)"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={complete ? "#6ee7a0" : "white"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${(percent / 100) * 100.5} 100.5`}
                    className="transition-[stroke-dasharray] duration-500"
                  />
                </svg>
                <AnimatedNumber value={percent} className="font-num text-[12px] text-white" />
              </span>
            </div>

            <ol className="mt-4 grid grid-cols-6 gap-1">
              {STAGES.map((s, i) => {
                const done = i < stagesDone || complete;
                const now = running && !complete && i === stagesDone;
                return (
                  <li key={s.label} className="flex flex-col items-center gap-1.5 text-center">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-500 sm:h-10 sm:w-10 ${
                        done
                          ? "border-[#2c5a3d] bg-[#1f3d2b] text-[#6ee7a0]"
                          : now
                            ? "animate-pulse border-white/40 bg-white/10 text-white"
                            : "border-white/[0.07] text-white/25"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : <s.Icon className="h-4 w-4" />}
                    </span>
                    <span
                      className={`text-[9px] leading-tight sm:text-[10px] ${done || now ? "text-white/70" : "text-white/30"}`}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* Result: original and dub side by side, as the Studio shows it. */}
            <div
              className={`mt-4 grid grid-cols-2 gap-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showResult ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              {[
                { tag: "Original", lang: "EN", line: "This is the iPhone Duo." },
                { tag: "Dubbed", lang: "UZ", line: "Bu — iPhone Duo." },
              ].map((v) => (
                <div key={v.tag}>
                  <p className="mb-1 flex items-center gap-1.5 text-[11px] text-white/60">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${v.tag === "Dubbed" ? "bg-[#6ee7a0]" : "bg-white/40"}`}
                    />
                    {v.tag}
                  </p>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={thumb(CLIP.id)}
                      alt={`${CLIP.creator} — ${CLIP.title} (${v.tag.toLowerCase()})`}
                      fill
                      sizes="(max-width: 1024px) 45vw, 300px"
                      className="object-cover"
                    />
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1 font-mono text-[9px] text-white">
                      {v.lang}
                    </span>
                    <span className="absolute bottom-1.5 left-1/2 max-w-[92%] -translate-x-1/2 truncate rounded bg-black/75 px-1.5 text-[10px] text-white">
                      {v.line}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 transition-opacity delay-150 duration-700 ${
                showResult ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-medium text-black">
                <Download className="h-3.5 w-3.5" />
                Download dub
              </span>
              {METRICS.map((m) => (
                <span key={m.label} className="flex flex-col">
                  <span className="text-[15px] leading-none text-white">
                    <AnimatedNumber
                      value={showResult ? m.value : 0}
                      decimals={m.decimals}
                      duration={700}
                      className="font-num"
                    />
                    <span className="text-[11px] text-white/50">{m.unit}</span>
                  </span>
                  <span className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/35">
                    {m.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
