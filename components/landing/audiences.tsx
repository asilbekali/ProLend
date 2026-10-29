"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTime,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Clapperboard, Megaphone, Mic, PlaySquare, Radio, type LucideIcon } from "lucide-react";
import LogoMark from "../logo-mark";
import { CtaPair, Eyebrow, Squiggle, useCycle } from "./primitives";
import { ExportCard, LangCard, LiveCard, SubtitleCard, TrackCard, VoiceCard } from "./cards";

// Who TH-Labs sells to, from the pitch deck's target-audience slide.
const AUDIENCES: { word: string; title: string; body: string; Icon: LucideIcon }[] = [
  {
    word: "creator",
    title: "Creators & bloggers",
    body: "Publish once and reach viewers in every language, in your own voice — no re-recording.",
    Icon: PlaySquare,
  },
  {
    word: "film",
    title: "Filmmakers & studios",
    body: "Films, series and trailers dubbed in a fraction of the time, keeping the original cast's voices.",
    Icon: Clapperboard,
  },
  {
    word: "podcast",
    title: "Podcasters",
    body: "Every episode in new languages, spoken in the host's and guests' own voices.",
    Icon: Mic,
  },
  {
    word: "stream",
    title: "Live streamers",
    body: "Go live in one language and be heard in many — about two seconds behind.",
    Icon: Radio,
  },
  {
    word: "campaign",
    title: "Brands & agencies",
    body: "Ads and launch videos localised for every market without re-shooting a frame.",
    Icon: Megaphone,
  },
];

function StudioCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-xl">
      <div className="relative aspect-[16/10]">
        <Image
          src="/media/studio-dub.jpg"
          alt=""
          fill
          sizes="260px"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/**
 * The cards that sweep round the mark. `a` is the starting angle, `r` the
 * orbit radius (in container widths — two rings, inner and outer) and `dim`
 * pushes a card back in depth, as the reference does.
 */
const ORBIT: { node: React.ReactNode; w: number; a: number; r: number; dim?: boolean }[] = [
  { node: <StudioCard />, w: 260, a: 0, r: 40 },
  { node: <LangCard word="Русский" code="UZ → RU" />, w: 150, a: 45, r: 52, dim: true },
  { node: <VoiceCard lang="English" seed={5.5} />, w: 210, a: 90, r: 40 },
  { node: <LiveCard photo="callGallery" caption="Efirga xush kelibsiz!" />, w: 230, a: 135, r: 52 },
  {
    node: (
      <SubtitleCard lang="Español" lines={[["00:00:02,400", "Hoy les voy a mostrar algo nuevo."]]} />
    ),
    w: 190,
    a: 180,
    r: 40,
  },
  { node: <ExportCard name="short-film_es.mp4" />, w: 220, a: 225, r: 52, dim: true },
  { node: <TrackCard />, w: 220, a: 270, r: 40 },
  { node: <LangCard word="Türkçe" code="EN → TR" />, w: 150, a: 315, r: 52 },
];

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

