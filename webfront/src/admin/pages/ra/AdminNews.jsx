import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiVideo, FiImage } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import NotFound from "../../components/NotFound";
import axios from "axios";
import AddNewsModal from '../../components/modals/AddNewsModal.jsx'
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
        <div className="relative group cursor-pointer" onClick={(e) => handleMediaClick(media.url, e)}>
          <video src={media.url} className="h-20 w-20 rounded-xl object-cover" preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
            <div className="bg-white/90 rounded-full p-1.5"><FaPlay className="text-black text-xs" /></div>
          </div>
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <FiVideo size={10} /><span>{fileExt}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="relative group cursor-pointer" onClick={(e) => handleMediaClick(media.url, e)}>
        <img src={media.url} alt="News media" className="h-20 w-20 rounded-xl object-cover" />
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
          <FiImage size={10} /><span>{fileExt}</span>
        </div>
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
        <div key={index} className="relative rounded-xl overflow-hidden bg-black">
          <video src={media.url} controls className="rounded-xl w-full h-auto max-h-96" />
        </div>
      );
    }
    return <img key={index} src={media.url} alt={`Media ${index + 1}`} className="rounded-xl w-full h-auto max-h-96 object-contain cursor-pointer" onClick={() => window.open(media.url, '_blank')} />;
  };

  return (
    <div className="min-h-screen bg-[#c8b8a8]">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400/20 via-cyan-400/15 to-transparent blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-amber-400/15 to-orange-400/10 blur-[80px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/10 blur-[70px]" />
      </div>

      <div className="relative z-10 space-y-6 p-6">
        {/* Header with Stats - Glass */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold font-['Sora'] text-[#2a2118]">
                {isRA ? "My News Articles" : "News Management"}
              </h2>
              <p className="text-sm font-['DM_Sans'] text-[#6b5f55] mt-1">
                {isRA ? "Manage and track your published articles" : "Create and manage all news articles"}
              </p>
            </div>
            {isAdmin && (
              <button onClick={() => { setEditNews(null); setShowModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 font-['DM_Sans']">
                <FiPlus size={18} /> Add News
              </button>
            )}
          </div>

          {isAdmin && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-sm text-blue-600 font-medium font-['DM_Sans']">Total News</p>
                <p className="text-2xl font-bold text-[#2a2118] font-['Sora']">{stats.total || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-sm text-green-600 font-medium font-['DM_Sans']">Published</p>
                <p className="text-2xl font-bold text-[#2a2118] font-['Sora']">{stats.byStatus?.published || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-sm text-yellow-600 font-medium font-['DM_Sans']">Drafts</p>
                <p className="text-2xl font-bold text-[#2a2118] font-['Sora']">{stats.byStatus?.draft || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-sm text-purple-600 font-medium font-['DM_Sans']">Total Views</p>
                <p className="text-2xl font-bold text-[#2a2118] font-['Sora']">{stats.totalViews?.toLocaleString() || 0}</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters - Glass */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <input type="text" placeholder="Search news..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-[200px] rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value, status: "" })} className="rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[150px]">
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value, category: "" })} className="rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[150px]">
              <option value="">All Status</option>
              {statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
            {(filter.category || filter.status || searchTerm) && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-['DM_Sans']">Clear Filters</button>
            )}
          </div>
        </div>

        {/* Content - Glass Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center"><div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div><p className="text-[#6b5f55] text-sm font-['DM_Sans']">Loading news...</p></div>
          </div>
        ) : news.length === 0 ? (
          <NotFound message="No news articles found" />
        ) : (
          <div className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#2a2118] uppercase tracking-wider font-['DM_Sans']">News</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#2a2118] uppercase tracking-wider font-['DM_Sans']">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#2a2118] uppercase tracking-wider font-['DM_Sans']">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#2a2118] uppercase tracking-wider font-['DM_Sans']">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#2a2118] uppercase tracking-wider font-['DM_Sans']">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#2a2118] uppercase tracking-wider font-['DM_Sans']">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.images && item.images.length > 0 && renderMediaThumbnail(item.images[0])}
                        {item.images && item.images.length > 1 && <div className="relative -ml-8 mt-8 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">+{item.images.length - 1}</div>}
                        <div><div className="text-sm font-semibold font-['DM_Sans'] text-[#2a2118] line-clamp-1">{item.title}</div><div className="text-xs text-[#6b5f55] line-clamp-1">{item.shortDescription}</div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-[#2a2118] font-['DM_Sans']">{item.category}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select value={item.status} onChange={(e) => handleStatusChange(item.id, e.target.value)} className={`text-xs rounded-full px-2 py-1 font-semibold border-0 focus:ring-2 focus:ring-offset-2 ${item.status === 'published' ? 'bg-green-500/20 text-green-700' : item.status === 'draft' ? 'bg-gray-500/20 text-gray-700' : item.status === 'scheduled' ? 'bg-blue-500/20 text-blue-700' : 'bg-red-500/20 text-red-700'}`}>
                        {statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-[#2a2118] font-['DM_Sans'] flex items-center gap-1">{item.scheduled_date ? <><FiCalendar size={12} className="text-[#6b5f55]" />{format(new Date(item.scheduled_date), 'dd MMM yyyy')}</> : item.created_at ? format(new Date(item.created_at), 'dd MMM yyyy') : '-'}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1 text-sm text-[#2a2118]"><FiEye size={12} className="text-[#6b5f55]" />{item.views || 0}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2"><button onClick={() => { setSelectedNews(item); setShowPreview(true); }} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Preview"><FiEye size={16} className="text-blue-500" /></button><button onClick={() => handleEdit(item)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Edit"><FiEdit2 size={16} className="text-indigo-500" /></button>{isAdmin && <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Delete"><FiTrash2 size={16} className="text-red-500" /></button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Preview Modal - Glass */}
        {showPreview && selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#c8b8a8]/50 backdrop-blur-md">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white/15 backdrop-blur-xl border-b border-white/30 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold font-['Sora'] text-[#2a2118]">News Preview</h3>
                <button onClick={() => setShowPreview(false)} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/30 transition-all"><FiPlus size={16} className="rotate-45 text-[#2a2118]" /></button>
              </div>
              <div className="p-6">
                {selectedNews.images && selectedNews.images.length > 0 && (<div className="mb-6"><div className={`grid gap-4 ${selectedNews.images.length === 2 ? 'grid-cols-2' : selectedNews.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}>{selectedNews.images.map((media, idx) => renderMediaPreview(media, idx))}</div></div>)}
                <h1 className="text-2xl font-bold font-['Sora'] text-[#2a2118] mb-3">{selectedNews.title}</h1>
                <div className="flex items-center gap-4 mb-4"><span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 text-sm font-['DM_Sans']">{selectedNews.category}</span><span className="text-sm text-[#6b5f55] font-['DM_Sans']">By {selectedNews.author_name || 'Unknown'}</span><span className="text-sm text-[#6b5f55] font-['DM_Sans']">{format(new Date(selectedNews.created_at), 'dd MMM yyyy')}</span></div>
                <div className="prose max-w-none"><p className="text-[#2a2118]/70 mb-4 italic font-['DM_Sans']">{selectedNews.shortDescription}</p><div className="whitespace-pre-wrap text-[#2a2118] font-['DM_Sans']">{selectedNews.fullArticle}</div></div>
                {selectedNews.tags && selectedNews.tags.length > 0 && (<div className="mt-6 flex gap-2">{selectedNews.tags.map((tag, idx) => (<span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full text-[#2a2118]">#{tag.replace(/^#+/, '')}</span>))}</div>)}
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