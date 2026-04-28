import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  ArrowUp,
  ArrowDown,
  Lock,
  Eye,
  Unlock,
  BadgeCheck,
  Circle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function FeaturedCalls() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [accessInfo, setAccessInfo] = useState({
    viewedCount: 0,
    remainingViews: 5,
    limitReached: false,
    hasSubscription: false,
  });

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

const fetchSignals = async () => {
  try {
    setLoading(true);
    setError("");

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

      if (res.data?.success) {
        setSignals(res.data.data || []);
      }
    }
  } catch (err) {
    console.error("Error:", err);
    setError(err.response?.data?.message || "Server error");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchSignals();
}, []); 

  const handleUnlockClick = async (signal) => {
    // Direct login redirect for non-logged-in users
    if (!user) {
      navigate("/login", { state: { from: "/featured-calls", signalId: signal.id } });
      return;
    }

    if (signal.isLocked) {
      toast.warning(
        <div className="flex flex-col gap-2">
          <p className="">⚠️ Free Limit Reached!</p>
          <p className="text-md">
            You've used all 5 free calls. Subscribe for unlimited access.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-md  hover:bg-orange-600"
          >
            View Plans
          </button>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          style: {
            background: "#fff",
            border: "1px solid #f97316",
            borderRadius: "12px",
          },
        }
      );
      return;
    }

    if (!signal.alreadyViewed && !accessInfo.hasSubscription) {
      try {
        const trackRes = await axios.post(
          `${apiUrl}/signals/track-signal-view/${signal.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (trackRes.data.success) {
          setAccessInfo((prev) => ({
            ...prev,
            viewedCount: trackRes.data.viewedCount || prev.viewedCount + 1,
            remainingViews: trackRes.data.remainingViews || prev.remainingViews - 1,
          }));

          setSignals((prevSignals) =>
            prevSignals.map((s) =>
              s.id === signal.id ? { ...s, alreadyViewed: true, canView: true } : s
            )
          );

          toast.success(
            `Signal unlocked! ${trackRes.data.remainingViews} free views remaining`,
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
        }
      } catch (error) {
        console.error("Error tracking view:", error);

        if (error.response?.status === 403) {
          toast.error("Free limit reached! Please subscribe.", {
            position: "top-center",
          });
          return;
        }
      }
    }

    navigate(`/afterbeforesubscription/${signal.id}`);
  };

  const getButtonContent = (signal) => {
    if (!user) return { text: "Unlock", icon: ArrowRight, disabled: false };
    if (signal.isLocked) return { text: "Locked", icon: Lock, disabled: false };
    if (signal.alreadyViewed) return { text: "View Details", icon: ArrowRight, disabled: false };
    if (signal.unlockButton) return { text: "Unlock", icon: Unlock, disabled: false };
    return { text: "View Details", icon: ArrowRight, disabled: false };
  };

  const getStatusBadge = (signal) => {
    if (signal.isLocked) {
      return {
        text: "Free Preview",
        className: "bg-gray-50 text-gray-500 border border-gray-200",
      };
    }

    if (signal.alreadyViewed) {
      return {
        text: "Recent Call",
        className: "bg-gray-50 text-gray-500 border border-gray-200",
      };
    }

    return {
      text: "Free",
      className: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    };
  };

  if (loading) {
    return (
      <section className="w-full bg-cover bg-center bg-no-repeat py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center" style={{ backgroundImage: "url('/images/featured-bg.jpg')" }}>
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading signals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-cover bg-center bg-no-repeat py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center" style={{ backgroundImage: "url('/images/featured-bg.jpg')" }}>
        <div className="text-center max-w-md bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <h3 className="text-xl  text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchSignals}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all mt-4"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-cover bg-center bg-no-repeat py-16 px-4 sm:px-8 md:px-12 lg:px-24" style={{ backgroundImage: "url('/home-signal-bg.svg')" }}>
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-start justify-between gap-4">
        <div>
          <p className="text-md  text-color mb-2 uppercase">
            Signals
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2  backdrop-blur-sm rounded-xl px-4 py-2 inline-block">
            Featured Free Calls
          </h2>
        </div>

        <button
          onClick={() => {
            if (!user) {
              navigate("/login");
            } else {
              navigate("/pricing");
            }
          }}
          className="shrink-0 text-md text-gray-700 hover:text-emerald-600 font-medium flex items-center gap-2 mt-2  backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/100 transition-all"
        >
          Explore Premium Plans <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {signals.slice(0, 3).map((signal) => {
            const isBuy = signal.trade_direction === "BUY";
            const formattedDate = new Date(signal.created_at).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );

            const buttonInfo = getButtonContent(signal);
            const ButtonIcon = buttonInfo.icon;
            const statusBadge = getStatusBadge(signal);

            return (
              <div
                key={signal.id}
                className="group bg-white/95  rounded-xl p-5  border border-white/50  h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:bg-white/100"
              >
                {signal.isLocked && (
                  <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl text-center">
                      <Lock className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-600">
                        Subscribe to view
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                  >
                    {signal.isLocked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Circle className="w-2 h-2 fill-current" />
                    )}
                    {statusBadge.text}
                  </span>

                  <button
                    onClick={() => handleUnlockClick(signal)}
                    className={`text-xs font-medium flex items-center gap-1 ${
                      signal.isLocked
                        ? "text-gray-500 hover:text-gray-600 cursor-pointer"
                        : "text-blue-600 hover:text-blue-700 cursor-pointer"
                    }`}
                  >
                    {buttonInfo.text}
                    {ButtonIcon && <ButtonIcon className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Commodity
                  </p>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg leading-tight">
                        {signal.instrument}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {signal.instrument_type}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs  border ${
                        isBuy
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}
                    >
                      {isBuy ? "Buy" : "Sell"}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                        signal.alreadyViewed
                          ? "bg-gray-100 text-gray-600"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {signal.alreadyViewed ? "Recent Call" : "Live Now"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-4 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-lg p-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Entry
                    </p>
                    <p className="text-md font-bold text-gray-900">
                      ₹{signal.entry_price?.toLocaleString() || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Risk : Reward
                    </p>
                    <p className="text-md font-bold text-gray-900">
                      {signal.risk_reward_ratio?.toLocaleString() || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Duration
                    </p>
                    <p className="text-md font-bold text-gray-900">
                      {signal.duration || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-4 border-b border-gray-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Segment
                    </p>
                    <p className="text-md  text-gray-900">
                      {signal.segment || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Industry
                    </p>
                    <p className="text-md  text-gray-900">
                      {signal.industry || "Energy"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                      Exit
                    </p>
                    <p className="text-md  text-gray-900">
                      {signal.exit_price || "NA"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={signal.author_image || "https://i.pravatar.cc/100?img=12"}
                      alt="author"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://i.pravatar.cc/100?img=12";
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-md  text-gray-900 truncate">
                        {signal.author_name || "RA Arihant Capital"}
                      </p>
                      <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[11px] text-gray-500">{formattedDate}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {signals.length === 0 && !loading && (
        <div className="max-w-md mx-auto text-center py-16 bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
          <div className="text-5xl mb-6">📈</div>
          <h3 className="text-2xl  text-gray-900 mb-3">
            No Active Signals
          </h3>
          <p className="text-gray-600 mb-8">
            {!user ? "Login to view trading recommendations" : "Check back soon!"}
          </p>
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl  shadow-lg hover:shadow-xl transition-all"
            >
              Login
            </button>
          )}
        </div>
      )}
    </section>
  );
}