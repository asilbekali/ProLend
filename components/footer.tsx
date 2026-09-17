import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  YoutubeIcon,
} from "./social-icons";
import Wordmark from "./wordmark";
import LogoMark from "./logo-mark";
import Frame, { Inner } from "./frame";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Voice cloning", href: "#features" },
      { label: "Lip sync", href: "#features" },
      { label: "Subtitle export", href: "#features" },
      { label: "Live dubbing", href: "#live" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "API access", href: "#api" },
      { label: "Documentation", href: "#api" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "About the project", href: "#about" },
      { label: "Languages", href: "#languages" },
      { label: "Use cases", href: "#use-cases" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Join the community", href: "#community" },
      { label: "Instagram", href: "https://instagram.com/th_labs.io" },
      { label: "Telegram", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Contact", href: "#community" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/th_labs.io", icon: <InstagramIcon /> },
  { label: "Telegram", href: "#", icon: <TelegramIcon /> },
  { label: "GitHub", href: "#", icon: <GithubIcon /> },
  { label: "LinkedIn", href: "#", icon: <LinkedinIcon /> },
  { label: "YouTube", href: "#", icon: <YoutubeIcon /> },
];

export default function Footer() {
  return (
    <Frame as="footer" bleed>
      <Inner>
        <div className="flex flex-col gap-12 py-14 md:flex-row md:justify-between md:gap-16 md:py-16">
          {/* Brand */}
          <div className="flex max-w-xs flex-col gap-4">
            <span className="flex items-center gap-2.5 text-text">
              <LogoMark className="h-6 w-6 shrink-0" />
              <Wordmark className="text-[13px]" />
            </span>
            <p className="text-sm leading-relaxed text-text-2">
              One recording, every language your audience speaks — voice-cloned,
              lip-synced, in real time.
            </p>
            <ul className="mt-1 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-text-2 outline-none transition-colors hover:border-line-strong hover:text-text focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns — 2-up on mobile, 4-up from sm */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 md:gap-12">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading} className="flex flex-col">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-3">
                  {col.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="inline-flex min-h-9 items-center text-sm text-text-2 outline-none transition-colors hover:text-text focus-visible:text-text focus-visible:ring-2 focus-visible:ring-accent/40"
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

        <div className="flex flex-col gap-3 border-t border-line py-6 text-xs text-text-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-tint-green-fg" />
            </span>
            All services are online
          </span>
          <span>© 2026 TH-Labs. Natural multilingual voice conversion.</span>
        </div>
      </Inner>
    </Frame>
  );
}
