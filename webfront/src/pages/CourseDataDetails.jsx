// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function CourseDataDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const [course, setcourse] = useState(null);
//   const [analyst, setAnalyst] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/courses/data/${id}`);
//         setcourse(res.data.data.course);
//         setAnalyst(res.data.data.analyst);
//       } catch (error) {
//         console.error("Error fetching course details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [id, apiUrl]);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   if (!course) {
//     return (
//       <div className="text-center mt-10">
//         <p className="text-red-500">No course data available.</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const infoList = [
//     ["Total Course Videos", course.totalVideos],
//     ["Video Duration", course.totalDuration],
//   ];

//   const detailList = [
//     ["Course Level", course.courseLevel],
//     ["Language", course.languages],
//     ["Access Validity", course.accessValidity],
//     ["Learners", course.learners],
//     ["Course Price", `₹ ${course.coursePrice}`],
//     ["Discount", `${course.discount} %`],
//   ];

//   return (
//     <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

//         {/* LEFT SIDE – IMAGE CARD */}
//                     <div className="bg-white rounded-2xl overflow-hidden md:col-span-1 flex flex-col h-full">
//                         <div className="w-full h-[450px] flex-shrink-0">
//                             <img
//                                 src={
//                                     course.uplodedImage
//                                         ? course.uplodedImage
//                                         : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                                 }
//                                 alt="Profile"
//                                 className="w-full h-full object-fill"
//                             />
//                         </div>

//                         <div
//                             className="p-5 -mt-6 rounded-t-2xl relative z-10 flex-grow flex flex-col"
//                             style={{
//                                 background: "linear-gradient(to bottom, #CED3FF 10%, #FFFFFF 100%)",
//                             }}
//                         >
//                             <div className="flex justify-between items-start mb-4">
//                                 <div className="flex-grow">
//                                     <h2 className="text-lg font-semibold text-gray-900">
//                                         {course.name || "N/A"}
//                                     </h2>
//                                     <p className="text-gray-600 text-sm">
//                                         {course.experience || "0"} years of experience
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="space-y-3 text-sm flex-grow">
//                                 {infoList.map(([label, value], index) => (
//                                     <div
//                                         key={index}
//                                         className="flex bg-white px-4 py-2 rounded-full"
//                                     >
//                                         <p className="text-gray-500 w-40 truncate">{label}</p>
//                                         <p className="font-medium text-gray-800 flex-1 text-right truncate">
//                                             {value || "NA"}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//         {/* RIGHT SIDE – ALL DETAILS */}
//         <div className="lg:col-span-2 flex flex-col gap-6 h-full">

//           {/* course DETAILS */}
//           <div className="bg-white rounded-2xl p-6 border border-gray-300">
//             <h3 className="text-2xl font-semibold mb-4">course Details</h3>
//             <hr className="-mx-6 mb-4 text-gray-300" />

//             <div className="grid sm:grid-cols-2 gap-4">
//               {detailList.map(([label, value]) => (
//                 <div key={label}>
//                   <p className="text-gray-500 text-sm">{label}</p>
//                   <p className="font-medium">{value ?? "N/A"}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ABOUT US */}
//           <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
//             <h1 className="text-lg font-semibold mb-4">Description</h1>
//             <hr className="border-t border-gray-300 -mx-6 mb-4" />
//             <p className="text-sm text-gray-700 leading-relaxed">
//               {course.about_us || "No information available"}
//             </p>
//           </div>

//           {/* DESCRIPTION */}
//           <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
//             <h1 className="text-lg font-semibold mb-4">Mentor</h1>
//             <hr className="border-t border-gray-300 -mx-6 mb-4" />

//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={analyst.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//                   alt={analyst.name || "Analyst Profile"}
//                   className="w-20 h-20 rounded-full object-fil"
//                 />
//                 <div>
//                   <p className="font-semibold">{analyst.name}</p>
//                   <p className="text-gray-600 text-sm">{analyst.sebiNumber}</p>
//                 </div>
//               </div>
//               <button className="border border-gray-300 p-2 rounded-full hover:bg-gray-100 transition">
//                 View Profile
//               </button>
//             </div>

