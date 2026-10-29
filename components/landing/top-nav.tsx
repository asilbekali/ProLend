"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LogoMark from "../logo-mark";
import { StartButton } from "./primitives";

const LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Live dubbing", href: "#live" },
  { label: "Who it's for", href: "#audiences" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page and wire Escape while the phone menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`z-nav fixed inset-x-0 top-0 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
          scrolled ? "border-b border-white/[0.06] bg-black/60 backdrop-blur-xl" : ""
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6"
        >
          <a
            href="#top"
            className="flex items-center gap-2 rounded-md text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <LogoMark className="h-[22px] w-[22px]" />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">TH-Labs</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3 py-2 text-[13px] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <StartButton size="sm" tone="ghost">
                Log in
              </StartButton>
            </span>
            <StartButton size="sm">Get started</StartButton>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="pill-dark flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
            >
              <span className="flex w-3.5 flex-col gap-[3px]">
                <span className="h-px bg-white" />
                <span className="h-px bg-white" />
                <span className="h-px bg-white" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="z-overlay fixed inset-0 flex flex-col bg-black/95 px-5 pt-[calc(env(safe-area-inset-top)+1rem)] backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white">
                <LogoMark className="h-[22px] w-[22px]" />
                <span className="text-[17px] font-semibold">TH-Labs</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="pill-dark flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none"
              >
                ×
              </button>
            </div>
            <ul className="mt-10 flex flex-col">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className="border-b border-white/[0.08]"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-2xl font-medium tracking-[-0.02em] text-white"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
              <StartButton tone="orange" className="w-full">
                Get started
              </StartButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
