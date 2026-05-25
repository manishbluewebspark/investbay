import React, { useEffect, useRef, useState } from "react";
import { investData } from "../../data/investData";
import { FiTrendingUp, FiShield, FiUsers, FiHeadphones } from "react-icons/fi";

export default function InvestHelp() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: FiUsers, value: "50K+", label: "Active Users" },
    { icon: FiShield, value: "200+", label: "SEBI Analysts" },
    { icon: FiTrendingUp, value: "94%", label: "Success Rate" },
    { icon: FiHeadphones, value: "24/7", label: "Support" },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 px-6 bg-[#060b10] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          }}
        />
        
        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-emerald-500/[0.03] blur-[130px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-600/[0.02] blur-[100px]" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">
              Why InvestBay
            </span>
          </div>

          {/* Heading */}
          <h2 
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] max-w-4xl mx-auto transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-[#f0f4f8]">How InvestBay Helps</span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Investors & Traders
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400/40 via-emerald-300/20 to-transparent rounded-full blur-[2px]" />
            </span>
          </h2>

          <p 
            className={`text-lg text-slate-400/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Discover why thousands of investors trust our platform for their financial journey
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {investData.map((item, index) => (
            <div
              key={index}
              className={`transform transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: visible ? `${300 + index * 100}ms` : "0s" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className={`group/card relative h-full bg-white/[0.02] backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                  hoveredIndex !== null && hoveredIndex !== index
                    ? 'opacity-40 scale-[0.97] blur-[1px] border-white/[0.04]'
                    : 'opacity-100 scale-100 blur-0 border-white/[0.06] hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5'
                }`}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-emerald-500/5 opacity-0 group-hover/card:opacity-100 transition-all duration-500 group-hover/card:rotate-45" />

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover/card:bg-emerald-500/20 group-hover/card:border-emerald-400/30 group-hover/card:shadow-[0_0_32px_rgba(0,230,118,0.15)] transition-all duration-300">
                    <img 
                      src={item.icon} 
                      alt={item.title} 
                      className="w-8 h-8 object-contain brightness-150 saturate-150 transition-all duration-300 group-hover/card:scale-110 group-hover/card:brightness-200" 
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-1 rounded-2xl border border-emerald-500/10 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-[#f0f4f8] mb-3 group-hover/card:text-emerald-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover/card:text-slate-300 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                {/* Bottom line indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto transition-all duration-700 delay-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="group/stat relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-6 text-center transition-all duration-300 hover:bg-emerald-500/[0.03] hover:border-emerald-500/20 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <stat.icon className="w-6 h-6 text-slate-500 group-hover/stat:text-emerald-400 transition-colors duration-300" />
              </div>
              
              {/* Value */}
              <div className="text-3xl font-extrabold text-[#f0f4f8] mb-1 group-hover/stat:text-emerald-400 transition-colors duration-300">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-xs text-slate-500 font-medium group-hover/stat:text-slate-400 transition-colors duration-300 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.05; }
        }
      `}</style>
    </section>
  );
}