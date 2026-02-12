

// import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import axios from 'axios';

// const AdminLoginLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     role: '',
//     action: '',
//     start_date: '',
//     end_date: ''
//   });
//   const gridRef = useRef();

//   // Column Definitions for AG Grid
//   const columnDefs = useMemo(() => [
//     {
//       field: 'user_name',
//       headerName: 'User',
//       flex: 2,
//       minWidth: 200,
//       valueGetter: (params) => params.data?.user_name || 'N/A',
//       cellRenderer: (params) => (
//         <div className="flex flex-col justify-center h-full">
//           <div className="font-medium text-gray-900 text-sm">{params.value}</div>
//           {params.data?.user_email && (
//             <div className="text-xs text-gray-500">{params.data.user_email}</div>
//           )}
//         </div>
//       )
//     },
//     {
//       field: 'role',
//       headerName: 'Role',
//       flex: 1,
//       minWidth: 120,
//       cellRenderer: (params) => {
//         const role = params.value;
//         let bgClass, textClass;
//         if (role === 'ra') {
//           bgClass = 'bg-emerald-100'; textClass = 'text-emerald-800';
//         } else if (role === 'admin') {
//           bgClass = 'bg-blue-100'; textClass = 'text-blue-800';
//         } else {
//           bgClass = 'bg-gray-100'; textClass = 'text-gray-800';
//         }
//         return (
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgClass} ${textClass}`}>
//             {role?.toUpperCase() || 'USER'}
//           </span>
//         );
//       }
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       flex: 1,
//       minWidth: 130,
//       cellRenderer: (params) => {
//         const action = params.value;
//         let bgClass, textClass;
//         if (action === 'LOGIN') {
//           bgClass = 'bg-green-100'; textClass = 'text-green-800';
//         } else if (action === 'OTP_LOGIN') {
//           bgClass = 'bg-teal-100'; textClass = 'text-teal-800';
//         } else if (action === 'LOGOUT') {
//           bgClass = 'bg-orange-100'; textClass = 'text-orange-800';
//         } else {
//           bgClass = 'bg-red-100'; textClass = 'text-red-800';
//         }
//         return (
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgClass} ${textClass}`}>
//             {action?.replace('_', ' ') || 'N/A'}
//           </span>
//         );
//       }
//     },
//     {
//       field: 'ip_address',
//       headerName: 'IP Address',
//       flex: 1.2,
//       minWidth: 140,
//       cellClass: 'font-mono text-xs',
//       valueGetter: (params) => params.data?.ip_address || 'N/A'
//     },
//     {
//       field: 'created_at',
//       headerName: 'Timestamp',
//       flex: 1.5,
//       minWidth: 180,
//       valueFormatter: (params) => {
//         if (!params.value) return 'N/A';
//         return new Date(params.value).toLocaleString('en-IN', {
//           day: '2-digit',
//           month: 'short',
//           year: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//           hour12: true
//         });
//       }
//     }
//   ], []);

//   // Default column state - remove floating filters for cleaner UI
//   const defaultColDef = useMemo(() => ({
//     sortable: true,
//     resizable: true,
//     filter: false, // Disable column filters for cleaner UI
//   }), []);

//   const fetchLogs = useCallback(async (filterParams = filters) => {
//     try {
//       setLoading(true);
      
//       // Clean up empty filters
//       const cleanFilters = Object.fromEntries(
//         Object.entries(filterParams).filter(([_, value]) => value !== '')
//       );
      
