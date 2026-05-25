import { useNavigate } from "react-router-dom";
import bgImage from "../assets/profile-bg.jpg";
import Verify from "../assets/Verify.svg";
import { Filter, Zap, TrendingUp, Shield, Target, DollarSign, Activity } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";

export default function FeaturedSubscriptions() {
  const tabs = ["All Subscriptions", "My Subscriptions"];
  const [activeTab, setActiveTab] = useState("All Subscriptions");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${apiUrl}/plans/plans`);

      if (res?.data?.success) {
        setSubscriptions(res.data.data || []);
      } else {
        setError("Failed to fetch subscriptions");
      }
    } catch (err) {
      console.error("Error fetching subscriptions", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filteredSubscriptions = useMemo(() => {
    if (activeTab === "My Subscriptions") {
      if (!user) {
        navigate("/login");
        return subscriptions;
      }
      return subscriptions.filter((sub) => sub.is_subscribed);
    }
    return subscriptions;
  }, [activeTab, subscriptions, user, navigate]);

  // Fallback images for broken images
  const fallbackImages = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f193?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=200&h=200&fit=crop",
  ];

  const getImageUrl = (sub, index) => {
    const imageField = sub?.uploded_image || sub?.image || sub?.plan_image;
    
    if (!imageField) return fallbackImages[index % fallbackImages.length];
    
    if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
      return imageField;
    }
    
    if (imageField.startsWith('/')) {
      return `${apiUrl}${imageField}`;
    }
    
    return `${apiUrl}/${imageField}`;
  };

  return (
    <section className="min-h-screen bg-[#060b10] py-10 px-4 sm:px-6 lg:px-8">
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
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="inline-flex items-center bg-white/[0.03] border border-white/[0.06] rounded-full p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "My Subscriptions" && !user) {
                      navigate("/login");
                    }
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-500 text-black"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Filter Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-sm text-slate-400 hover:border-white/[0.1] hover:text-slate-300 transition-all duration-300"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Zap, label: "Total Plans", value: subscriptions.length },
            { icon: TrendingUp, label: "Success Rate", value: "94%" },
            { icon: Shield, label: "SEBI Reg.", value: "200+" },
            { icon: Activity, label: "Active Users", value: "50K+" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-4 text-center group hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-300">
              <div className="flex justify-center mb-2">
                <stat.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-[#f0f4f8]">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative inline-flex">
              <div className="w-12 h-12 rounded-full border-2 border-white/[0.06]" />
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            </div>
            <p className="mt-4 text-slate-400 text-sm">Loading subscriptions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchSubscriptions}
              className="px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSubscriptions.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                  <Zap className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-[#f0f4f8] mb-2">
                  No Subscriptions Found
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  {activeTab === "My Subscriptions" 
                    ? "You haven't subscribed to any plans yet. Explore available plans below."
                    : "No subscription plans available at the moment."}
                </p>
              </div>
            ) : (
              filteredSubscriptions.map((sub, index) => {
                const price = Number(sub.plan_price) || 0;
                const discount = Number(sub.discount) || 0;
                const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : 0;
                const imageUrl = getImageUrl(sub, index);
                const fallbackImage = fallbackImages[index % fallbackImages.length];

                return (
                  <div
                    key={sub.id}
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
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10" />

                      {/* Top Banner */}
                      <div
                        className="relative h-36 bg-cover bg-center"
                        style={{ backgroundImage: `url(${bgImage})` }}
                      >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060b10] via-[#060b10]/60 to-transparent" />

                        {/* Avatar */}
                        <div className="absolute -bottom-10 left-5 z-10">
                          <img
                            src={imageUrl}
                            alt={sub.plan_name || "Subscription"}
                            className="h-20 w-20 rounded-full border-4 border-[#060b10] object-cover shadow-xl bg-[#060b10]"
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </div>

                        {/* Segment Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                            {sub.segment || "N/A"}
                          </span>
                        </div>

                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-xs font-bold text-red-300">
                              {discount}% OFF
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="px-5 pb-6 pt-14">
                        {/* Title Row */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#f0f4f8] group-hover/card:text-emerald-200 transition-colors duration-300">
                              {sub.plan_name || "Untitled Plan"}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {sub.category || "Research Analyst"}
                            </p>
                          </div>

                          <img
                            src={Verify}
                            alt="verified"
                            className="mt-1 h-5 w-5 shrink-0 brightness-150 saturate-150"
                          />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover/card:bg-white/[0.04] transition-colors duration-300">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Target className="w-3 h-3 text-slate-500" />
                              <p className="text-[10px] uppercase tracking-wider text-slate-600">Calls</p>
                            </div>
                            <p className="text-sm font-bold text-[#f0f4f8]">
                              {sub.avg_trades || "N/A"}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover/card:bg-white/[0.04] transition-colors duration-300">
                            <div className="flex items-center gap-1.5 mb-1">
                              <DollarSign className="w-3 h-3 text-slate-500" />
                              <p className="text-[10px] uppercase tracking-wider text-slate-600">Capital</p>
                            </div>
                            <p className="text-sm font-bold text-[#f0f4f8]">
                              {sub.ideal_capital || "N/A"}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover/card:bg-white/[0.04] transition-colors duration-300">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Shield className="w-3 h-3 text-slate-500" />
                              <p className="text-[10px] uppercase tracking-wider text-slate-600">Stoploss</p>
                            </div>
                            <p className="text-sm font-bold text-[#f0f4f8]">
                              {sub.stop_loss ? `${sub.stop_loss}%` : "N/A"}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover/card:bg-white/[0.04] transition-colors duration-300">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Activity className="w-3 h-3 text-slate-500" />
                              <p className="text-[10px] uppercase tracking-wider text-slate-600">Segment</p>
                            </div>
                            <p className="text-sm font-bold text-[#f0f4f8]">
                              {sub.segment || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.05]">
                          <div>
                            <span className="text-lg font-bold text-emerald-400">
                              ₹{price.toLocaleString()}
                            </span>
                            {discount > 0 && (
                              <span className="ml-2 text-xs text-slate-600 line-through">
                                ₹{originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-xs text-slate-500 ml-1">/plan</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => navigate(`/subscription/${sub.id}`)}
                            className="group/btn relative flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                          >
                            View Details
                            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}