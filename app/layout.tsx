import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import ClickSpark from "@/components/reactbits/ClickSpark/ClickSpark";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

// Body / long-form prose.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Every heading, nav link, button, label, stat — the technical-mono voice.
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

export const metadata: Metadata = {
  metadataBase: new URL("https://th-labs.uz"),
  title: {
    default: "TH-LABS — AI dubbing for natural multilingual voice",
    template: "%s — TH-LABS",
  },
  description:
    "TH-LABS (TH Labs) is an AI dubbing system for natural multilingual voice conversion. Upload video, audio, or a live stream and get voice-cloned, lip-synced dubbing in 40+ languages — in real time.",
  keywords: [
    // Brand — every spelling people type for us
    "TH-LABS",
    "TH LABS",
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
  applicationName: "TH-LABS",
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
    title: "TH-LABS — AI dubbing for natural multilingual voice",
    description:
      "Voice-cloned, lip-synced dubbing in 40+ languages. Real time on live streams, ~2s delay.",
    url: "https://th-labs.uz",
    siteName: "TH-LABS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TH-LABS — AI dubbing for natural multilingual voice",
    description:
      "Voice-cloned, lip-synced dubbing in 40+ languages. Real time on live streams, ~2s delay.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050607",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Structured data lets Google understand what TH-LABS is and can surface it as
// a rich result. Organization + the product as a SoftwareApplication.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://th-labs.uz/#organization",
      name: "TH-LABS",
      alternateName: ["TH Labs", "thlabs", "th labs", "th-labs"],
      url: "https://th-labs.uz",
      logo: "https://th-labs.uz/logo-icon.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://th-labs.uz/#website",
      url: "https://th-labs.uz",
      name: "TH-LABS",
      alternateName: ["TH Labs", "thlabs", "th labs"],
      publisher: { "@id": "https://th-labs.uz/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: "TH-LABS",
      alternateName: ["TH Labs AI Dubbing", "thlabs dubbing"],
      url: "https://th-labs.uz",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      description:
        "AI dubbing system for natural multilingual voice conversion. Upload video, audio, or a live stream and get voice-cloned, lip-synced output in 40+ languages — in real time.",
      publisher: { "@id": "https://th-labs.uz/#organization" },
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} h-full antialiased`}
    >
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
