"use client";

import React from "react";
import Image from "next/image";
import {
  CheckCircle,
  Star,
  Phone,
  Award,
  MapPin,
  Mail,
  Play,
  ArrowRight,
  ExternalLink,
  Quote,
  ShieldCheck,
  Globe,
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

export default function LandingPage() {
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
            href="https://wa.me/918860129015"
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

            <button className="bg-black text-white px-12 py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-rose-600 transition-all flex items-center group">
              Start Your Journey{" "}
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-rose-50 rounded-full blur-[120px] opacity-60 -z-10" />

            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[20px] border-white aspect-[4/5] bg-slate-50">
              <Image
                src={ShikhaImg}
                alt="Shikha"
                className="w-full h-full object-cover"
              />
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
                Watch Shikha present her revolutionary "Kitchen Spice" concept
                to the Sharks, disrupting the fitness industry without a single
                gym workout.
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-[#0F1115] bg-slate-800 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 15}`}
                        alt="User"
                      />
                    </div>
                  ))}
                </div>

                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                  Trusted by <br /> 1M+ Viewers
                </p>
              </div>
            </div>

            {/* VIDEO */}
            <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(225,29,72,0.15)] border border-white/10 group">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/6FsYNwfgpZI?rel=0"
                title="Shikha Shark Tank"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section id="about" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 italic tracking-tighter">
              The "Kitchen Spice" Secret
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

      {/* --- FOOTER --- */}
      <footer
        id="contact"
        className="bg-[#F8FAFC] pt-32 pb-12 border-t border-slate-200 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rose-50/30 to-transparent -z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
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
                Pioneering the "Eat Sleep No Exercise" movement globally.
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
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600 mb-8">
                Headquarters
              </h4>

              <div className="flex items-start space-x-4">
                <MapPin className="text-rose-600 shrink-0 mt-1" size={20} />

                <p className="text-slate-700 font-bold text-sm leading-relaxed">
                  25D, Masjid Moth, Phase 1, <br />
                  GK3, New Delhi - 110048
                </p>
              </div>
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
                    href="tel:+918860129015"
                    className="text-sm font-bold text-slate-900"
                  >
                    +91 88601 29015
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
