"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Frame, { Inner } from "./frame";
import SectionHead from "./section-head";

// Turkic pairs lead the first row — they're what TH-Labs is strongest at, and
// they're badly served by every general-purpose dubbing tool.
const ROW_A = [
  "EN → UZ",
  "UZ → EN",
  "EN → TR",
  "TR → EN",
  "EN → KK",
  "KK → EN",
  "UZ → TR",
  "TR → UZ",
  "KK → TR",
  "EN → AZ",
  "AZ → EN",
  "EN → KY",
];
const ROW_B = [
  "EN → JA",
  "EN → ES",
  "KO → EN",
  "EN → FR",
  "JA → EN",
  "EN → AR",
  "ES → EN",
  "EN → ZH",
  "PT → EN",
  "EN → HI",
  "DE → EN",
  "EN → RU",
];

// Called out above the marquee so the specialism isn't buried in the scroll.
const TURKIC = [
  { flag: "🇺🇿", name: "Uzbek" },
  { flag: "🇹🇷", name: "Turkish" },
  { flag: "🇰🇿", name: "Kazakh" },
  { flag: "🇦🇿", name: "Azerbaijani" },
  { flag: "🇰🇬", name: "Kyrgyz" },
  { flag: "🇹🇲", name: "Turkmen" },
];

function Chip({ pair }: { pair: string }) {
  const [from, to] = pair.split(" → ");
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-line bg-bg px-4 py-2.5 font-mono text-sm text-text-2 shadow-sm">
      <span className="font-medium text-text">{from}</span>
      <span className="text-accent">→</span>
      <span className="font-medium text-text">{to}</span>
    </span>
  );
}

function Row({ items, direction }: { items: string[]; direction: "normal" | "reverse" }) {
  const doubled = [...items, ...items];
  return (
    <div className="group flex overflow-hidden">
      <div
        style={{ animationDirection: direction }}
        className="animate-marquee flex w-max shrink-0 items-center gap-3 pr-3 group-hover:[animation-play-state:paused]"
      >
        {doubled.map((p, i) => (
          <Chip key={i} pair={p} />
        ))}
      </div>
    </div>
  );
}

export default function LanguageMarquee() {
  const [up, setUp] = useState(false);
  const upRef = useRef(false);
  const prev = useRef(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    const nextUp = v < prev.current;
    prev.current = v;
    if (nextUp !== upRef.current) {
      upRef.current = nextUp;
      setUp(nextUp);
    }
  });

  return (
    <Frame as="section" bleed id="languages" className="border-b border-line">
      <Inner className="pb-8 pt-16 md:pt-20">
        <SectionHead
          title="Forty-plus languages, both directions"
          sub="With a specialism most dubbing tools don't have: the Turkic languages."
        />

        {/* Turkic specialism */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TURKIC.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-text shadow-sm"
              >
                <span aria-hidden="true">{t.flag}</span>
                {t.name}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-relaxed text-text-2">
            Turkic languages are where TH-Labs is strongest. Vowel harmony, heavy
            agglutination, and word order that moves the verb to the end all break the
            timing of a naive dub — so we train and tune for them directly. Uzbek,
            Turkish, and Kazakh get the same voice-cloned, lip-synced quality as English,
            in both directions and between each other.
          </p>
        </div>
      </Inner>

      <div className="flex flex-col gap-3 bg-surface/60 py-8 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row items={ROW_A} direction={up ? "reverse" : "normal"} />
        <Row items={ROW_B} direction={up ? "normal" : "reverse"} />
      </div>
    </Frame>
  );
}
