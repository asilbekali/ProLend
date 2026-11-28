"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  Headphones,
  Lock,
  LogIn,
  MousePointer2,
  Play,
  Puzzle,
  RotateCw,
  Square,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import LogoMark from "../logo-mark";
import { CtaPair, Eyebrow } from "./primitives";

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Create your account",
    body: "Sign up for TH-Labs in a few seconds. The same account works in the Chrome extension today, and in our mobile and web apps when they launch.",
    Icon: UserPlus,
  },
  {
    title: "Add it to Chrome",
    body: "Install TH-Labs Real-Time Dubbing from the Chrome Web Store. It sits in your toolbar, one click away in every tab.",
    Icon: Download,
  },
  {
    title: "Log in and pick your language",
    body: "Open a call, meeting or livestream — Meet, Zoom, Teams, YouTube. Click TH-Labs, log in with your account and choose the language you want to hear.",
    Icon: LogIn,
  },
  {
    title: "Press Start and just listen",
    body: "TH-Labs listens to the speaker, translates what they say and dubs it into your language with a natural AI voice — about two seconds behind. Nothing to read.",
    Icon: Play,
  },
];

const STEP_MS = 5600;
const EASE = [0.16, 1, 0.3, 1] as const;

// Where things sit in the browser window, in % of its width and height. The
// cursor travels in the same coordinates, so it lands on them at any size.
const AT = {
  google: { x: 50, y: 60 },
  add: { x: 77, y: 36 },
  confirm: { x: 63, y: 47 },
  puzzle: { x: 88.5, y: 13 },
  icon: { x: 82.5, y: 13 },
  // The popup's login button turns into the language picker in place.
  lang: { x: 76, y: 46 },
  start: { x: 76, y: 64 },
} as const;

type Pt = { x: number; y: number };

/** The cursor's script: where it is, and whether it's pressing, at (step, t). */
function cursorAt(step: number, t: number): Pt & { down: boolean } {
  const press = (a: number, b: number) => t > a && t < b;
  const rest = (x: number, y: number) => ({ x, y, down: false });
  switch (step) {
    case 0:
      if (t < 0.15) return rest(30, 78);
      if (t < 0.52) return { ...AT.google, down: press(0.38, 0.46) };
      return rest(68, 78);
    case 1:
      if (t < 0.12) return rest(48, 64);
      if (t < 0.44) return { ...AT.add, down: press(0.34, 0.42) };
      if (t < 0.8) return { ...AT.confirm, down: press(0.68, 0.76) };
      return rest(66, 66);
    case 2:
      if (t < 0.24) return { ...AT.icon, down: press(0.14, 0.22) };
      if (t < 0.48) return { ...AT.lang, down: press(0.34, 0.42) };
      if (t < 0.86) return { ...AT.lang, down: press(0.58, 0.66) };
      return rest(62, 76);
    default:
      if (t < 0.08) return rest(AT.lang.x, AT.lang.y);
      if (t < 0.34) return { ...AT.start, down: press(0.24, 0.32) };
      return rest(36, 84);
  }
}

/** Centres a child on a point of the window. */
function At({ p, children, className = "" }: { p: Pt; children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{ left: `${p.x}%`, top: `${p.y}%` }}
    >
      {children}
    </div>
  );
}

function Cursor({ step, t }: { step: number; t: number }) {
  const c = cursorAt(step, t);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute z-30"
      initial={false}
      animate={{ left: `${c.x}%`, top: `${c.y}%` }}
      transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.8 }}
    >
      {/* Click ripple */}
      <AnimatePresence>
        {c.down ? (
          <motion.span
            key="ripple"
            initial={{ scale: 0.2, opacity: 0.7 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-[var(--orange)]"
          />
        ) : null}
      </AnimatePresence>
      <motion.span
        animate={{ scale: c.down ? 0.82 : 1 }}
        transition={{ duration: 0.12 }}
        className="block origin-top-left"
      >
        <MousePointer2 className="h-4 w-4 -translate-x-[3px] -translate-y-[2px] fill-white text-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:h-5 sm:w-5" />
      </motion.span>
    </motion.div>
  );
}

