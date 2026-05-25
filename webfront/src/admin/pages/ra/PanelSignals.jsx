// import React, { useEffect, useState, useRef } from "react";
// import { MoreVertical, Plus } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import viewIcon from "../../../assets/card/view.svg";
// import editIcon from "../../../assets/card/edit.svg";
// import deleteIcon from "../../../assets/card/delete.svg";
// import DeleteConfirmModal from "../../components/modals/DeleteModal";
// import CreateSignal from "../../components/modals/CreateSignal";
// import PriceLevels from "../../components/modals/PricesLevels";

// export default function PanelSignals() {
//     const [signals, setSignals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [dropdownOpen, setDropdownOpen] = useState(null);
//     const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedSignal, setSelectedSignal] = useState(null);
//     const [isCreatingSignal, setIsCreatingSignal] = useState(false);
//     const [currentStep, setCurrentStep] = useState(0);
//     const [signalFormData, setSignalFormData] = useState({});

//     const apiUrl = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();

//     const buttonRefs = useRef([]);
//     const dropdownRef = useRef(null);

//     const user = localStorage.getItem("user");
//     const userId = user ? JSON.parse(user).id : null;

//     // Function to fetch signals
//     const fetchSignals = async () => {
//         try {
//             const res = await axios.get(`${apiUrl}/signals/get-signals/${userId}`);
//             const data = res.data.data;
//             if (Array.isArray(data)) {
//                 setSignals(data);
//             } else if (data) {
//                 setSignals([data]);
//             } else {
//                 setSignals([]);
//             }
//         } catch (err) {
//             console.error(err);
//             setError("Server error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (userId) fetchSignals();
//     }, [userId]);

//     useEffect(() => {
//         const handleClick = (e) => {
//             if (dropdownOpen === null) return;

//             const btn = buttonRefs.current[dropdownOpen];
//             const menu = dropdownRef.current;

//             if (
//                 (btn && btn.contains(e.target)) ||
//                 (menu && menu.contains(e.target))
//             ) {
//                 return;
//             }
//             setDropdownOpen(null);
//         };

//         document.addEventListener("click", handleClick, true);
//         return () => document.removeEventListener("click", handleClick, true);
//     }, [dropdownOpen]);

//     const handleView = (signal) => {
//         navigate(`/admin/signals/details/${signal?.id || ""}`, { state: { signal } });
//         setDropdownOpen(null);
//     };

//     const handleEdit = (signal) => {
//         console.log("Edit signal:", signal);
//         setDropdownOpen(null);
//     };

//     const confirmDelete = async () => {
//         try {
//             if (!userId || !selectedSignal) return;

//             await axios.delete(`${apiUrl}/signals/${selectedSignal.id}`, {
//                 headers: { "Content-Type": "application/json" },
//                 data: { userId },
//             });

//             setSignals((prev) => prev.filter((p) => p.id !== selectedSignal.id));
//             setDeleteModalOpen(false);
//             setSelectedSignal(null);
//         } catch (error) {
//             console.error("Error deleting signal:", error);
//         }
//     };

//     const toggleDropdown = (index) => {
//         const rect = buttonRefs.current[index]?.getBoundingClientRect();
//         if (rect) {
//             setDropdownPosition({
//                 top: rect.bottom + window.scrollY,
//                 left: rect.right - 130,
//             });
//         }
//         setDropdownOpen((prev) => (prev === index ? null : index));
//     };

//     const handleAddSignalClick = () => {
//         setIsCreatingSignal(true);
//         setCurrentStep(1);
//         setSignalFormData({});
//     };

//     const handleCreateSignalNext = (data) => {
//         setSignalFormData(data);
//         setCurrentStep(2);
//     };

//     const handlePriceLevelsSubmit = async (priceData) => {
//         try {
//             // Combine data from both forms
//             const finalData = {
//                 ...signalFormData,
//                 ...priceData,
//                 userId: userId
//             };

//             console.log("Final data to submit:", finalData);

//             // Submit to create signal
//             const response = await axios.post(`${apiUrl}/signals/create-signal`, finalData, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             });

//             console.log("Signal created successfully:", response.data);
            
//             // Close all modals
//             handleCloseModals();
            
