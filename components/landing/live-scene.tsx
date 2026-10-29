"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { SceneHead } from "./primitives";
import { TileView, type Tile } from "./tiles";
import { PHOTOS, V } from "./media";

// What the speaker says, and what everyone else hears ~2s later.
const LINES = [
  {
    said: "Let's look at the numbers for this week.",
    heard: "Keling, bu haftaning raqamlarini ko'rib chiqamiz.",
  },
  {
    said: "Signups doubled after the launch.",
    heard: "Ishga tushirilgandan keyin ro'yxatdan o'tish ikki barobar oshdi.",
  },
  {
    said: "Can we ship the Russian version next?",
    heard: "Keyingi rus tilidagi versiyani chiqara olamizmi?",
  },
];

const FORMATS: { title: string; sub: string; tile: Tile }[] = [
  {
    title: "Online classes",
    sub: "Lectures heard in every student's language",
    tile: { kind: "photo", photo: "classVideo", badge: "LIVE · EN → UZ" },
  },
  {
    title: "Events & keynotes",
    sub: "One stage, every audience",
    tile: { kind: "video", video: V.tedListen, badge: "LIVE · EN → RU" },
  },
  {
    title: "Courses on demand",
    sub: "Recorded once, dubbed into 42+ languages",
    tile: { kind: "video", video: V.cs50Doom, badge: "EN → ES" },
  },
];

const PLATFORMS = ["Zoom", "Google Meet", "Teams", "Live streams"];

export default function LiveScene() {
  const [line, setLine] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % LINES.length), 3600);
    return () => clearInterval(id);
  }, []);
  const current = LINES[line];

  return (
    <section id="live" className="relative scroll-mt-20 py-24 sm:py-36">
      <SceneHead
        title="Live, in your voice."
        sub="Real-time translation for calls, classes and events — about two seconds behind."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-12 w-[min(760px,calc(100%-2.5rem))] sm:mt-14"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 sm:aspect-video">
          <Image
            src={PHOTOS.callGallery.src}
            alt={PHOTOS.callGallery.alt}
            fill
            sizes="(max-width: 800px) 100vw, 760px"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30"
          />
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-black">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e0322b]" />
            LIVE
          </span>
          <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
            <p key={`s${line}`} className="text-[12px] text-white/55">
              {current.said}
            </p>
            <p
              key={`h${line}`}
              className="mt-1 font-serif text-[15px] leading-snug text-white sm:text-[18px]"
            >
              {current.heard}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12px] text-black sm:text-[13px]">
              Hear in: <span className="font-mono font-medium">English → O&rsquo;zbek</span>
              <span className="text-black/50">
                · <span className="font-num">~2</span>s
              </span>
            </div>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {PLATFORMS.map((p) => (
            <li
              key={p}
              className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-white/55"
            >
              {p}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* A swipeable row on phones, three columns from sm up. */}
      <ul className="mx-auto mt-14 flex max-w-5xl snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mt-16 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-4 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {FORMATS.map((f, i) => (
          <motion.li
            key={f.title}
            className="w-[78%] shrink-0 snap-center sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontSize: 16 }}>
              <TileView tile={f.tile} sizes="(max-width: 640px) 100vw, 320px" large />
            </div>
            <h3 className="mt-3 text-lg text-white">{f.title}</h3>
            <p className="text-[13px] text-white/45">{f.sub}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
