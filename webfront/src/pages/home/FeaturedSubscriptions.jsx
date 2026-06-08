import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, ChevronDown } from "lucide-react";

const features = [
  {
    category: "Signals", items: [
      { label: "Free Trading Signals", sub: "5 free calls per month" },
      { label: "Live Market Calls", sub: null },
    ]
  },
  {
    category: "Mentors", items: [
      { label: "Analyst Profiles", sub: null },
      { label: "Verified Track Records", sub: null },
      { label: "1-on-1 Coach Support", sub: null },
    ]
  },
  {
    category: "Courses", items: [
      { label: "Trading Courses Access", sub: null },
      { label: "Downloadable Materials", sub: null },
    ]
  },
  {
    category: "Protection", items: [
      { label: "Loss Protection", sub: "Daily loss limit alerts" },
      { label: "Capital Lock Feature", sub: null },
    ]
  },
  {
    category: "Analytics", items: [
      { label: "Market Heatmap", sub: null },
      { label: "Portfolio Tracking", sub: null },
      { label: "Signal History", sub: null },
    ]
  },
];

const plans = [
  {
    id: "basic",
    name: "InvestBay",
    badge: "ONE",
    badgeBg: "bg-black text-white",
    tagline: "Learn & Research Markets",
    price: { monthly: 1299, quarterly: 6999 },
    dark: false,
    access: {
      "Free Trading Signals": { type: "limited", label: "5 / Month" },
      "Live Market Calls": { type: "no", label: "No" },
      "Analyst Profiles": { type: "yes", label: "Yes" },
      "Verified Track Records": { type: "yes", label: "Yes" },
      "1-on-1 Coach Support": { type: "no", label: "No" },
      "Trading Courses Access": { type: "limited", label: "Limited" },
      "Downloadable Materials": { type: "no", label: "No" },
      "Loss Protection": { type: "yes", label: "Yes" },
      "Capital Lock Feature": { type: "yes", label: "Yes" },
      "Market Heatmap": { type: "yes", label: "Yes" },
      "Portfolio Tracking": { type: "limited", label: "10 Stocks" },
      "Signal History": { type: "no", label: "No" },
    },
  },
  {
    id: "pro",
    name: "InvestBay",
    badge: "PRO",
    badgeBg: "bg-green-500 text-black",
    tagline: "For Serious Traders",
    price: { monthly: 1999, quarterly: 6999 },
    dark: true,
    popular: true,
    access: {
      "Free Trading Signals": { type: "yes", label: "Unlimited" },
      "Live Market Calls": { type: "yes", label: "Yes" },
      "Analyst Profiles": { type: "yes", label: "Yes" },
      "Verified Track Records": { type: "yes", label: "Yes" },
      "1-on-1 Coach Support": { type: "yes", label: "Yes" },
      "Trading Courses Access": { type: "yes", label: "Full Access" },
      "Downloadable Materials": { type: "yes", label: "Yes" },
      "Loss Protection": { type: "yes", label: "Yes" },
      "Capital Lock Feature": { type: "yes", label: "Yes" },
      "Market Heatmap": { type: "yes", label: "Yes" },
      "Portfolio Tracking": { type: "yes", label: "Unlimited" },
      "Signal History": { type: "yes", label: "Yes" },
    },
  },
];

