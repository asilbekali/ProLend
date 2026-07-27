import SpotlightCard from "@/components/reactbits/SpotlightCard/SpotlightCard";

const CARDS = [
  {
    label: "Vision",
    text: "To become the world's leading AI-powered multilingual communication platform, empowering billions of people to share knowledge, tell stories, and grow without language barriers."
  },
  {
    label: "Mission",
    text: "To break language barriers through artificial intelligence by making high-quality translation, dubbing, and voice localization accessible, affordable, and scalable for everyone."
  }
];

export default function VisionMissionSection() {
  return (
    <section id="vision-mission" className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CARDS.map(card => (
          <SpotlightCard
            key={card.label}
            spotlightColor="rgba(139, 92, 246, 0.25)"
            className="!bg-surface !border-border"
          >
            <span className="mb-4 block text-xs uppercase tracking-widest text-accent">{card.label}</span>
            <p className="text-base leading-relaxed text-foreground sm:text-lg">{card.text}</p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
