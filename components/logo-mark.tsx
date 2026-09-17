/**
 * The TH-Labs mark — a rounded-square body (corner radius 30.91, square only at
 * the bottom right) with three knockouts, all the same 15.4-unit width: two
 * rotated bars at 60° and 30° that meet at a single shared vertex, and the slot
 * cut out of the right edge.
 *
 * Vector, so it stays crisp at any size, and filled with `currentColor` so a
 * single component serves both themes — set the ink with a text colour. The
 * knockouts are holes, not white fill: they show whatever is behind the mark,
 * which is why the path needs `evenodd`.
 *
 * Fixed-ink copies for non-React consumers (schema.org, OG, email) live at
 * `public/logo.svg` and `public/logo.png`; the browser tab icon is
 * `app/icon.svg`. All four are the same path — edit them together.
 */
const PATH =
  // body
  "M30.91 0.11 H69.09 A30.91 30.91 0 0 1 100 31.02 V69.03 H35.88 V84.39 H100 " +
  "V99.89 H30.91 A30.91 30.91 0 0 1 0 68.98 V31.02 A30.91 30.91 0 0 1 30.91 0.11 Z " +
  // knockouts
  "M30.73 19.83 L44.03 27.5 L28.05 55.19 L14.75 47.51 Z " +
  "M69.69 31.24 L77.43 44.63 L35.86 68.64 L28.12 55.24 Z";

type LogoMarkProps = {
  className?: string;
  /**
   * Accessible name. Omit wherever a sibling wordmark or an `aria-label` on the
   * wrapping link already names the brand — then the mark is decorative.
   */
  title?: string;
};

export default function LogoMark({ className = "", title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      fillRule="evenodd"
      className={className}
      {...(title ? { role: "img" } : { "aria-hidden": true })}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATH} />
    </svg>
  );
}
