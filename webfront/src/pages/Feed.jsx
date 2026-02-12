// import React, { useCallback, useEffect, useState } from "react";
// import { Calendar, Clock, Filter } from "lucide-react";
// import { freeCallsData } from "../data/freeCallsData";
// import Newsletter from "./Newsletter";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Feed() {


// const [signals, setSignals] = useState([]);
// const [loading, setLoading] = useState(false);
// const [error, setError] = useState("");


//     const tabs = [
//         "Free Calls",
//         "Subscription Based",
//     ];



//     const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   const fetchSignals = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.get(`${apiUrl}/signals/get-signals`);

//       if (res.data?.success) {
//         setSignals(res.data.data || []);
//       } else {
//         setError("Failed to fetch mentors");
//       }
//     } catch (err) {
//       console.error("Error fetching analysts:", err);
//       setError("Server error");
//     } finally {
//       setLoading(false);
//     }
//   }, [apiUrl]);

//   useEffect(() => {
//     fetchSignals();
//   }, [fetchSignals]);
    

//   console.log(signals, 'signals...')




//     return (
//         <>
//             <section className="py-15 px-4 sm:px-6 bg-white mb-10">
//                 {/* ✅ Header Tabs */}
//                 <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
//                     {/* Tabs Container */}
//                     <div className="flex items-center bg-black rounded-full px-2 py-1">
//                         {tabs.map((tab, index) => (
//                             <button
//                                 key={index}
//                                 className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${index === 0
//                                     ? "bg-white text-black font-medium"
//                                     : "text-gray-300 hover:text-white"
//                                     }`}
//                             >
//                                 {tab}
//                             </button>
//                         ))}
//                     </div>

//                     <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-all duration-300">
//                         <Filter className="w-4 h-4" /> Filter
//                     </button>
//                 </div>

//                 <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 place-items-center">
//                     {freeCallsData.map((call, index) => (
//                         <div
//                             key={index}
//                             className="relative w-full max-w-[380px] sm:max-w-[350px] md:max-w-[370px] rounded-2xl transition-all duration-300 hover:shadow-lg"
//                         >
//                             <div
//                                 className={`relative z-10 p-5 sm:p-6 text-gray-800 rounded-2xl bg-gradient-to-r ${call.gradient} shadow-sm`}
//                             >
//                                 <div className="flex justify-between text-gray-700 text-xs sm:text-sm mb-3">
//                                     <div className="flex items-center gap-1">
//                                         <Calendar className="w-4 h-4" /> {call.date}
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <Clock className="w-4 h-4" /> {call.time}
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3 mb-4">
//                                     <img
//                                         src="https://i.pravatar.cc/40"
//                                         alt="profile"
//                                         className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300"
//                                     />
//                                     <div className="text-left">
//                                         <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
//                                             {call.name}
//                                         </h4>
//                                         <p className="text-gray-700 text-xs sm:text-sm">
//                                             Status - {call.status}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 text-left text-gray-900 text-xs sm:text-sm gap-y-2 mb-5">
//                                     <p>
//                                         <span className="font-semibold">Entry:</span> {call.entryRange}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold">Risk:</span> {call.risk}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold">Duration:</span> {call.duration}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold">Segment:</span> {call.segment}
//                                     </p>
//                                     <p className="col-span-2">
//                                         <span className="font-semibold">Industry:</span> {call.industry}
//                                     </p>
//                                 </div>
//                                 <div className="items-center gap-3">
//                                     <button className="border w-full py-2 rounded-md text-sm hover:bg-black hover:text-white">
//                                         Unlock
//                                     </button>
//                                 </div>

//                             </div>
//                             <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-0">
//                                 <div className="py-3 sm:py-4 text-center text-white font-medium text-xs sm:text-sm bg-black rounded-b-2xl mt-8">
//                                     {call.segment}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </section>
//             <Newsletter />
//         </>
//     );
// }


