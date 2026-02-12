// import React, { useCallback, useEffect, useState } from "react";
// import { mentorsData } from "../../data/mentorsData";
// import leftImg from "../../assets/left.png";
// import rightImg from "../../assets/right.png";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Mentors() {
  

//    const [analysts, setAnalysts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
  
//     const apiUrl = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();


//     console.log(analysts,'analysts..')


//    const fetchAnalysts = useCallback(async () => {
//       try {
//         setLoading(true);
//         setError("");
  
//         const res = await axios.get(`${apiUrl}/research-analyst/all`);
  
//         if (res.data?.success) {
//           setAnalysts(res.data.data || []);
//         } else {
//           setError("Failed to fetch mentors");
//         }
//       } catch (err) {
//         console.error("Error fetching analysts:", err);
//         setError("Server error");
//       } finally {
//         setLoading(false);
//       }
//     }, [apiUrl]);


//     useEffect(()=>{

//       fetchAnalysts()

//     },[])



//   return (
//     <section
//       className="py-16 px-6 relative overflow-hidden"
//       style={{
//         background: "linear-gradient(144.29deg, #3A4EFB 35%, #FFFFFF 100%)",
//       }}
//     >
//       {/* ✅ Heading */}
//       <div className="max-w-7xl mx-auto text-center relative z-10">
//         <h2 className="text-3xl md:text-4xl text-white mb-3">
//           Meet Your Personal Investment{" "}
//           <span className="font-semibold">Mentors</span>
//         </h2>
//         <p className="text-white/80 text-[15px]">
//           Verified market experts guiding you toward smarter financial growth.
//         </p>
//       </div>

//       {/* ✅ Mentor Cards Container */}
//       <div className="relative max-w-6xl mx-auto mt-14 flex justify-center items-center">
//         {/* ✅ Left Decorative Image — fixed beside cards */}
//         <img
//           src={leftImg}
//           alt="left design"
//           className="hidden md:block absolute -left-32 top-1/2 -translate-y-1/2 w-44 lg:w-56 opacity-70 z-0 pointer-events-none"
//         />

//         {/* ✅ Right Decorative Image — fixed beside cards */}
//         <img
//           src={rightImg}
//           alt="right design"
//           className="hidden md:block absolute -right-32 top-1/2 -translate-y-1/2 w-44 lg:w-56 opacity-70 z-0 pointer-events-none"
//         />

//         {/* ✅ Mentor Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10 w-full">
//           {mentorsData.slice(0, 4).map((mentor, index) => (
//             <div
//               key={index}
//               className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white/10 backdrop-blur-sm"
//             >
//               <img
//                 src={mentor.image}
//                 alt={mentor.name}
//                 className="w-full h-84 object-cover transition-transform duration-300 group-hover:scale-105"
//               />
//               <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

//               {/* Text Overlay */}
//               <div className="absolute bottom-3 left-0 w-full px-4 text-white z-10">
//                 <h3 className="text-lg font-semibold text-left">{mentor.name}</h3>
//                 <div className="flex justify-between items-center text-sm text-white/90 mt-1">
//                   <p className="text-left">Experience: {mentor.experience}</p>
//                   <p className="text-right">{mentor.location}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Button */}
//       <div className="text-center mt-12 relative z-10">
//         <button onClick={() => navigate('/mentors')} className="px-6 py-2 bg-white text-black font-medium rounded-full shadow hover:bg-[#f3f3f3] transition">
//           View All Mentors
//         </button>
//       </div>
//     </section>
//   );
// }


