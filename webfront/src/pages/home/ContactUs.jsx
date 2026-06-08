import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FaqIcon = ({ white }) => (
  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <path d="M12 20 Q12 10 22 10 H62 Q72 10 72 20 V52 Q72 62 62 62 H38 L22 76 V62 H22 Q12 62 12 52 Z"
      fill={white ? "rgba(255,255,255,0.08)" : "white"} stroke={white ? "white" : "#111"} strokeWidth="3" strokeLinejoin="round" />
    <path d="M36 38 Q36 30 44 30 H74 Q82 30 82 38 V58 Q82 66 74 66 H64 L56 78 V66 H44 Q36 66 36 58 Z"
      fill="#22c55e" stroke={white ? "#22c55e" : "#111"} strokeWidth="2.5" strokeLinejoin="round" />
    <text x="30" y="46" fontSize="20" fontWeight="900" fill={white ? "white" : "#111"} fontFamily="Arial Black">Q</text>
    <text x="52" y="58" fontSize="17" fontWeight="900" fill="white" fontFamily="Arial Black">A</text>
  </svg>
);

const CallIcon = ({ white }) => (
  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <path d="M24 18 C24 18 30 14 34 18 L42 30 C44 34 42 38 38 40 C36 41 35 42 36 44 C38 50 46 58 52 60 C54 61 55 60 56 58 C58 54 62 52 66 54 L78 62 C82 66 78 72 78 72 C72 80 58 82 46 70 C34 58 16 42 24 18 Z"
      fill={white ? "rgba(255,255,255,0.08)" : "#f0fdf4"} stroke={white ? "white" : "#111"} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="66" cy="26" r="12" fill={white ? "rgba(255,255,255,0.1)" : "white"} stroke={white ? "white" : "#111"} strokeWidth="2.5" />
    <circle cx="66" cy="23" r="4" fill={white ? "white" : "#111"} />
    <path d="M58 34 C58 30 61.6 28 66 28 C70.4 28 74 30 74 34" stroke={white ? "white" : "#111"} strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const EmailIcon = ({ white }) => (
  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <rect x="10" y="22" width="68" height="50" rx="6" fill={white ? "rgba(255,255,255,0.08)" : "white"} stroke={white ? "white" : "#111"} strokeWidth="3" />
    <path d="M10 28 L44 52 L78 28" stroke={white ? "white" : "#111"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M60 60 L86 72 L74 48 Z" fill="#22c55e" stroke={white ? "#22c55e" : "#111"} strokeWidth="2" strokeLinejoin="round" />
    <line x1="68" y1="58" x2="80" y2="63" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChatIcon = ({ white }) => (
  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <rect x="8" y="14" width="60" height="44" rx="10" fill={white ? "rgba(255,255,255,0.08)" : "white"} stroke={white ? "white" : "#111"} strokeWidth="3" />
    <line x1="20" y1="30" x2="56" y2="30" stroke={white ? "white" : "#111"} strokeWidth="3" strokeLinecap="round" />
    <line x1="20" y1="40" x2="48" y2="40" stroke={white ? "white" : "#111"} strokeWidth="3" strokeLinecap="round" />
    <path d="M20 58 L14 72 L32 60" fill={white ? "rgba(255,255,255,0.08)" : "white"} stroke={white ? "white" : "#111"} strokeWidth="2.5" strokeLinejoin="round" />
    <rect x="46" y="46" width="42" height="30" rx="8" fill="#22c55e" stroke={white ? "#22c55e" : "#111"} strokeWidth="2.5" />
    <line x1="54" y1="58" x2="80" y2="58" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="54" y1="66" x2="72" y2="66" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M56 76 L50 86 L66 78" fill="#22c55e" stroke={white ? "#22c55e" : "#111"} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const CARDS = [
  {
    id: "faq",
    getIcon: (w) => <FaqIcon white={w} />,
    title: "Do-it-yourself",
    desc: "We might have your fixes already! Read FAQs.",
    action: "Browse FAQs",
    path: "/support",
    darkDefault: false,
  },
  {
    id: "call",
    getIcon: (w) => <CallIcon white={w} />,
    title: "Call us",
    badge: "OFFLINE",
    badgeOnline: false,
    desc: "Call is available from 10:30 AM to 6:30 PM on weekdays only.",
    action: "Schedule a Call",
    path: null,
    darkDefault: true,
  },
  {
    id: "email",
    getIcon: (w) => <EmailIcon white={w} />,
    title: "Email us",
    desc: "Want to attach screenshots? Write us on support@investbay.in",
    action: "Send Email",
    path: "mailto:support@investbay.in",
    darkDefault: false,
  },
  {
    id: "chat",
    getIcon: (w) => <ChatIcon white={w} />,
    title: "Login to Chat",
    desc: "Login and spin up this option on your phone, get help when on the go.",
    action: "Open Chat",
    path: "/login",
    darkDefault: false,
  },
];

export default function ContactUs() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleAction = (card) => {
    if (!card.path) return;
    if (card.path.startsWith("mailto:")) window.location.href = card.path;
    else navigate(card.path);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-gray-900 mb-3 leading-tight" style={{
            fontFamily: "'Aileron', 'Arial Black', sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-0.025em",
          }}>
            Contact us
          </h1>
          <p className="text-gray-500" style={{ fontSize: 17 }}>
            Ask your queries, we would love to help you
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CARDS.map((card) => {
            const isDark = card.darkDefault || hovered === card.id;
            const isHov = hovered === card.id;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleAction(card)}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: isDark ? "#111827" : "white",
                  border: isDark ? "1.5px solid #111827" : "1.5px solid #f0f0f0",
                  boxShadow: isDark
                    ? "0 8px 32px rgba(0,0,0,0.18)"
                    : "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Icon — white variant when dark */}
                <div className="mb-6 mt-2">
                  {card.getIcon(isDark)}
                </div>

                {/* Title + badge */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <h3 style={{
                    fontFamily: "'Aileron', 'Arial Black', sans-serif",
                    fontWeight: 900, fontSize: 17,
                    color: isDark ? "white" : "#111827",
                    letterSpacing: "-0.01em",
                  }}>
                    {card.title}
                  </h3>
                  {card.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase"
                      style={{
                        background: card.badgeOnline ? "#dcfce7" : "#374151",
                        color: card.badgeOnline ? "#15803d" : "#9ca3af",
                      }}>
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="leading-relaxed" style={{
                  fontSize: 13.5,
                  color: isDark ? "#9ca3af" : "#6b7280",
                  fontFamily: "'Hind Siliguri', sans-serif",
                  lineHeight: 1.65,
                }}>
                  {card.desc}
                </p>

                {/* CTA — always visible when hovered */}
                <div className={`mt-5 text-[12px] font-bold tracking-wide transition-all duration-200 ${isHov ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
                  style={{ color: "#22c55e" }}>
                  {card.action} →
                </div>
              </div>
            );
          })}
        </div>

        {/* Trustpilot bar */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-2 text-[14px] text-gray-500">
          <span>We're rated</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00b67a] text-white text-[13px] font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Trustpilot
          </span>
          <span>
            <strong className="text-gray-800">Excellent 4.6</strong> out of 5 on{" "}
            <a href="https://trustpilot.com" target="_blank" rel="noreferrer"
              className="text-[#00b67a] font-semibold hover:underline">
              Trustpilot
            </a>{" "}
            based on <strong className="text-gray-800">multiple reviews</strong>
          </span>
        </div>

      </div>
    </div>
  );
}