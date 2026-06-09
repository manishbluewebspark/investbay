import { FiShield, FiTrendingUp, FiPieChart, FiAlertOctagon, FiCheck, FiArrowRight, FiLock } from "react-icons/fi";
import { FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";

import heroAnimation from "../assets/animations/money.json";
import whatIsAnimation from "../assets/animations/timer.json";
import whyItMattersAnimation from "../assets/animations/money2.json";

// ── Font constants (same as all other components) ─────────────────────────
const AB = { fontFamily: "'Aileron Black', 'Arial Black', sans-serif" };
const HS = { fontFamily: "'Hind Siliguri', 'Hind', sans-serif" };
const AL = { fontFamily: "'Aileron', 'Arial', sans-serif" };

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function LottieAnimation({ animationData, className }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current && animationData) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
      return () => animation.destroy();
    }
  }, [animationData]);
  return <div ref={containerRef} className={className} />;
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-5 px-6 text-left gap-4">
        <span className="text-sm font-black text-gray-900" style={AB}>{q}</span>
        <span
          className="text-gray-400 text-xl flex-shrink-0 transition-transform duration-300"
          style={{ display: "inline-block", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >+</span>
      </button>
      {open && <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed" style={HS}>{a}</p>}
    </div>
  );
}

export default function CapitalLockInfo() {
  const navigate = useNavigate();
  const [heroRef, heroVisible] = useInView(0.1);

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="w-full bg-white pt-0 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left */}
            <div
              ref={heroRef}
              className={`flex-1 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              {/* <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4" style={AL}>
                Capital Protection
              </p> */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-5 leading-tight tracking-tight" style={AB}>
                Protect Your Capital with
                <br /> <span className="text-green-600">Smart Locks</span>
              </h1>
              <p className="text-[16px] text-gray-500 max-w-xl leading-relaxed mb-8" style={HS}>
                Set a maximum investment limit to prevent overtrading and protect your hard-earned money from impulsive decisions. Capital Lock ensures you stay within your risk appetite — automatically, in real-time.
              </p>

              {/* Mini stat pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { val: "100%", label: "Protection" },
                  { val: "Real-time", label: "Monitoring" },
                  { val: "Instant", label: "Blocking" },
                  { val: "24/7", label: "Active" },
                ].map((s, i) => (
                  <div key={i} className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <div className="font-black text-sm text-black" style={AB}>{s.val}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5" style={AL}>{s.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/capital-lock/setup")}
                className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-7 py-3.5 rounded-xl font-black text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                style={AB}
              >
                Set Up Capital Lock
                <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <p className="text-xs text-gray-400 mt-3" style={HS}>Takes less than 30 seconds · Free · Cancel anytime</p>
            </div>

            {/* Right Lottie */}
            <div className="flex-1 w-full py-10 order-1 lg:order-2">
              <LottieAnimation animationData={heroAnimation} className="w-full max-w-[500px] mx-auto" style={{ minHeight: "400px" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── BETWEEN BANNER ───────────────────────────────────────────────── */}
      <div className="w-full bg-black py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2" style={AL}>
              Did you know?
            </p>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight" style={AB}>
              90% of retail traders lose money due to
              <br className="hidden md:block" /> overtrading and emotional decisions.
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-8 flex-shrink-0">
            {[
              { val: "90%", label: "Traders lose due to overtrading" },
              { val: "3×", label: "More losses from impulsive trades" },
              { val: "₹0", label: "Cost to activate Capital Lock" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-white" style={AB}>{s.val}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 max-w-[120px]" style={HS}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT IS CAPITAL LOCK ─────────────────────────────────────────── */}
      <section className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Lottie */}
            <div className="flex-1 w-full order-2 lg:order-1">
              <LottieAnimation animationData={whatIsAnimation} className="w-full max-w-[480px] mx-auto" />
            </div>

            {/* Right Text */}
            <div className="flex-1 order-1 lg:order-2">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>
                What is it?
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight" style={AB}>
                What is Capital Lock?
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-5" style={HS}>
                Capital Lock is a protective mechanism that lets you set a maximum investment limit on your trading account. Once activated, any new investment order exceeding this limit is automatically blocked — ensuring you never risk more than you intended.
              </p>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-5" style={HS}>
                Think of it as a safety guardrail for your portfolio. Whether you're trading equities, F&O, or commodities, Capital Lock enforces discipline by hard-capping your exposure in real time.
              </p>
              <p className="text-[15px] text-gray-500 leading-relaxed" style={HS}>
                Unlike manual reminders or spreadsheets, Capital Lock operates at the order level — the block happens before the trade, not after the damage is done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight" style={AB}>How It Works</h2>
            <p className="text-[15px] text-gray-500 max-w-xl" style={HS}>Three simple steps to protect your capital from overtrading.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: "01", icon: FiTrendingUp, title: "Set Your Limit", desc: "Choose a maximum investment amount based on your risk appetite and trading strategy." },
              { step: "02", icon: FiShield, title: "Activate Protection", desc: "Once activated, the system monitors all your new investment orders in real-time." },
              { step: "03", icon: FiAlertOctagon, title: "Auto-Block Excess", desc: "Any order exceeding your limit is automatically blocked, protecting your capital." },
            ].map((item, idx) => {
              const [ref, visible] = useInView(0.1);
              return (
                <div
                  key={idx} ref={ref}
                  className={`bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                >
                  <span className="text-6xl font-black text-gray-100 block mb-4 leading-none" style={AB}>{item.step}</span>
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="text-[15px] font-black text-gray-900 mb-2" style={AB}>{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed" style={HS}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ───────────────────────────────────────────────── */}
      <section className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">

            {/* Text */}
            <div className="flex-1">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>Why It Matters</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight" style={AB}>
                Why Capital Lock
                <br />is Important
              </h2>
              <div className="space-y-3">
                {[
                  { icon: FiPieChart, title: "Prevents Overtrading", desc: "Stops you from investing more than planned during market volatility or emotional trading." },
                  { icon: FiShield, title: "Risk Management", desc: "Ensures you always trade within your predefined risk parameters and budget." },
                  { icon: FaChartLine, title: "Discipline Builder", desc: "Helps build trading discipline by enforcing strict capital allocation rules." },
                  { icon: FaExclamationTriangle, title: "Loss Prevention", desc: "Protects against significant losses from impulsive large-scale investments." },
                ].map((item, idx) => {
                  const [ref, visible] = useInView(0.1);
                  return (
                    <div
                      key={idx} ref={ref}
                      className={`flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 group ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-gray-200 transition-colors">
                        <item.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900 mb-0.5" style={AB}>{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed" style={HS}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lottie */}
            <div className="flex-1 w-full">
              <LottieAnimation animationData={whyItMattersAnimation} className="w-full max-w-[480px] mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY BENEFITS ─────────────────────────────────────────────────── */}
     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-6xl mx-auto">
    <div className="mb-12 text-center">
      {/* <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>Benefits</p> */}
      <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight" style={AB}>Key Benefits</h2>
      <p className="text-[15px] text-gray-500" style={HS}>Everything you get with Capital Lock protection.</p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Real-time Protection", desc: "Instant blocking of excess orders" },
        { label: "Flexible Limits", desc: "Change your limit anytime" },
        { label: "No Lock-in Period", desc: "Remove or modify whenever needed" },
        { label: "Complete Control", desc: "You decide your risk level" },
      ].map((item, idx) => {
        const [ref, visible] = useInView(0.1);
        const gradients = [
          "from-emerald-500 to-teal-500",
          "from-blue-500 to-cyan-500",
          "from-purple-500 to-pink-500",
          "from-orange-500 to-amber-500",
        ];
        return (
          <div
            key={idx}
            ref={ref}
            className={`group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-transparent transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[idx]} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <FiCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              
              {/* Title */}
              <h4 className="text-base font-black text-gray-900 mb-2 leading-tight group-hover:text-white transition-colors duration-300" style={AB}>
                {item.label}
              </h4>
              
              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed group-hover:text-white/90 transition-colors duration-300" style={HS}>
                {item.desc}
              </p>
              
              {/* Decorative Line */}
              <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent group-hover:w-full group-hover:bg-white/30 transition-all duration-500" />
            </div>
            
            {/* Hover Shadow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-2xl" />
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight" style={AB}>Common Questions</h2>
          <p className="text-[15px] text-gray-500 mb-10" style={HS}>Everything you need to know about Capital Lock.</p>
          <div className="bg-white rounded-2xl border border-gray-100">
            {[
              { q: "Can I change my lock amount later?", a: "Yes! You can modify or remove your capital lock at any time based on your needs." },
              { q: "Does it affect my existing investments?", a: "No. Capital lock only applies to new investment orders. Your existing positions remain unaffected." },
              { q: "What happens if I try to exceed the limit?", a: "The order will be automatically blocked, and you'll receive a notification about the limit." },
              { q: "Is there any fee for using Capital Lock?", a: "No, Capital Lock is a free feature available to all our users to promote responsible trading." },
            ].map((faq, idx) => <FaqItem key={idx} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-6">
            <FiLock className="w-7 h-7 text-gray-700" strokeWidth={1.6} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight" style={AB}>
            Ready to Protect Your Capital?
          </h2>
          <p className="text-[15px] text-gray-500 mb-8 leading-relaxed" style={HS}>
            Set your investment limit now and trade with confidence. You can always adjust it later.
          </p>
          <button
            onClick={() => navigate("/capital-lock/setup")}
            className="group inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-black text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            style={AB}
          >
            Set Capital Lock Now
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <p className="text-xs text-gray-400 mt-4" style={HS}>Takes less than 30 seconds to set up</p>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-6">
            {[
              { label: "SEBI Registered", sub: "Reg No. INA000012218" },
              { label: "Research Analyst", sub: "Reg No. INH000024277" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <div className="font-black text-sm text-gray-700" style={AB}>{a.label}</div>
                  <div className="text-[10px] text-gray-400" style={AL}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}