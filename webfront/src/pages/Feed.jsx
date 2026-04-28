import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, Filter, Lock, Eye, Unlock, AlertCircle } from "lucide-react";
import Newsletter from "./Newsletter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Feed() {
  const [activeTab, setActiveTab] = useState("Free Calls");
  const tabs = ["Free Calls", "Subscription Based"];
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [accessInfo, setAccessInfo] = useState({
    viewedCount: 0,
    remainingViews: 5,
    limitReached: false,
    hasAnySubscription: false,
    subscribedPlanIds: []
  });

  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch signals based on tab and login status
  const fetchSignals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let res;
      
      if (activeTab === "Free Calls") {
        // ========== FREE CALLS TAB ==========
        if (user && token) {
          console.log('📡 Fetching free signals with limit for user');
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
          console.log('📡 Fetching public free signals');
          res = await axios.get(`${apiUrl}/signals/get-signals-free`);
          if (res.data?.success) setSignals(res.data.data || []);
        }
      } else {
        // ========== SUBSCRIPTION BASED TAB (PAID SIGNALS) ==========
        console.log('📡 Fetching paid signals with plan-wise access');
        
        if (user && token) {
          res = await axios.get(`${apiUrl}/signals/get-signals-paid/access`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.data?.success) {
            console.log('✅ Paid signals response:', res.data);
            setSignals(res.data.data || []);
            setAccessInfo(prev => ({
              ...prev,
              hasAnySubscription: res.data.hasAnySubscription || false,
              subscribedPlanIds: res.data.subscribedPlanIds || []
            }));
          }
        } else {
          console.log('📡 Fetching public paid signals preview');
          res = await axios.get(`${apiUrl}/signals/get-signals-paid`);
          
          if (res.data?.success) {
            setSignals(res.data.data || []);
            toast.info('Please login to view premium signals', {
              position: 'top-center',
              autoClose: 3000
            });
          }
        }
      }
    } catch (err) {
      console.error("❌ Error fetching signals:", err);
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, activeTab, user, token]);

  useEffect(() => {
    fetchSignals();
  }, [activeTab]);

  // Handle unlock/track button click
  const handleUnlockClick = async (signal) => {
    console.log('🔘 Button clicked:', { 
      id: signal.id, 
      type: activeTab,
      isLocked: signal.isLocked,
      requiredPlan: signal.requiredPlanName
    });

    // Case 1: User not logged in
    if (!user) {
      setSelectedSignal(signal);
      setShowLoginPrompt(true);
      return;
    }

    // Case 2: Free signal - check limit
    if (activeTab === "Free Calls") {
      if (signal.isLocked) {
        toast.warning(
          <div className="flex flex-col gap-2">
            <p className="font-semibold">⚠️ Free Limit Reached!</p>
            <p className="text-md">You've used all 5 free calls. Subscribe for unlimited access.</p>
            <button 
              onClick={() => navigate('/pricing')}
              className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-md font-semibold hover:bg-orange-600"
            >
              View Plans
            </button>
          </div>,
          {
            position: 'top-center',
            autoClose: false,
            style: { background: '#fff', border: '1px solid #f97316', borderRadius: '12px' }
          }
        );
        return;
      }

      // Track free signal view
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
            
            toast.success(`✅ Signal unlocked! ${trackRes.data.remainingViews} free views remaining`, {
              position: 'top-center',
              autoClose: 3000
            });
          }
        } catch (error) {
          console.error('❌ Track error:', error);
          if (error.response?.status === 403) {
            toast.error('Free limit reached! Please subscribe.', {
              position: 'top-center'
            });
            return;
          }
        }
      }
    }

    // Case 3: Paid signal - check plan-specific subscription
    if (activeTab === "Subscription Based") {
      if (signal.isLocked) {
        // Show plan-specific subscription message
        toast.warning(
          <div className="flex flex-col gap-2">
            <p className="font-semibold">🔒 Premium Signal - {signal.requiredPlanName}</p>
            <p className="text-md">This signal requires an active subscription to <span className="font-bold">{signal.requiredPlanName}</span>.</p>
            <p className="text-xs text-gray-600">Subscribe to this plan to unlock all related signals.</p>
            <button 
              onClick={() => navigate('/pricing', { 
                state: { selectedPlanId: signal.requiredPlanId, planName: signal.requiredPlanName }
              })}
              className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-md font-semibold hover:bg-emerald-700"
            >
              Subscribe to {signal.requiredPlanName}
            </button>
          </div>,
          {
            position: 'top-center',
            autoClose: false,
            style: { background: '#fff', border: '1px solid #059669', borderRadius: '12px' }
          }
        );
        return;
      }
    }

    // Navigate to signal details
    navigate(`/afterbeforesubscription/${signal.id}`);
  };

  // Login prompt modal
  const LoginPromptModal = () => {
    if (!showLoginPrompt || !selectedSignal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fadeIn">
          <button 
            onClick={() => setShowLoginPrompt(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please login to unlock and view this trading signal.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/login', { state: { from: '/feed' } });
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl"
              >
                Login Now
              </button>
              
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl"
              >
                Maybe Later
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              New to InvestBay? <button onClick={() => {
                setShowLoginPrompt(false);
                navigate('/signup');
              }} className="text-emerald-600 font-semibold">Create an account</button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Get button content based on signal status
  const getButtonContent = (signal) => {
    if (!user) {
      return { text: 'Unlock →', icon: Unlock, disabled: false };
    }
    
    if (activeTab === "Subscription Based") {
      if (signal.isLocked) {
        return { text: `Subscribe to ${signal.requiredPlanName || 'Plan'}`, icon: Lock, disabled: true };
      }
      return { text: 'View Details', icon: null, disabled: false };
    }
    
    // Free calls tab logic
    if (signal.isLocked) {
      return { text: 'Locked', icon: Lock, disabled: true };
    }
    if (signal.alreadyViewed) {
      return { text: 'View Again', icon: Eye, disabled: false };
    }
    if (signal.unlockButton) {
      return { text: 'Unlock →', icon: Unlock, disabled: false };
    }
    return { text: 'View Details', icon: null, disabled: false };
  };

  // Format date to IST
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

  const getGradient = (segment, tradeDirection) => {
    if (tradeDirection === "BUY") {
      return "from-green-50 to-emerald-100";
    } else if (tradeDirection === "SELL") {
      return "from-red-50 to-rose-100";
    }
    
    switch (segment) {
      case "Options":
        return "from-blue-50 to-indigo-100";
      case "Equity":
        return "from-purple-50 to-violet-100";
      case "Futures":
        return "from-amber-50 to-orange-100";
      default:
        return "from-gray-50 to-slate-100";
    }
  };

  return (
    <>
      <section className="py-10 px-4 sm:px-8 lg:px-40 min-h-screen">
        {/* Login Modal */}
        <LoginPromptModal />

        {/* Header Tabs */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-4">
          <div className="flex items-center bg-black rounded-full px-2 py-1">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-md transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-black font-medium"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-gray-700 text-md hover:bg-gray-50 transition-all duration-300">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Tab Description */}
        <div className="max-w-6xl mx-auto mb-6">
          <p className="text-md text-gray-600">
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
          <div className="max-w-6xl mx-auto text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Loading {activeTab}...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-6xl mx-auto text-center py-10">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchSignals}
              className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Signals Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 place-items-center">
          {!loading && !error && signals.length > 0 ? (
            signals.map((signal, index) => {
              const buttonInfo = getButtonContent(signal);
              const ButtonIcon = buttonInfo.icon;

              return (
                <div
                  key={signal.id || index}
                  className="relative w-full max-w-[380px] sm:max-w-[350px] md:max-w-[370px] rounded-2xl transition-all duration-300 hover:shadow-lg"
                >
                  <div
                    className={`relative z-10 p-5 sm:p-6 text-gray-800 rounded-2xl bg-gradient-to-r ${getGradient(
                      signal.segment,
                      signal.trade_direction
                    )} shadow-sm ${
                      signal.isLocked ? 'opacity-80' : ''
                    }`}
                  >
                    {/* Lock Overlay for locked signals */}
                    {signal.isLocked && (
                      <div className="absolute inset-0 bg-gray-100 bg-opacity-60 rounded-2xl flex items-center justify-center z-20 backdrop-blur-[1px]">
                        <div className="bg-white rounded-lg p-3 shadow-lg text-center">
                          <Lock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 font-medium">
                            {activeTab === "Free Calls" 
                              ? 'Subscribe to view' 
                              : `Requires ${signal.requiredPlanName || 'Premium'} Plan`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Viewed Badge */}
                    {signal.alreadyViewed && !signal.isLocked && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Viewed
                        </span>
                      </div>
                    )}

                    {/* Plan Badge for Paid Signals */}
                    {activeTab === "Subscription Based" && signal.requiredPlanName && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          {signal.requiredPlanName}
                        </span>
                      </div>
                    )}

                    {/* Date and Time */}
                    <div className="flex justify-between text-gray-700 text-xs sm:text-md mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {formatDate(signal.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {formatTime(signal.created_at)}
                      </div>
                    </div>

                    {/* Profile and Status */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="https://i.pravatar.cc/40"
                        alt="profile"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300"
                      />
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 text-md sm:text-md">
                          {signal.instrument} {signal.instrument_type || ""}
                        </h4>
                        <p className="text-gray-700 text-xs sm:text-md">
                          Status -{" "}
                          <span
                            className={`font-medium ${
                              signal.status === "active"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {signal.status || "Active"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Signal Details Grid */}
                    <div className="grid grid-cols-2 text-left text-gray-900 text-xs sm:text-md gap-y-2 mb-5">
                      <p>
                        <span className="font-semibold">Entry:</span> ₹
                        {signal.entry_price}
                      </p>
                      <p>
                        <span className="font-semibold">SL:</span> ₹
                        {signal.stop_loss}
                      </p>
                      <p>
                        <span className="font-semibold">Target 1:</span> ₹
                        {signal.target_first}
                      </p>
                      <p>
                        <span className="font-semibold">Target 2:</span> ₹
                        {signal.target_second}
                      </p>
                      <p>
                        <span className="font-semibold">Target 3:</span> ₹
                        {signal.target_third}
                      </p>
                      <p>
                        <span className="font-semibold">Risk/Reward:</span>{" "}
                        {signal.risk_reward_ratio}
                      </p>
                      <p className="col-span-2">
                        <span className="font-semibold">Trade:</span>{" "}
                        <span
                          className={`font-medium ${
                            signal.trade_direction === "BUY"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {signal.trade_direction || "BUY"}
                        </span>
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="items-center gap-3">
                      <button
                        onClick={() => !signal.isLocked && handleUnlockClick(signal)}
                        disabled={signal.isLocked}
                        className={`w-full py-2 rounded-md text-md flex items-center justify-center gap-2 transition-colors duration-300 ${
                          signal.isLocked
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'border hover:bg-black hover:text-white'
                        }`}
                      >
                        {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
                        {buttonInfo.text}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Segment Tag */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-0">
                    <div className="py-3 sm:py-4 text-center text-white font-medium text-xs sm:text-md bg-black rounded-b-2xl mt-8">
                      {signal.segment || "Segment"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : !loading && !error ? (
            // No signals state
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-600">
                {!user && activeTab === "Subscription Based"
                  ? "Please login to view premium signals"
                  : user && activeTab === "Subscription Based" && !accessInfo.hasAnySubscription
                  ? "Subscribe to unlock premium signals"
                  : `No ${activeTab} available`}
              </p>
              {!user && activeTab === "Subscription Based" && (
                <button
                  onClick={() => navigate('/login')}
                  className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Login
                </button>
              )}
              {user && activeTab === "Subscription Based" && !accessInfo.hasAnySubscription && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  View Plans
                </button>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}