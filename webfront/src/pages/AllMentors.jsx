import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { mentorsData } from "../data/mentorsData";
import Newsletter from "../pages/Newsletter";

export default function AllMentors() {
  const tabs = ["All Mentors", "My Mentors"];

  return (
<>
    <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
      {/* Top Filters */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        {/* Buttons */}
        <div className="flex items-center bg-black rounded-full px-2 py-1">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
                index === 0
                  ? "bg-white text-black font-medium"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-1 focus:ring-gray-300 outline-none text-sm bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm shadow-sm">
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mentorsData.map((mentor) => (
          <div
            key={mentor.id}
            className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-md"
          >
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-full h-[380px] object-cover"
            />

            {/* Glass Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <div className="backdrop-blur-md bg-black/20 border border-white/30 rounded-xl p-4 shadow-lg">
                <h3 className="font-semibold text-[15px] text-white drop-shadow-md">
                  {mentor.name}
                </h3>
                <p className="text-xs text-gray-100">{mentor.location}</p>
                <div className="mt-3 flex flex-col text-[12px] text-gray-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Experience</span>
                    <span className="text-white">{mentor.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Segment</span>
                    <span className="text-white">{mentor.segment}</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-3 bg-black/70 text-white text-xs rounded-md font-medium shadow-md hover:bg-black transition">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Newsletter />
</>
  );
}
