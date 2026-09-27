"use client";

import Image from "next/image";
import { motion, type MotionProps } from "motion/react";
import waveArt from "@/public/parrot/wave.png";

/**
 * The TH-Labs parrot.
 *
 * This is the brand's own illustration, not a redraw. An earlier pass rebuilt
 * the bird as hand-authored SVG so every feature could be posed independently,
 * and it kept drifting off-model — the beak, the crest and the eye spacing are
 * the whole character, and approximating them by eye loses it. The artwork now
 * comes straight from `TH-Labs/TH-Labs-parrot-new-poses/`, trimmed and resized
 * into `public/parrot/` (see the crop tool referenced in that folder's origin),
 * so the face is exactly on-model and the life comes from motion instead.
 *
 * The pose it ships in is already mid-wave with a happy closed eye, which is
 * why there is no blink here: the bird is permanently winking at you.
 *
 * Everything below is transform-only — no layout, no filters that would force
 * a repaint — so the idle loop stays cheap while it is on screen.
 */

export type ParrotPose = {
  /** Degrees the bird leans, negative = toward its left. Clamp to about ±7. */
  tilt?: number;
  /** 0 = at rest, 1 = mid-greeting. Adds the excited rock and a little lift. */
  wave?: number;
  /** 0 = flat, 1 = fully lifted. The idle breath. */
  breath?: number;
};

type ParrotProps = ParrotPose &
  Omit<MotionProps, "children"> & {
    className?: string;
  };

export default function Parrot({
  tilt = 0,
  wave = 0,
  breath = 0,
  className = "",
  ...motionProps
}: ParrotProps) {
  return (
    <motion.div
      className={className}
      // Everything pivots on the feet, so leaning and breathing rock the bird
      // where it stands instead of sliding it around.
      style={{ transformOrigin: "50% 100%" }}
      animate={{
        rotate: tilt + wave * 4,
        scaleY: 1 + breath * 0.03 + wave * 0.02,
        scaleX: 1 - breath * 0.016,
        y: wave * -5,
      }}
      transition={{ type: "spring", stiffness: 95, damping: 13 }}
      {...motionProps}
    >
      <Image
        src={waveArt}
        alt=""
        aria-hidden="true"
        priority={false}
        draggable={false}
        className="h-full w-full select-none object-contain"
      />
    </motion.div>
  );
}
