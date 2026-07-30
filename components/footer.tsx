import Wordmark from "./wordmark";
import Dither from "./dither";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Languages", href: "#languages" },
      { label: "Use cases", href: "#use-cases" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "FAQ", href: "#faq" },
      { label: "Waitlist", href: "#waitlist" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "#features" },
      { label: "API", href: "#features" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Social",
    links: [
      { label: "X / Twitter", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08]">
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-16">
          {/* Brand */}
          <div className="flex max-w-xs flex-col gap-4">
            <Wordmark className="text-[11px] text-white" />
            <p className="font-sans text-sm leading-relaxed text-white/50">
              One recording, every language your audience speaks — voice-cloned, lip-synced, in real time.
            </p>
          </div>

          {/* Link columns — 2-up on mobile, 4-up from sm */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 md:gap-12">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading} className="flex flex-col">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  {col.heading}
                </h2>
                <ul className="mt-4 flex flex-col">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="inline-flex min-h-11 items-center font-mono text-sm text-white/60 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/[0.08] pt-6 font-mono text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TH-LABS. All rights reserved.</span>
          <span>Natural multilingual voice conversion.</span>
        </div>
      </div>

      {/* Bottom dither strip */}
      <div className="relative h-10">
        <Dither edge="bottom" className="text-white/[0.1]" />
      </div>
    </footer>
  );
}
