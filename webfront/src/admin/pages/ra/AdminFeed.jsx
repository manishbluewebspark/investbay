// AdminFeed.jsx
import { useEffect, useState } from "react";
import { FiPlus, FiFilter, FiSearch, FiX } from "react-icons/fi";
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
  const [showFilters, setShowFilters] = useState(false);
  
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
    setShowFilters(false);
  };

  const getHeaderTitle = () => {
    return isRA ? "My Feeds" : "All Feeds";
  };

  const showAddButton = !isRA;
  const activeFilterCount = (selectedTag ? 1 : 0) + (dateFilter ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-5 p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['DM_Sans'] text-gray-900">
                {getHeaderTitle()}
              </h2>
              <p className="text-sm font-['DM_Sans'] text-gray-500 mt-1">
                {isRA ? "Your published feeds" : "All feeds from all analysts"}
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {/* Filter Button */}
              <div className="relative flex-1 sm:flex-initial">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-700 font-['DM_Sans'] text-sm"
                >
                  <FiFilter size={16} />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-30 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2 font-['DM_Sans']">Filter by Tag</label>
                        <select
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-['DM_Sans']"
                        >
                          <option value="">All Tags</option>
                          {allTags.map(tag => (
                            <option key={tag} value={tag}>#{tag}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2 font-['DM_Sans']">Date Range</label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-['DM_Sans']"
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
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm font-['DM_Sans'] text-sm whitespace-nowrap"
                >
                  <FiPlus size={18} />
                  <span>Add Feed</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-['DM_Sans']">Active filters:</span>
              {selectedTag && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-['DM_Sans']">
                  Tag: #{selectedTag}
                  <button onClick={() => setSelectedTag("")} className="hover:bg-blue-200 rounded-full p-0.5">
                    <FiX size={10} />
                  </button>
                </span>
              )}
              {dateFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-['DM_Sans']">
                  Date: {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                  <button onClick={() => setDateFilter("")} className="hover:bg-blue-200 rounded-full p-0.5">
                    <FiX size={10} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white border border-gray-200 rounded-2xl">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm font-['DM_Sans']">Loading feeds...</p>
            </div>
          </div>
        ) : feeds.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <FiSearch size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-['DM_Sans']">No feeds found</p>
            {showAddButton && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-['DM_Sans'] text-sm"
              >
                <FiPlus size={16} /> Create your first feed
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} onDeleteSuccess={fetchFeeds} />
            ))}
          </div>
        )}
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