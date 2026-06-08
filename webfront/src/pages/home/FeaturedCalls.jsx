import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUp, ArrowDown, Lock, Unlock, BadgeCheck,
  Circle, ArrowRight, TrendingUp, Zap,
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
    } catch (err) { setError(err.response?.data?.message || "Server error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSignals(); }, []);

  const handleUnlockClick = async (signal) => {
    if (!user) { navigate("/login", { state: { from: "/featured-calls", signalId: signal.id } }); return; }
    if (signal.isLocked) {
      toast.warning("Free limit reached! Subscribe for unlimited access.", { position: "top-center" });
      return;
    }
    if (!signal.alreadyViewed && !accessInfo.hasSubscription) {
      try {
        const trackRes = await axios.post(
          `${apiUrl}/signals/track-signal-view/${signal.id}`, {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (trackRes.data.success) {
          setAccessInfo(prev => ({
            ...prev,
            viewedCount: trackRes.data.viewedCount || prev.viewedCount + 1,
            remainingViews: trackRes.data.remainingViews || prev.remainingViews - 1,
          }));
          setSignals(prev => prev.map(s =>
            s.id === signal.id ? { ...s, alreadyViewed: true, canView: true } : s
          ));
        }
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error("Free limit reached! Please subscribe.", { position: "top-center" });
          return;
        }
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
    <section ref={sectionRef} className="relative py-20 lg:py-28 bg-gray-50 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div className="max-w-xl">
            <p
              className={`text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ fontFamily: "'Aileron', 'Arial', sans-serif" }}
            >
              Live Signals
            </p>
            <h2
              className={`text-[clamp(28px,4vw,46px)] font-black leading-[1.1] tracking-tight text-black mb-4 transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
            >
              Featured  Free Calls
            </h2>
            <p
              className={`text-[15px] text-gray-500 leading-relaxed transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
            >
              Get real-time trading signals from SEBI-registered analysts. Start with 5 free calls.
            </p>
          </div>

          <button
            onClick={() => navigate(user ? "/pricing" : "/login")}
            className="self-start lg:self-auto group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:border-gray-900 hover:text-black hover:bg-white transition-all duration-200 cursor-pointer flex-shrink-0"
            style={{ fontFamily: "'Aileron', sans-serif" }}
          >
            Explore Premium Plans
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                </div>
                <div className="h-7 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="grid grid-cols-3 gap-px">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-14 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold mb-1 text-sm">{error}</p>
            <p className="text-gray-400 text-xs mb-5">Unable to load signals</p>
            <button
              onClick={fetchSignals}
              className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Signal Cards */}
        {!loading && !error && signals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {signals.slice(0, 3).map((signal, index) => {
              const isBuy = signal.trade_direction === "BUY";
              const formattedDate = new Date(signal.created_at).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              });
              const buttonInfo = getButtonContent(signal);
              const ButtonIcon = buttonInfo.icon;

              return (
                <div
                  key={signal.id}
                  className={`transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${hoveredIndex !== null && hoveredIndex !== index ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"}`}
                  style={{ transitionDelay: visible ? `${300 + index * 80}ms` : "0s" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-200 group">

                    {/* Locked Overlay */}
                    {signal.isLocked && (
                      <div className="absolute inset-0 bg-white/96 backdrop-blur-[2px] z-20 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Lock className="w-4.5 h-4.5 text-gray-400" />
                          </div>
                          <p
                            className="text-gray-700 font-black text-sm"
                            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                          >
                            Premium Signal
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">Subscribe to unlock</p>
                        </div>
                      </div>
                    )}

                    {/* Top row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        signal.isLocked
                          ? "bg-gray-100 text-gray-400"
                          : signal.alreadyViewed
                          ? "bg-gray-100 text-gray-500"
                          : "bg-black text-white"
                      }`}>
                        <Circle className={`w-1.5 h-1.5 fill-current ${!signal.isLocked && !signal.alreadyViewed && "animate-pulse"}`} />
                        {signal.isLocked ? "Premium" : signal.alreadyViewed ? "Viewed" : "Free Call"}
                      </span>
                      <button
                        onClick={() => handleUnlockClick(signal)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                          signal.isLocked ? "text-gray-300 hover:text-gray-500" : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {buttonInfo.text}
                        <ButtonIcon className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Instrument */}
                    <div className="mb-4">
                      <p className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1.5">Commodity</p>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className="text-[18px] font-black text-black leading-tight"
                            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                          >
                            {signal.instrument}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">{signal.instrument_type}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold flex-shrink-0 ${
                          isBuy ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                        }`}>
                          {isBuy ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {isBuy ? "BUY" : "SELL"}
                        </span>
                      </div>
                    </div>

                    {/* Stats grid — joined cells */}
                    <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden mb-4">
                      {[
                        { label: "Entry", value: `₹${signal.entry_price?.toLocaleString() || "N/A"}` },
                        { label: "R:R", value: signal.risk_reward_ratio || "N/A" },
                        { label: "Duration", value: signal.duration || "N/A" },
                      ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 group-hover:bg-white transition-colors duration-200 px-3 py-3 text-center">
                          <div className="text-[9px] uppercase tracking-[0.1em] text-gray-400 mb-1">{stat.label}</div>
                          <div
                            className="text-sm font-black text-black"
                            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                          >
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meta row */}
                    <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden pb-0 mb-4">
                      {[
                        { label: "Segment", value: signal.segment || "N/A" },
                        { label: "Industry", value: signal.industry || "Energy" },
                        { label: "Exit", value: signal.exit_price || "NA" },
                      ].map((meta, idx) => (
                        <div key={idx} className="bg-gray-50 group-hover:bg-white transition-colors duration-200 px-3 py-2.5">
                          <div className="text-[9px] uppercase tracking-[0.1em] text-gray-400 mb-0.5">{meta.label}</div>
                          <div
                            className="text-xs font-semibold text-gray-700 truncate"
                            style={{ fontFamily: "'Aileron', sans-serif" }}
                          >
                            {meta.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
                      <img
                        src={signal.author_image || "https://randomuser.me/api/portraits/men/1.jpg"}
                        alt="author"
                        className="w-8 h-8 rounded-full object-cover border border-gray-100 flex-shrink-0"
                        onError={e => { e.currentTarget.src = "https://randomuser.me/api/portraits/men/1.jpg"; }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span
                            className="text-[13px] font-bold text-black truncate"
                            style={{ fontFamily: "'Aileron Black', sans-serif" }}
                          >
                            {signal.author_name || "RA Arihant Capital"}
                          </span>
                          <BadgeCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        </div>
                        <p className="text-[11px] text-gray-400">{formattedDate}</p>
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
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
            <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gray-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gray-300" />
            </div>
            <h3
              className="text-xl font-black text-black mb-2"
              style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
            >
              No Active Signals
            </h3>
            <p
              className="text-gray-400 text-[14px] mb-6 max-w-sm mx-auto"
              style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
            >
              {!user
                ? "Login to view trading recommendations from our experts."
                : "New signals will appear here. Check back soon!"}
            </p>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors group"
              >
                Login to View Signals
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        )}

        {/* Free Views Counter */}
        {user && !accessInfo.hasSubscription && accessInfo.remainingViews > 0 && signals.length > 0 && (
          <div className="mt-8 text-center">
            <p
              className="text-[13px] text-gray-400"
              style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
            >
              Free views remaining:{" "}
              <span
                className="font-black text-black"
                style={{ fontFamily: "'Aileron Black', sans-serif" }}
              >
                {accessInfo.remainingViews}
              </span>{" "}
              of 5
            </p>
          </div>
        )}
      </div>
    </section>
  );
}