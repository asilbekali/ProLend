"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { TileView, type Tile } from "./tiles";
import { V, type Video } from "./media";
import { StartButton } from "./primitives";

type Placed = {
  tile: Tile;
  caption: string;
  /** Centre of the card on desktop, in % of the hero. */
  x: number;
  y: number;
  /** Centre on phones — the title takes the middle band there. */
  mx: number;
  my: number;
  /** Width in px at desktop scale. */
  w: number;
  /** Parallax depth: how far the card follows the pointer. */
  d: number;
  /** Cards left out on phones, where there is less room around the title. */
  wide?: boolean;
};

const yt = (video: Video, badge: string, line?: string): Tile => ({
  kind: "video",
  video,
  badge,
  line,
});

// Hand-placed so the centre stays clear for the title. Captions read like the
// reference's "Artist — Work" labels: whose video it is, and where it went.
const CARDS: Placed[] = [
  {
    x: 8,
    y: 13,
    mx: 16,
    my: 8,
    w: 132,
    d: 1.2,
    caption: "MrBeast — Escape 100 Cops",
    tile: yt(V.beastCops, "EN → UZ", "100 ta politsiyadan qoching"),
  },
  {
    x: 22,
    y: 7,
    mx: 50,
    my: 6,
    w: 112,
    d: 0.6,
    caption: "Mark Rober — Every Board Game",
    tile: yt(V.roberBoard, "EN → RU"),
  },
  {
    x: 36,
    y: 10,
    mx: 84,
    my: 9,
    w: 104,
    d: 0.9,
    caption: "TED — Why It's Hard to Listen",
    tile: yt(V.tedListen, "EN → ES"),
  },
  {
    x: 63,
    y: 8,
    mx: 30,
    my: 20,
    w: 124,
    d: 0.7,
    wide: true,
    caption: "Lex Fridman Podcast #503",
    tile: yt(V.lexMath, "EN → TR"),
  },
  {
    x: 79,
    y: 12,
    mx: 72,
    my: 21,
    w: 110,
    d: 1.1,
    caption: "Online class — live",
    tile: { kind: "photo", photo: "classVideo", badge: "LIVE · RU → UZ" },
  },
  {
    x: 93,
    y: 18,
    mx: 50,
    my: 30,
    w: 118,
    d: 0.8,
    wide: true,
    caption: "MrBeast — Last To Leave Mansion",
    tile: yt(V.beastMansion, "EN → AR"),
  },
  {
    x: 6,
    y: 37,
    mx: 7,
    my: 36,
    w: 104,
    d: 0.9,
    caption: "Veritasium — Fiber Optics",
    tile: yt(V.veritasiumFiber, "EN → KK"),
  },
  {
    x: 20,
    y: 30,
    mx: 0,
    my: 0,
    w: 96,
    d: 1.3,
    wide: true,
    caption: "CS50 — Seconds on Binary",
    tile: yt(V.cs50Binary, "EN → UZ"),
  },
  {
    x: 78,
    y: 32,
    mx: 0,
    my: 0,
    w: 100,
    d: 1.2,
    wide: true,
    caption: "Dude Perfect — Rocket League",
    tile: yt(V.dudeRocket, "EN → FR"),
  },
  {
    x: 93,
    y: 40,
    mx: 93,
    my: 38,
    w: 124,
    d: 0.7,
    caption: "Team call — live",
    tile: { kind: "photo", photo: "callGallery", badge: "LIVE · EN → UZ" },
  },
  {
    x: 9,
    y: 58,
    mx: 7,
    my: 63,
    w: 120,
    d: 0.8,
    caption: "Apple — New MacBook Pro",
    tile: yt(V.appleEvent, "EN → JA"),
  },
  {
    x: 22,
    y: 50,
    mx: 0,
    my: 0,
    w: 104,
    d: 1.1,
    wide: true,
    caption: "Kurzgesagt — Only Like Half",
    tile: yt(V.kurzgesagtHalf, "EN → DE"),
  },
  {
    x: 79,
    y: 55,
    mx: 0,
    my: 0,
    w: 100,
    d: 1,
    wide: true,
    caption: "Khan Academy — Physics",
    tile: yt(V.khanPhysics, "EN → UZ"),
  },
  {
    x: 93,
    y: 62,
    mx: 93,
    my: 65,
    w: 112,
    d: 1.3,
    caption: "MrBeast — Grocery Store",
    tile: yt(V.beastGrocery, "EN → RU"),
  },
  {
    x: 7,
    y: 81,
    mx: 28,
    my: 76,
    w: 128,
    d: 1,
    caption: "Marques Brownlee — iPhone Duo",
    tile: yt(V.mkbhdPhone, "EN → HI"),
  },
  {
    x: 21,
    y: 72,
    mx: 0,
    my: 0,
    w: 96,
    d: 0.7,
    wide: true,
    caption: "Client meeting — live",
    tile: { kind: "photo", photo: "callLaptop", badge: "LIVE · UZ → EN" },
  },
  {
    x: 34,
    y: 90,
    mx: 72,
    my: 77,
    w: 116,
    d: 1.2,
    caption: "Mark Rober — Car Thieves",
    tile: yt(V.roberThieves, "EN → TR"),
  },
  {
    x: 50,
    y: 93,
    mx: 14,
    my: 90,
    w: 128,
    d: 0.6,
    caption: "MrBeast — I Built A City",
    tile: yt(V.beastCity, "EN → UZ", "Men shahar qurdim"),
  },
  {
    x: 65,
    y: 87,
    mx: 50,
    my: 88,
    w: 112,
    d: 1.1,
    caption: "Google — Accessibility",
    tile: yt(V.googleAccess, "EN → AZ"),
  },
  {
    x: 79,
    y: 77,
    mx: 0,
    my: 0,
    w: 100,
    d: 0.9,
    wide: true,
    caption: "Dude Perfect — Overtime 52",
    tile: yt(V.dudeOvertime, "EN → PT"),
  },
  {
    x: 92,
    y: 83,
    mx: 86,
    my: 92,
    w: 122,
    d: 0.8,
    caption: "Veritasium — Einstein",
    tile: yt(V.veritasiumEinstein, "EN → KO"),
  },
];

