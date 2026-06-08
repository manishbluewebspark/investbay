import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

// ── SVG Illustrations ──────────────────────────────────────────────────────
const SignalsIllustration = () => (
  <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Background blob */}
    <ellipse cx="320" cy="210" rx="240" ry="210" fill="#f0fdf4" />

    {/* Main floating card */}
    <rect x="80" y="40" width="360" height="280" rx="18" fill="white"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))" }} />
    {/* Card top strip */}
    <rect x="80" y="40" width="360" height="44" rx="18" fill="#f9fafb" />
    <rect x="80" y="66" width="360" height="18" fill="#f9fafb" />
    <circle cx="104" cy="62" r="6" fill="#fca5a5" />
    <circle cx="122" cy="62" r="6" fill="#fde68a" />
    <circle cx="140" cy="62" r="6" fill="#86efac" />
    <rect x="356" y="50" width="72" height="20" rx="6" fill="#dcfce7" />
    <circle cx="368" cy="60" r="4" fill="#22c55e" />
    <text x="376" y="64" fontSize="9" fontWeight="700" fill="#15803d">LIVE FEED</text>

    {/* Signal rows */}
    {[
      { y: 106, ticker: "RELIANCE", sub: "NSE · Equity",   type: "BUY",  ret: "+14.2%", colG: "#16a34a", bg: "#dcfce7", init: "RL" },
      { y: 158, ticker: "HDFC BANK",sub: "NSE · Banking",  type: "BUY",  ret: "+9.8%",  colG: "#16a34a", bg: "#dcfce7", init: "HB" },
      { y: 210, ticker: "INFY",     sub: "NSE · IT",       type: "HOLD", ret: "+3.1%",  colG: "#ca8a04", bg: "#fef9c3", init: "IF" },
      { y: 262, ticker: "TCS",      sub: "NSE · IT",       type: "BUY",  ret: "+11.5%", colG: "#16a34a", bg: "#dcfce7", init: "TC" },
    ].map((r, i) => (
      <g key={i}>
        <rect x="96" y={r.y} width="32" height="32" rx="8" fill={r.bg} />
        <text x="112" y={r.y + 21} textAnchor="middle" fontSize="9" fontWeight="800" fill={r.colG}>{r.init}</text>
        <text x="140" y={r.y + 14} fontSize="11" fontWeight="700" fill="#111827">{r.ticker}</text>
        <text x="140" y={r.y + 27} fontSize="9" fill="#9ca3af">{r.sub}</text>
        <rect x="256" y={r.y + 6} width="40" height="20" rx="6" fill={r.bg} />
        <text x="276" y={r.y + 20} textAnchor="middle" fontSize="9" fontWeight="700" fill={r.colG}>{r.type}</text>
        <text x="380" y={r.y + 20} textAnchor="middle" fontSize="13" fontWeight="800" fill={r.colG}>{r.ret}</text>
        {i < 3 && <rect x="96" y={r.y + 40} width="328" height="1" fill="#f3f4f6" />}
      </g>
    ))}

    {/* Small floating badge bottom-left */}
    <rect x="30" y="260" width="130" height="52" rx="12" fill="white"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.08))" }} />
    <circle cx="58" cy="286" r="14" fill="#dcfce7" />
    <text x="58" y="291" textAnchor="middle" fontSize="11" fill="#16a34a">↑</text>
    <text x="80" y="280" fontSize="9" fill="#9ca3af">Accuracy</text>
    <text x="80" y="294" fontSize="14" fontWeight="800" fill="#16a34a">94.2%</text>

    {/* Small floating badge top-right */}
    <rect x="370" y="20" width="130" height="52" rx="12" fill="white"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.08))" }} />
    <circle cx="398" cy="46" r="14" fill="#dcfce7" />
    <text x="398" y="51" textAnchor="middle" fontSize="9" fontWeight="700" fill="#16a34a">200+</text>
    <text x="420" y="40" fontSize="9" fill="#9ca3af">Analysts</text>
    <text x="420" y="54" fontSize="10" fontWeight="700" fill="#374151">SEBI Reg.</text>
  </svg>
);

const MentorsIllustration = () => (
  <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="200" cy="210" rx="240" ry="210" fill="#f0fdf4" />

    {/* Main card */}
    <rect x="80" y="30" width="360" height="300" rx="18" fill="white"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))" }} />
    <rect x="80" y="30" width="360" height="44" rx="18" fill="#f9fafb" />
    <rect x="80" y="56" width="360" height="18" fill="#f9fafb" />
    <text x="104" y="57" fontSize="11" fontWeight="700" fill="#374151">Top Analysts</text>
    <rect x="352" y="38" width="72" height="20" rx="6" fill="#dcfce7" />
    <text x="388" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d">200+ Live</text>

    {[
      { y: 94,  init: "RK", iC: "#16a34a", iB: "#dcfce7", name: "Rahul Kapoor", role: "F&O Expert",      acc: "94%", fol: "12.4K" },
      { y: 172, init: "SM", iC: "#d97706", iB: "#fef3c7", name: "Sneha Mehta",  role: "Long-term Value", acc: "91%", fol: "8.1K"  },
      { y: 250, init: "AP", iC: "#7c3aed", iB: "#ede9fe", name: "Arjun Pandey", role: "Swing Trading",   acc: "88%", fol: "6.7K"  },
    ].map((m, i) => (
      <g key={i}>
        <circle cx="120" cy={m.y + 28} r="26" fill={m.iB} />
        <text x="120" y={m.y + 33} textAnchor="middle" fontSize="13" fontWeight="800" fill={m.iC}>{m.init}</text>
        <text x="158" y={m.y + 20} fontSize="12" fontWeight="700" fill="#111827">{m.name}</text>
        <rect x="158" y={m.y + 26} width="72" height="16" rx="5" fill="#f3f4f6" />
        <text x="194" y={m.y + 38} textAnchor="middle" fontSize="8" fill="#6b7280">{m.role}</text>
        <text x="292" y={m.y + 20} fontSize="9" fill="#9ca3af">Accuracy</text>
        <text x="292" y={m.y + 36} fontSize="14" fontWeight="800" fill="#16a34a">{m.acc}</text>
        <text x="374" y={m.y + 20} fontSize="9" fill="#9ca3af">Followers</text>
        <text x="374" y={m.y + 36} fontSize="12" fontWeight="700" fill="#374151">{m.fol}</text>
        {i < 2 && <rect x="96" y={m.y + 64} width="328" height="1" fill="#f3f4f6" />}
      </g>
    ))}

    {/* Floating badge */}
    <rect x="340" y="300" width="150" height="56" rx="12" fill="white"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.08))" }} />
    <circle cx="368" cy="328" r="14" fill="#fef3c7" />
    <text x="368" y="333" textAnchor="middle" fontSize="11" fill="#d97706">★</text>
    <text x="390" y="320" fontSize="9" fill="#9ca3af">Avg. Rating</text>
    <text x="390" y="336" fontSize="14" fontWeight="800" fill="#374151">4.8 / 5</text>
    <text x="390" y="348" fontSize="8" fill="#9ca3af">from 8,400+ reviews</text>
  </svg>
);