import React, { useCallback, useEffect, useState } from "react";
import leftImg from "../../assets/left.png";
import rightImg from "../../assets/right.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Mentors() {
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // 🔥 IST Date formatting functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchAnalysts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      
      if (res.data?.success) {
        setAnalysts(res.data.data || []);
      } else {
        setError("Failed to fetch mentors");
      }
    } catch (err) {
      console.error("Error fetching analysts:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchAnalysts();
  }, [fetchAnalysts]);

  console.log(analysts, 'analysts..');

  return (
    <section
      className="py-16 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(144.29deg, #3A4EFB 35%, #FFFFFF 100%)",
      }}
    >
      {/* ✅ Heading */}
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl text-white mb-3">
          Meet Your Personal Investment{" "}
          <span className="font-semibold">Mentors</span>
        </h2>
        <p className="text-white/80 text-[15px]">
          Verified market experts guiding you toward smarter financial growth.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-6xl mx-auto mt-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-6"></div>
          <p className="text-white/90 text-xl">Loading Mentors...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-6xl mx-auto mt-20 text-center">
          <p className="text-red-200 text-xl mb-6">{error}</p>
          <button
            onClick={fetchAnalysts}
            className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Retry
          </button>
        </div>
      )}

      {/* ✅ Mentor Cards Container */}
      {!loading && !error && (
        <>
          <div className="relative max-w-6xl mx-auto mt-14 flex justify-center items-center">
            {/* Left Decorative Image */}
            <img
              src={leftImg}
              alt="left design"
              className="hidden md:block absolute -left-32 top-1/2 -translate-y-1/2 w-44 lg:w-56 opacity-70 z-0 pointer-events-none"
            />

            {/* Right Decorative Image */}
            <img
              src={rightImg}
              alt="right design"
              className="hidden md:block absolute -right-32 top-1/2 -translate-y-1/2 w-44 lg:w-56 opacity-70 z-0 pointer-events-none"
            />

            {/* ✅ REAL DATA MAPPING - Updated for your API response */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10 w-full">
              {analysts.slice(0, 8).map((analyst, index) => (
                <div
                  key={analyst.id || index}
                  className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group bg-white/20 backdrop-blur-xl border border-white/30"
                >
                  {/* Profile Image */}
                  <div className="relative h-80">
                    <img
                      src={analyst.profile_image || "https://i.pravatar.cc/300"}
                      alt={analyst.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://i.pravatar.cc/300";
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                    
                    {/* SEBI Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-400/90 text-black px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border-2 border-white/50">
                      SEBI: {analyst.sebi_number?.slice(0, 4)}...
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 bg-green-400/90 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      {analyst.status?.toUpperCase()}
                    </div>
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-8 left-4 right-4 text-white z-20">
                    <h3 className="text-xl md:text-2xl font-bold text-left leading-tight mb-2 truncate">
                      {analyst.name}
                    </h3>
                    
                    {/* Details Row */}
                    <div className="flex justify-between items-start text-sm text-white/95 mb-3">
                      <div className="text-left">
                        <p className="font-semibold">Exp: {analyst.experience} yrs</p>
                        <p className="text-white/80 capitalize">{analyst.city}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-mono">ID: {analyst.user_id?.slice(0, 6)}...</p>
                        <p className="text-white/70">{formatDate(analyst.created_at)}</p>
                      </div>
                    </div>

                    {/* Specialization & Education */}
                    <div className="flex flex-wrap gap-2 text-xs bg-black/40 px-3 py-2 rounded-xl backdrop-blur-sm">
                      <span className="px-2 py-1 bg-white/20 rounded-lg font-medium">
                        {analyst.specialization || "TRADER"}
                      </span>
                      <span className="px-2 py-1 bg-white/10 rounded-lg">
                        {analyst.education}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-100 rounded-lg">
                        {analyst.languages?.[0] || "Hindi"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No Data State */}
          {analysts.length === 0 && !loading && !error && (
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl">
                <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white/90 mb-4">No Mentors Found</h3>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Verified research analysts will appear here. Check back soon!
              </p>
            </div>
          )}
        </>
      )}

      {/* ✅ View All Button */}
      <div className="text-center mt-16 relative z-10">
        <button 
          onClick={() => navigate('/mentors')} 
          className="px-10 py-4 bg-white text-black font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm"
          disabled={loading}
        >
          View All Mentors ({analysts.length})
        </button>
      </div>
    </section>
  );
}



