import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { FiArrowRight, FiBookOpen, FiClock, FiBarChart2, FiUsers } from "react-icons/fi";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sectionRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setVisible(true); 
          observer.disconnect(); 
        } 
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/courses/allcourses`);
        if (res.data?.success && Array.isArray(res.data?.data)) setCourses(res.data.data);
        else setCourses([]);
      } catch { 
        setCourses([]); 
      } finally { 
        setLoading(false); 
      }
    };
    if (apiUrl) fetchCourses();
  }, [apiUrl]);

  const featuredCourses = useMemo(() => 
    Array.isArray(courses) ? courses.slice(0, 4) : [], 
    [courses]
  );

  const handleProtectedNavigation = (path) => {
    if (!user) { 
      navigate("/login"); 
      return; 
    }
    navigate(path);
  };

  // Helper function to get image URL
  const getImageUrl = (course) => {
    const imageField = course?.uploded_image || course?.image || course?.thumbnail || course?.course_image;
    
    if (!imageField) return null;
    
    // If it's already a full URL, return it
    if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
      return imageField;
    }
    
    // If it's a relative path, prepend the API URL
    if (imageField.startsWith('/')) {
      return `${apiUrl}${imageField}`;
    }
    
    // Otherwise, assume it needs the API URL with a slash
    return `${apiUrl}/${imageField}`;
  };

  // Fallback images array for variety
  const fallbackImages = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop", // Trading/Finance
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f193?w=600&h=400&fit=crop", // Stock market
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&h=400&fit=crop", // Analysis
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", // Business
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 px-6 bg-[#060b10] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(43,182,115,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(43,182,115,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black 40%, transparent 70%)',
          }}
        />
        
        {/* Glow Orbs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-emerald-600/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">
                Learn & Grow
              </span>
            </div>

            {/* Heading */}
            <h2 
              className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] transition-all duration-700 delay-100 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <span className="text-[#f0f4f8]">Featured </span>
              <span className="relative">
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Courses
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400/40 via-emerald-300/20 to-transparent rounded-full blur-[2px]" />
              </span>
            </h2>

            <p 
              className={`text-lg text-slate-400/80 max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Master trading with expert-led courses designed for every skill level. Start your journey today.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleProtectedNavigation("/courses")}
            className={`group relative inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] text-slate-300 font-semibold rounded-xl overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 active:translate-y-0 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="relative z-10">Explore All Courses</span>
            <FiArrowRight className="relative z-10 text-lg transition-all duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl overflow-hidden">
                <div className="h-48 bg-white/[0.03] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/[0.05] rounded-lg w-3/4 animate-pulse" />
                  <div className="h-4 bg-white/[0.04] rounded-lg w-1/2 animate-pulse" />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-10 bg-white/[0.04] rounded-lg animate-pulse" />
                    ))}
                  </div>
                  <div className="h-6 bg-white/[0.05] rounded-lg w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Cards */}
        {!loading && featuredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course, index) => {
              const originalPrice = Number(course?.course_price) || 0;
              const discount = Number(course?.discount) || 0;
              const discountedPrice = discount > 0 
                ? originalPrice - (originalPrice * discount) / 100 
                : originalPrice;
              
              // Get image source
              const imageUrl = getImageUrl(course);
              const fallbackImage = fallbackImages[index % fallbackImages.length];

              return (
                <div
                  key={course.id}
                  className={`transform transition-all duration-500 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: visible ? `${400 + index * 100}ms` : "0s" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    onClick={() => handleProtectedNavigation(`/courses/${course.id}`)}
                    className={`group/card relative bg-white/[0.02] backdrop-blur-sm border rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? 'opacity-40 scale-[0.97] blur-[1px] border-white/[0.04]'
                        : 'opacity-100 scale-100 blur-0 border-white/[0.06] hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5'
                    }`}
                  >
                    {/* Top glow line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    {/* Image */}
                    <div className="relative p-3 pb-0 overflow-hidden">
                      <img
                        src={imageUrl || fallbackImage}
                        alt={course?.course_title || "Course"}
                        className="w-full h-48 object-cover rounded-xl transition-transform duration-700 group-hover/card:scale-105"
                        onError={(e) => { 
                          // If image fails to load, use fallback
                          e.currentTarget.src = fallbackImage;
                          // Prevent infinite loop if fallback also fails
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
                    <div className="p-5">
                      <h3 className="text-base font-bold text-[#f0f4f8] leading-snug line-clamp-2 min-h-[3rem] mb-2 group-hover/card:text-emerald-200 transition-colors duration-300">
                        {course?.course_title || "Untitled Course"}
                      </h3>
                      
                      <p className="text-xs text-slate-500 mb-4">
                        By Disha Sharma
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 border-y border-white/[0.05] mb-4">
                        {[
                          { label: "Level", value: course?.course_level || "All" },
                          { label: "Category", value: course?.trading_category || "Options" },
                          { label: "Language", value: course?.course_language || "English" },
                        ].map((stat, idx) => (
                          <div 
                            key={idx} 
                            className={`py-3 text-center ${
                              idx < 2 ? 'border-r border-white/[0.05]' : ''
                            }`}
                          >
                            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                              {stat.label}
                            </div>
                            <div className="text-xs font-semibold text-slate-400 capitalize">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-extrabold text-emerald-400">
                          ₹{Math.round(discountedPrice).toLocaleString()}
                        </span>
                        {discount > 0 && (
                          <span className="text-sm text-slate-600 line-through">
                            ₹{Math.round(originalPrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && featuredCourses.length === 0 && (
          <div className={`text-center py-24 bg-white/[0.01] backdrop-blur-sm border border-white/[0.04] rounded-3xl transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <FiBookOpen className="text-3xl text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#f0f4f8] mb-3">
              No Courses Available
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
              Exciting new courses are being crafted. Check back soon or explore our platform.
            </p>
            <button
              onClick={() => handleProtectedNavigation("/courses")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-[#050a0e] font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 group"
            >
              Browse Platform
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
}