import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, SlidersHorizontal, Clock, Globe, Tag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiClock, FiGlobe, FiTag } from "react-icons/fi";

export default function AllCourses() {
    const tabs = ["All Courses", "My Courses"];
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const user = localStorage.getItem("user");

    // Fallback course images
    const fallbackImages = [
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f193?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    ];

    // Helper function to get image URL
    const getImageUrl = (course, index) => {
        const imageField = course?.uploded_image || course?.image || course?.thumbnail;
        
        if (!imageField) return fallbackImages[index % fallbackImages.length];
        
        if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
            return imageField;
        }
        
        if (imageField.startsWith('/')) {
            return `${apiUrl}${imageField}`;
        }
        
        return `${apiUrl}/${imageField}`;
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiUrl}/courses/allcourses`);
                
                if (res.data.success && Array.isArray(res.data.data)) {
                    setCourses(res.data.data);
                } else {
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
        course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.trading_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_language?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                    {/* Tabs */}
                    <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setActiveTab(index);
                                    if (index === 1 && !user) {
                                        navigate('/login');
                                    }
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-['Aileron_Black'] font-semibold transition-all duration-300 ${
                                    activeTab === index
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search + Filter */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm"
                            />
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 text-sm hover:border-gray-300 hover:text-gray-900 transition-all duration-300 shadow-sm">
                            <SlidersHorizontal size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: FiBookOpen, label: "Total Courses", value: courses.length },
                        { icon: FiTag, label: "Categories", value: [...new Set(courses.map(c => c.trading_category).filter(Boolean))].length || "N/A" },
                        { icon: FiGlobe, label: "Languages", value: [...new Set(courses.map(c => c.course_language).filter(Boolean))].length || "N/A" },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex justify-center mb-2">
                                <stat.icon className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-xl font-['Aileron_Black'] font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="relative inline-flex">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                        </div>
                        <p className="mt-4 text-gray-500 text-sm">Loading courses...</p>
                    </div>
                )}

                {/* Course Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCourses.length === 0 ? (
                            <div className="col-span-full text-center py-20">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                    <FiBookOpen className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900 mb-2">
                                    {searchTerm ? "No Courses Found" : "No Courses Available"}
                                </h3>
                                <p className="text-gray-500 text-sm max-w-md mx-auto">
                                    {searchTerm 
                                        ? `No courses matching "${searchTerm}". Try a different search term.`
                                        : "New courses will appear here soon."}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="mt-4 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredCourses.map((course, index) => {
                                const originalPrice = Number(course?.course_price) || 0;
                                const discount = Number(course?.discount) || 0;
                                const discountedPrice = discount > 0 
                                    ? originalPrice - (originalPrice * discount) / 100 
                                    : originalPrice;
                                const imageUrl = getImageUrl(course, index);
                                const fallbackImage = fallbackImages[index % fallbackImages.length];

                                return (
                                    <div
                                        key={course.id}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        className={`transform transition-all duration-500 ${
                                            hoveredIndex !== null && hoveredIndex !== index
                                                ? 'opacity-40 scale-[0.97]'
                                                : 'opacity-100 scale-100'
                                        }`}
                                    >
                                        <div className="group/card relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200 h-full flex flex-col shadow-sm">
                                            {/* Image */}
                                            <div className="relative p-3 pb-0 overflow-hidden">
                                                <img
                                                    src={imageUrl}
                                                    alt={course.course_title || "Course"}
                                                    className="w-full h-48 object-cover rounded-xl transition-transform duration-700 group-hover/card:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.src = fallbackImage;
                                                        e.currentTarget.onerror = null;
                                                    }}
                                                />
                                                
                                                {/* Discount Badge */}
                                                {discount > 0 && (
                                                    <div className="absolute top-6 right-6 bg-gray-900 text-white text-xs font-['Aileron_Black'] font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                        {discount}% OFF
                                                    </div>
                                                )}

                                                {/* Glass overlay on hover */}
                                                <div className="absolute inset-3 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-xl" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="text-base font-['Aileron_Black'] font-bold text-gray-900 leading-snug line-clamp-2 min-h-[3rem] mb-2 group-hover/card:text-green-700 transition-colors duration-300">
                                                    {course.course_title || "Untitled Course"}
                                                </h3>
                                                
                                                <p className="text-xs text-gray-500 mb-4">
                                                    By {course.analyst_name || "Expert Analyst"}
                                                </p>

                                                {/* Course Details */}
                                                <div className="space-y-2 mb-4 flex-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5 text-gray-500">
                                                            <FiClock className="w-3.5 h-3.5" />
                                                            <span>Access Validity</span>
                                                        </div>
                                                        <span className="font-['Aileron_Black'] font-semibold text-gray-700">
                                                            {course.access_validity || "0"} month(s)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5 text-gray-500">
                                                            <FiGlobe className="w-3.5 h-3.5" />
                                                            <span>Language</span>
                                                        </div>
                                                        <span className="font-['Aileron_Black'] font-semibold text-gray-700">
                                                            {course.course_language || "N/A"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5 text-gray-500">
                                                            <FiTag className="w-3.5 h-3.5" />
                                                            <span>Segment</span>
                                                        </div>
                                                        <span className="font-['Aileron_Black'] font-semibold text-gray-700">
                                                            {course.trading_category || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-gray-100 pt-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-lg font-['Aileron_Black'] font-bold text-gray-900">
                                                                ₹{Math.round(discountedPrice).toLocaleString()}
                                                            </span>
                                                            {discount > 0 && (
                                                                <span className="ml-2 text-xs text-gray-400 line-through">
                                                                    ₹{Math.round(originalPrice).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => navigate(`/courses/${course.id}`)}
                                                            className="group/btn flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-['Aileron_Black'] font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                                                        >
                                                            View Details
                                                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Search, SlidersHorizontal, ArrowRight, BookOpen,
//   Clock, Globe, Tag, ChevronDown, ChevronUp, Sparkles,
//   GraduationCap, Users, Star, X
// } from "lucide-react";

// export default function AllCourses() {
//   const tabs = ["All Courses", "My Courses"];
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [openFaq, setOpenFaq] = useState(null);
//   const [filterOpen, setFilterOpen] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();
//   const user = localStorage.getItem("user");

//   const fallbackImages = [
//     "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
//     "https://images.unsplash.com/photo-1590283603385-17ffb3a7f193?w=400&h=250&fit=crop",
//     "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=400&h=250&fit=crop",
//     "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
//   ];

//   const getImageUrl = (course, index) => {
//     const imageField = course?.uploded_image || course?.image || course?.thumbnail;
//     if (!imageField) return fallbackImages[index % fallbackImages.length];
//     if (imageField.startsWith("http://") || imageField.startsWith("https://")) return imageField;
//     if (imageField.startsWith("/")) return `${apiUrl}${imageField}`;
//     return `${apiUrl}/${imageField}`;
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${apiUrl}/courses/allcourses`);
//         if (res.data.success && Array.isArray(res.data.data)) {
//           setCourses(res.data.data);
//         } else {
//           setCourses([]);
//         }
//       } catch {
//         setCourses([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, [apiUrl]);

