"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import Frame, { Inner } from "./frame";
import SectionHead from "./section-head";
import { FAQS } from "@/lib/faqs";


export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Frame as="section" bleed id="faq" className="border-b border-line">
      <Inner className="py-12 md:py-16">
        <SectionHead
          title="Questions, answered plainly"
          sub="If yours isn't here, the community channels are the fastest way to reach us."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line first:border-t">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <span className="font-display text-base font-medium text-text sm:text-lg">
                      {f.q}
                    </span>
                    <Plus
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-text-3 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-6 text-[15px] leading-relaxed text-text-2">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Inner>
    </Frame>
  );
}
