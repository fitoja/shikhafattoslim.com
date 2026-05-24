"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  Phone,
  Mail,
  ArrowRight,
  Quote,
  ShieldCheck,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ShikhaImg from "../public/assets/shikha.png";
import Logo from "../public/assets/logo.png";

// --- CUSTOM BRAND ICONS ---
const InstagramLogo = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeLogo = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

function getCarouselItems(items: MediaItem[], activeIndex: number) {
  if (items.length <= 3) {
    return items;
  }

  return [0, 1, 2].map((offset) => items[(activeIndex + offset) % items.length]);
}

type MediaSection =
  | "hero"
  | "before_after"
  | "achievements"
  | "about"
  | "celebrity_news"
  | "gallery";

type MediaItem = {
  id: string;
  title: string;
  alt: string;
  section: MediaSection;
  url: string;
  width?: number;
  height?: number;
  order: number;
};

type SectionContent = {
  key: string;
  title: string;
  subtitle: string;
  body: string;
  isPublished: boolean;
  order: number;
};

type SiteContent = {
  media: Record<MediaSection, MediaItem[]>;
  sections: Record<string, SectionContent>;
};

const fallbackSections: Record<string, SectionContent> = {
  about: {
    key: "about",
    title: "About Shikha Aggarwal Sharma",
    subtitle: "A practical Indian nutrition philosophy for everyday life.",
    body: "Shikha helps people move away from crash dieting and build sustainable routines around home-cooked meals, kitchen spices, and metabolism-focused habits.",
    isPublished: true,
    order: 1,
  },
  before_after: {
    key: "before_after",
    title: "Real Transformations",
    subtitle: "Visible journeys from clients who followed the Fat To Slim plan.",
    body: "",
    isPublished: true,
    order: 2,
  },
  achievements: {
    key: "achievements",
    title: "Achievements",
    subtitle: "Milestones, features, and moments of recognition.",
    body: "",
    isPublished: true,
    order: 3,
  },
  celebrity_news: {
    key: "celebrity_news",
    title: "Celebrity, News and Media",
    subtitle: "Public highlights, appearances, and media coverage.",
    body: "",
    isPublished: true,
    order: 4,
  },
};

const emptyMedia: Record<MediaSection, MediaItem[]> = {
  hero: [],
  before_after: [],
  achievements: [],
  about: [],
  celebrity_news: [],
  gallery: [],
};

