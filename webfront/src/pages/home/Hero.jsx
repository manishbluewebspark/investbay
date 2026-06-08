// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IoIosArrowForward } from "react-icons/io";
// import Shield from "../../assets/icon/shield.svg";
// import Right from "../../assets/icon/right.svg";
// import Trade from "../../assets/icon/trade.svg";

// const WORDS = ["Stock Advisor", "SEBI Analyst", "Trading Signal", "Market Mentor"];

// export default function HeroSection() {
//   const navigate = useNavigate();
//   const [wordIdx, setWordIdx] = useState(0);
//   const [text, setText] = useState("");
//   const [deleting, setDeleting] = useState(false);
//   const [charIdx, setCharIdx] = useState(0);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const t = setTimeout(() => setMounted(true), 100);
//     return () => clearTimeout(t);
//   }, []);

//   useEffect(() => {
//     const word = WORDS[wordIdx];
//     let t;
//     if (!deleting && charIdx < word.length) {
//       t = setTimeout(() => { setText(word.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 80);
//     } else if (!deleting && charIdx === word.length) {
//       t = setTimeout(() => setDeleting(true), 2200);
//     } else if (deleting && charIdx > 0) {
//       t = setTimeout(() => { setText(word.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, 45);
//     } else if (deleting && charIdx === 0) {
//       setDeleting(false);
//       setWordIdx(i => (i + 1) % WORDS.length);
//     }
//     return () => clearTimeout(t);
//   }, [charIdx, deleting, wordIdx]);

//   return (
//     <section className="relative w-full min-h-screen bg-white flex flex-col overflow-hidden font-sans">

//       {/* Dot pattern bg */}
//       <div
//         className="absolute inset-0 z-0 pointer-events-none opacity-40"
//         style={{
//           backgroundImage: "radial-gradient(circle, #d1fae5 1px, transparent 1px)",
//           backgroundSize: "32px 32px",
//           maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
//           WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
//         }}
//       />

//       {/* Disclaimer Ticker */}
//       <div className="relative z-20 bg-green-50 border-b border-green-100 py-2.5 overflow-hidden flex-shrink-0">
//         <div className="flex gap-16 w-max animate-[ticker-scroll_35s_linear_infinite]">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="flex items-center gap-3 text-[13px] font-medium text-gray-500 whitespace-nowrap">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
//               This is a technology-driven platform for educational and informational purposes only. We do not provide any buy/sell recommendations, investment advice, or stock market tips. Please consult your financial advisor before making any investment decisions.
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 flex-1 flex items-center">
//         <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

//           {/* ── LEFT: Text ── */}
//           <div className="flex-1 flex flex-col items-start w-full">

//             {/* Badge */}
//             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-7 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span className="text-[13px] font-semibold text-green-700 tracking-wide">
//                 Trusted by 50,000+ active traders
//               </span>
//             </div>

//             {/* Heading */}
//             <div className={`transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
//               <h1
//                 className="leading-[1.1] tracking-tight text-gray-900"
//                 style={{ fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 800 }}
//               >
//                 Find the Right{" "}
//                 <span className="text-green-600">
//                   {text}
//                   <span className="inline-block w-[3px] h-[0.85em] bg-green-500 align-middle ml-0.5 rounded-sm animate-[cursor-blink_0.9s_step-end_infinite]" />
//                 </span>
//               </h1>
//               <h1
//                 className="leading-[1.1] tracking-tight text-gray-900 mt-1"
//                 style={{ fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 800 }}
//               >
//                 for Your Investment Journey
//               </h1>
//             </div>

//             {/* Subtitle */}
//             <p className={`mt-5 leading-relaxed text-gray-500 max-w-[480px] transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//               style={{ fontSize: "clamp(14px, 1.6vw, 17px)" }}>
//               Access verified research analysts, real-time signals, and expert insights — all curated in one powerful platform.
//             </p>

