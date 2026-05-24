import { getDb } from "./mongodb";

export type SiteMediaSection =
  | "hero"
  | "before_after"
  | "achievements"
  | "about"
  | "celebrity_news"
  | "gallery";

export type PublicMediaItem = {
  id: string;
  title: string;
  alt: string;
  section: SiteMediaSection;
  url: string;
  width?: number;
  height?: number;
  order: number;
};

export type PublicSection = {
  key: string;
  title: string;
  subtitle: string;
  body: string;
  isPublished: boolean;
  order: number;
};

export type SiteContent = {
  media: Record<SiteMediaSection, PublicMediaItem[]>;
  sections: Record<string, PublicSection>;
};

export const MEDIA_SECTIONS: SiteMediaSection[] = [
  "hero",
  "before_after",
  "achievements",
  "about",
  "celebrity_news",
  "gallery",
];

const fallbackMedia: Record<SiteMediaSection, PublicMediaItem[]> = {
  hero: [],
  before_after: [
    // {
    //   id: "fallback-before-after-1",
    //   title: "Transformation Story",
    //   alt: "Before and after transformation result",
    //   section: "before_after",
    //   url: "/assets/Shikha-Aggarwal-sharma/Before%20after/IMG_4088.JPG",
    //   order: 1,
    // },
    // {
    //   id: "fallback-before-after-2",
    //   title: "Client Progress",
    //   alt: "Client before and after progress",
    //   section: "before_after",
    //   url: "/assets/Shikha-Aggarwal-sharma/Before%20after/IMG_4090.JPG",
    //   order: 2,
    // },
    // {
    //   id: "fallback-before-after-3",
    //   title: "Weight Loss Journey",
    //   alt: "Weight loss before and after journey",
    //   section: "before_after",
    //   url: "/assets/Shikha-Aggarwal-sharma/Before%20after/IMG_4095.JPG",
    //   order: 3,
    // },
  ],
  achievements: [
    // {
    //   id: "fallback-achievement-1",
    //   title: "National Recognition",
    //   alt: "Shikha Aggarwal Sharma media recognition",
    //   section: "achievements",
    //   url: "/assets/Shikha-Aggarwal-sharma/Celebrity,%20News%20etc/IMG_4079.JPG",
    //   order: 1,
    // },
    // {
    //   id: "fallback-achievement-2",
    //   title: "Featured Moment",
    //   alt: "Shikha Aggarwal Sharma public feature",
    //   section: "achievements",
    //   url: "/assets/Shikha-Aggarwal-sharma/Celebrity,%20News%20etc/IMG_4081.JPG",
    //   order: 2,
    // },
  ],
  about: [
    {
      id: "fallback-about-1",
      title: "Shikha Aggarwal Sharma",
      alt: "Shikha Aggarwal Sharma",
      section: "about",
      url: "/assets/shikha.png",
      order: 1,
    },
  ],
  celebrity_news: [
    {
      id: "fallback-news-1",
      title: "Celebrity and News Feature",
      alt: "Celebrity and news feature",
      section: "celebrity_news",
      url: "/assets/Shikha-Aggarwal-sharma/Celebrity,%20News%20etc/IMG_4104.JPG",
      order: 1,
    },
    {
      id: "fallback-news-2",
      title: "Media Feature",
      alt: "Media feature",
      section: "celebrity_news",
      url: "/assets/Shikha-Aggarwal-sharma/Celebrity,%20News%20etc/IMG_4125.JPG",
      order: 2,
    },
    {
      id: "fallback-news-3",
      title: "Public Appearance",
      alt: "Public appearance",
      section: "celebrity_news",
      url: "/assets/Shikha-Aggarwal-sharma/Celebrity,%20News%20etc/IMG_4136.JPG",
      order: 3,
    },
  ],
  gallery: [],
};

const fallbackSections: Record<string, PublicSection> = {
  about: {
    key: "about",
    title: "About Shikha Aggarwal Sharma",
    subtitle: "Celebrity nutritionist, founder, and kitchen-spice wellness guide.",
    body: "Shikha helps clients build practical nutrition routines around familiar Indian food, natural spices, and sustainable habits instead of crash dieting or punishing gym rules.",
    isPublished: true,
    order: 1,
  },
  before_after: {
    key: "before_after",
    title: "Real Transformations",
    subtitle: "Before and after stories from clients who followed the plan.",
    body: "A growing collection of visible journeys built on consistency, home-cooked food, and metabolism-focused guidance.",
    isPublished: true,
    order: 2,
  },
  achievements: {
    key: "achievements",
    title: "Achievements",
    subtitle: "Recognition, milestones, and trusted public moments.",
    body: "From national features to thousands of client stories, these moments reflect the trust behind the Fat To Slim movement.",
    isPublished: true,
    order: 3,
  },
  celebrity_news: {
    key: "celebrity_news",
    title: "Celebrity, News and Media",
    subtitle: "Features, appearances, and notable moments.",
    body: "Explore public highlights and media coverage from Shikha's wellness journey.",
    isPublished: true,
    order: 4,
  },
};

export function getFallbackSiteContent(): SiteContent {
  return {
    media: fallbackMedia,
    sections: fallbackSections,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const fallback = getFallbackSiteContent();

  try {
    const db = await getDb();
    const [mediaDocs, sectionDocs] = await Promise.all([
      db
        .collection("media")
        .find({ isActive: true })
        .sort({ section: 1, order: 1, createdAt: -1 })
        .toArray(),
      db.collection("sections").find({ isPublished: true }).toArray(),
    ]);

    const media = { ...fallback.media };

    for (const section of MEDIA_SECTIONS) {
      const items = mediaDocs
        .filter((item) => item.section === section && item.url)
        .map((item) => ({
          id: item._id.toString(),
          title: item.title || "",
          alt: item.alt || item.title || "Shikha Fat To Slim image",
          section,
          url: item.url,
          width: Number(item.width || 0) || undefined,
          height: Number(item.height || 0) || undefined,
          order: Number(item.order || 0),
        }));

      if (items.length > 0) {
        media[section] = items;
      }
    }

    const sections = { ...fallback.sections };

    for (const section of sectionDocs) {
      if (!section.key) {
        continue;
      }

      sections[section.key] = {
        key: section.key,
        title: section.title || fallback.sections[section.key]?.title || "",
        subtitle:
          section.subtitle || fallback.sections[section.key]?.subtitle || "",
        body: section.body || fallback.sections[section.key]?.body || "",
        isPublished: section.isPublished !== false,
        order: Number(section.order || 0),
      };
    }

    return { media, sections };
  } catch {
    return fallback;
  }
}
