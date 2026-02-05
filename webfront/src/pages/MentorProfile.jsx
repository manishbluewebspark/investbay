import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Verify from "../assets/verify.png";
import SubscriptionCard from "../admin/components/SubscriptionCard";
import SignalCard from "../admin/components/SignalCard";

export default function AnalystView() {
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

    useEffect(() => {
        const fetchAnalystById = async () => {
            try {
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
                const res = await axios.get(`${apiUrl}/plans/plansbyuser/${id}`);
                if (res.data.success) {
                    console.log(res.data.data, 'plans...');
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
        const fetchSignals = async () => {
            try {
                const res = await axios.get(`${apiUrl}/signals/signalsbyuser/${id}`);
                if (res.data.success) {
                    console.log(res.data.data, 'signals...');
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
        fetchSignals();
    }, [apiUrl, id]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${apiUrl}/courses/${id}`);
                if (res.data.success) {
                    console.log(res.data.data, 'courses..');
                } else {
                    console.error("Failed to fetch courses");
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, [apiUrl, id]);

    const refreshSignals = () => {
        setSignalLoading(true);
        fetchSignals();
    };

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
        ["Total Signal", analyst.signal || "0"],
        ["Total Active Calls", analyst.active_calls || "0"],
        ["Total Exited Calls", analyst.exited_calls || "0"],
        ["Avg. Signal Life", analyst.signal_life || "0"],
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-full px-6 lg:px-40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* LEFT PROFILE SECTION */}
                    <div className="bg-white rounded-2xl overflow-hidden md:col-span-1 flex flex-col h-full">
                        <div className="w-full h-[450px] flex-shrink-0">
                            <img
                                src={
                                    analyst.profile_image
                                        ? analyst.profile_image
                                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt="Profile"
                                className="w-full h-full object-fill"
                            />
                        </div>

                        <div
                            className="p-5 -mt-6 rounded-t-2xl relative z-10 flex-grow flex flex-col"
                            style={{
                                background: "linear-gradient(to bottom, #CED3FF 10%, #FFFFFF 100%)",
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-grow">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {analyst.name || "N/A"}
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        {analyst.experience || "0"} years of experience
                                    </p>
                                </div>
                                <img
                                    src={Verify}
                                    alt="Verified"
                                    className="w-5 h-5 mt-1 flex-shrink-0"
                                />
                            </div>

                            <div className="space-y-3 text-sm flex-grow">
                                {stats.map(([label, value], index) => (
                                    <div
                                        key={index}
                                        className="flex bg-white px-4 py-2 rounded-full"
                                    >
                                        <p className="text-gray-500 w-40 truncate">{label}</p>
                                        <p className="font-medium text-gray-800 flex-1 text-right truncate">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT DETAILS SECTION */}
                    <div className="md:col-span-2 flex flex-col gap-6 h-full">
                        <div className="bg-white rounded-2xl shadow-sm p-6 flex-grow">
                            <h3 className="text-gray-800 font-semibold mb-4 text-2xl">
                                Professional Details
                            </h3>
                            <hr className="border-t border-gray-300 -mx-6 mb-6" />
                            <div className="grid sm:grid-cols-2 gap-y-5 gap-x-6">
                                <div>
                                    <p className="text-gray-500 text-sm">SEBI Registration Number</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {analyst.sebi_number || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">State</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {analyst.state || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Specialization</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {analyst.specialization || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Current Firm / Company Name</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {analyst.company_name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Education / Certification</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {analyst.education || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Languages</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {formatLanguages(analyst.languages)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Subscription</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {analyst.subcription || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Courses</p>
                                    <p className="font-medium text-gray-800 text-md mt-1">
                                        {analyst.courses || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-grow">
                            <h1 className="text-lg font-semibold mb-4">About Us</h1>
                            <hr className="border-t border-gray-300 -mx-6 mb-4" />
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {analyst?.about_us || ""}
                            </p>
                        </div>

                        <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-grow">
                            <h1 className="text-lg font-semibold mb-4">Description</h1>
                            <hr className="border-t border-gray-300 -mx-6 mb-4" />
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {analyst?.terms || "No description available"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* SUBSCRIPTION SECTION */}
                <div className="mt-10">
                    <h1 className="text-2xl font-semibold mb-6">Subscriptions</h1>
                    
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

                {/* SIGNALS SECTION */}
                <div className="mt-10">
                    <h1 className="text-2xl font-semibold mb-6">Recent Signals</h1>
                    
                    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 place-items-center">
                        {!signalLoading && !signalError && signals.length > 0 ? (
                            signals.map((signal, index) => (
                                <SignalCard 
                                    key={signal.id || index} 
                                    signal={signal} 
                                    index={index} 
                                />
                            ))
                        ) : !signalLoading && !signalError ? (
                            // No signals state
                            <div className="col-span-3 text-center py-10">
                                <p className="text-gray-600">No signals available</p>
                                <button
                                    onClick={refreshSignals}
                                    className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                                >
                                    Refresh
                                </button>
                            </div>
                        ) : signalLoading ? (
                            <div className="col-span-3 text-center py-10">
                                <p className="text-gray-500">Loading signals...</p>
                            </div>
                        ) : signalError ? (
                            <div className="col-span-3 text-center py-10">
                                <p className="text-red-500">{signalError}</p>
                                <button
                                    onClick={refreshSignals}
                                    className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}