"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { frame, cancelFrame, useReducedMotion } from "motion/react";

/**
 * Smooth-scroll foundation. Every scroll-driven animation on the page rides on
 * this: Lenis smooths the wheel/trackpad delta and writes the eased value to the
 * real scroll position, so Framer Motion's `useScroll` reads the smoothed value
 * for free.
 *
 * The one subtlety worth calling out: we do NOT run our own
 * `requestAnimationFrame` loop for Lenis. Instead Lenis's `raf` is driven from
 * Framer Motion's `frame` loop (`frame.update(cb, true)`), so both share a
 * single render tick — no double rAF, no jitter between the smoothed scroll and
 * the motion values that read it.
 *
 * Under `prefers-reduced-motion` Lenis is never instantiated; the page uses the
 * browser's native (instant) scrolling and all downstream parallax/pinning is
 * disabled at the component level.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    // Honor reduced-motion: skip Lenis entirely and let the browser scroll.
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.085,
      duration: 1.2,
      smoothWheel: true,
      // Clicking any in-page anchor (navbar links, the hero "Learn more" ↓,
      // mobile-menu links) animates a smooth scroll to the target instead of a
      // native jump. Offset leaves room for the fixed navbar so the section
      // heading isn't hidden beneath it.
      anchors: {
        offset: -96,
        duration: 1.4,
      },
    });

    // Drive Lenis from Framer Motion's frame loop instead of a private rAF.
    // `timestamp` is milliseconds, which is exactly what lenis.raf expects.
    const update = (data: { timestamp: number }) => {
      lenis.raf(data.timestamp);
    };
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, [reduce]);

  return <>{children}</>;
}
