import {
  Sparkles,
  Users,
  Clapperboard,
  GraduationCap,
  Laptop,
  Briefcase,
  Megaphone,
  PlayCircle,
  CalendarDays,
  Rocket
} from "lucide-react";
import ChromaGrid, { type ChromaItem } from "@/components/reactbits/ChromaGrid/ChromaGrid";
import SectionHeading from "./SectionHeading";

// Cards use the site's dark surface look (surface -> background) with the
// subtle border token, so the section blends with the rest of the page instead
// of standing out in bright purple. The accent shows only on the hover glow
// and the icons.
const CARD_BORDER = "#221f2b";
const CARD_GRADIENT = "linear-gradient(160deg,#15121d,#0a0a0f)";

const AUDIENCES: ChromaItem[] = [
  { title: "Content Creators", icon: <Sparkles className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "YouTubers & Influencers", icon: <Users className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Media & Entertainment Companies", icon: <Clapperboard className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Educational Institutions", icon: <GraduationCap className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Online Learning Platforms", icon: <Laptop className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Businesses & Enterprises", icon: <Briefcase className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Marketing Agencies", icon: <Megaphone className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Streaming Platforms", icon: <PlayCircle className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Event Organizers", icon: <CalendarDays className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT },
  { title: "Developers & Startups", icon: <Rocket className="h-10 w-10" />, borderColor: CARD_BORDER, gradient: CARD_GRADIENT }
];

export default function WhoWeServeSection() {
  return (
    <section id="who-we-serve" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Who we serve" title="Built for every kind of storyteller" />
      <ChromaGrid items={AUDIENCES} radius={280} />
    </section>
  );
}
