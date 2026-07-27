import BlurText from "@/components/reactbits/BlurText/BlurText";

export default function MissionSection() {
  return (
    <section id="mission" className="mx-auto w-full max-w-4xl px-6 py-24 sm:py-32">
      <BlurText
        text="Our mission is to break language barriers by enabling people, businesses, educators, and creators to communicate with the world in their own voice. Knowledge, ideas, and creativity should never be limited by language."
        animateBy="words"
        direction="top"
        delay={25}
        stepDuration={0.25}
        className="justify-center text-center text-xl leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed"
      />
    </section>
  );
}
