import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { FiSearch, FiX, FiCalendar, FiUser, FiActivity, FiLogIn, FiLogOut, FiRefreshCw } from 'react-icons/fi';

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
  const gridRef = useRef();

  // AG Grid Column Definitions with Glass styling
  const columnDefs = useMemo(() => [
    { 
      field: 'user_name', 
      headerName: 'User', 
      flex: 2, 
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col">
          <div className="font-semibold text-sm font-['DM_Sans'] text-[#2a2118]">{params.value || 'N/A'}</div>
          <div className="text-xs text-[#6b5f55] font-['DM_Sans']">{params.data?.user_email || ''}</div>
        </div>
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 100,
      cellRenderer: ({ value }) => {
        const role = value;
        const badges = {
          user: { bg: 'bg-indigo-500/20', text: 'text-indigo-600' },
          ra: { bg: 'bg-emerald-500/20', text: 'text-emerald-600' }
        };
        const badge = badges[role] || { bg: 'bg-gray-500/20', text: 'text-gray-600' };
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
      flex: 1.2,
      minWidth: 130,
      cellRenderer: ({ value }) => {
        const actions = {
          LOGIN: { bg: 'bg-green-500/20', text: 'text-green-600', icon: <FiLogIn size={12} className="mr-1" /> },
          OTP_LOGIN: { bg: 'bg-teal-500/20', text: 'text-teal-600', icon: <FiRefreshCw size={12} className="mr-1" /> },
          LOGOUT: { bg: 'bg-orange-500/20', text: 'text-orange-600', icon: <FiLogOut size={12} className="mr-1" /> }
        };
        const actionStyle = actions[value] || { bg: 'bg-gray-500/20', text: 'text-gray-600', icon: null };
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold font-['DM_Sans'] ${actionStyle.bg} ${actionStyle.text}`}>
            {actionStyle.icon}
            {value?.replace('_', ' ') || 'N/A'}
          </span>
        );
      }
    },
    {
      field: 'ip_address',
      headerName: 'IP Address',
      flex: 1.2,
      minWidth: 140,
      cellClass: 'font-mono text-sm text-[#2a2118] font-["DM_Sans"]'
    },
    {
      field: 'created_at',
      headerName: 'Time',
      flex: 1.8,
      minWidth: 180,
      valueFormatter: ({ value }) => 
        value ? new Date(value).toLocaleString('en-IN') : 'N/A',
      cellClass: 'text-sm text-[#6b5f55] font-["DM_Sans"]'
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: false
  }), []);

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
      
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption('rowData', response.data.data || []);
      }

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

  const onPaginationChanged = useCallback((params) => {
    if (params.newPage) fetchLogs(filters, params.newPage);
  }, [filters, fetchLogs]);

  const setQuickDate = useCallback((days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    handleFilterChange('start_date', date.toISOString().split('T')[0]);
    handleFilterChange('end_date', days === 0 ? date.toISOString().split('T')[0] : '');
  }, [handleFilterChange]);

  useEffect(() => { fetchLogs(); }, []);

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="min-h-screen bg-[#c8b8a8] p-6">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400/20 via-cyan-400/15 to-transparent blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-amber-400/15 to-orange-400/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-5">
        {/* Header - Glass */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-['Sora'] text-[#2a2118]">Login Activity Logs</h1>
              <p className="text-sm font-['DM_Sans'] text-[#6b5f55] mt-1">Track user and RA login/out activities</p>
            </div>
            <div className="flex gap-3">
              <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-[#2a2118] font-medium font-['DM_Sans'] hover:bg-white/30 transition-all">
                <FiX size={14} /> Clear All
              </button>
              <button onClick={applyFilters} className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium font-['DM_Sans'] hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md">
                <FiSearch size={14} /> Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters - Glass Grid */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-[#2a2118] mb-1.5 flex items-center gap-1">
                <FiUser size={12} /> Role
              </label>
              <select value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)} className="w-full rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="ra">Research Analyst</option>
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-[#2a2118] mb-1.5 flex items-center gap-1">
                <FiActivity size={12} /> Action
              </label>
              <select value={filters.action} onChange={(e) => handleFilterChange('action', e.target.value)} className="w-full rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="">All Actions</option>
                <option value="LOGIN">Login</option>
                <option value="OTP_LOGIN">OTP Login</option>
                <option value="LOGOUT">Logout</option>
              </select>
            </div>

            {/* User ID Filter */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-[#2a2118] mb-1.5">User ID</label>
              <input type="number" value={filters.user_id} onChange={(e) => handleFilterChange('user_id', e.target.value)} placeholder="Enter user ID" className="w-full rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-[#2a2118] mb-1.5 flex items-center gap-1">
                <FiCalendar size={12} /> From
              </label>
              <input type="date" value={filters.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold font-['DM_Sans'] text-[#2a2118] mb-1.5 flex items-center gap-1">
                <FiCalendar size={12} /> To
              </label>
              <input type="date" value={filters.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full rounded-full bg-white/10 border border-white/30 px-4 py-2 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/30">
            <span className="text-xs text-[#6b5f55] font-['DM_Sans'] self-center">Quick:</span>
            <button onClick={() => setQuickDate(0)} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/30 text-[#2a2118] font-['DM_Sans'] hover:bg-white/20 transition-all">Today</button>
            <button onClick={() => setQuickDate(7)} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/30 text-[#2a2118] font-['DM_Sans'] hover:bg-white/20 transition-all">Last 7 Days</button>
            <button onClick={() => setQuickDate(30)} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/30 text-[#2a2118] font-['DM_Sans'] hover:bg-white/20 transition-all">Last 30 Days</button>
          </div>

          {/* Active Filters Indicator */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/30">
              <span className="text-[10px] text-[#6b5f55] font-['DM_Sans']">Active filters ({activeFilterCount}):</span>
              {Object.entries(filters).map(([key, value]) => value && (
                <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-medium text-blue-600 font-['DM_Sans']">
                  {key.replace('_', ' ')}: {value}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats Bar - Glass */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-['DM_Sans'] text-[#6b5f55]">
            {logs.length > 0 ? (
              <>Showing <span className="font-semibold text-[#2a2118]">{logs.length}</span> of <span className="font-semibold text-[#2a2118]">{pagination.total || 0}</span> logs</>
            ) : (
              <>No logs found</>
            )}
            {pagination.totalPages > 1 && ` • Page ${pagination.page} of ${pagination.totalPages}`}
          </div>
          <button onClick={() => fetchLogs(filters, 1)} className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 hover:bg-white/30 transition-all">
            <FiRefreshCw size={14} className="text-[#2a2118]" />
          </button>
        </div>

        {/* AG Grid - Glass Theme Override */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden">
          <div className="ag-theme-alpine" style={{ height: 'calc(90vh - 280px)', minHeight: '500px', width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={logs}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              pagination={true}
              paginationPageSize={25}
              paginationPageSizeSelector={[10, 25, 50, 100]}
              onPaginationChanged={onPaginationChanged}
              overlayLoadingTemplate={`
                <div class="flex items-center justify-center p-8">
                  <div class="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <span class="ml-3 text-sm font-['DM_Sans'] text-[#6b5f55]">Loading logs...</span>
                </div>
              `}
              overlayNoRowsTemplate={`
                <div class="flex flex-col items-center justify-center p-12">
                  <svg class="w-12 h-12 text-[#6b5f55]/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-md font-['DM_Sans'] text-[#6b5f55]">No login logs found</p>
                  <p class="text-xs text-[#6b5f55]/60 mt-1 font-['DM_Sans']">Try adjusting your filters</p>
                </div>
              `}
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for AG Grid Glass Theme */}
      <style jsx>{`
        :global(.ag-theme-alpine) {
          --ag-background-color: transparent !important;
          --ag-header-background-color: rgba(255, 255, 255, 0.1) !important;
          --ag-row-hover-color: rgba(255, 255, 255, 0.1) !important;
          --ag-border-color: rgba(255, 255, 255, 0.2) !important;
          --ag-header-foreground-color: #2a2118 !important;
          --ag-foreground-color: #2a2118 !important;
          --ag-secondary-foreground-color: #6b5f55 !important;
          --ag-font-family: 'DM Sans', sans-serif !important;
          --ag-font-size: 13px !important;
        }
        :global(.ag-theme-alpine .ag-header-cell-text) {
          font-weight: 600 !important;
          font-family: 'DM Sans', sans-serif !important;
          color: #2a2118 !important;
        }
        :global(.ag-theme-alpine .ag-row) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
        }
        :global(.ag-theme-alpine .ag-cell) {
          font-family: 'DM Sans', sans-serif !important;
        }
        :global(.ag-theme-alpine .ag-paging-panel) {
          background: rgba(255, 255, 255, 0.05) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
          font-family: 'DM Sans', sans-serif !important;
          color: #2a2118 !important;
        }
        :global(.ag-theme-alpine .ag-paging-button) {
          color: #2a2118 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginLogs;