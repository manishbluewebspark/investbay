import React from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

export default function MarketCard({ data }) {
  const isPositive = (change) => {
    if (!change) return true;
    return !String(change).includes("-");
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl ">
          Market Indices
        </h2>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]"></span>
          <span className="text-xs text-color">
            Live
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {data.map((item, index) => {
          const positive = isPositive(item.change);

          return (
            <div key={index} className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-md uppercase tracking-wide">
                  {item.name}
                </h3>
                <p className="mt-1 text-md font-medium text-[#8A8F98]">
                  {item.value}
                </p>
              </div>

              <div
                className={`flex items-center gap-1 text-md  ${
                  positive ? "text-color" : "text-[#DC2626]"
                }`}
              >
                {positive ? (
                  <FaCaretUp className="text-xs" />
                ) : (
                  <FaCaretDown className="text-xs" />
                )}
                <span>{String(item.change).replace("-", "")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}