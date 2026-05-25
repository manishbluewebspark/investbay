import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch, IoIosArrowForward } from "react-icons/io";
import { FiUsers, FiTrendingUp, FiAward } from "react-icons/fi";
import Shield from "../../assets/icon/shield.svg";
import Right from "../../assets/icon/right.svg";
import Trade from "../../assets/icon/trade.svg";

const WORDS = ["Stock Advisor", "SEBI Analyst", "Trading Signal", "Market Mentor"];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* typewriter */
  useEffect(() => {
    const word = WORDS[wordIdx];
    let t;
    if (!deleting && charIdx < word.length) {
      t = setTimeout(() => {
        setText(word.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 80);
    } else if (!deleting && charIdx === word.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      t = setTimeout(() => {
        setText(word.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 45);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  /* particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.35 + 0.08,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,230,118,${0.05 * (1 - d / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        p.pulse += p.pulseSpeed;
        const pulseScale = 1 + Math.sin(p.pulse) * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulseScale, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0, p.x, p.y, p.r * pulseScale * 2
        );
        gradient.addColorStop(0, `rgba(0,230,118,${p.o})`);
        gradient.addColorStop(1, "rgba(0,230,118,0)");
        ctx.fillStyle = gradient;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20 || p.x > canvas.width + 20) p.vx *= -1;
        if (p.y < -20 || p.y > canvas.height + 20) p.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const stats = [
    { icon: FiUsers, label: "Active Traders", value: "50K+", color: "#00e676" },
    { icon: FiTrendingUp, label: "Success Rate", value: "94%", color: "#00c853" },
    { icon: FiAward, label: "SEBI Registered", value: "200+", color: "#69f0ae" },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#060b10] flex flex-col overflow-hidden font-sans">
      {/* Background Elements */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      {/* Animated Grid */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,230,118,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,230,118,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)',
          animation: 'grid-shift 20s linear infinite',
        }}
      />

      {/* Glow Orbs */}
      <div className="fixed w-[600px] h-[400px] -top-[100px] left-1/2 -translate-x-1/2 rounded-full pointer-events-none z-[1] blur-[100px] opacity-50 animate-[orb-float_8s_ease-in-out_infinite]" 
        style={{ background: 'radial-gradient(ellipse, rgba(0,230,118,0.12) 0%, transparent 70%)' }} 
      />
      <div className="fixed w-[400px] h-[500px] top-[30%] -left-[100px] rounded-full pointer-events-none z-[1] blur-[100px] opacity-40 animate-[orb-float_8s_ease-in-out_-3s_infinite]" 
        style={{ background: 'radial-gradient(ellipse, rgba(0,200,100,0.06) 0%, transparent 70%)' }} 
      />
      <div className="fixed w-[350px] h-[450px] top-[20%] -right-[80px] rounded-full pointer-events-none z-[1] blur-[100px] opacity-40 animate-[orb-float_8s_ease-in-out_-5s_infinite]" 
        style={{ background: 'radial-gradient(ellipse, rgba(100,200,255,0.05) 0%, transparent 70%)' }} 
      />

      {/* Ticker */}
      <div className="relative z-20 mt-[72px] bg-black/40 backdrop-blur-xl border-b border-emerald-500/10 py-2.5 overflow-hidden flex-shrink-0">
        <div className="flex gap-16 w-max animate-[ticker-scroll_35s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 text-[15px] font-medium tracking-wider text-slate-300/55 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
              This is a technology-driven platform for educational and informational purposes only. We do not provide any buy/sell recommendations, investment advice, or stock market tips. Please consult your financial advisor before making any investment decisions.
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10 sm:py-16">
        <div className="max-w-[900px] w-full text-center">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md mb-9 transition-all duration-600 ease-out ${
            mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(0,230,118,0.5)] animate-[badge-glow_2s_ease-in-out_infinite]" />
            <span className="text-[13px] font-semibold tracking-wide text-emerald-300">
              Trusted by 50,000+ active traders
            </span>
          </div>

          {/* Heading */}
          <div className={`transition-all duration-700 ease-out delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
            <h1 className="font-['Instrument_Serif',_Georgia,_serif] italic font-normal text-[clamp(40px,7.5vw,84px)] leading-[1.08] -tracking-[0.03em] text-[#f0f4f8] mb-1">
              Find the Right{" "}
              <span className="bg-gradient-to-br from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                {text}
                <span className="inline-block w-[3px] h-[0.75em] bg-gradient-to-b from-emerald-400 to-emerald-300 align-middle ml-1 rounded-sm animate-[cursor-blink_0.9s_step-end_infinite]" />
              </span>
              <br />
              <span className="font-['Instrument_Serif',_Georgia,_serif] italic font-normal text-[clamp(40px,7.5vw,84px)] bg-gradient-to-br from-[#f0f4f8] via-[#d0dae5] to-[#f0f4f8] bg-clip-text text-transparent block">
                for Your Investment Journey
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className={`mt-6 text-[clamp(15px,2vw,18px)] leading-relaxed text-slate-300/75 max-w-[550px] mx-auto transition-all duration-700 ease-out delay-350 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Access verified research analysts, real-time signals, and expert insights — all curated in one powerful platform.
          </p>

          {/* Search */}
          <div className={`mt-11 transition-all duration-700 ease-out delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}>
            <div className={`flex items-stretch bg-white/[0.03] border-[1.5px] rounded-2xl overflow-hidden max-w-[680px] mx-auto shadow-2xl shadow-black/30 transition-all duration-300 ${
              isSearchFocused 
                ? "border-emerald-500/30 shadow-[0_0_0_4px_rgba(0,230,118,0.06),0_12px_40px_rgba(0,0,0,0.3)] bg-white/[0.04]" 
                : "border-white/[0.08]"
            }`}>
              <div className="flex items-center flex-1 px-5 min-h-[60px] gap-3">
                <IoIosSearch className={`text-[22px] flex-shrink-0 transition-colors duration-300 ${
                  isSearchFocused ? "text-emerald-400/60" : "text-slate-400/40"
                }`} />
                <input
                  type="text"
                  placeholder="Search analysts, signals, courses…"
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#f0f4f8] placeholder:text-slate-400/35 font-sans"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
              <div className="w-px bg-white/[0.06] my-3.5 flex-shrink-0 hidden sm:block" />
              <select
                className="px-5 bg-transparent border-none outline-none text-[13.5px] font-medium text-slate-300/70 cursor-pointer min-w-[150px] hover:text-slate-100 transition-colors duration-300 font-sans hidden sm:block"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option className="bg-[#0d1117] text-[#eef2f7]">All Categories</option>
                <option className="bg-[#0d1117] text-[#eef2f7]">Stocks</option>
                <option className="bg-[#0d1117] text-[#eef2f7]">F&O</option>
                <option className="bg-[#0d1117] text-[#eef2f7]">Mutual Funds</option>
                <option className="bg-[#0d1117] text-[#eef2f7]">Commodities</option>
              </select>
              <div className="p-2 flex-shrink-0">
                <button className="group flex items-center gap-1.5 bg-gradient-to-br from-emerald-400 to-emerald-600 text-[#050a0e] border-none px-7 h-11 rounded-xl text-sm font-bold tracking-wide cursor-pointer transition-all duration-300 whitespace-nowrap shadow-[0_4px_16px_rgba(0,230,118,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,230,118,0.35)] active:translate-y-0">
                  Explore
                  <IoIosArrowForward className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`mt-9 flex justify-center gap-6 sm:gap-10 flex-wrap transition-all duration-700 ease-out delay-650 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] cursor-default transition-all duration-300 hover:bg-emerald-500/5 hover:border-emerald-500/15 hover:-translate-y-0.5"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}15` }}
                >
                  <stat.icon style={{ color: stat.color, fontSize: 16 }} />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-[#f0f4f8] leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Pills */}
          <div className={`mt-5 flex flex-wrap justify-center gap-2.5 transition-all duration-700 ease-out delay-800 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}>
            {[
              { icon: Shield, label: "SEBI Registered" },
              { icon: Right, label: "Verified Track Record" },
              { icon: Trade, label: "Zero False Promises" },
            ].map((pill, idx) => (
              <span
                key={idx}
                className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.025] border border-white/[0.06] text-[12.5px] font-medium text-slate-300/65 cursor-default transition-all duration-300 hover:bg-emerald-500/6 hover:border-emerald-500/20 hover:text-emerald-100/85 hover:-translate-y-px"
              >
                <img
                  src={pill.icon}
                  alt=""
                  className="w-3.5 h-3.5 opacity-70 brightness-[1.5] saturate-50 transition-all duration-300 group-hover:opacity-100 group-hover:brightness-[1.8] group-hover:saturate-[0.8]"
                />
                {pill.label}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      {/* <div className="relative z-20 py-4 px-6 bg-black/40 backdrop-blur-xl border-t border-white/[0.05] text-center flex-shrink-0">
        <p className="text-[11px] leading-relaxed text-slate-400/45 max-w-[780px] mx-auto tracking-wide">
          <strong className="font-semibold text-slate-400/60">Disclaimer:</strong>{" "}
          This technology-driven platform serves educational and informational purposes only. We do not offer buy/sell recommendations, investment advice, or stock market tips. Always consult your financial advisor before making investment decisions.
        </p>
      </div> */}

      {/* Animations */}
      <style>{`
        @keyframes grid-shift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(64px, 64px); }
        }
        @keyframes orb-float {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); }
          25% { transform: translateX(-50%) translateY(-20px) scale(1.05); }
          50% { transform: translateX(-50%) translateY(0) scale(0.95); }
          75% { transform: translateX(-50%) translateY(20px) scale(1.05); }
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes badge-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(0,230,118,0.3); }
          50% { box-shadow: 0 0 20px rgba(0,230,118,0.7); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </section>
  );
}