"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionMarker from "./section-marker";

const FAQS = [
  {
    q: "Which languages are supported?",
    a: "Over forty today, in both directions, with more added regularly. If you need a specific pair, ask and we'll tell you exactly where it stands.",
  },
  {
    q: "How long does processing take?",
    a: "Pre-recorded files run faster than real time — a ten-minute video is usually ready in a few minutes. Live streams run continuously at about two seconds of delay.",
  },
  {
    q: "What's the latency on a live stream?",
    a: "Roughly two seconds end to end, from spoken source to dubbed output, so a live audience stays in step with what's happening in the room.",
  },
  {
    q: "What do you need to clone a voice?",
    a: "About three seconds of clean reference audio. More helps, but the system is built to work from very little, and the clone stays consistent across every line.",
  },
  {
    q: "How is pricing structured?",
    a: "Usage-based, billed by minutes processed, with a free tier to try it. Waitlist members get early-access pricing when we open up.",
  },
  {
    q: "How is my data handled?",
    a: "Your audio and cloned voices are yours. They are not used to train shared models, and you can delete them at any time.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 md:py-32 lg:px-12"
    >
      <div className="mb-12 md:mb-16">
        <SectionMarker index="06" label="FAQ" />
        <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-white">
          Questions,{" "}
          <span className="font-normal italic text-white/45">answered plainly.</span>
        </h2>
      </div>

      <div className="mx-auto max-w-3xl border-t border-white/[0.08]">
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
                  className="flex w-full items-center justify-between gap-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <span className="font-mono text-base text-white sm:text-lg">{f.q}</span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-xl text-white/50 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
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
                    <p className="max-w-[60ch] pb-6 font-sans text-[15px] leading-relaxed text-white/60">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