//             // Immediately fetch updated signals list
//             await fetchSignals();
            
//             // Show success message (you can add toast here if needed)
//             alert("Signal created successfully!");

//         } catch (error) {
//             console.error("Error creating signal:", error);
//             alert("Failed to create signal. Please try again.");
//         }
//     };

//     const handleCloseModals = () => {
//         setIsCreatingSignal(false);
//         setCurrentStep(0);
//         setSignalFormData({});
//     };

//     const handleSignalCreated = (newSignal) => {
//         // Add the new signal to the beginning of the list
//         setSignals(prev => [newSignal, ...prev]);
//         handleCloseModals();
//     };

//     // 🇮🇳 Convert to IST Date
//     const formatISTDate = (dateString) => {
//         if (!dateString) return "-";

//         return new Date(dateString).toLocaleDateString("en-IN", {
//             timeZone: "Asia/Kolkata",
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     // 🇮🇳 Convert to IST Time
//     const formatISTTime = (dateString) => {
//         if (!dateString) return "-";

//         return new Date(dateString).toLocaleTimeString("en-IN", {
//             timeZone: "Asia/Kolkata",
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//         });
//     };

//     return (
//         <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
//             <div className="flex justify-between items-start mb-4">
//                 <div>
//                     <h2 className="text-3xl font-semibold text-gray-900">Signals</h2>
//                     <p className="text-md text-gray-500">All Signal List</p>
//                 </div>

//                 <button
//                     onClick={handleAddSignalClick}
//                     className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
//                 >
//                     <Plus size={16} />
//                     Add Signal
//                 </button>
//             </div>

//             {loading ? (
//                 <div className="text-center text-gray-500 py-8">Loading...</div>
//             ) : error ? (
//                 <div className="text-center text-red-500 py-8">{error}</div>
//             ) : signals.length === 0 ? (
//                 <div className="text-center text-gray-500 py-8">No signals found.</div>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border-separate border-spacing-y-2 border-gray-200">
//                         <thead>
//                             <tr className="text-left text-gray-500 text-md border-t border-gray-200">
//                                 <th className="px-4 py-2">Symbol ↓</th>
//                                 <th className="px-4 py-2">Trade Direction ↓</th>
//                                 <th className="px-4 py-2">Entry Price ↓</th>
//                                 <th className="px-4 py-2">Stop Loss(SL) ↓</th>
//                                 <th className="px-4 py-2">Target 1 ↓</th>
//                                 <th className="px-4 py-2">Date ↓</th>
//                                 <th className="px-4 py-2">Time ↓</th>
//                                 <th className="px-4 py-2 text-right"></th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {signals.map((signal, index) => (
//                                 <tr key={signal.id || index} className="bg-gray-50 hover:bg-gray-100">
//                                     <td className="px-4 py-3 flex items-center gap-2">
//                                         <span className="font-medium">{signal.instrument}</span>
//                                     </td>

//                                     <td className="px-4 py-3">{signal.tradeDirection}</td>
//                                     <td className="px-4 py-3">{signal.entryPrice}</td>
//                                     <td className="px-4 py-3">{signal.stopLoss}</td>
//                                     <td className="px-4 py-3">{signal.targetFirst}</td>
//                                     <td className="px-4 py-3">
//                                         {formatISTDate(signal.createdAt)}
//                                     </td>

//                                     <td className="px-4 py-3">
//                                         {formatISTTime(signal.createdAt)}
//                                     </td>

//                                     <td className="px-4 py-3 text-right">
//                                         <button
//                                             ref={(el) => (buttonRefs.current[index] = el)}
//                                             onClick={() => toggleDropdown(index)}
//                                         >
//                                             <MoreVertical size={18} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {dropdownOpen !== null && (
//                         <div
//                             ref={dropdownRef}
//                             className="fixed bg-white border border-gray-200 rounded-lg shadow-xl w-40 -ml-10 mt-1 z-[1000] backdrop-blur-sm "
//                             style={{
//                                 top: dropdownPosition.top,
//                                 left: dropdownPosition.left,
//                             }}
//                         >
//                             <button
//                                 onClick={() => handleView(signals[dropdownOpen])}
//                                 className="flex items-center w-full px-4 py-3 text-md text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
//                             >
//                                 <img src={viewIcon} alt="view" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
//                                 <span className="font-medium">View </span>
//                             </button>

