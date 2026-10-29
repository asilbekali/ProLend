"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The thick green stroke that draws itself across the middle of the page as
 * you scroll — the reference's signature flourish. It sits behind the
 * sections it wraps. Phones skip it — there it would run under the copy.
 */
export default function Ribbon({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 20%"] });
  const length = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 2000"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block"
      >
        <motion.path
          d="M 1080 120 C 760 300, 820 520, 560 640 S 80 760, -60 1020 S 260 1400, 520 1460 S 1040 1620, 1080 1900"
          fill="none"
          stroke="var(--green)"
          strokeWidth="70"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduce ? 1 : length, opacity: 0.9 }}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