/** A point at `angle` on a circle of radius `r` (container widths), 0×0. */
function OnCircle({
  angle,
  r,
  children,
  className = "",
}: {
  angle: number;
  r: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 h-0 w-0 ${className}`}
      style={{ transform: `rotate(${angle}deg) translateY(-${r}cqw) rotate(${-angle}deg)` }}
    >
      {children}
    </div>
  );
}

/**
 * The orbit, as on the reference: the mark plain and centred inside thin
 * rings with tick dots, a small dot running round the inner ring, and big
 * upright cards sweeping round it on two perfect circles. Scroll turns it,
 * with a slow drift on top so it never stands still.
 *
 * Every pivot is a zero-size point, so a card's centre never leaves its ring:
 *   ring (turns) → anchor on the circle (0×0) → counter-turn (0×0) → card.
 */
function Orbit({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const time = useTime();
  const turn = useTransform(() => progress.get() * 220 + (reduce ? 0 : (time.get() / 1000) * 3));
  const upright = useTransform(turn, (v) => -v);
  const runner = useTransform(turn, (v) => v * 1.6);

  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-[min(100vw,600px)] [--s:0.5] [container-type:inline-size] sm:[--s:0.66] lg:w-[min(96vh,880px)] lg:[--s:0.9]"
    >
      {/* rings */}
      <div className="absolute left-1/2 top-1/2 h-[44cqw] w-[44cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]" />
      <div className="absolute left-1/2 top-1/2 h-[64cqw] w-[64cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
      {TICKS.map((a) => (
        <OnCircle key={a} angle={a} r={22}>
          <span className="absolute -left-[2px] -top-[2px] h-[4px] w-[4px] rounded-full bg-white/35" />
        </OnCircle>
      ))}
      {/* the small dot running round the inner ring */}
      <motion.div style={{ rotate: runner }} className="absolute inset-0">
        <OnCircle angle={0} r={22}>
          <span className="absolute -left-[4px] -top-[4px] h-2 w-2 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.7)]" />
        </OnCircle>
      </motion.div>

      {/* the cards */}
      <motion.div style={{ rotate: turn }} className="absolute inset-0 z-10">
        {ORBIT.map((o, k) => (
          <OnCircle key={k} angle={o.a} r={o.r}>
            <motion.div style={{ rotate: upright }} className="absolute left-0 top-0 h-0 w-0">
              <div
                className={`absolute left-0 top-0 transition-opacity ${
                  o.dim ? "opacity-45 blur-[1px] brightness-75" : ""
                }`}
                style={{ width: o.w, transform: "translate(-50%, -50%) scale(var(--s))" }}
              >
                {o.node}
              </div>
            </motion.div>
          </OnCircle>
        ))}
      </motion.div>

      {/* the mark: plain, white, dead centre, above everything */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <LogoMark className="h-[15cqw] w-[15cqw]" />
      </div>
    </div>
  );
}

export default function Audiences() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useCycle(AUDIENCES.length, 4200);
  const a = AUDIENCES[i];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    // Desktop pins the scene so the mark holds still while the cards sweep
    // round it; phones scroll it like any section.
    <section id="audiences" ref={ref} className="relative scroll-mt-16 lg:h-[240svh]">
      <div className="relative overflow-hidden py-20 lg:sticky lg:top-0 lg:h-svh lg:py-0">
        <div className="flex justify-center lg:absolute lg:left-[34%] lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Orbit progress={scrollYProgress} />
        </div>

        <div className="relative z-20 mx-auto mt-6 max-w-[440px] px-4 text-center sm:px-6 lg:absolute lg:right-[max(1.5rem,calc((100vw-1180px)/2))] lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:px-0 lg:text-left">
          <Eyebrow className="!text-[var(--orange)]">Built for how people actually speak</Eyebrow>
          <h2 className="mt-3 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.06] text-white">
            One voice.
            <br />
            Every{" "}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={a.word}
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
                className="inline-block"
              >
                <Squiggle>{a.word}</Squiggle>
              </motion.span>
            </AnimatePresence>
          </h2>
          <CtaPair className="mt-6" />

          <ul className="mt-8 flex flex-col gap-2">
            {AUDIENCES.map((x, k) => {
              const on = k === i;
              return (
                <li key={x.title} className={on ? "" : "hidden lg:block"}>
                  <button
                    type="button"
                    onClick={() => setI(k)}
                    className={`w-full rounded-2xl border p-3.5 text-left backdrop-blur-md transition-colors duration-300 ${
                      on
                        ? "panel border-white/15"
                        : "border-white/[0.06] bg-black/40 hover:border-white/15"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                          on ? "border-white/30 text-white" : "border-white/10 text-white/45"
                        }`}
                      >
                        <x.Icon className="h-4 w-4" />
                      </span>
                      <span
                        className={`text-[14px] font-medium ${on ? "text-white" : "text-white/55"}`}
                      >
                        {x.title}
                      </span>
                    </span>
                    {on ? (
                      <span className="block animate-[fadeUp_.35s_ease-out] pl-11 pt-1.5 text-[13px] leading-relaxed text-white/50">
                        {x.body}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-center gap-1.5 lg:hidden">
            {AUDIENCES.map((x, k) => (
              <button
                key={x.title}
                type="button"
                aria-label={`Show ${x.title}`}
                onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  k === i ? "w-5 bg-white" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
