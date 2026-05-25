import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, Filter, Lock, Eye, Unlock, AlertCircle, TrendingUp, TrendingDown, Target, Shield, BarChart3 } from "lucide-react";
import Newsletter from "./Newsletter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArrowRight } from "react-icons/fi";

export default function Feed() {
  const [activeTab, setActiveTab] = useState("Free Calls");
  const tabs = ["Free Calls", "Subscription Based"];
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [accessInfo, setAccessInfo] = useState({
    viewedCount: 0,
    remainingViews: 5,
    limitReached: false,
    hasAnySubscription: false,
    subscribedPlanIds: []
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchSignals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let res;
      
      if (activeTab === "Free Calls") {
        if (user && token) {
          res = await axios.get(`${apiUrl}/signals/get-signals-free/limited`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.data?.success) {
            setSignals(res.data.data || []);
            setAccessInfo({
              viewedCount: res.data.viewedCount || 0,
              remainingViews: res.data.remainingViews || 0,
              limitReached: res.data.limitReached || false,
              hasAnySubscription: res.data.hasSubscription || false,
              subscribedPlanIds: []
            });
          }
        } else {
          res = await axios.get(`${apiUrl}/signals/get-signals-free`);
          if (res.data?.success) setSignals(res.data.data || []);
        }
      } else {
        if (user && token) {
          res = await axios.get(`${apiUrl}/signals/get-signals-paid/access`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.data?.success) {
            setSignals(res.data.data || []);
            setAccessInfo(prev => ({
              ...prev,
              hasAnySubscription: res.data.hasAnySubscription || false,
              subscribedPlanIds: res.data.subscribedPlanIds || []
            }));
          }
        } else {
          res = await axios.get(`${apiUrl}/signals/get-signals-paid`);
          if (res.data?.success) setSignals(res.data.data || []);
        }
      }
    } catch (err) {
      console.error("Error fetching signals:", err);
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, activeTab, user, token]);

  useEffect(() => {
    fetchSignals();
  }, [activeTab]);

  const handleUnlockClick = async (signal) => {
    if (!user) {
      setSelectedSignal(signal);
      setShowLoginPrompt(true);
      return;
    }

    if (activeTab === "Free Calls") {
      if (signal.isLocked) {
        toast.warning(
          <div className="flex flex-col gap-2">
            <p className="font-semibold">⚠️ Free Limit Reached!</p>
            <p className="text-sm">You've used all 5 free calls. Subscribe for unlimited access.</p>
            <button 
              onClick={() => navigate('/pricing')}
              className="mt-2 bg-emerald-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-400"
            >
              View Plans
            </button>
          </div>,
          { position: 'top-center', autoClose: false }
        );
        return;
      }

      if (!signal.alreadyViewed && !accessInfo.hasAnySubscription) {
        try {
          const trackRes = await axios.post(
            `${apiUrl}/signals/track-signal-view/${signal.id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (trackRes.data.success) {
            setAccessInfo(prev => ({
              ...prev,
              viewedCount: trackRes.data.viewedCount || prev.viewedCount + 1,
              remainingViews: trackRes.data.remainingViews || prev.remainingViews - 1
            }));
            
            setSignals(prevSignals => 
              prevSignals.map(s => 
                s.id === signal.id 
                  ? { ...s, alreadyViewed: true, canView: true, unlockButton: false }
                  : s
              )
            );
          }
        } catch (error) {
          if (error.response?.status === 403) {
            toast.error('Free limit reached! Please subscribe.');
            return;
          }
        }
      }
    }

    if (activeTab === "Subscription Based") {
      if (signal.isLocked) {
        toast.warning(
          <div className="flex flex-col gap-2">
            <p className="font-semibold">🔒 Premium Signal - {signal.requiredPlanName}</p>
            <p className="text-sm">This signal requires an active subscription to {signal.requiredPlanName}.</p>
            <button 
              onClick={() => navigate('/pricing', { 
                state: { selectedPlanId: signal.requiredPlanId, planName: signal.requiredPlanName }
              })}
              className="mt-2 bg-emerald-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-400"
            >
              Subscribe to {signal.requiredPlanName}
            </button>
          </div>,
          { position: 'top-center', autoClose: false }
        );
        return;
      }
    }

    navigate(`/afterbeforesubscription/${signal.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Time";
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getButtonContent = (signal) => {
    if (!user) return { text: 'Unlock', icon: Unlock, disabled: false };
    if (activeTab === "Subscription Based") {
      if (signal.isLocked) return { text: `Subscribe to ${signal.requiredPlanName || 'Plan'}`, icon: Lock, disabled: true };
      return { text: 'View Details', icon: FiArrowRight, disabled: false };
    }
    if (signal.isLocked) return { text: 'Locked', icon: Lock, disabled: true };
    if (signal.alreadyViewed) return { text: 'View Again', icon: Eye, disabled: false };
    if (signal.unlockButton) return { text: 'Unlock', icon: Unlock, disabled: false };
    return { text: 'View Details', icon: FiArrowRight, disabled: false };
  };

  return (
    <section className="min-h-screen bg-[#060b10] py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Login Prompt Modal */}
        {showLoginPrompt && selectedSignal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0f16] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 relative">
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-emerald-400" />
                </div>
                
                <h3 className="text-xl font-bold text-[#f0f4f8] mb-2">Login Required</h3>
                <p className="text-slate-400 mb-6">Please login to unlock and view this trading signal.</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/login', { state: { from: '/feed' } });
                    }}
                    className="w-full bg-emerald-500 text-black font-semibold py-3 px-4 rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    Login Now
                  </button>
                  
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="w-full bg-white/[0.05] text-slate-300 font-semibold py-3 px-4 rounded-xl hover:bg-white/[0.08] transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
                
                <p className="text-xs text-slate-500 mt-4">
                  New to InvestBay? <button onClick={() => {
                    setShowLoginPrompt(false);
                    navigate('/signup');
                  }} className="text-emerald-400 font-semibold">Create an account</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-full p-1">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-emerald-500 text-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-full text-slate-400 text-sm hover:border-white/[0.1] hover:text-slate-300 transition-all duration-300">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Tab Description */}
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            {activeTab === "Free Calls" 
              ? user 
                ? `You have ${accessInfo.remainingViews} free views remaining`
                : "Login to unlock free signals"
              : user 
                ? accessInfo.hasAnySubscription 
                  ? `You have access to ${accessInfo.subscribedPlanIds.length} premium plan(s)`
                  : "Subscribe to unlock premium signals"
                : "Login to view premium signals"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative inline-flex">
              <div className="w-12 h-12 rounded-full border-2 border-white/[0.06]" />
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            </div>
            <p className="mt-4 text-slate-400 text-sm">Loading {activeTab}...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchSignals}
              className="px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Signals Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.length > 0 ? (
              signals.map((signal, index) => {
                const buttonInfo = getButtonContent(signal);
                const ButtonIcon = buttonInfo.icon;
                const isBuy = signal.trade_direction === "BUY";

                return (
                  <div
                    key={signal.id || index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`transform transition-all duration-500 hover:-translate-y-2 ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? 'opacity-40 scale-[0.97] blur-[1px]'
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5">
                      {/* Top glow line */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                      {/* Locked Overlay */}
                      {signal.isLocked && (
                        <div className="absolute inset-0 bg-[#060b10]/80 backdrop-blur-md z-20 rounded-2xl flex items-center justify-center">
                          <div className="text-center p-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                              <Lock className="w-6 h-6 text-slate-500" />
                            </div>
                            <p className="text-slate-400 font-medium mb-1">
                              {activeTab === "Free Calls" ? "Premium Signal" : `Requires ${signal.requiredPlanName || 'Premium'} Plan`}
                            </p>
                            <p className="text-slate-600 text-sm">Subscribe to unlock</p>
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        {/* Date & Time */}
                        <div className="flex justify-between text-slate-500 text-xs mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(signal.created_at)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(signal.created_at)}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-4">
                          {signal.alreadyViewed && !signal.isLocked && (
                            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-slate-400 flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Viewed
                            </span>
                          )}
                          {activeTab === "Subscription Based" && signal.requiredPlanName && (
                            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">
                              {signal.requiredPlanName}
                            </span>
                          )}
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isBuy 
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                              : "bg-red-500/10 border border-red-500/20 text-red-400"
                          }`}>
                            {signal.trade_direction || "BUY"}
                          </span>
                        </div>

                        {/* Instrument Info */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-[#f0f4f8]">
                            {signal.instrument}
                            {signal.instrument_type && (
                              <span className="text-sm font-normal text-slate-400 ml-2">
                                {signal.instrument_type}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {signal.segment || "Segment"}
                          </p>
                        </div>

                        {/* Signal Details Grid */}
                        <div className="grid grid-cols-3 gap-0 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 mb-4">
                          {[
                            { label: "Entry", value: `₹${signal.entry_price?.toLocaleString() || "N/A"}` },
                            { label: "Stop Loss", value: `₹${signal.stop_loss?.toLocaleString() || "N/A"}` },
                            { label: "Target", value: `₹${signal.target_first?.toLocaleString() || "N/A"}` },
                          ].map((stat, idx) => (
                            <div key={idx} className={`text-center ${idx < 2 ? 'border-r border-white/[0.05]' : ''}`}>
                              <div className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">{stat.label}</div>
                              <div className="text-xs font-bold text-[#f0f4f8]">{stat.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Risk/Reward */}
                        {signal.risk_reward_ratio && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>R:R {signal.risk_reward_ratio}</span>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          onClick={() => !signal.isLocked && handleUnlockClick(signal)}
                          disabled={signal.isLocked}
                          className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                            signal.isLocked
                              ? 'bg-white/[0.03] text-slate-600 cursor-not-allowed border border-white/[0.05]'
                              : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25'
                          }`}
                        >
                          {buttonInfo.text}
                          {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm mb-2">
                  {!user && activeTab === "Subscription Based"
                    ? "Please login to view premium signals"
                    : user && activeTab === "Subscription Based" && !accessInfo.hasAnySubscription
                    ? "Subscribe to unlock premium signals"
                    : `No ${activeTab} available`}
                </p>
                {!user && activeTab === "Subscription Based" && (
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-4 px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    Login
                  </button>
                )}
                {user && activeTab === "Subscription Based" && !accessInfo.hasAnySubscription && (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="mt-4 px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    View Plans
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}