import React from "react";
import { BadgeCheck, TrendingUp, Clock, ArrowRight } from "lucide-react";
import Right from "../assets/icon/right.svg";

export default function MentorCard({ analyst, navigate }) {
  return (
    <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:bg-emerald-500/[0.03] hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

      {/* Top Row - Avatar & Info */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <img
            src={analyst.profile_image || "https://i.pravatar.cc/300"}
            alt={analyst.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20 group-hover/card:border-emerald-400/40 transition-all duration-300"
            onError={(e) => {
              e.target.src = "https://i.pravatar.cc/300";
            }}
          />
          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#060b10] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[#f0f4f8] truncate group-hover/card:text-emerald-200 transition-colors duration-300">
            {analyst.name || "Unknown Mentor"}
          </h3>

          <div className="flex items-center gap-1.5 mt-0.5">
            <img src={Right} alt="verified" className="w-3.5 h-3.5 brightness-150 saturate-150" />
            <span className="text-xs text-emerald-400 font-medium">SEBI Registered</span>
          </div>
        </div>
      </div>

      {/* Stats Box */}
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 mb-4 grid grid-cols-2 gap-4 group-hover/card:bg-emerald-500/[0.03] group-hover/card:border-emerald-500/10 transition-all duration-300">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-slate-500" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Accuracy</p>
          </div>
          <p className="text-lg font-bold text-[#f0f4f8] group-hover/card:text-emerald-400 transition-colors duration-300">
            {analyst.accuracy
              ? `${analyst.accuracy}%`
              : analyst.success_rate
              ? `${analyst.success_rate}%`
              : "82%"}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Experience</p>
          </div>
          <p className="text-lg font-bold text-[#f0f4f8] group-hover/card:text-emerald-400 transition-colors duration-300">
            {analyst.experience ? `${analyst.experience}Y` : "5Y+"}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover/card:bg-emerald-500/20 group-hover/card:border-emerald-500/30 transition-all duration-300">
          {analyst.strategy || "Swing Trading"}
        </span>
        {analyst.expertise && (
          <span className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-400 group-hover/card:border-white/[0.1] transition-all duration-300">
            {analyst.expertise}
          </span>
        )}
      </div>

      {/* View Profile Button */}
      <button
        onClick={() => navigate(`/mentor/${analyst.id}`)}
        className="group/btn relative w-full py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 text-sm font-semibold hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 transition-all duration-300 overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          View Profile
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
    </div>
  );
}