//             {/* CTAs */}
//             <div className={`mt-8 flex flex-wrap items-center gap-3 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
//               <button className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-xl text-[15px] font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.35)] active:translate-y-0">
//                 Explore Now
//                 <IoIosArrowForward className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
//               </button>
//               <button
//                 onClick={() => navigate("/mentors")}
//                 className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-green-300 hover:text-green-700 px-6 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200"
//               >
//                 View Mentors
//               </button>
//             </div>

//             {/* Trust Pills */}
//             <div className={`mt-6 flex flex-wrap gap-2 transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
//               {[
//                 { icon: Shield, label: "SEBI Registered" },
//                 { icon: Right, label: "Verified Track Record" },
//                 { icon: Trade, label: "Zero False Promises" },
//               ].map((pill, idx) => (
//                 <span key={idx} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[12px] font-medium text-gray-500 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all duration-200 cursor-default">
//                   <img src={pill.icon} alt="" className="w-3.5 h-3.5 opacity-60" />
//                   {pill.label}
//                 </span>
//               ))}
//             </div>

//             {/* Mini stats row */}
//             <div className={`mt-8 flex flex-wrap gap-5 transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
//               {[
//                 { value: "200+", label: "SEBI Analysts" },
//                 { value: "94%", label: "Success Rate" },
//                 { value: "50K+", label: "Active Traders" },
//               ].map((s, i) => (
//                 <div key={i} className="flex flex-col">
//                   <span className="text-xl font-extrabold text-gray-900 leading-none">{s.value}</span>
//                   <span className="text-[12px] text-gray-400 mt-0.5 font-medium">{s.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── RIGHT: SVG Illustration ── */}
//           <div className={`w-full lg:flex-1 flex items-center justify-center transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 lg:translate-x-8"}`}>
//             <svg
//               viewBox="0 0 520 480"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[520px] h-auto"
//               style={{ filter: "drop-shadow(0 20px 48px rgba(22,163,74,0.07))" }}
//             >
//               {/* ── Background blobs ── */}
//               <ellipse cx="300" cy="240" rx="210" ry="195" fill="#f0fdf4" opacity="0.9" />
//               <ellipse cx="280" cy="260" rx="140" ry="125" fill="#dcfce7" opacity="0.55" />

//               {/* ── Analyst card (main) ── */}
//               <rect x="110" y="60" width="300" height="195" rx="16" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
//               {/* Card header bar */}
//               <rect x="110" y="60" width="300" height="38" rx="16" fill="#f9fafb" />
//               <rect x="110" y="80" width="300" height="18" fill="#f9fafb" />
//               {/* Traffic lights */}
//               <circle cx="134" cy="79" r="5.5" fill="#fca5a5" />
//               <circle cx="153" cy="79" r="5.5" fill="#fde68a" />
//               <circle cx="172" cy="79" r="5.5" fill="#86efac" />
//               {/* "Analysts" label */}
//               <rect x="270" y="70" width="120" height="18" rx="5" fill="#f0fdf4" />
//               <text x="282" y="83" fontSize="9" fontWeight="600" fill="#16a34a">● Live Signals</text>

//               {/* Analyst rows inside card */}
//               {/* Row 1 */}
//               <circle cx="138" cy="120" r="14" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="1.5" />
//               <text x="138" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a">RK</text>
//               <rect x="160" y="111" width="70" height="8" rx="3" fill="#1f2937" />
//               <rect x="160" y="123" width="50" height="6" rx="3" fill="#9ca3af" />
//               <rect x="320" y="111" width="52" height="18" rx="5" fill="#dcfce7" />
//               <text x="346" y="124" textAnchor="middle" fontSize="10" fontWeight="700" fill="#16a34a">+18.4%</text>
//               <rect x="246" y="113" width="60" height="6" rx="3" fill="#f3f4f6" />
//               <rect x="246" y="123" width="44" height="6" rx="3" fill="#f3f4f6" />

