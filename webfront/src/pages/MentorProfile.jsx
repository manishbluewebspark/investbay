import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Verify from "../assets/verify.png";
import SubscriptionCard from "../admin/components/SubscriptionCard";
import RecentSignalsSection from "../admin/components/RecentSignalsSection";

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
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    if (!analyst) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Analyst not found
            </div>
        );
    }

    const topStats = [
        {
            label: "Rating",
            value: analyst.rating || "4.6/5",
        },
        {
            label: "Subscribers",
            value: analyst.subscribers || "1,200+",
        },
        {
            label: "Accuracy",
            value: analyst.accuracy || "78%",
        },
    ];

    const performanceStats = [
        ["Total Signal", analyst.signal || "0"],
        ["Active Calls", analyst.active_calls || "0"],
        ["Exited Calls", analyst.exited_calls || "0"],
        ["Avg Signal Life", analyst.signal_life || "0"],
    ];

    return (
        <div className="min-h-screen bg-[#f7f8fb] py-6">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-5 text-md text-gray-500">
                    Mentors / {safeText(analyst.name)}
                </div>

                {/* Main Layout: Left scrollable content + Right fixed sidebar */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start xl:h-[calc(100vh-200px)]">
                    
                    {/* Left Scrollable Content */}
                    <div className="xl:overflow-y-auto xl:max-h-[calc(100vh-200px)] space-y-6 pr-4 xl:pr-8">
                        
                        {/* Profile Header Section */}
                        <div className="bg-[#f3f8f2] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white p-6">
                            <div className="flex flex-col md:flex-row md:items-start gap-5">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img
                                        src={
                                            analyst.profile_image
                                                ? analyst.profile_image
                                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                        }
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                    <div className="absolute -right-1 bottom-1 w-7 h-7 rounded-full bg-[#19c37d] flex items-center justify-center shadow-md">
                                        <img src={Verify} alt="Verified" className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-2xl font-semibold text-gray-900">
                                            {safeText(analyst.name)}
                                        </h2>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-white text-[#19c37d] border border-[#d9f3e7] font-medium">
                                            Verified
                                        </span>
                                    </div>

                                    <p className="text-md text-gray-500 mt-1">
                                        {safeText(analyst.specialization)} •{" "}
                                        {safeText(analyst.experience)} Years Experience
                                    </p>

                                    <div className="flex flex-wrap gap-4 mt-3 text-md text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#19c37d]">▣</span>
                                            <span>SEBI Reg. {safeText(analyst.sebi_number)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#19c37d]">⌂</span>
                                            <span>{safeText(analyst.state)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                                        {topStats.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white/90 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100"
                                            >
                                                <div>
                                                    <p className="text-md font-semibold text-gray-900">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {item.label}
                                                    </p>
                                                </div>
                                                <span className="text-[#19c37d] text-md">●</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Information */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-5">
                                Key Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-xl bg-gray-50 px-4 py-4">
                                    <p className="text-xs text-gray-500">Specialization</p>
                                    <p className="text-md font-semibold text-gray-900 mt-1">
                                        {safeText(analyst.specialization)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 px-4 py-4">
                                    <p className="text-xs text-gray-500">Current Firm</p>
                                    <p className="text-md font-semibold text-gray-900 mt-1">
                                        {safeText(analyst.company_name)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 px-4 py-4">
                                    <p className="text-xs text-gray-500">Education</p>
                                    <p className="text-md font-semibold text-gray-900 mt-1">
                                        {safeText(analyst.education)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 px-4 py-4">
                                    <p className="text-xs text-gray-500">Languages</p>
                                    <p className="text-md font-semibold text-gray-900 mt-1">
                                        {formatLanguages(analyst.languages)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* About Us */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                About Us
                            </h3>
                            <p className="text-md text-gray-700 leading-7">
                                {analyst.about_us ||
                                    "No about information available."}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Description
                            </h3>
                            <p className="text-md text-gray-700 leading-7">
                                {analyst.terms || "No description available"}
                            </p>
                        </div>

                        {/* Subscriptions Section */}
                        <div className="mt-10">
                            <h1 className="text-2xl font-semibold mb-6 text-gray-900">
                                Subscriptions
                            </h1>

                            {subscriptionLoading ? (
                                <div className="flex items-center justify-center py-10 text-gray-500">
                                    Loading subscriptions...
                                </div>
                            ) : subscriptionError ? (
                                <div className="flex items-center justify-center py-10 text-red-500">
                                    {subscriptionError}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {subscriptions.length === 0 ? (
                                        <p className="col-span-full text-center text-gray-500 py-10">
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
                        <div className="mt-10">
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
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-5 w-full max-w-md">
                            <h3 className="text-md font-semibold text-gray-900 mb-4">
                                Performance Overview
                            </h3>

                            <div className="space-y-3">
                                {performanceStats.map(([label, value], index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                                    >
                                        <span className="text-md font-medium text-gray-900">
                                            {value}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 rounded-xl bg-amber-50 text-xs text-amber-700 leading-relaxed">
                                ⚠ Past performance is not indicative of future returns. Trade at your own risk.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}