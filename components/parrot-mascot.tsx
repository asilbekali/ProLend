"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Parrot from "./parrot";
import JoinModal from "./JoinModal";

/**
 * The parrot that lives on the site.
 *
 * It is never simply "on screen". Most visits it clings to an edge, leans in
 * far enough to be noticed, looks around, and ducks back out — and every third
 * visit or so it simply walks across the bottom of the page and off the other
 * side, waddling the whole way. The intent is a bird that happens to live here,
 * not a widget pinned to a corner, so three things had to be true:
 *
 *  1. It comes and goes. A permanent mascot stops being noticed within one
 *     scroll; one that appears roughly every quarter-minute keeps its charm.
 *  2. It reads the room. Fast scrolling startles it away, and it only lets
 *     itself be seen once the page has settled — which is what sells it as
 *     reacting to the visitor rather than running a timer.
 *  3. It is never still. Breath and small leans run whether or not anyone is
 *     looking at it. The artwork already winks, so there is no blink to drive.
 *
 * Hovering coaxes it fully into view and gets a wave. Clicking gets a hop and a
 * double flap, and then opens the register / login card — the bird is the
 * friendliest "get started" on the page, so poking it has to lead somewhere.
 *
 * It stays away entirely until the visitor has scrolled past the hero's
 * product panel. The first screen is the pitch, and a bird wandering into it
 * competes with the headline for the one moment that matters most.
 *
 * Decorative throughout — `aria-hidden`, not focusable, and rendered as nothing
 * at all for visitors who asked for reduced motion.
 */

type Edge = "left" | "right" | "bottom";

type Spot = {
  edge: Edge;
  /** Position along the edge it clings to: `top` for sides, `left` for bottom. */
  along: string;
};

// Spread around the frame and deliberately out of order, so consecutive
// appearances never land on the same side twice running. Weighted toward the
// left and bottom: the artwork's raised wing is on its right, so those edges
// let it wave *into* the page instead of off it.
const SPOTS: Spot[] = [
  { edge: "left", along: "40%" },
  { edge: "bottom", along: "14%" },
  { edge: "right", along: "58%" },
  { edge: "left", along: "66%" },
  { edge: "bottom", along: "74%" },
];

/** What the bird is doing this visit. `null` means it is away. */
type Visit =
  | { kind: "peek"; spot: Spot }
  | { kind: "stroll"; travel: number; seconds: number };

/** Peek depth, as a share of the bird's own size, per edge and per state. */
const OFFSET: Record<Edge, { away: string; peek: string; out: string }> = {
  right: { away: "118%", peek: "26%", out: "4%" },
  left: { away: "-118%", peek: "-26%", out: "-4%" },
  bottom: { away: "118%", peek: "30%", out: "6%" },
};

const axis = (edge: Edge, v: string) =>
  edge === "bottom" ? { x: "0%", y: v } : { x: v, y: "0%" };

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * True once the hero's Dubbing / Live / Subtitles panel has scrolled fully off
 * the top. Measured live rather than cached as a pixel offset, because the
 * hero's height depends on the viewport and on which tab is open.
 *
 * If the panel is missing — any page that is not the landing page — there is
 * nothing to stay out of the way of, so the bird is free.
 */
const pastHero = () => {
  const panel = document.getElementById("hero-tabpanel");
  if (!panel) return true;
  return panel.getBoundingClientRect().bottom <= 0;
};

