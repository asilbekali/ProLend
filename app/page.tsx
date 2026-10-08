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
import { FAQS } from "@/lib/faqs";

const SITE = "https://th-labs.uz";

// Structured data, home page only: the FAQPage below mirrors this page's
// accordion, so emitting it from the root layout put it on pages that do not
// show those answers. The graph is what lets a search engine state plainly what
// TH-Labs is, what it does and what it costs, instead of inferring it from
// marketing copy — and it is the one SEO surface where being explicit is free.
// Every claim here is also visible on the page; markup that outruns the
// rendered content is a manual-action risk, not a ranking trick.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "TH-Labs",
      alternateName: ["TH Labs", "thlabs", "th labs", "th-labs"],
      url: SITE,
      logo: `${SITE}/logo.png`,
      description:
        "TH-Labs builds an AI dubbing and video translation system for natural multilingual voice conversion.",
      sameAs: [
        "https://instagram.com/th_labs.io",
        "https://www.linkedin.com/company/thlabsio/",
        "https://t.me/thlabsio",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "TH-Labs",
      alternateName: ["TH Labs", "thlabs", "th labs"],
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: SITE,
      name: "AI Video Dubbing & Real-Time Translation in 40+ Languages",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#software` },
      primaryImageOfPage: `${SITE}/opengraph-image`,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#software`,
      name: "TH-Labs",
      alternateName: ["TH Labs AI Dubbing", "thlabs dubbing"],
      url: SITE,
      applicationCategory: "MultimediaApplication",
      applicationSubCategory: "AI video dubbing and translation",
      operatingSystem: "Web",
      description:
        "AI dubbing system for natural multilingual voice conversion. Upload video, audio, or a live stream and get voice-cloned, lip-synced output in 40+ languages — in real time.",
      featureList: [
        "AI video dubbing in 40+ languages",
        "Voice cloning from about three seconds of reference audio",
        "Lip sync matched to the dubbed track",
        "Real-time live stream dubbing at roughly two seconds of latency",
        "Subtitle and caption export",
        "Multi-speaker detection and separation",
        "API access for programmatic dubbing",
      ],
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      // Mirrors the accordion in `components/faq.tsx` — both read from lib/faqs.
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      isPartOf: { "@id": `${SITE}/#webpage` },
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
