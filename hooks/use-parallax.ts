"use client";

import {
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Maps a 0→1 progress value (typically a section's `scrollYProgress`) to a
 * pixel translation, spring-smoothed so it tracks the Lenis-eased scroll without
 * jitter.
 *
 * "Parallax rate" is expressed purely through `distance`: layers given a larger
 * distance travel further for the same scroll and therefore read as *closer* to
 * the viewer. Callers in the hero pass, e.g., glow ≈ 0.15×, grid ≈ 0.3×,
 * deco ≈ 0.5×, cards ≈ 1.15× of a shared base distance.
 *
 * Under `prefers-reduced-motion` the output is pinned to 0 (no parallax).
 */
export function useParallax(
  progress: MotionValue<number>,
  distance: number,
  { spring = true }: { spring?: boolean } = {},
): MotionValue<number> {
  const reduce = useReducedMotion();
  const raw = useTransform(progress, [0, 1], [0, reduce ? 0 : distance]);
  const smoothed = useSpring(raw, { stiffness: 90, damping: 28, mass: 0.5 });
  return spring && !reduce ? smoothed : raw;
}
