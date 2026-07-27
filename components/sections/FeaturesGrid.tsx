import OptionWheel from "@/components/reactbits/OptionWheel/OptionWheel";
import SectionHeading from "./SectionHeading";

const FEATURES = [
  "AI Video Dubbing",
  "AI Voice Cloning",
  "AI Lip Synchronization",
  "Real-Time Live Stream Translation",
  "AI-Powered Multilingual Subtitles",
  "Audio & Podcast Translation",
  "Developer API",
  "Enterprise Localization Solutions",
  "Cloud-Based Processing",
  "Multi-Language Content Generation"
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Core features" title="Everything dubbing needs, in one platform" />
      <div className="flex justify-center">
        <div className="relative h-[460px] w-full max-w-4xl sm:h-[520px]">
          <OptionWheel
            items={FEATURES}
            defaultSelected={0}
            side="left"
            fontSize={1.4}
            spacing={1.6}
            inset={40}
            textColor="#6b6b76"
            activeColor="#ffffff"
          />
        </div>
      </div>
    </section>
  );
}
