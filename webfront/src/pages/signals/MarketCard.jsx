import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MarketCard({ data }) {
  const isPositive = (change) => {
    if (!change) return true;
    return !String(change).includes("-");
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
        <p className="text-slate-500 text-sm text-center">No market data available</p>
      </div>
    );
  }

  return (
    <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#f0f4f8] uppercase tracking-wider">
            Market Indices
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Live</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {data.map((item, index) => {
            const positive = isPositive(item.change);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.value}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 text-sm font-medium ml-3 ${
                    positive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {positive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{String(item.change).replace("-", "")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}