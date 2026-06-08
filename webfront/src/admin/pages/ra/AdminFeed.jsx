import { useEffect, useState } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";
import AddFeedModal from "../../components/modals/AddFeedModal";
import NotFound from "../../components/NotFound";
import FeedCard from "../../components/FeedCard";
import axios from "axios";

const AdminFeed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  
  const userId = user?.id;
  const userRole = user?.role;
  const isRA = userRole === "RA" || userRole === "ra"; 
  const apiUrl = import.meta.env.VITE_API_URL;

  const getAllTags = () => {
    const tagsSet = new Set();
    feeds.forEach(feed => {
      if (feed.feed_tags) {
        try {
          let tags = [];
          if (typeof feed.feed_tags === 'string') {
            try {
              const parsed = JSON.parse(feed.feed_tags);
              tags = Array.isArray(parsed) ? parsed : feed.feed_tags.split(/[,\s]+/);
            } catch {
              tags = feed.feed_tags.split(/[,\s]+/);
            }
          } else if (Array.isArray(feed.feed_tags)) {
            tags = feed.feed_tags;
          }
          tags.forEach(tag => {
            if (tag && typeof tag === 'string') {
              tagsSet.add(tag.replace(/^#+/, '').toLowerCase());
            }
          });
        } catch (e) {}
      }
    });
    return Array.from(tagsSet);
  };

  const allTags = getAllTags();

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      let res;

      const endpoint = isRA ? `${apiUrl}/feeds/${userId}` : `${apiUrl}/feeds/all-feed`;
      
      res = await axios.get(endpoint);
      let fetchedFeeds = res.data?.data || [];
      
      if (selectedTag) {
        fetchedFeeds = fetchedFeeds.filter(feed => {
          let tags = [];
          if (feed.feed_tags) {
            try {
              if (typeof feed.feed_tags === 'string') {
                try {
                  const parsed = JSON.parse(feed.feed_tags);
                  tags = Array.isArray(parsed) ? parsed : feed.feed_tags.split(/[,\s]+/);
                } catch {
                  tags = feed.feed_tags.split(/[,\s]+/);
                }
              } else if (Array.isArray(feed.feed_tags)) {
                tags = feed.feed_tags;
              }
            } catch (e) {}
          }
          return tags.some(tag => tag.replace(/^#+/, '').toLowerCase() === selectedTag.toLowerCase());
        });
      }
      
      if (dateFilter) {
        const now = new Date();
        fetchedFeeds = fetchedFeeds.filter(feed => {
          const feedDate = new Date(feed.created_at);
          const diffDays = Math.floor((now - feedDate) / (1000 * 60 * 60 * 24));
          if (dateFilter === 'today') return diffDays === 0;
          if (dateFilter === 'week') return diffDays <= 7;
          if (dateFilter === 'month') return diffDays <= 30;
          return true;
        });
      }
      
      setFeeds(fetchedFeeds);
    } catch (error) {
      console.error("Error fetching feeds:", error);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFeeds();
    } else {
      setLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    if (userId) {
      fetchFeeds();
    }
  }, [selectedTag, dateFilter]);

  const handleFeedAdded = () => {
    setShowModal(false);
    fetchFeeds();
  };

  const clearFilters = () => {
    setSelectedTag("");
    setDateFilter("");
    setFilterOpen(false);
  };

  const getHeaderTitle = () => {
    return isRA ? "My Feeds" : "All Feeds";
  };

  const showAddButton = !isRA;

  return (
    <div className="min-h-screen bg-[#c8b8a8]">
      {/* Decorative 3D Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400/20 via-cyan-400/15 to-transparent blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-amber-400/15 to-orange-400/10 blur-[80px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/10 blur-[70px]" />
      </div>

      <div className="relative z-10">
        {/* Header - Glassmorphism */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-[#c8b8a8]/70 border-b border-white/30">
          <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold font-['Sora'] text-[#2a2118]">
                {getHeaderTitle()}
              </h2>
              <p className="text-sm text-[#6b5f55] mt-1 font-['DM_Sans']">
                {isRA ? "Your published feeds" : "All feeds from all analysts"}
              </p>
            </div>

            <div className="flex gap-3">
              {/* Filter Dropdown - Glass */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/40 px-4 py-2.5 rounded-full hover:bg-white/30 transition-all duration-200 text-[#2a2118] font-['DM_Sans']"
                >
                  <FiFilter size={16} />
                  <span className="text-sm">Filter</span>
                  {(selectedTag || dateFilter) && (
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  )}
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl z-30 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#2a2118] uppercase tracking-wider block mb-2 font-['DM_Sans']">Filter by Tag</label>
                        <select
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                          className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-sm text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-['DM_Sans']"
                        >
                          <option value="">All Tags</option>
                          {allTags.map(tag => (
                            <option key={tag} value={tag}>#{tag}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#2a2118] uppercase tracking-wider block mb-2 font-['DM_Sans']">Date Range</label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-sm text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-['DM_Sans']"
                        >
                          <option value="">All Time</option>
                          <option value="today">Today</option>
                          <option value="week">Last 7 Days</option>
                          <option value="month">Last 30 Days</option>
                        </select>
                      </div>
                      {(selectedTag || dateFilter) && (
                        <button
                          onClick={clearFilters}
                          className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-1 transition-colors font-['DM_Sans']"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {showAddButton && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25 font-['DM_Sans'] font-medium"
                >
                  <FiPlus size={18} />
                  <span className="text-sm">Add Feed</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                  <div className="absolute inset-0 w-12 h-12 border-2 border-white/10 rounded-full mx-auto" />
                </div>
                <p className="text-[#6b5f55] text-sm font-['DM_Sans']">Loading feeds...</p>
              </div>
            </div>
          ) : feeds.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <NotFound />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feeds.map((feed) => (
                <FeedCard key={feed.id} feed={feed} onDeleteSuccess={fetchFeeds} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddFeedModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleFeedAdded}
      />
    </div>
  );
};

export default AdminFeed;