//               {/* Row 2 */}
//               <circle cx="138" cy="158" r="14" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5" />
//               <text x="138" y="163" textAnchor="middle" fontSize="11" fontWeight="700" fill="#d97706">SM</text>
//               <rect x="160" y="149" width="62" height="8" rx="3" fill="#1f2937" />
//               <rect x="160" y="161" width="46" height="6" rx="3" fill="#9ca3af" />
//               <rect x="320" y="149" width="52" height="18" rx="5" fill="#dcfce7" />
//               <text x="346" y="162" textAnchor="middle" fontSize="10" fontWeight="700" fill="#16a34a">+12.7%</text>
//               <rect x="246" y="151" width="56" height="6" rx="3" fill="#f3f4f6" />
//               <rect x="246" y="161" width="40" height="6" rx="3" fill="#f3f4f6" />

//               {/* Row 3 */}
//               <circle cx="138" cy="196" r="14" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5" />
//               <text x="138" y="201" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c3aed">AP</text>
//               <rect x="160" y="187" width="66" height="8" rx="3" fill="#1f2937" />
//               <rect x="160" y="199" width="52" height="6" rx="3" fill="#9ca3af" />
//               <rect x="320" y="187" width="52" height="18" rx="5" fill="#dcfce7" />
//               <text x="346" y="200" textAnchor="middle" fontSize="10" fontWeight="700" fill="#16a34a">+9.2%</text>
//               <rect x="246" y="189" width="50" height="6" rx="3" fill="#f3f4f6" />
//               <rect x="246" y="199" width="36" height="6" rx="3" fill="#f3f4f6" />

//               {/* ── Signal card (floating bottom-left) ── */}
//               <rect x="60" y="290" width="178" height="105" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1.5"
//                 style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.06))" }} />
//               <rect x="74" y="306" width="60" height="7" rx="3" fill="#1f2937" />
//               <rect x="74" y="318" width="44" height="5" rx="2.5" fill="#9ca3af" />
//               {/* Mini sparkline */}
//               <polyline
//                 points="74,355 92,345 110,350 128,335 148,328 168,320 188,315 208,308 228,300"
//                 stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
//                 style={{ strokeDasharray: 250, strokeDashoffset: 250, animation: "drawLine 2s 1s ease forwards" }}
//               />
//               <rect x="74" y="338" width="150" height="28" rx="5" fill="#f9fafb" />
//               {/* Tiny bars in signal card */}
//               <rect x="80" y="348" width="8" height="12" rx="2" fill="#bbf7d0" />
//               <rect x="92" y="344" width="8" height="16" rx="2" fill="#4ade80" />
//               <rect x="104" y="340" width="8" height="20" rx="2" fill="#22c55e" />
//               <rect x="116" y="342" width="8" height="18" rx="2" fill="#16a34a" />
//               <rect x="128" y="338" width="8" height="22" rx="2" fill="#15803d" />
//               <rect x="140" y="341" width="8" height="19" rx="2" fill="#22c55e" />
//               <rect x="152" y="337" width="8" height="23" rx="2" fill="#16a34a" />
//               <rect x="164" y="340" width="8" height="20" rx="2" fill="#4ade80" />
//               {/* Live badge */}
//               <rect x="146" y="304" width="74" height="20" rx="6" fill="#dcfce7" />
//               <circle cx="158" cy="314" r="3.5" fill="#22c55e" />
//               <text x="165" y="318" fontSize="9" fontWeight="700" fill="#15803d">LIVE FEED</text>

//               {/* ── Stats card (floating top-right) ── */}
//               <rect x="348" y="270" width="140" height="90" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1.5"
//                 style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.06))" }} />
//               <text x="368" y="295" fontSize="10" fontWeight="600" fill="#6b7280">Portfolio Return</text>
//               <text x="368" y="318" fontSize="22" fontWeight="800" fill="#16a34a">+24.6%</text>
//               <text x="368" y="333" fontSize="9" fill="#9ca3af">This Quarter</text>
//               {/* Small trend arrow */}
//               <path d="M432 285 L432 268 M432 268 L424 276 M432 268 L440 276" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
//                 style={{ animation: "arrowBounce 1.8s ease-in-out infinite" }} />
//               {/* Progress bar */}
//               <rect x="368" y="344" width="100" height="6" rx="3" fill="#f3f4f6" />
//               <rect x="368" y="344" width="72" height="6" rx="3" fill="#22c55e" />

