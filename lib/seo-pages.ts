/**
 * Search landing pages — one per query family we want to rank for.
 *
 * The home page is one English URL, and a single URL can only rank well for a
 * handful of phrasings in one language. These pages exist so "video
 * translation", "озвучка видео нейросетью" and "videoni tarjima qilish" each
 * have a page whose title, H1 and body are actually about that query, in that
 * language — which is what Google and Yandex rank on, far more than keywords.
 *
 * Rules, same as the FAQ: every claim here must also be true on the home page
 * and in the product. Nothing in this file is invented for search engines.
 */

export type SeoLocale = "en" | "ru" | "uz";

export type SeoPage = {
  slug: string;
  locale: SeoLocale;
  /** <title> — leads with the query, brand goes in the template suffix. */
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  lead: string;
  sections: { h2: string; body: string[] }[];
  steps: { h2: string; items: string[] };
  faqs: { q: string; a: string }[];
  cta: string;
};

const BRAND_KEYWORDS = [
  "TH-Labs",
  "TH Labs",
  "thlabs",
  "th labs",
  "th-labs.uz",
];

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "ai-dubbing",
    locale: "en",
    title: "AI Dubbing — Voice-Cloned Dubbing in 40+ Languages",
    description:
      "AI dubbing that keeps the original speaker's voice. Upload a video and get a natural, lip-synced dub in 40+ languages in minutes. Free tier to start.",
    keywords: [
      ...BRAND_KEYWORDS,
      "AI dubbing",
      "AI dubbing system",
      "AI dubbing software",
      "AI dubbing online",
      "AI voice dubbing",
      "automatic dubbing",
      "dubbing AI",
      "voice cloning dubbing",
    ],
    h1: "AI dubbing that keeps your voice",
    lead: "TH-Labs is an AI dubbing system: upload a video, pick the languages, and get back the same speaker, speaking fluently in each of them — with their own voice and matched lip movement.",
    sections: [
      {
        h2: "What AI dubbing does",
        body: [
          "Traditional dubbing needs a translator, a voice actor per language and a studio session for every update. AI dubbing replaces that chain with one pipeline: speech recognition transcribes the original, machine translation carries the meaning into the target language, and a cloned voice speaks the result in the original speaker's timbre.",
          "The result is a dub that sounds like the person on screen rather than a stranger reading a script — which is the difference between an audience that stays and one that switches off.",
        ],
      },
      {
        h2: "Why TH-Labs",
        body: [
          "Voice cloning from about three seconds of reference audio, kept consistent across every line. Lip sync matched to the dubbed track. Multi-speaker detection, so an interview or a panel keeps each voice distinct. Subtitle and caption export alongside the audio.",
          "Pre-recorded video runs faster than real time — a ten-minute file is usually ready in a few minutes — and live streams can be dubbed continuously at roughly two seconds of delay.",
        ],
      },
      {
        h2: "Who uses AI dubbing",
        body: [
          "Creators taking a YouTube channel into new markets, schools and online courses reaching students in their own language, companies localising product videos and training, and broadcasters running live events for a multilingual audience. Developers can do all of it programmatically through the API.",
        ],
      },
    ],
    steps: {
      h2: "How it works",
      items: [
        "Upload a video or audio file, or connect a live stream.",
        "Choose one or more of 40+ target languages.",
        "TH-Labs transcribes, translates and re-voices it with a clone of the original speaker.",
        "Download the dubbed video, the audio track or the subtitles.",
      ],
    },
    faqs: [
      {
        q: "How many languages does the AI dubbing support?",
        a: "Over forty, in both directions, with more added regularly.",
      },
      {
        q: "Does the dub use my own voice?",
        a: "Yes. The system clones the original speaker from about three seconds of clean reference audio and keeps that voice consistent across the whole video.",
      },
      {
        q: "Is there a free plan?",
        a: "Yes. Pricing is usage-based, billed by minutes processed, with a free tier to try it.",
      },
    ],
    cta: "Try AI dubbing free",
  },
  {
    slug: "video-dubbing",
    locale: "en",
    title: "Video Dubbing Online — Dub Any Video with AI",
    description:
      "Dub video online into 40+ languages. TH-Labs clones the speaker's voice, translates the speech and matches lip sync — no studio, no voice actors.",
    keywords: [
      ...BRAND_KEYWORDS,
      "video dubbing",
      "dubbing video",
      "dub video",
      "dub video online",
      "dub video AI",
      "video dubbing online",
      "YouTube video dubbing",
      "lip sync dubbing",
    ],
    h1: "Dub any video into 40+ languages",
    lead: "Online video dubbing with AI. Upload a file and TH-Labs returns a dubbed version in every language you choose — the speaker's own voice, translated, with lip sync to match.",
    sections: [
      {
        h2: "Video dubbing without a studio",
        body: [
          "Dubbing a video used to mean booking voice actors for every language and re-recording whenever the edit changed. With TH-Labs the whole job runs in the browser: the original speech is transcribed, translated and re-voiced automatically, and the new track is laid back over the picture.",
          "Because the voice is cloned from the original, viewers hear the same person in their own language — not a generic synthetic narrator.",
        ],
      },
      {
        h2: "Built for real footage",
        body: [
          "Interviews, podcasts and panels are handled with multi-speaker detection, so each person keeps their own voice. Lip sync aligns mouth movement to the dubbed audio. Subtitles and captions can be exported in every target language from the same run.",
          "A ten-minute video is usually ready in a few minutes; live streams are dubbed in real time at about two seconds of delay.",
        ],
      },
    ],
    steps: {
      h2: "Dub a video in four steps",
      items: [
        "Upload your video.",
        "Pick the target languages.",
        "Review the transcript and translation if you want to adjust wording.",
        "Download the dubbed video, audio or subtitles.",
      ],
    },
    faqs: [
      {
        q: "How long does it take to dub a video?",
        a: "Pre-recorded files run faster than real time — a ten-minute video is usually ready in a few minutes.",
      },
      {
        q: "Can I dub YouTube videos?",
        a: "Yes. Upload the video file and download the dubbed version or a separate audio track for YouTube's multi-language audio.",
      },
      {
        q: "Can it dub videos with several speakers?",
        a: "Yes. Speakers are detected and separated, and each keeps their own cloned voice.",
      },
    ],
    cta: "Dub a video free",
  },
  {
    slug: "video-translation",
    locale: "en",
    title: "Video Translation with AI — Translate Video to 40+ Languages",
    description:
      "Translate video with AI into 40+ languages: voice-over in the original speaker's voice, lip sync and subtitles. Real-time translation for live streams.",
    keywords: [
      ...BRAND_KEYWORDS,
      "video translation",
      "translate video",
      "AI video translation",
      "video translator",
      "translate video to English",
      "video translation online",
      "live translation",
      "real-time translation",
    ],
    h1: "Translate video into 40+ languages",
    lead: "AI video translation that goes beyond subtitles: TH-Labs translates what is said and speaks it back in the original speaker's voice, with lip sync and captions included.",
    sections: [
      {
        h2: "More than subtitles",
        body: [
          "Subtitles ask the viewer to read instead of watch. A translated voice track lets them simply listen. TH-Labs produces both from one upload: a dubbed audio track in the speaker's cloned voice, and subtitle files in every target language.",
        ],
      },
      {
        h2: "Live and recorded",
        body: [
          "Recorded video is translated faster than real time. Live streams — lectures, conferences, broadcasts — are translated and voiced continuously at about two seconds of delay, so a multilingual audience stays in step with the room.",
          "Developers can translate video programmatically through the TH-Labs API.",
        ],
      },
    ],
    steps: {
      h2: "How video translation works",
      items: [
        "Speech recognition transcribes the original audio.",
        "Machine translation carries the meaning into each target language.",
        "A clone of the speaker's voice reads the translation, timed to the picture.",
        "Lip sync and subtitles are generated from the same run.",
      ],
    },
    faqs: [
      {
        q: "Which languages can I translate a video into?",
        a: "Over forty, in both directions. If you need a specific pair, ask and we'll tell you exactly where it stands.",
      },
      {
        q: "Can I translate a live stream?",
        a: "Yes. Live translation runs continuously at roughly two seconds of end-to-end delay.",
      },
      {
        q: "Do I also get subtitles?",
        a: "Yes. Subtitles and captions are exported for every target language.",
      },
    ],
    cta: "Translate a video free",
  },
  {
    slug: "real-time-translation",
    locale: "en",
    title: "Real-Time Translation for Live Streams — AI Live Dubbing",
    description:
      "Real-time AI translation and dubbing for live streams, webinars and conferences in 40+ languages, at about two seconds of delay, in the speaker's own voice.",
    keywords: [
      ...BRAND_KEYWORDS,
      "real-time translation",
      "live translation",
      "live stream translation",
      "real-time dubbing",
      "live dubbing",
      "AI simultaneous translation",
      "webinar translation",
      "conference translation",
    ],
    h1: "Real-time translation for live streams",
    lead: "TH-Labs translates and re-voices a live stream as it happens — about two seconds behind the speaker, in their own cloned voice, in 40+ languages at once.",
    sections: [
      {
        h2: "Live dubbing, not just live captions",
        body: [
          "Live captions make a multilingual audience read along. TH-Labs gives each viewer an audio track in their own language, spoken in the presenter's voice, so they can simply watch and listen.",
          "The pipeline runs continuously: speech is recognised, translated and voiced in a rolling window, keeping end-to-end delay at roughly two seconds.",
        ],
      },
      {
        h2: "Where it is used",
        body: [
          "Conferences and panels with an international audience, webinars and online lectures, product launches and broadcasts. Several target languages can run from the same stream, and subtitles are produced alongside the audio.",
          "Developers can connect streams programmatically through the TH-Labs API.",
        ],
      },
    ],
    steps: {
      h2: "How live translation works",
      items: [
        "Connect your live stream.",
        "Choose the target languages.",
        "TH-Labs transcribes, translates and voices the speech continuously.",
        "Viewers hear the stream in their language about two seconds behind the original.",
      ],
    },
    faqs: [
      {
        q: "How much delay does live translation add?",
        a: "About two seconds end to end.",
      },
      {
        q: "Can one stream be translated into several languages at once?",
        a: "Yes. Pick as many of the 40+ supported languages as you need.",
      },
      {
        q: "Does the translated voice sound like the speaker?",
        a: "Yes. The speaker's voice is cloned from about three seconds of clean audio and used for every language.",
      },
    ],
    cta: "Try live translation",
  },
  {
    slug: "voice-cloning",
    locale: "en",
    title: "AI Voice Cloning for Dubbing — Your Voice in 40+ Languages",
    description:
      "Clone a voice from about three seconds of audio and use it to dub video into 40+ languages. Consistent, natural AI voice cloning with lip sync, by TH-Labs.",
    keywords: [
      ...BRAND_KEYWORDS,
      "voice cloning",
      "AI voice cloning",
      "clone voice",
      "voice clone AI",
      "multilingual voice cloning",
      "voice cloning for dubbing",
    ],
    h1: "AI voice cloning for multilingual dubbing",
    lead: "TH-Labs clones a speaker's voice from about three seconds of clean audio, then uses it to speak their words in 40+ languages — so the audience hears the same person, not a stranger.",
    sections: [
      {
        h2: "Why the voice matters",
        body: [
          "A voice carries identity. When a dub swaps it for a generic narrator, the audience loses the person they came to watch. Voice cloning keeps the timbre and character of the original speaker in every language.",
        ],
      },
      {
        h2: "Built for dubbing",
        body: [
          "The cloned voice stays consistent across a whole video and across languages. In interviews and panels, each detected speaker gets their own clone. Lip sync matches mouth movement to the new track, and subtitles are exported from the same run.",
        ],
      },
    ],
    steps: {
      h2: "How voice cloning works in TH-Labs",
      items: [
        "Upload a video, or a few seconds of clean reference audio.",
        "TH-Labs builds a clone of each speaker's voice.",
        "The translated script is spoken with that clone in every target language.",
        "Download the dubbed video, audio or subtitles.",
      ],
    },
    faqs: [
      {
        q: "How much audio does voice cloning need?",
        a: "About three seconds of clean reference audio.",
      },
      {
        q: "Does the clone work in other languages?",
        a: "Yes. The same voice speaks in any of the 40+ supported languages.",
      },
    ],
    cta: "Clone your voice free",
  },
  {
    slug: "ru",
    locale: "ru",
    title: "ИИ-озвучка и перевод видео на 40+ языков",
    description:
      "Перевод и озвучка видео нейросетью: голос оригинального спикера, синхронизация губ и субтитры на 40+ языках. Живой перевод трансляций с задержкой ~2 с. Бесплатный тариф.",
    keywords: [
      ...BRAND_KEYWORDS,
      "ТХ Лабс",
      "ИИ озвучка видео",
      "озвучка видео нейросетью",
      "перевод видео",
      "перевод видео с озвучкой",
      "перевести видео на русский",
      "дубляж видео",
      "ИИ дубляж",
      "клонирование голоса",
      "синхронный перевод видео",
      "перевод видео онлайн",
    ],
    h1: "Перевод и озвучка видео с помощью ИИ",
    lead: "TH-Labs — система ИИ-дубляжа: загрузите видео, выберите языки и получите того же спикера, говорящего на каждом из них — его собственным голосом и с синхронизацией губ.",
    sections: [
      {
        h2: "Как работает ИИ-дубляж",
        body: [
          "Распознавание речи расшифровывает оригинал, машинный перевод передаёт смысл на нужный язык, а клонированный голос озвучивает перевод тембром исходного спикера. Зрители слышат того же человека, а не постороннего диктора.",
          "Для клонирования голоса достаточно примерно трёх секунд чистой записи, и голос остаётся одинаковым на протяжении всего видео.",
        ],
      },
      {
        h2: "Возможности",
        body: [
          "Более 40 языков в обоих направлениях, включая русский, узбекский и английский. Синхронизация губ под новую аудиодорожку. Распознавание нескольких спикеров — в интервью и подкастах у каждого остаётся свой голос. Экспорт субтитров на всех языках.",
          "Десятиминутное видео обычно готово за несколько минут. Прямые трансляции переводятся и озвучиваются в реальном времени с задержкой около двух секунд. Для разработчиков доступен API.",
        ],
      },
      {
        h2: "Для кого",
        body: [
          "Блогеры и YouTube-каналы, выходящие на новую аудиторию, онлайн-школы и курсы, компании, локализующие обучающие и продуктовые видео, организаторы конференций и трансляций.",
        ],
      },
    ],
    steps: {
      h2: "Четыре шага",
      items: [
        "Загрузите видео или аудио, либо подключите трансляцию.",
        "Выберите один или несколько из 40+ языков.",
        "TH-Labs расшифрует, переведёт и озвучит его голосом спикера.",
        "Скачайте озвученное видео, аудиодорожку или субтитры.",
      ],
    },
    faqs: [
      {
        q: "Сколько языков поддерживается?",
        a: "Более сорока, в обоих направлениях, и список регулярно пополняется.",
      },
      {
        q: "Озвучка будет моим голосом?",
        a: "Да. Система клонирует голос спикера примерно по трём секундам записи и сохраняет его на протяжении всего видео.",
      },
      {
        q: "Есть ли бесплатный тариф?",
        a: "Да. Оплата — по минутам обработанного видео, а для пробы есть бесплатный тариф.",
      },
    ],
    cta: "Попробовать бесплатно",
  },
  {
    slug: "uz",
    locale: "uz",
    title: "Videoni sun'iy intellekt bilan tarjima qilish va dublyaj",
    description:
      "Videoni 40 dan ortiq tilga sun'iy intellekt yordamida tarjima va dublyaj qiling: asl spiker ovozi, lab harakati sinxronizatsiyasi va subtitrlar. Bepul tarif mavjud.",
    keywords: [
      ...BRAND_KEYWORDS,
      "video tarjima",
      "videoni tarjima qilish",
      "video dublyaj",
      "sun'iy intellekt dublyaj",
      "AI dublyaj",
      "ovozli tarjima",
      "videoni o'zbek tiliga tarjima qilish",
      "ovozni klonlash",
      "o'zbekcha dublyaj",
    ],
    h1: "Videoni sun'iy intellekt bilan tarjima va dublyaj qiling",
    lead: "TH-Labs — sun'iy intellektga asoslangan dublyaj tizimi. Videoni yuklang, tillarni tanlang va o'sha spikerni har bir tilda o'z ovozi bilan, lab harakatlari mos holda gapirayotganini oling.",
    sections: [
      {
        h2: "AI dublyaj qanday ishlaydi",
        body: [
          "Nutqni aniqlash tizimi asl matnni yozib oladi, mashina tarjimasi ma'noni kerakli tilga o'tkazadi, klonlangan ovoz esa tarjimani asl spiker ovozida o'qiydi. Tomoshabin begona diktorni emas, o'sha odamni eshitadi.",
          "Ovozni klonlash uchun taxminan uch soniyalik toza yozuv yetarli va ovoz butun video davomida bir xil qoladi.",
        ],
      },
      {
        h2: "Imkoniyatlar",
        body: [
          "O'zbek, rus va ingliz tillari bilan birga 40 dan ortiq til, ikki yo'nalishda. Yangi audioga mos lab sinxronizatsiyasi. Bir nechta spikerni ajratish — intervyu va podkastlarda har kim o'z ovozida qoladi. Barcha tillarda subtitr eksporti.",
          "O'n daqiqalik video odatda bir necha daqiqada tayyor bo'ladi. Jonli efirlar taxminan ikki soniya kechikish bilan real vaqtda tarjima qilinadi. Dasturchilar uchun API mavjud.",
        ],
      },
      {
        h2: "Kimlar uchun",
        body: [
          "Yangi auditoriyaga chiqayotgan blogerlar va YouTube kanallar, onlayn maktab va kurslar, o'quv va mahsulot videolarini mahalliylashtirayotgan kompaniyalar, konferensiya va jonli efir tashkilotchilari.",
        ],
      },
    ],
    steps: {
      h2: "To'rt qadam",
      items: [
        "Video yoki audio faylni yuklang yoki jonli efirni ulang.",
        "40 dan ortiq tildan bir yoki bir nechtasini tanlang.",
        "TH-Labs uni yozib oladi, tarjima qiladi va spiker ovozida o'qiydi.",
        "Dublyaj qilingan video, audio yoki subtitrlarni yuklab oling.",
      ],
    },
    faqs: [
      {
        q: "Qancha til qo'llab-quvvatlanadi?",
        a: "40 dan ortiq til, ikki yo'nalishda, va ro'yxat muntazam kengaymoqda.",
      },
      {
        q: "Dublyaj mening ovozimda bo'ladimi?",
        a: "Ha. Tizim spiker ovozini taxminan uch soniyalik yozuvdan klonlaydi va butun video davomida saqlaydi.",
      },
      {
        q: "Bepul tarif bormi?",
        a: "Ha. To'lov qayta ishlangan daqiqalar bo'yicha, sinab ko'rish uchun bepul tarif mavjud.",
      },
    ],
    cta: "Bepul sinab ko'ring",
  },
];

export const SEO_PAGE_BY_SLUG = new Map(SEO_PAGES.map((p) => [p.slug, p]));

/**
 * hreflang set for the home page and its translations. The English landing
 * page is the root; /ru and /uz are its language versions.
 */
export const HOME_LANGUAGES = {
  en: "/",
  ru: "/ru",
  uz: "/uz",
  "x-default": "/",
} as const;