function HeroCard({
  card,
  index,
  progress,
  mx,
  my,
}: {
  card: Placed;
  index: number;
  progress: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Scrolling pushes every card out along its own ray from the centre and lets
  // it go soft, so the page "opens" into the next scene.
  const dx = (card.x - 50) / 50;
  const dy = (card.y - 50) / 50;
  const sx = useTransform(progress, [0, 1], [0, dx * 320]);
  const sy = useTransform(progress, [0, 1], [0, dy * 260]);
  const opacity = useTransform(progress, [0, 0.25, 0.9], [1, 1, 0]);
  const scale = useTransform(progress, [0, 1], [1, 0.82]);
  const filter = useTransform(progress, [0.2, 1], ["blur(0px)", "blur(6px)"]);
  const px = useTransform(mx, (v) => v * card.d * 16);
  const py = useTransform(my, (v) => v * card.d * 12);

  return (
    <div
      className={`absolute left-[var(--mx)] top-[var(--my)] -translate-x-1/2 -translate-y-1/2 md:left-[var(--x)] md:top-[var(--y)] ${card.wide ? "hidden md:block" : ""}`}
      style={{
        ["--x" as string]: `${card.x}%`,
        ["--y" as string]: `${card.y}%`,
        ["--mx" as string]: `${card.mx}%`,
        ["--my" as string]: `${card.my}%`,
        width: `calc(${card.w}px * var(--ts))`,
        fontSize: `calc(${card.w}px * var(--ts) * 0.15)`,
      }}
    >
      <motion.div style={{ x: sx, y: sy, opacity, scale, filter }}>
        <motion.div style={{ x: px, y: py }}>
          <motion.figure
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 + index * 0.035, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* The idle bob lives on its own layer: a CSS animation and a
                motion transform on one element would overwrite each other. */}
            <div
              className="animate-float"
              style={
                {
                  "--float-distance": `${-4 - (index % 4) * 2}px`,
                  "--float-duration": `${6 + (index % 5)}s`,
                  "--float-delay": `${-(index % 7)}s`,
                } as React.CSSProperties
              }
            >
              <div className="shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]">
                <TileView
                  tile={card.tile}
                  sizes="(max-width: 768px) 96px, 160px"
                  priority={index < 8}
                />
              </div>
              <figcaption className="mt-1.5 hidden text-center text-[10px] leading-tight text-white/45 sm:block">
                {card.caption}
              </figcaption>
            </div>
          </motion.figure>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.45], [0, -36]);

  return (
    <section ref={ref} id="top" className="relative h-[170svh]">
      <div className="sticky top-0 h-svh overflow-hidden [--ts:0.76] sm:[--ts:0.82] lg:[--ts:1]">
        <div aria-hidden="true" className="absolute inset-0">
          {CARDS.map((c, i) => (
            <HeroCard
              key={c.caption}
              card={c}
              index={i}
              progress={scrollYProgress}
              mx={mx}
              my={my}
            />
          ))}
        </div>

        {/* A pool of black behind the title so the cards never fight it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[min(760px,92%)] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(closest-side, #000 55%, transparent)" }}
        />

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="z-content absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.6rem,11vw,7.5rem)] leading-[0.95] text-white"
            style={{ fontWeight: 300 }}
          >
            TH-Labs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-[clamp(1.05rem,2vw,1.3rem)] text-white/85"
          >
            Speak once. Be heard in every language.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 max-w-sm text-[14px] text-white/45"
          >
            AI dubbing for videos, classes and live calls — in your own voice, in 42+ languages.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <StartButton />
          </motion.div>
          <motion.a
            href="#gather"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex flex-col items-center gap-2 text-[11px] text-white/35 outline-none hover:text-white/60 focus-visible:text-white/70"
          >
            <span className="flex h-6 w-4 justify-center rounded-full border border-white/30 pt-1">
              <span className="animate-scroll-dot block h-1.5 w-[2px] rounded-full bg-white/60" />
            </span>
            Scroll to explore
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
