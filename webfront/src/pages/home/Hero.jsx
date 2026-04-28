import React from "react";
import { IoIosSearch } from "react-icons/io";
import Shield from "../../assets/icon/shield.svg";
import Right from "../../assets/icon/right.svg";
import Trade from "../../assets/icon/trade.svg";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero-bg.png')",
      }}
    >
      <div className="relative z-10 max-w-5xl w-full px-6 text-center">

        {/* Top Badge */}
        <div className="inline-block mb-6 px-4 py-1 text-md rounded-full bg-green-100 text-green-600 font-medium">
          Trusted by 50,000+ investors
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Find the Right{" "}
          <span className="text-green-500">Stock Advisor</span> for
          <br />
          Your Investment Journey
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-gray-500 text-lg">
          Access verified research analysts, real-time signals, and expert insights in seconds.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center bg-white rounded-full shadow-lg overflow-hidden border border-gray-200 w-full max-w-6xl">
          {/* Input */}
          <div className="flex items-center flex-1 px-4 min-h-[60px]">
            <IoIosSearch className="text-gray-400 mr-2 text-xl shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent py-3 outline-none text-gray-600 placeholder:text-gray-400"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-gray-200" />

          {/* Select */}
          <select className="px-4 min-h-[60px] bg-transparent text-gray-500 outline-none border-t md:border-t-0 border-gray-200">
            <option>Select Category</option>
            <option>Stocks</option>
            <option>Crypto</option>
            <option>Mutual Funds</option>
          </select>

          {/* Button */}
          <div className="p-2 border-t md:border-t-0 border-gray-200">
            <button className="bg-black text-white px-6 h-[44px] rounded-full hover:bg-gray-800 transition whitespace-nowrap">
              Search
            </button>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-md text-gray-500">

          <span className="flex items-center gap-2">
            <img src={Shield} alt="shield" className="w-4 h-4" />
            SEBI Registered Analysts
          </span>

          <span className="flex items-center gap-2">
            <img src={Right} alt="right" className="w-4 h-4" />
            Transparent Performance
          </span>

          <span className="flex items-center gap-2">
            <img src={Trade} alt="trade" className="w-4 h-4" />
            No False Promises
          </span>

        </div>
      </div>
    </section>
  );
}