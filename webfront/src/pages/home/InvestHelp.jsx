import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen, FiSearch, FiLifeBuoy,
  FiLock, FiShield, FiBarChart2,
  FiArrowRight, FiUsers, FiTrendingUp, FiHeadphones,
} from "react-icons/fi";

const investData = [
  {
    icon: FiBookOpen,
    title: "Learn Investing",
    description: "Courses designed by experts to simplify stock market investing for every skill level.",
    path: "/courses",
  },
  {
    icon: FiSearch,
    title: "Screen Stocks",
    description: "Powerful screening tools with real-time data and technical indicators.",
    path: "/map",
  },
  {
    icon: FiLifeBuoy,
    title: "Coach Support",
    description: "Personalized guidance from experienced financial coaches for your journey.",
    path: "/coach-support",
  },
  {
    icon: FiLock,
    title: "Capital Lock",
    description: "Advanced capital protection to safeguard your investments from volatility.",
    path: "/capital-lock",
  },
  {
    icon: FiShield,
    title: "Loss Protection",
    description: "Comprehensive loss protection strategies and coverage for your portfolio.",
    path: "/loss-protection",
  },
  {
    icon: FiBarChart2,
    title: "Market Analysis",
    description: "Real-time insights and analysis from SEBI-registered research analysts.",
    path: "/signals",
  },
];

const stats = [
  { icon: FiUsers,      value: "50K+", label: "Active Users"  },
  { icon: FiShield,     value: "200+", label: "SEBI Analysts" },
  { icon: FiTrendingUp, value: "94%",  label: "Success Rate"  },
  { icon: FiHeadphones, value: "24/7", label: "Support"       },
];

export default function InvestHelp() {
  const navigate   = useNavigate();
  const sectionRef = useRef(null);
  const scrollRef  = useRef(null);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 bg-gray-50 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p
              className={`text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ fontFamily: "'Aileron', sans-serif" }}
            >
              Why InvestBay
            </p>
            <h2
              className={`text-[clamp(28px,4vw,46px)] font-black leading-[1.1] tracking-tight text-black mb-4 transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
            >
              How InvestBay Helps
              <br />
              Investors & Traders
            </h2>
            <p
              className={`text-[15px] text-gray-500 leading-relaxed transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
            >
              Discover why thousands of investors trust our platform for their financial journey.
            </p>
          </div>

          {/* scroll arrows */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-shrink-0">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-black transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-black transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Horizontal Scroll Cards ── */}
        <div
          ref={scrollRef}
          className={`flex gap-5 overflow-x-auto pb-3 transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {investData.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[220px] sm:w-[240px]"
              style={{ transitionDelay: visible ? `${index * 60}ms` : "0s" }}
            >
              <div
                onClick={() => navigate(item.path)}
                className="group relative h-full bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:border-gray-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Checkmark badge — top right, appears on hover like Finology */}
                <span className="absolute top-4 right-4 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-black group-hover:bg-black transition-all duration-200">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-100 group-hover:border-gray-200 transition-all duration-200 flex-shrink-0">
                  <item.icon className="w-5 h-5 text-gray-700" />
                </div>

                {/* Title */}
                <h3
                  className="text-[14px] font-black text-black mb-2 group-hover:text-gray-700 transition-colors leading-tight"
                  style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[13px] text-gray-400 leading-relaxed flex-1"
                  style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
                >
                  {item.description}
                </p>

                {/* Bottom arrow */}
                <div className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-gray-300 group-hover:text-black transition-colors duration-200">
                  Explore
                  <FiArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stats Row ── */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 transition-all duration-500 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group bg-white border border-gray-100 rounded-xl p-5 text-center hover:border-gray-200 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex justify-center mb-2">
                <stat.icon className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
              <div
                className="text-2xl font-black text-black mb-0.5"
                style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
              >
                {stat.value}
              </div>
              <div
                className="text-[10px] text-gray-400 font-medium uppercase tracking-wider"
                style={{ fontFamily: "'Aileron', sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div
          className={`mt-12 text-center transition-all duration-500 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white text-[13px] font-black rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
            style={{ fontFamily: "'Aileron Black', sans-serif" }}
          >
            Start Your Journey Today
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <p
            className="text-[12px] text-gray-400 mt-3"
            style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
          >
            Join 50,000+ happy investors who trust InvestBay
          </p>
        </div>

      </div>
    </section>
  );
}