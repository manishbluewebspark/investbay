import React, { useCallback, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { FiArrowRight, FiTarget, FiShield, FiTrendingUp, FiClock, FiUser, FiAward } from "react-icons/fi";
import VerifyDetailsModal from "../components/modals/VerifyDetailsModal";
import TermsConditionsModal from "../components/modals/TermsConditionsModal";
import EsignOtpModal from "../components/modals/EsignOtpModal";
import UploadSignatureModal from "../components/modals/UploadSignatureModal";
import DocumentSignedModal from "../components/modals/DocumentSignedModal";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AfterBeforeSubscription() {
    const [open, setOpen] = useState(false);
    const [terms, setTerms] = useState(false);
    const [otp, setOtp] = useState(false);
    const [uploadSignature, setUploadSignature] = useState(false);
    const [signed, setSigned] = useState(false);
    const { id } = useParams();
    const [signal, setSignal] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const fetchSignals = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            
            const res = await axios.get(`${apiUrl}/signals/get-signals-by-id/${id}`);
            
            if (res.data?.success) {
                setSignal(res.data.data || {});
            } else {
                setError("Failed to fetch signals");
            }
        } catch (err) {
            console.error("Error fetching signals:", err);
            setError("Server error");
        } finally {
            setLoading(false);
        }
    }, [apiUrl, id]);

    useEffect(() => {
        fetchSignals();
    }, [fetchSignals]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDisplayTitle = () => {
        const parts = [];
        if (signal.instrument) parts.push(signal.instrument);
        if (signal.instrument_type) parts.push(signal.instrument_type);
        if (signal.exchange) parts.push(signal.exchange);
        return parts.join(' - ') || "Signal Details";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative inline-flex">
                        <div className="w-12 h-12 rounded-full border-2 border-white/[0.06]" />
                        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-slate-400 text-sm">Loading signal details...</p>
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
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                    <button
                        onClick={fetchSignals}
                        className="px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const isBuy = signal.trade_direction?.toUpperCase() === "BUY";

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

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                            signal.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                        }`} />
                        <h1 className="text-xl font-bold text-[#f0f4f8]">
                            {getDisplayTitle()}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isBuy 
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}>
                            {signal.trade_direction || "N/A"}
                        </span>
                        <span className="text-xs text-slate-500">
                            {formatDate(signal.created_at)} at {formatTime(signal.created_at)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Price Levels Card */}
                    <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-center gap-2 mb-4">
                            <FiTarget className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-lg font-bold text-[#f0f4f8]">Price Levels</h3>
                        </div>

                        <div className="space-y-3">
                            <Level 
                                label="Stop Loss" 
                                value={`₹${signal.stop_loss?.toLocaleString() || "N/A"}`}
                                type="sl"
                            />
                            <Level 
                                label="Entry" 
                                value={`₹${signal.entry_price?.toLocaleString() || "N/A"}`}
                                active
                                type="entry"
                            />
                            <Level 
                                label="Target 1" 
                                value={`₹${signal.target_first?.toLocaleString() || "N/A"}`}
                                type="target"
                            />
                            <Level 
                                label="Target 2" 
                                value={`₹${signal.target_second?.toLocaleString() || "N/A"}`}
                                type="target"
                            />
                            {signal.target_third && (
                                <Level 
                                    label="Target 3" 
                                    value={`₹${signal.target_third?.toLocaleString()}`}
                                    type="target"
                                />
                            )}
                        </div>

                        {/* Risk Reward */}
                        {signal.risk_reward_ratio && (
                            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                                <span className="text-xs text-slate-500">Risk/Reward</span>
                                <span className="text-sm font-bold text-emerald-400">
                                    {signal.risk_reward_ratio}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Plan Details Card */}
                    <div className="lg:col-span-2 group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FiShield className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-lg font-bold text-[#f0f4f8]">Plan Details</h3>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                signal.status === 'active' 
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                    : 'bg-white/[0.03] border border-white/[0.06] text-slate-500'
                            }`}>
                                ● {signal.status ? signal.status.charAt(0).toUpperCase() + signal.status.slice(1) : 'Inactive'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Detail label="Segment" value={signal.segment || signal.category} />
                            <Detail label="Instrument" value={signal.instrument} />
                            <Detail label="Script" value={signal.script} />
                            <Detail label="Exchange" value={signal.exchange} />
                            <Detail label="Strike Price" value={signal.strike_price} />
                            <Detail label="Instrument Type" value={signal.instrument_type} />
                            <Detail label="Duration" value={signal.duration} />
                            <Detail label="Trade Direction" value={signal.trade_direction} 
                                valueClass={isBuy ? "text-emerald-400" : "text-red-400"} 
                            />
                            <Detail label="Date" value={formatDate(signal.created_at)} />
                            <Detail label="Time" value={formatTime(signal.created_at)} />
                            <Detail label="Current Status" value={signal.status} />
                            <Detail label="Subscription Plan" value={signal.subscription_plan || signal.plan_name} />
                            <Detail label="Risk" value={signal.risk || signal.risk_reward_ratio} />
                            <Detail label="Plan Price" value={signal.plan_price ? `₹${Number(signal.plan_price).toLocaleString()}` : undefined} />
                            <Detail label="Ideal Capital" value={signal.ideal_capital ? `₹${Number(signal.ideal_capital).toLocaleString()}` : undefined} />
                        </div>
                    </div>
                </div>

                {/* Mentor/RA Details Card */}
                {signal.name && (
                    <div className="mt-6 group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/20">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={signal.profile_image || "https://i.pravatar.cc/60"}
                                        alt={signal.name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/20"
                                        onError={(e) => {
                                            e.target.src = "https://i.pravatar.cc/60";
                                        }}
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#060b10]" />
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-[#f0f4f8]">
                                            {signal.name}
                                        </h3>
                                        <FiAward className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        {signal.role || "Research Analyst"}
                                        {signal.specialization && ` • ${signal.specialization}`}
                                    </p>
                                    {signal.sebi_number && (
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            SEBI Reg: {signal.sebi_number}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/plans/${signal.id}`)}
                                className="group/btn flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                                View Plan
                                <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Additional Info */}
                {!signal.name && (
                    <div className="mt-6 text-center py-8 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
                        <FiUser className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">No analyst information available</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <VerifyDetailsModal open={open} onClose={() => setOpen(false)} />
            <TermsConditionsModal open={terms} onClose={() => setTerms(false)} />
            <EsignOtpModal open={otp} onClose={() => setOtp(false)} />
            <UploadSignatureModal open={uploadSignature} onClose={() => setUploadSignature(false)}/>
            <DocumentSignedModal open={signed} onClose={() => setSigned(false)}/>
        </div>
    );
}

/* --------- Small Components ---------- */
const Level = ({ label, value, active, type }) => {
    const getStyles = () => {
        if (active) {
            return "bg-emerald-500/20 border-emerald-500/30 text-emerald-300";
        }
        switch (type) {
            case "sl":
                return "bg-red-500/5 border-red-500/10 text-red-300";
            case "target":
                return "bg-white/[0.02] border-white/[0.05] text-slate-300";
            default:
                return "bg-white/[0.02] border-white/[0.05] text-slate-300";
        }
    };

    return (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 hover:bg-white/[0.04] ${getStyles()}`}>
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm font-bold">{value}</span>
        </div>
    );
};

const Detail = ({ label, value, valueClass }) => (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">{label}</p>
        <p className={`text-sm font-semibold ${valueClass || "text-slate-300"}`}>
            {value || "N/A"}
        </p>
    </div>
);