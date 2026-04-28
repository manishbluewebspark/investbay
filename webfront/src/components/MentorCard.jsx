import React from "react";
import Right from "../assets/icon/right.svg";

export default function MentorCard({ analyst, navigate }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 p-6 ">
      
      {/* Top Row */}
      <div className="flex items-center gap-3 mb-5">
        <img
          src={analyst.profile_image || "https://i.pravatar.cc/300"}
          alt={analyst.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            e.target.src = "https://i.pravatar.cc/300";
          }}
        />

        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-[#111827] truncate">
            {analyst.name || "Unknown Mentor"}
          </h3>

          <div className="flex items-center gap-1 text-md text-[#6b7280]">
            <img src={Right} alt="verified" />
            <span>SEBI Registered</span>
          </div>
        </div>
      </div>

      {/* Stats Box */}
      <div className="bg-[#f8fafc] rounded-xl p-4 mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#6b7280] mb-1">Accuracy</p>
          <p className="text-lg font-bold text-[#111827]">
            {analyst.accuracy
              ? `${analyst.accuracy}%`
              : analyst.success_rate
              ? `${analyst.success_rate}%`
              : "82%"}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#6b7280] mb-1">Experience</p>
          <p className="text-lg font-bold text-[#111827]">
            {analyst.experience ? `${analyst.experience} Years` : "-"}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-3 py-1 text-xs rounded-md border border-gray-200 text-[#6b7280] bg-white">
          {analyst.strategy || "Swing"}
        </span>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate(`/mentor/${analyst.id}`)}
        className="w-full py-3 rounded-xl border border-gray-200 text-[#111827] text-md font-medium bg-white hover:bg-gray-50 transition"
      >
        View Profile
      </button>
    </div>
  );
}