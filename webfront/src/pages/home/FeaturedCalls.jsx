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




// import React, { useCallback, useEffect, useState } from "react";
// import { Calendar, Clock, ArrowUp, ArrowDown } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function FeaturedCalls() {
//   const [signals, setSignals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const user = localStorage.getItem('user')
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   console.log(user, 363636)

//   console.log(signals, 'signals..')
//   const fetchSignals = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.get(`${apiUrl}/signals/get-signals-free`);

//       if (res.data?.success) {
//         setSignals(res.data.data || []);
//       } else {
//         setError("Failed to fetch signals");
//       }
//     } catch (err) {
//       console.error("Error fetching signals:", err);
//       setError("Server error");
//     } finally {
//       setLoading(false);
//     }
//   }, [apiUrl]);

//   useEffect(() => {
//     fetchSignals();
//   }, [fetchSignals]);

//   if (loading) {
//     return (
//       <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg">Loading signals...</p>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <div className="text-red-500 text-3xl mb-4">⚠️</div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
//           <button
//             onClick={fetchSignals}
//             className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all mt-4"
//           >
//             Retry
//           </button>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24">
//       {/* Heading */}
//       <div className="max-w-6xl mx-auto mb-12 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//           Featured <span className="text-emerald-600 font-bold">Free Calls</span>
//         </h2>
//         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//           Latest trading signals updated daily
//         </p>
//       </div>

//       {/* Cards Grid - 4 per row */}
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
//           {signals.slice(0, 8).map((signal) => {
//             const isBuy = signal.trade_direction === "BUY";
//             const riskReward = `${signal.risk_reward_ratio}:1`;
//             const formattedDate = new Date(signal.created_at).toLocaleDateString('en-IN', {
//               day: '2-digit',
//               month: 'short'
//             });

//             return (
//               <div
//                 key={signal.id}
//                 className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-emerald-200 h-full flex flex-col"
//               >
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-1 text-xs text-gray-600">
//                     <Calendar className="w-3 h-3" />
//                     {formattedDate}
//                   </div>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${signal.status === 'active'
//                       ? 'bg-emerald-100 text-emerald-800'
//                       : 'bg-gray-100 text-gray-700'
//                     }`}>
//                     {signal.status}
//                   </span>
//                 </div>

//                 {/* Trade Info */}
//                 <div className="mb-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isBuy
//                         ? 'bg-emerald-100 text-emerald-700'
//                         : 'bg-red-100 text-red-700'
//                       }`}>
//                       {isBuy ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
//                     </div>
//                     <h4 className="font-semibold text-sm truncate">
//                       {signal.instrument} {signal.instrument_type}
//                     </h4>
//                   </div>
//                   <p className="text-xs text-gray-500">Plan: {signal.subscription_plan}</p>
//                 </div>

//                 {/* Prices - Compact */}
//                 <div className="space-y-1 mb-1">
//                   <div className="flex justify-between text-xs">
//                     <span>Entry</span>
//                     <span className="font-semibold">₹{signal.entry_price.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-xs">
//                     <span>Risk : Reward</span>
//                     <span >
//                       {signal.risk_reward_ratio.toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-xs">
//                     <span>Duration</span>
//                     <span>₹{signal.duration.toLocaleString()}</span>
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 {/* <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
//                   <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
//                     <span className="font-medium">{signal.duration}</span>
//                   </div>
//                   <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded text-emerald-700 font-medium">
//                     <span>RR</span>
//                     <span>{riskReward}</span>
//                   </div>
//                 </div> */}

//                 {/* Segment & Action */}

//                 <div className="space-y-1 mb-4">

//                   <div className="flex justify-between text-xs">
//                     <span>Exchange</span>
//                     <span>
//                       {signal.exchange}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-xs">
//                     <span>Segment</span>
//                     <span>{signal.segment}</span>
//                   </div>
//                 </div>

//                 <button
//                   className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors"
//                   onClick={() => {
                 
//                     if (user === null) {
//                            navigate(`/login`)
//                            toast.warn('Please login first to view call', {
//                                                           duration: 3000,
//                                                           position: 'top-center',
//                                                           style: {
//                                                             background: '#3959fb',
//                                                             color: '#fff',
//                                                             padding: '16px',
//                                                             borderRadius: '10px',
//                                                           }})
//                     }
//                     else {
                
//                        navigate(`/afterbeforesubscription/${signal.id}`)
//                     }

//                   }
//                   }
//                 >
//                   Track →
//                 </button>
//               </div>
//             );
//           })}
//         </div>

