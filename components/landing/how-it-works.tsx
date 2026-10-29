"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  AudioLines,
  Check,
  Download,
  FileVideo,
  Film,
  Globe2,
  Home,
  Languages,
  Mic,
  Play,
  Settings2,
  Share2,
  Smile,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { CtaPair, Eyebrow, Waveform } from "./primitives";

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Upload it",
    body: "Paste a link or drop a file — a vlog, a podcast, a short film. The spoken language is detected for you.",
    Icon: Upload,
  },
  {
    title: "Choose it",
    body: "Pick the language, keep the speaker's own voice, and choose Fast, Balanced or Studio quality. Nothing else to set.",
    Icon: Settings2,
  },
  {
    title: "Share it everywhere",
    body: "Download the dub with matched lips and subtitles, or add more languages from the same upload.",
    Icon: Share2,
  },
];

const STEP_MS = 5200;
const EASE = [0.16, 1, 0.3, 1] as const;

const PIPE: { label: string; Icon: LucideIcon }[] = [
  { label: "Transcribe", Icon: Mic },
  { label: "Translate", Icon: Languages },
  { label: "Clone voice", Icon: AudioLines },
  { label: "Sync lips", Icon: Smile },
  { label: "Mix", Icon: Film },
];

function Seg({ options, on }: { options: string[]; on: number }) {
  return (
    <div className="inline-flex rounded-full bg-white/[0.06] p-0.5">
      {options.map((o, i) => (
        <span
          key={o}
          className={`rounded-full px-2.5 py-1 text-[10px] transition-colors duration-500 sm:text-[11px] ${
            i === on ? "bg-white text-black" : "text-white/45"
          }`}
        >
          {o}
        </span>
      ))}
    </div>
  );
}

