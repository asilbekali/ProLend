"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion, useSpring, type MotionValue } from "motion/react";

type MagneticOptions = {
  /** Activation radius in px, measured from the element's edge. */
  radius?: number;
  /** How strongly the element chases the cursor (0–1). */
  strength?: number;
};

/**
 * Magnetic pull: while a *mouse* pointer is within `radius` of the element, it
 * translates toward the cursor at `strength`, then springs back to rest on
 * leave. Pointer sampling is rAF-throttled (one rect read + one write per frame)
 * to stay at 60fps; touch pointers are ignored and reduced-motion disables it.
 *
 * Uses a callback ref (`attach`) rather than returning a ref object, so
 * listeners bind on mount and unbind on unmount without a separate effect, and
 * consumers only ever touch plain MotionValues.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>({
  radius = 80,
  strength = 0.25,
}: MagneticOptions = {}): {
  attach: (node: T | null) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const reduce = useReducedMotion();
  const spring = { stiffness: 200, damping: 15, mass: 0.4 } as const;
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const cleanup = useRef<(() => void) | null>(null);

  const attach = useCallback(
    (node: T | null) => {
      cleanup.current?.();
      cleanup.current = null;
      if (!node || reduce) return;

      let raf = 0;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = node.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const reach = radius + Math.max(r.width, r.height) / 2;
          if (Math.hypot(dx, dy) < reach) {
            x.set(dx * strength);
            y.set(dy * strength);
          } else {
            x.set(0);
            y.set(0);
          }
        });
      };
      const reset = () => {
        x.set(0);
        y.set(0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("blur", reset);
      cleanup.current = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("blur", reset);
        cancelAnimationFrame(raf);
      };
    },
    [radius, strength, reduce, x, y],
  );

  return { attach, x, y };
}
