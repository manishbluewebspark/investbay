import React, { useMemo, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

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
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#f0f4f8] uppercase tracking-wider">
            Institutional Flow
          </h2>
          <div className="flex rounded-full bg-white/[0.05] p-1">
            <button className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
              FII
            </button>
            <button className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-500">
              DII
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-500 text-center py-4">No data available</p>
      </div>
    );
  }

  return (
    <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#f0f4f8] uppercase tracking-wider">
              Institutional Flow
            </h2>
            <p className="text-xs text-slate-500 mt-1">Buy-Sell Gap (in Crores)</p>
          </div>

          <div className="flex rounded-full bg-white/[0.05] p-1">
            <button
              onClick={() => setActiveTab("FII")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                activeTab === "FII"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              FII
            </button>
            <button
              onClick={() => setActiveTab("DII")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                activeTab === "DII"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              DII
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              Buy
            </p>
            <p className="text-sm font-bold text-[#f0f4f8]">
              ₹{latestItem.buy} Cr
            </p>
          </div>

          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-1">
              Sell
            </p>
            <p className="text-sm font-bold text-[#f0f4f8]">
              ₹{latestItem.sell} Cr
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Net Flow</p>

          <div
            className={`mt-2 flex items-center justify-end gap-2 text-xl font-bold ${
              isPositive(latestItem.net) ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive(latestItem.net) ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>₹{String(latestItem.net).replace("-", "")} Cr</span>
          </div>
        </div>
      </div>
    </div>
  );
}