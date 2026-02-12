// import { useNavigate } from "react-router-dom";
// import { coursesData } from "../../data/coursesData";
// import bgImage from "../../assets/courses-bg.jpg";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function FeaturedCourses() {



//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   console.log(courses,'courses...')



//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${apiUrl}/courses/allcourses`);
//         console.log("Courses API response:", res.data);

//         // FIX: Access the data array from the response
//         if (res.data.success && Array.isArray(res.data.data)) {
//           setCourses(res.data.data);
//           console.log("Courses data array:", res.data.data);
//         } else {
//           console.warn("Unexpected API response structure:", res.data);
//           setCourses([]);
//         }

//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setCourses([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [apiUrl]);



//   return (
//     <section
//       className="py-16 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="max-w-6xl mx-auto text-center mb-12">
//         <h2 className="text-4xl">
//           Featured{" "}
//           <span
//             className="active-text"
//           // style={{
//           //   background: "linear-gradient(90deg, #00BFA6 50%, #BEFFF6 100%)",
//           //   WebkitBackgroundClip: "text",
//           // }}
//           >
//             Courses
//           </span>
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Get exclusive market insights and expert recommendations from SEBI-registered advisors.
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {coursesData.map((course) => (
//           <div
//             key={course.id}
//             className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-2 flex flex-col justify-between"
//           >
//             <img
//               src={course.image}
//               alt={course.title}
//               className="rounded-xl object-cover w-full h-48 mb-4"
//             />
//             <div className="text-left space-y-2">
//               <h3 className="font-semibold text-lg">{course.title}</h3>
//               <p className="text-gray-500 text-sm">By {course.mentor}</p>

//               <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Duration</span>
//                 <span className="font-medium">{course.duration}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Language</span>
//                 <span className="font-medium">{course.language}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Segment</span>
//                 <span className="font-medium">{course.segment}</span>
//               </div>

//               <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-l from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>

//               <div className="flex justify-between items-center">
//                 <p className="text-sm">
//                   Incl taxes <br />
//                   <span className="text-[#00BFA6] text-xl">{course.price}</span>
//                 </p>
//                 <button className="border rounded-md p-2 px-9 hover:bg-[#00BFA6] hover:text-white transition">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-10">
//         <button
//           onClick={() => navigate("/courses")}
//           className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition">
//           View All Courses
//         </button>
//       </div>
//     </section>
//   );
// }



import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/courses-bg.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  console.log(courses, 'courses...');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/courses/allcourses`);
        console.log("Courses API response:", res.data);

        if (res.data.success && Array.isArray(res.data.data)) {
          setCourses(res.data.data);
          console.log("Courses data array:", res.data.data);
        } else {
          console.warn("Unexpected API response structure:", res.data);
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [apiUrl]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat min-h-[500px] flex items-center justify-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading courses...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl text-white drop-shadow-lg">
          Featured{" "}
          <span className="active-text bg-gradient-to-r from-[#00BFA6] to-[#BEFFF6] bg-clip-text text-transparent">
            Courses
          </span>
        </h2>
        <p className="text-white/90 mt-2 text-lg drop-shadow-md max-w-2xl mx-auto">
          Get exclusive market insights and expert recommendations from SEBI-registered advisors.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => {
          // Calculate discounted price
          const originalPrice = parseFloat(course.course_price);
          const discount = parseFloat(course.discount);
          const discountedPrice = originalPrice - (originalPrice * discount / 100);
          
          return (
            <div
              key={course.id}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between hover:-translate-y-2 border border-white/20"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={course.uploded_image}
                  alt={course.course_title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/00BFA6/FFFFFF?text=Course+Image';
                  }}
                />
                {/* Discount Badge */}
                {course.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    -{course.discount}%
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-3 flex-1">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl line-clamp-2 leading-tight">{course.course_title}</h3>
                  <p className="text-gray-500 text-sm">By Upsurge Club</p>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-gray-200 to-transparent"></div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium capitalize">{course.course_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium capitalize">{course.course_language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium capitalize">{course.trading_category}</span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-l from-gray-200 to-transparent"></div>

                <div className="flex flex-col sm:flex-row justify-between items-end gap-4 pt-2">
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">Incl. taxes</p>
                    <div className="space-y-0.5">
                      <span className="text-2xl font-bold text-[#00BFA6]">
                        ₹{discountedPrice.toFixed(0)}
                      </span>
                      {course.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{originalPrice.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="flex-1 sm:flex-none bg-gradient-to-r from-[#00BFA6] to-[#00D4B1] text-white py-3 px-6 rounded-xl font-medium hover:from-[#00A894] hover:to-[#00C4A1] transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-white/80 text-lg mb-4">No courses available at the moment.</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            Explore Courses
          </button>
        </div>
      )}

      <div className="flex justify-center mt-16">
        <button
          onClick={() => navigate("/courses")}
          className="bg-white/90 backdrop-blur-sm text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-white/30 shadow-lg"
        >
          View All Courses →
        </button>
      </div>
    </section>
  );
}
