import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Lock, TrendingUp, AlertOctagon, Check, ChevronDown } from "lucide-react";
import lottie from "lottie-web";
// Import your downloaded JSON file
import lossProtectionAnimation from "../assets/animations/Revenue.json";

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

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
            >
                <span className="font-['Aileron_Black'] font-bold text-sm text-gray-900">
                    {q}
                </span>
                <ChevronDown
                    className="flex-shrink-0 text-gray-400 transition-transform duration-300"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", width: 18, height: 18 }}
                />
            </button>
            {open && (
                <p className="pb-5 text-gray-500 text-sm leading-relaxed">
                    {a}
                </p>
            )}
        </div>
    );
}

// ── Step Illustrations ─────────────────────────────────────────────────────
const ConnectIllustration = () => (
    <svg viewBox="0 0 460 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="280" cy="180" rx="210" ry="180" fill="#f0fdf4" />
        <rect x="80" y="40" width="320" height="280" rx="18" fill="white" style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))" }} />
        <rect x="80" y="40" width="320" height="42" rx="18" fill="#f9fafb" />
        <rect x="80" y="64" width="320" height="18" fill="#f9fafb" />
        <circle cx="104" cy="61" r="5.5" fill="#fca5a5" />
        <circle cx="122" cy="61" r="5.5" fill="#fde68a" />
        <circle cx="140" cy="61" r="5.5" fill="#86efac" />
        <text x="180" y="65" fontSize="10" fontWeight="700" fill="#374151">Connect Broker</text>

        {/* Broker tiles */}
        {[
            { x: 104, y: 98, name: "Zerodha", col: "#387ed1", bg: "#eff6ff" },
            { x: 230, y: 98, name: "Upstox", col: "#6c47ff", bg: "#f5f3ff" },
            { x: 104, y: 168, name: "Angel One", col: "#e8622a", bg: "#fff7ed" },
            { x: 230, y: 168, name: "Fyers", col: "#16a34a", bg: "#f0fdf4" },
        ].map((b, i) => (
            <g key={i}>
                <rect x={b.x} y={b.y} width="112" height="56" rx="12" fill={b.bg} stroke="#e5e7eb" strokeWidth="1" />
                <text x={b.x + 56} y={b.y + 33} textAnchor="middle" fontSize="11" fontWeight="800" fill={b.col}>{b.name}</text>
            </g>
        ))}

        {/* Lock + AES badge */}
        <rect x="104" y="246" width="272" height="52" rx="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
        <circle cx="126" cy="272" r="14" fill="#dcfce7" />
        <rect x="119" y="268" width="14" height="10" rx="2" fill="#16a34a" />
        <path d="M121 268v-3a5 5 0 0 1 10 0v3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
        <text x="148" y="267" fontSize="10" fontWeight="700" fill="#374151">AES-256 Encrypted</text>
        <text x="148" y="281" fontSize="9" fill="#9ca3af">Your credentials are never stored</text>
        <text x="375" y="275" textAnchor="end" fontSize="9" fontWeight="600" fill="#16a34a">Secure ✓</text>
    </svg>
);

const LimitIllustration = () => (
    <svg viewBox="0 0 460 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="180" cy="180" rx="210" ry="180" fill="#fef9c3" opacity="0.5" />
        <rect x="80" y="30" width="320" height="300" rx="18" fill="white" style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))" }} />
        <rect x="80" y="30" width="320" height="42" rx="18" fill="#f9fafb" />
        <rect x="80" y="54" width="320" height="18" fill="#f9fafb" />
        <text x="180" y="57" fontSize="10" fontWeight="700" fill="#374151">Set Daily Loss Limit</text>

        {/* Preset chips */}
        <text x="104" y="98" fontSize="9" fontWeight="600" fill="#9ca3af" letterSpacing="1">PRESETS</text>
        {[
            { x: 104, label: "₹2,000", active: false },
            { x: 176, label: "₹5,000", active: true },
            { x: 248, label: "₹10,000", active: false },
            { x: 326, label: "Custom", active: false },
        ].map((c, i) => (
            <g key={i}>
                <rect x={c.x} y="106" width={c.label.length > 6 ? 68 : 62} height="28" rx="8"
                    fill={c.active ? "#16a34a" : "#f3f4f6"}
                    stroke={c.active ? "#15803d" : "#e5e7eb"} strokeWidth="1" />
                <text x={c.x + (c.label.length > 6 ? 34 : 31)} y="124" textAnchor="middle"
                    fontSize="10" fontWeight={c.active ? "700" : "500"}
                    fill={c.active ? "white" : "#374151"}>{c.label}</text>
            </g>
        ))}

        {/* Selected amount display */}
        <rect x="104" y="152" width="272" height="72" rx="12" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
        <text x="240" y="178" textAnchor="middle" fontSize="11" fill="#9ca3af">Daily Loss Limit</text>
        <text x="240" y="210" textAnchor="middle" fontSize="28" fontWeight="800" fill="#111827">₹5,000</text>

        {/* Slider bar */}
        <rect x="104" y="242" width="272" height="6" rx="3" fill="#f3f4f6" />
        <rect x="104" y="242" width="156" height="6" rx="3" fill="#16a34a" />
        <circle cx="260" cy="245" r="8" fill="white" stroke="#16a34a" strokeWidth="2.5" />

        {/* Warning note */}
        <rect x="104" y="268" width="272" height="40" rx="10" fill="#fef9c3" stroke="#fde68a" strokeWidth="1" />
        <text x="122" y="284" fontSize="9" fontWeight="600" fill="#854d0e">⚡  All new trades blocked when limit is hit</text>
        <text x="122" y="298" fontSize="8" fill="#a16207">Resets automatically at midnight every day</text>
    </svg>
);

