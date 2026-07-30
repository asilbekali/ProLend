"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";
import Wordmark from "./wordmark";
import JoinModal from "./JoinModal";
import { useMagnetic } from "@/hooks/use-magnetic";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Product", href: "#how-it-works" },
  { label: "Docs", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#waitlist" },
] as const;

function BracketLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const bracket =
    "text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100";
  return (
    <a
      href={href}
      onClick={onClick}
      className="group inline-flex items-center gap-1 rounded font-mono text-sm text-white/60 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
    >
      <span aria-hidden="true" className={bracket}>
        [
      </span>
      {label}
      <span aria-hidden="true" className={bracket}>
        ]
      </span>
    </a>
  );
}

const menuList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: {},
};
const menuItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  const {
    attach: bindGetStarted,
    x: getStartedX,
    y: getStartedY,
  } = useMagnetic<HTMLButtonElement>({ radius: 80, strength: 0.25 });

  // Lock scroll + wire Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const { style } = document.documentElement;
    const prev = style.overflow;
    style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openRegister = () => {
    setMenuOpen(false);
    setRegisterOpen(true);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="z-nav fixed inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-[#6d28d9] via-accent to-[#6d28d9]"
      />

      <header className="z-nav pointer-events-none fixed inset-x-0 top-3 flex justify-center px-4 pt-safe sm:top-5">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          aria-label="Primary"
          className={`pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border backdrop-blur-xl transition-all duration-300 sm:px-4 ${
            scrolled
              ? "border-white/15 bg-black/50 px-3 py-1.5 backdrop-blur-2xl"
              : "border-white/10 bg-white/[0.04] px-3 py-2.5"
          }`}
        >
          <Link
            href="#top"
            aria-label="TH-LABS — home"
            className="rounded-full px-1 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Wordmark className="text-[9px] text-white sm:text-[11px]" />
          </Link>

          <ul className="hidden items-center gap-5 md:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <BracketLink href={l.href} label={l.label} />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <motion.button
              ref={bindGetStarted}
              type="button"
              onClick={() => setRegisterOpen(true)}
              style={{ x: getStartedX, y: getStartedY }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden h-9 items-center justify-center rounded-full bg-white px-4 font-mono text-sm font-medium text-black outline-none transition-shadow hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:inline-flex"
            >
              Get Started
            </motion.button>

            {/* Hamburger (mobile) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className="absolute left-0 top-0 h-0.5 w-full bg-current" />
                <span className="absolute left-0 top-1.5 h-0.5 w-full bg-current" />
                <span className="absolute left-0 top-3 h-0.5 w-full bg-current" />
              </span>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="z-overlay fixed inset-0 flex flex-col bg-black/80 px-6 pb-safe pt-6 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between">
              <Wordmark className="text-[10px] text-white" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                ×
              </button>
            </div>

            <motion.ul
              variants={menuList}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mt-16 flex flex-col gap-2"
            >
              {LINKS.map((l) => (
                <motion.li key={l.label} variants={menuItem}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-mono text-2xl text-white/80 outline-none transition-colors hover:text-white focus-visible:text-white"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li variants={menuItem} className="mt-6">
                <button
                  type="button"
                  onClick={openRegister}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white font-mono text-base font-medium text-black outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Get Started
                </button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      <JoinModal
        kind="register"
        accent="white"
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
}
