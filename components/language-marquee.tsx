"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import SectionMarker from "./section-marker";

const ROW_A = ["EN → JA", "EN → ES", "KO → EN", "EN → FR", "JA → EN", "EN → AR", "ES → EN", "EN → ZH"];
const ROW_B = ["PT → EN", "EN → HI", "DE → EN", "EN → KO", "FR → EN", "EN → IT", "ZH → EN", "EN → RU"];

function Chip({ pair }: { pair: string }) {
  const [from, to] = pair.split(" → ");
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-sm text-white/55">
      {from}
      <span className="text-accent/70">→</span>
      {to}
    </span>
  );
}

function Row({ items, direction }: { items: string[]; direction: "normal" | "reverse" }) {
  const doubled = [...items, ...items];
  return (
    <div className="group flex overflow-hidden">
      <div
        style={{ animationDirection: direction }}
        className="animate-marquee flex w-max shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
      >
        {doubled.map((p, i) => (
          <span key={i} className="flex items-center gap-10">
            <Chip pair={p} />
            <span className="text-white/15" aria-hidden="true">
              +
            </span>
          </span>
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
    <section id="languages" className="py-20 md:py-28">
      <div className="mx-auto mb-10 w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <SectionMarker index="04" label="LANGUAGES" />
        <p className="mt-4 max-w-md font-sans text-sm text-white/50">
          Forty-plus languages and counting, in both directions.
        </p>
      </div>

      <div className="flex flex-col gap-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <Row items={ROW_A} direction={up ? "reverse" : "normal"} />
        <Row items={ROW_B} direction={up ? "normal" : "reverse"} />
      </div>
    </section>
  );
}