//                             <button
//                                 onClick={() => handleEdit(signals[dropdownOpen])}
//                                 className="flex items-center w-full px-4 py-3 text-md text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
//                             >
//                                 <img src={editIcon} alt="edit" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
//                                 <span className="font-medium">Edit</span>
//                             </button>

//                             <div className="border-t border-gray-100 my-1"></div>

//                             <button
//                                 onClick={() => {
//                                     setSelectedSignal(signals[dropdownOpen]);
//                                     setDeleteModalOpen(true);
//                                     setDropdownOpen(null);
//                                 }}
//                                 className="flex items-center w-full px-4 py-3 text-md text-gray-700   hover:text-red-800 transition-all duration-150 ease-out group"
//                             >
//                                 <img src={deleteIcon} alt="delete" className="inline-block w-5 h-5 mr-3 text-red-400 group-hover:text-red-600" />
//                                 <span className="font-medium">Delete</span>
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Create Signal Modal */}
//             {isCreatingSignal && currentStep === 1 && (
//                 <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//                     <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//                         <CreateSignal
//                             data={signalFormData}
//                             onNext={handleCreateSignalNext}
//                             onClose={handleCloseModals}
//                             onSignalCreated={handleSignalCreated}
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* Price Levels Modal */}
//             {isCreatingSignal && currentStep === 2 && (
//                 <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//                     <div className="bg-white rounded-xl shadow-2xl w-[680px] mx-4">
//                         <PriceLevels
//                             data={{}}
//                             parentData={signalFormData}
//                             onSubmit={handlePriceLevelsSubmit}
//                             onClose={handleCloseModals}
//                         />
//                     </div>
//                 </div>
//             )}

//            <DeleteConfirmModal
//                 open={deleteModalOpen}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={confirmDelete}
//                 title="Delete Signal?"
//                 description="This action will permanently remove the signal and it will no longer be visible to users."
//             />
//         </div>
//     );
// }





import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Plus, Filter, Edit } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import viewIcon from "../../../assets/card/view.svg";
import editIcon from "../../../assets/card/edit.svg";
import deleteIcon from "../../../assets/card/delete.svg";
import DeleteConfirmModal from "../../components/modals/DeleteModal";
import CreateSignal from "../../components/modals/CreateSignal";
import EditSignal from "../../components/modals/EditSignal"; // New import
import PriceLevels from "../../components/modals/PricesLevels";
import EditPriceLevels from "../../components/modals/EditPriceLevels"; // New import
import FilterComponent from "../../components/filters/PlanFilter";
import Filters from "../../../assets/card/filter.svg";

