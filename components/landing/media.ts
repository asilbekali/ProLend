/**
 * Real media the landing page shows. Every YouTube id here was checked against
 * YouTube's oEmbed endpoint; thumbnails load from i.ytimg.com (allowed in
 * next.config.ts). The photos are openly licensed and credited in the footer.
 */

export type Video = { id: string; creator: string; title: string };

export const V = {
  beastCops: { id: "Qtl8lJwbd4g", creator: "MrBeast", title: "Escape 100 Cops, Win $500,000" },
  beastMansion: { id: "Af6i6ChAVTw", creator: "MrBeast", title: "Last To Leave Mansion, Keeps It" },
  beastGrocery: {
    id: "plN7JMbadRg",
    creator: "MrBeast",
    title: "Eat Everything In A Grocery Store",
  },
  beastCity: { id: "v9QtM6qnG50", creator: "MrBeast", title: "I Built A City To Save Kids" },
  beastExtreme: {
    id: "gTKS8SAwUzE",
    creator: "MrBeast",
    title: "I Survived The Most Extreme Places",
  },
  beastLbs: { id: "RE3_PGwDwhw", creator: "MrBeast", title: "Lose 150 Lbs Together" },
  roberBoard: { id: "26P1KyvrmjI", creator: "Mark Rober", title: "I Solved Every Board Game" },
  roberCheater: { id: "_L1Rim7-IPo", creator: "Mark Rober", title: "Last Cheater Standing" },
  roberThieves: { id: "h0EGCnBjTVk", creator: "Mark Rober", title: "I Outsmarted Pro Car Thieves" },
  mkbhdLaptop: { id: "2reQut8WNGc", creator: "Marques Brownlee", title: "MacBook Pro Impressions" },
  mkbhdPhone: { id: "ESABTN4VtrA", creator: "Marques Brownlee", title: "iPhone Duo Review" },
  veritasiumEinstein: {
    id: "eyZEqSPeMwg",
    creator: "Veritasium",
    title: "No device could prove Einstein wrong",
  },
  veritasiumFiber: {
    id: "NiCgcUTL9_Q",
    creator: "Veritasium",
    title: "The Insane Engineering of Fiber Optics",
  },
  kurzgesagtHalf: {
    id: "PXbVn-f_wuM",
    creator: "Kurzgesagt",
    title: "You Will Only Like Half of This Video",
  },
  dudeOvertime: {
    id: "4MZHXB6UX-c",
    creator: "Dude Perfect",
    title: "Overtime 52: Pirate Edition",
  },
  dudeRocket: { id: "teW7A5EoP_o", creator: "Dude Perfect", title: "Rocket League in Real Life" },
  cs50Doom: { id: "4t23RAQNrPk", creator: "CS50", title: "The CS50 Show, Episode 1" },
  cs50Binary: { id: "Kka06ZPJnBA", creator: "CS50", title: "50 Seconds on Binary" },
  khanPhysics: {
    id: "cPxnWRp4oPo",
    creator: "Khan Academy",
    title: "Conservation of electric energy",
  },
  tedListen: { id: "Pba4OZjn3cY", creator: "TED", title: "Why It's So Hard to Listen" },
  tedRecipe: { id: "tu6tF-lVDJI", creator: "TED", title: "Share a Recipe with a Stranger" },
  appleEvent: { id: "WzuIZLoHqqA", creator: "Apple", title: "New MacBook Pro" },
  lexMath: { id: "ZAzWPE9CItg", creator: "Lex Fridman", title: "Lex Fridman Podcast #503" },
  lexTaiwan: {
    id: "FGCP2F_7rQk",
    creator: "Lex Fridman",
    title: "Visiting Taiwan w/ Jensen Huang",
  },
  googleAccess: {
    id: "lL7L6DiGeLc",
    creator: "Google",
    title: "What's New in Google Accessibility",
  },
} satisfies Record<string, Video>;

/** 320×180, no letterbox — right for every card on the page. */
export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
/** 1280×720 — only for the one large frame. */
export const thumbLarge = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const PHOTOS = {
  callGallery: {
    src: "/media/call-gallery.jpg",
    alt: "A video call with a gallery of participants",
    credit: "“Zoom conference” by TimBaliandr, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Zoom_conference.jpg",
  },
  callLaptop: {
    src: "/media/call-laptop.jpg",
    alt: "A laptop showing a two-person video call",
    credit: "“Video Conference Using Laptop” by Project Kei, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Video_Conference_Using_Laptop.jpg",
  },
  classVideo: {
    src: "/media/class-video.jpg",
    alt: "A class joining a lecture over video conference",
    credit: "“Videoconference classroom” by Arthur Grigoryan, CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Videoconference_classroom.jpg",
  },
  callCrew: {
    src: "/media/call-crew.jpg",
    alt: "A team gathered around a laptop on a call",
    credit: "Expedition 64 crew around a laptop — NASA, public domain",
    href: "https://commons.wikimedia.org/wiki/File:Expedition_64_crew_members_gather_around_a_laptop_inside_the_Destiny_lab.jpg",
  },
} as const;
export type PhotoKey = keyof typeof PHOTOS;
