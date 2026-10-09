import type { Metadata, Viewport } from "next";
import { Archivo, Gelasio, Inter, JetBrains_Mono, Outfit } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { THEME_INIT_SCRIPT } from "@/components/theme-toggle";
import ClickSpark from "@/components/reactbits/ClickSpark/ClickSpark";
import SmoothScroll from "@/components/smooth-scroll";
import ParrotMascot from "@/components/parrot-mascot";
import { HOME_LANGUAGES } from "@/lib/seo-pages";
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

// The brand voice: the wordmark and the auth-card titles. A heavy grotesque
// set tight, matching the cut letters on the office signage — the pixel face
// that used to sit here never fit the mark beside it.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Numerals — Georgia's old-style figures. Georgia is a system font, so Gelasio
// (its metric-matched open clone) stands in where it isn't installed.
const gelasio = Gelasio({
  variable: "--font-gelasio",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    // Russian and Uzbek phrasings — Yandex is a large share of search in
    // Uzbekistan. The /ru and /uz pages carry the full sets.
    "ИИ озвучка видео",
    "перевод видео",
    "video tarjima",
    "video dublyaj",
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
    // /ru and /uz are the Russian and Uzbek versions — Yandex and Google use
    // this to serve the right one to searchers in Uzbekistan.
    languages: HOME_LANGUAGES,
  },
  // Ownership tokens for Google Search Console, Yandex Webmaster and Bing
  // Webmaster Tools. Read at build time; an unset variable emits no tag. The
  // Google token is public (it ships in the HTML), so it has a built-in
  // fallback and works without the repository variable.
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      "YE4rPMB_e5HY2-MWumJ6shUp1LIBalSjzEwGx8C2Rvk",
    yandex: process.env.YANDEX_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
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
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} ${archivo.variable} ${gelasio.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <QueryProvider>
          <SmoothScroll>
            <ClickSpark
              sparkColor="#3b82f6"
              sparkSize={9}
              sparkRadius={16}
              sparkCount={6}
              duration={400}
            >
              {children}
            </ClickSpark>
            {/* Mounted at the root, outside the scroller: the mascot is fixed
                to the viewport and has to survive every section it flies past. */}
            <ParrotMascot />
          </SmoothScroll>
        </QueryProvider>
      </body>
    </html>
  );
}
