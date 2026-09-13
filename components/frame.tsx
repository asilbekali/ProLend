import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/** Shared content measure — every readable column lines up on this. */
export const MEASURE = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12";

/**
 * A full-bleed page section.
 *
 * Backgrounds — the hero mesh, tinted product grids, the purple API band, the
 * hatch dividers — always run edge to edge, corner to corner, at every viewport
 * width. There are no side gutters and no vertical rules: the page never leaves
 * white margins on the left or right.
 *
 * Readable content is kept off the screen edge by <Inner>, which applies the
 * shared measure and responsive padding. `bleed` opts a section out of that
 * wrapper so it can paint (and lay out) all the way across itself.
 */
export default function Frame({
  as: Tag = "div",
  children,
  className = "",
  bleed = false,
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">) {
  return (
    <Tag className={`w-full ${className}`} {...rest}>
      {bleed ? children : <div className={MEASURE}>{children}</div>}
    </Tag>
  );
}

/**
 * The centered measure, for use inside a `bleed` section whose background must
 * reach the edges but whose text must not.
 */
export function Inner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${MEASURE} ${className}`}>{children}</div>;
}

/**
 * The ruled band that separates major sections — a full-width run of vertical
 * hairlines, closed top and bottom. Purely decorative breathing room.
 */
export function HatchBand({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`field-hatch w-full border-y border-line h-16 md:h-24 ${className}`}
    />
  );
}

/** A single hairline all the way across the page. */
export function Rule() {
  return <div aria-hidden="true" className="h-px w-full bg-line" />;
}
