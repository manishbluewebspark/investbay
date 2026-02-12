// import { summaryCards, earningsTable } from "../../../data/earningsData";
// import { HiOutlineFilter } from "react-icons/hi";
// import { FiEye } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// export default function Earnings() {
//     const navigate = useNavigate();


//     const handleView = (row) => {
//         if (row.type === "Course") {
//             navigate("/admin/earnings/course-view", { state: row });
//         } else if (row.type === "Plan") {
//             navigate("/admin/earnings/plan-view", { state: row });
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             {/* Top Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 {summaryCards.map((card, index) => {
//                     const Icon = card.icon;
//                     return (
//                         <div
//                             key={index}
//                             className="bg-white rounded-xl px-6 py-5 shadow-sm border border-gray-300"
//                         >
//                             <div className="flex items-start gap-4">
//                                 <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
//                                     <Icon size={22} />
//                                 </div>

//                                 <div>
//                                     <p className="text-sm text-gray-500">{card.title}</p>
//                                     <h2 className="text-xl font-semibold text-gray-900">
//                                         {card.amount}
//                                     </h2>
//                                     <p className="text-xs text-gray-400">
//                                         {card.subtitle}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Earnings Table - Updated with Plan UI styling */}
//             <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
//                 {/* Header - kept original */}
//                 <div className="flex items-center justify-between px-6 py-4">
//                     <div>
//                         <h3 className="text-2xl font-semibold text-gray-800">
//                             RA Earning
//                         </h3>
//                         <p className="text-md text-gray-400">
//                             Earning History
//                         </p>
//                     </div>

//                     <button className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50">
//                         <HiOutlineFilter size={16} />
//                         Filter
//                     </button>
//                 </div>

//                 {/* Table - Updated with Plan styling */}
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border-separate border-spacing-y-2 border-gray-200">
//                         <thead>
//                             <tr className="text-left text-gray-500 text-sm border-t border-gray-200">
//                                 <th className="px-4 py-2">User Name ↓</th>
//                                 <th className="px-4 py-2">Plan / Course Name ↓</th>
//                                 <th className="px-4 py-2">Type ↓</th>
//                                 <th className="px-4 py-2">Purchase Date ↓</th>
//                                 <th className="px-4 py-2">Amount Paid ↓</th>
//                                 <th className="px-4 py-2 text-right"></th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {earningsTable.map((item, index) => (
//                                 <tr key={item.id || index} className="bg-gray-50 hover:bg-gray-100">
//                                     {/* User */}
//                                     <td className="px-4 py-3 flex items-center gap-2">
//                                         <img
//                                             src={item.avatar}
//                                             alt={item.name}
//                                             className="w-7 h-7 rounded-full object-cover"
//                                         />
//                                         <span className="font-medium">{item.name}</span>
//                                     </td>

//                                     {/* Plan */}
//                                     <td className="px-4 py-3">{item.plan}</td>

//                                     {/* Type Badge */}
//                                     <td className="px-4 py-3">
//                                         <span
//                                             className={`text-sm px-2 py-1 rounded-full ${item.type === "Plan"
//                                                     ? "text-orange-700 bg-orange-50"
//                                                     : "text-blue-700 bg-blue-50"
//                                                 }`}
//                                         >
//                                             {item.type}
//                                         </span>
//                                     </td>

//                                     {/* Date */}
//                                     <td className="px-4 py-3">{item.date}</td>

//                                     {/* Amount */}
//                                     <td className="px-4 py-3 font-medium">{item.amount}</td>

//                                     {/* Action */}
//                                     <td className="px-4 py-3 text-right">
//                                         <button
//                                             onClick={() => handleView(item)}
//                                             className="hover:bg-gray-200 p-1 rounded"
//                                         >
//                                             <FiEye size={18} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }



import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { HiOutlineFilter } from "react-icons/hi";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { summaryCards, earningsTable } from "../../../data/earningsData";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Filters from "../../../assets/card/filter.svg"; // Add this import if you have it

