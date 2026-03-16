// pages/AdminNews.jsx
import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiClock } from "react-icons/fi";
import NotFound from "../../components/NotFound";
import NewsCard from "../../components/NewsCard";
import filterIcon from "../../../assets/card/filter.svg";
import axios from "axios";
import AddNewsModal from "../../components/modals/AddNewsModal";
import { format } from "date-fns";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editNews, setEditNews] = useState(null);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState({
    category: "",
    status: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  
  const userId = user?.id;
  const userRole = user?.role;
  const isRA = userRole === "RA" || userRole === "ra"; 
  const isAdmin = userRole === "admin" || userRole === "ADMIN";
  const apiUrl = import.meta.env.VITE_API_URL;

  // Categories for filter
  const categories = [
    "Market News",
    "Stock Analysis",
    "IPO Updates",
    "Economy",
    "Sector Update",
    "Company News",
    "Global Markets",
    "Technical Analysis",
    "Fundamental Analysis"
  ];

  const statuses = [
    { value: "draft", label: "Draft", color: "gray" },
    { value: "published", label: "Published", color: "green" },
    { value: "scheduled", label: "Scheduled", color: "blue" },
    { value: "archived", label: "Archived", color: "red" }
  ];

  // Fetch news stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${apiUrl}/news/stats`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch news with filters
  const fetchNews = async () => {
    try {
      setLoading(true);
      
      let endpoint = `${apiUrl}/news/all`;
      
      // Apply filters if selected
      if (filter.category) {
        endpoint = `${apiUrl}/news/category/${encodeURIComponent(filter.category)}`;
      } else if (filter.status) {
        endpoint = `${apiUrl}/news/status/${filter.status}`;
      } else if (isRA) {
        endpoint = `${apiUrl}/news/author/${userId}`;
      }
      
      const res = await axios.get(endpoint);
      let fetchedNews = res.data?.news || [];
      
      // Apply search filter client-side
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
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNews();
      if (isAdmin) {
        fetchStats();
      }
    } else {
      setLoading(false);
    }
  }, [userId, filter.category, filter.status, isRA]); 

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchNews();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleNewsAdded = () => {
    setShowModal(false);
    setEditNews(null);
    fetchNews();
    if (isAdmin) {
      fetchStats();
    }
  };

  const handleEdit = (newsItem) => {
    setEditNews(newsItem);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await axios.delete(`${apiUrl}/news/${id}`);
        fetchNews();
        if (isAdmin) {
          fetchStats();
        }
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Failed to delete news");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${apiUrl}/news/${id}`, { status: newStatus });
      fetchNews();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handlePreview = (newsItem) => {
    setSelectedNews(newsItem);
    setShowPreview(true);
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || "gray";
  };

  const getHeaderTitle = () => {
    if (isRA) return "My News Articles";
    return "News Management";
  };

  const showAddButton = isAdmin; // Only admins can add news

  // Clear all filters
  const clearFilters = () => {
    setFilter({ category: "", status: "" });
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              {getHeaderTitle()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isRA ? "Manage and track your published articles" : "Create and manage all news articles"}
            </p>
          </div>

          {showAddButton && (
            <button
              onClick={() => {
                setEditNews(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              <FiPlus size={18} /> Add News
            </button>
          )}
        </div>

        {/* Stats Cards - Only for Admin */}
        {isAdmin && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total News</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Published</p>
              <p className="text-2xl font-bold text-green-700">{stats.byStatus?.published || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Drafts</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.byStatus?.draft || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Total Views</p>
              <p className="text-2xl font-bold text-purple-700">{stats.totalViews?.toLocaleString() || 0}</p>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter.category}
            onChange={(e) => setFilter({...filter, category: e.target.value, status: ""})}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value, category: ""})}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(filter.category || filter.status || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Loading news...</p>
          </div>
        </div>
      ) : news.length === 0 ? (
        <NotFound message="No news articles found" />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  News
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.images && item.images.length > 0 && (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {item.shortDescription}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {item.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs rounded-full px-2 py-1 font-semibold border-0 focus:ring-2 focus:ring-offset-2 ${
                        item.status === 'published' ? 'bg-green-100 text-green-800' :
                        item.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        item.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.scheduled_date ? (
                        <div className="flex items-center gap-1">
                          <FiCalendar size={14} className="text-gray-400" />
                          {format(new Date(item.scheduled_date), 'dd MMM yyyy')}
                        </div>
                      ) : item.created_at ? (
                        format(new Date(item.created_at), 'dd MMM yyyy')
                      ) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FiEye size={14} />
                      {item.views || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Preview"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination (if needed) */}
          {news.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{news.length}</span> of{' '}
                <span className="font-medium">{news.length}</span> results
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">News Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiPlus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6">
              {selectedNews.images && selectedNews.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedNews.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Preview ${idx + 1}`} className="rounded-lg w-full h-48 object-cover" />
                  ))}
                </div>
              )}
              <h1 className="text-2xl font-bold mb-3">{selectedNews.title}</h1>
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{selectedNews.category}</span>
                <span>By {selectedNews.author_name || 'Unknown'}</span>
                <span>{format(new Date(selectedNews.created_at), 'dd MMM yyyy')}</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4 italic">{selectedNews.shortDescription}</p>
                <div className="whitespace-pre-wrap">{selectedNews.fullArticle}</div>
              </div>
              {selectedNews.tags && selectedNews.tags.length > 0 && (
                <div className="mt-6 flex gap-2">
                  {selectedNews.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddNewsModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditNews(null);
        }}
        onSuccess={handleNewsAdded}
        editData={editNews}
      />
    </div>
  );
};

export default AdminNews;