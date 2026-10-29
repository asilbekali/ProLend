"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "motion/react";
import { TileView, Waveform, type Tile } from "./tiles";
import { useStep } from "./primitives";
import { V, thumbLarge, watch } from "./media";
import Image from "next/image";

const SUBTITLES = [
  { lang: "EN", text: "Escape 100 cops and the $500,000 is yours." },
  { lang: "UZ", text: "100 ta politsiyadan qochib qutul — 500 000 dollar seniki." },
  { lang: "RU", text: "Убеги от 100 полицейских — и 500 000 $ твои." },
  { lang: "ES", text: "Escapa de 100 policías y los 500.000 $ son tuyos." },
];

const FIELDS: { label: string; value: string }[] = [
  { label: "Creator", value: "MrBeast" },
  { label: "Dubbed into", value: "O'zbek · Русский · Español" },
  { label: "Voice", value: "Cloned from 3 seconds" },
  { label: "Lip-sync", value: "Matched, frame by frame" },
];

const TAGS = ["Emotion cloned", "Many speakers", "Subtitles exported", "Background kept"];

// Dim cards around the frame, like the rest of the library sitting in the
// background while one item is inspected.
const AROUND: { x: number; y: number; w: number; tile: Tile }[] = [
  { x: 30, y: 10, w: 120, tile: { kind: "video", video: V.roberBoard } },
  { x: 52, y: 7, w: 100, tile: { kind: "video", video: V.tedRecipe } },
  { x: 76, y: 9, w: 120, tile: { kind: "photo", photo: "classVideo" } },
  { x: 96, y: 30, w: 100, tile: { kind: "video", video: V.veritasiumFiber } },
  { x: 97, y: 66, w: 110, tile: { kind: "video", video: V.lexTaiwan } },
  { x: 78, y: 92, w: 120, tile: { kind: "video", video: V.dudeOvertime } },
  { x: 55, y: 94, w: 100, tile: { kind: "photo", photo: "callGallery" } },
  { x: 33, y: 90, w: 110, tile: { kind: "video", video: V.cs50Binary } },
];

export default function InspectScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 0: frame alone · 1: panel opens · 2–5: fields · 6: tags
  const step = useStep(scrollYProgress, 7);
  const [sub, setSub] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSub((s) => (s + 1) % SUBTITLES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const open = step >= 1;

  return (
    <section ref={ref} id="product" className="relative h-[320svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 hidden opacity-25 lg:block">
          {AROUND.map((a, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] blur-[1px]"
              style={{ left: `${a.x}%`, top: `${a.y}%`, width: a.w, fontSize: a.w * 0.15 }}
            >
              <TileView tile={a.tile} sizes="120px" />
            </div>
          ))}
        </div>

        <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 sm:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6">
          <div className="max-w-sm">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.08] text-white">
              We help you be heard — in the voice that&rsquo;s already yours.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-white/45">
              Every word translated, every voice kept recognisably yours.
            </p>
          </div>

          <div className="relative">
            {/* The clip */}
            <div
              className={`relative aspect-video w-full overflow-hidden rounded-[4px] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open ? "lg:translate-x-[6%]" : ""
              }`}
            >
              <Image
                src={thumbLarge(V.beastCops.id)}
                alt="MrBeast — Escape 100 Cops, Win $500,000"
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
                {SUBTITLES[sub].lang}
              </span>
              <p
                key={sub}
                className="absolute bottom-[7%] left-1/2 w-max max-w-[86%] sm:left-[60%] sm:max-w-[70%] -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-center text-[clamp(11px,1.3vw,15px)] text-white"
              >
                {SUBTITLES[sub].text}
              </p>
            </div>

            {/* The inspector */}
            <div
              className={`glass relative z-10 mx-auto mt-3 w-full rounded-xl p-4 sm:absolute sm:left-[4%] sm:top-[-6%] sm:mt-0 sm:w-[min(300px,52%)] text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] transition-all duration-700 sm:p-5 lg:left-[-2%] ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                Title
              </p>
              <p className="mt-1 font-serif text-[clamp(15px,1.6vw,19px)] leading-snug">
                Escape 100 Cops, Win $500,000
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-1">
                {FIELDS.map((f, i) => (
                  <div
                    key={f.label}
                    className={`transition-all duration-500 ${
                      step >= i + 2 ? "opacity-100" : "translate-y-1 opacity-0"
                    }`}
                  >
                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                      {f.label}
                    </dt>
                    <dd className="mt-0.5 font-serif text-[13px] text-white/90">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div
                className={`mt-3 transition-opacity duration-500 ${step >= 6 ? "opacity-100" : "opacity-0"}`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                  Tags
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {TAGS.map((t) => (
                    <li
                      key={t}
                      className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/75"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <a
                  href={watch(V.beastCops.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-[11px] text-white/45 underline-offset-2 hover:text-white/80 hover:underline"
                >
                  Original on YouTube ↗
                </a>
                <Waveform
                  seed={7.7}
                  count={40}
                  className="mt-3 h-5 w-full justify-between"
                  barClassName="bg-white/40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
