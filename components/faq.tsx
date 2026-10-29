"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Eyebrow } from "./landing/primitives";
import { CONTACT } from "./landing/contact";
import { FAQS } from "@/lib/faqs";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 text-[clamp(2rem,4vw,2.9rem)] leading-[1.06] text-white">
            You&rsquo;ve got questions.
            <br />
            We&rsquo;ve got answers.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-white/50 lg:mx-0">
            Short answers to the most-asked. For everything else, message{" "}
            <a
              href={CONTACT.telegram}
              target="_blank"
              rel="noreferrer"
              className="text-white underline underline-offset-4"
            >
              {CONTACT.telegramHandle}
            </a>{" "}
            on Telegram or write to{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-white underline underline-offset-4">
              {CONTACT.email}
            </a>
            .
          </p>
        </div>

        <div>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-white/[0.08]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <span className="text-[15px] text-white">{f.q}</span>
                    <span className="pill-dark flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                      <Plus
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </span>
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
                      <p className="max-w-[60ch] pb-5 text-[14px] leading-relaxed text-white/50">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
