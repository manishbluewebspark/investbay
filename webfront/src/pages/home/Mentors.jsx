import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArrowRight, FiUsers, FiAward, FiShield } from "react-icons/fi";
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

  const handleViewAll = () => {
    if (!user) {
      navigate("/login");
      toast.warn("Please login first to view mentors", {
        position: "top-center",
        autoClose: 3000,
        style: {
          background: "linear-gradient(135deg, #00e676, #00c853)",
          color: "#050a0e",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: 600,
        },
      });
    } else {
      navigate("/mentors");
    }
  };

  const stats = [
    { icon: FiUsers, value: "200+", label: "SEBI Registered" },
    { icon: FiAward, value: "94%", label: "Success Rate" },
    { icon: FiShield, value: "50K+", label: "Active Users" },
  ];

  return (
    <section className="relative py-24 lg:py-32 px-6 bg-[#060b10] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black 40%, transparent 70%)',
          }}
        />
        
        {/* Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-emerald-600/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">
                Featured Mentors
              </span>
            </div>

            {/* Heading with gradient shine */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15]">
              <span className="text-[#f0f4f8]">Advisors </span>
              <span className="relative">
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  trusted by thousands
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400/40 via-emerald-300/20 to-transparent rounded-full blur-[2px]" />
              </span>
            </h2>

            <p className="text-lg text-slate-400/80 max-w-2xl leading-relaxed">
              Connect with SEBI-registered research analysts who have proven track records and verified performance histories.
            </p>
          </div>

          {/* Stats & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Mini Stats */}
            <div className="flex items-center gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center group cursor-default">
                  <div className="text-2xl font-bold text-[#f0f4f8] group-hover:text-emerald-400 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-white/[0.08]" />

            {/* View All Button */}
            <button
              onClick={handleViewAll}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-[#050a0e] font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <span className="relative z-10">View All Advisors</span>
              <FiArrowRight className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-6 space-y-4">
                <div className="h-48 bg-white/[0.03] rounded-xl animate-pulse" />
                <div className="space-y-3">
                  <div className="h-5 bg-white/[0.05] rounded-lg w-3/4 animate-pulse" />
                  <div className="h-4 bg-white/[0.04] rounded-lg w-1/2 animate-pulse" />
                  <div className="flex gap-2 mt-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-8 w-16 bg-white/[0.04] rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-24 bg-white/[0.01] backdrop-blur-sm border border-white/[0.04] rounded-3xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-red-400 text-lg font-medium mb-2">{error}</p>
            <p className="text-slate-500 text-sm mb-6">Unable to load mentors at this moment</p>
            <button
              onClick={fetchAnalysts}
              className="px-8 py-3 bg-emerald-500 text-[#050a0e] font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Mentors Grid */}
        {!loading && !error && (
          <>
            {analysts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {analysts.slice(0, 4).map((analyst, index) => (
                  <div
                    key={analyst.id || index}
                    className="transform transition-all duration-500 hover:-translate-y-2"
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className={`transition-all duration-500 ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? 'opacity-40 scale-[0.97] blur-[1px]'
                        : 'opacity-100 scale-100 blur-0'
                    }`}>
                      <MentorCard
                        analyst={analyst}
                        navigate={navigate}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-24 bg-white/[0.01] backdrop-blur-sm border border-white/[0.04] rounded-3xl">
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <FiUsers className="text-4xl text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-[#f0f4f8] mb-3">
                  No Mentors Available
                </h3>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                  Verified research analysts will appear here soon. Stay tuned for expert guidance.
                </p>
              </div>
            )}
          </>
        )}

        {/* Bottom CTA for authenticated users */}
        {analysts.length > 4 && user && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/mentors")}
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] text-slate-300 font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:text-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              Explore All {analysts.length} Mentors
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* CSS Animations */}
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