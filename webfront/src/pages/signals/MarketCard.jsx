import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MarketCard({ data }) {
  const isPositive = (change) => {
    if (!change) return true;
    return !String(change).includes("-");
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm text-center">No market data available</p>
      </div>
    );
  }

  return (
    <div className="group/card relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-['Aileron_Black'] font-bold text-gray-900 uppercase tracking-wider">
            Market Indices
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-600 animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {data.map((item, index) => {
            const positive = isPositive(item.change);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all duration-300"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-['Aileron_Black'] font-semibold text-gray-800 uppercase tracking-wide truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.value}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 text-sm font-medium ml-3 ${
                    positive ? "text-green-600" : "text-red-600"
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