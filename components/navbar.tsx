"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { AudioLines, BookOpen, ChevronDown, Radio, Sparkles } from "lucide-react";
import Wordmark from "./wordmark";
import JoinModal from "./JoinModal";
import { MEASURE } from "./frame";
import ThemeToggle from "./theme-toggle";

type MenuGroup = {
  heading: string;
  icon: React.ReactNode;
  /** Tailwind classes tinting the group's header chip + strip. */
  tint: string;
  links: { label: string; href: string }[];
};

type NavItem =
  | { label: string; href: string; groups?: never }
  | { label: string; href?: never; groups: MenuGroup[] };

const NAV: NavItem[] = [
  {
    label: "Product",
    groups: [
      {
        heading: "The pipeline",
        icon: <AudioLines className="h-3.5 w-3.5" />,
        tint: "bg-tint-green-bg text-tint-green-fg",
        links: [
          { label: "How it works", href: "#how-it-works" },
          { label: "Voice cloning", href: "#features" },
          { label: "Lip sync", href: "#features" },
          { label: "Subtitle export", href: "#features" },
        ],
      },
      {
        heading: "Real time",
        icon: <Radio className="h-3.5 w-3.5" />,
        tint: "bg-tint-orange-bg text-tint-orange-fg",
        links: [
          { label: "Live streams", href: "#live" },
          { label: "Webinars & events", href: "#use-cases" },
          { label: "Latency", href: "#live" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    groups: [
      {
        heading: "Learn",
        icon: <BookOpen className="h-3.5 w-3.5" />,
        tint: "bg-tint-violet-bg text-tint-violet-fg",
        links: [
          { label: "About the project", href: "#about" },
          { label: "Use cases", href: "#use-cases" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        heading: "Build with us",
        icon: <Sparkles className="h-3.5 w-3.5" />,
        tint: "bg-tint-blue-bg text-tint-blue-fg",
        links: [
          { label: "API access", href: "#features" },
          { label: "Languages", href: "#languages" },
          { label: "Join the community", href: "#community" },
        ],
      },
    ],
  },
  { label: "Languages", href: "#languages" },
  { label: "Pricing", href: "#community" },
];

const panel: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

const menuList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
  exit: {},
};
const menuItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.12 } },
};

function DropdownPanel({ groups }: { groups: MenuGroup[] }) {
  return (
    <motion.div
      variants={panel}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute left-1/2 top-full w-[min(92vw,640px)] -translate-x-1/2 pt-3"
    >
      <div className="grid gap-3 rounded-2xl border border-line bg-bg p-3 shadow-[0_24px_60px_-20px_rgba(11,11,12,0.18)] sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.heading} className="rounded-xl border border-line">
            <div
              className={`flex items-center gap-2 rounded-t-xl border-b border-line px-4 py-3 ${g.tint}`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-bg/70">
                {g.icon}
              </span>
              <span className="font-display text-sm font-medium">{g.heading}</span>
            </div>
            <ul className="flex flex-col p-2">
              {g.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="block rounded-lg px-2 py-2 text-sm text-text-2 outline-none transition-colors hover:bg-surface hover:text-text focus-visible:bg-surface focus-visible:text-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hover intent: a short grace period stops the panel from flickering shut as
  // the pointer crosses the gap between the trigger and the panel.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => () => cancelClose(), []);

  // Lock scroll + wire Escape while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const { style } = document.documentElement;
    const prev = style.overflow;
    style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openRegister = () => {
    setMobileOpen(false);
    setRegisterOpen(true);
  };

  return (
    <>
      <header className="z-nav sticky top-0 border-b border-line bg-bg/85 backdrop-blur-xl pt-safe">
        <nav
          aria-label="Primary"
          className={`${MEASURE} flex h-16 items-center justify-between gap-4`}
        >
          <Link
            href="#top"
            aria-label="TH-LABS — home"
            className="rounded px-0.5 outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Wordmark className="text-[11px] text-text sm:text-[13px]" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  if (item.groups) setOpenMenu(item.label);
                  else setOpenMenu(null);
                }}
                onMouseLeave={scheduleClose}
              >
                {item.groups ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={openMenu === item.label}
                      onClick={() =>
                        setOpenMenu((cur) => (cur === item.label ? null : item.label))
                      }
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-2 outline-none transition-colors hover:text-text focus-visible:text-text focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          openMenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openMenu === item.label && <DropdownPanel groups={item.groups} />}
                    </AnimatePresence>
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="inline-flex items-center rounded-lg px-3 py-2 text-sm text-text-2 outline-none transition-colors hover:text-text focus-visible:text-text focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="hidden h-9 items-center justify-center rounded-lg bg-surface px-4 text-sm font-medium text-text outline-none transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent/50 md:inline-flex"
            >
              Login
            </button>

            {/* Hamburger (mobile) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-text outline-none focus-visible:ring-2 focus-visible:ring-accent/50 md:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className="absolute left-0 top-0 h-0.5 w-full bg-current" />
                <span className="absolute left-0 top-1.5 h-0.5 w-full bg-current" />
                <span className="absolute left-0 top-3 h-0.5 w-full bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="z-overlay fixed inset-0 flex flex-col overflow-y-auto bg-bg px-6 pb-safe pt-6 md:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <Wordmark className="text-[12px] text-text" />
              <ThemeToggle className="ml-auto" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-2xl text-text outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                ×
              </button>
            </div>

            <motion.ul
              variants={menuList}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mt-10 flex flex-col gap-1 pb-10"
            >
              {NAV.map((item) =>
                item.groups ? (
                  item.groups.map((g) => (
                    <motion.li key={g.heading} variants={menuItem} className="mt-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-3">
                        {g.heading}
                      </span>
                      <ul className="mt-2 flex flex-col">
                        {g.links.map((l) => (
                          <li key={l.label}>
                            <a
                              href={l.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2.5 font-display text-xl text-text outline-none focus-visible:text-accent"
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.li>
                  ))
                ) : (
                  <motion.li key={item.label} variants={menuItem} className="mt-5">
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2.5 font-display text-xl text-text outline-none focus-visible:text-accent"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ),
              )}
              <motion.li variants={menuItem} className="mt-8">
                <button
                  type="button"
                  onClick={openRegister}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-text text-base font-medium text-bg outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
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
        accent="purple"
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
}
