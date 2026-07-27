import Hero from "@/components/Hero";
import MissionSection from "@/components/sections/MissionSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import TechStrip from "@/components/sections/TechStrip";
import WhoWeServeSection from "@/components/sections/WhoWeServeSection";
import WhyThLabsSection from "@/components/sections/WhyThLabsSection";
import VisionMissionSection from "@/components/sections/VisionMissionSection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import ClosingCta from "@/components/sections/ClosingCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <MissionSection />
      <HowItWorksSection />
      <FeaturesGrid />
      <TechStrip />
      <WhoWeServeSection />
      <WhyThLabsSection />
      <VisionMissionSection />
      <RoadmapSection />
      <ClosingCta />
      <Footer />
    </div>
  );
}