const CoursesIllustration = () => (
  <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="320" cy="210" rx="240" ry="210" fill="#f0fdf4" />

    {/* Main card */}
    <rect x="80" y="30" width="360" height="300" rx="18" fill="white"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))" }} />
    <rect x="80" y="30" width="360" height="44" rx="18" fill="#f9fafb" />
    <rect x="80" y="56" width="360" height="18" fill="#f9fafb" />
    <text x="104" y="57" fontSize="11" fontWeight="700" fill="#374151">My Learning Path</text>

    {/* Overall progress */}
    <text x="104" y="98" fontSize="10" fontWeight="600" fill="#374151">Overall Progress</text>
    <rect x="104" y="106" width="256" height="8" rx="4" fill="#f3f4f6" />
    <rect x="104" y="106" width="166" height="8" rx="4" fill="#22c55e" />
    <text x="368" y="114" textAnchor="end" fontSize="10" fontWeight="700" fill="#16a34a">65%</text>

    {[
      { y: 132, title: "Stock Market Basics",      pct: 100, done: true  },
      { y: 182, title: "Fundamental Analysis",     pct: 72,  done: false },
      { y: 230, title: "Technical Analysis",       pct: 34,  done: false },
      { y: 278, title: "Options & F&O Strategies", pct: 0,   done: false },
    ].map((c, i) => (
      <g key={i}>
        <rect x="96" y={c.y} width="28" height="28" rx="7"
          fill={c.done ? "#dcfce7" : "#f9fafb"}
          stroke={c.done ? "#bbf7d0" : "#e5e7eb"} strokeWidth="1.2" />
        {c.done
          ? <path d={`M${96+7} ${c.y+14}l5 5 10-10`} stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          : <circle cx={96+14} cy={c.y+14} r="4" fill="#d1d5db" />
        }
        <text x="136" y={c.y + 17} fontSize="11" fontWeight={c.done ? "600" : "400"}
          fill={c.done ? "#374151" : "#6b7280"}>{c.title}</text>
        <rect x="288" y={c.y + 8} width="104" height="8" rx="4" fill="#f3f4f6" />
        {c.pct > 0 && <rect x="288" y={c.y + 8} width={c.pct > 104 ? 104 : c.pct} height="8" rx="4" fill={c.done ? "#22c55e" : "#4ade80"} />}
        <text x="400" y={c.y + 17} fontSize="9" fontWeight="600"
          fill={c.done ? "#16a34a" : "#9ca3af"}>{c.pct}%</text>
        {i < 3 && <rect x="96" y={c.y + 36} width="328" height="1" fill="#f3f4f6" />}
      </g>
    ))}

    {/* Floating cert badge */}
    <rect x="20" y="280" width="130" height="60" rx="12" fill="white"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.08))" }} />
    <circle cx="50" cy="310" r="16" fill="#dcfce7" />
    <text x="50" y="315" textAnchor="middle" fontSize="13" fill="#16a34a">✓</text>
    <text x="74" y="303" fontSize="9" fill="#9ca3af">Certificate</text>
    <text x="74" y="317" fontSize="10" fontWeight="700" fill="#374151">On Completion</text>
  </svg>
);

const LossProtectionIllustration = () => (
  <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="200" cy="210" rx="240" ry="210" fill="#f0fdf4" />

    {/* Main card */}
    <rect x="80" y="24" width="360" height="310" rx="18" fill="white"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))" }} />
    <rect x="80" y="24" width="360" height="44" rx="18" fill="#f9fafb" />
    <rect x="80" y="50" width="360" height="18" fill="#f9fafb" />
    <text x="104" y="51" fontSize="11" fontWeight="700" fill="#374151">Portfolio Shield</text>
    <rect x="348" y="32" width="80" height="20" rx="6" fill="#dcfce7" />
    <text x="388" y="46" textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d">Protected ✓</text>

    {/* Central shield */}
    <path d="M260 88 L308 106 V148 C308 184 286 200 260 210 C234 200 212 184 212 148 V106 Z"
      fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M244 148l10 10 20-20" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Capital protected label */}
    <text x="260" y="240" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6b7280">Capital Protected</text>
    <text x="260" y="262" textAnchor="middle" fontSize="22" fontWeight="800" fill="#16a34a">₹2,40,000</text>

    {/* 3 stat pills */}
    {[
      { x: 92,  label: "Stop-Loss Active", val: "4 Stocks" },
      { x: 212, label: "Max Drawdown",     val: "-8.2%"    },
      { x: 332, label: "Insurance Cover",  val: "Active"   },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="284" width="108" height="36" rx="8" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
        <text x={s.x + 54} y="297" textAnchor="middle" fontSize="8" fill="#9ca3af">{s.label}</text>
        <text x={s.x + 54} y="312" textAnchor="middle" fontSize="10" fontWeight="700"
          fill={i === 2 ? "#16a34a" : "#374151"}>{s.val}</text>
      </g>
    ))}

    {/* Floating alert badge */}
    <rect x="350" y="200" width="150" height="56" rx="12" fill="white"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.08))" }} />
    <rect x="366" y="216" width="24" height="24" rx="6" fill="#fef3c7" />
    <text x="378" y="232" textAnchor="middle" fontSize="12" fill="#d97706">!</text>
    <text x="400" y="226" fontSize="9" fill="#9ca3af">Alert Sent</text>
    <text x="400" y="240" fontSize="10" fontWeight="700" fill="#374151">Stop-loss hit</text>
    <text x="400" y="252" fontSize="8" fill="#16a34a">Capital saved ✓</text>
  </svg>
);

