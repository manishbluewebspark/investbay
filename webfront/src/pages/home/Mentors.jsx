import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArrowRight, FiUsers, FiTrendingUp } from "react-icons/fi";
import MentorCard from "../../components/MentorCard";

export default function Mentors() {
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const user = localStorage.getItem("user");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchAnalysts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data?.success) setAnalysts(res.data.data || []);
      else setError("Failed to fetch mentors");
    } catch (err) {
      console.error("Error fetching analysts:", err);
      setError("Server error");
    } finally { setLoading(false); }
  }, [apiUrl]);

  useEffect(() => { fetchAnalysts(); }, [fetchAnalysts]);

  const handleViewAll = () => {
    if (!user) {
      navigate("/login");
      toast.warn("Please login first to view mentors", {
        position: "top-center", autoClose: 3000,
        style: { background: "#1f2937", color: "#fff", padding: "16px", borderRadius: "10px", fontWeight: 600 },
      });
    } else {
      navigate("/mentors");
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div className="max-w-xl">
            <p
              className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3"
              style={{ fontFamily: "'Aileron', 'Arial', sans-serif" }}
            >
              Featured Mentors
            </p>
            <h2
              className="text-[clamp(28px,4vw,46px)] font-black leading-[1.1] tracking-tight text-black mb-4"
              style={{ fontFamily: "'Aileron Black', 'Aileron', 'Arial Black', sans-serif" }}
            >
              Advisors trusted by thousands
            </h2>
            <p
              className="text-[15px] text-gray-500 leading-relaxed"
              style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
            >
              Connect with SEBI-registered research analysts who have proven
              track records and verified performance histories.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="group self-start lg:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 cursor-pointer flex-shrink-0"
            style={{ fontFamily: "'Aileron', sans-serif" }}
            disabled={loading}
          >
            View All Advisors
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20 border border-gray-100 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-gray-50 flex items-center justify-center">
              <FiTrendingUp className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">{error}</p>
            <p className="text-gray-400 text-sm mb-5">Unable to load mentors at this moment</p>
            <button
              onClick={fetchAnalysts}
              className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Mentors Grid */}
        {!loading && !error && (
          <>
            {analysts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {analysts.slice(0, 4).map((analyst, index) => (
                  <div
                    key={analyst.id || index}
                    className={`transition-all duration-300 ${hoveredIndex !== null && hoveredIndex !== index
                        ? "opacity-40 scale-[0.98]"
                        : "opacity-100 scale-100"
                      }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <MentorCard analyst={analyst} navigate={navigate} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-gray-100 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-50 flex items-center justify-center">
                  <FiUsers className="text-2xl text-gray-300" />
                </div>
                <h3
                  className="text-lg font-black text-black mb-2"
                  style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                >
                  No Mentors Available
                </h3>
                <p className="text-gray-400 text-sm">Verified research analysts will appear here soon.</p>
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {analysts.length > 4 && user && (
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate("/mentors")}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:border-gray-900 hover:text-black transition-all duration-200"
            >
              Explore All {analysts.length} Mentors
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}