//   const categories = ["All", ...new Set(courses.map((c) => c.trading_category).filter(Boolean))];

//   const filteredCourses = courses.filter((course) => {
//     const matchSearch =
//       course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.trading_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.course_language?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchCategory =
//       selectedCategory === "All" || course.trading_category === selectedCategory;
//     return matchSearch && matchCategory;
//   });

//   const faqs = [
//     { q: "What courses are available on InvestBay?", a: "InvestBay offers courses focused on stock market fundamentals, technical analysis, options trading, and personal finance — all designed for Indian investors." },
//     { q: "Which course should I start with as a beginner?", a: "We recommend starting with a Fundamentals course to build a strong foundation before moving to advanced topics like derivatives or options trading." },
//     { q: "How long does each course take to complete?", a: "Most courses are designed to be completed in a weekend — typically 3–8 hours of video content with practical exercises included." },
//     { q: "Is there a refund policy?", a: "Yes, we offer a 7-day refund policy. If you're not satisfied, contact support within 7 days of purchase for a full refund." },
//     { q: "Can I access courses on mobile?", a: "Yes, InvestBay is fully mobile-friendly. You can learn on the go with a stable internet connection." },
//   ];

//   return (
//     <div className="min-h-screen bg-[#f7f7f3] font-sans">

//       {/* ── HERO ── */}
//       <section className="bg-white border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row items-center gap-10">
//           <div className="flex-1 max-w-xl">
//             <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
//               <Sparkles size={12} />
//               Courses on Investing
//             </div>
//             <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.08] mb-5"
//               style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}>
//               Learn investing<br />
//               <span className="text-green-600">the right way.</span>
//             </h1>
//             <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
//               Practical, no-fluff courses built for real investors. No boring theory — just concepts that actually work in the market.
//             </p>
//             <div className="flex items-center gap-6 text-sm text-gray-500">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                   <BookOpen size={14} className="text-green-700" />
//                 </div>
//                 <span><strong className="text-gray-900">{courses.length}+</strong> Courses</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
//                   <Users size={14} className="text-amber-700" />
//                 </div>
//                 <span><strong className="text-gray-900">10k+</strong> Learners</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                   <Star size={14} className="text-blue-700" />
//                 </div>
//                 <span><strong className="text-gray-900">4.8</strong> Rating</span>
//               </div>
//             </div>
//           </div>