//       const params = new URLSearchParams({
//         ...cleanFilters,
//         limit: 100,
//         page: 1
//       });
      
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/auth/login-logs?${params}`
//       );
      
//       const logsData = res.data.data || [];
//       setLogs(logsData);
      
//       // Update grid data
//       if (gridRef.current?.api) {
//         gridRef.current.api.setGridOption('rowData', logsData);
//       }
      
//     } catch (error) {
//       console.error('Error fetching logs:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   const onGridReady = useCallback((params) => {
//     gridRef.current = params;
//   }, []);

//   const handleFilterChange = useCallback((type, value) => {
//     setFilters(prev => ({ ...prev, [type]: value }));
//   }, []);

//   const applyFilters = useCallback(() => {
//     fetchLogs(filters);
//   }, [fetchLogs, filters]);

//   const clearFilters = useCallback(() => {
//     setFilters({
//       role: '',
//       action: '',
//       start_date: '',
//       end_date: ''
//     });
    
//     // Clear grid filters if any
//     if (gridRef.current?.api) {
//       gridRef.current.api.setFilterModel(null);
//     }
    
//     // Fetch all logs
//     fetchLogs({});
//   }, [fetchLogs]);

//   const refreshLogs = useCallback(() => {
//     fetchLogs(filters);
//   }, [fetchLogs, filters]);

//   useEffect(() => {
//     fetchLogs({});
//   }, []);

//   return (
//     <div className="p-6 max-w-7xl mx-auto relative">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Login Activity Logs</h1>
//           <p className="text-sm text-gray-500 mt-1">Track user login and logout activities</p>
//         </div>
//         <div className="flex gap-3">
//           <button 
//             onClick={refreshLogs}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 <span>Loading...</span>
//               </>
//             ) : (
//               <>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 <span>Refresh</span>
//               </>
//             )}
//           </button>
//           <button 
//             onClick={clearFilters}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             <span>Clear</span>
//           </button>
//         </div>
//       </div>

//       {/* Filters Section - Clean and necessary only */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//         <div className="flex flex-wrap items-end gap-4">
//           {/* Role Filter */}
//           <div className="w-48">
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Role
//             </label>
//             <select 
//               value={filters.role} 
//               onChange={(e) => handleFilterChange('role', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//             >
//               <option value="">All Roles</option>
//               <option value="user">User</option>
//               <option value="ra">RA</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           {/* Action Filter */}
//           <div className="w-48">
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Action
//             </label>
//             <select 
//               value={filters.action} 
//               onChange={(e) => handleFilterChange('action', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//             >
//               <option value="">All Actions</option>
//               <option value="LOGIN">Login</option>
//               <option value="LOGOUT">Logout</option>
//               {/* <option value="OTP_LOGIN">OTP Login</option> */}
//             </select>
//           </div>

//           {/* Date Range */}
//           <div className="w-40">
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               From Date
//             </label>
//             <input 
//               type="date" 
//               value={filters.start_date}
//               onChange={(e) => handleFilterChange('start_date', e.target.value)}
//               max={new Date().toISOString().split('T')[0]}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//             />
//           </div>

//           <div className="w-40">
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               To Date
//             </label>
//             <input 
//               type="date" 
//               value={filters.end_date}
//               onChange={(e) => handleFilterChange('end_date', e.target.value)}
//               min={filters.start_date}
//               max={new Date().toISOString().split('T')[0]}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//             />
//           </div>

//           {/* Apply Button */}
//           <div className="flex-1 flex justify-end">
//             <button 
//               onClick={applyFilters}
//               className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Bar */}
//       <div className="flex justify-between items-center mb-2 px-1">
//         <div className="text-sm text-gray-600">
//           Total Records: <span className="font-semibold text-gray-900">{logs.length}</span>
//         </div>
//         {Object.values(filters).some(v => v !== '') && (
//           <div className="text-sm text-blue-600">
//             Filters Active
//           </div>
//         )}
//       </div>

//       {/* AG Grid */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="ag-theme-alpine" style={{ height: '65vh', width: '100%' }}>
//           <AgGridReact
//             ref={gridRef}
//             rowData={logs}
//             columnDefs={columnDefs}
//             defaultColDef={defaultColDef}
//             animateRows={true}
//             pagination={true}
//             paginationPageSize={25}
//             paginationPageSizeSelector={[10, 25, 50, 100]}
//             onGridReady={onGridReady}
//             suppressCellFocus={true}
//             enableCellTextSelection={true}
//             ensureDomOrder={true}
//             rowHeight={60}
//             headerHeight={48}
//             overlayLoadingTemplate={
//               '<span class="ag-overlay-loading-center">Loading logs...</span>'
//             }
//             overlayNoRowsTemplate={
//               '<span class="ag-overlay-no-rows-center">No login logs found</span>'
//             }
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLoginLogs;


// pages/AdminLoginLogs.jsx


// import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import axios from 'axios';

// const AdminLoginLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [pagination, setPagination] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     role: '',
//     action: '',
//     start_date: '',
//     end_date: '',
//     user_id: ''
//   });
//   const gridRef = useRef();

//   // AG Grid Column Definitions
//   const columnDefs = useMemo(() => [
//     { 
//       field: 'user_name', 
//       headerName: 'User', 
//       flex: 2, 
//       minWidth: 200,
//       cellRenderer: (params) => (
//         <div className="flex flex-col">
//           <div className="font-medium text-sm">{params.value || 'N/A'}</div>
//           <div className="text-xs text-gray-500">{params.data?.user_email || ''}</div>
//         </div>
//       )
//     },
//     {
//       field: 'role',
//       headerName: 'Role',
//       flex: 1,
//       minWidth: 100,
//       cellRenderer: ({ value }) => {
//         const role = value;
//         const badges = {
//           user: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
//           ra: { bg: 'bg-emerald-100', text: 'text-emerald-800' }
//         };
//         const badge = badges[role] || { bg: 'bg-gray-100', text: 'text-gray-800' };
//         return (
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
//             {role?.toUpperCase() || 'N/A'}
//           </span>
//         );
//       }
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       flex: 1.2,
//       minWidth: 130,
//       cellRenderer: ({ value }) => {
//         const actions = {
//           LOGIN: { bg: 'bg-green-100', text: 'text-green-800' },
//           OTP_LOGIN: { bg: 'bg-teal-100', text: 'text-teal-800' },
//           LOGOUT: { bg: 'bg-orange-100', text: 'text-orange-800' }
//         };
//         const actionStyle = actions[value] || { bg: 'bg-gray-100', text: 'text-gray-800' };
//         return (
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionStyle.bg} ${actionStyle.text}`}>
//             {value?.replace('_', ' ') || 'N/A'}
//           </span>
//         );
//       }
//     },
//     {
//       field: 'ip_address',
//       headerName: 'IP Address',
//       flex: 1.2,
//       minWidth: 140,
//       cellClass: 'font-mono text-sm'
//     },
//     {
//       field: 'created_at',
//       headerName: 'Time',
//       flex: 1.8,
//       minWidth: 180,
//       valueFormatter: ({ value }) => 
//         value ? new Date(value).toLocaleString('en-IN') : 'N/A'
//     }
//   ], []);

