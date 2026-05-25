import React, { useEffect, useRef, useState } from "react";
import data from "../../data/testimonials.json";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const loopData = [...data, ...data];
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#060b10] overflow-hidden"
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
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 70%)',
          }}
        />
        
        {/* Glow Orbs */}
        <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-emerald-600/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center px-6 mb-16 space-y-4">
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
              Testimonials
            </span>
          </div>

          {/* Heading */}
          <h2 
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-[#f0f4f8]">What Our </span>
            <span className="relative">
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Users Say
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400/40 via-emerald-300/20 to-transparent rounded-full blur-[2px]" />
            </span>
          </h2>

          <p 
            className={`text-lg text-slate-400/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Real feedback from investors and traders using InvestBay
          </p>
        </div>

        {/* Marquee Rows */}
        <div className="flex flex-col gap-6 relative">
          {/* Edge Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#060b10] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#060b10] to-transparent z-20 pointer-events-none" />

          {/* Row 1 - Forward */}
          <div className="overflow-hidden">
            <div className="flex gap-5 w-max animate-[scroll-forward_60s_linear_infinite] hover:[animation-play-state:paused]">
              {loopData.map((item, i) => (
                <Card item={item} key={`r1-${i}`} />
              ))}
            </div>
          </div>

          {/* Row 2 - Reverse */}
          <div className="overflow-hidden">
            <div className="flex gap-5 w-max animate-[scroll-reverse_60s_linear_infinite] hover:[animation-play-state:paused]">
              {loopData.map((item, i) => (
                <Card item={item} key={`r2-${i}`} />
              ))}
            </div>
          </div>

          {/* Row 3 - Forward (slower) */}
          <div className="overflow-hidden">
            <div className="flex gap-5 w-max animate-[scroll-forward_80s_linear_infinite] hover:[animation-play-state:paused]">
              {loopData.map((item, i) => (
                <Card item={item} key={`r3-${i}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        @keyframes scroll-forward {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function Card({ item }) {
  return (
    <div className="group/card relative w-[340px] flex-shrink-0 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:bg-emerald-500/[0.04] hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
      
      {/* Quote icon */}
      <div className="absolute top-4 left-5 opacity-[0.08] group-hover/card:opacity-[0.15] transition-opacity duration-300">
        <Quote className="w-10 h-10 text-emerald-400 rotate-180" />
      </div>

      {/* Avatar */}
      <div className="flex justify-end mb-4">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20 group-hover/card:border-emerald-400/40 group-hover/card:shadow-[0_0_16px_rgba(0,230,118,0.15)] transition-all duration-300"
        />
      </div>

      {/* Review Text */}
      <p className="text-sm text-slate-400 leading-relaxed mb-5 group-hover/card:text-slate-300 transition-colors duration-300 line-clamp-4">
        {item.review}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] group-hover/card:border-emerald-500/10 transition-colors duration-300">
        {/* Stars */}
        <div className="flex gap-1">
          {[...Array(item.rating)].map((_, i) => (
            <Star 
              key={i} 
              className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 transition-transform duration-300 hover:scale-110" 
            />
          ))}
        </div>

        {/* Name Badge */}
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover/card:bg-emerald-500/20 group-hover/card:border-emerald-500/30 transition-all duration-300">
          {item.name}
        </span>
      </div>
    </div>
  );
}