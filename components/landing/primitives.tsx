"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import JoinModal from "../JoinModal";

const noop = () => () => {};

/**
 * The one call to action on the page. Owns its own modal so any section can
 * drop it in without threading state through the tree.
 */
export function StartButton({
  children = "Start dubbing",
  size = "md",
  tone = "dark",
  className = "",
}: {
  children?: ReactNode;
  size?: "sm" | "md";
  tone?: "dark" | "light";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // False on the server and during hydration, true after — the portal target
  // only exists in the browser.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const sizing = size === "sm" ? "h-8 px-3 text-[13px]" : "h-11 px-5 text-sm";
  const colors =
    tone === "light"
      ? "bg-white text-black hover:bg-white/85"
      : "border border-white/10 bg-[#262626] text-white hover:bg-[#333]";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center rounded-lg font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/40 ${colors} ${sizing} ${className}`}
      >
        {children}
      </button>
      {/* Portalled to <body>: the nav pill's backdrop-filter would otherwise
          become the containing block for the modal's `position: fixed` and
          trap it inside the pill. The wrapper carries the dark scope along. */}
      {mounted
        ? createPortal(
            <div data-theme="dark" className="mare">
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

/** Centred serif headline with its quiet one-line companion. */
export function SceneHead({
  title,
  sub,
  className = "",
}: {
  title: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-3xl px-4 text-center ${className}`}>
      <h2 className="text-balance text-[clamp(1.75rem,4vw,2.9rem)] leading-[1.1] text-text">
        {title}
      </h2>
      {sub ? (
        <p className="mx-auto mt-3 max-w-md text-pretty text-[14px] leading-relaxed text-text-2 sm:text-[15px]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Turns a 0–1 scroll progress into a whole step 0…steps. Pinned scenes switch
 * on these steps and let CSS transitions do the easing, which keeps each scene
 * to a single scroll subscription instead of a hook per element.
 */
export function useStep(progress: MotionValue<number>, steps: number, initial = 0) {
  const [step, setStep] = useState(initial);
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.max(0, Math.min(steps, Math.floor(v * (steps + 1))));
    setStep((cur) => (cur === next ? cur : next));
  });
  return step;
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
