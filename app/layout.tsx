import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit, Press_Start_2P } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { THEME_INIT_SCRIPT } from "@/components/theme-toggle";
import ClickSpark from "@/components/reactbits/ClickSpark/ClickSpark";
import SmoothScroll from "@/components/smooth-scroll";
import { FAQS } from "@/lib/faqs";
import "./globals.css";

// Body / long-form prose.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Every heading — the geometric display voice, set tight and near-black.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// Eyebrows, labels, stats, code — the technical-mono voice.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// The wordmark + step numbers only.
const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const SITE = "https://th-labs.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    // Non-brand queries are the ones worth competing for, so the title leads
    // with what people actually type and keeps the brand as the suffix.
    default: "AI Video Dubbing & Real-Time Translation in 40+ Languages — TH-Labs",
    template: "%s — TH-Labs",
  },
  description:
    "Dub and translate video into 40+ languages with cloned voices and matched lip sync. Real-time dubbing for live streams at ~2s latency. TH-Labs (TH Labs) — free tier to start.",
  keywords: [
    // Google has ignored this tag since 2009 — it is kept for Yandex and Bing,
    // which still read it and both matter on a .uz domain. The terms that do
    // the real work live in the title, the H1, the body copy and the JSON-LD.
    // Brand — every spelling people type for us
    "TH-Labs",
    "TH Labs",
    "thlabs",
    "th labs",
    "th-labs",
    "th labs uz",
    "th-labs.uz",
    "th labs ai",
    "th labs dubbing",
    // Product / intent
    "AI dubbing",
    "AI video dubbing",
    "dubbing video",
    "video dubbing",
    "dub video AI",
    "AI voice dubbing",
    "voice cloning",
    "multilingual dubbing",
    "lip sync",
    "AI lip sync",
    "live translation",
    "real-time dubbing",
    "video translation",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "TH-Labs",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "AI Video Dubbing & Real-Time Translation in 40+ Languages",
    description:
      "Voice-cloned, lip-synced dubbing in 40+ languages. Real time on live streams, ~2s delay.",
    url: SITE,
    siteName: "TH-Labs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Dubbing & Real-Time Translation in 40+ Languages",
    description:
      "Voice-cloned, lip-synced dubbing in 40+ languages. Real time on live streams, ~2s delay.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Structured data. The graph is what lets a search engine state plainly what
// TH-Labs is, what it does and what it costs, instead of inferring it from
// marketing copy — and it is the one SEO surface where being explicit is free.
// Every claim here is also visible on the page; markup that outruns the
// rendered content is a manual-action risk, not a ranking trick.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "TH-Labs",
      alternateName: ["TH Labs", "thlabs", "th labs", "th-labs"],
      url: SITE,
      logo: `${SITE}/logo.png`,
      description:
        "TH-Labs builds an AI dubbing and video translation system for natural multilingual voice conversion.",
      sameAs: ["https://instagram.com/th_labs.io"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "TH-Labs",
      alternateName: ["TH Labs", "thlabs", "th labs"],
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: SITE,
      name: "AI Video Dubbing & Real-Time Translation in 40+ Languages",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#software` },
      primaryImageOfPage: `${SITE}/opengraph-image`,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#software`,
      name: "TH-Labs",
      alternateName: ["TH Labs AI Dubbing", "thlabs dubbing"],
      url: SITE,
      applicationCategory: "MultimediaApplication",
      applicationSubCategory: "AI video dubbing and translation",
      operatingSystem: "Web",
      description:
        "AI dubbing system for natural multilingual voice conversion. Upload video, audio, or a live stream and get voice-cloned, lip-synced output in 40+ languages — in real time.",
      featureList: [
        "AI video dubbing in 40+ languages",
        "Voice cloning from about three seconds of reference audio",
        "Lip sync matched to the dubbed track",
        "Real-time live stream dubbing at roughly two seconds of latency",
        "Subtitle and caption export",
        "Multi-speaker detection and separation",
        "API access for programmatic dubbing",
      ],
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      // Mirrors the accordion in `components/faq.tsx` — both read from lib/faqs.
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      isPartOf: { "@id": `${SITE}/#webpage` },
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The theme script stamps data-theme on <html> before hydration, so the
      // server markup intentionally differs here.
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <QueryProvider>
          <SmoothScroll>
            <ClickSpark
              sparkColor="#8b5cf6"
              sparkSize={9}
              sparkRadius={16}
              sparkCount={6}
              duration={400}
            >
              {children}
            </ClickSpark>
          </SmoothScroll>
        </QueryProvider>
      </body>
    </html>
  );
}
