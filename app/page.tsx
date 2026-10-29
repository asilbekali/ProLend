import TopNav from "@/components/landing/top-nav";
import Hero from "@/components/landing/hero";
import GatherScene from "@/components/landing/gather-scene";
import InspectScene from "@/components/landing/inspect-scene";
import Clusters from "@/components/landing/clusters";
import StudioScene from "@/components/landing/studio-scene";
import LiveScene from "@/components/landing/live-scene";
import Pricing from "@/components/landing/pricing";
import Languages from "@/components/landing/languages";
import Faq from "@/components/faq";
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
        "https://www.youtube.com/@th_labs_i",
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
      name: "AI Video Dubbing & Real-Time Translation in 42+ Languages",
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
        "AI dubbing system for natural multilingual voice conversion. Upload video, audio, or a live stream and get voice-cloned, lip-synced output in 42+ languages — in real time.",
      featureList: [
        "AI video dubbing in 42+ languages",
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
    // The landing page is always the dark editorial canvas, whatever theme the
    // visitor picked elsewhere — see the `.mare` scope in globals.css.
    <main data-theme="dark" className="mare flex flex-1 flex-col overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Renders nothing unless the Studio sent the user back with ?studio=1. */}
      <StudioResume />
      <TopNav />
      <Hero />
      <GatherScene />
      <InspectScene />
      <Clusters />
      <StudioScene />
      <LiveScene />
      <Languages />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  );
}
