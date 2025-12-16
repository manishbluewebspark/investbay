import React from "react";
import { FaCaretUp } from "react-icons/fa";


export default function MarketCard({ data }) {
  const bgColors = [
    "from-[#FEECDC] to-[#FFF9F5]",
    "from-[#D6F8E5] to-[#EEFFF5]", 
    "from-[#E8E3FF] to-[#F6F4FF]", 
    "from-[#FDFFC8] to-[#FFFFEE]", 
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-400 p-5">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Market Indices
      </h2>
      <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full mb-5"></div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 bg-gradient-to-br ${bgColors[index % bgColors.length]} flex flex-col`}
          >
            <span className="text-sm font-medium text-gray-700 mb-2">
              {item.name}
            </span>
            <div className="flex items-center space-x-1 text-green-600 font-semibold">
              <FaCaretUp className="w-4 h-4" />
              <span className="text-[15px]">{item.value}</span>
              <span className="text-[15px]">({item.change})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