export default function ParrotMascot() {
  const reduce = useReducedMotion();

  const [visit, setVisit] = useState<Visit | null>(null);
  /** Hover pulls a peeking bird fully into view. Meaningless mid-stroll. */
  const [leaning, setLeaning] = useState(false);
  const [tilt, setTilt] = useState(0);
  const [wave, setWave] = useState(0);
  const [breath, setBreath] = useState(0);
  const [hop, setHop] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);

  // Read inside timeout callbacks, which close over stale state otherwise.
  const visitRef = useRef<Visit | null>(null);
  const hoverRef = useRef(false);
  const scrollingRef = useRef(false);
  const spotIndexRef = useRef(0);
  const lastWasStrollRef = useRef(false);

  const go = useCallback((next: Visit | null) => {
    visitRef.current = next;
    setVisit(next);
    if (!next) setLeaning(false);
  }, []);

  // ── The appear / leave cycle ──────────────────────────────────────────────
  useEffect(() => {
    if (reduce) return;

    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    };

    const appear = () => {
      // Two reasons to hold off and check again shortly: the visitor is still
      // in the hero, or the page is mid-scroll — arriving then would slide the
      // bird in behind moving content and read as a popup.
      if (scrollingRef.current || !pastHero()) {
        later(appear, 1100);
        return;
      }

      // Roughly one visit in three is a walk-past, never two in a row — the
      // stroll is the treat, and back to back it stops being one.
      const stroll = !lastWasStrollRef.current && Math.random() < 0.36;
      lastWasStrollRef.current = stroll;

      if (stroll) {
        const seconds = rand(13, 17);
        go({ kind: "stroll", travel: window.innerWidth + 260, seconds });
        // It waves once around a third of the way across, mid-stride.
        later(() => {
          if (visitRef.current?.kind !== "stroll") return;
          setWave(1);
          later(() => setWave(0), 700);
        }, seconds * 340);
        // Clear once it is genuinely off the far edge.
        later(leave, seconds * 1000 + 300);
        return;
      }

      spotIndexRef.current = (spotIndexRef.current + 1) % SPOTS.length;
      go({ kind: "peek", spot: SPOTS[spotIndexRef.current] });

      // A beat after settling, it notices you.
      later(() => {
        if (!visitRef.current) return;
        setWave(1);
        later(() => setWave(0), 620);
      }, 1000);

      later(leave, rand(6500, 10000));
    };

    const leave = () => {
      // Being hovered is an explicit "stay" — but only a peeking bird can wait
      // around. A stroll has already walked off the edge by the time this runs.
      if (hoverRef.current && visitRef.current?.kind === "peek") {
        later(leave, 2500);
        return;
      }
      go(null);
      later(appear, rand(12000, 21000));
    };

    later(appear, 3800);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, [reduce, go]);

  // ── Startled by fast scrolling ────────────────────────────────────────────
  useEffect(() => {
    if (reduce) return;

    let last = window.scrollY;
    let settle = 0;

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - last);
      last = window.scrollY;

      // Only a real flick counts. Gentle scrolling leaves the bird alone, which
      // is what keeps it from flickering on every wheel notch.
      if (delta > 34) {
        scrollingRef.current = true;
        if (visitRef.current && !hoverRef.current) go(null);
      }

      // Scrolling back up into the hero sends it away, hover or not.
      if (!pastHero() && visitRef.current) go(null);

      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        scrollingRef.current = false;
      }, 420);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
    };
  }, [reduce, go]);

  // ── Leaning / looking around ──────────────────────────────────────────────
  useEffect(() => {
    if (reduce) return;
    let id = 0;
    const cycle = () => {
      // Sometimes it just faces forward — always turning looks like a metronome.
      setTilt(Math.random() < 0.28 ? 0 : rand(-6, 6));
      id = window.setTimeout(cycle, rand(1700, 3600));
    };
    id = window.setTimeout(cycle, 700);
    return () => window.clearTimeout(id);
  }, [reduce]);

  // ── Breathing ─────────────────────────────────────────────────────────────
  // A two-state toggle rather than a keyframe loop: the springs inside <Parrot>
  // turn it into a soft, slightly irregular rise and fall for free.
  useEffect(() => {
    if (reduce) return;
    let id = 0;
    const cycle = () => {
      setBreath((b) => (b === 0 ? 1 : 0));
      id = window.setTimeout(cycle, rand(1400, 1900));
    };
    id = window.setTimeout(cycle, 600);
    return () => window.clearTimeout(id);
  }, [reduce]);

  const onEnter = () => {
    hoverRef.current = true;
    if (visitRef.current?.kind === "peek") setLeaning(true);
    setWave(1);
    window.setTimeout(() => setWave(0), 640);
  };

  const onLeave = () => {
    hoverRef.current = false;
    setLeaning(false);
  };

  // Poking it plays the hop and the double flap first, then opens the register
  // card. The delay is the animation's length: opening the modal on the same
  // frame as the click throws the reaction away.
  const onPoke = () => {
    setHop((h) => h + 1);
    setWave(1);
    window.setTimeout(() => setWave(0), 240);
    window.setTimeout(() => setWave(1), 360);
    window.setTimeout(() => setWave(0), 640);
    window.setTimeout(() => setAuthOpen(true), 520);
  };

  // Reduced motion gets no bird at all. A static one pinned to the corner would
  // be worse than none — it is the movement that is the whole point.
  if (reduce) return null;

  // The bird itself, plus the hop and the pointer affordances. Shared so the
  // peek and the stroll cannot drift apart.
  const bird = (
    <motion.div
      key={hop}
      animate={hop > 0 ? { y: [0, -22, 0] } : undefined}
      transition={{ duration: 0.42, ease: [0.34, 1.3, 0.64, 1] }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={onPoke}
      className="pointer-events-auto cursor-pointer"
    >
      <Parrot
        tilt={tilt}
        wave={wave}
        breath={breath}
        className="h-[96px] w-[98px] drop-shadow-[0_12px_26px_rgba(17,12,40,0.2)] sm:h-[126px] sm:w-[129px]"
      />
    </motion.div>
  );

  return (
    <>
      <div
        aria-hidden="true"
        className="z-cursor pointer-events-none fixed inset-0 overflow-hidden"
      >
        <AnimatePresence>
          {visit?.kind === "peek" && (
            <motion.div
              key={`${visit.spot.edge}-${visit.spot.along}`}
              style={
                visit.spot.edge === "bottom"
                  ? { bottom: 0, left: visit.spot.along }
                  : { top: visit.spot.along, [visit.spot.edge]: 0 }
              }
              initial={axis(visit.spot.edge, OFFSET[visit.spot.edge].away)}
              animate={axis(
                visit.spot.edge,
                OFFSET[visit.spot.edge][leaning ? "out" : "peek"],
              )}
              exit={axis(visit.spot.edge, OFFSET[visit.spot.edge].away)}
              transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
              className="absolute"
            >
              {/* Deliberately not mirrored on the left edge. Flipping the bird
                  would flip the company mark on its chest with it, and a
                  mirrored logo is a broken logo — it looks into the page via
                  the head tilt instead. */}
              {bird}
            </motion.div>
          )}

          {visit?.kind === "stroll" && (
            // The walk-past. It only ever goes left to right, because the bird
            // is never mirrored and the artwork faces that way.
            <motion.div
              key="stroll"
              className="absolute bottom-1 left-0"
              initial={{ x: -190 }}
              animate={{ x: visit.travel }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: visit.seconds, ease: "linear" }}
            >
              {/* Two nested loops make the waddle: a slow rock from the feet,
                  and a bob at twice that rate so each lean gets its own step.
                  Together they turn a sliding sticker into a walk. */}
              <motion.div
                style={{ transformOrigin: "50% 100%" }}
                animate={{ rotate: [-3.5, 3.5, -3.5] }}
                transition={{ duration: 0.74, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 0.37, repeat: Infinity, ease: "easeInOut" }}
                >
                  {bird}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outside the fixed, pointer-events-none layer above — the card is a real
          dialog and has to receive clicks. Same modal the navbar's Login opens,
          so the bird lands the visitor in exactly one flow, not a second one. */}
      <JoinModal
        kind="register"
        accent="purple"
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}
