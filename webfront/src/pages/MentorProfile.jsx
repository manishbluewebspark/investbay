import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Verify from "../assets/verify.png";
import SubscriptionCard from "../admin/components/SubscriptionCard";
import RecentSignalsSection from "../admin/components/RecentSignalsSection";
import { 
  FiAward, FiMapPin, FiStar, FiUsers, FiTarget, 
  FiTrendingUp, FiActivity, FiClock, FiBookOpen, 
  FiGlobe, FiBriefcase, FiShield, FiAlertTriangle 
} from "react-icons/fi";

export default function AnalystView() {
    const { id } = useParams();
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
    const fallbackAvatar = "https://i.pravatar.cc/150";

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

    const fetchSignals = async () => {
        try {
            setSignalLoading(true);
            setSignalError(null);

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
    };

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
                setSubscriptionError(null);

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
    }, [apiUrl, id]);

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

    const safeText = (value) => (value && String(value).trim() ? value : "N/A");

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

    const topStats = [
        { label: "Rating", value: analyst.rating || "4.6/5", icon: FiStar, color: "text-yellow-400" },
        { label: "Subscribers", value: analyst.subscribers || "1,200+", icon: FiUsers, color: "text-blue-400" },
        { label: "Accuracy", value: analyst.accuracy || "78%", icon: FiTarget, color: "text-emerald-400" },
    ];

    const performanceStats = [
        { label: "Total Signals", value: analyst.signal || "0", icon: FiActivity },
        { label: "Active Calls", value: analyst.active_calls || "0", icon: FiTrendingUp },
        { label: "Exited Calls", value: analyst.exited_calls || "0", icon: FiClock },
        { label: "Avg Signal Life", value: analyst.signal_life || "0", icon: FiTarget },
    ];

    return (
        <div className="min-h-screen bg-[#060b10] py-8 px-4 sm:px-6 lg:px-8">
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
                {/* Breadcrumb */}
                <div className="mb-6">
                    <p className="text-sm text-slate-500">
                        Mentors / <span className="text-slate-300">{safeText(analyst.name)}</span>
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
                    
                    {/* Left Scrollable Content */}
                    <div className="space-y-6">
                        
                        {/* Profile Header */}
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <div className="flex flex-col md:flex-row md:items-start gap-5">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img
                                        src={getImageUrl(analyst.profile_image)}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/20"
                                        onError={(e) => {
                                            e.currentTarget.src = fallbackAvatar;
                                            e.currentTarget.onerror = null;
                                        }}
                                    />
                                    <div className="absolute -right-1 bottom-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <img src={Verify} alt="Verified" className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold text-[#f0f4f8]">
                                            {safeText(analyst.name)}
                                        </h2>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                                            Verified
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-400 mt-1">
                                        {safeText(analyst.specialization)} • {safeText(analyst.experience)} Years Experience
                                    </p>

                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <FiShield className="text-emerald-400 w-4 h-4" />
                                            <span>SEBI Reg. {safeText(analyst.sebi_number)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="text-emerald-400 w-4 h-4" />
                                            <span>{safeText(analyst.state)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                                        {topStats.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 flex items-center justify-between hover:bg-white/[0.05] transition-colors duration-300"
                                            >
                                                <div>
                                                    <p className="text-lg font-bold text-[#f0f4f8]">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {item.label}
                                                    </p>
                                                </div>
                                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Information */}
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-lg font-bold text-[#f0f4f8] mb-5 flex items-center gap-2">
                                <FiBookOpen className="w-5 h-5 text-emerald-400" />
                                Key Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { icon: FiTarget, label: "Specialization", value: safeText(analyst.specialization) },
                                    { icon: FiBriefcase, label: "Current Firm", value: safeText(analyst.company_name) },
                                    { icon: FiAward, label: "Education", value: safeText(analyst.education) },
                                    { icon: FiGlobe, label: "Languages", value: formatLanguages(analyst.languages) },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors duration-300">
                                        <item.icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-slate-600">{item.label}</p>
                                            <p className="text-sm font-semibold text-slate-300">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Us */}
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-lg font-bold text-[#f0f4f8] mb-4">About</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {analyst.about_us || "No about information available."}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-lg font-bold text-[#f0f4f8] mb-4">Description</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {analyst.terms || "No description available"}
                            </p>
                        </div>

                        {/* Subscriptions Section */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-[#f0f4f8] mb-6">Subscriptions</h2>

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
                                        <p className="col-span-full text-center text-slate-500 py-16">
                                            No subscriptions found
                                        </p>
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

                        {/* Recent Signals Section */}
                        <div className="mt-8">
                            <RecentSignalsSection
                                signals={signals}
                                signalLoading={signalLoading}
                                signalError={signalError}
                                refreshSignals={fetchSignals}
                            />
                        </div>
                    </div>

                    {/* Right Fixed Performance Sidebar */}
                    <div className="hidden xl:block xl:sticky xl:top-6 xl:self-start">
                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-lg font-bold text-[#f0f4f8] mb-5 flex items-center gap-2">
                                <FiActivity className="w-5 h-5 text-emerald-400" />
                                Performance Overview
                            </h3>

                            <div className="space-y-2.5">
                                {performanceStats.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors duration-300"
                                    >
                                        <span className="text-lg font-bold text-[#f0f4f8]">
                                            {item.value}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">{item.label}</span>
                                            <item.icon className="w-4 h-4 text-emerald-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-3">
                                <FiAlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-500/80 leading-relaxed">
                                    Past performance is not indicative of future returns. Trade at your own risk.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}