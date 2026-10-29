"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import {
  GraduationCap,
  Mic,
  Mic2,
  PlaySquare,
  Presentation,
  Video,
  type LucideIcon,
} from "lucide-react";
import { TileView, type Tile } from "./tiles";
import { useStep } from "./primitives";
import { V } from "./media";

type Stack = {
  name: string;
  where: string;
  Icon: LucideIcon;
  tiles: Tile[];
  /** Scattered, then circling the promise, then piled up — % of the stage. */
  from: [number, number];
  ring: [number, number];
  pile: [number, number];
};

const STACKS: Stack[] = [
  {
    name: "YouTube",
    where: "Challenges · Vlogs",
    Icon: PlaySquare,
    from: [15, 24],
    ring: [26, 28],
    pile: [44, 44],
    tiles: [
      { kind: "video", video: V.beastExtreme, badge: "EN" },
      { kind: "video", video: V.roberCheater, badge: "EN" },
    ],
  },
  {
    name: "Meetings",
    where: "Zoom · Meet · Teams",
    Icon: Video,
    from: [50, 10],
    ring: [50, 18],
    pile: [52, 40],
    tiles: [
      { kind: "photo", photo: "callGallery", badge: "LIVE" },
      { kind: "photo", photo: "callCrew", badge: "LIVE" },
    ],
  },
  {
    name: "Events",
    where: "Keynotes · Talks",
    Icon: Presentation,
    from: [85, 24],
    ring: [74, 28],
    pile: [58, 46],
    tiles: [
      { kind: "video", video: V.tedRecipe, badge: "EN" },
      { kind: "video", video: V.appleEvent, badge: "EN" },
    ],
  },
  {
    name: "Classes",
    where: "Lectures · Courses",
    Icon: GraduationCap,
    from: [13, 76],
    ring: [26, 72],
    pile: [43, 56],
    tiles: [
      { kind: "photo", photo: "classVideo", badge: "LIVE" },
      { kind: "video", video: V.cs50Doom, badge: "EN" },
    ],
  },
  {
    name: "Podcasts",
    where: "Interviews · Shows",
    Icon: Mic,
    from: [50, 90],
    ring: [50, 82],
    pile: [50, 60],
    tiles: [
      { kind: "video", video: V.lexTaiwan, badge: "EN" },
      { kind: "wave", seed: 1.4, label: "audio" },
    ],
  },
  {
    name: "Creators",
    where: "Reviews · Shorts",
    Icon: Mic2,
    from: [87, 76],
    ring: [74, 72],
    pile: [57, 55],
    tiles: [
      { kind: "video", video: V.mkbhdLaptop, badge: "EN" },
      { kind: "video", video: V.beastLbs, badge: "EN" },
    ],
  },
];

/**
 * Pinned scene, two beats. First the problem — everything you make is stuck in
 * the language you made it in, scattered across every place you publish. Then
 * the stacks pull in around the promise.
 */
export default function GatherScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 0: scattered · 1: circling the promise · 2: one pile
  const step = useStep(scrollYProgress, 2);
  const gathered = step >= 1;
  const piled = step >= 2;

  return (
    <section ref={ref} id="gather" className="relative h-[300svh]">
      <div className="sticky top-0 h-svh overflow-hidden [--ts:0.7] sm:[--ts:0.85] lg:[--ts:1]">
        {STACKS.map((s, i) => {
          const [x, y] = piled ? s.pile : gathered ? s.ring : s.from;
          return (
            <div
              key={s.name}
              aria-hidden="true"
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-[left,top,scale] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: "calc(150px * var(--ts))",
                fontSize: "calc(150px * var(--ts) * 0.13)",
                opacity: 1,
                scale: piled ? "0.8" : "1",
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {/* Two clips fanned behind a frosted icon — the reference's
                  "platform" stacks. A fixed box keeps every stack the same size. */}
              <div className="relative aspect-[4/3]">
                {s.tiles.map((t, j) => (
                  <div
                    key={j}
                    className="absolute left-1/2 top-1/2 w-[86%] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]"
                    style={{
                      transform: `translate(calc(-50% + ${(j - 0.5) * 30}%), calc(-50% + ${(j - 0.5) * 12}%)) rotate(${(j - 0.5) * 8}deg)`,
                    }}
                  >
                    <TileView tile={t} sizes="(max-width: 768px) 110px, 140px" />
                  </div>
                ))}
                <div className="absolute left-1/2 top-1/2 z-10 flex w-[54%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border border-white/10 bg-[#161616]/85 px-2 py-2.5 text-center backdrop-blur-xl">
                  <s.Icon className="h-5 w-5 text-white/90" strokeWidth={1.4} />
                  <span className="text-[11px] font-medium leading-tight text-white/90">
                    {s.name}
                  </span>
                  <span className="text-[9px] leading-tight text-white/45">{s.where}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="z-content pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <h2
            className={`absolute max-w-xl text-balance text-center text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.12] text-white transition-all duration-700 [text-shadow:0_2px_30px_#000,0_0_8px_#000] ${
              gathered ? "-translate-y-3 opacity-0 blur-sm" : "opacity-100"
            }`}
          >
            Your videos, classes and calls are stuck in one language.
          </h2>
          <h2
            className={`absolute max-w-xl text-balance text-center text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.12] text-white transition-all duration-700 [text-shadow:0_2px_30px_#000,0_0_8px_#000] ${
              piled
                ? "translate-y-[min(34vh,260px)] opacity-100"
                : gathered
                  ? "opacity-100"
                  : "translate-y-3 opacity-0 blur-sm"
            }`}
          >
            TH-Labs carries it into 42+ languages — in your own voice.
          </h2>
        </div>
      </div>
    </section>
  );
}
