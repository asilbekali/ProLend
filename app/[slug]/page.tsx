import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Frame from "@/components/frame";
import LogoMark from "@/components/logo-mark";
import Wordmark from "@/components/wordmark";
import {
  HOME_LANGUAGES,
  SEO_PAGES,
  SEO_PAGE_BY_SLUG,
  type SeoLocale,
} from "@/lib/seo-pages";

const SITE = "https://th-labs.uz";

// Only the slugs in lib/seo-pages exist; anything else under /[slug] is a 404
// rather than a thin page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_PAGES.map((p) => ({ slug: p.slug }));
}

const OG_LOCALE: Record<SeoLocale, string> = {
  en: "en_US",
  ru: "ru_RU",
  uz: "uz_UZ",
};

const HOME_LABEL: Record<SeoLocale, string> = {
  en: "Home",
  ru: "Главная",
  uz: "Bosh sahifa",
};

const RELATED_LABEL: Record<SeoLocale, string> = {
  en: "More from TH-Labs",
  ru: "Ещё о TH-Labs",
  uz: "TH-Labs haqida yana",
};

const FAQ_LABEL: Record<SeoLocale, string> = {
  en: "Frequently asked questions",
  ru: "Частые вопросы",
  uz: "Ko'p beriladigan savollar",
};

// /ru and /uz are the language versions of the home page, so they share its
// hreflang set. The English topic pages stand alone.
function isHomeTranslation(slug: string) {
  return slug === "ru" || slug === "uz";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = SEO_PAGE_BY_SLUG.get(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/${page.slug}`,
      ...(isHomeTranslation(page.slug) ? { languages: HOME_LANGUAGES } : {}),
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${SITE}/${page.slug}`,
      siteName: "TH-Labs",
      type: "website",
      locale: OG_LOCALE[page.locale],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function SeoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SEO_PAGE_BY_SLUG.get(slug);
  if (!page) notFound();

  const url = `${SITE}/${page.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: page.locale,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#software` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "TH-Labs", item: SITE },
          { "@type": "ListItem", position: 2, name: page.h1, item: url },
        ],
      },
      {
        "@type": "HowTo",
        name: page.steps.h2,
        inLanguage: page.locale,
        step: page.steps.items.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: page.locale,
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const related = SEO_PAGES.filter((p) => p.slug !== page.slug);

  return (
    // <html lang> is set once in the root layout; this marks the content's
    // own language for the ru/uz versions.
    <main lang={page.locale} className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Frame as="header" className="border-b border-line">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-text">
            <LogoMark className="h-6 w-6 shrink-0" />
            <Wordmark className="text-[18px]" />
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            {page.cta}
          </Link>
        </nav>
      </Frame>

      <Frame as="article" className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-text-3">
            <Link href="/" className="hover:text-text">
              {HOME_LABEL[page.locale]}
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{page.h1}</span>
          </nav>

          <h1 className="mt-6 text-balance text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] text-text">
            {page.h1}
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-text-2">
            {page.lead}
          </p>

          {page.sections.map((s) => (
            <section key={s.h2} className="mt-14">
              <h2 className="text-2xl font-medium text-text sm:text-3xl">{s.h2}</h2>
              {s.body.map((para) => (
                <p key={para} className="mt-4 text-[16px] leading-relaxed text-text-2">
                  {para}
                </p>
              ))}
            </section>
          ))}

          <section className="mt-14">
            <h2 className="text-2xl font-medium text-text sm:text-3xl">{page.steps.h2}</h2>
            <ol className="mt-6 flex flex-col gap-3">
              {page.steps.items.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-4 rounded-xl border border-line p-4 text-[15px] leading-relaxed text-text-2"
                >
                  <span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-medium text-text sm:text-3xl">{FAQ_LABEL[page.locale]}</h2>
            <dl className="mt-6">
              {page.faqs.map((f) => (
                <div key={f.q} className="border-b border-line py-5 first:border-t">
                  <dt className="font-display text-base font-medium text-text sm:text-lg">{f.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-text-2">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-14">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-strong"
            >
              {page.cta}
            </Link>
          </div>
        </div>
      </Frame>

      <Frame as="footer" className="border-t border-line py-10">
        <nav aria-label={RELATED_LABEL[page.locale]} className="mx-auto max-w-3xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-3">
            {RELATED_LABEL[page.locale]}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/" className="text-text-2 hover:text-text">
                TH-Labs
              </Link>
            </li>
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} hrefLang={p.locale} className="text-text-2 hover:text-text">
                  {p.h1}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-text-3">© 2026 TH-Labs</p>
        </nav>
      </Frame>
    </main>
  );
}