//         {/* Show More Button */}
//         {signals.length > 4 && (
//           <div className="text-center pt-4">
//             <button
//               onClick={() => 
                
//                 {
                 
//                   if(user===null)
//                   {
//                     navigate('login')
//                     toast.warn('Please login first to view calls', {
//                                                    duration: 3000,
//                                                    position: 'top-center',
//                                                    style: {
//                                                      background: '#3959fb',
//                                                      color: '#fff',
//                                                      padding: '16px',
//                                                      borderRadius: '10px',
//                                                    }})
//                   }
//                   else
//                   {
//   navigate("/signals")
//                   }


//                 }
                
                
              



//               }
//               className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               View All {signals.length} Calls →
//             </button>
//           </div>
//         )}
//       </div>

//       {/* No Data State */}
//       {signals.length === 0 && (
//         <div className="max-w-md mx-auto text-center py-16">
//           <div className="text-5xl mb-6">📈</div>
//           <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Active Signals</h3>
//           <p className="text-gray-600 mb-8">Check back soon for latest trading recommendations</p>
//           <button
//             onClick={() => navigate("/feed")}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
//           >
//             Browse Calls
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }


// import React, { useCallback, useEffect, useState } from "react";
// import { Calendar, ArrowUp, ArrowDown, Lock, Eye, AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function FeaturedCalls() {
//   const [signals, setSignals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [selectedSignal, setSelectedSignal] = useState(null);
  
//   // Get user from localStorage
//   const userStr = localStorage.getItem('user');
//   const user = userStr ? JSON.parse(userStr) : null;
//   const token = localStorage.getItem('token');
  
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   console.log('User:', user);
//   console.log('Token exists:', !!token);

//   // Fetch signals based on login status
//   const fetchSignals = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       let res;
      
//       if (user || token) {
       
//         res = await axios.get(`${apiUrl}/signals/get-signals-free/limited`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//       } else {
//         // Not logged in - get public signals
//         console.log('Fetching public signals');
//         res = await axios.get(`${apiUrl}/signals/get-signals-free`);
//       }

//       if (res.data?.success) {
//         setSignals(res.data.data || []);
//       } else {
//         setError("Failed to fetch signals");
//       }
//     } catch (err) {
//       console.error("Error fetching signals:", err);
//       if (err.response?.status === 401) {
//         setError("Authentication failed. Please login again.");
//       } else {
//         setError(err.response?.data?.message || "Server error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [apiUrl, user, token]);

//   useEffect(() => {
//     fetchSignals();
//   }, []);

//   // Handle track button click
//   const handleTrackClick = (signal) => {
//     // Case 1: User not logged in
//     if (!user) {
//       setSelectedSignal(signal);
//       setShowLoginPrompt(true);
//       return;
//     }

//     // Case 2: User logged in but signal is locked (limit reached)
//     if (signal.isLocked) {
//       toast.warning(
//         <div className="flex flex-col gap-2">
//           <p className="font-semibold">⚠️ Free Limit Reached!</p>
//           <p className="text-sm">You've used all 5 free calls. Subscribe to our premium plan for unlimited access.</p>
//           <button 
//             onClick={() => navigate('/pricing')}
//             className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600"
//           >
//             View Premium Plans
//           </button>
//         </div>,
//         {
//           position: 'top-center',
//           autoClose: false,
//           closeOnClick: true,
//           draggable: false,
//           style: {
//             background: '#fff',
//             color: '#333',
//             border: '1px solid #f97316',
//             borderRadius: '12px',
//             padding: '16px',
//             width: '320px'
//           }
//         }
//       );
//       return;
//     }

//     // Case 3: User logged in and signal is accessible
//     navigate(`/afterbeforesubscription/${signal.id}`);
//   };

//   // Login prompt modal
//   const LoginPromptModal = () => {
//     if (!showLoginPrompt || !selectedSignal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fadeIn">
//           <button 
//             onClick={() => setShowLoginPrompt(false)}
//             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//           >
//             ✕
//           </button>
          
//           <div className="text-center">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Lock className="w-8 h-8 text-blue-600" />
//             </div>
            
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
//             <p className="text-gray-600 mb-6">
//               Please login to view this trading signal and track your portfolio.
//             </p>
            
//             <div className="space-y-3">
//               <button
//                 onClick={() => {
//                   setShowLoginPrompt(false);
//                   navigate('/login', { state: { from: '/featured-calls' } });
//                 }}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
//               >
//                 Login Now
//               </button>
              
//               <button
//                 onClick={() => setShowLoginPrompt(false)}
//                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
//               >
//                 Maybe Later
//               </button>
//             </div>
            
