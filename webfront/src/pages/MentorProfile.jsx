import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Verify from "../assets/verify.png";
import SubscriptionCard from "../admin/components/SubscriptionCard";
import RecentSignalsSection from "../admin/components/RecentSignalsSection";
import { 
  FiAward, FiMapPin, FiStar, FiUsers, FiTarget, 
  FiTrendingUp, FiActivity, FiClock, FiBookOpen, 
  FiGlobe, FiBriefcase, FiShield, FiAlertTriangle,
  FiCheckCircle
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

    const fallbackAvatar = "https://randomuser.me/api/portraits/men/1.jpg";

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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative inline-flex">
                        <div className="w-14 h-14 rounded-full border-2 border-gray-200" />
                        <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-gray-800 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Loading analyst profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <FiAlertTriangle className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-700 text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!analyst) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Analyst not found</p>
                </div>
            </div>
        );
    }

    const topStats = [
        { label: "Rating", value: analyst.rating || "4.6/5", icon: FiStar, color: "text-yellow-500" },
        { label: "Subscribers", value: analyst.subscribers || "1,200+", icon: FiUsers, color: "text-gray-600" },
        { label: "Accuracy", value: analyst.accuracy || "78%", icon: FiTarget, color: "text-gray-800" },
    ];

    const performanceStats = [
        { label: "Total Signals", value: analyst.signal || "0", icon: FiActivity },
        { label: "Active Calls", value: analyst.active_calls || "0", icon: FiTrendingUp },
        { label: "Exited Calls", value: analyst.exited_calls || "0", icon: FiClock },
        { label: "Avg Signal Life", value: analyst.signal_life || "0", icon: FiTarget },
    ];

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <p className="text-sm text-gray-500">
                        Mentors / <span className="text-gray-800">{safeText(analyst.name)}</span>
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
                    
                    {/* Left Scrollable Content */}
                    <div className="space-y-6">
                        
                        {/* Profile Header */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
                            <div className="flex flex-col md:flex-row md:items-start gap-5">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img
                                        src={getImageUrl(analyst.profile_image)}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                        onError={(e) => {
                                            e.currentTarget.src = fallbackAvatar;
                                            e.currentTarget.onerror = null;
                                        }}
                                    />
                                    <div className="absolute -right-1 bottom-1 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center shadow-md">
                                        <FiCheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h2 
                                            className="text-2xl font-bold text-black"
                                            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                                        >
                                            {safeText(analyst.name)}
                                        </h2>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 font-medium">
                                            Verified
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {safeText(analyst.specialization)} • {safeText(analyst.experience)} Years Experience
                                    </p>

                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <FiShield className="text-gray-600 w-4 h-4" />
                                            <span>SEBI Reg. {safeText(analyst.sebi_number)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="text-gray-600 w-4 h-4" />
                                            <span>{safeText(analyst.state)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                                        {topStats.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors duration-300"
                                            >
                                                <div>
                                                    <p 
                                                        className="text-lg font-bold text-black"
                                                        style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                                                    >
                                                        {item.value}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
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
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
                            <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
                                <FiBookOpen className="w-5 h-5 text-gray-700" />
                                Key Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { icon: FiTarget, label: "Specialization", value: safeText(analyst.specialization) },
                                    { icon: FiBriefcase, label: "Current Firm", value: safeText(analyst.company_name) },
                                    { icon: FiAward, label: "Education", value: safeText(analyst.education) },
                                    { icon: FiGlobe, label: "Languages", value: formatLanguages(analyst.languages) },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-300">
                                        <item.icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-500">{item.label}</p>
                                            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Us */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
                            <h3 className="text-lg font-bold text-black mb-4">About</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {analyst.about_us || "No about information available."}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
                            <h3 className="text-lg font-bold text-black mb-4">Description</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {analyst.terms || "No description available"}
                            </p>
                        </div>

                        {/* Subscriptions Section */}
                        <div className="mt-8">
                            <h2 
                                className="text-2xl font-bold text-black mb-6"
                                style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                            >
                                Subscriptions
                            </h2>

                            {subscriptionLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="text-center space-y-3">
                                        <div className="relative inline-flex">
                                            <div className="w-10 h-10 rounded-full border-2 border-gray-200" />
                                            <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-gray-800 border-t-transparent animate-spin" />
                                        </div>
                                        <p className="text-gray-500 text-sm">Loading subscriptions...</p>
                                    </div>
                                </div>
                            ) : subscriptionError ? (
                                <div className="text-center py-16">
                                    <p className="text-gray-700 text-sm">{subscriptionError}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {subscriptions.length === 0 ? (
                                        <p className="col-span-full text-center text-gray-500 py-16">
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
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
                            <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
                                <FiActivity className="w-5 h-5 text-gray-700" />
                                Performance Overview
                            </h3>

                            <div className="space-y-2.5">
                                {performanceStats.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-300"
                                    >
                                        <span 
                                            className="text-lg font-bold text-black"
                                            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                                        >
                                            {item.value}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{item.label}</span>
                                            <item.icon className="w-4 h-4 text-gray-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                                <FiAlertTriangle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-600 leading-relaxed">
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