// ✅ Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function PanelSignals() {
    const [signals, setSignals] = useState([]);
    const [filteredSignals, setFilteredSignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const gridRef = useRef();
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSignal, setSelectedSignal] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [isCreatingSignal, setIsCreatingSignal] = useState(false);
    const [isEditingSignal, setIsEditingSignal] = useState(false); // New state
    const [currentStep, setCurrentStep] = useState(0);
    const [signalFormData, setSignalFormData] = useState({});

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;

    // 🇮🇳 Convert to IST Date
    const formatISTDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // 🇮🇳 Convert to IST Time
    const formatISTTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // AG Grid Column Definitions
    const columnDefs = useMemo(() => [
        {
            headerName: "Symbol",
            field: "instrument",
            minWidth: 150,
            cellRenderer: (params) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{params.value || "N/A"}</span>
                    {params.data.instrument_type && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {params.data.instrument_type}
                        </span>
                    )}
                </div>
            ),
            sortable: true,
            filter: true,
        },
        {
            headerName: "Trade Direction",
            field: "trade_direction",
            minWidth: 140,
            cellRenderer: (params) => {
                const isBuy = params.value === "BUY";
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isBuy 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                    }`}>
                        {params.value || "N/A"}
                    </span>
                );
            },
            sortable: true,
            filter: true,
        },
        {
            headerName: "Entry Price",
            field: "entry_price",
            minWidth: 120,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Stop Loss",
            field: "stop_loss",
            minWidth: 120,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Target 1",
            field: "target_first",
            minWidth: 120,
            sortable: true,
            filter: true,
        },
        {
            headerName: "Date",
            field: "created_at",
            minWidth: 130,
            valueFormatter: (params) => formatISTDate(params.value),
            sortable: true,
            filter: true,
        },
        {
            headerName: "Time",
            field: "created_at",
            minWidth: 120,
            valueFormatter: (params) => formatISTTime(params.value),
            sortable: true,
            filter: true,
        },
        {
            headerName: "Actions",
            width: 100,
            cellRenderer: (params) => (
                <div className="flex gap-1 justify-end">
                    <button
                        onClick={() => handleView(params.data)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all text-md"
                        title="View"
                    >
                        <img src={viewIcon} alt="View" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleEdit(params.data)}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-all text-md"
                        title="Edit"
                    >
                        <img src={editIcon} alt="Edit" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(params.data)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all text-md"
                        title="Delete"
                    >
                        <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                    </button>
                </div>
            ),
            sortable: false,
            filter: false,
            pinned: 'right',
        }
    ], []);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    }), []);

    // Function to fetch signals
    const fetchSignals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/signals/get-signals/${userId}`);
            const data = res.data.data;
            console.log("Fetched signals data:", data);
            
            let signalsData = [];
            if (Array.isArray(data)) {
                signalsData = data;
            } else if (data) {
                signalsData = [data];
            }
            
            setSignals(signalsData);
            setFilteredSignals(signalsData);
        } catch (err) {
            console.error(err);
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchSignals();
    }, [userId]);

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    }, []);

    const handleView = (signal) => {
        navigate(`/admin/signals/details/${signal?.id || ""}`, { state: { signal } });
    };

    const handleEdit = (signal) => {
        console.log("Edit signal:", signal);
        setSelectedSignal(signal);
        
        // Map signal data to form data format
        const formData = {
            id: signal.id,
            segment: signal.segment || '',
            instrument: signal.instrument || '',
            script: signal.script || '',
            scriptToken: signal.script_token || '',
            scriptName: signal.script_name || '',
            expiry: signal.expiry || '',
            instrumentType: signal.instrument_type || '',
            strike_price: signal.strike_price || '',
            tradeDirection: signal.trade_direction || '',
            exchange: signal.exchange || '',
            duration: signal.duration || '',
            riskRewardRatio: signal.risk_reward_ratio || '',
            position_status: signal.position_status || '',
            subscriptionPlan: signal.subscription_plan || ''
        };
        
        setSignalFormData(formData);
        setIsEditingSignal(true);
        setCurrentStep(1);
    };

    const handleDelete = (signal) => {
        setSelectedSignal(signal);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (!userId || !selectedSignal) return;

            await axios.delete(`${apiUrl}/signals/${selectedSignal.id}`, {
                headers: { "Content-Type": "application/json" },
                data: { userId },
            });

            if (gridApi) {
                gridApi.applyTransaction({ remove: [selectedSignal] });
            }
            
            setDeleteModalOpen(false);
            setSelectedSignal(null);
            fetchSignals(); // Refresh data
        } catch (error) {
            console.error("Error deleting signal:", error);
            setError("Failed to delete signal");
        }
    };

    const handleOpenFilter = () => {
        setFilterOpen(true);
    };

    const handleCloseFilter = () => {
        setFilterOpen(false);
    };

    const handleApplyFilter = (filters) => {
        let filtered = [...signals];
        
        if (filters.status) {
            filtered = filtered.filter(signal => signal.status === filters.status);
        }
        
        setFilteredSignals(filtered);
        handleCloseFilter();
    };

    const handleResetFilter = () => {
        setFilteredSignals(signals);
        handleCloseFilter();
    };

    const handleAddSignalClick = () => {
        setIsCreatingSignal(true);
        setIsEditingSignal(false);
        setCurrentStep(1);
        setSignalFormData({});
    };

    const handleCreateSignalNext = (data) => {
        setSignalFormData(data);
        setCurrentStep(2);
    };

    const handleEditSignalNext = (data) => {
        setSignalFormData(prev => ({ ...prev, ...data }));
        setCurrentStep(2);
    };

    const handlePriceLevelsSubmit = async (priceData) => {
        try {
            const finalData = {
                ...signalFormData,
                ...priceData,
                userId: userId
            };

            console.log("Final data to submit:", finalData);

            const response = await axios.post(`${apiUrl}/signals/create-signal`, finalData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Signal created successfully:", response.data);
            handleCloseModals();
            await fetchSignals();
            alert("Signal created successfully!");
        } catch (error) {
            console.error("Error creating signal:", error);
            alert("Failed to create signal. Please try again.");
        }
    };

    const handleEditPriceLevelsSubmit = async (priceData) => {
        try {
            const finalData = {
                ...signalFormData,
                ...priceData,
                userId: userId,
                signalId: selectedSignal?.id // Include signal ID for update
            };

            console.log("Final data to update:", finalData);

            // Use PUT request for update
            const response = await axios.put(`${apiUrl}/signals/update-signal/${selectedSignal.id}`, finalData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Signal updated successfully:", response.data);
            handleCloseModals();
            await fetchSignals();
            alert("Signal updated successfully!");
        } catch (error) {
            console.error("Error updating signal:", error);
            alert("Failed to update signal. Please try again.");
        }
    };

    const handleCloseModals = () => {
        setIsCreatingSignal(false);
        setIsEditingSignal(false);
        setCurrentStep(0);
        setSignalFormData({});
        setSelectedSignal(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Signals</h2>
                    <p className="text-md text-gray-500">All Signal List</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleOpenFilter}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <img src={Filters} alt="Filter" className="w-4 h-4" />
                        Filter
                    </button>
                    <button
                        onClick={handleAddSignalClick}
                        className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2.5 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all shadow-lg"
                    >
                        <Plus size={18} />
                        Add Signal
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Loading signals...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="text-center py-16">
                    <div className="text-xl font-semibold text-red-600 mb-6">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            ) : filteredSignals.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-4xl mb-6 opacity-20">📡</div>
                    <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Signals Found</h3>
                    <p className="text-gray-500 mb-8">Get started by creating your first signal.</p>
                    <button
                        onClick={handleAddSignalClick}
                        className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium"
                    >
                        Create First Signal
                    </button>
                </div>
            ) : (
                <div className="ag-theme-quartz border rounded-xl shadow-sm" style={{ height: 650, width: "100%" }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={filteredSignals}
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

            {/* Filter Component */}
            <FilterComponent
                open={filterOpen}
                onClose={handleCloseFilter}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
            />

            {/* Create Signal Modal */}
            {isCreatingSignal && currentStep === 1 && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <CreateSignal
                            data={signalFormData}
                            onNext={handleCreateSignalNext}
                            onClose={handleCloseModals}
                            onSignalCreated={() => fetchSignals()}
                        />
                    </div>
                </div>
            )}

            {/* Edit Signal Modal */}
            {isEditingSignal && currentStep === 1 && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <EditSignal
                            data={signalFormData}
                            onNext={handleEditSignalNext}
                            onClose={handleCloseModals}
                            onSignalUpdated={() => fetchSignals()}
                        />
                    </div>
                </div>
            )}

            {/* Create Price Levels Modal */}
            {isCreatingSignal && currentStep === 2 && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl w-[680px] mx-4">
                        <PriceLevels
                            data={{}}
                            parentData={signalFormData}
                            onSubmit={handlePriceLevelsSubmit}
                            onClose={handleCloseModals}
                        />
                    </div>
                </div>
            )}

            {/* Edit Price Levels Modal */}
            {isEditingSignal && currentStep === 2 && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl w-[680px] mx-4">
                        <EditPriceLevels
                            data={{
                                entryPrice: selectedSignal?.entry_price,
                                stopLoss: selectedSignal?.stop_loss,
                                targetFirst: selectedSignal?.target_first,
                                targetSecond: selectedSignal?.target_second,
                                targetThird: selectedSignal?.target_third
                            }}
                            parentData={signalFormData}
                            onSubmit={handleEditPriceLevelsSubmit}
                            onClose={handleCloseModals}
                        />
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Signal?"
                description="This action will permanently remove the signal and it will no longer be visible to users."
            />
        </div>
    );
}