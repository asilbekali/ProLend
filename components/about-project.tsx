"use client";

import { motion, type Variants } from "motion/react";
import Frame from "./frame";
import SectionMarker from "./section-marker";

const PARAGRAPHS = [
  "TH-LABS turns one recording into natural-sounding audio in dozens of languages. Upload a video, a podcast, or a course — or point it at a live stream — pick the languages you want, and it returns a dubbed track that still sounds like you.",
  "Conventional dubbing is slow and expensive. A studio booking, a separate voice actor for every language, and days of turnaround mean most creators only ever ship in one language, and the results often sound flat and detached from the original speaker.",
  "Under the hood the system runs a short pipeline: speech recognition transcribes the original, translation adapts it while holding the meaning, a cloned voice speaks the result in your timbre, lip sync aligns the mouth to the new audio, and a final mix sets it back against the music and effects.",
  "The difference is that the voice stays yours. Prosody — the rhythm, stress, and feeling of how you actually talk — is kept rather than smoothed away, and the whole thing runs fast enough to work on a live broadcast.",
];

const PRINCIPLES = [
  { n: "01", title: "Your voice, not a voice.", body: "The cloned track keeps your timbre and cadence." },
  { n: "02", title: "Timing is the hard part.", body: "We fit translations to the rhythm of the original." },
  { n: "03", title: "Real time is the point.", body: "About two seconds end to end, so live audiences stay live." },
  { n: "04", title: "One source, many outputs.", body: "Add a language without re-recording anything." },
];

const STATS = [
  { label: "Languages", value: "40+" },
  { label: "Latency", value: "~2s" },
  { label: "Voice clone", value: "3s of audio" },
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function AboutProject() {
  return (
    <Frame as="section" id="about" className="border-b border-line">
      <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-18">
        {/* Left — sticky headline */}
        <div className="md:sticky md:top-28 md:self-start">
          <SectionMarker index="01" label="ABOUT THE PROJECT" />
          <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.6rem)] font-medium leading-[1.1]">
            <span className="block text-text">One recording.</span>
            <span className="block text-text-3">Every language your audience speaks.</span>
          </h2>
        </div>

        {/* Right — content */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-12% 0px" }}
          variants={stagger}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-5">
            {PARAGRAPHS.map((p, i) => (
              <motion.p
                key={i}
                variants={reveal}
                className="max-w-[62ch] text-[15px] leading-relaxed text-text-2"
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Numbered principles */}
          <motion.ul
            variants={stagger}
            className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2"
          >
            {PRINCIPLES.map((pr) => (
              <motion.li key={pr.n} variants={reveal} className="flex gap-4">
                <span className="font-mono text-sm text-accent">{pr.n}</span>
                <div>
                  <h3 className="font-display text-[15px] font-medium text-text">
                    {pr.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-2">{pr.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* Stat row */}
          <motion.div
            variants={reveal}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-sm"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-text-3">{s.label}</span>
                <span className="font-medium text-text">{s.value}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Frame>
  );
}
