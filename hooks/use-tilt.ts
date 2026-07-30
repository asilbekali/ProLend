"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion, useSpring, type MotionValue } from "motion/react";

/**
 * Cursor-driven 3D tilt for cards. Maps the pointer's position within the
 * element to `rotateX`/`rotateY` in the range `±max` degrees, spring-smoothed
 * and reset to flat on leave. The move handler is rAF-throttled (one rect read +
 * one write per frame). Disabled under reduced-motion and for touch pointers.
 *
 * Wrap the tilted element in a `perspective` container with
 * `transform-style: preserve-3d`. Uses a callback ref (`attach`) so no ref
 * object is exposed during render.
 */
export function useTilt<T extends HTMLElement = HTMLElement>(max = 6): {
  attach: (node: T | null) => void;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  handlers: {
    onPointerMove: (e: React.PointerEvent<T>) => void;
    onPointerLeave: () => void;
  };
} {
  const reduce = useReducedMotion();
  const spring = { stiffness: 150, damping: 15, mass: 0.5 } as const;
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const elRef = useRef<T | null>(null);
  const rafRef = useRef(0);

  const attach = useCallback((node: T | null) => {
    elRef.current = node;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const el = elRef.current;
      if (!el) return;
      const { clientX, clientY } = e;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width;
        const py = (clientY - r.top) / r.height;
        rotateY.set((px - 0.5) * 2 * max);
        rotateX.set(-(py - 0.5) * 2 * max);
      });
    },
    [max, reduce, rotateX, rotateY],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { attach, rotateX, rotateY, handlers: { onPointerMove, onPointerLeave } };
}