//               {/* ── SEBI badge ── */}
//               <rect x="60" y="420" width="130" height="40" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
//               <circle cx="82" cy="440" r="10" fill="#dcfce7" />
//               <path d="M77 440l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               <text x="98" y="436" fontSize="9" fontWeight="700" fill="#374151">SEBI Registered</text>
//               <text x="98" y="448" fontSize="8" fill="#9ca3af">200+ Analysts</text>

//               {/* ── Accuracy badge ── */}
//               <rect x="340" y="380" width="145" height="40" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
//               <circle cx="362" cy="400" r="10" fill="#fef9c3" />
//               <text x="362" y="404" textAnchor="middle" fontSize="11" fill="#ca8a04">★</text>
//               <text x="378" y="396" fontSize="9" fontWeight="700" fill="#374151">Avg. Accuracy</text>
//               <text x="378" y="408" fontSize="11" fontWeight="800" fill="#16a34a">94.2%</text>

//               {/* ── Floating dots / sparkle ── */}
//               <circle cx="480" cy="100" r="5" fill="#22c55e" opacity="0.4" />
//               <circle cx="95" cy="180" r="4" fill="#22c55e" opacity="0.3" />
//               <circle cx="460" cy="380" r="6" fill="#4ade80" opacity="0.35" />
//               <circle cx="76" cy="260" r="3.5" fill="#16a34a" opacity="0.25" />

//               {/* ── Vertical dotted line connector ── */}
//               <line x1="260" y1="255" x2="260" y2="290" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4 3" />
//             </svg>
//           </div>

//         </div>
//       </div>

//       <style>{`
//         @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
//         @keyframes cursor-blink  { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
//         @keyframes floatY        { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
//         @keyframes arrowBounce   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
//         @keyframes drawLine      { to { stroke-dashoffset: 0; } }
//       `}</style>
//     </section>
//   );
// }





import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Shield from "../../assets/icon/shield.svg";
import Right from "../../assets/icon/right.svg";
import Trade from "../../assets/icon/trade.svg";

const WORDS = ["Stock Advisor", "SEBI Analyst", "Trading Signal", "Market Mentor"];

