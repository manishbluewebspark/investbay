import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import { Star } from "lucide-react";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
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
      } catch { setCourses([]); }
      finally { setLoading(false); }
    };
    if (apiUrl) fetchCourses();
  }, [apiUrl]);

  const featuredCourses = useMemo(() =>
    Array.isArray(courses) ? courses.slice(0, 6) : [], [courses]);

  const handleProtectedNavigation = (path) => {
    if (!user) { navigate("/login"); return; }
    navigate(path);
  };

  const getImageUrl = (course) => {
    const imageField = course?.uploded_image || course?.image || course?.thumbnail || course?.course_image;
    if (!imageField) return null;
    if (imageField.startsWith("http://") || imageField.startsWith("https://")) return imageField;
    if (imageField.startsWith("/")) return `${apiUrl}${imageField}`;
    return `${apiUrl}/${imageField}`;
  };

  const fallbackImages = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f193?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&h=400&fit=crop",
  ];

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p
              className={`text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ fontFamily: "'Aileron', 'Arial', sans-serif" }}
            >
              Learn & Grow
            </p>
            <h2
              className={`text-[clamp(28px,4vw,46px)] font-black leading-[1.1] tracking-tight text-black mb-4 transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
            >
              Featured Courses
            </h2>
            <p
              className={`text-[15px] text-gray-500 leading-relaxed transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
            >
              Master trading with expert-led courses designed for every skill level.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            {/* Scroll arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll(-1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-black transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => scroll(1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-black transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <button
              onClick={() => handleProtectedNavigation("/courses")}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:border-gray-900 hover:text-black transition-all duration-200 cursor-pointer flex-shrink-0"
              style={{ fontFamily: "'Aileron', sans-serif" }}
            >
              View All
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Loading Skeleton — single row scroll */}
        {loading && (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex-shrink-0 w-[280px]">
                <div className="h-40 bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="h-5 bg-gray-100 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Cards — horizontal scroll row */}
        {!loading && featuredCourses.length > 0 && (
          <div
            ref={scrollRef}
            className={`flex gap-5 overflow-x-auto pb-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`
              .courses-scroll::-webkit-scrollbar { display: none; }
            `}</style>

            {featuredCourses.map((course, index) => {
              const originalPrice = Number(course?.course_price) || 0;
              const discount = Number(course?.discount) || 0;
              const discountedPrice = discount > 0
                ? originalPrice - (originalPrice * discount) / 100
                : originalPrice;
              const imageUrl = getImageUrl(course);
              const fallbackImage = fallbackImages[index % fallbackImages.length];

              return (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-[280px]"
                  style={{ transitionDelay: visible ? `${index * 60}ms` : "0s" }}
                >
                  <div
                    onClick={() => handleProtectedNavigation(`/courses/${course.id}`)}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-200 h-full flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden flex-shrink-0">
                      <img
                        src={imageUrl || fallbackImage}
                        alt={course?.course_title || "Course"}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = fallbackImage; e.currentTarget.onerror = null; }}
                      />
                      {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                          {discount}% OFF
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Title */}
                      <h3
                        className="text-[13.5px] font-black text-black leading-snug line-clamp-2 min-h-[2.4rem] mb-1.5 group-hover:text-gray-700 transition-colors"
                        style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                      >
                        {course?.course_title || "Untitled Course"}
                      </h3>

                      {/* Author */}
                      <p
                        className="text-[11px] text-gray-400 mb-3"
                        style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
                      >
                        By {course?.author_name || "Expert Team"}
                      </p>

                      {/* Stats — joined cells */}
                      <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden mb-3">
                        {[
                          { label: "Level", value: course?.course_level || "All" },
                          { label: "Category", value: course?.trading_category || "Options" },
                          { label: "Duration", value: course?.duration || "4 wks" },
                        ].map((stat, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 group-hover:bg-white transition-colors duration-200 px-2 py-2 text-center"
                          >
                            <div className="text-[9px] uppercase tracking-[0.1em] text-gray-400 mb-0.5">{stat.label}</div>
                            <div
                              className="text-[10px] font-semibold text-gray-700 capitalize truncate"
                              style={{ fontFamily: "'Aileron', sans-serif" }}
                            >
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-0.5 mb-3">
                        {[1, 2, 3, 4].map((s) => (
                          <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                        <Star className="w-3 h-3 text-gray-200 fill-gray-200" />
                        <span className="text-[11px] text-gray-400 ml-1">(4.0)</span>
                      </div>

                      {/* Price + CTA — pushed to bottom */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className="text-[17px] font-black text-black"
                            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                          >
                            ₹{Math.round(discountedPrice).toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{Math.round(originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          className="px-3 py-1.5 bg-black text-white text-[11px] font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                          style={{ fontFamily: "'Aileron', sans-serif" }}
                          onClick={(e) => { e.stopPropagation(); handleProtectedNavigation(`/courses/${course.id}`); }}
                        >
                          Enroll Now
                        </button>
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
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
            <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gray-50 flex items-center justify-center">
              <FiBookOpen className="text-xl text-gray-300" />
            </div>
            <h3
              className="text-xl font-black text-black mb-2"
              style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
            >
              No Courses Available
            </h3>
            <p
              className="text-gray-400 text-[14px] mb-6 max-w-sm mx-auto"
              style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
            >
              Exciting new courses are being crafted. Check back soon.
            </p>
            <button
              onClick={() => handleProtectedNavigation("/courses")}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors group"
            >
              Browse Platform
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}