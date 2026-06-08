import { FiShield, FiTrendingUp, FiPieChart, FiAlertOctagon, FiCheck, FiArrowRight, FiLock } from "react-icons/fi";
import { FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";

// Import your Lottie animations
import heroAnimation from "../assets/animations/money.json";
import whatIsAnimation from "../assets/animations/timer.json";
import whyItMattersAnimation from "../assets/animations/money2.json";

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

// Lottie Animation Component
function LottieAnimation({ animationData, className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && animationData) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });

      return () => {
        animation.destroy();
      };
    }
  }, [animationData]);

  return <div ref={containerRef} className={className} />;
}

export default function CapitalLockInfo() {
  const navigate = useNavigate();
  const [heroRef, heroVisible] = useInView(0.1);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section - Left Text, Right Animation */}
      <section className="w-full bg-white pt-4 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Text Content */}
            <div
              ref={heroRef}
              className={`flex-1 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-6">
                <FiShield className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-['Aileron_Black'] font-bold text-green-700 tracking-wide uppercase">Capital Protection</span>
              </div> */}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Aileron_Black'] font-black text-gray-900 mb-6 leading-tight tracking-tight">
                Protect Your Capital with{" "}
                <span className="text-green-600">Smart Locks</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-8">
                Set a maximum investment limit to prevent overtrading and protect your hard-earned money from impulsive decisions.
              </p>

              <button
                onClick={() => navigate("/capital-lock/setup")}
                className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-['Aileron_Black'] font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Set Up Capital Lock
                <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <p className="text-xs text-gray-400 mt-3">Takes less than 30 seconds · Free · Cancel anytime</p>
            </div>

            {/* Right Lottie Animation */}
            <div className="flex-1 w-full">
              <LottieAnimation
                animationData={heroAnimation}
                className="w-full max-w-[500px] mx-auto"
                style={{ minHeight: "400px" }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* What is Capital Lock - Left Text, Right Animation */}
      <section className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Lottie Animation */}
            <div className="flex-1 w-full">
              <LottieAnimation
                animationData={whatIsAnimation}
                className="w-full max-w-[500px] mx-auto"
                style={{ minHeight: "350px" }}
              />
            </div>

            {/* Right Text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-6">
                <FiLock className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-['Aileron_Black'] font-bold text-green-700 tracking-wide uppercase">What is it?</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-4 tracking-tight">
                What is Capital Lock?
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                Capital Lock is a protective mechanism that lets you set a maximum investment limit on your trading account.
                Once activated, any new investment order exceeding this limit will be automatically blocked, ensuring you
                never risk more than you intended.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "100%", label: "Protection" },
                  { value: "Real-time", label: "Monitoring" },
                  { value: "Instant", label: "Blocking" },
                  { value: "24/7", label: "Active" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-3 rounded-xl bg-white border border-gray-100">
                    <p className="text-lg font-['Aileron_Black'] font-bold text-green-600">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps Grid */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-['Aileron_Black'] font-bold tracking-widest uppercase text-gray-400">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mt-2 mb-4 tracking-tight">How It Works</h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Three simple steps to protect your capital from overtrading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: FiTrendingUp,
                title: "Set Your Limit",
                desc: "Choose a maximum investment amount based on your risk appetite and trading strategy.",
              },
              {
                step: "02",
                icon: FiShield,
                title: "Activate Protection",
                desc: "Once activated, the system monitors all your new investment orders in real-time.",
              },
              {
                step: "03",
                icon: FiAlertOctagon,
                title: "Auto-Block Excess",
                desc: "Any order exceeding your limit is automatically blocked, protecting your capital.",
              },
            ].map((item, idx) => {
              const [ref, visible] = useInView(0.1);
              return (
                <div
                  key={idx}
                  ref={ref}
                  className={`bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-green-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                >
                  <span className="text-6xl font-['Aileron_Black'] font-black text-gray-100 block mb-3">{item.step}</span>
                  <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-['Aileron_Black'] font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why It's Important - Right Text, Left Animation (Even/Odd Direction) */}
      <section className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">

            {/* Right Text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-6">
                <FiPieChart className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-['Aileron_Black'] font-bold text-green-700 tracking-wide uppercase">Why It Matters</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-4 tracking-tight">
                Why Capital Lock is Important
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: FiPieChart,
                    title: "Prevents Overtrading",
                    desc: "Stops you from investing more than planned during market volatility or emotional trading."
                  },
                  {
                    icon: FiShield,
                    title: "Risk Management",
                    desc: "Ensures you always trade within your predefined risk parameters and budget."
                  },
                  {
                    icon: FaChartLine,
                    title: "Discipline Builder",
                    desc: "Helps build trading discipline by enforcing strict capital allocation rules."
                  },
                  {
                    icon: FaExclamationTriangle,
                    title: "Loss Prevention",
                    desc: "Protects against significant losses from impulsive large-scale investments."
                  },
                ].map((item, idx) => {
                  const [ref, visible] = useInView(0.1);
                  return (
                    <div
                      key={idx}
                      ref={ref}
                      className={`flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-all duration-300 group ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                      <item.icon className="w-5 h-5 text-green-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="text-sm font-['Aileron_Black'] font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Left Lottie Animation */}
            <div className="flex-1 w-full">
              <LottieAnimation
                animationData={whyItMattersAnimation}
                className="w-full max-w-[500px] mx-auto"
                style={{ minHeight: "400px" }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Key Benefits - Grid */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-['Aileron_Black'] font-bold tracking-widest uppercase text-gray-400">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mt-2 mb-4 tracking-tight">Key Benefits</h2>
            <p className="text-gray-500 text-base">Everything you get with Capital Lock protection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Real-time Protection", desc: "Instant blocking of excess orders" },
              { label: "Flexible Limits", desc: "Change your limit anytime" },
              { label: "No Lock-in Period", desc: "Remove or modify whenever needed" },
              { label: "Complete Control", desc: "You decide your risk level" },
            ].map((item, idx) => {
              const [ref, visible] = useInView(0.1);
              return (
                <div
                  key={idx}
                  ref={ref}
                  className={`text-center p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                    <FiCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-sm font-['Aileron_Black'] font-bold text-gray-900 mb-1">{item.label}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-['Aileron_Black'] font-bold tracking-widest uppercase text-gray-400">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mt-2 mb-4 tracking-tight">Common Questions</h2>
            <p className="text-gray-500 text-base">Everything you need to know about Capital Lock</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {[
              { q: "Can I change my lock amount later?", a: "Yes! You can modify or remove your capital lock at any time based on your needs." },
              { q: "Does it affect my existing investments?", a: "No. Capital lock only applies to new investment orders. Your existing positions remain unaffected." },
              { q: "What happens if I try to exceed the limit?", a: "The order will be automatically blocked, and you'll receive a notification about the limit." },
              { q: "Is there any fee for using Capital Lock?", a: "No, Capital Lock is a free feature available to all our users to promote responsible trading." },
            ].map((faq, idx) => {
              const [open, setOpen] = useState(false);
              return (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between py-5 px-6 text-left gap-4 group"
                  >
                    <span className="text-sm font-['Aileron_Black'] font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {faq.q}
                    </span>
                    <span className={`text-gray-400 transition-transform duration-300 text-xl ${open ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {open && (
                    <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
            <FiLock className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-4 tracking-tight">
            Ready to Protect Your Capital?
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
            Set your investment limit now and trade with confidence. You can always adjust it later.
          </p>
          <button
            onClick={() => navigate("/capital-lock/setup")}
            className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-['Aileron_Black'] font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Set Capital Lock Now
            <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <p className="text-xs text-gray-400 mt-4">Takes less than 30 seconds to set up</p>

          {/* SEBI accreditation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-6">
            {[
              { label: "SEBI Registered", sub: "Reg No. INA000012218" },
              { label: "Research Analyst", sub: "Reg No. INH000024277" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <div className="font-['Aileron_Black'] font-bold text-sm text-gray-700">{a.label}</div>
                  <div className="text-[10px] text-gray-400">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}