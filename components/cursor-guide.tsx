"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MousePointer2 } from "lucide-react";

export type GuideStep = {
  /** Resting position of the cursor, in % of the stage box. */
  at: { x: number; y: number };
  /** Short label that travels with the cursor. */
  caption: string;
  /** ms to dwell before moving on. */
  hold?: number;
};

const DEFAULT_HOLD = 1500;

/**
 * Turns a static product panel into a short, looping "screen recording": a
 * cursor walks a scripted path over the panel, pausing and clicking at each
 * hotspot so a first-time visitor can see how the thing is actually driven.
 *
 * Positions are percentages of the stage, so a script written once keeps
 * pointing at the right controls at every breakpoint.
 *
 * The loop only runs while the panel is on screen, and is skipped entirely
 * under `prefers-reduced-motion` (the panel then renders as a plain still).
 */
export default function CursorGuide({
  steps,
  children,
  className = "",
}: {
  steps: GuideStep[];
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [clicked, setClicked] = useState(false);

  const enabled = inView && !reduce && steps.length > 0;
  const active = steps[Math.min(step, steps.length - 1)];

  // No reset effect here on purpose: callers give the guide a `key` tied to the
  // panel it wraps, so switching panels remounts it and the script naturally
  // restarts from step 0.
  useEffect(() => {
    if (!enabled) return;
    // Click pulse once the cursor has arrived, then advance.
    const pulse = setTimeout(() => {
      setClicked(true);
      setTimeout(() => setClicked(false), 200);
    }, 560);
    const next = setTimeout(
      () => setStep((s) => (s + 1) % steps.length),
      (active.hold ?? DEFAULT_HOLD) + 600,
    );
    return () => {
      clearTimeout(pulse);
      clearTimeout(next);
    };
  }, [step, enabled, active, steps.length]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}

      {enabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-cursor"
          initial={false}
          animate={{ left: `${active.at.x}%`, top: `${active.at.y}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.span
            animate={{ scale: clicked ? 0.84 : 1 }}
            transition={{ duration: 0.12 }}
            className="relative block"
          >
            {/* click ripple */}
            <motion.span
              initial={false}
              animate={
                clicked ? { scale: [0.4, 1.7], opacity: [0.55, 0] } : { scale: 0.4, opacity: 0 }
              }
              transition={{ duration: 0.45 }}
              className="absolute -left-3.5 -top-3.5 h-12 w-12 rounded-full bg-accent/40"
            />
            <MousePointer2 className="relative h-5 w-5 fill-text text-bg drop-shadow-md" />
            <span className="absolute left-6 top-3 whitespace-nowrap rounded-md bg-text px-2 py-1 text-[11px] font-medium text-bg shadow-lg">
              {active.caption}
            </span>
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}
