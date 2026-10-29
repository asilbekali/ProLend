import Image from "next/image";
import { PHOTOS, thumb, thumbLarge, type PhotoKey, type Video } from "./media";

/**
 * The media cards the landing page is built from: real YouTube videos and
 * photos of real calls and classes, each tagged with the dub it would get.
 * Every tile fills the width of its parent and sets its own aspect ratio;
 * overlay text is sized in `em`, so the parent's font-size scales it.
 */

export type Tile =
  | { kind: "video"; video: Video; badge?: string; line?: string }
  | { kind: "photo"; photo: PhotoKey; badge?: string; line?: string }
  | { kind: "wave"; seed: number; label?: string };

/** Deterministic bar heights (0.18–1), so server and client markup agree. */
export function bars(seed: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const v = Math.abs(Math.sin(i * 1.73 + seed) * Math.cos(i * 0.61 + seed * 2.1));
    return Math.round((0.18 + 0.82 * v) * 100) / 100;
  });
}

export function Waveform({
  seed,
  count = 28,
  className = "",
  barClassName = "bg-white/80",
}: {
  seed: number;
  count?: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-[2px] ${className}`}>
      {bars(seed, count).map((h, i) => (
        <span
          key={i}
          className={`block w-[2px] flex-none rounded-full ${barClassName}`}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}

function Overlay({ badge, line }: { badge?: string; line?: string }) {
  return (
    <>
      {badge ? (
        <span className="absolute left-[5%] top-[7%] rounded-[2px] bg-black/70 px-[0.35em] font-mono text-[0.5em] leading-[1.6] tracking-wide text-white">
          {badge}
        </span>
      ) : null}
      {line ? (
        <span className="absolute bottom-[7%] left-1/2 max-w-[90%] -translate-x-1/2 truncate rounded-[2px] bg-black/75 px-[0.35em] text-[0.55em] leading-[1.6] text-white">
          {line}
        </span>
      ) : null}
    </>
  );
}

function Frame({
  src,
  alt,
  sizes,
  priority,
  badge,
  line,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  badge?: string;
  line?: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[3px] bg-[#151515]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        draggable={false}
      />
      <Overlay badge={badge} line={line} />
    </div>
  );
}

function WaveTile({ seed, label }: { seed: number; label?: string }) {
  return (
    <div className="flex aspect-video w-full flex-col justify-between rounded-[3px] border border-white/10 bg-[#121212] p-[7%]">
      {label ? (
        <span className="font-mono text-[0.45em] uppercase tracking-[0.12em] text-white/45">
          {label}
        </span>
      ) : null}
      <Waveform seed={seed} count={26} className="h-[52%] w-full justify-between" />
    </div>
  );
}

export function TileView({
  tile,
  sizes = "160px",
  priority,
  large,
}: {
  tile: Tile;
  sizes?: string;
  priority?: boolean;
  /** Use the 1280px thumbnail — for cards that render wider than ~320px. */
  large?: boolean;
}) {
  switch (tile.kind) {
    case "video":
      return (
        <Frame
          src={large ? thumbLarge(tile.video.id) : thumb(tile.video.id)}
          alt={`${tile.video.creator} — ${tile.video.title}`}
          sizes={sizes}
          priority={priority}
          badge={tile.badge}
          line={tile.line}
        />
      );
    case "photo": {
      const p = PHOTOS[tile.photo];
      return (
        <Frame
          src={p.src}
          alt={p.alt}
          sizes={sizes}
          priority={priority}
          badge={tile.badge}
          line={tile.line}
        />
      );
    }
    case "wave":
      return <WaveTile seed={tile.seed} label={tile.label} />;
  }
}