//           {/* Hero illustration placeholder */}
//           <div className="flex-1 flex justify-center lg:justify-end">
//             <div className="relative w-72 h-64">
//               <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl" />
//               <div className="absolute top-6 left-6 right-6 bottom-6 bg-white rounded-2xl shadow-sm border border-green-100 flex items-center justify-center">
//                 <div className="text-center">
//                   <GraduationCap size={48} className="text-green-600 mx-auto mb-3" />
//                   <div className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
//                     Start Learning
//                   </div>
//                   <div className="text-sm text-gray-400 mt-1">Anytime, anywhere</div>
//                 </div>
//               </div>
//               {/* floating badge */}
//               <div className="absolute -top-3 -right-3 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
//                 New ✦
//               </div>
//               <div className="absolute -bottom-3 -left-3 bg-white border border-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
//                 🇮🇳 Made for India
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── MAIN CONTENT ── */}
//       <div id="all" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

//         {/* Tabs + Search */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
//             {tabs.map((tab, i) => (
//               <button
//                 key={i}
//                 onClick={() => {
//                   setActiveTab(i);
//                   if (i === 1 && !user) navigate("/login");
//                 }}
//                 className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
//                   activeTab === i
//                     ? "bg-gray-900 text-white"
//                     : "text-gray-400 hover:text-gray-700"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <div className="flex items-center gap-3 w-full sm:w-auto">
//             <div className="relative flex-1 sm:flex-none sm:w-72">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={() => setFilterOpen(!filterOpen)}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all shadow-sm ${
//                 filterOpen
//                   ? "bg-gray-900 text-white border-gray-900"
//                   : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
//               }`}
//             >
//               <SlidersHorizontal size={15} />
//               Filter
//             </button>
//           </div>
//         </div>

//         {/* Category chips (visible when filter open) */}
//         {filterOpen && (
//           <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
//             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider self-center mr-2">Category</span>
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
//                   selectedCategory === cat
//                     ? "bg-green-600 text-white border-green-600"
//                     : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Stats row */}
//         <div className="grid grid-cols-3 gap-4 mb-10">
//           {[
//             { icon: BookOpen, label: "Total Courses", value: courses.length, color: "text-green-600", bg: "bg-green-50" },
//             { icon: Tag, label: "Categories", value: categories.length - 1 || "—", color: "text-blue-600", bg: "bg-blue-50" },
//             { icon: Globe, label: "Languages", value: [...new Set(courses.map(c => c.course_language).filter(Boolean))].length || "—", color: "text-amber-600", bg: "bg-amber-50" },
//           ].map((s, i) => (
//             <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all">
//               <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
//                 <s.icon size={16} className={s.color} />
//               </div>
//               <div className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
//                 {s.value}
//               </div>
//               <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Section header */}
//         <div className="flex items-center gap-3 mb-6">
//           <div className="flex items-center gap-2">
//             <div className="w-1 h-6 bg-green-600 rounded-full" />
//             <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
//               {searchTerm || selectedCategory !== "All"
//                 ? `${filteredCourses.length} result${filteredCourses.length !== 1 ? "s" : ""} found`
//                 : "All Courses"}
//             </h2>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-24">
//             <div className="relative inline-flex mb-4">
//               <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
//               <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
//             </div>
//             <p className="text-gray-400 text-sm font-medium">Loading courses…</p>
//           </div>
//         )}

