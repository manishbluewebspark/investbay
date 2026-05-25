import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUp, ArrowDown, Lock, Unlock, BadgeCheck,
  Circle, ArrowRight, TrendingUp, Zap, Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArrowRight } from "react-icons/fi";

export default function FeaturedCalls() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [accessInfo, setAccessInfo] = useState({
    viewedCount: 0, remainingViews: 5, limitReached: false, hasSubscription: false,
  });
  const sectionRef = useRef(null);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const fetchSignals = async () => {
    try {
      setLoading(true); setError("");
      let res;
      if (user && token) {
        res = await axios.get(`${apiUrl}/signals/get-signals-free/limited`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success) {
          setSignals(res.data.data || []);
          setAccessInfo({
            viewedCount: res.data.viewedCount || 0,
            remainingViews: res.data.remainingViews || 0,
            limitReached: res.data.limitReached || false,
            hasSubscription: res.data.hasSubscription || false,
          });
        }
      } else {
        res = await axios.get(`${apiUrl}/signals/get-signals-free`);
        if (res.data?.success) setSignals(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSignals(); }, []);

  const handleUnlockClick = async (signal) => {
    if (!user) { navigate("/login", { state: { from: "/featured-calls", signalId: signal.id } }); return; }
    if (signal.isLocked) {
      toast.warning(
        <div className="flex flex-col gap-2">
          <p>⚠️ Free Limit Reached!</p>
          <p className="text-sm">You've used all 5 free calls. Subscribe for unlimited access.</p>
          <button onClick={() => navigate("/pricing")} className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">View Plans</button>
        </div>,
        { position: "top-center", autoClose: false }
      );
      return;
    }
    if (!signal.alreadyViewed && !accessInfo.hasSubscription) {
      try {
        const trackRes = await axios.post(`${apiUrl}/signals/track-signal-view/${signal.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        if (trackRes.data.success) {
          setAccessInfo(prev => ({ ...prev, viewedCount: trackRes.data.viewedCount || prev.viewedCount + 1, remainingViews: trackRes.data.remainingViews || prev.remainingViews - 1 }));
          setSignals(prev => prev.map(s => s.id === signal.id ? { ...s, alreadyViewed: true, canView: true } : s));
        }
      } catch (error) {
        if (error.response?.status === 403) { toast.error("Free limit reached! Please subscribe.", { position: "top-center" }); return; }
      }
    }
    navigate(`/afterbeforesubscription/${signal.id}`);
  };

  const getButtonContent = (signal) => {
    if (!user) return { text: "Unlock", icon: Unlock };
    if (signal.isLocked) return { text: "Locked", icon: Lock };
    if (signal.alreadyViewed) return { text: "View Details", icon: ArrowRight };
    if (signal.unlockButton) return { text: "Unlock", icon: Unlock };
    return { text: "View Details", icon: ArrowRight };
  };

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
              linear-gradient(rgba(43,182,115,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(43,182,115,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          }}
        />
        
        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">
                Live Signals
              </span>
            </div>

            {/* Heading */}
            <h2 
              className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] transition-all duration-700 delay-100 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <span className="text-[#f0f4f8]">Featured </span>
              <span className="relative">
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Free Calls
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400/40 via-emerald-300/20 to-transparent rounded-full blur-[2px]" />
              </span>
            </h2>

            <p 
              className={`text-lg text-slate-400/80 max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Get real-time trading signals from SEBI-registered analysts. Start with 5 free calls.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate(user ? "/pricing" : "/login")}
            className={`group relative inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] text-slate-300 font-semibold rounded-xl overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 active:translate-y-0 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="relative z-10">Explore Premium Plans</span>
            <FiArrowRight className="relative z-10 text-lg transition-all duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-white/[0.05] rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-white/[0.05] rounded-full animate-pulse" />
                </div>
                <div className="h-8 w-3/4 bg-white/[0.04] rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
                  ))}
                </div>
                <div className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={`text-center py-24 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-red-400 text-lg font-medium mb-2">{error}</p>
            <p className="text-slate-500 text-sm mb-6">Unable to load signals at this moment</p>
            <button
              onClick={fetchSignals}
              className="px-8 py-3 bg-emerald-500 text-[#050a0e] font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Signal Cards */}
        {!loading && !error && signals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.slice(0, 3).map((signal, index) => {
              const isBuy = signal.trade_direction === "BUY";
              const formattedDate = new Date(signal.created_at).toLocaleDateString("en-IN", { 
                day: "2-digit", month: "short", year: "numeric" 
              });
              const buttonInfo = getButtonContent(signal);
              const ButtonIcon = buttonInfo.icon;

              return (
                <div
                  key={signal.id}
                  className={`transform transition-all duration-500 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: visible ? `${400 + index * 100}ms` : "0s" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    className={`group/card relative bg-white/[0.02] backdrop-blur-sm border rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? 'opacity-40 scale-[0.97] blur-[1px] border-white/[0.04]'
                        : 'opacity-100 scale-100 blur-0 border-white/[0.06] hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5'
                    }`}
                  >
                    {/* Top glow line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    {/* Locked Overlay */}
                    {signal.isLocked && (
                      <div className="absolute inset-0 bg-[#060b10]/80 backdrop-blur-md z-20 rounded-2xl flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                            <Lock className="w-6 h-6 text-slate-500" />
                          </div>
                          <p className="text-slate-400 font-medium mb-1">Premium Signal</p>
                          <p className="text-slate-600 text-sm">Subscribe to unlock</p>
                        </div>
                      </div>
                    )}

                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        signal.isLocked 
                          ? 'bg-white/[0.03] border border-white/[0.06] text-slate-500'
                          : signal.alreadyViewed 
                            ? 'bg-white/[0.03] border border-white/[0.06] text-slate-400'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      }`}>
                        <Circle className={`w-1.5 h-1.5 fill-current ${!signal.isLocked && !signal.alreadyViewed && 'animate-pulse'}`} />
                        {signal.isLocked ? "Premium" : signal.alreadyViewed ? "Viewed" : "Free Call"}
                      </span>

                      <button
                        onClick={() => handleUnlockClick(signal)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-300 ${
                          signal.isLocked 
                            ? 'text-slate-600 hover:text-slate-400' 
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        {buttonInfo.text}
                        <ButtonIcon className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Instrument Info */}
                    <div className="mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Commodity</p>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-[#f0f4f8] leading-tight">
                            {signal.instrument}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5">{signal.instrument_type}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                          isBuy 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {isBuy ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {isBuy ? "BUY" : "SELL"}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-0 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 mb-4">
                      {[
                        { label: "Entry", value: `₹${signal.entry_price?.toLocaleString() || "N/A"}` },
                        { label: "R:R", value: signal.risk_reward_ratio || "N/A" },
                        { label: "Duration", value: signal.duration || "N/A" },
                      ].map((stat, idx) => (
                        <div 
                          key={idx} 
                          className={`text-center ${idx < 2 ? 'border-r border-white/[0.05]' : ''}`}
                        >
                          <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1.5">
                            {stat.label}
                          </div>
                          <div className="text-sm font-bold text-[#f0f4f8]">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-3 gap-0 pb-4 border-b border-white/[0.05] mb-4">
                      {[
                        { label: "Segment", value: signal.segment || "N/A" },
                        { label: "Industry", value: signal.industry || "Energy" },
                        { label: "Exit", value: signal.exit_price || "NA" },
                      ].map((meta, idx) => (
                        <div key={idx} className={idx < 2 ? 'border-r border-white/[0.03]' : ''}>
                          <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">
                            {meta.label}
                          </div>
                          <div className="text-xs font-medium text-slate-400">
                            {meta.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <img
                        src={signal.author_image || "https://i.pravatar.cc/100?img=12"}
                        alt="author"
                        className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/20"
                        onError={e => { e.currentTarget.src = "https://i.pravatar.cc/100?img=12"; }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-slate-300">
                            {signal.author_name || "RA Arihant Capital"}
                          </span>
                          <BadgeCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && signals.length === 0 && (
          <div className={`text-center py-24 bg-white/[0.01] backdrop-blur-sm border border-white/[0.04] rounded-3xl transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#f0f4f8] mb-3">
              No Active Signals
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
              {!user ? "Login to view trading recommendations from our experts." : "New signals will appear here. Check back soon!"}
            </p>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-[#050a0e] font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 group"
              >
                Login to View Signals
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </div>
        )}
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
      `}</style>
    </section>
  );
}