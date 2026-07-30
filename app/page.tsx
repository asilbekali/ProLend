import Hero from "@/components/Hero";
import LogoStrip from "@/components/logo-strip";
import HowItWorks from "@/components/how-it-works";
import AboutProject from "@/components/about-project";
import FeaturesBento from "@/components/features-bento";
import LanguageMarquee from "@/components/language-marquee";
import UseCasesStack from "@/components/use-cases-stack";
import Faq from "@/components/faq";
import CtaBand from "@/components/cta-band";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <LogoStrip />
      <HowItWorks />
      <AboutProject />
      <FeaturesBento />
      <LanguageMarquee />
      <UseCasesStack />
      <Faq />
      <CtaBand />
      <Footer />
    </main>
  );
}
