import { FiShield, FiTrendingUp, FiAlertOctagon, FiCheck, FiArrowRight, FiLock } from "react-icons/fi";
import { FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LossProtectionInfo() {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-[#060b10] py-10 px-4 sm:px-6 lg:px-8">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)`,
                    backgroundSize: '64px 64px',
                    maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
                }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-red-500/[0.02] blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 mb-6">
                        <FiShield className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">Portfolio Safety</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#f0f4f8] mb-6 leading-[1.1]">
                        Stop <span className="bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Losses</span>  Before They{" "}
                        <span className="bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                            Stop You
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Connect your demat account and set a daily loss limit. When your losses hit the threshold,
                        all new trades are automatically blocked — protecting your capital from emotional decisions.
                    </p>
                </div>

                {/* What is Loss Protection */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 mb-8 group hover:border-emerald-500/20 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                            <FaExclamationTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-[#f0f4f8] mb-3">What is Loss Protection?</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Loss Protection is an automated safety mechanism that monitors your daily trading losses.
                                When your losses reach your preset limit, the system automatically blocks all new trade orders
                                for the rest of the day — preventing you from chasing losses or making emotional decisions.
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                        {[
                            { value: "Real-time", label: "Monitoring" },
                            { value: "Instant", label: "Blocking" },
                            { value: "Auto-reset", label: "at Midnight" },
                            { value: "24/7", label: "Protection" },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                <p className="text-lg font-bold text-emerald-400">{stat.value}</p>
                                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                step: "01",
                                icon: FiLock,
                                title: "Connect Demat",
                                desc: "Securely connect your trading account with your broker credentials. We use AES-256 encryption.",
                                color: "from-blue-500/20 to-blue-600/10",
                                iconColor: "text-blue-400"
                            },
                            {
                                step: "02",
                                icon: FiTrendingUp,
                                title: "Set Loss Limit",
                                desc: "Define your daily loss threshold. Choose from presets or set a custom amount that suits you.",
                                color: "from-amber-500/20 to-amber-600/10",
                                iconColor: "text-amber-400"
                            },
                            {
                                step: "03",
                                icon: FiAlertOctagon,
                                title: "Auto-Protection",
                                desc: "When losses hit your limit, all new trades are blocked automatically. Resets at midnight.",
                                color: "from-emerald-500/20 to-emerald-600/10",
                                iconColor: "text-emerald-400"
                            },
                        ].map((item, idx) => (
                            <div key={idx} className={`relative bg-gradient-to-br ${item.color} backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300`}>
                                <span className="text-5xl font-black text-white/5 absolute top-4 right-4">{item.step}</span>
                                <item.icon className={`w-8 h-8 ${item.iconColor} mb-4 relative z-10`} />
                                <h3 className="text-lg font-bold text-[#f0f4f8] mb-2 relative z-10">{item.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why It's Important */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6">Why Loss Protection Matters</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: FaExclamationTriangle,
                                title: "Prevents Revenge Trading",
                                desc: "Stops you from trying to recover losses by taking bigger risks — the #1 reason traders blow their accounts."
                            },
                            {
                                icon: FiShield,
                                title: "Emotional Discipline",
                                desc: "Removes emotional decision-making from trading. The system enforces your rules, not your feelings."
                            },
                            {
                                icon: FaChartLine,
                                title: "Capital Preservation",
                                desc: "Ensures a single bad day doesn't wipe out weeks of profits. Protects your long-term trading capital."
                            },
                            {
                                icon: FiTrendingUp,
                                title: "Better Risk Management",
                                desc: "Forces you to think about risk before every trade, building better trading habits over time."
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group">
                                <item.icon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h4 className="text-sm font-bold text-[#f0f4f8] mb-1">{item.title}</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Supported Brokers */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6 text-center">Supported Brokers</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { name: "Zerodha", logo: "https://zerodha.com/static/images/logo.svg", color: "#387ed1" },
                            { name: "Upstox", color: "#6c47ff" },
                            { name: "Angel One", color: "#e8622a" },
                            { name: "Fyers", color: "#1db954" },
                        ].map((broker, idx) => (
                            <div key={idx} className="text-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                                {broker.logo ? (
                                    <img src={broker.logo} alt={broker.name} className="h-8 mx-auto mb-2 object-contain" />
                                ) : (
                                    <span className="text-xl font-bold block mb-2" style={{ color: broker.color }}>{broker.name}</span>
                                )}
                                <p className="text-xs text-slate-500">{broker.logo ? broker.name : "Supported"}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Benefits */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6 text-center">Key Benefits</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Auto-Protection", desc: "No manual intervention needed" },
                            { label: "Flexible Limits", desc: "Change your limit anytime" },
                            { label: "Daily Reset", desc: "Fresh start every midnight" },
                            { label: "Secure Connection", desc: "AES-256 encryption" },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                                    <FiCheck className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h4 className="text-sm font-bold text-[#f0f4f8] mb-1">{item.label}</h4>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Common Questions */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 mb-12">
                    <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6">Common Questions</h2>
                    <div className="space-y-3">
                        {[
                            { q: "Is my broker password safe?", a: "Yes! Your credentials are encrypted with AES-256 encryption. No one at InvestBay can access them. We only read PnL data — no trades can be executed." },
                            { q: "What happens when the limit is hit?", a: "All new trade orders are automatically blocked for the rest of the day. Existing positions are not affected. The limit resets at midnight." },
                            { q: "Can I change the limit anytime?", a: "Absolutely! You can increase, decrease, or remove the loss limit whenever you want." },
                            { q: "Does it affect my existing positions?", a: "No. Loss protection only blocks new trades. Your existing positions remain active and you can exit them anytime." },
                        ].map((faq, idx) => (
                            <details key={idx} className="group">
                                <summary className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-colors list-none">
                                    <span className="text-sm font-semibold text-[#f0f4f8]">{faq.q}</span>
                                    <span className="text-slate-500 group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <p className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <div className="inline-flex flex-col items-center gap-4 p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 w-full max-w-lg">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                            <FiShield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-[#f0f4f8]">Ready to Protect Your Portfolio?</h3>
                        <p className="text-sm text-slate-400 max-w-md">
                            Connect your broker and set your loss limit in under 2 minutes. Trade with confidence knowing your downside is protected.
                        </p>
                        <button
                            onClick={() => navigate("/loss-protection/setup")}
                            className="group flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 mt-2"
                        >
                            Set Up Loss Protection
                            <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                        <p className="text-xs text-slate-600 mt-2">
                            Takes less than 2 minutes • Free feature • Cancel anytime
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
        </section>
    );
}