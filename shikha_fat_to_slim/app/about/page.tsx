import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

import Logo from "../../public/assets/logo.png";
import ShikhaImg from "../../public/assets/shikha.png";
import { getSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  const about = content.sections.about;
  const aboutImage = content.media.about[0];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="border-b border-slate-100 bg-white/95">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="Fat To Slim Logo"
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-slate-100 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 transition hover:bg-rose-600 hover:text-white"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back Home
          </Link>
        </div>
      </nav>

      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-rose-600">
              About Us
            </p>

            <h1 className="mb-8 text-5xl font-black leading-[0.95] tracking-tighter md:text-7xl">
              {about?.title || "About Shikha Aggarwal Sharma"}
            </h1>

            <p className="mb-8 text-xl font-medium leading-relaxed text-slate-500">
              {about?.subtitle ||
                "Celebrity nutritionist, founder, and kitchen-spice wellness guide."}
            </p>

            <p className="mb-10 text-lg leading-relaxed text-slate-600">
              {about?.body ||
                "Shikha helps clients build practical nutrition routines around familiar Indian food, natural spices, and sustainable habits instead of crash dieting or punishing gym rules."}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Home-cooked food plans",
                "No gym-first pressure",
                "Indian kitchen spices",
                "Sustainable lifestyle changes",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4"
                >
                  <CheckCircle className="text-rose-600" size={18} />
                  <span className="text-sm font-black text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[3rem] border-[18px] border-white bg-slate-100 shadow-2xl">
            <Image
              src={aboutImage?.url || ShikhaImg}
              alt={aboutImage?.alt || "Shikha Aggarwal Sharma"}
              width={aboutImage?.width || 1000}
              height={aboutImage?.height || 1100}
              className="aspect-[10/11] h-full w-full object-contain"
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
