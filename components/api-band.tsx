"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import Frame, { Inner } from "./frame";
import codingParrot from "@/public/parrot/coding.png";

/* A minimal, deterministic token highlighter — the snippet is fixed, so each
   line carries its own spans rather than running a real tokenizer. */
const CODE: { t: string; c?: string }[][] = [
  [{ t: "import", c: "text-sky-300" }, { t: " { THLabs } " }, { t: "from", c: "text-sky-300" }, { t: " " }, { t: "\"@th-labs/sdk\"", c: "text-emerald-300" }],
  [],
  [{ t: "const", c: "text-sky-300" }, { t: " th = " }, { t: "new", c: "text-sky-300" }, { t: " " }, { t: "THLabs", c: "text-sky-300" }, { t: "(process.env." }, { t: "TH_KEY", c: "text-orange-300" }, { t: ")" }],
  [],
  [{ t: "// One call — every language you asked for.", c: "text-white/35" }],
  [{ t: "const", c: "text-sky-300" }, { t: " job = " }, { t: "await", c: "text-sky-300" }, { t: " th.dubs." }, { t: "create", c: "text-sky-300" }, { t: "({" }],
  [{ t: "  source:   " }, { t: "\"https://cdn.acme.com/ep-01.mp4\"", c: "text-emerald-300" }, { t: "," }],
  [{ t: "  targets:  [" }, { t: "\"es\"", c: "text-emerald-300" }, { t: ", " }, { t: "\"fr\"", c: "text-emerald-300" }, { t: ", " }, { t: "\"ja\"", c: "text-emerald-300" }, { t: ", " }, { t: "\"ko\"", c: "text-emerald-300" }, { t: "]," }],
  [{ t: "  voice:    " }, { t: "\"clone\"", c: "text-emerald-300" }, { t: "," }],
  [{ t: "  lipSync:  " }, { t: "true", c: "text-orange-300" }, { t: "," }],
  [{ t: "  subtitles:[" }, { t: "\"srt\"", c: "text-emerald-300" }, { t: ", " }, { t: "\"vtt\"", c: "text-emerald-300" }, { t: "]," }],
  [{ t: "})" }],
  [],
  [{ t: "job.status", c: "text-white/75" }, { t: " " }, { t: "// => \"processing\"", c: "text-white/35" }],
];

const OUTPUT = [
  { lang: "es", state: "done" },
  { lang: "fr", state: "done" },
  { lang: "ja", state: "running" },
  { lang: "ko", state: "queued" },
] as const;

export default function ApiBand() {
  const reduce = useReducedMotion();

  return (
    <Frame as="section" bleed id="api" className="border-b border-line">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0b1a3a_0%,#123a8a_55%,#0e2a66_100%)]">
        {/* A faint dot field keeps the flat blue from reading as a solid slab. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#fff_1px,transparent_1.2px)] [background-size:20px_20px]"
        />

        <Inner className="relative grid items-center gap-10 py-10 md:grid-cols-2 md:gap-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/55">
              TH-Labs API
            </span>
            <h2 className="mt-4 text-[clamp(1.8rem,3.8vw,2.9rem)] font-medium leading-[1.08] text-white">
              Don&apos;t rebuild dubbing.
              <br />
              Just call it.
            </h2>
            <p className="mt-4 max-w-md text-[15px] sm:mt-5 leading-relaxed text-white/70">
              One endpoint takes a file or a live stream URL and returns dubbed audio,
              lip-synced video, and aligned subtitles. Webhooks fire as each language
              lands, so you can wire multilingual output into your own product in an
              afternoon.
            </p>
            <a
              href="#community"
              className="mt-6 inline-flex h-11 items-center sm:mt-8 justify-center rounded-lg bg-white px-6 text-sm font-medium text-[#0b1a3a] outline-none transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e2a66]"
            >
              Get API access
            </a>
          </motion.div>

          {/* Editor mock, with the parrot perched on its corner. Desktop only — on a
              phone a scrolling code block is a wall, and the copy + button carry it. */}
          <div className="relative hidden md:block">
            {/* The bird is the author of the snippet beside it. It perches on
                the card's lower-*right* corner — the output row fills the left
                of that strip, and the bird was sitting on the language chips.
                It only breathes; anything livelier would pull attention off the
                code, which is the actual pitch here. */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: 20, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute -bottom-8 -right-3 z-10 w-[96px] sm:-bottom-10 sm:-right-7 sm:w-[124px]"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={codingParrot}
                  alt=""
                  draggable={false}
                  className="h-auto w-full select-none drop-shadow-[0_16px_28px_rgba(0,0,0,0.45)]"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-xl border border-white/15 bg-[#0a1226] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="ml-2 font-mono text-[11px] text-white/45">dub.ts</span>
              </div>

              <pre className="overflow-x-auto px-3.5 py-3.5 font-mono text-[11px] leading-[1.7] text-white/80 sm:text-[12px]">
                <code>
                  {CODE.map((line, i) => (
                    <span key={i} className="block whitespace-pre">
                      {line.length === 0
                        ? " "
                        : line.map((tok, j) => (
                            <span key={j} className={tok.c}>
                              {tok.t}
                            </span>
                          ))}
                    </span>
                  ))}
                </code>
              </pre>

              <div className="border-t border-white/10 px-3.5 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Output
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {OUTPUT.map((o) => (
                    <li
                      key={o.lang}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] ${
                        o.state === "done"
                          ? "bg-emerald-400/15 text-emerald-300"
                          : o.state === "running"
                            ? "bg-orange-400/15 text-orange-300"
                            : "bg-white/8 text-white/45"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          o.state === "done"
                            ? "bg-emerald-400"
                            : o.state === "running"
                              ? "bg-orange-400"
                              : "bg-white/40"
                        }`}
                      />
                      {o.lang}.mp4
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </Inner>
      </div>
    </Frame>
  );
}