export default function LandingPage() {
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    phone: "",
    height: "",
    weight: "",
    age: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formMessage, setFormMessage] = useState("");
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/site-content")
      .then((response) => response.json())
      .then((content: SiteContent) => {
        if (isMounted) {
          setSiteContent(content);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSiteContent({ media: emptyMedia, sections: fallbackSections });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConsultationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fieldName = event.target.name as keyof typeof consultationForm;

    setConsultationForm((current) => ({
      ...current,
      [fieldName]: event.target.value,
    }));

    if (formStatus !== "idle") {
      setFormStatus("idle");
      setFormMessage("");
    }
  };

  const handleConsultationSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormStatus("submitting");
    setFormMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultationForm),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Unable to send your details.");
      }

      setConsultationForm({
        name: "",
        phone: "",
        height: "",
        weight: "",
        age: "",
      });
      setFormStatus("success");
      setFormMessage(
        data.message || "Thank you. Your details have been sent successfully.",
      );
    } catch (error) {
      setFormStatus("error");
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const media = siteContent?.media ?? emptyMedia;
  const sections = siteContent?.sections ?? fallbackSections;
  const heroImage = media.hero[0];
  const aboutImage = media.about[0];
  const aboutContent = sections.about ?? fallbackSections.about;
  const beforeAfterContent =
    sections.before_after ?? fallbackSections.before_after;
  const achievementsContent =
    sections.achievements ?? fallbackSections.achievements;
  const newsContent = sections.celebrity_news ?? fallbackSections.celebrity_news;
  const beforeAfterImages = media.before_after.slice(0, 8);
  const achievementImages = media.achievements.slice(0, 6);
  const newsImages = media.celebrity_news.slice(0, 6);
  const safeBeforeAfterIndex = beforeAfterImages.length
    ? beforeAfterIndex % beforeAfterImages.length
    : 0;
  const safeNewsIndex = newsImages.length ? newsIndex % newsImages.length : 0;
  const beforeAfterCarouselItems = getCarouselItems(
    beforeAfterImages,
    safeBeforeAfterIndex,
  );
  const newsCarouselItems = getCarouselItems(newsImages, safeNewsIndex);
  const beforeAfterHasCarousel = beforeAfterImages.length > 3;
  const newsHasCarousel = newsImages.length > 3;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-600 selection:text-white">
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center">
            <Image
              src={Logo}
              alt="Fat To Slim Logo"
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          <div className="hidden lg:flex space-x-10 font-bold text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <a href="#about" className="hover:text-rose-600 transition">
              Philosophy
            </a>
            <a href="/about" className="hover:text-rose-600 transition">
              About Us
            </a>
            <a
              href="#sharktank"
              className="hover:text-rose-600 transition text-rose-600 font-black"
            >
              Shark Tank S4
            </a>
            <a href="#contact" className="hover:text-rose-600 transition">
              Consultation
            </a>
          </div>

          <a
            href="https://wa.me/919211505566"
            target="_blank"
            className="bg-rose-600 text-white px-8 py-4 rounded-full font-black shadow-lg shadow-rose-100 hover:bg-black transition-all text-xs uppercase tracking-widest active:scale-95"
          >
            Book Appointment
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION: REFINED & FIXED SPACING --- */}
      <section className="relative pt-32 lg:pt-24 min-h-screen flex items-center overflow-hidden">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-20 -z-10" />
        <div className="absolute top-1/4 right-0 w-1/2 h-full bg-gradient-to-l from-rose-50/50 to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="py-12">
            <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-800 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest mb-8 border border-slate-200">
              <ShieldCheck size={14} className="text-rose-600" />
              <span>Certified Celebrity Nutritionist</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-slate-900">
              Eat Big. <br />
              <span className="text-rose-600">No Exercise.</span> <br />
              Lose Fast.
            </h1>

            <p className="text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-medium">
              Join{" "}
              <span className="text-black font-bold">
                Shikha Aggarwal Sharma
              </span>{" "}
              and transform your body using the ancient science of Indian
              Kitchen Spices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                <CheckCircle size={20} className="text-rose-600" />
                <span className="text-sm font-bold text-slate-700">
                  Home Cooked Diet
                </span>
              </div>

              <div className="flex items-center space-x-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                <CheckCircle size={20} className="text-rose-600" />
                <span className="text-sm font-bold text-slate-700">
                  Metabolism Focus
                </span>
              </div>
            </div>

            <a
              href="#contact"
              className="bg-black text-white px-12 py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-rose-600 transition-all inline-flex items-center group"
            >
              Start Your Journey{" "}
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition" />
            </a>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-rose-50 rounded-full blur-[120px] opacity-60 -z-10" />

            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[20px] border-white aspect-[4/5] bg-slate-50">
              {heroImage ? (
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt || "Shikha Aggarwal Sharma"}
                  width={heroImage.width || 900}
                  height={heroImage.height || 1125}
                  className="w-full h-full object-contain"
                  priority
                />
              ) : (
                <Image
                  src={ShikhaImg}
                  alt="Shikha Aggarwal Sharma"
                  className="w-full h-full object-contain"
                  priority
                />
              )}
            </div>

            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 hidden xl:block border border-rose-50">
              <p className="text-4xl font-black text-rose-600">10k+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 text-center">
                Success Stories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SHARK TANK SECTION --- */}
      <section id="sharktank" className="py-32 bg-[#0F1115] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <span className="h-px w-12 bg-rose-600"></span>
                <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-[10px]">
                  National Feature
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight italic">
                Shark Tank India <br />
                <span className="text-rose-500 font-bold">Season 4</span>
              </h2>

              <p className="text-slate-400 text-xl mb-10 leading-relaxed font-light">
                Shikha brought her &quot;Kitchen Spice&quot; approach to a national
                audience, spotlighting a simple belief: sustainable weight loss
                can begin with the food already cooked in Indian homes.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Home-style meals over crash diets",
                  "No gym-first pressure",
                  "Metabolism-focused guidance",
                  "Indian spices and practical routines",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
                  >
                    <CheckCircle className="text-rose-500" size={18} />
                    <span className="text-sm font-bold text-slate-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 md:p-10 shadow-[0_0_80px_rgba(225,29,72,0.12)]">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-6">
                Why it mattered
              </p>

              <h3 className="text-3xl md:text-4xl font-black leading-tight mb-6">
                A wellness idea rooted in everyday Indian kitchens.
              </h3>

              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                The feature helped more people discover Shikha&apos;s practical
                nutrition philosophy: eat familiar food, build consistency, and
                support the body&apos;s metabolism without turning health into a
                punishment.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-black/30 p-5 border border-white/10">
                  <p className="text-3xl font-black text-white">10k+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                    Stories
                  </p>
                </div>

                <div className="rounded-2xl bg-black/30 p-5 border border-white/10">
                  <p className="text-3xl font-black text-white">0</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                    Gym Rules
                  </p>
                </div>

                <div className="rounded-2xl bg-black/30 p-5 border border-white/10">
                  <p className="text-3xl font-black text-white">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                    Natural
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section id="about" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 italic tracking-tighter">
              The &quot;Kitchen Spice&quot; Secret
            </h2>

            <div className="w-24 h-1.5 bg-rose-600 mx-auto rounded-full mb-8" />

            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              We use 100% natural Indian spices to correct your metabolism. No
              supplements, no pills, and absolutely no boring salads.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-12 rounded-[2.5rem] bg-rose-50/50 border border-rose-100 hover:shadow-2xl transition-all">
              <Quote className="text-rose-600/20 mb-8" size={60} />

              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">
                Eat Favorite Foods
              </h3>

              <p className="text-slate-600 leading-relaxed font-medium">
                Enjoy Roti, Sabzi, and Dal. No starving or restrictive diets
                required.
              </p>
            </div>

            <div className="p-12 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl md:-translate-y-8 transition-transform">
              <Quote className="text-rose-500/20 mb-8" size={60} />

              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-rose-500">
                No Gym Required
              </h3>

              <p className="text-slate-400 leading-relaxed font-medium text-lg">
                Focusing on internal metabolic healing rather than external
                stress.
              </p>
            </div>

            <div className="p-12 rounded-[2.5rem] bg-rose-50/50 border border-rose-100 hover:shadow-2xl transition-all">
              <Quote className="text-rose-600/20 mb-8" size={60} />

              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">
                Metabolism Fix
              </h3>

              <p className="text-slate-600 leading-relaxed font-medium">
                Balancing your hormones naturally through ancient Ayurvedic
                wisdom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section id="about-us" className="py-28 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[5/4] rounded-[2.5rem] overflow-hidden bg-white border border-slate-200 shadow-xl">
              <Image
                src={aboutImage?.url || ShikhaImg}
                alt={aboutImage?.alt || "Shikha Aggarwal Sharma"}
                width={aboutImage?.width || 900}
                height={aboutImage?.height || 720}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center space-x-4 mb-8">
              <span className="h-px w-12 bg-rose-600"></span>
              <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-[10px]">
                About Us
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
              {aboutContent.title}
            </h2>

            <p className="text-xl text-slate-500 leading-relaxed font-medium mb-6">
              {aboutContent.subtitle}
            </p>

            <p className="text-slate-600 leading-relaxed text-lg mb-10">
              {aboutContent.body}
            </p>

            <a
              href="/about"
              className="inline-flex items-center rounded-2xl bg-black px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-rose-600"
            >
              Read More
              <ArrowRight className="ml-3" size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* --- BEFORE AFTER SECTION --- */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-5">
                {beforeAfterContent.title}
              </h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                {beforeAfterContent.subtitle}
              </p>
            </div>

            {beforeAfterHasCarousel && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous transformation"
                  onClick={() =>
                    setBeforeAfterIndex(
                      (current) =>
                        (current - 1 + beforeAfterImages.length) %
                        beforeAfterImages.length,
                    )
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-600 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next transformation"
                  onClick={() =>
                    setBeforeAfterIndex(
                      (current) => (current + 1) % beforeAfterImages.length,
                    )
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-600 hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {beforeAfterCarouselItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="aspect-[4/5] bg-slate-100 p-3 flex items-center justify-center">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={item.width || 720}
                    height={item.height || 900}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black text-slate-900">
                    {item.title || "Transformation Story"}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          {beforeAfterHasCarousel && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {beforeAfterImages.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show transformation ${index + 1}`}
                  onClick={() => setBeforeAfterIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === safeBeforeAfterIndex
                      ? "w-9 bg-rose-600"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- ACHIEVEMENTS SECTION --- */}
      <section className="py-28 px-6 bg-[#0F1115] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <p className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] mb-5">
                Recognition
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-5">
                {achievementsContent.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {achievementsContent.subtitle}
              </p>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {achievementImages.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
                >
                  <div className="aspect-[4/3] bg-slate-900 p-3 flex items-center justify-center">
                    <Image
                      src={item.url}
                      alt={item.alt}
                      width={item.width || 640}
                      height={item.height || 480}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-black text-white">
                      {item.title || "Achievement"}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- NEWS MEDIA SECTION --- */}
      <section className="py-28 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <p className="text-rose-600 font-black uppercase tracking-[0.4em] text-[10px] mb-5">
                Highlights
              </p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-5">
                {newsContent.title}
              </h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                {newsContent.subtitle}
              </p>
            </div>

            {newsHasCarousel && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous media highlight"
                  onClick={() =>
                    setNewsIndex(
                      (current) =>
                        (current - 1 + newsImages.length) % newsImages.length,
                    )
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-600 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next media highlight"
                  onClick={() =>
                    setNewsIndex((current) => (current + 1) % newsImages.length)
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-600 hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {newsCarouselItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="aspect-[4/3] bg-slate-100 p-3 flex items-center justify-center">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={item.width || 640}
                    height={item.height || 480}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-slate-900">
                    {item.title || "Media Highlight"}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          {newsHasCarousel && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {newsImages.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show media highlight ${index + 1}`}
                  onClick={() => setNewsIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === safeNewsIndex
                      ? "w-9 bg-rose-600"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer
        id="contact"
        className="bg-[#F8FAFC] pt-32 pb-12 border-t border-slate-200 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rose-50/30 to-transparent -z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-24">
            <div className="lg:col-span-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600 mb-5">
                Contact Us
              </h4>

              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6">
                Get a consultation call
              </h2>

              <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-md">
                Share your basic details and the team will receive them
                directly for follow-up.
              </p>
            </div>

            <div className="lg:col-span-7">
              <form
                className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/60"
                onSubmit={handleConsultationSubmit}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Name
                    </span>
                    <input
                      name="name"
                      type="text"
                      value={consultationForm.name}
                      onChange={handleConsultationChange}
                      required
                      autoComplete="name"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Phone number
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      value={consultationForm.phone}
                      onChange={handleConsultationChange}
                      required
                      autoComplete="tel"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Height
                    </span>
                    <input
                      name="height"
                      type="text"
                      value={consultationForm.height}
                      onChange={handleConsultationChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white"
                      placeholder="Example: 5'6 or 168 cm"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Weight
                    </span>
                    <input
                      name="weight"
                      type="text"
                      value={consultationForm.weight}
                      onChange={handleConsultationChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white"
                      placeholder="Example: 72 kg"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Age
                    </span>
                    <input
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      value={consultationForm.age}
                      onChange={handleConsultationChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white"
                      placeholder="Your age"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="mt-5 w-full rounded-2xl bg-rose-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-rose-100 transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {formStatus === "submitting" ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  {formStatus === "submitting" ? "Sending" : "Send Details"}
                </button>

                {formMessage && (
                  <p
                    aria-live="polite"
                    className={`mt-4 text-sm font-bold ${
                      formStatus === "success"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {formMessage}
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-5 text-center lg:text-left">
              {/* FOOTER LOGO */}
              <div className="flex items-center justify-center lg:justify-start mb-8">
                <Image
                  src={Logo}
                  alt="Fat To Slim Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>

              <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-sm font-medium mx-auto lg:mx-0">
                Pioneering the &quot;Eat Sleep No Exercise&quot; movement globally.
                Headquartered in New Delhi, serving clients worldwide.
              </p>

              <div className="flex space-x-4 justify-center lg:justify-start">
                <a
                  href="#"
                  className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                >
                  <InstagramLogo size={20} />
                </a>

                <a
                  href="#"
                  className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                >
                  <YoutubeLogo size={20} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-3">
              {/* <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600 mb-8">
                Headquarters
              </h4>

              <div className="flex items-start space-x-4">
                <MapPin className="text-rose-600 shrink-0 mt-1" size={20} />

                <p className="text-slate-700 font-bold text-sm leading-relaxed">
                  25D, Masjid Moth, Phase 1, <br />
                  GK3, New Delhi - 110048
                </p>
              </div> */}
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600 mb-8">
                Direct Support
              </h4>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-rose-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <Phone size={18} />
                  </div>

                  <a
                    href="tel:+919211505566"
                    className="text-sm font-bold text-slate-900"
                  >
                    +91 92115 05566
                  </a>
                </div>

                <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-rose-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <Mail size={18} />
                  </div>

                  <a
                    href="mailto:info@shikhafattoslim.com"
                    className="text-sm font-bold text-slate-900"
                  >
                    info@shikhafattoslim.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">
              © 2026 SHIKHA AGGARWAL SHARMA • ALL RIGHTS RESERVED
            </p>

            <div className="flex items-center space-x-8 text-[9px] font-black uppercase tracking-widest text-slate-300">
              <a href="#" className="hover:text-rose-600 transition">
                Privacy
              </a>

              <a href="#" className="hover:text-rose-600 transition">
                Franchise
              </a>

              <a href="#" className="hover:text-rose-600 transition">
                Academy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
