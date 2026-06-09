import React from "react";
import { TrendingUp, Users, Bell, BarChart3, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const stats = [
        { label: "Total Analysts", value: "200+", change: "+12 this month", icon: Users, color: "#16a34a", bg: "#f0fdf4" },
        { label: "Active Signals", value: "1,840", change: "+64 today", icon: TrendingUp, color: "#2563eb", bg: "#eff6ff" },
        { label: "Platform Users", value: "50K+", change: "+320 this week", icon: BarChart3, color: "#7c3aed", bg: "#f5f3ff" },
    ];

    return (
        <div className="space-y-6" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>

            {/* Header */}
            <div>
                <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 22, color: "#111827", letterSpacing: "-0.02em" }}>
                    Welcome, {user?.name?.split(" ")[0] || "User"} 👋
                </h2>
                <p className="text-[13px] text-gray-400 mt-0.5">Here's your admin overview for today</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-[0_4px_20px_rgba(22,163,74,0.08)] transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                                <s.icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={1.8} />
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                <ArrowUpRight className="w-3 h-3" /> {s.change}
                            </span>
                        </div>
                        <p style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 26, color: "#111827", lineHeight: 1 }}>
                            {s.value}
                        </p>
                        <p className="text-[12px] text-gray-400 mt-1 font-medium">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Placeholder content area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {["Recent Activity", "Quick Actions"].map((title) => (
                    <div key={title} className="bg-white border border-gray-100 rounded-2xl p-5">
                        <h3 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 12 }}>
                            {title}
                        </h3>
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 bg-gray-50 rounded-xl border border-gray-100 animate-pulse" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
