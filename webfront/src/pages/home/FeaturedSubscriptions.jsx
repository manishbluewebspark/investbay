// import React, { useCallback, useEffect, useState } from "react";
// import { subscriptionsData } from "../../data/subscriptionsData";
// import bgImage from "../../assets/profile-bg.jpg";
// import Verify from "../../assets/Verify.svg";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function FeaturedSubscriptions() {
 


//      const [subscriptions, setSubscriptions] = useState([]);
//       const [loading, setLoading] = useState(false);
//       const [error, setError] = useState("");

//       console.log(subscriptions,'subscriptions..')
    
//       const apiUrl = import.meta.env.VITE_API_URL;
//       const navigate = useNavigate();
    
//       const fetchSubscriptions = useCallback(async () => {
//         try {
//           setLoading(true);
//           setError("");
    
//           const res = await axios.get(
//             `${apiUrl}/plans/plans`
//           );
    
//           if (res.data?.success) {
//             setSubscriptions(res.data.data || []);
//           } else {
//             setError("Failed to fetch subscriptions");
//           }
//         } catch (err) {
//           console.error("Error fetching subscriptions", err);
//           setError("Server error");
//         } finally {
//           setLoading(false);
//         }
//       }, [apiUrl]);
    
//       useEffect(() => {
//         fetchSubscriptions();
//       }, [fetchSubscriptions]);


//     return (
//         <section className="py-14 px-6 bg-white">
//             <div className="max-w-full px:6 lg:px-40">
//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 text-center md:text-left">
//                     <div>
//                         <h2 className="text-4xl ">
//                             Featured{" "}
//                             <span
//                             className="active-text"
//                                 // className="text-transparent bg-clip-text font-semibold"
//                                 // style={{
//                                 //     background: "linear-gradient(90deg, #00BFA6 50%, #BEFFF6 100%)",
//                                 //     WebkitBackgroundClip: "text",
//                                 // }}
//                             >
//                                 Subscriptions
//                             </span>
//                         </h2>

//                         <p className="text-gray-500 mt-2 text-sm">
//                             Get exclusive market insights and expert recommendations from SEBI-registered advisors.
//                         </p>
//                     </div>
//                     <button onClick={() => navigate('/subscriptions')} className="mt-4 md:mt-0 bg-black text-white px-5 py-2 rounded-full text-sm">
//                         View All Subscriptions
//                     </button>
//                 </div>

//                 {/* Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {subscriptionsData.slice(0, 3).map((sub, index) => (
//                         <div
//                             key={sub.id}
//                             className="rounded-2xl shadow-sm border p-1 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
//                             style={{
//                                 background: "linear-gradient(144.29deg, #E3F4CB 35%, #FFFFFF 70%)",
//                             }}
//                         >

//                             {/* Background Image Section */}
//                             <div
//                                 className="relative h-28 bg-cover bg-center rounded-2xl"
//                                 style={{ backgroundImage: `url(${bgImage})` }}
//                             >
//                                 <div className="absolute left-5 -bottom-8">
//                                     <img
//                                         src={sub.img}
//                                         alt={sub.name}
//                                         className="w-16 h-16 rounded-full border-4 border-white shadow-md"
//                                     />
//                                 </div>
//                                 <p className="absolute top-20 right-4 text-white text-sm font-medium bg-black/40 px-2 py-1 rounded-md">
//                                     {sub.segment}
//                                 </p>
//                             </div>

//                             {/* Card Content */}
//                             <div className="pt-12 pb-6 px-5 text-gray-700">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <h3 className="text-lg font-semibold">{sub.name}</h3>
//                                         <p className="text-sm text-gray-500">{sub.role}</p>
//                                     </div>
//                                     <img
//                                         src={Verify}
//                                         alt="verified"
//                                         className="w-5 h-5"
//                                     />
//                                 </div>

//                                 <div className="mt-4 text-sm space-y-4 grid grid-cols-2">
//                                     <p>
//                                         <h1><span className="font-medium text-gray-600">Calls: </span></h1>
//                                         <p className="font-semibold">{sub.calls}</p>
//                                     </p>
//                                     <p>
//                                         <h1><span className="font-medium text-gray-600">Ideal Capital: </span></h1>
//                                         <p className="font-semibold">{sub.capital}</p>
//                                     </p>
//                                     <p>
//                                         <h1><span className="font-medium text-gray-600">Stoploss: </span></h1>
//                                         <p className="font-semibold">{sub.stoploss}</p>
//                                     </p>
//                                     <p>
//                                         <h1><span className="font-medium text-gray-600">Segment: </span></h1>
//                                         <p className="font-semibold">{sub.segment}</p>
//                                     </p>
//                                 </div>