//         {/* Course Grid */}
//         {!loading && (
//           <>
//             {filteredCourses.length === 0 ? (
//               <div className="text-center py-24">
//                 <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
//                   <BookOpen className="w-10 h-10 text-gray-300" />
//                 </div>
//                 <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
//                   {searchTerm ? "No courses found" : "No courses yet"}
//                 </h3>
//                 <p className="text-gray-400 text-sm max-w-xs mx-auto mb-5">
//                   {searchTerm
//                     ? `No results for "${searchTerm}". Try something else.`
//                     : "New courses will appear here soon."}
//                 </p>
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm"
//                   >
//                     Clear search
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                 {filteredCourses.map((course, index) => {
//                   const original = Number(course?.course_price) || 0;
//                   const discount = Number(course?.discount) || 0;
//                   const final = discount > 0 ? original - (original * discount) / 100 : original;
//                   const imgUrl = getImageUrl(course, index);
//                   const fallback = fallbackImages[index % fallbackImages.length];
//                   const isFree = final === 0;

//                   return (
//                     <div
//                       key={course.id}
//                       className="group bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//                       onClick={() => navigate(`/courses/${course.id}`)}
//                     >
//                       {/* Thumbnail */}
//                       <div className="relative overflow-hidden">
//                         <img
//                           src={imgUrl}
//                           alt={course.course_title || "Course"}
//                           className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
//                           onError={(e) => { e.currentTarget.src = fallback; e.currentTarget.onerror = null; }}
//                         />
//                         {/* Overlays */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                         {discount > 0 && (
//                           <div className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
//                             {discount}% OFF
//                           </div>
//                         )}
//                         {isFree && (
//                           <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
//                             FREE
//                           </div>
//                         )}
//                         {/* Category pill */}
//                         {course.trading_category && (
//                           <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
//                             {course.trading_category}
//                           </div>
//                         )}
//                       </div>

//                       {/* Body */}
//                       <div className="p-4 flex flex-col flex-1">
//                         <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem] mb-1 group-hover:text-green-700 transition-colors">
//                           {course.course_title || "Untitled Course"}
//                         </h3>
//                         <p className="text-[11px] text-gray-400 mb-3 font-medium">
//                           By {course.analyst_name || "Expert Analyst"}
//                         </p>

//                         {/* Meta grid */}
//                         <div className="grid grid-cols-3 gap-1 mb-4 p-2 bg-gray-50 rounded-xl">
//                           <div className="text-center">
//                             <div className="flex justify-center mb-0.5">
//                               <Clock size={11} className="text-gray-400" />
//                             </div>
//                             <div className="text-[10px] font-bold text-gray-700">{course.access_validity || "—"}mo</div>
//                             <div className="text-[9px] text-gray-400">Access</div>
//                           </div>
//                           <div className="text-center border-x border-gray-200">
//                             <div className="flex justify-center mb-0.5">
//                               <Globe size={11} className="text-gray-400" />
//                             </div>
//                             <div className="text-[10px] font-bold text-gray-700 truncate px-1">{course.course_language || "—"}</div>
//                             <div className="text-[9px] text-gray-400">Lang</div>
//                           </div>
//                           <div className="text-center">
//                             <div className="flex justify-center mb-0.5">
//                               <Tag size={11} className="text-gray-400" />
//                             </div>
//                             <div className="text-[10px] font-bold text-gray-700 truncate px-1">{course.trading_category || "—"}</div>
//                             <div className="text-[9px] text-gray-400">Segment</div>
//                           </div>
//                         </div>

//                         {/* Footer */}
//                         <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
//                           <div>
//                             {isFree ? (
//                               <span className="text-base font-black text-green-600" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>Free</span>
//                             ) : (
//                               <>
//                                 <span className="text-base font-black text-gray-900" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
//                                   ₹{Math.round(final).toLocaleString("en-IN")}
//                                 </span>
//                                 {discount > 0 && (
//                                   <span className="ml-1.5 text-[11px] text-gray-400 line-through">
//                                     ₹{Math.round(original).toLocaleString("en-IN")}
//                                   </span>
//                                 )}
//                               </>
//                             )}
//                           </div>
//                           <button
//                             onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-lg hover:bg-green-700 transition-colors group/btn"
//                           >
//                             View
//                             <ArrowRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}

//         {/* ── FAQ ── */}
//         <div className="mt-20">
//           <div className="text-center mb-10">
//             <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
//               FAQ
//             </div>
//             <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
//               Need answers?<br />
//               <span className="text-green-600">Find them here.</span>
//             </h2>
//           </div>

//           <div className="max-w-2xl mx-auto space-y-3">
//             {faqs.map((faq, i) => (
//               <div
//                 key={i}
//                 className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
//                   openFaq === i ? "border-green-200 shadow-sm" : "border-gray-100"
//                 }`}
//               >
//                 <button
//                   onClick={() => setOpenFaq(openFaq === i ? null : i)}
//                   className="w-full flex items-center justify-between px-5 py-4 text-left"
//                 >
//                   <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
//                   {openFaq === i ? (
//                     <ChevronUp size={16} className="text-green-600 flex-shrink-0" />
//                   ) : (
//                     <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
//                   )}
//                 </button>
//                 {openFaq === i && (
//                   <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
//                     {faq.a}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }