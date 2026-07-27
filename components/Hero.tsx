"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Press_Start_2P, Newsreader, Geist_Mono } from "next/font/google";
import { motion, type Variants } from "motion/react";
import Counter from "./reactbits/Counter/Counter";
import ShinyText from "./reactbits/ShinyText/ShinyText";
import { useSpecularEffect } from "./reactbits/SpecularButton/SpecularButton";
import JoinModal from "./JoinModal";
import { useEarlyUsersCount } from "@/lib/queries/useEarlyUsersCount";

// Fallback shown only until the live count arrives. The REAL number comes from
// useEarlyUsersCount() called inside the Hero component below (see `earlyUsers`),
// where `supporterCount` resolves to `earlyUsers?.count ?? FALLBACK_SUPPORTER_COUNT`.
// A hook can't be called here at module scope — that throws "Invalid hook call".
const FALLBACK_SUPPORTER_COUNT = 142;



// Body / UI text — elegant editorial serif

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
});

// Numbers — Geist Mono
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
});

// TH-LABS wordmark — real 8-bit pixel font
const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
});

/** Material 3 type scale (spec mapping unchanged) */
const type = {
  displayLarge: "text-[57px] leading-[64px] tracking-[-0.25px] font-normal",
  displayMedium: "text-[45px] leading-[52px] tracking-normal font-normal",
  displaySmall: "text-[36px] leading-[44px] tracking-normal font-normal",
  headlineLarge: "text-[32px] leading-[40px] tracking-normal font-normal",
  headlineMedium: "text-[28px] leading-[36px] tracking-normal font-normal",
  headlineSmall: "text-[24px] leading-[32px] tracking-normal font-normal",
  titleLarge: "text-[22px] leading-[28px] tracking-normal font-medium",
  titleMedium: "text-base leading-6 tracking-[0.15px] font-medium",
  titleSmall: "text-sm leading-5 tracking-[0.1px] font-medium",
  bodyLarge: "text-base leading-6 tracking-[0.5px] font-normal",
  bodyMedium: "text-sm leading-5 tracking-[0.25px] font-normal",
  bodySmall: "text-xs leading-4 tracking-[0.4px] font-normal",
  labelLarge: "text-sm leading-5 tracking-[0.1px] font-medium",
  labelMedium: "text-xs leading-4 tracking-[0.5px] font-medium",
  labelSmall: "text-[11px] leading-4 tracking-[0.5px] font-medium",
} as const;

const AVATARS = [
  { initials: "A", from: "#a78bfa", to: "#5b3fd9" },
  { initials: "G", from: "#34d399", to: "#0f766e" },
  { initials: "S", from: "#fbbf24", to: "#b45309" },
  { initials: "J", from: "#fb7185", to: "#9d174d" },
];

export default function Hero() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  // React Bits Specular Button — overlaid on the existing "Get Started" pill
  // without altering its resting style. The shine only appears on hover/focus
  // (the button fills black then), so a bright white specular rim reads well;
  // visibility itself is gated by the overlay span's opacity (see markup).
  const getStartedRef = useRef<HTMLButtonElement>(null);
  const specularFxRef = useRef<HTMLSpanElement>(null);
  useSpecularEffect(getStartedRef, specularFxRef, {
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

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setOffset({ x, y });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const heroContainerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };
  const ENTRANCE_DONE_MS = (0.15 + 3 * 0.12 + 0.7) * 1000;

  // Real network call — GET /api/waitlist/count. Falls back to a
  // placeholder number until the backend route ships.
  const { data: earlyUsers } = useEarlyUsersCount();

  const [revealCount, setRevealCount] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setRevealCount(true), ENTRANCE_DONE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const supporterCount = revealCount
    ? (earlyUsers?.count ?? FALLBACK_SUPPORTER_COUNT)
    : 0;

  return (
    <section
      ref={sectionRef}
      className={`${newsreader.className} relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6 pb-44 pt-24 text-foreground sm:py-24`}
    >
      {/* navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-10 sm:py-6"
      >
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
          <span
            className={`${pressStart2P.className} select-none text-[9px] uppercase text-foreground sm:text-[10px] md:text-xs`}
          >
            TH-LABS
          </span>
        </Link>
        <motion.button
          ref={getStartedRef}
          type="button"
          onClick={() => setRegisterOpen(true)}
          className={`group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-white px-5 ${type.labelLarge} text-black sm:h-10 sm:px-6`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
          <span
            ref={specularFxRef}
            aria-hidden="true"
            className="pointer-events-none absolute -inset-5 z-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
          />
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
            Get Started
          </span>
        </motion.button>
      </motion.nav>

      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center"
      >
        <motion.div variants={heroItemVariants}>
          <h1
            className={`${pressStart2P.className} select-none uppercase ${type.displayLarge} text-foreground`}
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              lineHeight: 1.6,
              transform: `translate3d(${offset.x * 10}px, ${offset.y * 6}px, 0)`,
            }}
          >
            <ShinyText
              text="TH-LABS"
              speed={4}
              color="#8f8f9a"
              shineColor="#ffffff"
            />
          </h1>
        </motion.div>

        <motion.p
          variants={heroItemVariants}
          className={`max-w-xl text-balance px-4 ${type.bodyLarge} text-muted sm:px-0`}
        >
          AI dubbing system for natural multilingual voice conversion.
        </motion.p>

        <motion.div
          variants={heroItemVariants}
          className="flex w-full flex-col gap-4 px-4 sm:w-auto sm:flex-row sm:px-0"
        >
          <button
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className={`inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 ${type.labelLarge} text-black transition-transform hover:-translate-y-0.5 sm:w-auto`}
          >
            Join Waitlist
          </button>
          <a
            href="#mission"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-foreground/90 transition-colors hover:border-white/50 hover:text-white sm:w-auto"
          >
            <span className={type.labelLarge}>Learn more</span>
            <span className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="thlabs-dot-wave h-1.5 w-1.5 rounded-full bg-current"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          </a>
        </motion.div>

        <motion.div
          variants={heroItemVariants}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <span
            className={`uppercase tracking-[0.3em] ${type.labelSmall} text-muted`}
          >
            Trusted by early pioneers
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-3">
              {AVATARS.map((a) => (
                <div
                  key={a.initials}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-background ${type.labelSmall} text-white sm:h-9 sm:w-9`}
                  style={{
                    background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="h-6 w-px bg-white/15" />
            <div className="text-left leading-tight">
              <div
                className={`${geistMono.className} flex items-baseline ${type.titleSmall} text-foreground`}
              >
                <span>+</span>
                <Counter
                  value={supporterCount}
                  places={[10, 1]}
                  fontSize={14}
                  padding={0}
                  gap={0}
                  horizontalPadding={0}
                  textColor="inherit"
                  fontWeight="inherit"
                />
              </div>
              <div
                className={`uppercase tracking-wide ${type.labelSmall} text-muted`}
              >
                supporters
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .thlabs-dot-wave {
          animation: thlabs-dot-bounce 1.2s ease-in-out infinite;
        }
        @keyframes thlabs-dot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <JoinModal
        kind="register"
        accent="white"
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
      <JoinModal
        kind="waitlist"
        accent="white"
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </section>
  );
}
