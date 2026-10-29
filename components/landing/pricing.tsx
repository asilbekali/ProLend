"use client";

import { useRef, useState } from "react";
import { AnimatedNumber, Eyebrow, StartButton } from "./primitives";
import ContactButton from "./contact-button";

// Prices from the pitch deck. The Free tier is what a new Studio account gets,
// and the Pro features are the ones the Studio marks "PRO".
const TIERS: {
  name: string;
  blurb: string;
  monthly?: number;
  yearly?: number;
  price?: string;
  note: string;
  points: string[];
  featured?: boolean;
  cta: "start" | "sales";
}[] = [
  {
    name: "Free",
    blurb: "Try a dub on us.",
    monthly: 0,
    yearly: 0,
    note: "No card needed",
    points: [
      "20 credits — about 1 minute",
      "Their voice, spoken natively",
      "Fast & Balanced quality",
    ],
    cta: "start",
  },
  {
    name: "Pro",
    blurb: "For creators dubbing every week.",
    monthly: 19.5,
    yearly: 199,
    note: "per month",
    points: ["Their voice, exactly", "Native-speaker & custom voices", "Studio quality"],
    cta: "start",
  },
  {
    name: "Studio",
    blurb: "For teams with a steady stream of video.",
    monthly: 49.5,
    yearly: 499,
    note: "per month",
    points: ["Everything in Pro", "Made for teams"],
    featured: true,
    cta: "start",
  },
  {
    name: "Business API",
    blurb: "Dub inside your own product.",
    price: "Custom",
    note: "Pay per minute processed",
    points: ["Per-minute pricing", "Volume discounts", "Private deploy"],
    cta: "sales",
  },
];

const PACKS = [
  { name: "Starter", minutes: "~5 min", price: 1.19 },
  { name: "Creator", minutes: "~25 min", price: 4.99 },
  { name: "Pro", minutes: "~100 min", price: 17.99 },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  // Which card is centred in the phone carousel, for the dots under it.
  const row = useRef<HTMLUListElement>(null);
  const [card, setCard] = useState(0);
  const onRowScroll = () => {
    const el = row.current;
    if (!el) return;
    const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
    setCard(Math.round(el.scrollLeft / (w + 12)));
  };

  return (
    <section id="pricing" className="relative scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1180px] text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.06] text-white">
          Pay for minutes.
          <br />
          Keep your voice.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[14px] text-white/50">
          Every plan dubs in the speaker&rsquo;s own voice. Start free, then pay for the minutes you
          dub.
        </p>

        <div
          role="radiogroup"
          aria-label="Billing period"
          className="panel mx-auto mt-8 inline-flex rounded-full p-1 text-[13px]"
        >
          {[false, true].map((y) => (
            <button
              key={String(y)}
              type="button"
              role="radio"
              aria-checked={yearly === y}
              onClick={() => setYearly(y)}
              className={`rounded-full px-5 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/40 ${
                yearly === y ? "pill-dark text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {y ? "Yearly" : "Monthly"}
              {y ? <span className="ml-1.5 text-[var(--orange)]">save ~15%</span> : null}
            </button>
          ))}
        </div>

        {/* A swipeable row on phones, a grid from md up. */}
        <ul
          ref={row}
          onScroll={onRowScroll}
          className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pt-3 text-left [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {TIERS.map((t) => (
            <li
              key={t.name}
              className={`panel group relative flex w-[78%] shrink-0 snap-center flex-col overflow-hidden rounded-3xl p-5 sm:w-[46%] md:w-auto ${
                t.featured
                  ? "!border-[var(--orange)]/50 shadow-[0_20px_60px_-30px_rgba(255,120,30,0.7)]"
                  : ""
              }`}
            >
              {/* Warm light rising from the bottom — always on the featured
                  plan, on hover for the rest. */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 transition-opacity duration-500 ${
                  t.featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                style={{
                  background:
                    "radial-gradient(90% 70% at 50% 100%, rgba(255,190,40,0.55), rgba(255,110,20,0.28) 45%, transparent 75%)",
                }}
              />
              <h3 className="relative text-center text-xl text-white">{t.name}</h3>
              <p className="relative mt-1 text-center text-[12px] text-white/45">{t.blurb}</p>
              <p className="relative mt-5 text-center text-white">
                {t.price ? (
                  <span className="text-[34px] font-medium tracking-[-0.03em]">{t.price}</span>
                ) : (
                  <span className="font-num text-[38px] leading-none">
                    $
                    <AnimatedNumber
                      value={yearly ? t.yearly! : t.monthly!}
                      decimals={!yearly && t.monthly! % 1 ? 2 : 0}
                    />
                  </span>
                )}
              </p>
              <p className="relative mt-1 text-center text-[11px] text-white/40">
                {t.price || t.monthly === 0 ? t.note : yearly ? "per year" : t.note}
              </p>
              <div className="relative mt-5">
                {t.cta === "sales" ? (
                  <ContactButton className="!h-10 w-full" />
                ) : (
                  <StartButton tone={t.featured ? "orange" : "dark"} className="!h-10 w-full">
                    {t.monthly === 0 ? "Get started" : "Buy now"}
                  </StartButton>
                )}
              </div>
              <ul className="relative mt-5 flex flex-col gap-2">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[12px] text-white/70">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--orange)]" />
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
          {TIERS.map((t, i) => (
            <span
              key={t.name}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === card ? "w-5 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Pay as you go */}
        <div className="panel mx-auto mt-4 flex max-w-3xl flex-col gap-3 rounded-3xl p-4 text-left sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[14px] font-medium text-white">Credit packs</p>
            <p className="text-[12px] text-white/45">
              Pay as you go · 1 min of dubbed video = <span className="font-num">20</span> credits
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {PACKS.map((p) => (
              <li
                key={p.name}
                className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/75"
              >
                {p.name} <span className="text-white/40">{p.minutes}</span>{" "}
                <span className="font-num text-white">${p.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
