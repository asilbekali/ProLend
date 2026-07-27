import AnimatedList from "@/components/reactbits/AnimatedList/AnimatedList";
import SectionHeading from "./SectionHeading";

const VALUE_PROPS = [
  "Preserve the speaker's original voice and emotion",
  "Generate multilingual content in minutes, not days",
  "Reduce localization costs with AI automation",
  "Expand content to global audiences effortlessly",
  "Deliver natural, high-quality AI-powered translations",
  "Support creators, businesses, and organizations at any scale"
];

export default function WhyThLabsSection() {
  return (
    <section id="why-th-labs" className="mx-auto w-full max-w-2xl px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Why TH-LABS" title="Built for speed, scale, and authenticity" />
      <AnimatedList
        items={VALUE_PROPS}
        showGradients={false}
        displayScrollbar={false}
        enableArrowNavigation={false}
        maxHeight="none"
      />
    </section>
  );
}
