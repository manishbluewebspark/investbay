import { FiShield, FiTrendingUp, FiPieChart, FiAlertOctagon, FiCheck, FiArrowRight, FiLock } from "react-icons/fi";
import { FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CapitalLockInfo() {
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
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 mb-6">
            <FiShield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">Capital Protection</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#f0f4f8] mb-6 leading-[1.1]">
            Protect Your Capital with{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Smart Locks
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Set a maximum investment limit to prevent overtrading and protect your hard-earned money from impulsive decisions.
          </p>
        </div>

        {/* What is Capital Lock */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 mb-8 group hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <FiLock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#f0f4f8] mb-3">What is Capital Lock?</h2>
              <p className="text-slate-400 leading-relaxed">
                Capital Lock is a protective mechanism that lets you set a maximum investment limit on your trading account. 
                Once activated, any new investment order exceeding this limit will be automatically blocked, ensuring you 
                never risk more than you intended.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { value: "100%", label: "Protection" },
              { value: "Real-time", label: "Monitoring" },
              { value: "Instant", label: "Blocking" },
              { value: "24/7", label: "Active" },
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
                icon: FiTrendingUp,
                title: "Set Your Limit",
                desc: "Choose a maximum investment amount based on your risk appetite and trading strategy.",
                color: "from-emerald-500/20 to-emerald-600/10",
                iconColor: "text-emerald-400"
              },
              {
                step: "02",
                icon: FiShield,
                title: "Activate Protection",
                desc: "Once activated, the system monitors all your new investment orders in real-time.",
                color: "from-blue-500/20 to-blue-600/10",
                iconColor: "text-blue-400"
              },
              {
                step: "03",
                icon: FiAlertOctagon,
                title: "Auto-Block Excess",
                desc: "Any order exceeding your limit is automatically blocked, protecting your capital.",
                color: "from-purple-500/20 to-purple-600/10",
                iconColor: "text-purple-400"
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
          <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6">Why Capital Lock is Important</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Key Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Real-time Protection", desc: "Instant blocking of excess orders" },
              { label: "Flexible Limits", desc: "Change your limit anytime" },
              { label: "No Lock-in Period", desc: "Remove or modify whenever needed" },
              { label: "Complete Control", desc: "You decide your risk level" },
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
              { q: "Can I change my lock amount later?", a: "Yes! You can modify or remove your capital lock at any time based on your needs." },
              { q: "Does it affect my existing investments?", a: "No. Capital lock only applies to new investment orders. Your existing positions remain unaffected." },
              { q: "What happens if I try to exceed the limit?", a: "The order will be automatically blocked, and you'll receive a notification about the limit." },
              { q: "Is there any fee for using Capital Lock?", a: "No, Capital Lock is a free feature available to all our users to promote responsible trading." },
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
              <FiLock className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-[#f0f4f8]">Ready to Protect Your Capital?</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Set your investment limit now and trade with confidence. You can always adjust it later.
            </p>
            <button
              onClick={() => navigate("/capital-lock/setup")}
              className="group flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 mt-2"
            >
              Set Capital Lock Now
              <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="text-xs text-slate-600 mt-2">
              Takes less than 30 seconds to set up
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