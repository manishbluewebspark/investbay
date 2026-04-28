import React, { useMemo, useState } from "react";

export default function FiiDiiCard({ data }) {
  const [activeTab, setActiveTab] = useState("FII");

  const latestItem = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data[0];
  }, [data]);

  const getNumericValue = (value) => {
    if (!value) return 0;
    const num = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const isPositive = (value) => getNumericValue(value) >= 0;

  if (!latestItem) {
    return (
      <div className="w-full rounded-2xl border border-[#EEF1F5] bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1E1E1E]">
              Institutional Flow
            </h2>
            <p className="mt-1 text-xs text-[#9AA3AF]">
              Buy-Sell Gap (in Crores)
            </p>
          </div>

          <div className="flex rounded-full bg-[#F3F4F6] p-1">
            <button className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#6B7280] shadow-sm">
              FII
            </button>
            <button className="rounded-full px-4 py-1.5 text-xs font-medium text-[#9CA3AF]">
              DII
            </button>
          </div>
        </div>

        <div className="mt-5 text-md text-[#9CA3AF]">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-[#EEF1F5] bg-white p-4 shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl leading-none">
            Institutional Flow
          </h2>
        </div>

        <div className="flex rounded-full bg-[#F4F5F7] p-1">
          <button
            onClick={() => setActiveTab("FII")}
            className={`min-w-[44px] rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === "FII"
                ? "bg-white text-[#6B7280] shadow-sm"
                : "text-[#A1A1AA]"
            }`}
          >
            FII
          </button>
          <button
            onClick={() => setActiveTab("DII")}
            className={`min-w-[44px] rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === "DII"
                ? "bg-white text-[#6B7280] shadow-sm"
                : "text-[#A1A1AA]"
            }`}
          >
            DII
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#F2FBF7] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-color">
            Buy
          </p>
          <p className="mt-1 text-md  leading-tight text-[#1F2937]">
            ₹{latestItem.buy} Cr
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFF3F5] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#E25563]">
            Sell
          </p>
          <p className="mt-1 text-md leading-tight ">
            ₹{latestItem.sell} Cr
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#EEF1F5] bg-white px-4 py-3">
        <p className="text-md font-medium text-[#7C8796]">Net Flow</p>

        <div
          className={`mt-2 flex items-center justify-end gap-2 text-2xl font-semibold leading-none ${
            isPositive(latestItem.net)
              ? "text-[#17A56B]"
              : "text-[#E25563]"
          }`}
        >
          <span className="text-md">
            {isPositive(latestItem.net) ? "↗" : "↘"}
          </span>
          <span>₹{String(latestItem.net).replace("-", "")} Cr</span>
        </div>
      </div>
    </div>
  );
}