// ✅ Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Earnings() {
    const [earnings, setEarnings] = useState([]);
    const [filteredEarnings, setFilteredEarnings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const gridRef = useRef();
    const [filterOpen, setFilterOpen] = useState(false);
    const navigate = useNavigate();

    // Load earnings data on mount
    useEffect(() => {
        setEarnings(earningsTable);
        setFilteredEarnings(earningsTable);
        setLoading(false);
    }, []);

    const handleView = (row) => {
        if (row.type === "Course") {
            navigate("/admin/earnings/course-view", { state: row });
        } else if (row.type === "Plan") {
            navigate("/admin/earnings/plan-view", { state: row });
        }
    };

    // AG Grid Column Definitions
    const columnDefs = useMemo(() => [
        {
            headerName: "User Name",
            field: "name",
            minWidth: 200,
            // cellRenderer: (params) => (
            //     <div className="flex items-center gap-2">
            //         <img
            //             src={params.data.avatar}
            //             alt={params.value}
            //             className="w-7 h-7 rounded-full object-cover"
            //         />
            //         <span className="font-medium">{params.value || "N/A"}</span>
            //     </div>
            // ),
            sortable: true,
            filter: true,
        },
        {
            headerName: "Plan / Course Name",
            field: "plan",
            minWidth: 250,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Type",
            field: "type",
            minWidth: 120,
            cellRenderer: (params) => {
                const isPlan = params.value === "Plan";
                return (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                        isPlan 
                            ? "text-orange-700 bg-orange-50" 
                            : "text-blue-700 bg-blue-50"
                    }`}>
                        {params.value || "N/A"}
                    </span>
                );
            },
            sortable: true,
            filter: true,
        },
        {
            headerName: "Purchase Date",
            field: "date",
            minWidth: 150,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Amount Paid",
            field: "amount",
            minWidth: 140,
            cellClass: "font-medium",
            sortable: true,
            filter: true,
        },
        {
            headerName: "Actions",
            width: 80,
            cellRenderer: (params) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => handleView(params.data)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all text-sm"
                        title="View"
                    >
                        <FiEye size={18} />
                    </button>
                </div>
            ),
            sortable: false,
            filter: false,
            pinned: 'right',
        }
    ], [navigate]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    }), []);

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    }, []);

    const handleOpenFilter = () => {
        setFilterOpen(true);
    };

    const handleCloseFilter = () => {
        setFilterOpen(false);
    };

    const handleApplyFilter = (filters) => {
        let filtered = [...earnings];
        
        // Add your filter logic here based on earnings data
        if (filters.type) {
            filtered = filtered.filter(earning => earning.type === filters.type);
        }
        if (filters.dateRange) {
            // Implement date range filtering
        }
        
        setFilteredEarnings(filtered);
        handleCloseFilter();
    };

    const handleResetFilter = () => {
        setFilteredEarnings(earnings);
        handleCloseFilter();
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Top Cards - UNCHANGED */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {summaryCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl px-6 py-5 shadow-sm border border-gray-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{card.title}</p>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {card.amount}
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Earnings Grid - AG Grid Implementation */}
            <div className="bg-white rounded-xl shadow-sm p-6 relative">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">RA Earning</h3>
                        <p className="text-sm text-gray-500">Earning History</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleOpenFilter}
                            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <HiOutlineFilter size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-lg text-gray-600">Loading earnings...</p>
                        </div>
                    </div>
                ) : filteredEarnings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-6 opacity-20">💰</div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Earnings Found</h3>
                        <p className="text-gray-500 mb-8">No earning records available.</p>
                    </div>
                ) : (
                    <div className="ag-theme-quartz border rounded-xl shadow-sm" style={{ height: 650, width: "100%" }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={filteredEarnings}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            animateRows={true}
                            pagination={true}
                            paginationPageSize={15}
                            paginationPageSizeSelector={[10, 15, 25, 50]}
                        />
                    </div>
                )}
            </div>

            {/* Filter Component - Add your FilterComponent here if available */}
            {/* 
            <FilterComponent
                open={filterOpen}
                onClose={handleCloseFilter}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
            />
            */}
        </div>
    );
}
