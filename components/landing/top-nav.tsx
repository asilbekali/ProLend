import LogoMark from "../logo-mark";
import { StartButton } from "./primitives";

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Live", href: "#live" },
  { label: "Pricing", href: "#pricing" },
];

/** A small floating pill, centred over the page — the only chrome there is. */
export default function TopNav() {
  return (
    <header className="z-nav pointer-events-none fixed inset-x-0 top-0 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-0.5 rounded-xl border border-white/10 bg-[#0d0d0d]/85 p-1.5 backdrop-blur-xl"
      >
        <a
          href="#top"
          aria-label="TH-Labs — home"
          className="flex h-8 w-9 items-center justify-center rounded-lg text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <LogoMark className="h-[18px] w-[18px]" />
        </a>
        <ul className="flex items-center">
          {LINKS.map((l, i) => (
            <li key={l.href} className={i === 2 ? "" : "hidden sm:block"}>
              <a
                href={l.href}
                className="inline-flex h-8 items-center rounded-lg px-3 text-[13px] text-white/60 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <StartButton size="sm" className="ml-1">
          Start dubbing
        </StartButton>
      </nav>
    </header>
  );
}
