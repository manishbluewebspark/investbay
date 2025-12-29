import React from "react";
import { investData } from "../../data/investData";

export default function InvestHelp() {
  return (
    <section className="py-10 text-center bg-white">
      <div className="max-w-3xl mx-auto mb-10 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-snug">
          How <span className="active-text font-semibold">InvestBay</span>
          <br className="hidden sm:block" /> Help Investor / Traders
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
          Your All-in-One Investment Solution. From real-time market updates to{" "}
          <br className="hidden sm:block" />
          personalized mentorship, InvestBay empowers you to achieve your
          financial goals.
        </p>
      </div>

      {/* ✅ Responsive container with padding adjustments */}
      <div className="relative w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-40 gradient-grid-bg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {investData.map((item, index) => (
            <div
              key={index}
              className={`p-5 sm:p-6 text-left shadow-sm transition-all duration-300 hover:shadow-lg rounded-xl ${
                item.dark
                  ? "bg-[#0F1114] text-white"
                  : "bg-white border text-gray-800"
              }`}
            >
              {/* Icon */}
              <div className="flex mb-4 justify-start">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                />
              </div>

              <h3 className="font-semibold text-base sm:text-lg mb-2">
                {item.title}
              </h3>
              <p
                className={`text-sm sm:text-[15px] leading-relaxed ${
                  item.dark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