//   const defaultColDef = useMemo(() => ({
//     sortable: true,
//     resizable: true,
//     filter: true
//   }), []);

//   // Fetch logs with filters
//   const fetchLogs = useCallback(async (currentFilters = filters, currentPage = 1) => {
//     try {
//       setLoading(true);
      
//       // Clean filters
//       const cleanFilters = Object.fromEntries(
//         Object.entries(currentFilters).filter(([_, v]) => v !== '')
//       );

//       const params = new URLSearchParams({
//         ...cleanFilters,
//         page: currentPage,
//         limit: 50
//       });

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/auth/login-logs?${params}`,
//         { timeout: 15000 }
//       );

//       setLogs(response.data.data || []);
//       setPagination(response.data.pagination || {});
      
//       // Update grid
//       if (gridRef.current?.api) {
//         gridRef.current.api.setGridOption('rowData', response.data.data || []);
//       }

//     } catch (error) {
//       console.error('Fetch logs error:', error);
//       setLogs([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Filter handlers
//   const handleFilterChange = useCallback((field, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   }, []);

//   const applyFilters = useCallback(() => {
//     fetchLogs(filters, 1);
//   }, [filters, fetchLogs]);

//   const clearFilters = useCallback(() => {
//     const emptyFilters = { role: '', action: '', start_date: '', end_date: '', user_id: '' };
//     setFilters(emptyFilters);
//     fetchLogs(emptyFilters, 1);
//   }, [fetchLogs]);

//   const onPaginationChanged = useCallback((params) => {
//     if (params.newPage) {
//       fetchLogs(filters, params.newPage);
//     }
//   }, [filters, fetchLogs]);

//   // Initial load
//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Login Activity Logs</h1>
//           <p className="text-gray-600 mt-1">Monitor user login and logout activities (Admin logs excluded)</p>
//         </div>
//         <div className="flex gap-3">
//           <button 
//             onClick={clearFilters}
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
//           >
//             Clear All
//           </button>
//           <button 
//             onClick={applyFilters}
//             className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//             <select 
//               value={filters.role}
//               onChange={(e) => handleFilterChange('role', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Roles</option>
//               <option value="user">User</option>
//               <option value="ra">Research Analyst</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
//             <select 
//               value={filters.action}
//               onChange={(e) => handleFilterChange('action', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Actions</option>
//               <option value="LOGIN">Password Login</option>
//               <option value="OTP_LOGIN">OTP Login</option>
//               <option value="LOGOUT">Logout</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
//             <input
//               type="number"
//               value={filters.user_id}
//               onChange={(e) => handleFilterChange('user_id', e.target.value)}
//               placeholder="Enter User ID"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//             <input
//               type="date"
//               value={filters.start_date}
//               onChange={(e) => handleFilterChange('start_date', e.target.value)}
//               max={new Date().toISOString().split('T')[0]}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//             <input
//               type="date"
//               value={filters.end_date}
//               onChange={(e) => handleFilterChange('end_date', e.target.value)}
//               max={new Date().toISOString().split('T')[0]}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="bg-gray-50 p-4 rounded-lg mb-6">
//         <div className="text-sm text-gray-600">
//           Showing {logs.length} of {pagination.total || 0} logs 
//           {pagination.totalPages && `(Page ${pagination.page} of ${pagination.totalPages})`}
//         </div>
//       </div>

//       {/* AG Grid */}
//       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//         <div className="ag-theme-alpine" style={{ height: '70vh', width: '100%' }}>
//           <AgGridReact
//             ref={gridRef}
//             rowData={logs}
//             columnDefs={columnDefs}
//             defaultColDef={defaultColDef}
//             animateRows={true}
//             pagination={true}
//             paginationPageSize={25}
//             paginationPageSizeSelector={[10, 25, 50]}
//             onPaginationChanged={onPaginationChanged}
//             loadingOverlayRenderer={() => (
//               <div className="flex items-center justify-center p-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                 <span className="ml-3">Loading logs...</span>
//               </div>
//             )}
//             noRowsOverlayRenderer={() => (
//               <div className="p-8 text-center text-gray-500">
//                 No login logs found matching your filters
//               </div>
//             )}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLoginLogs;


import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

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

  // AG Grid Column Definitions
  const columnDefs = useMemo(() => [
    { 
      field: 'user_name', 
      headerName: 'User', 
      flex: 2, 
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col">
          <div className="font-medium text-sm">{params.value || 'N/A'}</div>
          <div className="text-xs text-gray-500">{params.data?.user_email || ''}</div>
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
          user: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
          ra: { bg: 'bg-emerald-100', text: 'text-emerald-800' }
        };
        const badge = badges[role] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
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
          LOGIN: { bg: 'bg-green-100', text: 'text-green-800' },
          OTP_LOGIN: { bg: 'bg-teal-100', text: 'text-teal-800' },
          LOGOUT: { bg: 'bg-orange-100', text: 'text-orange-800' }
        };
        const actionStyle = actions[value] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionStyle.bg} ${actionStyle.text}`}>
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
      cellClass: 'font-mono text-sm'
    },
    {
      field: 'created_at',
      headerName: 'Time',
      flex: 1.8,
      minWidth: 180,
      valueFormatter: ({ value }) => 
        value ? new Date(value).toLocaleString('en-IN') : 'N/A'
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true
  }), []);

  // Fetch logs with filters
  const fetchLogs = useCallback(async (currentFilters = filters, currentPage = 1) => {
    try {
      setLoading(true);
      
      // Clean filters
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
      
      // Update grid
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption('rowData', response.data.data || []);
      }

    } catch (error) {
      console.error('Fetch logs error:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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
    if (params.newPage) {
      fetchLogs(filters, params.newPage);
    }
  }, [filters, fetchLogs]);

  // Initial load
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header - Compact */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Login Activity Logs</h1>
          <p className="text-xs text-gray-600 mt-0.5">Admin logs excluded</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearFilters}
            className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
          <button 
            onClick={applyFilters}
            className="px-4 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Apply
          </button>
        </div>
      </div>

      {/* Filters - Compact Grid */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {/* Role Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
            <select 
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="ra">RA</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Action</label>
            <select 
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="OTP_LOGIN">OTP Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>

          {/* User ID Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">User ID</label>
            <input
              type="number"
              value={filters.user_id}
              onChange={(e) => handleFilterChange('user_id', e.target.value)}
              placeholder="Enter ID"
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Active Filters Indicator */}
        {Object.values(filters).some(v => v !== '') && (
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
            <span className="text-[10px] text-gray-500">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <span key={key} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-[10px] font-medium text-blue-700">
                  {key.replace('_', ' ')}: {value}
                </span>
              )
            )}
          </div>
        )}
      </div>

      {/* Stats - Compact */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-gray-600">
          {logs.length > 0 ? (
            <>Showing {logs.length} of {pagination.total || 0} logs</>
          ) : (
            <>No logs found</>
          )}
          {pagination.totalPages > 1 && ` • Page ${pagination.page} of ${pagination.totalPages}`}
        </div>
        
        {/* Quick Date Filters */}
        <div className="flex gap-1">
          <button 
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              handleFilterChange('start_date', today);
              handleFilterChange('end_date', today);
            }}
            className="px-2 py-1 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Today
          </button>
          <button 
            onClick={() => {
              const date = new Date();
              date.setDate(date.getDate() - 7);
              handleFilterChange('start_date', date.toISOString().split('T')[0]);
              handleFilterChange('end_date', '');
            }}
            className="px-2 py-1 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Last 7d
          </button>
          <button 
            onClick={() => {
              const date = new Date();
              date.setDate(date.getDate() - 30);
              handleFilterChange('start_date', date.toISOString().split('T')[0]);
              handleFilterChange('end_date', '');
            }}
            className="px-2 py-1 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Last 30d
          </button>
        </div>
      </div>

      {/* AG Grid */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="ag-theme-alpine" style={{ height: 'calc(90vh - 240px)', minHeight: '500px', width: '100%' }}>
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
            loadingOverlayRenderer={() => (
              <div className="flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-sm text-gray-600">Loading logs...</span>
              </div>
            )}
            noRowsOverlayRenderer={() => (
              <div className="p-6 text-center text-sm text-gray-500">
                <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No login logs found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginLogs;
