import React, { useState } from "react";

export default function FiiDiiCard({ data }) {
  const [activeTab, setActiveTab] = useState("FII");

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-400 p-4 ">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">FII / DII</h2>
          <p className="text-[11px] text-gray-400">Buy-Sell Gap (in Crores)</p>
        </div>
        <div className="flex bg-gray-100 rounded-full p-1 w-[90px] h-[28px]">
          <button
            onClick={() => setActiveTab("FII")}
            className={`flex-1 text-xs font-medium rounded-full transition-all duration-300 ${
              activeTab === "FII"
                ? "bg-gradient-to-r from-[#3A4EFB] to-[#33A4FA] text-white"
                : "text-gray-500"
            }`}
          >
            FII
          </button>
          <button
            onClick={() => setActiveTab("DII")}
            className={`flex-1 text-xs font-medium rounded-full transition-all duration-300 ${
              activeTab === "DII"
                ? "bg-gradient-to-r from-[#3A4EFB] to-[#33A4FA] text-white"
                : "text-gray-500"
            }`}
          >
            DII
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-[#E8FFF2] to-[#F5FFF9] text-gray-700">
              <th className="text-left py-2 pl-2 font-medium">Date</th>
              <th className="text-right font-medium">Buy</th>
              <th className="text-right font-medium">Sell</th>
              <th className="text-right pr-2 font-medium">Net</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
              >
                <td className="py-2 text-gray-700 pl-2">{item.date}</td>
                <td className="text-right text-gray-700">{item.buy}</td>
                <td className="text-right text-gray-700">{item.sell}</td>
                <td className="text-right pr-2">
                  <span
                    className={`inline-block px-2 py-[2px] rounded-md text-white text-[11px] font-semibold ${
                      item.net.startsWith("-")
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {item.net}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
