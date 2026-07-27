import AnimatedList from "@/components/reactbits/AnimatedList/AnimatedList";
import SectionHeading from "./SectionHeading";

const ROADMAP_ITEMS = [
  "Support for 100+ languages",
  "AI Voice Marketplace",
  "Mobile Applications",
  "Browser Extensions",
  "Enterprise Collaboration Tools",
  "Public API for Developers",
  "AI Video Editing Features",
  "Real-Time Meeting Translation",
  "Global Cloud Infrastructure"
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="mx-auto w-full max-w-2xl px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Roadmap" title="What's coming next" />
      <AnimatedList
        items={ROADMAP_ITEMS.map(item => (
          <div key={item} className="flex items-center justify-between gap-3">
            <p className="m-0 text-foreground">{item}</p>
            <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Coming soon
            </span>
          </div>
        ))}
        showGradients={false}
        displayScrollbar={false}
        enableArrowNavigation={false}
        maxHeight="none"
      />
    </section>
  );
}
