// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Search, SlidersHorizontal } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function AllCourses() {
//     const tabs = ["All Courses", "My Courses"];
//     const [activeTab, setActiveTab] = useState(0);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [courses, setCourses] = useState([]);
     
//     const [loading, setLoading] = useState(true);

//     const apiUrl = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axios.get(`${apiUrl}/courses/allcourses`);
//                 console.log("Courses API response:", res.data); // optional debug
//                 setCourses(res.data.data || []);

//                 console.log(res.data.data,'1000')

//             } catch (error) {
//                 console.error("Error fetching courses:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCourses();
//     }, [apiUrl]);

   

//     const filteredCourses = courses.filter((course) =>
//         course.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <section className="py-16 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat">
//             {/* Tabs + Search + Filter */}
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 lg:px-40">
//                 {/* Tabs */}
//                 <div className="flex items-center bg-black rounded-full px-2 py-1">
//                     {tabs.map((tab, index) => (
//                         <button
//                             key={index}
//                             onClick={() => setActiveTab(index)}
//                             className={`px-4 py-1.5 rounded-full text-md transition-all duration-300 ${activeTab === index
//                                     ? "bg-white text-black font-medium"
//                                     : "text-gray-300 hover:text-white"
//                                 }`}
//                         >
//                             {tab}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Search + Filter */}
//                 <div className="flex items-center gap-3 w-full sm:w-auto">
//                     <div className="relative w-full sm:w-64">
//                         <Search
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                             size={18}
//                         />
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-1 focus:ring-gray-300 outline-none text-md bg-white"
//                         />
//                     </div>

//                     <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-md shadow-sm hover:bg-gray-100 transition">
//                         <SlidersHorizontal size={16} />
//                         Filter
//                     </button>
//                 </div>
//             </div>

//             {/* Course Cards */}
//             {loading ? (
//                 <p className="text-center text-gray-500">Loading courses...</p>
//             ) : (
//                 <div className="max-w-full lg:px-40 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {filteredCourses.length === 0 ? (
//                         <p className="text-center col-span-full text-gray-500">
//                             No courses found
//                         </p>
//                     ) : (
//                         filteredCourses.map((course) => (
//                             <div
//                                 key={course.id}
//                                 className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col justify-between"
//                             >
//                                 <img
//                                     src={course.uplodedImage}
//                                     alt={course.courseTitle}
//                                     className="rounded-xl w-full h-48 mb-4"
//                                 />

//                                 <div className="text-left space-y-2 flex-1 flex flex-col justify-between">
//                                     <div>
//                                         <h3 className="font-semibold text-lg">{course.courseTitle}</h3>
//                                         <p className="text-gray-500 text-md">By User ID: {course.userId}</p>

//                                         <div className="w-full my-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>

//                                         <div className="flex justify-between text-md">
//                                             <span className="text-gray-600">Access Validity</span>
//                                             <span className="font-medium">{course.accessValidity} month(s)</span>
//                                         </div>
//                                         <div className="flex justify-between text-md">
//                                             <span className="text-gray-600">Language</span>
//                                             <span className="font-medium">{course.courseLanguage}</span>
//                                         </div>
//                                         <div className="flex justify-between text-md">
//                                             <span className="text-gray-600">Segment</span>
//                                             <span className="font-medium">{course.tradingCategory}</span>
//                                         </div>

//                                         <div className="w-full my-3 h-[1.5px] bg-gradient-to-l from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>
//                                     </div>

//                                     <div className="flex justify-between items-center mt-2">
//                                         <p className="text-md">
//                                             Incl taxes <br />
//                                             <span className="text-[#00BFA6] text-xl">{course.coursePrice}</span>
//                                         </p>
//                                         <button
//                                             onClick={() => navigate(`/courses/${course.id}`)}
//                                             className="border rounded-xl px-6 py-2 hover:bg-black hover:text-white transition"
//                                         >
//                                             View Details
//                                         </button>

//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             )}
//         </section>
//     );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllCourses() {
    const tabs = ["All Courses", "My Courses"];
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiUrl}/courses/allcourses`);
                console.log("Courses API response:", res.data);
                
                // FIX: Access the data array from the response
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

    const filteredCourses = Array.isArray(courses) ? courses.filter((course) =>
        course.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <section className="py-16 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat">
            {/* Tabs + Search + Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 lg:px-40">
                {/* Tabs */}
                <div className="flex items-center bg-black rounded-full px-2 py-1">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`px-4 py-1.5 rounded-full text-md transition-all duration-300 ${
                                activeTab === index
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-1 focus:ring-gray-300 outline-none text-md bg-white"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-md shadow-sm hover:bg-gray-100 transition">
                        <SlidersHorizontal size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Course Cards */}
            {loading ? (
                <p className="text-center text-gray-500">Loading courses...</p>
            ) : (
                <div className="max-w-full lg:px-40 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {!Array.isArray(filteredCourses) || filteredCourses.length === 0 ? (
                        <p className="text-center col-span-full text-gray-500">
                            No courses found
                        </p>
                    ) : (
                        filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col justify-between"
                            >
                                <img
                                    src={course.uploded_image || "/placeholder-image.jpg"}
                                    alt={course.course_title || "Course"}
                                    className="rounded-xl w-full h-48 mb-4 object-cover"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-image.jpg";
                                    }}
                                />

                                <div className="text-left space-y-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {course.course_title || "Untitled Course"}
                                        </h3>
                                        <p className="text-gray-500 text-md">
                                            By User ID: {course.user_id}
                                        </p>

                                        <div className="w-full my-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>

                                        <div className="flex justify-between text-md">
                                            <span className="text-gray-600">Access Validity</span>
                                            <span className="font-medium">
                                                {course.access_validity || "0"} month(s)
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-md">
                                            <span className="text-gray-600">Language</span>
                                            <span className="font-medium">
                                                {course.course_language || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-md">
                                            <span className="text-gray-600">Segment</span>
                                            <span className="font-medium">
                                                {course.trading_category || "N/A"}
                                            </span>
                                        </div>

                                        <div className="w-full my-3 h-[1.5px] bg-gradient-to-l from-gray-400 via-gray-200 to-gray-50 rounded-full"></div>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-md">
                                            Incl taxes <br />
                                            <span className="text-[#00BFA6] text-xl">
                                                ₹{course.course_price || "0.00"}
                                            </span>
                                        </p>
                                        <button
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                            className="border rounded-xl px-6 py-2 hover:bg-black hover:text-white transition"
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
    );
}