//             <p className="text-xs text-gray-500 mt-4">
//               New to InvestBay? <button onClick={() => {
//                 setShowLoginPrompt(false);
//                 navigate('/signup');
//               }} className="text-emerald-600 font-semibold">Create an account</button>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Get signal status for UI
//   const getSignalStatus = (signal) => {
//     if (!user) {
//       return {
//         isLocked: true,
//         lockMessage: 'Login to view',
//         badge: null
//       };
//     }
    
//     if (signal.isLocked) {
//       return {
//         isLocked: true,
//         lockMessage: 'Subscribe to view',
//         badge: { text: 'Limit Reached', color: 'bg-orange-100 text-orange-800' }
//       };
//     }
    
//     if (signal.alreadyViewed) {
//       return {
//         isLocked: false,
//         badge: { text: 'Viewed', color: 'bg-gray-800 text-white' }
//       };
//     }
    
//     return {
//       isLocked: false,
//       badge: null
//     };
//   };

//   if (loading) {
//     return (
//       <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg">Loading signals...</p>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <div className="text-red-500 text-3xl mb-4">⚠️</div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
//           <button
//             onClick={fetchSignals}
//             className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all mt-4"
//           >
//             Retry
//           </button>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24">
//       {/* Login Prompt Modal */}
//       <LoginPromptModal />

//       {/* Heading */}
//       <div className="max-w-6xl mx-auto mb-12 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//           Featured <span className="text-emerald-600 font-bold">Free Calls</span>
//         </h2>
//         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//           {!user 
//             ? "Login to unlock and track signals" 
//             : "Track your free signals (5/5 limit)"}
//         </p>
        
//         {/* Info Banner for logged in users */}
//         {user && (
//           <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
//             <Eye className="w-4 h-4" />
//             <span>You have 5 free signals. Each signal can be viewed once.</span>
//           </div>
//         )}
//       </div>

//       {/* Cards Grid */}
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
//           {signals.slice(0, 8).map((signal) => {
//             const isBuy = signal.trade_direction === "BUY";
//             const formattedDate = new Date(signal.created_at).toLocaleDateString('en-IN', {
//               day: '2-digit',
//               month: 'short'
//             });
            
//             const status = getSignalStatus(signal);

//             return (
//               <div
//                 key={signal.id}
//                 className={`bg-white rounded-xl p-4 shadow-sm transition-all duration-200 border h-full flex flex-col relative ${
//                   status.isLocked 
//                     ? 'border-gray-200 opacity-80' 
//                     : 'border-gray-100 hover:border-emerald-200 hover:shadow-md'
//                 }`}
//               >
//                 {/* Lock Overlay */}
//                 {status.isLocked && (
//                   <div className="absolute inset-0 bg-gray-100 bg-opacity-60 rounded-xl flex items-center justify-center z-10 backdrop-blur-[1px]">
//                     <div className="bg-white rounded-lg p-3 shadow-lg text-center">
//                       <Lock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
//                       <p className="text-xs text-gray-600 font-medium">{status.lockMessage}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Badges */}
//                 {status.badge && (
//                   <div className="absolute top-2 right-2 z-10">
//                     <span className={`${status.badge.color} text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
//                       {status.badge.text === 'Viewed' && <Eye className="w-3 h-3" />}
//                       {status.badge.text}
//                     </span>
//                   </div>
//                 )}

//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-1 text-xs text-gray-600">
//                     <Calendar className="w-3 h-3" />
//                     {formattedDate}
//                   </div>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                     signal.status === 'active'
//                       ? 'bg-emerald-100 text-emerald-800'
//                       : 'bg-gray-100 text-gray-700'
//                   }`}>
//                     {signal.status}
//                   </span>
//                 </div>

//                 {/* Trade Info */}
//                 <div className="mb-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
//                       isBuy
//                         ? 'bg-emerald-100 text-emerald-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}>
//                       {isBuy ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
//                     </div>
//                     <h4 className="font-semibold text-sm truncate">
//                       {signal.instrument} {signal.instrument_type}
//                     </h4>
//                   </div>
//                   <p className="text-xs text-gray-500">Plan: {signal.subscription_plan}</p>
//                 </div>

//                 {/* Prices */}
//                 <div className="space-y-1 mb-1">
//                   <div className="flex justify-between text-xs">
//                     <span>Entry</span>
//                     <span className="font-semibold">
//                       ₹{signal.entry_price?.toLocaleString() || 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-xs">
//                     <span>Risk : Reward</span>
//                     <span>
//                       {signal.risk_reward_ratio?.toLocaleString() || 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-xs">
//                     <span>Duration</span>
//                     <span>{signal.duration || 'N/A'}</span>
//                   </div>
//                 </div>