export default function PricingPlans() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [billing, setBilling] = useState("monthly"); // "monthly" | "quarterly"
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 bg-gray-50 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className={`text-[clamp(24px,3.5vw,42px)] font-black leading-[1.15] tracking-tight text-black mb-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            Choose the best plan that suits<br className="hidden md:block" /> the investor in you.
          </h2>
          <p
            className={`text-[15px] text-gray-500 transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
          >
            There's a plan for every investor.
          </p>
        </div>

        {/* Pricing table */}
        <div
          className={`transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* 3-col grid: feature labels | plan1 | plan2 */}
          <div className="grid grid-cols-[1fr_220px_220px] lg:grid-cols-[1fr_260px_260px] gap-0 items-start">

            {/* ── Column 1: Feature Labels ── */}
            <div className="pr-6">
              {/* Top spacer matching plan card header height */}
              <div className="h-[210px]" />

              {features.map((group) => (
                <div key={group.category}>
                  {/* Category label */}
                  <div className="py-3 border-t border-gray-200">
                    <span
                      className="text-[11px] font-black uppercase tracking-[0.12em] text-black"
                      style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                    >
                      {group.category}
                    </span>
                  </div>
                  {group.items.map((item) => (
                    <div key={item.label} className="py-3.5 border-t border-gray-100">
                      <p
                        className="text-[13.5px] font-semibold text-gray-800"
                        style={{ fontFamily: "'Aileron', sans-serif" }}
                      >
                        {item.label}
                      </p>
                      {item.sub && (
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.sub}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* ── Columns 2 & 3: Plan Cards ── */}
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl overflow-hidden flex flex-col ${plan.dark ? "bg-black" : "bg-white border border-gray-100"} ${plan.popular ? "shadow-2xl shadow-black/20 -mt-4" : "shadow-sm"}`}
              >
                {/* Plan Header */}
                <div className={`px-6 pt-7 pb-6 ${plan.dark ? "border-b border-white/10" : "border-b border-gray-100"}`}>
                  {/* Plan name + badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[16px] font-black ${plan.dark ? "text-white" : "text-black"}`}
                      style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                    >
                      {plan.name}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider ${plan.badgeBg}`}>
                      {plan.badge}
                    </span>
                  </div>
                  <p className={`text-[12px] mb-5 ${plan.dark ? "text-gray-400" : "text-gray-400"}`}>{plan.tagline}</p>

                  {/* Billing toggle — only on PRO */}
                  {plan.popular && (
                    <div className="flex items-center gap-1 p-1 bg-white/10 rounded-full w-fit mb-5">
                      {["monthly", "quarterly"].map((b) => (
                        <button
                          key={b}
                          onClick={() => setBilling(b)}
                          className={`px-3.5 py-1 rounded-full text-[11px] font-bold capitalize transition-all duration-200 ${billing === b
                              ? "bg-white text-black"
                              : "text-gray-400 hover:text-white"
                            }`}
                        >
                          {b === "monthly" ? "Monthly" : "Quarterly"}
                        </button>
                      ))}
                    </div>
                  )}
                  {!plan.popular && (
                    <div className="mb-5" />
                  )}

                  {/* Price */}
                  <div>
                    <span
                      className={`text-[28px] font-black leading-none ${plan.dark ? "text-white" : "text-black"}`}
                      style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                    >
                      ₹{(plan.popular ? plan.price[billing] : plan.price["monthly"]).toLocaleString()}
                    </span>
                    <span className={`text-[12px] ml-1 ${plan.dark ? "text-gray-400" : "text-gray-400"}`}>
                      per {plan.popular && billing === "quarterly" ? "quarter" : "month"}
                    </span>
                  </div>
                </div>

                {/* Feature cells */}
                {features.map((group) => (
                  <div key={group.category}>
                    {/* Category row */}
                    <div className={`px-6 py-3 ${plan.dark ? "bg-white/5 border-t border-white/10" : "bg-gray-50 border-t border-gray-200"}`}>
                      <span
                        className={`text-[11px] font-black uppercase tracking-[0.1em] ${plan.dark ? "text-white" : "text-black"}`}
                        style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                      >
                        Full Access
                      </span>
                    </div>
                    {group.items.map((item) => {
                      const cell = plan.access[item.label];
                      return (
                        <div
                          key={item.label}
                          className={`px-6 py-3.5 border-t text-center ${plan.dark ? "border-white/[0.07]" : "border-gray-100"}`}
                        >
                          <span
                            className={`text-[13px] font-semibold ${cell.type === "yes"
                                ? plan.dark ? "text-white" : "text-gray-800"
                                : cell.type === "limited"
                                  ? plan.dark ? "text-gray-300" : "text-gray-500"
                                  : plan.dark ? "text-gray-600" : "text-gray-300"
                              }`}
                          >
                            {cell.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Subscribe CTA */}
                <div className={`px-6 py-5 mt-auto ${plan.dark ? "border-t border-white/10" : "border-t border-gray-100"}`}>
                  <button
                    onClick={() => navigate("/subscriptions")}
                    className={`w-full py-3 rounded-xl text-[14px] font-black tracking-wide transition-all duration-200 hover:-translate-y-0.5 ${plan.dark
                        ? "bg-green-500 hover:bg-green-400 text-black"
                        : "bg-black hover:bg-gray-800 text-white"
                      }`}
                    style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Know More */}
        <div className={`text-center mt-12 transition-all duration-500 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={() => navigate("/subscriptions")}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-black hover:text-gray-600 transition-colors duration-200 underline underline-offset-4"
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            Know More
          </button>
        </div>

      </div>
    </section>
  );
}