export default function HeroSection() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col overflow-hidden font-sans">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, #d1fae5 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
        }}
      />

      {/* Ticker */}
      <div className="relative z-20 bg-green-50 border-b border-green-100 py-2.5 overflow-hidden flex-shrink-0">
        <div className="flex gap-16 w-max animate-[ticker-scroll_35s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 text-[13px] font-medium text-gray-500 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              This is a technology-driven platform for educational and informational purposes only. We do not provide any buy/sell recommendations, investment advice, or stock market tips. Please consult your financial advisor before making any investment decisions.
            </div>
          ))}
        </div>
      </div>

      {/* Main — two column, centered vertically */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-24 py-12 gap-12 lg:gap-16">

        {/* LEFT: Text - centered within column */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-2xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-8 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[13px] font-semibold text-green-700 tracking-wide">
              Trusted by 50,000+ active traders
            </span>
          </div>

          {/* Heading - Static text without animation */}
          <div className={`transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h1 className="font-extrabold text-[clamp(34px,4.5vw,60px)] leading-[1.1] tracking-tight text-gray-900">
              Find the Right{" "}
              <span className="text-green-600">
                Stock Advisor
              </span>
              <br />
              for Your Investment Journey
            </h1>
          </div>

          {/* Subtitle */}
          <p className={`mt-6 text-[clamp(15px,1.6vw,17px)] leading-relaxed text-gray-500 max-w-[480px] transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Access verified research analysts, real-time signals, and expert insights — all curated in one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className={`mt-8 flex items-center gap-3 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-xl text-[15px] font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.35)] active:translate-y-0">
              Explore Now
              <IoIosArrowForward className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-green-300 hover:text-green-700 px-6 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 cursor-pointer"
              onClick={() => navigate("/mentors")}>
              View Mentors
            </button>
          </div>

          {/* Trust Pills */}
          <div className={`mt-6 flex flex-wrap gap-2 transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
            {[
              { icon: Shield, label: "SEBI Registered" },
              { icon: Right, label: "Verified Track Record" },
              { icon: Trade, label: "Zero False Promises" },
            ].map((pill, idx) => (
              <span key={idx} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[12px] font-medium text-gray-500 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all duration-200 cursor-default">
                <img src={pill.icon} alt="" className="w-3.5 h-3.5 opacity-60" />
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: SVG Illustration - Increased size */}
        <div className={`hidden lg:flex flex-1 items-center justify-center transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
          <svg
            viewBox="0 0 560 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[560px] h-auto"
            style={{ filter: "drop-shadow(0 20px 40px rgba(22,163,74,0.08))" }}
          >
            {/* BG blobs - scaled */}
            <ellipse cx="380" cy="250" rx="220" ry="200" fill="#f0fdf4" opacity="0.8" />
            <ellipse cx="350" cy="270" rx="150" ry="130" fill="#dcfce7" opacity="0.6" />

            {/* Monitor - scaled */}
            <rect x="160" y="100" width="270" height="200" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="2" />
            <rect x="160" y="100" width="270" height="32" rx="14" fill="#f9fafb" />
            <rect x="160" y="116" width="270" height="16" fill="#f9fafb" />
            <circle cx="185" cy="116" r="5" fill="#fca5a5" />
            <circle cx="202" cy="116" r="5" fill="#fde68a" />
            <circle cx="219" cy="116" r="5" fill="#86efac" />

            {/* Chart area - scaled */}
            <rect x="180" y="148" width="230" height="138" rx="6" fill="#f9fafb" />
            <rect x="200" y="228" width="22" height="45" rx="3" fill="#bbf7d0" />
            <rect x="232" y="208" width="22" height="65" rx="3" fill="#4ade80" />
            <rect x="264" y="188" width="22" height="85" rx="3" fill="#22c55e" />
            <rect x="296" y="198" width="22" height="75" rx="3" fill="#16a34a" />
            <rect x="328" y="175" width="22" height="98" rx="3" fill="#15803d" />
            <rect x="360" y="185" width="22" height="88" rx="3" fill="#22c55e" />
            <polyline
              points="200,238 232,218 264,198 296,208 328,185 380,170"
              stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
              style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: "drawLine 2s 0.8s ease forwards" }}
            />
            <circle cx="380" cy="170" r="6" fill="#16a34a" />
            <circle cx="380" cy="170" r="4" fill="white" />

            {/* Stand - scaled */}
            <rect x="273" y="300" width="20" height="25" fill="#e5e7eb" />
            <rect x="245" y="323" width="76" height="8" rx="4" fill="#d1d5db" />

            {/* Person left - scaled */}
            <g style={{ animation: "floatY 4s ease-in-out infinite" }}>
              <ellipse cx="130" cy="390" rx="28" ry="12" fill="#dcfce7" opacity="0.5" />
              <rect x="115" y="325" width="30" height="56" rx="5" fill="#4ade80" />
              <circle cx="130" cy="310" r="20" fill="#fde68a" />
              <circle cx="124" cy="306" r="2.5" fill="#374151" />
              <circle cx="136" cy="306" r="2.5" fill="#374151" />
              <path d="M125 315 Q130 320 135 315" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M110 306 Q115 285 130 290 Q145 285 150 306" fill="#1f2937" />
              <line x1="115" y1="344" x2="92" y2="331" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" />
              <line x1="145" y1="344" x2="166" y2="325" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" />
              <rect x="117" y="375" width="12" height="25" rx="5" fill="#1f2937" />
              <rect x="135" y="375" width="12" height="25" rx="5" fill="#1f2937" />
              <rect x="113" y="396" width="18" height="8" rx="4" fill="#374151" />
              <rect x="131" y="396" width="18" height="8" rx="4" fill="#374151" />
            </g>

            {/* Person right - scaled */}
            <g style={{ animation: "floatY 4s 0.5s ease-in-out infinite" }}>
              <ellipse cx="450" cy="390" rx="28" ry="12" fill="#dcfce7" opacity="0.5" />
              <rect x="435" y="325" width="30" height="56" rx="5" fill="#22c55e" />
              <circle cx="450" cy="310" r="20" fill="#fde68a" />
              <circle cx="444" cy="306" r="2.5" fill="#374151" />
              <circle cx="456" cy="306" r="2.5" fill="#374151" />
              <path d="M445 315 Q450 320 455 315" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M430 303 Q435 290 450 294 Q465 290 470 303 L470 298 Q462 280 450 283 Q438 280 430 298 Z" fill="#1f2937" />
              <line x1="435" y1="344" x2="412" y2="356" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" />
              <line x1="465" y1="344" x2="486" y2="338" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" />
              <rect x="395" y="348" width="35" height="22" rx="4" fill="#1f2937" />
              <rect x="398" y="350" width="30" height="16" rx="3" fill="#374151" />
              <line x1="400" y1="355" x2="425" y2="355" stroke="#4ade80" strokeWidth="1.5" opacity="0.8" />
              <line x1="400" y1="360" x2="420" y2="360" stroke="#4ade80" strokeWidth="1.5" opacity="0.6" />
              <rect x="437" y="375" width="12" height="25" rx="5" fill="#1f2937" />
              <rect x="455" y="375" width="12" height="25" rx="5" fill="#1f2937" />
              <rect x="433" y="396" width="18" height="8" rx="4" fill="#374151" />
              <rect x="451" y="396" width="18" height="8" rx="4" fill="#374151" />
            </g>

            {/* Gears - scaled */}
            <g opacity="0.7">
              <circle cx="95" cy="250" r="22" fill="none" stroke="#16a34a" strokeWidth="3.5" />
              <circle cx="95" cy="250" r="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
              {[0, 90, 180, 270].map((deg, i) => (
                <line key={i}
                  x1={95 + 27 * Math.cos((deg * Math.PI) / 180)}
                  y1={250 + 27 * Math.sin((deg * Math.PI) / 180)}
                  x2={95 + 18 * Math.cos((deg * Math.PI) / 180)}
                  y2={250 + 18 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round"
                />
              ))}
            </g>

            {/* Arrows - scaled */}
            <g style={{ animation: "arrowBounce 1.5s ease-in-out infinite" }}>
              <path d="M490 210 L490 160 M490 160 L478 176 M490 160 L502 176" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g style={{ animation: "arrowBounce 1.5s 0.3s ease-in-out infinite" }}>
              <path d="M515 235 L515 195 M515 195 L504 208 M515 195 L526 208" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            </g>

            {/* Floating badge — NIFTY - scaled */}
            <rect x="380" y="110" width="135" height="48" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
            <circle cx="405" cy="134" r="10" fill="#dcfce7" />
            <text x="405" y="139" textAnchor="middle" fontSize="13" fontWeight="700" fill="#16a34a">↑</text>
            <text x="425" y="129" fontSize="11" fontWeight="700" fill="#374151">NIFTY 50</text>
            <text x="425" y="144" fontSize="14" fontWeight="800" fill="#16a34a">+2.4%</text>

            {/* Floating badge — Signal - scaled */}
            <rect x="70" y="175" width="130" height="42" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
            <circle cx="92" cy="196" r="9" fill="#dcfce7" />
            <text x="92" y="201" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a">★</text>
            <text x="110" y="191" fontSize="11" fontWeight="700" fill="#374151">Top Signal</text>
            <text x="110" y="205" fontSize="12" fontWeight="700" fill="#6b7280">94% acc.</text>
          </svg>
        </div>

      </div>

      <style>{`
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes arrowBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
      `}</style>
    </section>
  );
}