const ProtectionIllustration = () => (
    <svg viewBox="0 0 460 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="280" cy="180" rx="210" ry="180" fill="#f0fdf4" />
        <rect x="80" y="30" width="320" height="300" rx="18" fill="white" style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))" }} />
        <rect x="80" y="30" width="320" height="42" rx="18" fill="#f9fafb" />
        <rect x="80" y="54" width="320" height="18" fill="#f9fafb" />
        <text x="170" y="57" fontSize="10" fontWeight="700" fill="#374151">Live Protection</text>
        <rect x="296" y="38" width="80" height="20" rx="6" fill="#dcfce7" />
        <circle cx="308" cy="48" r="4" fill="#22c55e" />
        <text x="315" y="52" fontSize="9" fontWeight="700" fill="#15803d">ACTIVE</text>

        {/* P&L gauge */}
        <text x="240" y="100" textAnchor="middle" fontSize="10" fill="#9ca3af">Today's P&L</text>
        <text x="240" y="130" textAnchor="middle" fontSize="30" fontWeight="800" fill="#ef4444">-₹3,840</text>
        <text x="240" y="148" textAnchor="middle" fontSize="9" fill="#9ca3af">Limit: ₹5,000 · Remaining: ₹1,160</text>

        {/* Progress bar - danger zone */}
        <rect x="104" y="160" width="272" height="10" rx="5" fill="#f3f4f6" />
        <rect x="104" y="160" width="210" height="10" rx="5" fill="#fca5a5" />
        <rect x="104" y="160" width="272" height="10" rx="5" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <text x="104" y="182" fontSize="8" fill="#9ca3af">₹0</text>
        <text x="376" y="182" textAnchor="end" fontSize="8" fill="#9ca3af">₹5,000</text>
        <text x="240" y="182" textAnchor="middle" fontSize="8" fontWeight="600" fill="#ef4444">77% used</text>

        {/* Trade rows - blocked */}
        <text x="104" y="206" fontSize="9" fontWeight="600" fill="#9ca3af" letterSpacing="1">RECENT ACTIVITY</text>
        {[
            { y: 214, ticker: "RELIANCE", status: "Executed", amt: "-₹1,200", sCol: "#16a34a", sBg: "#dcfce7" },
            { y: 246, ticker: "HDFC", status: "Executed", amt: "-₹2,640", sCol: "#16a34a", sBg: "#dcfce7" },
            { y: 278, ticker: "INFY", status: "⛔ Blocked", amt: "–", sCol: "#ef4444", sBg: "#fee2e2" },
        ].map((r, i) => (
            <g key={i}>
                <text x="104" y={r.y + 14} fontSize="11" fontWeight="700" fill="#111827">{r.ticker}</text>
                <rect x="200" y={r.y + 2} width="72" height="18" rx="5" fill={r.sBg} />
                <text x="236" y={r.y + 14} textAnchor="middle" fontSize="8" fontWeight="700" fill={r.sCol}>{r.status}</text>
                <text x="374" y={r.y + 14} textAnchor="end" fontSize="11" fontWeight="700" fill={r.sCol === "#ef4444" ? "#9ca3af" : "#374151"}>{r.amt}</text>
                {i < 2 && <rect x="104" y={r.y + 22} width="272" height="1" fill="#f3f4f6" />}
            </g>
        ))}
    </svg>
);

