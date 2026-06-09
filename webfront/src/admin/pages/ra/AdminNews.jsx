// AdminNews.jsx
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiVideo, FiImage, FiSearch, FiX, FiFilter } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import axios from "axios";
import AddNewsModal from '../../components/modals/AddNewsModal.jsx';
import { format } from "date-fns";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editNews, setEditNews] = useState(null);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState({ category: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const isInitialMount = useRef(true);
  const isFetching = useRef(false);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?.id;
  const userRole = user?.role;
  const isRA = useMemo(() => userRole === "RA" || userRole === "ra", [userRole]);
  const isAdmin = useMemo(() => userRole === "admin" || userRole === "ADMIN", [userRole]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const categories = [
    "Market News", "Stock Analysis", "IPO Updates", "Economy",
    "Sector Update", "Company News", "Global Markets",
    "Technical Analysis", "Fundamental Analysis"
  ];

  const statuses = [
    { value: "draft", label: "Draft", color: "gray" },
    { value: "published", label: "Published", color: "green" },
    { value: "scheduled", label: "Scheduled", color: "blue" },
    { value: "archived", label: "Archived", color: "red" }
  ];

  const isVideoFile = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const getFileExtension = (url) => url.split('.').pop().toLowerCase();

  const handleMediaClick = (mediaUrl, e) => {
    e.stopPropagation();
    window.open(mediaUrl, '_blank');
  };

  const renderMediaThumbnail = (media) => {
    if (!media || !media.url) return null;
    const isVideo = isVideoFile(media.url);
    const fileExt = getFileExtension(media.url);

    if (isVideo) {
      return (
        <div className="relative group cursor-pointer flex-shrink-0" onClick={(e) => handleMediaClick(media.url, e)}>
          <video src={media.url} className="h-16 w-16 rounded-lg object-cover" preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <div className="bg-white rounded-full p-1"><FaPlay className="text-black text-xs" /></div>
          </div>
        </div>
      );
    }
    return (
      <div className="relative group cursor-pointer flex-shrink-0" onClick={(e) => handleMediaClick(media.url, e)}>
        <img src={media.url} alt="News media" className="h-16 w-16 rounded-lg object-cover" />
      </div>
    );
  };

  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await axios.get(`${apiUrl}/news/stats`);
      if (res.data.success) setStats(res.data.stats);
    } catch (error) { console.error("Error fetching stats:", error); }
  }, [apiUrl, isAdmin]);

  const fetchNews = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      setLoading(true);
      let endpoint = `${apiUrl}/news/all`;
      if (filter.category) endpoint = `${apiUrl}/news/category/${encodeURIComponent(filter.category)}`;
      else if (filter.status) endpoint = `${apiUrl}/news/status/${filter.status}`;
      else if (isRA && userId) endpoint = `${apiUrl}/news/author/${userId}`;

      const res = await axios.get(endpoint);
      let fetchedNews = res.data?.news || [];
      if (searchTerm) {
        fetchedNews = fetchedNews.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      setNews(fetchedNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [apiUrl, filter.category, filter.status, isRA, userId, searchTerm]);

  useEffect(() => { if (userId) { fetchNews(); if (isAdmin) fetchStats(); } else setLoading(false); }, [userId]);
  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    if (userId) { const timer = setTimeout(() => fetchNews(), 300); return () => clearTimeout(timer); }
  }, [filter.category, filter.status, userId, fetchNews]);
  useEffect(() => {
    if (!userId) return;
    const timer = setTimeout(() => { if (searchTerm) fetchNews(); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, userId, fetchNews]);

  const handleNewsAdded = useCallback(() => {
    setShowModal(false); setEditNews(null);
    fetchNews(); if (isAdmin) fetchStats();
  }, [fetchNews, fetchStats, isAdmin]);

  const handleEdit = useCallback((newsItem) => { setEditNews(newsItem); setShowModal(true); }, []);
  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try { await axios.delete(`${apiUrl}/news/${id}`); fetchNews(); if (isAdmin) fetchStats(); }
      catch (error) { console.error("Error deleting news:", error); alert("Failed to delete news"); }
    }
  }, [apiUrl, fetchNews, fetchStats, isAdmin]);
  const handleStatusChange = useCallback(async (id, newStatus) => {
    try { await axios.put(`${apiUrl}/news/${id}`, { status: newStatus }); fetchNews(); }
    catch (error) { console.error("Error updating status:", error); alert("Failed to update status"); }
  }, [apiUrl, fetchNews]);
  const clearFilters = useCallback(() => { setFilter({ category: "", status: "" }); setSearchTerm(""); }, []);

  const renderMediaPreview = (media, index) => {
    const isVideo = isVideoFile(media.url);
    if (isVideo) {
      return (
        <div key={index} className="relative rounded-lg overflow-hidden bg-black">
          <video src={media.url} controls className="rounded-lg w-full h-auto max-h-96" />
        </div>
      );
    }
    return <img key={index} src={media.url} alt={`Media ${index + 1}`} className="rounded-lg w-full h-auto max-h-96 object-contain cursor-pointer" onClick={() => window.open(media.url, '_blank')} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-5 p-4 sm:p-6">
        {/* Header with Stats */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['DM_Sans'] text-gray-900">
                {isRA ? "My News Articles" : "News Management"}
              </h2>
              <p className="text-sm font-['DM_Sans'] text-gray-500 mt-1">
                {isRA ? "Manage and track your published articles" : "Create and manage all news articles"}
              </p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => { setEditNews(null); setShowModal(true); }} 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm font-['DM_Sans'] text-sm sm:text-base whitespace-nowrap"
              >
                <FiPlus size={18} /> Add News
              </button>
            )}
          </div>

          {isAdmin && stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                <p className="text-xs sm:text-sm text-blue-600 font-medium font-['DM_Sans']">Total News</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 font-['DM_Sans']">{stats.total || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                <p className="text-xs sm:text-sm text-green-600 font-medium font-['DM_Sans']">Published</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 font-['DM_Sans']">{stats.byStatus?.published || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                <p className="text-xs sm:text-sm text-yellow-600 font-medium font-['DM_Sans']">Drafts</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 font-['DM_Sans']">{stats.byStatus?.draft || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                <p className="text-xs sm:text-sm text-purple-600 font-medium font-['DM_Sans']">Total Views</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 font-['DM_Sans']">{stats.totalViews?.toLocaleString() || 0}</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters - Mobile friendly */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-4 py-2 text-sm font-['DM_Sans'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Mobile filter toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-['DM_Sans'] text-sm"
            >
              <FiFilter size={16} /> Filters
            </button>
            
            {/* Desktop filters always visible, mobile conditional */}
            <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-3 sm:flex-1`}>
              <select 
                value={filter.category} 
                onChange={(e) => setFilter({ ...filter, category: e.target.value, status: "" })} 
                className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select 
                value={filter.status} 
                onChange={(e) => setFilter({ ...filter, status: e.target.value, category: "" })} 
                className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </div>
            
            {(filter.category || filter.status || searchTerm) && (
              <button 
                onClick={clearFilters} 
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-['DM_Sans'] whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Content - Responsive Table/Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12 bg-white border border-gray-200 rounded-2xl">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm font-['DM_Sans']">Loading news...</p>
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <FiSearch size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-['DM_Sans']">No news articles found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-['DM_Sans']">News</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-['DM_Sans']">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-['DM_Sans']">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-['DM_Sans']">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-['DM_Sans']">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-['DM_Sans']">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {news.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.images && item.images.length > 0 && renderMediaThumbnail(item.images[0])}
                            <div>
                              <div className="text-sm font-semibold font-['DM_Sans'] text-gray-900 line-clamp-1">{item.title}</div>
                              <div className="text-xs text-gray-500 line-clamp-1 mt-1">{item.shortDescription}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 font-['DM_Sans']">{item.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select 
                            value={item.status} 
                            onChange={(e) => handleStatusChange(item.id, e.target.value)} 
                            className={`text-xs rounded-lg px-2 py-1 font-semibold border-0 focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                              item.status === 'published' ? 'bg-green-100 text-green-700' : 
                              item.status === 'draft' ? 'bg-gray-100 text-gray-700' : 
                              item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            {statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-['DM_Sans'] flex items-center gap-1">
                            <FiCalendar size={12} className="text-gray-400" />
                            {item.scheduled_date ? format(new Date(item.scheduled_date), 'dd MMM yyyy') : 
                             item.created_at ? format(new Date(item.created_at), 'dd MMM yyyy') : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <FiEye size={12} className="text-gray-400" />
                            {item.views || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setSelectedNews(item); setShowPreview(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Preview">
                              <FiEye size={16} className="text-blue-600" />
                            </button>
                            <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                              <FiEdit2 size={16} className="text-indigo-600" />
                            </button>
                            {isAdmin && (
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
                                <FiTrash2 size={16} className="text-red-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View (visible on mobile/tablet) */}
            <div className="lg:hidden space-y-3">
              {news.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex gap-3 mb-3">
                    {item.images && item.images.length > 0 && renderMediaThumbnail(item.images[0])}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold font-['DM_Sans'] text-gray-900 line-clamp-2">{item.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 mt-1">{item.shortDescription}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{item.category}</span>
                    <select 
                      value={item.status} 
                      onChange={(e) => handleStatusChange(item.id, e.target.value)} 
                      className={`text-xs rounded-lg px-2 py-1 font-semibold border-0 ${
                        item.status === 'published' ? 'bg-green-100 text-green-700' : 
                        item.status === 'draft' ? 'bg-gray-100 text-gray-700' : 
                        item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FiCalendar size={12} />{item.scheduled_date ? format(new Date(item.scheduled_date), 'dd MMM') : item.created_at ? format(new Date(item.created_at), 'dd MMM') : '-'}</span>
                      <span className="flex items-center gap-1"><FiEye size={12} />{item.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedNews(item); setShowPreview(true); }} className="p-2 rounded-lg hover:bg-gray-100">
                        <FiEye size={14} className="text-blue-600" />
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-gray-100">
                        <FiEdit2 size={14} className="text-indigo-600" />
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-gray-100">
                          <FiTrash2 size={14} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Preview Modal */}
        {showPreview && selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold font-['DM_Sans'] text-gray-900">News Preview</h3>
                <button onClick={() => setShowPreview(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all">
                  <FiX size={18} className="text-gray-600" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                {selectedNews.images && selectedNews.images.length > 0 && (
                  <div className="mb-6">
                    <div className={`grid gap-3 ${selectedNews.images.length === 2 ? 'grid-cols-2' : selectedNews.images.length === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
                      {selectedNews.images.map((media, idx) => renderMediaPreview(media, idx))}
                    </div>
                  </div>
                )}
                <h1 className="text-xl sm:text-2xl font-bold font-['DM_Sans'] text-gray-900 mb-3">{selectedNews.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs sm:text-sm font-['DM_Sans']">{selectedNews.category}</span>
                  <span className="text-xs sm:text-sm text-gray-500 font-['DM_Sans']">By {selectedNews.author_name || 'Unknown'}</span>
                  <span className="text-xs sm:text-sm text-gray-500 font-['DM_Sans']">{format(new Date(selectedNews.created_at), 'dd MMM yyyy')}</span>
                </div>
                <p className="text-gray-600 mb-4 italic font-['DM_Sans']">{selectedNews.shortDescription}</p>
                <div className="whitespace-pre-wrap text-gray-700 font-['DM_Sans']">{selectedNews.fullArticle}</div>
                {selectedNews.tags && selectedNews.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedNews.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">#{tag.replace(/^#+/, '')}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <AddNewsModal open={showModal} onClose={() => { setShowModal(false); setEditNews(null); }} onSuccess={handleNewsAdded} editData={editNews} />
      </div>
    </div>
  );
};

export default AdminNews;