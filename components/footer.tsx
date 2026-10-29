import { SOCIAL_LINKS, isExternal } from "./social-icons";
import LogoMark from "./logo-mark";
import { StartButton } from "./landing/primitives";
import { SEO_PAGES } from "@/lib/seo-pages";
import { PHOTOS } from "./landing/media";

// Crawlable links to the search landing pages (lib/seo-pages). Without a link
// from the home page, search engines treat those pages as orphans.
const SOLUTIONS = SEO_PAGES.map((p) => ({ label: p.h1, href: `/${p.slug}`, lang: p.locale }));

/** The closing beat — one line, one button — and a quiet footer under it. */
export default function Footer() {
  return (
    <>
      <section
        id="community"
        className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center"
      >
        <h2 className="text-[clamp(2rem,4.4vw,3.1rem)] leading-[1.08] text-white">
          From one voice to every language.
        </h2>
        <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/45">
          Don&rsquo;t record it again. Let TH-Labs carry it.
        </p>
        <StartButton className="mt-8" />
      </section>

      <footer className="border-t border-white/[0.07] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-white">
              <LogoMark className="h-5 w-5" />
              <span className="text-[14px] font-medium">TH-Labs</span>
            </span>
            <ul className="flex items-center gap-1">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    {...(isExternal(s.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <s.Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Solutions">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
              {SOLUTIONS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    hrefLang={l.lang}
                    className="text-white/40 outline-none transition-colors hover:text-white/80 focus-visible:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-2 text-[11px] leading-relaxed text-white/30">
            <p>
              Example videos belong to their creators and are shown only to illustrate dubbing;
              TH-Labs is not affiliated with them.
            </p>
            <p>
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
            <p className="text-[12px]">© 2026 TH-Labs · th-labs.uz</p>
          </div>
        </div>
      </footer>
    </>
  );
}
