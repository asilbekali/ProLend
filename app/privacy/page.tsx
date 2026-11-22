import type { Metadata } from "next";
import Link from "next/link";
import Frame from "@/components/frame";
import LogoMark from "@/components/logo-mark";
import Wordmark from "@/components/wordmark";
import { CONTACT } from "@/components/landing/contact";

// The Chrome Web Store listing for the real-time dubbing extension points here,
// so every claim below has to match what `TH-Labs-full/extension` actually does
// (permissions in its manifest, data flow in BACKEND_CONTRACT.md). Change the
// extension, change this page.

const UPDATED = "November 22, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How TH-Labs handles your data on th-labs.uz and in the TH-Labs Real-Time Dubbing browser extension.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: { h2: string; body: React.ReactNode[] }[] = [
  {
    h2: "Who we are",
    body: [
      <>
        TH-Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs the AI dubbing service at th-labs.uz and
        publishes the TH-Labs Real-Time Dubbing browser extension. This policy covers both. If you
        have a question about it, write to{" "}
        <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">
          {CONTACT.email}
        </a>
        .
      </>,
    ],
  },
  {
    h2: "What the website collects",
    body: [
      "Account details: when you sign up we store your email address, your name if you give it, and a hash of your password (or your Google account ID if you sign in with Google). We never store your password in readable form.",
      "Content you upload: videos, audio and links you submit for dubbing, and the dubbed results, so we can process them and show them in your Studio.",
      "Plan and usage: your plan, your credit balance and how many dubbing minutes you have used, so we can apply your plan's limits.",
      "Visit counts: an anonymous, random visitor ID kept in your browser's local storage, used only to count how many people are on the site. It is not linked to your account.",
    ],
  },
  {
    h2: "What the browser extension does",
    body: [
      "The extension dubs the audio of the browser tab you turn it on for (for example a web call, a livestream or a video) into the language you choose. It only captures audio while dubbing is on for that tab, and it stops when you turn it off or close the tab. It never uses your microphone and never reads the text or content of web pages.",
      "To translate, the captured tab audio is streamed to Google's Gemini API, which returns the dubbed audio and text transcripts that the extension plays back to you. TH-Labs issues a short-lived, single-use session token for each dubbing session; our servers do not receive or store the audio itself. Google processes that audio under the Gemini API terms and Google's privacy policy.",
      "Our servers record the length of each dubbing session, so we can show the live minutes you have left today and enforce daily limits.",
      "The extension stores your sign-in token, basic account details (email and plan), your chosen language and recently used languages in your browser's extension storage. It does not use analytics or advertising trackers, and it does not log audio or tokens.",
    ],
  },
  {
    h2: "Extension permissions",
    body: [
      "tabCapture and activeTab: to capture the audio of the tab you turn dubbing on for, and only that tab.",
      "offscreen: to process and play the audio in the background while you keep using the tab.",
      "storage: to keep you signed in and remember your language settings.",
      "Access to th-labs.uz: to sign you in and check your plan and remaining minutes.",
    ],
  },
  {
    h2: "How we use your data",
    body: [
      "We use your data only to provide and improve the dubbing service, to run your account and billing, to enforce usage limits, to keep the service secure, and to reply when you contact us. We do not sell your data, and we do not use it for advertising or share it with data brokers.",
    ],
  },
  {
    h2: "Who we share it with",
    body: [
      "We share data only with the service providers we need to run TH-Labs: Google (the Gemini API for real-time translation, and Google sign-in if you use it), our hosting and storage providers, and our payment provider when you buy a plan. Each of them may use the data only to provide their service to us. We may also disclose data if the law requires it.",
    ],
  },
  {
    h2: "How long we keep it",
    body: [
      "We keep your account data and uploaded content for as long as your account is open. When you delete content, or ask us to delete your account, we remove it from our systems, except where we must keep records (such as payments) by law. Real-time dubbing audio is not stored by TH-Labs at all.",
      "Data the extension keeps in your browser stays there until you sign out or uninstall the extension.",
    ],
  },
  {
    h2: "Your choices and rights",
    body: [
      <>
        You can ask us for a copy of your data, ask us to correct it, or ask us to delete your
        account and everything in it by emailing{" "}
        <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">
          {CONTACT.email}
        </a>{" "}
        or writing to us on Telegram at{" "}
        <a href={CONTACT.telegram} className="text-accent hover:underline">
          {CONTACT.telegramHandle}
        </a>
        . You can stop the extension from capturing anything at any time by turning dubbing off or
        removing the extension.
      </>,
    ],
  },
  {
    h2: "Children",
    body: [
      "TH-Labs is not meant for children under 13, and we do not knowingly collect data from them.",
    ],
  },
  {
    h2: "Changes to this policy",
    body: [
      "If we change how we handle data, we will update this page and the date at the top. For significant changes we will also tell signed-in users.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Frame as="header" className="border-b border-line">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-text">
            <LogoMark className="h-6 w-6 shrink-0" />
            <Wordmark className="text-[18px]" />
          </Link>
          <Link href="/" className="text-sm text-text-2 hover:text-text">
            Back to home
          </Link>
        </nav>
      </Frame>

      <Frame as="article" className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] text-text">
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-xs text-text-3">Last updated: {UPDATED}</p>

          {SECTIONS.map((s) => (
            <section key={s.h2} className="mt-12">
              <h2 className="text-2xl font-medium text-text sm:text-3xl">{s.h2}</h2>
              {s.body.map((para, i) => (
                <p key={i} className="mt-4 text-[16px] leading-relaxed text-text-2">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Frame>

      <Frame as="footer" className="border-t border-line py-10">
        <p className="mx-auto max-w-3xl text-xs text-text-3">© 2026 TH-Labs · th-labs.uz</p>
      </Frame>
    </main>
  );
}
