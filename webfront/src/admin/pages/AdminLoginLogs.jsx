import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiX, FiCalendar, FiUser, FiActivity, FiLogIn, FiLogOut, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AdminLoginLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    action: '',
    start_date: '',
    end_date: '',
    user_id: ''
  });

  // Column Definitions
  const columnDefs = useMemo(() => [
    { 
      field: 'user_name', 
      headerName: 'User', 
      minWidth: 200,
      render: (item) => (
        <div className="flex flex-col">
          <div className="font-semibold text-sm font-['DM_Sans'] text-gray-900">{item.user_name || 'N/A'}</div>
          <div className="text-xs text-gray-500 font-['DM_Sans']">{item.user_email || ''}</div>
        </div>
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 100,
      render: (item) => {
        const role = item.role;
        const badges = {
          user: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
          ra: { bg: 'bg-emerald-100', text: 'text-emerald-700' }
        };
        const badge = badges[role] || { bg: 'bg-gray-100', text: 'text-gray-700' };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold font-['DM_Sans'] ${badge.bg} ${badge.text}`}>
            {role?.toUpperCase() || 'N/A'}
          </span>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 130,
      render: (item) => {
        const action = item.action;
        const actions = {
          LOGIN: { bg: 'bg-green-100', text: 'text-green-700', icon: <FiLogIn size={12} className="mr-1" /> },
          OTP_LOGIN: { bg: 'bg-teal-100', text: 'text-teal-700', icon: <FiRefreshCw size={12} className="mr-1" /> },
          LOGOUT: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <FiLogOut size={12} className="mr-1" /> }
        };
        const actionStyle = actions[action] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold font-['DM_Sans'] ${actionStyle.bg} ${actionStyle.text}`}>
            {actionStyle.icon}
            {action?.replace('_', ' ') || 'N/A'}
          </span>
        );
      }
    },
    {
      field: 'ip_address',
      headerName: 'IP Address',
      minWidth: 140,
      render: (item) => <span className="font-mono text-sm text-gray-700 font-['DM_Sans']">{item.ip_address || 'N/A'}</span>
    },
    {
      field: 'created_at',
      headerName: 'Time',
      minWidth: 180,
      render: (item) => (
        <span className="text-sm text-gray-500 font-['DM_Sans']">
          {item.created_at ? new Date(item.created_at).toLocaleString('en-IN') : 'N/A'}
        </span>
      )
    }
  ], []);

  // Fetch logs with filters
  const fetchLogs = useCallback(async (currentFilters = filters, currentPage = 1) => {
    try {
      setLoading(true);
      
      const cleanFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '')
      );

      const params = new URLSearchParams({
        ...cleanFilters,
        page: currentPage,
        limit: 50
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/login-logs?${params}`,
        { timeout: 15000 }
      );

      setLogs(response.data.data || []);
      setPagination(response.data.pagination || {});

    } catch (error) {
      console.error('Fetch logs error:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    fetchLogs(filters, 1);
  }, [filters, fetchLogs]);

  const clearFilters = useCallback(() => {
    const emptyFilters = { role: '', action: '', start_date: '', end_date: '', user_id: '' };
    setFilters(emptyFilters);
    fetchLogs(emptyFilters, 1);
  }, [fetchLogs]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      fetchLogs(filters, newPage);
    }
  }, [filters, fetchLogs, pagination.totalPages]);

  const setQuickDate = useCallback((days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    handleFilterChange('start_date', date.toISOString().split('T')[0]);
    handleFilterChange('end_date', days === 0 ? date.toISOString().split('T')[0] : '');
  }, [handleFilterChange]);

  useEffect(() => { fetchLogs(); }, []);

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  // Pagination component
  const PaginationControls = () => {
    const currentPage = pagination.page || 1;
    const totalPages = pagination.totalPages || 1;
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm font-['DM_Sans'] text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold font-['DM_Sans'] text-gray-900">Login Activity Logs</h1>
              <p className="text-sm font-['DM_Sans'] text-gray-500 mt-1">Track user and RA login/out activities</p>
            </div>
            <div className="flex gap-3">
              <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium font-['DM_Sans'] hover:bg-gray-50 transition-all">
                <FiX size={14} /> Clear All
              </button>
              <button onClick={applyFilters} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium font-['DM_Sans'] hover:bg-blue-700 transition-all shadow-sm">
                <FiSearch size={14} /> Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-gray-700 mb-1.5 flex items-center gap-1">
                <FiUser size={12} /> Role
              </label>
              <select value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="ra">Research Analyst</option>
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-gray-700 mb-1.5 flex items-center gap-1">
                <FiActivity size={12} /> Action
              </label>
              <select value={filters.action} onChange={(e) => handleFilterChange('action', e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Actions</option>
                <option value="LOGIN">Login</option>
                <option value="OTP_LOGIN">OTP Login</option>
                <option value="LOGOUT">Logout</option>
              </select>
            </div>

            {/* User ID Filter */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-gray-700 mb-1.5">User ID</label>
              <input type="number" value={filters.user_id} onChange={(e) => handleFilterChange('user_id', e.target.value)} placeholder="Enter user ID" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-['DM_Sans'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-gray-700 mb-1.5 flex items-center gap-1">
                <FiCalendar size={12} /> From
              </label>
              <input type="date" value={filters.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-gray-700 mb-1.5 flex items-center gap-1">
                <FiCalendar size={12} /> To
              </label>
              <input type="date" value={filters.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-500 font-['DM_Sans'] self-center">Quick:</span>
            <button onClick={() => setQuickDate(0)} className="px-3 py-1 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 font-['DM_Sans'] hover:bg-gray-50 transition-all">Today</button>
            <button onClick={() => setQuickDate(7)} className="px-3 py-1 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 font-['DM_Sans'] hover:bg-gray-50 transition-all">Last 7 Days</button>
            <button onClick={() => setQuickDate(30)} className="px-3 py-1 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 font-['DM_Sans'] hover:bg-gray-50 transition-all">Last 30 Days</button>
          </div>

          {/* Active Filters Indicator */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-200">
              <span className="text-[10px] text-gray-500 font-['DM_Sans']">Active filters ({activeFilterCount}):</span>
              {Object.entries(filters).map(([key, value]) => value && (
                <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-[10px] font-medium text-blue-700 font-['DM_Sans']">
                  {key.replace('_', ' ')}: {value}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-['DM_Sans'] text-gray-600">
            {logs.length > 0 ? (
              <>Showing <span className="font-semibold text-gray-900">{logs.length}</span> of <span className="font-semibold text-gray-900">{pagination.total || 0}</span> logs</>
            ) : (
              <>No logs found</>
            )}
            {pagination.totalPages > 1 && ` • Page ${pagination.page} of ${pagination.totalPages}`}
          </div>
          <button onClick={() => fetchLogs(filters, 1)} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all">
            <FiRefreshCw size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Custom Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto" style={{ minHeight: '500px' }}>
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-sm font-['DM_Sans'] text-gray-500">Loading logs...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-md font-['DM_Sans'] text-gray-500">No login logs found</p>
                <p className="text-xs text-gray-400 mt-1 font-['DM_Sans']">Try adjusting your filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columnDefs.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-4 text-left text-xs font-semibold font-['DM_Sans'] text-gray-700 uppercase tracking-wider"
                        style={{ minWidth: col.minWidth }}
                      >
                        {col.headerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-all duration-150">
                      {columnDefs.map((col, colIdx) => (
                        <td key={colIdx} className="px-6 py-4">
                          {col.render(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {!loading && logs.length > 0 && <PaginationControls />}
        </div>
      </div>
    </div>
  );
};

export default AdminLoginLogs;