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
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-['Aileron_Black'] font-bold text-gray-900 uppercase tracking-wider">
            Institutional Flow
          </h2>
          <div className="flex rounded-full bg-gray-100 p-1">
            <button className="rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white">
              FII
            </button>
            <button className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-500">
              DII
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">No data available</p>
      </div>
    );
  }

  return (
    <div className="group/card relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-['Aileron_Black'] font-bold text-gray-900 uppercase tracking-wider">
              Institutional Flow
            </h2>
            <p className="text-xs text-gray-500 mt-1">Buy-Sell Gap (in Crores)</p>
          </div>

          <div className="flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("FII")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                activeTab === "FII"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              FII
            </button>
            <button
              onClick={() => setActiveTab("DII")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                activeTab === "DII"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              DII
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3">
            <p className="text-[10px] font-['Aileron_Black'] font-semibold uppercase tracking-wider text-green-700 mb-1">
              Buy
            </p>
            <p className="text-sm font-['Aileron_Black'] font-bold text-gray-900">
              ₹{latestItem.buy} Cr
            </p>
          </div>

          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-[10px] font-['Aileron_Black'] font-semibold uppercase tracking-wider text-red-700 mb-1">
              Sell
            </p>
            <p className="text-sm font-['Aileron_Black'] font-bold text-gray-900">
              ₹{latestItem.sell} Cr
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
          <p className="text-xs font-medium text-gray-500">Net Flow</p>

          <div
            className={`mt-2 flex items-center justify-end gap-2 text-xl font-['Aileron_Black'] font-bold ${
              isPositive(latestItem.net) ? "text-green-600" : "text-red-600"
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