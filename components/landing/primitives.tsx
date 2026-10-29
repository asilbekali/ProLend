"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import JoinModal from "../JoinModal";
import ContactButton from "./contact-button";

const noop = () => () => {};

/**
 * The label rolls up on hover and a second copy rises in from below — the
 * reference's button motion. Keyed to a named group so it never fires from a
 * hovered ancestor card.
 */
export function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="inline-flex items-center gap-1.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 inline-flex translate-y-full items-center justify-center gap-1.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

/**
 * The page's call to action: a pill that opens the sign-up modal. "orange" is
 * the bright primary, "dark" the quiet secondary beside it.
 */
export function StartButton({
  children = "Start dubbing",
  tone = "dark",
  size = "md",
  label,
  className = "",
}: {
  children?: ReactNode;
  /** Accessible name, for icon-only buttons. */
  label?: string;
  tone?: "dark" | "orange" | "ghost";
  size?: "sm" | "md";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const toneClass =
    tone === "orange"
      ? "pill-orange"
      : tone === "ghost"
        ? "text-white/70 hover:text-white"
        : "pill-dark btn-ring";
  // False on the server and during hydration, true after — the portal target
  // only exists in the browser.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const sizing = size === "sm" ? "h-9 px-4 text-[13px]" : "h-11 px-6 text-sm";
  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen(true)}
        className={`group/btn inline-flex items-center justify-center rounded-full font-medium outline-none transition-[filter,transform] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98] ${toneClass} ${sizing} ${className}`}
      >
        <Roll>{children}</Roll>
      </button>
      {/* Portalled to <body>: a backdrop-filtered ancestor (the nav) would
          otherwise become the containing block for the modal's
          `position: fixed`. The wrapper carries the dark scope along. */}
      {mounted
        ? createPortal(
            <div data-theme="dark" className="landing">
              <JoinModal
                kind="register"
                accent="brand"
                open={open}
                onClose={() => setOpen(false)}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** The pair every section ends on. */
export function CtaPair({
  className = "",
  align = "responsive",
}: {
  className?: string;
  /** "responsive": centred on phones and tablets, left-aligned from lg up. */
  align?: "responsive" | "center";
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${
        align === "responsive" ? "lg:justify-start" : ""
      } ${className}`}
    >
      <StartButton>Get started</StartButton>
      <ContactButton />
    </div>
  );
}

/** Small spaced caps above a headline. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-medium uppercase tracking-[0.22em] text-white/40 ${className}`}>
      {children}
    </p>
  );
}

/** A word with the hand-drawn green stroke under it. */
export function Squiggle({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.12em] left-[-4%] z-0 h-[0.42em] w-[108%]"
      >
        <path
          d="M4 13 C 40 4, 70 18, 104 10 S 168 4, 196 11"
          fill="none"
          stroke="var(--green)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/**
 * Turns a 0–1 scroll progress into a whole step 0…steps. Pinned scenes switch
 * on these steps and let CSS transitions do the easing.
 */
export function useStep(progress: MotionValue<number>, steps: number, initial = 0) {
  const [step, setStep] = useState(initial);
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.max(0, Math.min(steps, Math.floor(v * (steps + 1))));
    setStep((cur) => (cur === next ? cur : next));
  });
  return step;
}

/** Cycles 0…count-1 every `ms`, pausing while the tab is hidden. */
export function useCycle(count: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setI((v) => (v + 1) % count);
    }, ms);
    return () => clearInterval(id);
  }, [count, ms]);
  return [i, setI] as const;
}

/**
 * A number that runs quickly to its new value whenever `value` changes — fast
 * enough (~0.45s, easing out) to read as a flick of the counter rather than a
 * wait. Tabular old-style figures keep the width steady while it counts.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 450,
  className = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const from = current.current;
    if (from === value) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const v = from + (value - from) * (1 - Math.pow(1 - k, 3));
      current.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className} style={{ fontVariantNumeric: "oldstyle-nums tabular-nums" }}>
      {shown.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

/** Deterministic bar heights (0.18–1), so server and client markup agree. */
export function bars(seed: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const v = Math.abs(Math.sin(i * 1.73 + seed) * Math.cos(i * 0.61 + seed * 2.1));
    return Math.round((0.18 + 0.82 * v) * 100) / 100;
  });
}

export function Waveform({
  seed,
  count = 28,
  className = "",
  barClassName = "bg-white/80",
}: {
  seed: number;
  count?: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-[2px] ${className}`}>
      {bars(seed, count).map((h, i) => (
        <span
          key={i}
          className={`block w-[2px] flex-none rounded-full ${barClassName}`}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}
