import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MentorCard from "../../components/MentorCard";

export default function Mentors() {
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-color uppercase text-md tracking-wide mb-2">
              Featured
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">
              Advisors trusted by thousands
            </h2>
          </div>

          <button
            onClick={() => {
              if (!user) {
                navigate("/login");
                toast.warn("Please login first to view mentors", {
                  position: "top-center",
                  autoClose: 3000,
                  style: {
                    background: "#3959fb",
                    color: "#fff",
                    padding: "16px",
                    borderRadius: "10px",
                  },
                });
              } else {
                navigate("/mentors");
              }
            }}
            className="shrink-0 text-md text-gray-700 hover:text-emerald-600 font-medium flex items-center gap-2 mt-2  backdrop-blur-sm px-4 py-2 rounded-xl transition-all"
            disabled={loading}
          >
            See all advisors <span className="text-lg">→</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#111827] mb-6"></div>
            <p className="text-[#111827] text-lg">Loading mentors...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchAnalysts}
              className="px-6 py-3 bg-[#111827] text-white rounded-lg hover:bg-[#0f172a] transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Data */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {analysts.slice(0, 4).map((analyst, index) => (
                <MentorCard
                  key={analyst.id || index}
                  analyst={analyst}
                  navigate={navigate}
                />
              ))}
            </div>

            {/* Empty */}
            {analysts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-[#111827] mb-2">
                  No Mentors Found
                </h3>
                <p className="text-gray-500 text-md">
                  Verified research analysts will appear here.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}