import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Verify from "../assets/verify.png";
import SubscriptionCard from "../admin/components/SubscriptionCard";
import SignalCard from "../admin/components/SignalCard";
import { 
  FiAward, FiMapPin, FiTarget, FiBriefcase, 
  FiBookOpen, FiGlobe, FiUsers, FiVideo,
  FiActivity, FiTrendingUp, FiClock, FiShield,
  FiStar
} from "react-icons/fi";

export default function PlanPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [analyst, setAnalyst] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [signalLoading, setSignalLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionError, setSubscriptionError] = useState(null);
    const [signalError, setSignalError] = useState(null);

    // Fallback images
    const fallbackAvatar = "https://i.pravatar.cc/300";

    const getImageUrl = (imageField) => {
        if (!imageField) return fallbackAvatar;
        if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
            return imageField;
        }
        if (imageField.startsWith('/')) {
            return `${apiUrl}${imageField}`;
        }
        return `${apiUrl}/${imageField}`;
    };

    const fetchSignals = useCallback(async () => {
        try {
            setSignalLoading(true);
            const res = await axios.get(`${apiUrl}/signals/signalsbyuser/${id}`);
            if (res.data.success) {
                setSignals(res.data.data || []);
            } else {
                setSignalError("Failed to fetch signals");
            }
        } catch (err) {
            console.error(err);
            setSignalError("Server error");
        } finally {
            setSignalLoading(false);
        }
    }, [apiUrl, id]);

    useEffect(() => {
        const fetchAnalystById = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiUrl}/research-analyst/${id}`);
                if (res.data.success) {
                    setAnalyst(res.data.data);
                } else {
                    setError("Failed to fetch analyst details");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalystById();
    }, [apiUrl, id]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setSubscriptionLoading(true);
                const res = await axios.get(`${apiUrl}/plans/plansbyuser/${id}`);
                if (res.data.success) {
                    setSubscriptions(res.data.data || []);
                } else {
                    setSubscriptionError("Failed to fetch subscription details");
                }
            } catch (err) {
                console.error(err);
                setSubscriptionError("Server error");
            } finally {
                setSubscriptionLoading(false);
            }
        };
        fetchSubscriptions();
    }, [apiUrl, id]);

    useEffect(() => {
        fetchSignals();
    }, [fetchSignals]);

    const refreshSignals = () => {
        fetchSignals();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative inline-flex">
                        <div className="w-14 h-14 rounded-full border-2 border-white/[0.06]" />
                        <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Loading analyst profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!analyst) {
        return (
            <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
                <div className="text-center">
                    <FiUsers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Analyst not found</p>
                </div>
            </div>
        );
    }

    const formatLanguages = (langs) => {
        if (!langs) return "N/A";

        if (Array.isArray(langs)) {
            return langs.join(", ");
        }

        if (typeof langs === "string") {
            const cleaned = langs
                .replace(/[{}"]/g, "")
                .split(",")
                .map((lang) => {
                    const trimmed = lang.trim();
                    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                })
                .filter(Boolean);

            return cleaned.join(", ");
        }

        return "N/A";
    };

    const stats = [
        { icon: FiActivity, label: "Total Signals", value: analyst.signal || "0" },
        { icon: FiTrendingUp, label: "Active Calls", value: analyst.active_calls || "0" },
        { icon: FiClock, label: "Exited Calls", value: analyst.exited_calls || "0" },
        { icon: FiTarget, label: "Avg Signal Life", value: analyst.signal_life || "0" },
    ];

    const professionalDetails = [
        { icon: FiShield, label: "SEBI Registration Number", value: analyst.sebi_number || "N/A" },
        { icon: FiMapPin, label: "State", value: analyst.state || "N/A" },
        { icon: FiTarget, label: "Specialization", value: analyst.specialization || "N/A" },
        { icon: FiBriefcase, label: "Current Firm / Company", value: analyst.company_name || "N/A" },
        { icon: FiAward, label: "Education / Certification", value: analyst.education || "N/A" },
        { icon: FiGlobe, label: "Languages", value: formatLanguages(analyst.languages) },
        { icon: FiUsers, label: "Subscription", value: analyst.subcription || "N/A" },
        { icon: FiVideo, label: "Courses", value: analyst.courses || "N/A" },
    ];

    return (
        <div className="min-h-screen bg-[#060b10] py-10 px-4 sm:px-6 lg:px-8">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* LEFT PROFILE SECTION */}
                    <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-emerald-500/20">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10" />

                        <div className="w-full h-[400px] flex-shrink-0 relative">
                            <img
                                src={getImageUrl(analyst.profile_image)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = fallbackAvatar;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#060b10] via-[#060b10]/40 to-transparent" />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-grow">
                                    <h2 className="text-xl font-bold text-[#f0f4f8] mb-1">
                                        {analyst.name || "N/A"}
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        {analyst.experience || "0"} years of experience
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <img src={Verify} alt="Verified" className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="space-y-2.5 flex-grow">
                                {stats.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors duration-300"
                                    >
                                        <item.icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        <p className="text-sm text-slate-400">{item.label}</p>
                                        <p className="text-sm font-semibold text-[#f0f4f8] ml-auto">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT DETAILS SECTION */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        
                        {/* Professional Details */}
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-xl font-bold text-[#f0f4f8] mb-4 flex items-center gap-2">
                                <FiAward className="w-5 h-5 text-emerald-400" />
                                Professional Details
                            </h3>
                            <div className="border-t border-white/[0.05] pt-4">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {professionalDetails.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors duration-300">
                                            <item.icon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <div className="min-w-0">
                                                <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-0.5">{item.label}</p>
                                                <p className="text-sm font-semibold text-slate-300 break-words">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* About Us */}
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-lg font-bold text-[#f0f4f8] mb-4 flex items-center gap-2">
                                <FiBookOpen className="w-5 h-5 text-emerald-400" />
                                About Us
                            </h3>
                            <div className="border-t border-white/[0.05] pt-4">
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {analyst?.about_us || "No about information available."}
                                </p>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-lg font-bold text-[#f0f4f8] mb-4 flex items-center gap-2">
                                <FiShield className="w-5 h-5 text-emerald-400" />
                                Terms & Conditions
                            </h3>
                            <div className="border-t border-white/[0.05] pt-4">
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {analyst?.terms || "No description available"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUBSCRIPTIONS SECTION */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6 flex items-center gap-3">
                        <FiUsers className="w-6 h-6 text-emerald-400" />
                        Subscriptions
                    </h2>
                    
                    {subscriptionLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center space-y-3">
                                <div className="relative inline-flex">
                                    <div className="w-10 h-10 rounded-full border-2 border-white/[0.06]" />
                                    <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                                </div>
                                <p className="text-slate-500 text-sm">Loading subscriptions...</p>
                            </div>
                        </div>
                    ) : subscriptionError ? (
                        <div className="text-center py-16">
                            <p className="text-red-400 text-sm">{subscriptionError}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subscriptions.length === 0 ? (
                                <div className="col-span-full text-center py-16">
                                    <FiUsers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-500 text-sm">No subscriptions found</p>
                                </div>
                            ) : (
                                subscriptions.map((subscription) => (
                                    <SubscriptionCard 
                                        key={subscription.id} 
                                        subscription={subscription} 
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* SIGNALS SECTION */}
                {signals.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6 flex items-center gap-3">
                            <FiActivity className="w-6 h-6 text-emerald-400" />
                            Recent Signals
                        </h2>
                        
                        {signalLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center space-y-3">
                                    <div className="relative inline-flex">
                                        <div className="w-10 h-10 rounded-full border-2 border-white/[0.06]" />
                                        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                                    </div>
                                    <p className="text-slate-500 text-sm">Loading signals...</p>
                                </div>
                            </div>
                        ) : signalError ? (
                            <div className="text-center py-16">
                                <p className="text-red-400 text-sm">{signalError}</p>
                                <button
                                    onClick={refreshSignals}
                                    className="mt-4 px-4 py-2 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {signals.map((signal) => (
                                    <SignalCard 
                                        key={signal.id} 
                                        signal={signal} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}