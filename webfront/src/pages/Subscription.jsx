// import { useNavigate } from "react-router-dom";
// import bgImage from "../assets/profile-bg.jpg";
// import Verify from "../assets/Verify.svg";
// import { Filter } from "lucide-react";
// import Newsletter from "./Newsletter";
// import { useCallback, useEffect, useState } from "react";
// import axios from "axios";

// export default function FeaturedSubscriptions() {
//   const tabs = ["All Subscriptions", "My Subscriptions"];

//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   const fetchSubscriptions = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.get(
//         `${apiUrl}/plans/plans`
//       );

//       if (res.data?.success) {
//         setSubscriptions(res.data.data || []);
//       } else {
//         setError("Failed to fetch subscriptions");
//       }
//     } catch (err) {
//       console.error("Error fetching subscriptions", err);
//       setError("Server error");
//     } finally {
//       setLoading(false);
//     }
//   }, [apiUrl]);

//   useEffect(() => {
//     fetchSubscriptions();
//   }, [fetchSubscriptions]);

//   return (
//     <>
//       <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-10">
//           <div className="flex items-center bg-black rounded-full px-2 py-1">
//             {tabs.map((tab, index) => (
//               <button
//                 key={index}
//                 className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
//                   index === 0
//                     ? "bg-white text-black font-medium"
//                     : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-gray-50">
//             <Filter className="w-4 h-4" /> Filter
//           </button>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <p className="text-center text-gray-500">Loading subscriptions...</p>
//         )}

//         {/* Error */}
//         {error && (
//           <p className="text-center text-red-500">{error}</p>
//         )}

//         {/* Cards */}
//         {!loading && !error && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {subscriptions.length === 0 ? (
//               <p className="col-span-full text-center text-gray-500">
//                 No subscriptions found
//               </p>
//             ) : (
//               subscriptions.map((sub) => (
//                 <div
//                   key={sub.id}
//                   className="rounded-2xl shadow-sm border p-1 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
//                   style={{
//                     background:
//                       "linear-gradient(144.29deg, #E3F4CB 35%, #FFFFFF 70%)",
//                   }}
//                 >
//                   {/* Top Image */}
//                   <div
//                     className="relative h-28 bg-cover bg-center rounded-2xl"
//                     style={{ backgroundImage: `url(${bgImage})` }}
//                   >
//                     <div className="absolute left-5 -bottom-8">
//                       <img
//                         src={sub.uplodedImage || "/default-avatar.png"}
//                         alt={sub.name}
//                         className="w-16 h-16 rounded-full border-4 border-white shadow-md"
//                       />
//                     </div>

//                     <p className="absolute top-20 right-4 text-white text-sm font-medium bg-black/40 px-2 py-1 rounded-md">
//                       {sub.segment}
//                     </p>
//                   </div>

//                   {/* Content */}
//                   <div className="pt-12 pb-6 px-5 text-gray-700">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="text-lg font-semibold">
//                           {sub.name}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                           {sub.role || "Research Analyst"}
//                         </p>
//                       </div>
//                       <img
//                         src={Verify}
//                         alt="verified"
//                         className="w-5 h-5"
//                       />
//                     </div>

//                     <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <p className="text-gray-600 font-medium">Calls</p>
//                         <p className="font-semibold">{sub.avgTrades}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-600 font-medium">
//                           Ideal Capital
//                         </p>
//                         <p className="font-semibold">{sub.idealCapital}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-600 font-medium">
//                           Stoploss
//                         </p>
//                         <p className="font-semibold">{`${sub.stopLoss} %`}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-600 font-medium">
//                           Segment
//                         </p>
//                         <p className="font-semibold">{sub.segment}</p>
//                       </div>
//                     </div>

//                     <div className="mt-5 flex items-center justify-between">
//                       <div className="text-sm">
//                         <span className="text-[#00BFA6] font-semibold text-base">
//                           Starting ₹{sub.planPrice}
//                         </span>{" "}
//                         {sub.oldPrice && (
//                           <span className="line-through text-gray-400">
//                             ₹{sub.planPrice}
//                           </span>
//                         )}
//                       </div>

//                       <button
//                         onClick={() =>
//                           navigate(`/subscription/${sub.id}`)
//                         }
//                         className="bg-black text-white text-sm px-8 py-2 rounded-lg hover:bg-gray-800"
//                       >
//                         Buy Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </section>

//       <Newsletter />
//     </>
//   );
// }


import { useNavigate } from "react-router-dom";
import bgImage from "../assets/profile-bg.jpg";
import Verify from "../assets/Verify.svg";
import { Filter } from "lucide-react";
import Newsletter from "./Newsletter";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function FeaturedSubscriptions() {
  const tabs = ["All Subscriptions", "My Subscriptions"];

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${apiUrl}/plans/plans`
      );

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

  return (
    <>
      <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
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

          <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading subscriptions...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptions.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No subscriptions found
              </p>
            ) : (
              subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-2xl shadow-sm border p-1 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
                  style={{
                    background:
                      "linear-gradient(144.29deg, #E3F4CB 35%, #FFFFFF 70%)",
                  }}
                >
                  {/* Top Image */}
                  <div
                    className="relative h-28 bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  >
                    <div className="absolute left-5 -bottom-8">
                      <img
                        src={sub.uploded_image || "/default-avatar.png"}
                        alt={sub.plan_name}
                        className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                      />
                    </div>

                    <p className="absolute top-20 right-4 text-white text-sm font-medium bg-black/40 px-2 py-1 rounded-md">
                      {sub.segment}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="pt-12 pb-6 px-5 text-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {sub.plan_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {sub.category || "Research Analyst"}
                        </p>
                      </div>
                      <img
                        src={Verify}
                        alt="verified"
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Calls</p>
                        <p className="font-semibold">{sub.avg_trades}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          Ideal Capital
                        </p>
                        <p className="font-semibold">{sub.ideal_capital}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          Stoploss
                        </p>
                        <p className="font-semibold">{`${sub.stop_loss} %`}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          Segment
                        </p>
                        <p className="font-semibold">{sub.segment}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-[#00BFA6] font-semibold text-base">
                          Starting ₹{sub.plan_price}
                        </span>{" "}
                        {sub.discount && sub.discount !== "0" && (
                          <span className="line-through text-gray-400 ml-2">
                            ₹{Math.round(sub.plan_price / (1 - sub.discount/100))}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/subscription/${sub.id}`)
                        }
                        className="bg-black text-white text-sm px-8 py-2 rounded-sm hover:bg-gray-800"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <Newsletter />
    </>
  );
}