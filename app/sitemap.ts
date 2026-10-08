import type { MetadataRoute } from "next";
import { HOME_LANGUAGES, SEO_PAGES } from "@/lib/seo-pages";

const SITE_URL = "https://th-labs.uz";

const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

// Home and its language versions carry the same hreflang set, so each one in
// the sitemap lists all three — that is the form Google and Yandex both read.
const homeAlternates = {
  languages: Object.fromEntries(
    Object.entries(HOME_LANGUAGES).map(([lang, path]) => [lang, abs(path)]),
  ),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: homeAlternates,
    },
    ...SEO_PAGES.map((p) => {
      const isHomeTranslation = p.slug === "ru" || p.slug === "uz";
      return {
        url: abs(`/${p.slug}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: isHomeTranslation ? 0.9 : 0.8,
        ...(isHomeTranslation ? { alternates: homeAlternates } : {}),
      };
    }),
  ];
}
