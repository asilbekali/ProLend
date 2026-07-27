import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import ClickSpark from "@/components/reactbits/ClickSpark/ClickSpark";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "TH-LABS — AI dubbing system for natural multilingual voice conversion",
  description:
    "TH-LABS is an AI dubbing system enabling natural multilingual voice conversion for creators, businesses, and educators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ClickSpark
            sparkColor="#8b5cf6"
            sparkSize={10}
            sparkRadius={18}
            sparkCount={8}
            duration={420}
          >
            {children}
          </ClickSpark>
        </QueryProvider>
      </body>
    </html>
  );
}
