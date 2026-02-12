// import React, { useCallback, useEffect, useState } from "react";
// import { Calendar, Clock } from "lucide-react";
// import { freeCallsData } from "../../data/freeCallsData";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function FeaturedCalls() {


//   const [signals, setSignals] = useState
//   ([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
  
  
//     const apiUrl = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();
  
//     const fetchSignals = useCallback(async () => {
//       try {
//         setLoading(true);
//         setError("");
  
//         const res = await axios.get(`${apiUrl}/signals/get-signals`);
  
//         if (res.data?.success) {
//           setSignals(res.data.data || []);
//         } else {
//           setError("Failed to fetch signals");
//         }
//       } catch (err) {
//         console.error("Error fetching signals:", err);
//         setError("Server error");
//       } finally {
//         setLoading(false);
//       }
//     }, [apiUrl]);
  
//     useEffect(() => {
//       fetchSignals();
//     }, [fetchSignals]);
  
//     console.log(signals, "signals...");
  


//   return (
//     <section className="w-full bg-white py-20 px-4 sm:px-8 md:px-12  lg:px-40">
//       {/* Heading */}
//       <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
//         <div className="w-full md:w-auto">
//           <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
//             Featured <span className="active-text font-bold">Free Calls</span>
//           </h2>
//           <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto md:mx-0">
//             Explore our expert market insights and trading recommendations at no cost.
//           </p>
//         </div>

//         <button
//           onClick={() => navigate("/feed")}
//           className="bg-black text-white px-7 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base"
//         >
//           View All Calls
//         </button>
//       </div>

//       {/* Cards Grid */}
//       <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//         {freeCallsData.slice(0, 3).map((call, index) => (
//           <div
//             key={index}
//             className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
//           >
//             {/* Card Content */}
//             <div
//               className={`p-5 sm:p-6 text-gray-800 bg-gradient-to-r ${call.gradient} flex flex-col flex-grow`}
//             >
//               {/* Date & Time */}
//               <div className="flex justify-between items-center text-gray-700 text-xs sm:text-sm mb-4">
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" /> {call.date}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Clock className="w-4 h-4" /> {call.time}
//                 </div>
//               </div>

//               {/* Profile */}
//               <div className="flex items-center gap-3 mb-5">
//                 <img
//                   src="https://i.pravatar.cc/40"
//                   alt="profile"
//                   className="w-10 h-10 rounded-full border border-gray-300"
//                 />
//                 <div className="text-left">
//                   <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
//                     {call.name}
//                   </h4>
//                   <p className="text-gray-700 text-xs sm:text-sm">
//                     Status - {call.status}
//                   </p>
//                 </div>
//               </div>

//               {/* Details */}
//               <div className="grid grid-cols-2 text-left text-gray-900 text-xs sm:text-sm gap-y-2 mb-5">
//                 <p>
//                   <span className="font-semibold">Entry:</span> {call.entryRange}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Risk:</span> {call.risk}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Duration:</span> {call.duration}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Segment:</span> {call.segment}
//                 </p>
//                 <p className="col-span-2">
//                   <span className="font-semibold">Industry:</span> {call.industry}
//                 </p>
//               </div>

//               {/* Buttons */}
//               <div className="items-center gap-3">
//                 <button className="border w-full py-2 rounded-md text-sm hover:bg-black hover:text-white">
//                   Unlock
//                 </button>
//               </div>
//             </div>

//             {/* Segment Label */}
//             <div className="bg-black text-white py-3 text-center font-medium text-sm rounded-b-2xl">
//               {call.segment}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }




import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FeaturedCalls() {
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

  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading signals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchSignals}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all mt-4"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24">
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Featured <span className="text-emerald-600 font-bold">Free Calls</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Latest trading signals updated daily
        </p>
      </div>

      {/* Cards Grid - 4 per row */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {signals.slice(0, 8).map((signal) => {
            const isBuy = signal.trade_direction === "BUY";
            const riskReward = `${signal.risk_reward_ratio}:1`;
            const formattedDate = new Date(signal.created_at).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short'
            });

            return (
              <div
                key={signal.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-emerald-200 h-full flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    signal.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {signal.status}
                  </span>
                </div>

                {/* Trade Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isBuy 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isBuy ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    </div>
                    <h4 className="font-semibold text-sm truncate">
                      {signal.instrument} {signal.instrument_type}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500">Plan: {signal.subscription_plan}</p>
                </div>

                {/* Prices - Compact */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span>Entry</span>
                    <span className="font-semibold">₹{signal.entry_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>SL</span>
                    <span className={`font-semibold ${isBuy ? 'text-red-600' : 'text-emerald-600'}`}>
                      ₹{signal.stop_loss.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>T1</span>
                    <span>₹{signal.target_first.toLocaleString()}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                    <span className="font-medium">{signal.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded text-emerald-700 font-medium">
                    <span>RR</span>
                    <span>{riskReward}</span>
                  </div>
                </div>

                {/* Segment & Action */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <span>{signal.segment}</span>
                  <span className="text-emerald-600 font-medium">{signal.exchange}</span>
                </div>
                
                <button 
                  className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors"
                  onClick={() => navigate(`/signal-details/${signal.id}`)}
                >
                  Track →
                </button>
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        {signals.length > 4 && (
          <div className="text-center pt-4">
            <button
              onClick={() => navigate("/signals")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All {signals.length} Calls →
            </button>
          </div>
        )}
      </div>

      {/* No Data State */}
      {signals.length === 0 && (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="text-5xl mb-6">📈</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Active Signals</h3>
          <p className="text-gray-600 mb-8">Check back soon for latest trading recommendations</p>
          <button
            onClick={() => navigate("/feed")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Browse Calls
          </button>
        </div>
      )}
    </section>
  );
}
