import React, { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, Users, MapPin, Award, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";

export default function AllMentors() {
  const tabs = ["All Mentors", "My Mentors"];
  const [activeTab, setActiveTab] = useState(0);

  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const user = localStorage.getItem("user");

  // Fallback images array for variety
  const fallbackImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
  ];

  // Helper function to get image URL
  const getImageUrl = (mentor, index) => {
    const imageField = mentor?.profile_image || mentor?.image || mentor?.avatar;
    
    if (!imageField) return fallbackImages[index % fallbackImages.length];
    
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

  // Filter analysts based on search
  const filteredAnalysts = analysts.filter(mentor => 
    mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-[#060b10] py-8 px-4 sm:px-6 lg:px-8">
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
        {/* Header */}
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

          {/* Search & Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search mentors..."
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
            { icon: Users, label: "Total Mentors", value: analysts.length },
            { icon: Award, label: "SEBI Registered", value: "200+" },
            { icon: Shield, label: "Verified", value: "100%" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-4 text-center">
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
            <p className="mt-4 text-slate-400 text-sm">Loading mentors...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchAnalysts}
              className="px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Mentors Grid */}
        {!loading && !error && (
          <>
            {filteredAnalysts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAnalysts.map((mentor, index) => {
                  const imageUrl = getImageUrl(mentor, index);
                  const fallbackImage = fallbackImages[index % fallbackImages.length];

                  return (
                    <div
                      key={mentor.id}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`transform transition-all duration-500 hover:-translate-y-2 ${
                        hoveredIndex !== null && hoveredIndex !== index
                          ? 'opacity-40 scale-[0.97] blur-[1px]'
                          : 'opacity-100 scale-100 blur-0'
                      }`}
                    >
                      <div className="group/card relative rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5">
                        {/* Top glow line */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10" />

                        {/* Image */}
                        <div className="relative h-[380px] overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={mentor.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                              e.currentTarget.onerror = null;
                            }}
                          />
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#060b10] via-[#060b10]/40 to-transparent" />

                          {/* Verified badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> SEBI Reg.
                            </span>
                          </div>
                        </div>

                        {/* Info Card */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 shadow-2xl">
                            {/* Name & Location */}
                            <div className="mb-4">
                              <h3 className="text-lg font-bold text-[#f0f4f8] leading-tight">
                                {mentor.name || "Unknown Mentor"}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                <p className="text-xs text-slate-400">
                                  {mentor.location || "India"}
                                </p>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Experience</span>
                                <span className="text-xs font-semibold text-slate-300">
                                  {mentor.experience ? `${mentor.experience} Years` : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">SEBI Number</span>
                                <span className="text-xs font-semibold text-slate-300">
                                  {mentor.sebi_number || "N/A"}
                                </span>
                              </div>
                              {mentor.accuracy && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-slate-500">Accuracy</span>
                                  <span className="text-xs font-semibold text-emerald-400">
                                    {mentor.accuracy}%
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* View Profile Button */}
                            <button
                              onClick={() => navigate(`/mentor/${mentor.id}`)}
                              className="group/btn w-full py-3 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                              View Profile
                              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                  <Users className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-[#f0f4f8] mb-2">
                  {searchTerm ? "No Mentors Found" : "No Mentors Available"}
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  {searchTerm 
                    ? `No mentors matching "${searchTerm}". Try a different search term.`
                    : "Verified research analysts will appear here soon."}
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
            )}
          </>
        )}
      </div>
    </section>
  );
}