//                 {/* Exchange & Segment */}
//                 <div className="space-y-1 mb-4">
//                   <div className="flex justify-between text-xs">
//                     <span>Exchange</span>
//                     <span>{signal.exchange || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-xs">
//                     <span>Segment</span>
//                     <span>{signal.segment || 'N/A'}</span>
//                   </div>
//                 </div>

//                 {/* Track Button */}
//                 <button
//                   className={`w-full mt-auto py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
//                     status.isLocked
//                       ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                       : 'bg-emerald-600 hover:bg-emerald-700 text-white'
//                   }`}
//                   onClick={() => !status.isLocked && handleTrackClick(signal)}
//                   disabled={status.isLocked}
//                 >
//                   {status.isLocked ? 'Locked' : status.badge?.text === 'Viewed' ? 'View Again' : 'Track →'}
//                 </button>
//               </div>
//             );
//           })}
//         </div>

//         {/* Show More Button */}
//         {signals.length > 4 && (
//           <div className="text-center pt-4">
//             <button
//               onClick={() => {
//                 if (!user) {
//                   setShowLoginPrompt(true);
//                 } else {
//                   navigate("/signals");
//                 }
//               }}
//               className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               {!user ? 'Login to View All Calls →' : `View All ${signals.length} Calls →`}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* No Data State */}
//       {signals.length === 0 && !loading && (
//         <div className="max-w-md mx-auto text-center py-16">
//           <div className="text-5xl mb-6">📈</div>
//           <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Active Signals</h3>
//           <p className="text-gray-600 mb-8">
//             {!user 
//               ? 'Login to view trading recommendations' 
//               : 'Check back soon for latest trading recommendations'}
//           </p>
//           {!user && (
//             <button
//               onClick={() => navigate("/login")}
//               className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
//             >
//               Login
//             </button>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }



import React, { useCallback, useEffect, useState } from "react";
import { Calendar, ArrowUp, ArrowDown, Lock, Eye, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function FeaturedCalls() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [accessInfo, setAccessInfo] = useState({
    viewedCount: 0,
    remainingViews: 5,
    limitReached: false,
    hasSubscription: false
  });
  
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch signals
  const fetchSignals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let res;
      
      if (user && token) {
        // Logged in user - get signals with access info
        res = await axios.get(`${apiUrl}/signals/get-signals-free/limited`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.data?.success) {
          setSignals(res.data.data || []);
          setAccessInfo({
            viewedCount: res.data.viewedCount || 0,
            remainingViews: res.data.remainingViews || 0,
            limitReached: res.data.limitReached || false,
            hasSubscription: res.data.hasSubscription || false
          });
        }
      } else {
        // Not logged in - public signals
        res = await axios.get(`${apiUrl}/signals/get-signals-free`);
        
        if (res.data?.success) {
          setSignals(res.data.data || []);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user, token]);

  useEffect(() => {
    fetchSignals();
  }, []);

  // ============================================
  // HANDLE UNLOCK/TRACK BUTTON CLICK
  // ============================================
  const handleUnlockClick = async (signal) => {
    // Case 1: User not logged in
    if (!user) {
      setSelectedSignal(signal);
      setShowLoginPrompt(true);
      return;
    }

    // Case 2: Signal is locked (limit reached)
    if (signal.isLocked) {
      toast.warning(
        <div className="flex flex-col gap-2">
          <p className="font-semibold">⚠️ Free Limit Reached!</p>
          <p className="text-sm">You've used all 5 free calls. Subscribe for unlimited access.</p>
          <button 
            onClick={() => navigate('/pricing')}
            className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600"
          >
            View Plans
          </button>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          style: { background: '#fff', border: '1px solid #f97316', borderRadius: '12px' }
        }
      );
      return;
    }

    // ✅ Case 3: New signal - TRACK VIEW (COUNT BADHEGA)
    if (!signal.alreadyViewed && !accessInfo.hasSubscription) {
      try {
        const trackRes = await axios.post(
          `${apiUrl}/signals/track-signal-view/${signal.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (trackRes.data.success) {
          // Update local state
          setAccessInfo(prev => ({
            ...prev,
            viewedCount: trackRes.data.viewedCount || prev.viewedCount + 1,
            remainingViews: trackRes.data.remainingViews || prev.remainingViews - 1
          }));
          
          // Update signal as viewed
          setSignals(prevSignals => 
            prevSignals.map(s => 
              s.id === signal.id 
                ? { ...s, alreadyViewed: true, canView: true }
                : s
            )
          );
          
          // Show success message
          toast.success(`Signal unlocked! ${trackRes.data.remainingViews} free views remaining`, {
            position: 'top-center',
            autoClose: 3000
          });
        }
      } catch (error) {
        console.error('Error tracking view:', error);
        
        if (error.response?.status === 403) {
          toast.error('Free limit reached! Please subscribe.', {
            position: 'top-center'
          });
          return;
        }
      }
    }

    // Navigate to signal details
    navigate(`/afterbeforesubscription/${signal.id}`);
  };

  // Login prompt modal
  const LoginPromptModal = () => {
    if (!showLoginPrompt || !selectedSignal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fadeIn">
          <button 
            onClick={() => setShowLoginPrompt(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please login to unlock and view this trading signal.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/login', { state: { from: '/featured-calls' } });
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl"
              >
                Login Now
              </button>
              
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get button text based on status
  const getButtonContent = (signal) => {
    if (!user) return { text: 'Unlock →', icon: null, disabled: false };
    if (signal.isLocked) return { text: 'Locked', icon: Lock, disabled: true };
    if (signal.alreadyViewed) return { text: 'View Again →', icon: Eye, disabled: false };
    if (signal.unlockButton) return { text: 'Unlock →', icon: Unlock, disabled: false };
    return { text: 'View →', icon: null, disabled: false };
  };

  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
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
            className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all mt-4"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-16 px-4 sm:px-8 md:px-12 lg:px-24">
      {/* Login Modal */}
      <LoginPromptModal />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Featured <span className="text-emerald-600 font-bold">Free Calls</span>
        </h2>
        
        {/* Progress Bar for Logged In Users */}
        {/* {user && !accessInfo.hasSubscription && (
          <div className="max-w-md mx-auto mt-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Free Signals Used: {accessInfo.viewedCount}/5
                </span>
                <span className="text-sm text-emerald-600 font-semibold">
                  {accessInfo.remainingViews} remaining
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(accessInfo.viewedCount / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {signals.slice(0, 8).map((signal) => {
            const isBuy = signal.trade_direction === "BUY";
            const formattedDate = new Date(signal.created_at).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short'
            });
            
            const buttonInfo = getButtonContent(signal);
            const ButtonIcon = buttonInfo.icon;

            return (
              <div
                key={signal.id}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all duration-200 border h-full flex flex-col relative ${
                  signal.isLocked 
                    ? 'border-gray-200 opacity-80' 
                    : 'border-gray-100 hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                {/* Lock Overlay */}
                {signal.isLocked && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-60 rounded-xl flex items-center justify-center z-10 backdrop-blur-[1px]">
                    <div className="bg-white rounded-lg p-3 shadow-lg text-center">
                      <Lock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 font-medium">Subscribe to view</p>
                    </div>
                  </div>
                )}

                {/* Viewed Badge */}
                {signal.alreadyViewed && !signal.isLocked && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Viewed
                    </span>
                  </div>
                )}

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

                {/* Prices */}
                <div className="space-y-1 mb-1">
                  <div className="flex justify-between text-xs">
                    <span>Entry</span>
                    <span className="font-semibold">
                      ₹{signal.entry_price?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Risk : Reward</span>
                    <span>{signal.risk_reward_ratio?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Duration</span>
                    <span>{signal.duration || 'N/A'}</span>
                  </div>
                </div>

                {/* Exchange & Segment */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span>Exchange</span>
                    <span>{signal.exchange || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Segment</span>
                    <span>{signal.segment || 'N/A'}</span>
                  </div>
                </div>

                {/* ✅ UNLOCK BUTTON */}
                <button
                  className={`w-full mt-auto py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                    buttonInfo.disabled
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                  onClick={() => !buttonInfo.disabled && handleUnlockClick(signal)}
                  disabled={buttonInfo.disabled}
                >
                  {ButtonIcon && <ButtonIcon className="w-3 h-3" />}
                  {buttonInfo.text}
                </button>
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        {signals.length > 4 && (
          <div className="text-center pt-4">
            <button
              onClick={() => {
                if (!user) {
                  setShowLoginPrompt(true);
                } else {
                  navigate("/signals");
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg"
            >
              {!user ? 'Login to View All Calls →' : `View All ${signals.length} Calls →`}
            </button>
          </div>
        )}
      </div>

      {/* No Data State */}
      {signals.length === 0 && !loading && (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="text-5xl mb-6">📈</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Active Signals</h3>
          <p className="text-gray-600 mb-8">
            {!user ? 'Login to view trading recommendations' : 'Check back soon!'}
          </p>
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Login
            </button>
          )}
        </div>
      )}
    </section>
  );
}