const steps = [
    {
        num: "01",
        title: "Connect your broker.",
        desc: "Securely link your trading account — Zerodha, Upstox, Angel One, or Fyers. We use AES-256 encryption. No trades can ever be placed through InvestBay.",
        cta: "Connect Broker",
        path: "/loss-protection/setup",
        Illustration: ConnectIllustration,
    },
    {
        num: "02",
        title: "Set your daily loss limit.",
        desc: "Pick from presets — ₹2K, ₹5K, ₹10K — or enter a custom amount. Change it anytime. This is the line your portfolio will never cross.",
        cta: "Set Limit",
        path: "/loss-protection/setup",
        Illustration: LimitIllustration,
    },
    {
        num: "03",
        title: "Trade knowing you're protected.",
        desc: "InvestBay monitors your live P&L. The moment losses touch your threshold, all new trades are blocked for the day. Resets at midnight — every single day.",
        cta: "See it Live",
        path: "/loss-protection/setup",
        Illustration: ProtectionIllustration,
    },
];

const faqs = [
    { q: "Is my broker password safe?", a: "Yes. Your credentials are encrypted with AES-256. No one at InvestBay can view them. We only read live P&L data — no trades are ever placed through us." },
    { q: "What happens when the limit is hit?", a: "All new trade orders are automatically blocked for the rest of the trading day. Existing positions are untouched — you can still exit them freely." },
    { q: "Can I change my limit anytime?", a: "Absolutely. Increase, decrease, or remove your loss limit whenever you want from your dashboard." },
    { q: "Does it affect my existing positions?", a: "No. Loss Protection only blocks new entries. Your open positions remain active and you can square them off at any time." },
    { q: "Does the limit reset automatically?", a: "Yes. Your daily loss counter resets automatically every midnight, giving you a fresh start each trading day." },
];

