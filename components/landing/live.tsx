"use client";

import Image from "next/image";
import { Headphones } from "lucide-react";
import LogoMark from "../logo-mark";
import { CtaPair, Eyebrow, useCycle } from "./primitives";
import { PHOTOS } from "./media";

const SPEAKERS = [
  { name: "Aziz", lang: "O'zbek" },
  { name: "Elena", lang: "Русский" },
  { name: "John", lang: "English" },
  { name: "Lucía", lang: "Español" },
];

const LINES = [
  {
    who: 0,
    said: "Keling, bu haftaning raqamlarini ko'rib chiqamiz.",
    heard: "Let's look at this week's numbers.",
  },
  { who: 1, said: "Регистрации выросли вдвое.", heard: "Signups doubled." },
  {
    who: 2,
    said: "Can we ship the Spanish version next?",
    heard: "¿Podemos lanzar la versión en español?",
  },
];

const PLATFORMS = ["Live streams", "Premieres", "Zoom", "Google Meet", "Teams"];

export default function Live() {
  const [i] = useCycle(LINES.length, 3400);
  const line = LINES[i];

  return (
    <section id="live" className="relative scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="text-center lg:text-left">
          <Eyebrow>Live dubbing</Eyebrow>
          <h2 className="mt-3 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.04] text-white">
            Everyone speaks.
            <br />
            Everyone understands.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/50 lg:mx-0">
            Live streams, premieres and calls, translated in each speaker&rsquo;s own voice — about
            two seconds behind. Every viewer picks the language they hear.
          </p>
          <CtaPair className="mt-6" />
          <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {PLATFORMS.map((p) => (
              <li
                key={p}
                className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-white/55"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Speakers → the call → what each listener hears */}
        <div className="grid grid-cols-[auto_1fr] items-center gap-3 sm:grid-cols-[auto_1fr_auto] sm:gap-5">
          <ul className="flex flex-col gap-2.5">
            {SPEAKERS.map((s, k) => (
              <li
                key={s.name}
                className={`panel flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-all duration-500 ${
                  line.who === k ? "!border-[var(--orange)]/60" : ""
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-500 ${
                    line.who === k ? "bg-[var(--orange)] text-white" : "bg-white/10 text-white/70"
                  }`}
                >
                  {s.name[0]}
                </span>
                <span className="leading-tight">
                  <span className="block text-[12px] text-white">{s.name}</span>
                  <span className="block text-[10px] text-white/45">{s.lang}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="panel relative rounded-3xl p-3">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="flex items-center gap-1.5 text-[12px] text-white">
                <LogoMark className="h-3.5 w-3.5" /> TH-Labs Live
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-black">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e0322b]" /> LIVE
              </span>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl">
              <Image
                src={PHOTOS.callGallery.src}
                alt={PHOTOS.callGallery.alt}
                fill
                sizes="(max-width: 1024px) 70vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div key={i} className="absolute inset-x-2 bottom-2 animate-[fadeUp_.45s_ease-out]">
                <p className="truncate text-[10px] text-white/55">{line.said}</p>
                <p className="text-[12px] leading-snug text-white sm:text-[13px]">{line.heard}</p>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-white/45">
              <span className="font-num text-white">~2</span> s behind the speaker
            </p>
          </div>

          <ul className="col-span-2 flex flex-wrap justify-center gap-2 sm:col-span-1 sm:flex-col">
            {["O'zbek", "English", "Русский", "Español"].map((l) => (
              <li
                key={l}
                className="panel flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white/80"
              >
                <Headphones className="h-3 w-3 text-[var(--green)]" /> {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
