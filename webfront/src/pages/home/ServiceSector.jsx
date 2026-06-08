import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// SVG icons styled like Finology — black outline + green accent fill
const icons = {
    learn: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <rect x="14" y="12" width="36" height="46" rx="3" fill="#22c55e" opacity="0.25" />
            <rect x="18" y="8" width="36" height="46" rx="3" fill="white" stroke="#111" strokeWidth="2.5" />
            <line x1="26" y1="22" x2="46" y2="22" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="30" x2="46" y2="30" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="38" x2="38" y2="38" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <rect x="28" y="44" width="16" height="10" rx="2" fill="#22c55e" />
            <circle cx="56" cy="52" r="10" fill="#22c55e" opacity="0.3" />
            <circle cx="56" cy="52" r="6" fill="#22c55e" />
            <path d="M53 52l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    screen: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <circle cx="38" cy="36" r="20" fill="white" stroke="#111" strokeWidth="2.5" />
            <circle cx="38" cy="36" r="20" fill="#22c55e" opacity="0.15" />
            <path d="M38 20 A16 16 0 0 1 54 36" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="28" x2="46" y2="28" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <line x1="28" y1="36" x2="48" y2="36" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="44" x2="46" y2="44" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <circle cx="52" cy="50" r="5" fill="#22c55e" />
            <line x1="55.5" y1="53.5" x2="62" y2="60" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    ),
    coach: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <circle cx="30" cy="26" r="12" fill="#22c55e" opacity="0.2" stroke="#111" strokeWidth="2.5" />
            <circle cx="30" cy="26" r="12" fill="white" stroke="#111" strokeWidth="2.5" />
            <circle cx="30" cy="24" r="5" fill="#111" />
            <path d="M18 44c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="44" y="30" width="22" height="16" rx="3" fill="#22c55e" opacity="0.3" stroke="#111" strokeWidth="2" />
            <line x1="49" y1="36" x2="61" y2="36" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="49" y1="41" x2="57" y2="41" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M44 46l4 4" stroke="#111" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    capital: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <rect x="16" y="28" width="48" height="32" rx="4" fill="white" stroke="#111" strokeWidth="2.5" />
            <rect x="16" y="28" width="48" height="32" rx="4" fill="#22c55e" opacity="0.1" />
            <path d="M16 38h48" stroke="#111" strokeWidth="2" />
            <circle cx="40" cy="50" r="6" fill="#22c55e" />
            <rect x="38" y="48" width="4" height="4" rx="1" fill="white" />
            <path d="M28 28v-4a12 12 0 0 1 24 0v4" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    ),
    loss: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <path d="M40 10 L64 22 V40 C64 54 52 64 40 68 C28 64 16 54 16 40 V22 Z" fill="#22c55e" opacity="0.15" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M40 14 L60 25 V40 C60 52 50 61 40 64 C30 61 20 52 20 40 V25 Z" fill="white" />
            <path d="M31 40l6 6 12-12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    signals: (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
            <rect x="12" y="48" width="10" height="20" rx="2" fill="#22c55e" opacity="0.4" stroke="#111" strokeWidth="2" />
            <rect x="28" y="36" width="10" height="32" rx="2" fill="#22c55e" opacity="0.6" stroke="#111" strokeWidth="2" />
            <rect x="44" y="24" width="10" height="44" rx="2" fill="#22c55e" stroke="#111" strokeWidth="2" />
            <rect x="60" y="14" width="10" height="54" rx="2" fill="#22c55e" stroke="#111" strokeWidth="2" opacity="0.8" />
            <circle cx="17" cy="42" r="4" fill="#22c55e" />
            <circle cx="33" cy="30" r="4" fill="#22c55e" />
            <circle cx="49" cy="18" r="4" fill="#22c55e" />
            <polyline points="17,42 33,30 49,18" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 2" />
        </svg>
    ),
};

const services = [
    { id: 1, icon: "learn", title: "Learn Investing", description: "Courses that simplify it", path: "/courses" },
    { id: 2, icon: "screen", title: "Screen Stocks", description: "Now made easy", path: "/map" },
    { id: 3, icon: "coach", title: "Coach Support", description: "Expert guidance", path: "/support" },
    { id: 4, icon: "capital", title: "Capital Lock", description: "Secure your funds", path: "/capital-lock" },
    { id: 5, icon: "loss", title: "Loss Protection", description: "Safeguard investments", path: "/loss-protection" },
    { id: 6, icon: "signals", title: "Trading Signals", description: "Actionable insights", path: "/signals" },
];

export default function InvestHelp() {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
        }
    };

    return (
        <section className="w-full bg-gray-50 py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-10 sm:mb-12">
                    <h2
                        className="text-gray-900 mb-3"
                        style={{
                            fontFamily: "'Aileron', 'Arial Black', sans-serif",
                            fontSize: "clamp(28px, 4vw, 42px)",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                        }}
                    >
                        What are you{" "}
                        <span style={{ color: "#16a34a" }}>here for?</span>
                    </h2>
                    <p
                        className="text-gray-500 max-w-lg mx-auto"
                        style={{
                            fontFamily: "'Hind Siliguri', sans-serif",
                            fontSize: 17,
                            fontWeight: 400,
                        }}
                    >
                        InvestBay is here to help. Choose from below and start your journey.
                    </p>
                </div>

                {/* Scroll container + arrows */}
                <div className="relative group/scroll" style={{ overflow: "visible" }}>
                    {/* Left arrow */}
                    <button
                        onClick={() => scroll(-1)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:border-green-300 hover:text-green-600 transition-all duration-200 opacity-0 group-hover/scroll:opacity-100"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Cards track */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingTop: 12, paddingBottom: 12 }}
                    >
                        {services.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => navigate(s.path)}
                                onMouseEnter={() => setHovered(s.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="flex-shrink-0 cursor-pointer"
                                style={{ width: 200 }}
                            >
                                <div
                                    className={`relative bg-white rounded-2xl p-6 flex flex-col items-start transition-all duration-300 h-full ${hovered === s.id
                                            ? "border-2 border-green-400 shadow-[0_4px_20px_rgba(22,163,74,0.12)] -translate-y-1"
                                            : "border border-gray-200 shadow-sm"
                                        }`}
                                >
                                    {/* Checkmark badge — top right, visible on hover */}
                                    <div
                                        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${hovered === s.id
                                                ? "bg-green-500"
                                                : "bg-gray-100"
                                            }`}
                                    >
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <path
                                                d="M2 5l2.5 2.5L8 2.5"
                                                stroke={hovered === s.id ? "white" : "#9ca3af"}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    {/* Icon */}
                                    <div className="mb-5 mt-1">
                                        {icons[s.icon]}
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-gray-900 mb-1 leading-snug"
                                        style={{
                                            fontFamily: "'Aileron', 'Arial Black', sans-serif",
                                            fontSize: 15,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {s.title}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        className="text-gray-400"
                                        style={{
                                            fontFamily: "'Hind Siliguri', sans-serif",
                                            fontSize: 13,
                                            fontWeight: 400,
                                        }}
                                    >
                                        {s.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right arrow */}
                    <button
                        onClick={() => scroll(1)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:border-green-300 hover:text-green-600 transition-all duration-200 opacity-0 group-hover/scroll:opacity-100"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Dot indicators — mobile */}
                <div className="flex justify-center gap-1.5 mt-5 sm:hidden">
                    {services.map((s) => (
                        <span
                            key={s.id}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${hovered === s.id ? "bg-green-500 w-4" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>

            </div>

            <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
        </section>
    );
}