/** Equaliser bars that keep moving while the dub plays. */
function Eq({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex h-3 items-end gap-[2px] ${className}`}>
      {[0.9, 0.55, 1.1, 0.7, 0.95].map((d, i) => (
        <motion.span
          key={i}
          className="block h-full w-[2px] origin-bottom rounded-full bg-[var(--green)]"
          animate={{ scaleY: [0.3, 1, 0.45, 0.85, 0.3] }}
          transition={{ duration: d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

const LINES = [
  { said: "Let's go through this week's numbers.", heard: "Keling, bu haftaning raqamlarini ko'rib chiqamiz." },
  { said: "Signups doubled since the launch.", heard: "Ishga tushirilgandan beri ro'yxatdan o'tish ikki barobar oshdi." },
  { said: "Next, we ship the Uzbek version.", heard: "Keyin o'zbekcha versiyani chiqaramiz." },
];

const PEOPLE = [
  { n: "John", bg: "linear-gradient(150deg,#3b2312,#c2410c 70%,#ffb347 130%)" },
  { n: "Elena", bg: "linear-gradient(150deg,#10261c,#0f766e 70%,#5eead4 130%)" },
  { n: "Aziz", bg: "linear-gradient(150deg,#1c1530,#6d28d9 70%,#c4b5fd 130%)" },
  { n: "You", bg: "linear-gradient(150deg,#1a1a1d,#3f3f46 70%,#a1a1aa 130%)" },
];

const PAGES = {
  signup: { tab: "Sign up — TH-Labs", url: "th-labs.uz/signup" },
  store: { tab: "Chrome Web Store", url: "chromewebstore.google.com/detail/th-labs" },
  meet: { tab: "Weekly sync — Meet", url: "meet.google.com/abc-defg-hij" },
} as const;

/** Step 1: the TH-Labs sign-up. Its Google button lives on the window. */
function SignupPage({ done }: { done: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[18%] flex items-center justify-center">
      <div className="flex h-[78%] w-[84%] flex-col items-center rounded-2xl bg-white/[0.04] px-4 pt-[5%] text-center sm:w-[52%]">
        <LogoMark className="h-5 w-5 sm:h-6 sm:w-6" />
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-[8%] flex flex-col items-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--green)] text-black">
                <Check className="h-4 w-4" />
              </span>
              <p className="mt-2 text-[11px] font-medium text-white sm:text-[13px]">Account created</p>
              <p className="mt-1 text-[10px] text-white/45 sm:text-[11px]">Next: add the extension</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <p className="mt-2 text-[11px] font-medium text-white sm:text-[13px]">
                Create your TH-Labs account
              </p>
              {/* Phones drop the subtitle: the window is short enough there
                  that it would sit behind the Google button. */}
              <p className="mt-1 hidden text-[11px] text-white/45 sm:block">
                One account for every TH-Labs app
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Step 2: the Chrome Web Store listing. Its button lives on the window. */
function StorePage() {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] px-[5%] pt-[4%]">
      <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--orange)]/15 sm:h-12 sm:w-12">
          <LogoMark className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <div className="min-w-0 pr-[28%]">
          <p className="truncate text-[11px] font-medium text-white sm:text-[13px]">
            TH-Labs Real-Time Dubbing
          </p>
          <p className="truncate text-[10px] text-white/45 sm:text-[11px]">th-labs.uz · Communication</p>
        </div>
      </div>
      <p className="mt-3 max-w-[70%] text-[10px] leading-relaxed text-white/45 sm:text-[11px]">
        Hear any call, meeting or livestream in your own language, in real time.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-video rounded-lg"
            style={{ background: PEOPLE[i].bg, opacity: 0.55 }}
          />
        ))}
      </div>
    </div>
  );
}

/** Steps 3 and 4: a video call, and what you hear once TH-Labs is on. */
function MeetPage({ live, line }: { live: boolean; line: number }) {
  const l = LINES[line];
  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] p-[3%]">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5">
        {PEOPLE.map((p, i) => (
          <div
            key={p.n}
            className={`relative overflow-hidden rounded-lg ${i === 0 ? "ring-2 ring-[var(--orange)]" : ""}`}
            style={{ background: p.bg }}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-[11px] font-semibold text-white sm:h-9 sm:w-9 sm:text-[13px]">
                {p.n[0]}
              </span>
            </span>
            <span className="absolute bottom-1 left-1.5 text-[9px] text-white/80 sm:text-[10px]">{p.n}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {live ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-x-[6%] bottom-[6%] rounded-xl bg-black/80 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[9px] text-[var(--green)] sm:text-[10px]">
                <Headphones className="h-3 w-3" /> Hearing John in O&rsquo;zbek
              </span>
              <Eq />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={line}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
              >
                <p className="mt-1 truncate text-[9px] text-white/40 line-through decoration-white/20 sm:text-[10px]">
                  {l.said}
                </p>
                <p className="text-[10px] leading-snug text-white sm:text-[12px]">{l.heard}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** A floating card under the toolbar — Chrome's prompt, the extension popup. */
function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={`absolute z-20 rounded-xl border border-white/10 bg-[#1a1a1d] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** The browser window, acting out the active step. */
function Window({ step, t }: { step: number; t: number }) {
  // Everything below is derived from (step, t), so scrolling back rewinds it.
  const page = step === 0 ? "signup" : step === 1 ? "store" : "meet";
  const signedUp = step > 0 || t > 0.46;
  const added = step > 1 || (step === 1 && t > 0.78);
  const adding = step === 1 && t > 0.42;
  const dialog = step === 1 && t > 0.44 && t < 0.78;
  const pinned = step > 1 || (step === 1 && t > 0.8);
  const popup = (step === 2 && t > 0.22) || (step === 3 && t < 0.44);
  const loggedIn = step === 3 || (step === 2 && t > 0.42);
  const listOpen = step === 2 && t > 0.66 && t < 0.86;
  const lang = step === 3 || (step === 2 && t > 0.86);
  const live = step === 3 && t > 0.3;
  const line = Math.min(LINES.length - 1, Math.floor(Math.max(0, t - 0.4) / 0.2));

  return (
    <div className="panel relative aspect-[4/3.3] w-full overflow-hidden rounded-3xl sm:aspect-[16/11]">
      {/* Tab strip */}
      <div className="absolute inset-x-0 top-0 flex h-[8%] items-end gap-2 bg-white/[0.03] px-[3%]">
        <span className="mb-[2.2%] hidden gap-1 sm:flex">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
          ))}
        </span>
        <span className="flex h-[75%] min-w-0 max-w-[45%] items-center gap-1.5 rounded-t-lg bg-white/[0.07] px-2.5 text-[10px] text-white/75 sm:text-[11px]">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-sm ${
              page === "meet" ? "bg-[var(--green)]" : page === "store" ? "bg-[#1a73e8]" : "bg-[var(--orange)]"
            }`}
          />
          <span className="truncate">{PAGES[page].tab}</span>
        </span>
      </div>

      {/* Address bar */}
      <div className="absolute inset-x-0 top-[8%] flex h-[10%] items-center gap-2 border-b border-white/[0.06] bg-white/[0.07] px-[3%] text-white/45">
        <ArrowLeft className="hidden h-3.5 w-3.5 sm:block" />
        <ArrowRight className="hidden h-3.5 w-3.5 sm:block" />
        <RotateCw className="hidden h-3 w-3 sm:block" />
        <span className="flex h-[62%] min-w-0 max-w-[68%] flex-1 items-center gap-1.5 rounded-full bg-black/30 px-2.5 text-[10px] text-white/60 sm:max-w-[62%] sm:text-[11px]">
          <Lock className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{PAGES[page].url}</span>
        </span>
      </div>

      {/* Toolbar icons sit on fixed points so the cursor can find them. */}
      <AnimatePresence>
        {pinned ? (
          <motion.div
            key="pinned"
            initial={{ opacity: 0, scale: 0.2, x: 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${AT.icon.x}%`, top: `${AT.icon.y}%` }}
          >
            <span
              className={`relative flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-300 sm:h-6 sm:w-6 ${
                popup ? "bg-white/15" : ""
              }`}
            >
              <LogoMark className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {live ? (
                <span className="absolute right-0 top-0 h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--green)]" />
              ) : null}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <At p={AT.puzzle}>
        <Puzzle className="h-3 w-3 text-white/55 sm:h-3.5 sm:w-3.5" />
      </At>
      <At p={{ x: 95, y: AT.puzzle.y }}>
        <span className="block h-4 w-4 rounded-full bg-gradient-to-br from-[var(--orange)] to-[#ffb347] sm:h-5 sm:w-5" />
      </At>

      {/* Page */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          {page === "signup" ? (
            <SignupPage done={signedUp} />
          ) : page === "store" ? (
            <StorePage />
          ) : (
            <MeetPage live={live} line={line} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step 1: sign up with Google */}
      {page === "signup" && !signedUp ? (
        <At p={AT.google}>
          <span className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 text-[10px] font-medium text-black sm:h-8 sm:px-4 sm:text-[11px]">
            <span className="font-bold text-[#4285f4]">G</span> Continue with Google
          </span>
        </At>
      ) : null}

      {/* Step 2: add to Chrome, confirm */}
      {page === "store" ? (
        <At p={AT.add}>
          <span
            className={`inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 text-[10px] font-medium transition-colors duration-300 sm:h-8 sm:px-4 sm:text-[12px] ${
              added ? "bg-white/10 text-white/70" : "bg-[#1a73e8] text-white"
            }`}
          >
            {added ? "Remove from Chrome" : adding ? "Adding…" : "Add to Chrome"}
          </span>
        </At>
      ) : null}
      <AnimatePresence>
        {dialog ? (
          <Sheet className="left-[19%] top-[19%] h-[36%] w-[62%] p-3 sm:left-[26%] sm:w-[48%]">
            <p className="text-[10px] font-medium text-white sm:text-[12px]">
              Add &ldquo;TH-Labs Real-Time Dubbing&rdquo;?
            </p>
            <p className="mt-1 text-[9px] leading-relaxed text-white/45 sm:text-[10px]">
              It can read the audio of the tab you turn it on in.
            </p>
          </Sheet>
        ) : null}
      </AnimatePresence>
      {dialog ? (
        <At p={AT.confirm} className="z-20">
          <span className="inline-flex h-6 items-center whitespace-nowrap rounded-full bg-[#1a73e8] px-3 text-[10px] font-medium text-white sm:h-7 sm:text-[11px]">
            Add extension
          </span>
        </At>
      ) : null}
      <AnimatePresence>
        {step === 1 && t > 0.82 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute bottom-[5%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-black sm:text-[11px]"
          >
            <Check className="h-3 w-3 text-[var(--green)]" /> TH-Labs was added to Chrome
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Steps 3–4: the extension popup — log in, pick a language, Start */}
      <AnimatePresence>
        {popup ? (
          <Sheet key="popup" className="right-[4%] top-[19%] h-[58%] w-[44%] sm:w-[40%]">
            <p className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2 text-[10px] font-medium text-white sm:text-[11px]">
              <LogoMark className="h-3 w-3" /> TH-Labs
            </p>
            <p className="flex items-center gap-1 px-3 pt-2 text-[9px] text-white/40 sm:text-[10px]">
              {loggedIn ? (
                <>
                  <Check className="h-2.5 w-2.5 text-[var(--green)]" /> Signed in
                </>
              ) : (
                "Log in to start dubbing"
              )}
            </p>
            {loggedIn ? (
              <p className="px-3 pt-1 text-[9px] text-white/40 sm:text-[10px]">Hear it in</p>
            ) : null}
          </Sheet>
        ) : null}
      </AnimatePresence>
      {popup ? (
        <>
          <At p={AT.lang} className="z-20 w-[36%] sm:w-[32%]">
            {loggedIn ? (
              <span
                className={`flex h-6 items-center justify-between rounded-lg border px-2 text-[10px] transition-colors duration-300 sm:h-7 sm:text-[11px] ${
                  lang ? "border-[var(--orange)]/60 text-white" : "border-white/10 text-white/45"
                }`}
              >
                {lang ? (
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-[var(--orange)]">UZ</span> O&rsquo;zbek
                  </span>
                ) : (
                  "Choose a language"
                )}
                <ChevronDown className="h-3 w-3 text-white/40" />
              </span>
            ) : (
              <span className="flex h-7 items-center justify-center gap-1.5 rounded-lg bg-white text-[10px] font-medium text-black sm:h-8 sm:text-[11px]">
                <LogIn className="h-3 w-3" /> Log in
              </span>
            )}
            <AnimatePresence>
              {listOpen ? (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 top-[calc(100%+3px)] rounded-lg border border-white/10 bg-[#202023] p-1 text-[10px] sm:text-[11px]"
                >
                  {["English", "Русский", "O'zbek"].map((n, i) => (
                    <li
                      key={n}
                      className={`rounded-md px-2 py-0.5 ${
                        i === 2 && t > 0.76 ? "bg-white/10 text-white" : "text-white/55"
                      }`}
                    >
                      {n}
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </At>
          {loggedIn && !listOpen ? (
            <At p={AT.start} className="z-20 w-[36%] sm:w-[32%]">
              <span
                className={`flex h-7 items-center justify-center gap-1.5 rounded-lg text-[10px] font-medium transition-colors duration-300 sm:h-8 sm:text-[11px] ${
                  live
                    ? "bg-white/10 text-white"
                    : lang
                      ? "bg-[var(--orange)] text-white"
                      : "bg-white/[0.06] text-white/35"
                }`}
              >
                {live ? (
                  <>
                    <Eq className="!h-2.5" /> Dubbing live
                    <Square className="h-2.5 w-2.5 fill-white/60 text-white/60" />
                  </>
                ) : (
                  <>
                    <Play className="h-2.5 w-2.5 fill-current" /> Start dubbing
                  </>
                )}
              </span>
            </At>
          ) : null}
        </>
      ) : null}

      <Cursor step={step} t={t} />
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  // Desktop pins the section and lets scroll drive it, as the reference
  // does; phones (where the copy and window don't fit one screen) play the
  // steps on a timer instead.
  const pinned = useMediaQuery("(min-width: 1024px)");
  const [step, setStep] = useState(0);
  const [t, setT] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 0–0.14: the window alone, centred · then it slides left as the copy
  // arrives · 0.18–1: the four steps, a quarter of the scroll each.
  // Function transforms on purpose: motion hands range-mapped scroll
  // transforms to a native ScrollTimeline, which drops this section's
  // offsets and faded the copy back out across the whole pin.
  const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const windowX = useTransform(scrollYProgress, (v) => `${42 * (1 - ramp(v, 0.02, 0.16))}%`);
  const copyOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.1, 0.18));
  const copyX = useTransform(scrollYProgress, (v) => 40 * (1 - ramp(v, 0.1, 0.18)));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const k = Math.min(0.9999, Math.max(0, (v - 0.18) / 0.8)) * STEPS.length;
    setStep(Math.floor(k));
    // Rounded so the window re-renders ~50 times a step, not on every
    // scroll frame — setState bails out while the value is unchanged.
    setT(Math.round((k - Math.floor(k)) * 50) / 50);
  });

  // Phones: each step plays for STEP_MS, then hands over to the next.
  useEffect(() => {
    if (pinned) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = (now - start) / STEP_MS;
      if (k >= 1) {
        setStep((s) => (s + 1) % STEPS.length);
        return;
      }
      // Same 1/50 steps as the scroll path: the window re-renders ~50
      // times a step instead of every frame, which phones feel most.
      setT(Math.round(k * 50) / 50);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step, pinned]);

  // On desktop a step click scrolls to that step's stretch of the pin.
  const goTo = (i: number) => {
    const el = ref.current;
    if (!pinned || !el) return setStep(i);
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + span * (0.18 + (0.8 * (i + 0.05)) / STEPS.length),
      behavior: "smooth",
    });
  };

  // Phones: a swipe on the window or the step card moves one step either way.
  const swipe = (dx: number) => {
    if (pinned || Math.abs(dx) < 40) return;
    setStep((s) => (s + (dx < 0 ? 1 : STEPS.length - 1)) % STEPS.length);
  };

  return (
    <section ref={ref} id="how" className="relative scroll-mt-16 lg:h-[460svh]">
      <div className="px-4 py-24 sm:px-6 sm:py-32 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:py-0">
        {/* Phones read top to bottom: heading, the window acting the step
            out, then the step itself — so the animation is on screen while
            its text is. Desktop keeps the window on the left, with heading
            and steps stacked on the right. */}
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-14 lg:gap-y-0">
          <motion.div
            style={pinned ? { opacity: copyOpacity, x: copyX } : undefined}
            className="text-center lg:col-start-2 lg:row-start-1 lg:self-end lg:text-left"
          >
            <Eyebrow>How real-time dubbing works</Eyebrow>
            <h2 className="mt-3 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.04] text-white">
              Any call, in your
              <br />
              own language.
            </h2>
            <CtaPair className="mt-6 max-lg:hidden" />
          </motion.div>

          <motion.div
            style={pinned ? { x: windowX } : undefined}
            onPanEnd={(_, info) => swipe(info.offset.x)}
            className="touch-pan-y lg:col-start-1 lg:row-span-2 lg:row-start-1"
          >
            <Window step={step} t={t} />
          </motion.div>

          <motion.div
            style={pinned ? { opacity: copyOpacity, x: copyX } : undefined}
            onPanEnd={(_, info) => swipe(info.offset.x)}
            className="touch-pan-y text-center lg:col-start-2 lg:row-start-2 lg:self-start lg:text-left"
          >
            {/* Phones stack every step in one grid cell and show only the
                current one, so the cell is always as tall as the longest
                step. Swapping steps on the timer then never changes the page
                height — Safari has no scroll anchoring, so a height change
                here would jump the page under a reader's thumb. */}
            <ol className="grid lg:mt-8 lg:flex lg:flex-col lg:gap-2">
              {STEPS.map((s, i) => {
                const on = i === step;
                return (
                  <li
                    key={s.title}
                    className={`max-lg:[grid-area:1/1] ${on ? "" : "max-lg:invisible"}`}
                  >
                    <button
                      type="button"
                      // Desktop scrolls to the step; on phones a tap on the
                      // card showing moves on to the next one.
                      onClick={() =>
                        pinned || !on ? goTo(i) : setStep((i + 1) % STEPS.length)
                      }
                      className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-300 ${
                        on ? "panel border-white/15" : "border-white/[0.06] hover:border-white/15"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                            on ? "border-white/30 text-white" : "border-white/10 text-white/45"
                          }`}
                        >
                          {i < step ? (
                            <Check className="h-4 w-4 text-[var(--green)]" />
                          ) : (
                            <s.Icon className="h-4 w-4" />
                          )}
                        </span>
                        <span
                          className={`text-[15px] font-medium lg:text-[14px] ${on ? "text-white" : "text-white/55"}`}
                        >
                          <span className="mr-1.5 text-white/35">{i + 1}.</span>
                          {s.title}
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {on ? (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="overflow-hidden pl-12 text-[13px] leading-relaxed text-white/50 max-lg:hidden"
                          >
                            <span className="block pt-1.5">{s.body}</span>
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                      {/* Phones: always rendered, so even a hidden step holds
                          its full height and the exit animation can't add any. */}
                      <span
                        aria-hidden={on ? undefined : true}
                        className={`block pl-12 pt-1.5 text-[14px] leading-relaxed text-white/55 lg:hidden ${
                          on ? "animate-[fadeUp_.35s_ease-out]" : ""
                        }`}
                      >
                        {s.body}
                      </span>
                      {on ? (
                        <span
                          className="absolute bottom-0 left-0 h-[2px] bg-[var(--orange)]"
                          style={{ width: `${t * 100}%` }}
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
            {/* Phones show one step at a time. The dots stay small to look
                at, but each sits in a 32px tap target. */}
            <div className="mt-2 flex justify-center lg:hidden">
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`Show step ${i + 1}: ${s.title}`}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => setStep(i)}
                  className="flex h-8 min-w-8 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? "w-5 bg-white" : "w-1.5 bg-white/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[12px] text-white/35 lg:hidden">Tap or swipe for the next step</p>
            <CtaPair className="mt-6 lg:hidden" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