import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, Filter } from "lucide-react";
import Newsletter from "./Newsletter";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Feed() {
    const [activeTab, setActiveTab] = useState("Free Calls");

  const tabs = ["Free Calls", "Subscription Based"];
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchSignals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${apiUrl}/signals/get-signals`);

      if (res.data?.success) {
        setSignals(res.data.data || []);
      } else {
        setError("Failed to fetch signals");
      }
    } catch (err) {
      console.error("Error fetching signals:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

 

  // // Format date to readable format
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-IN", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  // // Format time to readable format
  // const formatTime = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleTimeString("en-IN", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };


  // 🔥 PERFECT IST CONVERSION
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  
  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",     // ✅ FORCE IST
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Time";
  
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",     // ✅ FORCE IST
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};



  const getGradient = (segment, tradeDirection) => {
    if (tradeDirection === "BUY") {
      return "from-green-50 to-emerald-100";
    } else if (tradeDirection === "SELL") {
      return "from-red-50 to-rose-100";
    }
    
    switch (segment) {
      case "Options":
        return "from-blue-50 to-indigo-100";
      case "Equity":
        return "from-purple-50 to-violet-100";
      case "Futures":
        return "from-amber-50 to-orange-100";
      default:
        return "from-gray-50 to-slate-100";
    }
  };

  return (
    <>
      <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
        {/* ✅ Header Tabs */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
          {/* Tabs Container */}
          <div className="flex items-center bg-black rounded-full px-2 py-1">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-black font-medium"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-all duration-300">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="max-w-6xl mx-auto text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-2 text-gray-600">Loading signals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-6xl mx-auto text-center py-10">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchSignals}
              className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Signals Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 place-items-center">
          {!loading && !error && signals.length > 0 ? (
            signals.map((signal, index) => (
              <div
                key={signal.id || index}
                className="relative w-full max-w-[380px] sm:max-w-[350px] md:max-w-[370px] rounded-2xl transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className={`relative z-10 p-5 sm:p-6 text-gray-800 rounded-2xl bg-gradient-to-r ${getGradient(
                    signal.segment,
                    signal.trade_direction
                  )} shadow-sm`}
                >
                  {/* Date and Time */}
                  <div className="flex justify-between text-gray-700 text-xs sm:text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />{" "}
                      {formatDate(signal.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />{" "}
                      {formatTime(signal.created_at)}
                    </div>
                  </div>

                  {/* Profile and Status */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://i.pravatar.cc/40"
                      alt="profile"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300"
                    />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {signal.instrument} {signal.instrument_type || ""}
                      </h4>
                      <p className="text-gray-700 text-xs sm:text-sm">
                        Status -{" "}
                        <span
                          className={`font-medium ${
                            signal.status === "active"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {signal.status || "Active"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Signal Details Grid */}
                  <div className="grid grid-cols-2 text-left text-gray-900 text-xs sm:text-sm gap-y-2 mb-5">
                    <p>
                      <span className="font-semibold">Entry:</span> ₹
                      {signal.entry_price}
                    </p>
                    <p>
                      <span className="font-semibold">SL:</span> ₹
                      {signal.stop_loss}
                    </p>
                    <p>
                      <span className="font-semibold">Target 1:</span> ₹
                      {signal.target_first}
                    </p>
                    <p>
                      <span className="font-semibold">Target 2:</span> ₹
                      {signal.target_second}
                    </p>
                    <p>
                      <span className="font-semibold">Target 3:</span> ₹
                      {signal.target_third}
                    </p>
                    <p>
                      <span className="font-semibold">Risk/Reward:</span>{" "}
                      {signal.risk_reward_ratio}
                    </p>
                    <p className="col-span-2">
                      <span className="font-semibold">Trade:</span>{" "}
                      <span
                        className={`font-medium ${
                          signal.trade_direction === "BUY"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {signal.trade_direction || "BUY"}
                      </span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="items-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/signal-details/${signal.id || index}`)
                      }
                      className="border w-full py-2 rounded-md text-sm hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Bottom Segment Tag */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-0">
                  <div className="py-3 sm:py-4 text-center text-white font-medium text-xs sm:text-sm bg-black rounded-b-2xl mt-8">
                    {signal.segment || "Segment"}
                  </div>
                </div>
              </div>
            ))
          ) : !loading && !error ? (
            // No signals state
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-600">No signals available</p>
              <button
                onClick={fetchSignals}
                className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Refresh
              </button>
            </div>
          ) : null}
        </div>
      </section>
      <Newsletter />
    </>
  );
}