/** The Studio window, acting out the active step. */
function Window({ step, t }: { step: number; t: number }) {
  return (
    <div className="panel relative aspect-[4/3] w-full overflow-hidden rounded-3xl sm:aspect-[16/11]">
      {/* Tool rail + toolbar, as in the Studio */}
      <div className="absolute left-3 top-1/2 flex -translate-y-1/2 flex-col gap-2.5 rounded-full bg-white/[0.06] px-1.5 py-3 text-white/45">
        {[Home, Upload, Globe2, Settings2, Download].map((I, i) => (
          <I key={i} className={`h-3.5 w-3.5 ${i === step + 1 ? "text-white" : ""}`} />
        ))}
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-1.5">
        <span className="h-5 w-5 rounded-full bg-white/[0.08]" />
        <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] text-white/60">
          <span className="font-num">17</span> credits
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pl-12 pr-4 pt-8 sm:pl-14 sm:pr-8">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="w-full max-w-sm"
            >
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/20 px-4 py-6 text-center">
                <Upload className="h-5 w-5 text-white/60" />
                <p className="text-[12px] text-white/70">Drop a video or audio file</p>
                <p className="text-[10px] text-white/35">MP4, MOV, WAV, MP3 · or paste a link</p>
              </div>
              <div
                className={`mt-3 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-2.5 transition-opacity duration-500 ${
                  t > 0.25 ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--orange)]/15 text-[var(--orange)]">
                  <FileVideo className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] text-white">vlog-12.mp4</p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[var(--orange)] transition-[width] duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, (t - 0.25) / 0.5) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-white/50">
                  {t > 0.75 ? "English detected" : "Uploading…"}
                </span>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex w-full max-w-sm flex-col gap-2.5"
            >
              {[
                {
                  n: "Languages",
                  done: t > 0.15,
                  el: (
                    <span className="flex items-center gap-1.5 text-[11px] text-white/70">
                      English →
                      <span
                        className={`rounded-full px-2 py-0.5 transition-colors duration-500 ${
                          t > 0.15 ? "bg-[var(--orange)] text-white" : "bg-white/[0.06]"
                        }`}
                      >
                        O&rsquo;zbek
                      </span>
                    </span>
                  ),
                },
                {
                  n: "Voice",
                  done: t > 0.45,
                  el: <Seg options={["Their voice", "Native", "Other"]} on={t > 0.45 ? 0 : -1} />,
                },
                {
                  n: "Quality",
                  done: t > 0.75,
                  el: <Seg options={["Fast", "Balanced", "Studio"]} on={t > 0.75 ? 1 : -1} />,
                },
              ].map((r) => (
                <div
                  key={r.n}
                  className="flex items-center justify-between gap-2 rounded-2xl bg-white/[0.05] px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-[12px] text-white">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-500 ${
                        r.done ? "bg-[var(--green)] text-black" : "bg-white/10"
                      }`}
                    >
                      {r.done ? <Check className="h-3 w-3" /> : null}
                    </span>
                    {r.n}
                  </span>
                  {r.el}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="w-full max-w-md"
            >
              <ol className="flex justify-between gap-1">
                {PIPE.map((p, i) => {
                  const done = t > (i + 1) / (PIPE.length + 2);
                  return (
                    <li key={p.label} className="flex flex-1 flex-col items-center gap-1">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${
                          done
                            ? "bg-[var(--green)]/20 text-[var(--green)]"
                            : "bg-white/[0.06] text-white/35"
                        }`}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <p.Icon className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="text-[9px] text-white/50">{p.label}</span>
                    </li>
                  );
                })}
              </ol>
              <div
                className={`mt-3 grid grid-cols-2 gap-2 transition-opacity duration-500 ${
                  t > 0.72 ? "opacity-100" : "opacity-0"
                }`}
              >
                {[
                  {
                    tag: "Original · EN",
                    line: "Today I'll show you something new.",
                    bar: "bg-white/50",
                  },
                  {
                    tag: "Dubbed · UZ",
                    line: "Bugun sizga yangi narsani ko'rsataman.",
                    bar: "bg-[var(--green)]",
                  },
                ].map((v) => (
                  <div key={v.tag} className="overflow-hidden rounded-xl bg-white/[0.05]">
                    <div className="relative aspect-video">
                      {/* A creator's video frame, drawn rather than borrowed. */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(40% 55% at 50% 62%, rgba(0,0,0,0.55), transparent 70%), linear-gradient(150deg, #3b2312, #c2410c 70%, #ffb347 130%)",
                        }}
                      />
                      <Play className="absolute left-1/2 top-[40%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 fill-white/90 text-white/90" />
                      <span className="absolute bottom-1 left-1/2 max-w-[94%] -translate-x-1/2 truncate rounded bg-black/70 px-1 text-[9px] text-white">
                        {v.line}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <span className="text-[9px] text-white/60">{v.tag}</span>
                      <Waveform
                        seed={3.3}
                        count={14}
                        className="h-3 flex-1 justify-between"
                        barClassName={v.bar}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`mt-2 flex items-center justify-between rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-black transition-opacity duration-500 ${
                  t > 0.85 ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Download dub
                </span>
                <span className="text-black/50">.mp4 · .srt</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  // Desktop pins the section and lets scroll drive it, as the reference
  // does; phones (where the copy and window don't fit one screen) play the
  // steps on a timer instead.
  const pinned = useMediaQuery("(min-width: 1024px)");
  const [step, setStep] = useState(0);
  const [t, setT] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 0–0.14: the window alone, centred · then it slides left as the copy
  // arrives · 0.18–1: the three steps, a third of the scroll each.
  const windowX = useTransform(scrollYProgress, [0.02, 0.16], ["42%", "0%"]);
  const copyOpacity = useTransform(scrollYProgress, [0.1, 0.18], [0, 1]);
  const copyX = useTransform(scrollYProgress, [0.1, 0.18], [40, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const k = Math.min(0.9999, Math.max(0, (v - 0.18) / 0.8)) * STEPS.length;
    setStep(Math.floor(k));
    setT(k - Math.floor(k));
  });

  // Phones: each step plays for STEP_MS, then hands over to the next.
  useEffect(() => {
    if (pinned) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = (now - start) / STEP_MS;
      if (k >= 1) {
        setStep((s) => (s + 1) % STEPS.length);
        return;
      }
      setT(k);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step, pinned]);

  // On desktop a step click scrolls to that step's stretch of the pin.
  const goTo = (i: number) => {
    const el = ref.current;
    if (!pinned || !el) return setStep(i);
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + span * (0.18 + (0.8 * (i + 0.05)) / STEPS.length),
      behavior: "smooth",
    });
  };

  return (
    <section ref={ref} id="how" className="relative scroll-mt-16 lg:h-[360svh]">
      <div className="px-4 py-24 sm:px-6 sm:py-32 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:py-0">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <motion.div style={pinned ? { x: windowX } : undefined} className="order-2 lg:order-1">
            <Window step={step} t={t} />
          </motion.div>

          <motion.div
            style={pinned ? { opacity: copyOpacity, x: copyX } : undefined}
            className="order-1 text-center lg:order-2 lg:text-left"
          >
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.04] text-white">
              Upload it. Choose it.
              <br />
              Share it everywhere.
            </h2>
            <CtaPair className="mt-6" />

            <ol className="mt-8 flex flex-col gap-2">
              {STEPS.map((s, i) => {
                const on = i === step;
                return (
                  <li key={s.title} className={on ? "" : "hidden lg:block"}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-300 ${
                        on ? "panel border-white/15" : "border-white/[0.06] hover:border-white/15"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                            on ? "border-white/30 text-white" : "border-white/10 text-white/45"
                          }`}
                        >
                          <s.Icon className="h-4 w-4" />
                        </span>
                        <span
                          className={`text-[14px] font-medium ${on ? "text-white" : "text-white/55"}`}
                        >
                          {s.title}
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {on ? (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="overflow-hidden pl-12 text-[13px] leading-relaxed text-white/50"
                          >
                            <span className="block pt-1.5">{s.body}</span>
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                      {on ? (
                        <span
                          className="absolute bottom-0 left-0 h-[2px] bg-[var(--orange)]"
                          style={{ width: `${t * 100}%` }}
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
            {/* Phones show one step at a time, like the reference. */}
            <div className="mt-4 flex justify-center gap-1.5 lg:hidden">
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`Show step: ${s.title}`}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "w-5 bg-white" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
