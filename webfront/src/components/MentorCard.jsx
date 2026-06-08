import React from "react";
import { BadgeCheck, TrendingUp, Clock, ArrowRight, Shield, Star } from "lucide-react";

export default function MentorCard({ analyst, navigate }) {
  return (
    <div className="group/card relative bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300">
      
      {/* Top Row - Avatar & Info */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <img
            src={analyst.profile_image || "https://randomuser.me/api/portraits/men/1.jpg"}
            alt={analyst.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover/card:border-gray-300 transition-all duration-300"
            onError={(e) => {
              e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
            }}
          />
          {/* Verified indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 
            className="text-base font-bold text-black truncate group-hover/card:text-gray-700 transition-colors duration-300"
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            {analyst.name || "Unknown Mentor"}
          </h3>

          <div className="flex items-center gap-1.5 mt-0.5">
            <Shield className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">SEBI Registered</span>
          </div>
        </div>
      </div>

      {/* Stats Box */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4 grid grid-cols-2 gap-4 group-hover/card:bg-gray-100 group-hover/card:border-gray-200 transition-all duration-300">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-gray-400" />
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Accuracy</p>
          </div>
          <p 
            className="text-lg font-bold text-black group-hover/card:text-gray-700 transition-colors duration-300"
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            {analyst.accuracy
              ? `${analyst.accuracy}%`
              : analyst.success_rate
              ? `${analyst.success_rate}%`
              : "82%"}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Experience</p>
          </div>
          <p 
            className="text-lg font-bold text-black group-hover/card:text-gray-700 transition-colors duration-300"
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            {analyst.experience ? `${analyst.experience}Y` : "5Y+"}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-gray-100 border border-gray-200 text-gray-600 group-hover/card:bg-gray-200 group-hover/card:border-gray-300 transition-all duration-300">
          {analyst.strategy || "Swing Trading"}
        </span>
        {analyst.expertise && (
          <span className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-white border border-gray-200 text-gray-500 group-hover/card:border-gray-300 transition-all duration-300">
            {analyst.expertise}
          </span>
        )}
      </div>

      {/* Rating Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <Star className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>
        <div className="text-xs text-gray-400">
          {analyst.total_reviews || 128} reviews
        </div>
      </div>

      {/* View Profile Button */}
      <button
        onClick={() => navigate(`/mentor/${analyst.id}`)}
        className="group/btn relative w-full py-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          View Profile
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </span>
      </button>
    </div>
  );
}