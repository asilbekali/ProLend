import { ArrowUp, Link2 } from "lucide-react";
import { SOCIAL_LINKS, isExternal } from "./social-icons";
import LogoMark from "./logo-mark";
import { StartButton } from "./landing/primitives";
import { CONTACT } from "./landing/contact";
import { PHOTOS } from "./landing/media";
import { SEO_PAGES } from "@/lib/seo-pages";

// Crawlable links to the search landing pages (lib/seo-pages). Without a link
// from the home page, search engines treat those pages as orphans.
const SOLUTIONS = SEO_PAGES.map((p) => ({ label: p.h1, href: `/${p.slug}`, lang: p.locale }));

const TICKER = [
  "O'zbek",
  "English",
  "Русский",
  "Türkçe",
  "Қазақша",
  "Azərbaycanca",
  "Кыргызча",
  "Türkmençe",
  "Español",
  "Français",
  "Deutsch",
  "Português",
  "العربية",
  "हिन्दी",
  "中文",
  "日本語",
  "한국어",
  "Italiano",
];

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Live dubbing", href: "#live" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Who it's for",
    links: [
      { label: "Creators & bloggers", href: "#audiences" },
      { label: "Filmmakers & studios", href: "#audiences" },
      { label: "Podcasters & streamers", href: "#audiences" },
      { label: "Brands & agencies", href: "#audiences" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: `Telegram ${CONTACT.telegramHandle}`, href: CONTACT.telegram },
      { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { label: "YouTube", href: "https://www.youtube.com/@th_labs_i" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/thlabsio/" },
    ],
  },
];

/** The closing prompt, the link columns, and the wordmark across the bottom. */
export default function Footer() {
  return (
    <>
      <section id="community" className="relative px-4 py-24 text-center sm:px-6 sm:py-32">
        <h2 className="mx-auto max-w-2xl text-[clamp(2.2rem,5.4vw,4rem)] leading-[1.02] text-white">
          One upload,
          <br />
          every language.
        </h2>
        <p className="mt-4 text-[14px] text-white/50">
          Don&rsquo;t take our word for it. Paste a link and hear it in your own voice.
        </p>
        <div className="panel mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl p-2 pl-4 text-left">
          <Link2 className="h-4 w-4 shrink-0 text-white/40" />
          <span className="min-w-0 flex-1 truncate text-[14px] text-white/40">
            Paste a YouTube, Vimeo or direct video link…
          </span>
          <StartButton tone="orange" size="sm" className="!w-9 !px-0" label="Start dubbing">
            <ArrowUp className="h-4 w-4" />
          </StartButton>
        </div>
      </section>

      <footer className="relative overflow-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 text-center md:grid-cols-[1fr_2fr] md:text-left">
            <div>
              <a href="#top" className="inline-flex items-center gap-2 text-white">
                <LogoMark className="h-6 w-6" />
                <span className="text-lg font-semibold tracking-[-0.02em]">TH-Labs</span>
              </a>
              <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-white/45 md:mx-0">
                AI dubbing for videos and live calls — in your own voice, in 42+ languages.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {COLUMNS.map((c, i) => (
                <nav
                  key={c.heading}
                  aria-label={c.heading}
                  // An odd column out spans the row on phones, so it centres too.
                  className={i === COLUMNS.length - 1 ? "col-span-2 sm:col-span-1" : ""}
                >
                  <h2 className="text-[13px] font-medium text-white">{c.heading}</h2>
                  <ul className="mt-3 flex flex-col gap-2">
                    {c.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          {...(isExternal(l.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                          className="text-[13px] text-white/50 hover:text-white"
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

          <nav aria-label="Solutions" className="mt-10 border-t border-white/[0.08] pt-6">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] md:justify-start">
              {SOLUTIONS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} hrefLang={l.lang} className="text-white/40 hover:text-white/80">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-white/[0.08] pt-6 md:justify-end">
            <ul className="flex items-center gap-1">
              <li className="mr-1 text-[12px] font-medium text-white">Socials:</li>
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 hover:text-white"
                  >
                    <s.Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The wordmark, edge to edge */}
        <div
          aria-hidden="true"
          className="mx-auto mt-10 flex max-w-[1400px] items-center justify-center gap-[3vw] text-white"
        >
          <LogoMark className="h-[14vw] max-h-[190px] w-[14vw] max-w-[190px]" />
          <span className="text-[min(19vw,260px)] font-semibold leading-none tracking-[-0.06em]">
            TH-Labs
          </span>
        </div>

        <div className="mx-auto mt-8 flex max-w-[1180px] flex-col gap-2 text-center text-[11px] leading-relaxed text-white/30 sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 TH-Labs · th-labs.uz</p>
          <p className="sm:max-w-[60%] sm:text-right">
            Photos:{" "}
            {Object.values(PHOTOS).map((p, i) => (
              <span key={p.src}>
                {i ? " · " : ""}
                <a href={p.href} target="_blank" rel="noreferrer" className="hover:text-white/70">
                  {p.credit}
                </a>
              </span>
            ))}
          </p>
        </div>

        {/* Languages running along the very bottom, where the reference runs
            its customer logos. */}
        <div className="mx-auto mt-6 max-w-[1180px] overflow-hidden border-t border-white/[0.06] pt-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <ul className="animate-marquee-x flex w-max gap-10 text-[15px] font-medium text-white/30">
            {[...TICKER, ...TICKER].map((l, i) => (
              <li key={i} aria-hidden={i >= TICKER.length}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
