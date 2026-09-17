/**
 * The FAQ, shared by the visible accordion (`components/faq.tsx`) and the
 * FAQPage structured data in the root layout.
 *
 * Both must read from this one list. Search engines only honour FAQ markup
 * whose answers are visible verbatim on the page, so a copy that drifts from
 * the rendered accordion is worse than no markup at all.
 */
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Which languages are supported?",
    a: "Over forty today, in both directions, with more added regularly. If you need a specific pair, ask and we'll tell you exactly where it stands.",
  },
  {
    q: "How long does processing take?",
    a: "Pre-recorded files run faster than real time — a ten-minute video is usually ready in a few minutes. Live streams run continuously at about two seconds of delay.",
  },
  {
    q: "What's the latency on a live stream?",
    a: "Roughly two seconds end to end, from spoken source to dubbed output, so a live audience stays in step with what's happening in the room.",
  },
  {
    q: "What do you need to clone a voice?",
    a: "About three seconds of clean reference audio. More helps, but the system is built to work from very little, and the clone stays consistent across every line.",
  },
  {
    q: "How is pricing structured?",
    a: "Usage-based, billed by minutes processed, with a free tier to try it. Community members get early-access pricing when we open up.",
  },
  {
    q: "How is my data handled?",
    a: "Your audio and cloned voices are yours. They are not used to train shared models, and you can delete them at any time.",
  },
];
