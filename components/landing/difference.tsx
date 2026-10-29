"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Check, Mic, X } from "lucide-react";
import { CtaPair, Eyebrow, Squiggle, Waveform, useCycle } from "./primitives";
import { PHOTOS } from "./media";

const STUDIO_SHOT = "/media/studio-dub.jpg";

const THEIRS = ["A stock robot voice", "Lips out of sync", "Subtitles only"];
// The switcher beside our card, like the reference's colour dots: each one
// re-dubs the same frame into another language.
const DUBS = [
  { code: "UZ", line: "Bugun sizga yangi narsani ko'rsataman.", color: "#ff7a1a" },
  { code: "RU", line: "Сегодня я покажу вам кое-что новое.", color: "#19c37d" },
  { code: "ES", line: "Hoy les voy a mostrar algo nuevo.", color: "#ffc128" },
  { code: "TR", line: "Bugün size yeni bir şey göstereceğim.", color: "#ffffff" },
];

const OURS = [
  "Speaker's own voice",
  "Emotion kept",
  "Lips matched",
  "Background kept",
  "Subtitles exported",
];

/**
 * A MacBook Pro drawn in CSS — black bezel, notch, aluminium base — so the
 * screen can show whatever we put on it.
 */
function MacBook({ children, dim }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <div className={`relative px-[5%] ${dim ? "opacity-70 saturate-[0.4]" : ""}`}>
      {/* lid */}
      <div className="relative rounded-[14px] bg-[#0a0a0b] p-[2.2%] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black">
          {children}
        </div>
        {/* notch */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[2.2%] h-[3.6%] w-[13%] -translate-x-1/2 rounded-b-[5px] bg-[#0a0a0b]"
        />
      </div>
      {/* base, a little wider than the lid, with the thumb groove */}
      <div
        aria-hidden="true"
        className="relative -mx-[6%] h-[9px] rounded-b-[12px] rounded-t-[2px] bg-gradient-to-b from-[#e3e4e7] via-[#b8babf] to-[#7d7f84]"
      >
        <span className="absolute left-1/2 top-0 h-[4px] w-[16%] -translate-x-1/2 rounded-b-[6px] bg-[#9a9ca1]" />
      </div>
    </div>
  );
}

/** What most tools hand back: the same video, a robot track and subtitles. */
function GenericPlayer() {
  const p = PHOTOS.callCrew;
  return (
    <>
      <Image
        src={p.src}
        alt=""
        fill
        sizes="(max-width: 640px) 80vw, 340px"
        className="object-cover grayscale"
      />
      <div className="absolute inset-0 bg-black/45" />
      <span className="absolute left-[4%] top-[5%] rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white/80">
        AI voice · generic
      </span>
      <p className="absolute inset-x-[8%] bottom-[16%] rounded bg-black/80 px-2 py-1 text-center text-[11px] leading-snug text-white">
        [Translated] Today I will to you show a new thing.
      </p>
      <div className="absolute inset-x-[4%] bottom-[5%] flex items-center gap-2">
        <span className="h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-white/80" />
        <span className="h-[3px] flex-1 rounded-full bg-white/20">
          <span className="block h-full w-1/3 rounded-full bg-white/60" />
        </span>
      </div>
    </>
  );
}

export default function Difference() {
  const [d, setD] = useCycle(DUBS.length, 2600);
  const dub = DUBS[d];
  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1100px] text-center">
        <Eyebrow>The difference</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-2xl text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.06] text-white">
          They translate the words.
          <br />
          We save <Squiggle>your own voice</Squiggle>.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[14px] text-white/50">
          Other tools swap you for a stock robot voice.{" "}
          <span className="text-white">
            TH-Labs keeps your voice — your tone, your emotion — in every language.
          </span>
        </p>
        <CtaPair className="mt-6" align="center" />

        <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-2 sm:gap-6 lg:max-w-[820px] lg:-translate-x-[95px]">
          {/* Theirs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7 }}
          >
            <div className="panel rounded-3xl p-3 text-left">
              <MacBook dim>
                <GenericPlayer />
              </MacBook>
              <ul className="mt-3 flex flex-col gap-1.5 px-1 pb-1">
                {THEIRS.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[12px] text-white/45">
                    <X className="h-3.5 w-3.5 text-[#ff6b5e]" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-[13px] text-white/40">They give you a translation.</p>
            <p className="text-[13px] text-white">Done translating, not done working.</p>
          </motion.div>

          {/* Ours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative">
              <div className="panel rounded-3xl p-3 text-left shadow-[0_30px_80px_-30px_rgba(255,120,30,0.5)]">
                {/* The real TH-Labs Studio, mid-job: original and Uzbek dub side
                    by side, pipeline done, quality scores below. */}
                <MacBook>
                  <Image
                    src={STUDIO_SHOT}
                    alt="The TH-Labs Studio showing a video and its Uzbek dub side by side"
                    fill
                    sizes="(max-width: 640px) 90vw, 380px"
                    className="object-cover object-top"
                  />
                  <span
                    key={dub.code}
                    className="absolute bottom-[6%] left-1/2 max-w-[86%] -translate-x-1/2 animate-[fadeUp_.4s_ease-out] truncate rounded-full bg-black/80 px-2.5 py-1 text-[10px] text-white shadow-lg"
                  >
                    {dub.code} · {dub.line}
                  </span>
                </MacBook>
                <div className="mt-3 flex items-center gap-2 px-1">
                  <span className="text-[10px] text-white/50">{dub.code} · your voice</span>
                  <Waveform
                    seed={6.1}
                    count={26}
                    className="h-5 flex-1 justify-between"
                    barClassName="bg-[var(--orange)]"
                  />
                </div>
              </div>
              <div className="panel mx-auto mt-3 flex w-fit gap-1.5 rounded-full p-1.5 lg:absolute lg:-left-8 lg:bottom-16 lg:mt-0 lg:flex-col">
                {DUBS.map((x, k) => (
                  <button
                    key={x.code}
                    type="button"
                    aria-label={`Hear it in ${x.code}`}
                    onClick={() => setD(k)}
                    className={`h-5 w-5 rounded-full border-2 transition-transform ${
                      k === d ? "scale-110 border-white" : "border-transparent"
                    }`}
                    style={{ background: x.color }}
                  />
                ))}
              </div>
              {/* Layers panel, like an editor's: everything that came across */}
              <div className="panel mt-3 rounded-2xl p-3 text-left lg:absolute lg:left-[calc(100%+14px)] lg:top-4 lg:mt-0 lg:w-[190px]">
                <p className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Layers <span className="font-num normal-case">5</span>
                </p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {OURS.map((t) => (
                    <li key={t} className="flex items-center gap-1.5 text-[11px] text-white/85">
                      <Check className="h-3 w-3 shrink-0 text-[var(--green)]" /> {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--orange)]">
                  All kept
                </p>
              </div>
            </div>
            {/* The one promise this section exists to make, said loudly. */}
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--orange)]/50 bg-[var(--orange)]/15 px-4 py-2 text-[15px] font-semibold text-white shadow-[0_0_30px_-6px_rgba(255,122,26,0.6)]">
              <Mic className="h-4 w-4 text-[var(--orange)]" />
              We save your own voice
            </p>
            <p className="mt-2 text-[13px] text-white/60">Your voice · Ready to publish.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
