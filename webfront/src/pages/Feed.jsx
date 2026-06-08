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
              className="mt-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800"
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
              className="mt-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800"
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
    <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Login Prompt Modal */}
        {showLoginPrompt && selectedSignal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 relative shadow-xl">
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900 mb-2">Login Required</h3>
                <p className="text-gray-500 mb-6">Please login to unlock and view this trading signal.</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/login', { state: { from: '/feed' } });
                    }}
                    className="w-full bg-gray-900 text-white font-['Aileron_Black'] font-semibold py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Login Now
                  </button>
                  
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 mt-4">
                  New to InvestBay? <button onClick={() => {
                    setShowLoginPrompt(false);
                    navigate('/signup');
                  }} className="text-green-600 font-semibold">Create an account</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-['Aileron_Black'] font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-gray-600 text-sm hover:border-gray-300 hover:text-gray-900 transition-all duration-300 shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Tab Description */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
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
              <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
            </div>
            <p className="mt-4 text-gray-500 text-sm">Loading {activeTab}...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={fetchSignals}
              className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
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
                    className={`transform transition-all duration-500 ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? 'opacity-40 scale-[0.97]'
                        : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className="group/card relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200">
                      {/* Locked Overlay */}
                      {signal.isLocked && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 rounded-2xl flex items-center justify-center">
                          <div className="text-center p-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <Lock className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium mb-1">
                              {activeTab === "Free Calls" ? "Premium Signal" : `Requires ${signal.requiredPlanName || 'Premium'} Plan`}
                            </p>
                            <p className="text-gray-400 text-sm">Subscribe to unlock</p>
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        {/* Date & Time */}
                        <div className="flex justify-between text-gray-400 text-xs mb-4">
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
                            <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-600 flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Viewed
                            </span>
                          )}
                          {activeTab === "Subscription Based" && signal.requiredPlanName && (
                            <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs text-purple-700">
                              {signal.requiredPlanName}
                            </span>
                          )}
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isBuy 
                              ? "bg-green-50 border border-green-200 text-green-700" 
                              : "bg-red-50 border border-red-200 text-red-700"
                          }`}>
                            {signal.trade_direction || "BUY"}
                          </span>
                        </div>

                        {/* Instrument Info */}
                        <div className="mb-4">
                          <h3 className="text-lg font-['Aileron_Black'] font-bold text-gray-900">
                            {signal.instrument}
                            {signal.instrument_type && (
                              <span className="text-sm font-normal text-gray-400 ml-2">
                                {signal.instrument_type}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {signal.segment || "Segment"}
                          </p>
                        </div>

                        {/* Signal Details Grid */}
                        <div className="grid grid-cols-3 gap-0 bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
                          {[
                            { label: "Entry", value: `₹${signal.entry_price?.toLocaleString() || "N/A"}` },
                            { label: "Stop Loss", value: `₹${signal.stop_loss?.toLocaleString() || "N/A"}` },
                            { label: "Target", value: `₹${signal.target_first?.toLocaleString() || "N/A"}` },
                          ].map((stat, idx) => (
                            <div key={idx} className={`text-center ${idx < 2 ? 'border-r border-gray-200' : ''}`}>
                              <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{stat.label}</div>
                              <div className="text-xs font-bold text-gray-900">{stat.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Risk/Reward */}
                        {signal.risk_reward_ratio && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>R:R {signal.risk_reward_ratio}</span>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          onClick={() => !signal.isLocked && handleUnlockClick(signal)}
                          disabled={signal.isLocked}
                          className={`w-full py-3 rounded-xl text-sm font-['Aileron_Black'] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                            signal.isLocked
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm mb-2">
                  {!user && activeTab === "Subscription Based"
                    ? "Please login to view premium signals"
                    : user && activeTab === "Subscription Based" && !accessInfo.hasAnySubscription
                    ? "Subscribe to unlock premium signals"
                    : `No ${activeTab} available`}
                </p>
                {!user && activeTab === "Subscription Based" && (
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-4 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </button>
                )}
                {user && activeTab === "Subscription Based" && !accessInfo.hasAnySubscription && (
                  <button
                    onClick={() => navigate('/afterbeforesubscription')}
                    className="mt-4 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
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