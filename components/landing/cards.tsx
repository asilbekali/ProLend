import Image from "next/image";
import { Check, Download, Radio } from "lucide-react";
import { Waveform } from "./primitives";
import { PHOTOS } from "./media";

/**
 * What TH-Labs actually hands back — the cards that float around the page.
 * Every one is a TH-Labs output, drawn in CSS, so the page is always about
 * the product rather than about whose video went in.
 */

export function VoiceCard({ lang = "O'zbek", seed = 2.1 }: { lang?: string; seed?: number }) {
  return (
    <div className="panel w-full rounded-2xl p-3.5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Voice clone</p>
      <p className="mt-1 text-[13px] font-medium text-white">Your voice · {lang}</p>
      <Waveform
        seed={seed}
        count={30}
        className="mt-3 h-8 w-full justify-between"
        barClassName="bg-[var(--orange)]"
      />
      <p className="mt-2 text-[10px] text-white/40">From a 3-second reference</p>
    </div>
  );
}

export function SubtitleCard({ lang, lines }: { lang: string; lines: [string, string][] }) {
  return (
    <div className="w-full rounded-2xl bg-[#f4f1ec] p-3.5 text-[#1b1714] shadow-xl">
      <p className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[#1b1714]/50">
        <span>{lang}</span>
        <span>.srt</span>
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {lines.map(([t, l]) => (
          <li key={t} className="text-[11px] leading-snug">
            <span className="block font-mono text-[9px] text-[#1b1714]/45">{t}</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LangCard({ word, code }: { word: string; code: string }) {
  return (
    <div
      className="flex aspect-[4/3] w-full flex-col justify-between rounded-2xl p-3.5 text-white shadow-xl"
      style={{ background: "linear-gradient(150deg, #ff9a3c, #ff5a0a 60%, #c2410c)" }}
    >
      <span className="font-mono text-[10px] opacity-80">{code}</span>
      <span className="text-[26px] font-medium leading-none tracking-[-0.03em]">{word}</span>
    </div>
  );
}

export function TrackCard() {
  return (
    <div className="panel w-full rounded-2xl p-3.5">
      {[
        { tag: "EN · original", seed: 4.2, bar: "bg-white/45" },
        { tag: "UZ · dubbed", seed: 4.2, bar: "bg-[var(--green)]" },
      ].map((t) => (
        <div key={t.tag} className="mt-1 first:mt-0">
          <p className="text-[10px] text-white/45">{t.tag}</p>
          <Waveform
            seed={t.seed}
            count={34}
            className="mt-1 h-6 w-full justify-between"
            barClassName={t.bar}
          />
        </div>
      ))}
      <p className="mt-2 flex items-center gap-1 text-[10px] text-[var(--green)]">
        <Check className="h-3 w-3" /> Timing matched
      </p>
    </div>
  );
}

export function ExportCard({ name }: { name: string }) {
  return (
    <div className="panel flex w-full items-center gap-3 rounded-2xl p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--green)]/15 text-[var(--green)]">
        <Download className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-medium text-white">{name}</span>
        <span className="block text-[10px] text-white/40">Ready · voice, lips & subtitles</span>
      </span>
    </div>
  );
}

export function LiveCard({ photo, caption }: { photo: keyof typeof PHOTOS; caption: string }) {
  const p = PHOTOS[photo];
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
      <Image
        src={p.src}
        alt={p.alt}
        fill
        sizes="(max-width: 768px) 60vw, 280px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-black">
        <Radio className="h-2.5 w-2.5 text-[#e0322b]" /> LIVE
      </span>
      <p className="absolute inset-x-2 bottom-2 truncate text-[11px] text-white">{caption}</p>
    </div>
  );
}
