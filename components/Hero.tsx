"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import Wordmark from "./wordmark";
import Navbar from "./navbar";
import FloatingCards from "./floating-cards";
import JoinModal from "./JoinModal";
import { useSpecularEffect } from "./reactbits/SpecularButton/SpecularButton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEarlyUsersCount } from "@/lib/queries/useEarlyUsersCount";

const FALLBACK_SUPPORTER_COUNT = 24;
const SUBHEAD = "AI dubbing system for natural multilingual voice conversion.";
const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { stiffness: 90, damping: 28, mass: 0.5 } as const;

const AVATARS = [
  { initials: "A", from: "#a78bfa", to: "#5b3fd9" },
  { initials: "G", from: "#6366f1", to: "#3730a3" },
  { initials: "S", from: "#64748b", to: "#334155" },
  { initials: "J", from: "#a3a3a3", to: "#525252" },
];

const master: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const item: Variants = {
  hidden: { y: 16, opacity: 0, filter: "blur(8px)" },
  show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};
const wordContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.02 } } };
const wordItem: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
};

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
function subscribeFinePointer(cb: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function CursorGlow() {
  const reduce = useReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
  const enabled = finePointer && !reduce;
  const x = useSpring(0, { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(0, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="z-cursor pointer-events-none fixed left-0 top-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.16),transparent_66%)] mix-blend-screen"
    />
  );
}

/** One tile of the decorative bottom wave (two are drifted for a seamless loop). */
function WaveSvg() {
  return (
    <svg className="h-full w-1/2 flex-none" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="hero-wave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </linearGradient>
      </defs>
      <path d="M0 160 C 240 90 480 90 720 160 S 1200 230 1440 160 V320 H0 Z" fill="url(#hero-wave)" />
      <path d="M0 160 C 240 90 480 90 720 160 S 1200 230 1440 160" fill="none" stroke="rgba(167,139,250,0.35)" strokeWidth="2" />
    </svg>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const isWide = useMediaQuery("(min-width: 768px)");
  const exitActive = isWide && !reduce;
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const { data: earlyUsers } = useEarlyUsersCount();
  const supporters = earlyUsers?.count ?? FALLBACK_SUPPORTER_COUNT;

  // "Join Waitlist" hover — the old Get Started treatment: a black fill sweeps
  // in from the left, the label flips to white, and a specular rim shines on
  // hover (only visible once the button fills black).
  const waitlistBtnRef = useRef<HTMLButtonElement>(null);
  const waitlistFxRef = useRef<HTMLSpanElement>(null);
  useSpecularEffect(waitlistBtnRef, waitlistFxRef, {
    radius: 999,
    lineColor: "#ffffff",
    baseColor: "#a3a3a3",
    intensity: 1.15,
    shineSize: 10,
    shineFade: 40,
    thickness: 1.4,
    speed: 0.35,
    followMouse: true,
    proximity: 260,
    autoAnimate: true,
  });

  // Bounded exit — progress hits 1 exactly at unpin (offset end/end over the
  // 170vh track), so the hero finishes precisely at its bottom edge.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });
  const contentScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.86]), SPRING);
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -90]), SPRING);
  const contentOpacity = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 0]), SPRING);
  const contentBlurPx = useSpring(useTransform(scrollYProgress, [0, 1], [0, 6]), SPRING);
  const contentBlur = useMotionTemplate`blur(${contentBlurPx}px)`;
  const glowScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.3]), SPRING);
  const glowY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 70]), SPRING);
  const gridOpacity = useSpring(useTransform(scrollYProgress, [0, 1], [0.3, 0]), SPRING);
  const decoY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), SPRING);

  return (
    <>
      <Navbar />
      <CursorGlow />

      <section id="top" ref={heroRef} className="relative w-full min-h-[100dvh] md:h-[170vh]">
        <div className="relative min-h-[100dvh] w-full overflow-hidden md:sticky md:top-0 md:h-screen">
          {/* z-base */}
          <div className="z-base absolute inset-0 bg-[#05040a]" aria-hidden="true" />

          {/* z-glow — violet horizon */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, scale: 1.3 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            style={exitActive ? { x: "-50%", y: glowY, scale: glowScale } : { x: "-50%" }}
            className="z-glow pointer-events-none absolute bottom-[-28%] left-1/2 h-[85vh] w-[130vh] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(139,92,246,0.5)_0%,rgba(91,33,182,0.3)_45%,transparent_72%)] blur-2xl will-change-transform md:blur-3xl"
          />

          {/* z-grid — blueprint grid + noise */}
          <motion.div
            aria-hidden="true"
            style={exitActive ? { opacity: gridOpacity } : { opacity: 0.3 }}
            className="z-grid pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          </motion.div>

          {/* z-deco — drifting orbs + wave lines */}
          <motion.div
            aria-hidden="true"
            style={exitActive ? { y: decoY } : undefined}
            className="z-deco pointer-events-none absolute inset-0"
          >
            <div className="animate-float absolute left-[12%] top-[24%] h-64 w-64 rounded-full bg-accent/20 blur-3xl" style={{ "--float-distance": "-24px", "--float-duration": "9s" } as React.CSSProperties} />
            <div className="animate-float absolute right-[14%] top-[38%] h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" style={{ "--float-distance": "-30px", "--float-duration": "11s", "--float-delay": "1.2s" } as React.CSSProperties} />
            <div className="animate-float absolute bottom-[20%] left-[40%] h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" style={{ "--float-distance": "-18px", "--float-duration": "8s", "--float-delay": "0.6s" } as React.CSSProperties} />
            <div className="absolute inset-x-0 bottom-0 h-52 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_60%)]">
              <div className="flex h-full w-[200%] animate-wave-flow">
                <WaveSvg />
                <WaveSvg />
              </div>
            </div>
          </motion.div>

          {/* z-content */}
          <div className="z-content relative flex min-h-[100dvh] w-full flex-col items-center justify-center gap-8 px-6 text-center">
            <motion.div
              variants={master}
              initial={reduce ? false : "hidden"}
              animate="show"
              style={
                exitActive
                  ? { scale: contentScale, y: contentY, opacity: contentOpacity, filter: contentBlur }
                  : undefined
              }
              className="flex w-full max-w-3xl flex-col items-center gap-6 will-change-transform"
            >
              {/* Badge */}
              <motion.span
                variants={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 backdrop-blur"
              >
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-accent">AI</span>
                Real-time multilingual dubbing
              </motion.span>

              {/* Headline */}
              <motion.h1
                variants={item}
                className="w-full [filter:drop-shadow(0_0_45px_rgba(139,92,246,0.45))]"
              >
                <Wordmark
                  charReveal
                  className="justify-center text-[clamp(2.25rem,10vw,6.5rem)]"
                  charClassName="bg-gradient-to-b from-white via-white to-neutral-500 bg-clip-text text-transparent"
                />
              </motion.h1>

              {/* Subheadline (word by word) */}
              <motion.p
                variants={item}
                className="max-w-xl text-balance font-sans text-base text-white/62 sm:text-lg"
              >
                <motion.span variants={wordContainer} className="inline">
                  {SUBHEAD.split(" ").map((w, i, arr) => (
                    <motion.span key={i} variants={wordItem} className="inline-block whitespace-pre">
                      {w}
                      {i < arr.length - 1 ? " " : ""}
                    </motion.span>
                  ))}
                </motion.span>
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={item}
                className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
              >
                <motion.button
                  ref={waitlistBtnRef}
                  type="button"
                  onClick={() => setWaitlistOpen(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-white px-8 font-mono text-sm font-medium text-black outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05040a] sm:w-auto"
                >
                  {/* black fill sweeps in from the left on hover */}
                  <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  {/* specular shine rim (canvas), fades in on hover */}
                  <span
                    ref={waitlistFxRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-5 z-[5] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
                  />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                    Join Waitlist
                  </span>
                </motion.button>

                <a
                  href="#how-it-works"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-8 font-mono text-sm text-white/90 outline-none transition-colors hover:border-white/50 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05040a] sm:w-auto"
                >
                  Learn more
                  <span aria-hidden="true">↓</span>
                </a>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={item} className="mt-6 flex flex-col items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/38">
                  Trusted by early pioneers
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {AVATARS.map((a) => (
                      <div
                        key={a.initials}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#05040a] font-mono text-[11px] font-medium text-white sm:h-9 sm:w-9"
                        style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                      >
                        {a.initials}
                      </div>
                    ))}
                  </div>
                  <span className="h-6 w-px bg-white/15" />
                  <span className="font-mono text-sm font-medium uppercase tracking-wide text-white/80">
                    +{supporters} Supporters
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* z-cards — floating glass cards */}
          <FloatingCards progress={scrollYProgress} />
        </div>
      </section>

      <JoinModal kind="waitlist" accent="white" open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
}
