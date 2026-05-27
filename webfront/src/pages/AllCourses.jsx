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
        <section className="min-h-screen bg-[#060b10] py-10 px-4 sm:px-6 lg:px-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div 
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '64px 64px',
                        maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
                    }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                    {/* Tabs */}
                    <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-full p-1">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setActiveTab(index);
                                    if (index === 1 && !user) {
                                        navigate('/login');
                                    }
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeTab === index
                                        ? "bg-emerald-500 text-black"
                                        : "text-slate-400 hover:text-slate-200"
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
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 text-sm"
                            />
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 text-sm hover:border-white/[0.1] hover:text-slate-300 transition-all duration-300">
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
                        <div key={idx} className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-4 text-center group hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-300">
                            <div className="flex justify-center mb-2">
                                <stat.icon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-xl font-bold text-[#f0f4f8]">{stat.value}</div>
                            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="relative inline-flex">
                            <div className="w-12 h-12 rounded-full border-2 border-white/[0.06]" />
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                        </div>
                        <p className="mt-4 text-slate-400 text-sm">Loading courses...</p>
                    </div>
                )}

                {/* Course Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCourses.length === 0 ? (
                            <div className="col-span-full text-center py-20">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                                    <FiBookOpen className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-[#f0f4f8] mb-2">
                                    {searchTerm ? "No Courses Found" : "No Courses Available"}
                                </h3>
                                <p className="text-slate-400 text-sm max-w-md mx-auto">
                                    {searchTerm 
                                        ? `No courses matching "${searchTerm}". Try a different search term.`
                                        : "New courses will appear here soon."}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="mt-4 px-6 py-2.5 bg-white/[0.03] border border-white/[0.08] text-slate-300 font-semibold rounded-xl hover:bg-white/[0.05] transition-colors"
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
                                        className={`transform transition-all duration-500 hover:-translate-y-2 ${
                                            hoveredIndex !== null && hoveredIndex !== index
                                                ? 'opacity-40 scale-[0.97] blur-[1px]'
                                                : 'opacity-100 scale-100 blur-0'
                                        }`}
                                    >
                                        <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 h-full flex flex-col">
                                            {/* Top glow line */}
                                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10" />

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
                                                    <div className="absolute top-6 right-6 backdrop-blur-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/10">
                                                        {discount}% OFF
                                                    </div>
                                                )}

                                                {/* Glass overlay on hover */}
                                                <div className="absolute inset-3 bg-gradient-to-t from-[#060b10]/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-xl" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="text-base font-bold text-[#f0f4f8] leading-snug line-clamp-2 min-h-[3rem] mb-2 group-hover/card:text-emerald-200 transition-colors duration-300">
                                                    {course.course_title || "Untitled Course"}
                                                </h3>
                                                
                                                <p className="text-xs text-slate-500 mb-4">
                                                    By {course.analyst_name || "Expert Analyst"}
                                                </p>

                                                {/* Course Details */}
                                                <div className="space-y-2 mb-4 flex-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <FiClock className="w-3.5 h-3.5" />
                                                            <span>Access Validity</span>
                                                        </div>
                                                        <span className="font-semibold text-slate-300">
                                                            {course.access_validity || "0"} month(s)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <FiGlobe className="w-3.5 h-3.5" />
                                                            <span>Language</span>
                                                        </div>
                                                        <span className="font-semibold text-slate-300">
                                                            {course.course_language || "N/A"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <FiTag className="w-3.5 h-3.5" />
                                                            <span>Segment</span>
                                                        </div>
                                                        <span className="font-semibold text-slate-300">
                                                            {course.trading_category || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-white/[0.05] pt-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-lg font-bold text-emerald-400">
                                                                ₹{Math.round(discountedPrice).toLocaleString()}
                                                            </span>
                                                            {discount > 0 && (
                                                                <span className="ml-2 text-xs text-slate-600 line-through">
                                                                    ₹{Math.round(originalPrice).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => navigate(`/courses/${course.id}`)}
                                                            className="group/btn flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-xs font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
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