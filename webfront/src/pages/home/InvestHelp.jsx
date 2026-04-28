import React from "react";
import { investData } from "../../data/investData";

export default function InvestHelp() {
  return (
    <section
      className="relative py-16 text-center text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('/invest-help-bg.svg')",
      }}
    >

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
            How InvestBay Help Investor / Traders
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {investData.map((item, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 rounded-xl p-5 sm:p-6 flex items-start gap-4 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <img
                src={item.icon}
                alt={item.title}
                className="w-12 h-12 object-contain"
              />

              {/* Content */}
              <div className="text-left">
                <h3 className="font-semibold text-md sm:text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-md text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}