const products = [
  {
    id: 1,
    problem: "Social media tips are not investment signals.",
    solution: "Get real-time SEBI-verified signals with InvestBay.",
    description: "Access 200+ SEBI-registered analysts and their live trading signals — filtered, verified, and backtested.",
    hashtag: "#ForInvestors",
    cta: "Explore Signals",
    path: "/signals",
    Illustration: SignalsIllustration,
  },
  {
    id: 2,
    problem: "Finding a trustworthy stock advisor is near impossible.",
    solution: "Connect with verified research analysts on InvestBay.",
    description: "Browse 200+ SEBI-registered mentors, their track records, strategies, and live calls. Pick your mentor.",
    hashtag: "#ForInvestors",
    cta: "Find a Mentor",
    path: "/mentors",
    Illustration: MentorsIllustration,
  },
  {
    id: 3,
    problem: "Gambling in a rising market is not investing.",
    solution: "Learn the right ways with InvestBay Courses.",
    description: "Unlearn guesswork with investing concepts you can actually apply. Beginner to advanced, all in one place.",
    hashtag: "#ForInvestors",
    cta: "Start Learning",
    path: "/courses",
    Illustration: CoursesIllustration,
  },
  {
    id: 4,
    problem: "You don't know when to cut losses before it's too late.",
    solution: "Protect your capital with InvestBay Loss Shield.",
    description: "Automated stop-loss alerts, portfolio insurance tools, and downside protection strategies curated by SEBI analysts.",
    hashtag: "#ForInvestors",
    cta: "Protect Now",
    path: "/loss-protection",
    Illustration: LossProtectionIllustration,
  },
];

function ProductRow({ product, index }) {
  const [ref, visible] = useInView(0.1);
  const navigate = useNavigate();
  const isEven = index % 2 === 0;
  const { Illustration } = product;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-16 lg:gap-24 py-20 lg:py-28 border-b border-gray-100 last:border-0 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {/* ── Text ── */}
      <div className="flex-1 w-full max-w-[480px]">
        {/* Problem */}
        <p
          className="mb-1"
          style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, color: "#6b7280" }}
        >
          <span
            className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-widest uppercase mr-2"
            style={{ background: "#111827", color: "white" }}
          >
            Problem
          </span>
          {product.problem}
        </p>

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 my-5" />

        {/* Solution */}
        <p
          className="mb-1"
          style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, color: "#6b7280" }}
        >
          <span
            className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-widest uppercase mr-2"
            style={{ background: "#16a34a", color: "white" }}
          >
            Solution
          </span>
        </p>

        {/* Bold solution heading */}
        <h3
          className="mt-2 mb-4 leading-snug text-gray-900"
          style={{
            fontFamily: "'Aileron', 'Arial Black', sans-serif",
            fontSize: "clamp(20px, 2.4vw, 26px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          {product.solution}
        </h3>

        {/* Description */}
        <p
          className="leading-relaxed mb-8"
          style={{
            fontFamily: "'Hind Siliguri', sans-serif",
            fontSize: 15,
            color: "#6b7280",
            lineHeight: 1.75,
          }}
        >
          {product.description}{" "}
          <strong style={{ color: "#374151" }}>{product.hashtag}.</strong>
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate(product.path)}
          className="group inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl text-[14px] font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: "#111827" }}
          onMouseEnter={e => e.currentTarget.style.background = "#16a34a"}
          onMouseLeave={e => e.currentTarget.style.background = "#111827"}
        >
          {product.cta}
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ── Illustration ── */}
      <div className="flex-1 w-full max-w-[520px]">
        <div className="w-full aspect-[520/420]">
          <Illustration />
        </div>
      </div>
    </div>
  );
}

export default function ProductsForInvestors() {
  const [headerRef, headerVisible] = useInView(0.2);

  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">

        {/* Header */}
        <div
          ref={headerRef}
          className={`transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2
            className="text-gray-900 mb-3 leading-tight"
            style={{
              fontFamily: "'Aileron', 'Arial Black', sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            Products for Investors
          </h2>
          <p
            style={{
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: 17,
              color: "#6b7280",
              fontWeight: 400,
            }}
          >
            Solving Investors' problems every day.
          </p>
        </div>

        {/* Rows */}
        {products.map((product, index) => (
          <ProductRow key={product.id} product={product} index={index} />
        ))}

      </div>
    </section>
  );
}