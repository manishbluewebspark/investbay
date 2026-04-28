import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/courses/allcourses`);

        if (res.data?.success && Array.isArray(res.data?.data)) {
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

    if (apiUrl) {
      fetchCourses();
    }
  }, [apiUrl]);

  const featuredCourses = useMemo(() => {
    return Array.isArray(courses) ? courses.slice(0, 4) : [];
  }, [courses]);

  const handleProtectedNavigation = (path) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  if (loading) {
    return (
      <section className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2bb673]">
                Courses
              </p>
              <h2 className="text-3xl font-bold text-[#171717] sm:text-4xl">
                Featured Courses
              </h2>
            </div>

            <button
              type="button"
              onClick={() => handleProtectedNavigation("/courses")}
              className="hidden text-md font-medium text-[#171717] transition hover:text-[#2bb673] sm:inline-flex"
            >
              See all Courses →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[18px] border border-[#ececec] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="h-[170px] animate-pulse bg-[#e9ecef]" />
                <div className="p-4">
                  <div className="mb-3 h-5 w-4/5 animate-pulse rounded bg-[#e9ecef]" />
                  <div className="mb-4 h-4 w-2/5 animate-pulse rounded bg-[#e9ecef]" />
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className="h-8 animate-pulse rounded bg-[#e9ecef]" />
                    <div className="h-8 animate-pulse rounded bg-[#e9ecef]" />
                    <div className="h-8 animate-pulse rounded bg-[#e9ecef]" />
                  </div>
                  <div className="h-5 w-1/3 animate-pulse rounded bg-[#e9ecef]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-md uppercase text-[#2bb673]">
              Courses
            </p>
            <h2 className="text-3xl font-bold leading-tight text-[#171717] sm:text-4xl">
              Featured Courses
            </h2>
          </div>

          <button
            type="button"
            onClick={() => handleProtectedNavigation("/courses")}
            className="inline-flex items-center text-md font-medium text-[#171717] transition hover:text-[#2bb673]"
          >
            See all Courses <span className="ml-2">→</span>
          </button>
        </div>

        {featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredCourses.map((course) => {
              const originalPrice = Number(course?.course_price) || 0;
              const discount = Number(course?.discount) || 0;
              const discountedPrice =
                discount > 0
                  ? originalPrice - (originalPrice * discount) / 100
                  : originalPrice;

              return (
                <div
                  key={course.id}
                  className="group overflow-hidden rounded-[18px] border border-[#ececec] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] cursor-pointer"
                  onClick={() => handleProtectedNavigation(`/courses/${course.id}`)}
                >
                  <div className="relative overflow-hidden p-3 pb-0">
                    <img
                      src={
                        course?.uploded_image ||
                        "https://via.placeholder.com/600x400/e9ecef/555555?text=Course+Image"
                      }
                      alt={course?.course_title || "Course"}
                      className="h-[170px] w-full rounded-[14px] object-cover transition duration-300 group-hover:scale-[1.03]"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/600x400/e9ecef/555555?text=Course+Image";
                      }}
                    />

                    {discount > 0 && (
                      <span className="absolute right-6 top-6 rounded-full bg-[#20c997] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-[52px] text-[18px] font-semibold leading-[1.4] text-[#171717]">
                      {course?.course_title || "Untitled Course"}
                    </h3>

                    <p className="mt-1 text-[12px] text-[#8a8a8a]">
                      By Disha Sharma
                    </p>

                    <div className="mt-4 grid grid-cols-3 border-y border-[#f1f1f1]">
                      <div className="py-3 text-center">
                        <p className="text-[11px] text-[#9b9b9b]">Level</p>
                        <p className="mt-1 truncate text-[12px] font-medium text-[#444] capitalize">
                          {course?.course_level || "All"}
                        </p>
                      </div>

                      <div className="border-x border-[#f1f1f1] py-3 text-center">
                        <p className="text-[11px] text-[#9b9b9b]">Category</p>
                        <p className="mt-1 truncate text-[12px] font-medium text-[#444] capitalize">
                          {course?.trading_category || "Options"}
                        </p>
                      </div>

                      <div className="py-3 text-center">
                        <p className="text-[11px] text-[#9b9b9b]">Language</p>
                        <p className="mt-1 truncate text-[12px] font-medium text-[#444] capitalize">
                          {course?.course_language || "English"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[20px] font-bold text-[#20c997]">
                          ₹{Math.round(discountedPrice)}
                        </span>

                        {discount > 0 && (
                          <span className="text-[12px] text-[#b3b3b3] line-through">
                            ₹{Math.round(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[18px] border border-[#ececec] bg-white px-6 py-14 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <p className="text-md text-[#666]">No courses available at the moment.</p>
            <button
              type="button"
              onClick={() => handleProtectedNavigation("/courses")}
              className="mt-4 inline-flex rounded-full bg-[#171717] px-6 py-3 text-md font-medium text-white transition hover:bg-[#2bb673]"
            >
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </section>
  );
}