//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoList from "../admin/components/VideoList";

export default function CourseDataDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [course, setCourse] = useState(null);
  const [analyst, setAnalyst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/courses/data/${id}`);
        console.log("API Response:", res.data);
        console.log("Course data:", res.data.data?.course);
        console.log("Analyst data:", res.data.data?.analyst);
        
        // Set the course and analyst data
        setCourse(res.data.data?.course || null);
        setAnalyst(res.data.data?.analyst || null);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id, apiUrl]);

  // Fetch user data if needed (for VideoList)
  useEffect(() => {
    // You can fetch user data from localStorage or an API
    // This is just an example - adjust according to your auth system
    const fetchUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!course) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">No course data available.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Debug: Log course object to see what fields are available
  console.log("Course object in render:", course);

  const infoList = [
    ["Total Course Videos", course.total_videos || course.totalVideos || "N/A"],
    ["Video Duration", course.total_duration || course.totalDuration || "N/A"],
  ];

  const detailList = [
    ["Course Level", course.course_level || course.courseLevel || "N/A"],
    ["Language", course.course_language || course.languages || "N/A"],
    ["Access Validity", course.access_validity ? `${course.access_validity} month(s)` : "N/A"],
    ["Learners", course.learners || "N/A"],
    ["Course Price", course.course_price ? `₹ ${course.course_price}` : "N/A"],
    ["Discount", course.discount ? `${course.discount}%` : "N/A"],
  ];

  return (
    <section className="py-10 px-4 sm:px-8 lg:px-40 bg-[#F9FAFB] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* LEFT SIDE – IMAGE CARD */}
        <div className="bg-white rounded-2xl overflow-hidden md:col-span-1 flex flex-col h-full">
          <div className="w-full h-[450px] flex-shrink-0">
            <img
              src={
                course.uploded_image || course.uplodedImage
                  ? course.uploded_image || course.uplodedImage
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Course"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="p-5 -mt-6 rounded-t-2xl relative z-10 flex-grow flex flex-col"
            style={{
              background: "linear-gradient(to bottom, #CED3FF 10%, #FFFFFF 100%)",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-900">
                  {course.course_title || course.courseTitle || "Untitled Course"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {analyst?.experience || course.experience || "0"} years of experience
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm flex-grow">
              {infoList.map(([label, value], index) => (
                <div
                  key={index}
                  className="flex bg-white px-4 py-2 rounded-full"
                >
                  <p className="text-gray-500 w-40 truncate">{label}</p>
                  <p className="font-medium text-gray-800 flex-1 text-right truncate">
                    {value || "NA"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – ALL DETAILS */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">

          {/* COURSE DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-300">
            <h3 className="text-2xl font-semibold mb-4">Course Details</h3>
            <hr className="-mx-6 mb-4 text-gray-300" />

            <div className="grid sm:grid-cols-2 gap-4">
              {detailList.map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
            <h1 className="text-lg font-semibold mb-4">Description</h1>
            <hr className="border-t border-gray-300 -mx-6 mb-4" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {course.description || course.about_us || "No description available"}
            </p>
          </div>

          {/* MENTOR SECTION */}
          <div className="bg-white border border-gray-300 p-6 rounded-2xl flex-1">
            <h1 className="text-lg font-semibold mb-4">Mentor</h1>
            <hr className="border-t border-gray-300 -mx-6 mb-4" />

            {analyst ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={analyst.profile_image || analyst.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={analyst.name || "Analyst Profile"}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{analyst.name || "Unknown"}</p>
                    <p className="text-gray-600 text-sm">{analyst.sebi_number || analyst.sebiNumber || "N/A"}</p>
                  </div>
                </div>
                <button className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                  View Profile
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No mentor information available</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* VideoList Section */}
      <div className="mt-8 bg-white rounded-xl shadow p-8">
        <div className="border-b pb-6 border-gray-200 mb-8">
          <h3 className="text-2xl font-semibold">Course Overview</h3>
        </div>

        <VideoList 
          courseId={id} 
          userId={userData?.id} 
          API_URL={apiUrl}
          isUserAuthenticated={!!userData}
        />
      </div>
    </section>
  );
}