//                                 <div className="mt-5 flex justify-between items-center">
//                                     <div className="text-sm">
//                                         <span className="text-[#00BFA6] font-semibold text-base">
//                                             Starting {sub.price}
//                                         </span>{" "}
//                                         <span className="line-through text-gray-400">{sub.oldPrice}</span>
//                                     </div>
//                                     <button className="bg-black text-white text-sm px-12 py-2 rounded-lg hover:bg-gray-800">
//                                         Buy Now
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }





import React, { useCallback, useEffect, useState } from "react";
import Verify from "../../assets/Verify.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function FeaturedSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = localStorage.getItem('user')
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // IST Date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${apiUrl}/plans/plans`);
      
      if (res.data?.success) {
        setSubscriptions(res.data.data || []);
      } else {
        setError("Failed to fetch subscriptions");
      }
    } catch (err) {
      console.error("Error fetching subscriptions", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-3"></div>
          <p className="text-base text-gray-700 font-medium">Loading subscriptions...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-red-500 text-2xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{error}</h3>
          <button
            onClick={fetchSubscriptions}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Featured <span className="text-emerald-600">Subscriptions</span>
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Choose from premium trading plans by SEBI-registered advisors
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {subscriptions.slice(0, 8).map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-emerald-100 h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={sub.uploded_image || "https://i.pravatar.cc/40?img=3"}
                    alt={sub.plan_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://i.pravatar.cc/40?img=3";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base line-clamp-1">
                    {sub.plan_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === "active" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(sub.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm flex-1">
                <div className="p-2 bg-gray-50 rounded-lg flex justify-between">
                  <span className="text-gray-500 text-xs">Calls/Day</span>
                  <span className="font-semibold text-gray-900">{sub.avg_trades}</span>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg flex justify-between">
                  <span className="text-gray-500 text-xs">Capital</span>
                  <span className="font-semibold">₹{sub.ideal_capital}</span>
                </div>
                <div className="p-2 bg-red-50 rounded-lg flex justify-between">
                  <span className="text-gray-500 text-xs">SL</span>
                  <span className="font-semibold text-red-600">{sub.stop_loss}%</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg flex justify-between">
                  <span className="text-gray-500 text-xs">Risk</span>
                  <span className="font-semibold text-emerald-700">{sub.risk}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-auto space-y-2">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{parseFloat(sub.plan_price).toLocaleString()}
                  </span>
                  {sub.discount && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      {sub.discount}% OFF
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <span>{sub.segment}</span>
                  <span>•</span>
                  <span className="capitalize">{sub.duration}</span>
                </div>

                <button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => {
                    
                    if(user===null)
                    {

                       navigate(`/login`)
                       toast.warn('Please login first to view subscription', {
                               duration: 3000,
                               position: 'top-center',
                               style: {
                                 background: '#3959fb',
                                 color: '#fff',
                                 padding: '16px',
                                 borderRadius: '10px',
                               }})
                    }
                    else
                    {
                    navigate(`/subscription/${sub.id}`)
                     }
                  
                  }}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {subscriptions.length > 4 && (
          <div className="text-center">
            <button
              onClick={() => 
              {
                
                  if(user===null)
                    {

                       navigate(`/login`)
                        toast.warn('Please login first to view subscriptions', {
                               duration: 3000,
                               position: 'top-center',
                               style: {
                                 background: '#3959fb',
                                 color: '#fff',
                                 padding: '16px',
                                 borderRadius: '10px',
                               }})
                    }
                    else
                    {
                navigate('/subscriptions')
                    }
              
                    }
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              View All {subscriptions.length} Plans →
            </button>
          </div>
        )}

        {/* No Data State */}
        {subscriptions.length === 0 && (
          <div className="max-w-sm mx-auto text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Plans Available</h3>
            <p className="text-gray-600 mb-6">Premium subscription plans will appear here soon</p>
            <button
              onClick={fetchSubscriptions}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
