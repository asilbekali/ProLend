"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { TileView, type Tile } from "./tiles";
import { SceneHead } from "./primitives";
import { V } from "./media";

type Cluster = { label: string; tiles: Tile[] };

const CLUSTERS: Cluster[] = [
  {
    label: "Voice cloning",
    tiles: [
      { kind: "video", video: V.lexMath, badge: "EN" },
      { kind: "wave", seed: 2.8, label: "your voice · UZ" },
      { kind: "video", video: V.mkbhdLaptop, badge: "RU" },
      { kind: "wave", seed: 4.1, label: "your voice · ES" },
    ],
  },
  {
    label: "Lip-sync",
    tiles: [
      { kind: "video", video: V.mkbhdPhone, badge: "EN → UZ" },
      { kind: "video", video: V.tedRecipe, badge: "EN → RU" },
      { kind: "video", video: V.roberCheater, badge: "EN → ES" },
      { kind: "video", video: V.beastExtreme, badge: "EN → TR" },
    ],
  },
  {
    label: "Subtitles",
    tiles: [
      { kind: "video", video: V.veritasiumEinstein, line: "Eynshteyn noto'g'ri edimi?" },
      { kind: "video", video: V.kurzgesagtHalf, line: "Вам понравится половина" },
      { kind: "video", video: V.veritasiumFiber, line: "La fibra óptica" },
      { kind: "video", video: V.roberBoard, line: "Barcha o'yinlarni yechdim" },
    ],
  },
  {
    label: "Live calls",
    tiles: [
      { kind: "photo", photo: "callCrew", badge: "LIVE" },
      { kind: "photo", photo: "callLaptop", badge: "LIVE" },
      { kind: "photo", photo: "callGallery", badge: "LIVE", line: "Hear in: O'zbek" },
      { kind: "wave", seed: 6.6, label: "~2s behind" },
    ],
  },
  {
    label: "Classes & events",
    tiles: [
      { kind: "photo", photo: "classVideo", badge: "LIVE" },
      { kind: "video", video: V.cs50Doom, badge: "EN → UZ" },
      { kind: "video", video: V.khanPhysics, badge: "EN → RU" },
      { kind: "video", video: V.tedListen, badge: "EN → ES" },
    ],
  },
  {
    label: "Creators",
    tiles: [
      { kind: "video", video: V.dudeRocket, badge: "EN → PT" },
      { kind: "video", video: V.roberThieves, badge: "EN → TR" },
      { kind: "video", video: V.beastGrocery, badge: "EN → AR" },
      { kind: "video", video: V.mkbhdPhone, badge: "EN → HI" },
    ],
  },
];

// Resting pile and hover fan for each of the four cards (x%, y%, deg).
const REST = [
  [-18, 8, -7],
  [14, -12, 5],
  [-4, -22, -2],
  [10, 16, 8],
];
const FAN = [
  [-58, -34, -10],
  [50, -38, 8],
  [-40, 34, -6],
  [44, 32, 10],
];

/**
 * The capabilities, grouped by what they do — each a loose pile of real
 * outputs. Like the reference, the cards arrive mixed up and sort themselves
 * into their groups as the section comes into view; hovering fans a pile open.
 */
export default function Clusters() {
  const ref = useRef<HTMLUListElement>(null);
  const sorted = useInView(ref, { once: true, margin: "-25% 0px" });

  return (
    <section className="relative py-24 sm:py-36">
      <SceneHead
        title="Organised by what it does, not where it came from."
        sub="Video, classes, live calls and voice-over settle into one pipeline."
      />
      <ul
        ref={ref}
        className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-14 px-5 sm:mt-20 md:grid-cols-3 md:gap-y-24"
      >
        {CLUSTERS.map((c, ci) => (
          <li key={c.label} className="group flex flex-col items-center">
            <div
              aria-hidden="true"
              className="relative h-[96px] w-[128px] sm:h-[130px] sm:w-[170px]"
              style={{ fontSize: 16 }}
            >
              {c.tiles.map((t, i) => {
                const [rx, ry, rr] = REST[i];
                const [fx, fy, fr] = FAN[i];
                // Before sorting, each card sits out towards the grid's centre,
                // so the six piles start as one jumbled heap.
                const col = ci % 3;
                const row = Math.floor(ci / 3);
                const sx = (1 - col) * 90 + (i - 1.5) * 30;
                const sy = (0.5 - row) * 70 + (i % 2 ? 20 : -20);
                return (
                  <div
                    key={i}
                    className="absolute inset-x-0 top-1/2 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.95)] transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform:translate(var(--sx),calc(-50%+var(--sy)))_rotate(var(--sr))] data-[sorted=true]:[transform:translate(var(--rx),calc(-50%+var(--ry)))_rotate(var(--rr))] data-[sorted=true]:group-hover:[transform:translate(var(--fx),calc(-50%+var(--fy)))_rotate(var(--fr))]"
                    data-sorted={sorted}
                    style={
                      {
                        "--sx": `${sx}%`,
                        "--sy": `${sy}%`,
                        "--sr": `${(i - 1.5) * 14}deg`,
                        "--rx": `${rx}%`,
                        "--ry": `${ry}%`,
                        "--rr": `${rr}deg`,
                        "--fx": `${fx}%`,
                        "--fy": `${fy}%`,
                        "--fr": `${fr}deg`,
                        zIndex: i,
                        transitionDelay: sorted ? `${ci * 70 + i * 40}ms` : "0ms",
                      } as React.CSSProperties
                    }
                  >
                    <TileView tile={t} sizes="(max-width: 640px) 128px, 170px" />
                  </div>
                );
              })}
            </div>
            <h3 className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 sm:text-[11px]">
              {c.label}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
