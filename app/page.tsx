import Hero from "@/components/Hero";
import LogoStrip from "@/components/logo-strip";
import ProblemRows from "@/components/problem-rows";
import HowItWorks from "@/components/how-it-works";
import FeaturesBento from "@/components/features-bento";
import ApiBand from "@/components/api-band";
import AboutProject from "@/components/about-project";
import LanguageMarquee from "@/components/language-marquee";
import UseCasesStack from "@/components/use-cases-stack";
import Faq from "@/components/faq";
import CtaBand from "@/components/cta-band";
import Footer from "@/components/footer";
import StudioResume from "@/components/studio-resume";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Renders nothing unless the Studio sent the user back with ?studio=1. */}
      <StudioResume />
      <Hero />
      <LogoStrip />
      <ProblemRows />
      <HowItWorks />
      <FeaturesBento />
      <ApiBand />
      <AboutProject />
      <LanguageMarquee />
      <UseCasesStack />
      <Faq />
      <CtaBand />
      <Footer />
    </main>
  );
}
