"use client";

import { motion } from "motion/react";

/**
 * Centered section header — the reference's standard way into a major block:
 * a tight display headline over one line of grey supporting copy.
 */
export default function SectionHead({
  title,
  sub,
  className = "",
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mx-auto max-w-2xl text-center ${className}`}
    >
      <h2 className="text-balance text-[clamp(1.75rem,4vw,2.9rem)] font-medium leading-[1.08] text-text">
        {title}
      </h2>
      {sub && (
        <p className="mx-auto mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-text-2">
          {sub}
        </p>
      )}
    </motion.div>
  );
}
