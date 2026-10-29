"use client";

import { useState } from "react";
import { AnimatedNumber, SceneHead, StartButton } from "./primitives";

const PLANS = [
  { name: "Pro", monthly: 19.5, yearly: 199 },
  { name: "Studio", monthly: 49.5, yearly: 499 },
];

const PACKS = [
  { name: "Starter", minutes: "~5 min", price: "1.19" },
  { name: "Creator", minutes: "~25 min", price: "4.99" },
  { name: "Pro", minutes: "~100 min", price: "17.99" },
];

const API_POINTS = ["Per minute processed", "Volume discounts", "Private deploy"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">{children}</p>
  );
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative scroll-mt-20 py-28 sm:py-36">
      <SceneHead
        title="Simple pricing."
        sub="Subscriptions, credits and an API — pay for the minutes you dub."
      />

      <div className="mt-8 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="glass flex rounded-lg p-1 text-[13px]"
        >
          {[false, true].map((y) => (
            <button
              key={String(y)}
              type="button"
              role="radio"
              aria-checked={yearly === y}
              onClick={() => setYearly(y)}
              className={`rounded-md px-3 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30 ${
                yearly === y ? "bg-white/12 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {y ? "Yearly" : "Monthly"}
              {y ? <span className="ml-1.5 text-[var(--chip-fg)]">save ~15%</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-3 px-5 md:grid-cols-3">
        {/* Subscriptions */}
        <article className="flex flex-col rounded-2xl border border-white/15 bg-[#101010] p-6">
          <Eyebrow>01 · Creators & businesses</Eyebrow>
          <h3 className="mt-2 text-2xl text-white">Subscriptions</h3>
          <ul className="mt-6 flex flex-col">
            {PLANS.map((p) => (
              <li
                key={p.name}
                className="flex items-baseline justify-between border-t border-white/[0.07] py-4"
              >
                <span className="text-[14px] text-white/80">{p.name}</span>
                <span className="text-white">
                  <span className="font-num text-[28px]">
                    $
                    <AnimatedNumber
                      value={yearly ? p.yearly : p.monthly}
                      decimals={yearly ? 0 : 2}
                    />
                  </span>
                  <span className="text-[12px] text-white/40">/{yearly ? "yr" : "mo"}</span>
                </span>
              </li>
            ))}
          </ul>
          <StartButton tone="light" className="mt-auto w-full">
            Start dubbing
          </StartButton>
        </article>

        {/* Credit packs */}
        <article className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6">
          <Eyebrow>02 · Pay as you go</Eyebrow>
          <h3 className="mt-2 text-2xl text-white">Credit packs</h3>
          <ul className="mt-6 flex flex-col">
            {PACKS.map((p) => (
              <li
                key={p.name}
                className="flex items-baseline justify-between border-t border-white/[0.07] py-3.5"
              >
                <span className="text-[14px] text-white/80">
                  {p.name} <span className="text-[12px] text-white/35">{p.minutes}</span>
                </span>
                <span className="font-num text-[22px] text-white">${p.price}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-4 font-mono text-[11px] text-white/35">
            1 min of dubbed video = <span className="font-num">20</span> credits
          </p>
        </article>

        {/* API */}
        <article className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6">
          <Eyebrow>03 · Platforms</Eyebrow>
          <h3 className="mt-2 text-2xl text-white">B2B API</h3>
          <p className="mt-2 text-[14px] text-white/45">
            Dub programmatically, inside your own product.
          </p>
          <ul className="mt-6 flex flex-col gap-2">
            {API_POINTS.map((p) => (
              <li
                key={p}
                className="w-fit rounded-full border border-white/10 px-3 py-1 text-[12px] text-white/70"
              >
                {p}
              </li>
            ))}
          </ul>
          <a
            href="https://t.me/thlabsio"
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex h-11 items-center justify-center rounded-lg border border-white/10 text-sm text-white/80 outline-none transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Talk to us
          </a>
        </article>
      </div>
    </section>
  );
}