export default function LossProtectionInfo() {
    const navigate = useNavigate();
    const [heroRef, heroVisible] = useInView(0.1);
    const animationContainer = useRef(null);

    // Initialize Lottie animation
    useEffect(() => {
        if (animationContainer.current) {
            const animation = lottie.loadAnimation({
                container: animationContainer.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: lossProtectionAnimation,
            });

            return () => {
                animation.destroy();
            };
        }
    }, []);

    return (
        <div className="bg-white min-h-screen">

            {/* ── HERO ── */}
            <section className="w-full bg-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                        {/* Left Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div
                                ref={heroRef}
                                className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            >
                                {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-6">
                                    <Shield className="w-3.5 h-3.5 text-green-600" />
                                    <span className="text-xs font-['Aileron_Black'] font-bold text-green-700 tracking-wide uppercase">
                                        Portfolio Safety
                                    </span>
                                </div> */}

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-['Aileron_Black'] font-black text-gray-900 mb-5 leading-tight tracking-tight">
                                    Stop <span className="text-red-500">Losses</span> Before They{" "}
                                    <span className="text-red-500">Stop You.</span>
                                </h1>

                                <p className="text-gray-500 text-base lg:text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Connect your demat account and set a daily loss limit. When losses hit your threshold, all new trades are automatically blocked — protecting your capital from emotional decisions.
                                </p>

                                {/* Quick stats */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                                    {[
                                        { val: "Real-time", label: "Monitoring" },
                                        { val: "Instant", label: "Blocking" },
                                        { val: "Auto", label: "Daily Reset" },
                                        { val: "24/7", label: "Protection" },
                                    ].map((s, i) => (
                                        <div key={i} className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-center">
                                            <div className="font-['Aileron_Black'] font-bold text-sm text-green-600">{s.val}</div>
                                            <div className="text-[10px] text-gray-400">{s.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate("/loss-protection/setup")}
                                    className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white px-7 py-3.5 rounded-xl font-['Aileron_Black'] font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    Set Up Loss Protection
                                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>
                                <p className="text-xs text-gray-400 mt-3">Takes under 2 minutes · Free · Cancel anytime</p>
                            </div>
                        </div>

                        {/* Right Lottie Animation */}
                        <div className="flex-1 w-full">
                            <div
                                ref={animationContainer}
                                className="w-full max-w-[500px] mx-auto"
                                style={{ minHeight: "400px" }}
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS — 3 STEPS ──────────────────────────────────── */}
            <section className="w-full bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section label */}
                    <div className="mb-4 pt-4">
                        <span className="text-xs font-['Aileron_Black'] font-bold tracking-widest uppercase text-gray-400">How It Works</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-2 leading-tight tracking-tight">
                        3 steps. That's it.
                    </h2>
                    <p className="text-gray-500 text-base mb-0">
                        Protecting your portfolio has never been this simple.
                    </p>

                    {/* Step rows */}
                    {steps.map((step, index) => {
                        const [ref, visible] = useInView(0.1);
                        const isEven = index % 2 === 0;
                        const { Illustration } = step;
                        return (
                            <div
                                key={step.num}
                                ref={ref}
                                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20 py-16 lg:py-24 border-b border-gray-100 last:border-0 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            >
                                {/* Text */}
                                <div className="flex-1 w-full max-w-[440px]">
                                    <span className="block mb-4 text-6xl md:text-7xl lg:text-8xl font-['Aileron_Black'] font-black text-gray-100 leading-none">
                                        {step.num}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-['Aileron_Black'] font-black text-gray-900 mb-4 leading-snug tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
                                        {step.desc}
                                    </p>
                                    <button
                                        onClick={() => navigate(step.path)}
                                        className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-['Aileron_Black'] font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        {step.cta}
                                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </button>
                                </div>

                                {/* Illustration */}
                                <div className="flex-1 w-full max-w-[500px]">
                                    <div className="w-full aspect-[460/360]">
                                        <Illustration />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── WHY IT MATTERS ──────────────────────────────────────────── */}
            <section className="w-full bg-gray-50 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <span className="text-xs font-['Aileron_Black'] font-bold tracking-widest uppercase text-gray-400 block mb-3">Why It Matters</span>
                    <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-10 leading-tight tracking-tight">
                        Real Impact. Not an Experiment.
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { title: "Prevents Revenge Trading", desc: "Stops you from chasing losses with bigger bets — the #1 reason traders blow accounts.", icon: AlertOctagon },
                            { title: "Emotional Discipline", desc: "Removes feelings from the equation. The system enforces your rules automatically.", icon: Shield },
                            { title: "Capital Preservation", desc: "One bad day can't wipe out weeks of gains. Your long-term capital stays safe.", icon: Lock },
                            { title: "Better Risk Management", desc: "Forces pre-trade risk thinking. Builds better trading habits over time.", icon: TrendingUp },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                                    <item.icon className="w-5 h-5 text-green-600" strokeWidth={1.8} />
                                </div>
                                <h4 className="font-['Aileron_Black'] font-extrabold text-sm text-gray-900 mb-1.5">{item.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SUPPORTED BROKERS ───────────────────────────────────────── */}
            <section className="w-full bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <span className="text-xs font-['Aileron_Black'] font-bold tracking-widest uppercase text-gray-400 block mb-3">Supported Brokers</span>
                    <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-10 leading-tight tracking-tight">
                        Works with your broker.
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { name: "Zerodha", col: "#387ed1", bg: "#eff6ff" },
                            { name: "Upstox", col: "#6c47ff", bg: "#f5f3ff" },
                            { name: "Angel One", col: "#e8622a", bg: "#fff7ed" },
                            { name: "Fyers", col: "#16a34a", bg: "#f0fdf4" },
                        ].map((b, i) => (
                            <div key={i} className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-default" style={{ background: b.bg }}>
                                <span className="font-['Aileron_Black'] font-extrabold text-base" style={{ color: b.col }}>{b.name}</span>
                                <span className="text-[10px] text-gray-400 mt-1">Supported</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ─────────────────────────────────────────────────────── */}
            <section className="w-full bg-gray-50 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <span className="text-xs font-['Aileron_Black'] font-bold tracking-widest uppercase text-gray-400 block mb-3">FAQ</span>
                    <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-2 leading-tight tracking-tight">
                        Priority Support. No bots.
                    </h2>
                    <p className="text-gray-500 text-base mb-10">Get answers to common questions below.</p>
                    <div className="bg-white rounded-2xl border border-gray-100 px-6 divide-y divide-gray-100">
                        {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ───────────────────────────────────────────────── */}
            <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-green-600" strokeWidth={1.6} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-['Aileron_Black'] font-black text-gray-900 mb-4 leading-tight tracking-tight">
                        Ready to Protect Your Portfolio?
                    </h2>
                    <p className="text-gray-500 text-base mb-8 leading-relaxed">
                        Connect your broker and set your loss limit in under 2 minutes. Trade with confidence knowing your downside is protected.
                    </p>
                    <button
                        onClick={() => navigate("/loss-protection/setup")}
                        className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-['Aileron_Black'] font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Set Up Loss Protection
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Takes under 2 minutes · Free · Cancel anytime</p>

                    {/* SEBI accreditation */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-6">
                        {[
                            { label: "SEBI Registered", sub: "Reg No. INA000012218" },
                            { label: "Research Analyst", sub: "Reg No. INH000024277" },
                        ].map((a, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
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