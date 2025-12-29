import React from "react";
import { Calendar, Clock } from "lucide-react";
import { freeCallsData } from "../../data/freeCallsData";
import { useNavigate } from "react-router-dom";

export default function FeaturedCalls() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-8 md:px-12  lg:px-40">
      {/* Heading */}
      <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
        <div className="w-full md:w-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
            Featured <span className="active-text font-bold">Free Calls</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto md:mx-0">
            Explore our expert market insights and trading recommendations at no cost.
          </p>
        </div>

        <button
          onClick={() => navigate("/feed")}
          className="bg-black text-white px-7 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base"
        >
          View All Calls
        </button>
      </div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {freeCallsData.slice(0, 3).map((call, index) => (
          <div
            key={index}
            className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* Card Content */}
            <div
              className={`p-5 sm:p-6 text-gray-800 bg-gradient-to-r ${call.gradient} flex flex-col flex-grow`}
            >
              {/* Date & Time */}
              <div className="flex justify-between items-center text-gray-700 text-xs sm:text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {call.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {call.time}
                </div>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {call.name}
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    Status - {call.status}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 text-left text-gray-900 text-xs sm:text-sm gap-y-2 mb-5">
                <p>
                  <span className="font-semibold">Entry:</span> {call.entryRange}
                </p>
                <p>
                  <span className="font-semibold">Risk:</span> {call.risk}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {call.duration}
                </p>
                <p>
                  <span className="font-semibold">Segment:</span> {call.segment}
                </p>
                <p className="col-span-2">
                  <span className="font-semibold">Industry:</span> {call.industry}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-auto">
                <button className="bg-black text-white px-5 py-1.5 rounded-md text-sm hover:bg-gray-800 w-full sm:w-auto">
                  Unlock
                </button>
                <button className="border border-gray-300 bg-white/30 backdrop-blur-sm px-5 py-1.5 rounded-md text-sm hover:bg-white/50 w-full sm:w-auto">
                  Buy
                </button>
              </div>
            </div>

            {/* Segment Label */}
            <div className="bg-black text-white py-3 text-center font-medium text-sm rounded-b-2xl">
              {call.segment}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
