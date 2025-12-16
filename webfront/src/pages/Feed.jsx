import React from "react";
import { Calendar, Clock, Filter } from "lucide-react";
import { freeCallsData } from "../data/freeCallsData";
import Newsletter from "./Newsletter";

export default function Feed() {
    const tabs = [
        "Free Calls",
        "Subscription Based",
        "Pay Per Call",
        "Basket",
        "Strategy",
    ];

    return (
        <>
            <section className="py-15 px-4 sm:px-6 bg-white mb-10">
                {/* ✅ Header Tabs */}
                <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
                    {/* Tabs Container */}
                    <div className="flex items-center bg-black rounded-full px-2 py-1">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${index === 0
                                    ? "bg-white text-black font-medium"
                                    : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Filter Button */}
                    <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-all duration-300">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                {/* ✅ Cards Grid */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 place-items-center">
                    {freeCallsData.map((call, index) => (
                        <div
                            key={index}
                            className="relative w-full max-w-[380px] sm:max-w-[350px] md:max-w-[370px] rounded-2xl transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Gradient Card */}
                            <div
                                className={`relative z-10 p-5 sm:p-6 text-gray-800 rounded-2xl bg-gradient-to-r ${call.gradient} shadow-sm`}
                            >
                                {/* Date & Time */}
                                <div className="flex justify-between text-gray-700 text-xs sm:text-sm mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> {call.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {call.time}
                                    </div>
                                </div>

                                {/* Profile */}
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src="https://i.pravatar.cc/40"
                                        alt="profile"
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300"
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
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <button className="bg-black text-white px-5 py-1.5 rounded-md text-sm hover:bg-gray-800 w-full sm:w-auto">
                                        Unlock
                                    </button>
                                    <button className="border border-gray-300 bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-md text-sm hover:bg-white/30 w-full sm:w-auto">
                                        Buy
                                    </button>
                                </div>
                            </div>

                            {/* Segment Label */}
                            <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-0">
                                <div className="py-3 sm:py-4 text-center text-white font-medium text-xs sm:text-sm bg-black rounded-b-2xl mt-8">
                                    {call.segment}
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
