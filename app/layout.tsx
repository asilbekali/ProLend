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
  metadataBase: new URL("https://th-labs.ai"),
  title: {
    default: "TH-LABS — AI dubbing for natural multilingual voice",
    template: "%s — TH-LABS",
  },
  description:
    "TH-LABS is an AI dubbing system for natural multilingual voice conversion. Upload video, audio, or a live stream and get voice-cloned, lip-synced output in 40+ languages — in real time.",
  keywords: [
    "AI dubbing",
    "voice cloning",
    "multilingual",
    "lip sync",
    "live translation",
    "real-time dubbing",
  ],
  openGraph: {
    title: "TH-LABS — AI dubbing for natural multilingual voice",
    description:
      "Voice-cloned, lip-synced dubbing in 40+ languages. Real time on live streams, ~2s delay.",
    url: "https://th-labs.ai",
    siteName: "TH-LABS",
    type: "website",
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
