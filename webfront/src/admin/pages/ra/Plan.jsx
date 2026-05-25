// import React, { useEffect, useState, useRef } from "react";
// import { MoreVertical, Plus } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import viewIcon from "../../../assets/card/view.svg";
// import editIcon from "../../../assets/card/edit.svg";
// import deleteIcon from "../../../assets/card/delete.svg";
// import DeleteConfirmModal from "../../components/modals/DeleteModal"; 

// export default function Plan() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null); 

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   const buttonRefs = useRef([]);
//   const dropdownRef = useRef(null);

//   const user = localStorage.getItem("user");
//   const userId = user ? JSON.parse(user).id : null;

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/plans/${userId}`);
//         const data = res.data.data;
//         if (Array.isArray(data)) {
//           setPlans(data);
//         } else if (data) {
//           setPlans([data]);
//         } else {
//           setPlans([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Server error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) fetchPlans();
//   }, [userId]);

//   useEffect(() => {
//     const handleClick = (e) => {
//       if (dropdownOpen === null) return;

//       const btn = buttonRefs.current[dropdownOpen];
//       const menu = dropdownRef.current;

//       if (
//         (btn && btn.contains(e.target)) ||
//         (menu && menu.contains(e.target))
//       ) {
//         return;
//       }
//       setDropdownOpen(null);
//     };

//     document.addEventListener("click", handleClick, true);
//     return () => document.removeEventListener("click", handleClick, true);
//   }, [dropdownOpen]);

//   const handleView = (plan) => {
//     navigate(`/admin/plan/details/${plan?.id || ""}`, { state: { plan } });
//     setDropdownOpen(null);
//   };

//   // ✅ FINAL DELETE CONFIRM
//   const confirmDelete = async () => {
//     try {
//       if (!userId || !selectedPlan) return;

//       await axios.delete(`${apiUrl}/plans/${selectedPlan.id}`, {
//         headers: { "Content-Type": "application/json" },
//         data: { userId },
//       });

//       setPlans((prev) => prev.filter((p) => p.id !== selectedPlan.id));
//       setDeleteModalOpen(false);
//       setSelectedPlan(null);
//     } catch (error) {
//       console.error("Error deleting plan:", error);
//     }
//   };

//   const toggleDropdown = (index) => {
//     const rect = buttonRefs.current[index]?.getBoundingClientRect();
//     if (rect) {
//       setDropdownPosition({
//         top: rect.bottom + window.scrollY,
//         left: rect.right - 130,
//       });
//     }
//     setDropdownOpen((prev) => (prev === index ? null : index));
//   };


//   const handleEdit = (plan) => {
//     navigate(`/admin/plan/edit/${plan?.id}`, {state:  {plan }});
//     setDropdownOpen(null);
//   }
  

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h2 className="text-3xl font-semibold text-gray-900">Plans</h2>
//           <p className="text-md text-gray-500">All Plan List</p>
//         </div>

//         <button
//           onClick={() => navigate("/admin/plan/add")}
//           className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
//         >
//           <Plus size={16} />
//           Add New Plan
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center text-gray-500 py-8">Loading...</div>
//       ) : error ? (
//         <div className="text-center text-red-500 py-8">{error}</div>
//       ) : plans.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">No Plans found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-separate border-spacing-y-2 border-gray-200">
//             <thead>
//               <tr className="text-left text-gray-500 text-md border-t border-gray-200">
//                 <th className="px-4 py-2">Plan Name ↓</th>
//                 <th className="px-4 py-2">Segment ↓</th>
//                 <th className="px-4 py-2">Category ↓</th>
//                 <th className="px-4 py-2">Duration ↓</th>
//                 <th className="px-4 py-2">Avg Trades ↓</th>
//                 <th className="px-4 py-2">Plan Price ↓</th>
//                 <th className="px-4 py-2">Status ↓</th>
//                 <th className="px-4 py-2 text-right"></th>
//               </tr>
//             </thead>

//             <tbody>
//               {plans.map((plan, index) => (
//                 <tr key={plan.id || index} className="bg-gray-50 hover:bg-gray-100">
//                   <td className="px-4 py-3 flex items-center gap-2">
//                     <img
//                       src={plan.uplodedImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//                       className="w-7 h-7 rounded-full"
//                     />
//                     <span className="font-medium">{plan.planName}</span>
//                   </td>

//                   <td className="px-4 py-3">{plan.segment}</td>
//                   <td className="px-4 py-3">{plan.category}</td>
//                   <td className="px-4 py-3">{plan.duration}</td>
//                   <td className="px-4 py-3">{plan.avgTrades}</td>
//                   <td className="px-4 py-3">{plan.planPrice}</td>

//                   <td className="px-4 py-3">
//                     <span className={`text-md px-2 py-1 rounded-full ${
//                       plan.status === "active"
//                         ? "text-green-700 bg-green-50"
//                         : "text-red-700 bg-red-50"
//                     }`}>
//                       {plan.status === "active" ? "Active" : "Inactive"}
//                     </span>
//                   </td>

//                   <td className="px-4 py-3 text-right">
//                     <button
//                       ref={(el) => (buttonRefs.current[index] = el)}
//                       onClick={() => toggleDropdown(index)}
//                     >
//                       <MoreVertical size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {dropdownOpen !== null && (
//             <div
//               ref={dropdownRef}
//               className="fixed bg-white border border-gray-200 rounded-lg shadow-xl w-40 -ml-10 mt-1 z-[1000] backdrop-blur-sm "
//               style={{
//                 top: dropdownPosition.top,
//                 left: dropdownPosition.left,
//               }}
//             >
//               <button
//                 onClick={() => handleView(plans[dropdownOpen])}
//                 className="flex items-center w-full px-4 py-3 text-md text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
//               >
//                 <img src={viewIcon} alt="view" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
//                 <span className="font-medium">View </span>
//               </button>

//               <button
//                 onClick={() => handleEdit(plans[dropdownOpen])}
//                 className="flex items-center w-full px-4 py-3 text-md text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
//               >
//                 <img src={editIcon} alt="edit" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
//                 <span className="font-medium">Edit</span>
//               </button>

//               <div className="border-t border-gray-100 my-1"></div>

//               <button
//                                 onClick={() => {
//                   setSelectedPlan(plans[dropdownOpen]);
//                   setDeleteModalOpen(true);
//                   setDropdownOpen(null);
//                 }}
//                 className="flex items-center w-full px-4 py-3 text-md text-gray-700   hover:text-red-800 transition-all duration-150 ease-out group"
//               >
//                 <img src={deleteIcon} alt="delete" className="inline-block w-5 h-5 mr-3 text-red-400 group-hover:text-red-600" />
//                 <span className="font-medium">Delete</span>
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       <DeleteConfirmModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// }



// import React, { useEffect, useState, useRef } from "react";
// import { MoreVertical, Plus, Filter } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import viewIcon from "../../../assets/card/view.svg";
// import editIcon from "../../../assets/card/edit.svg";
// import deleteIcon from "../../../assets/card/delete.svg";
// import DeleteConfirmModal from "../../components/modals/DeleteModal";
// import FilterComponent from "../../components/filters/PlanFilter";
// import Filters from "../../../assets/card/filter.svg"

// export default function Plan() {
//   const [plans, setPlans] = useState([]);
//   const [filteredPlans, setFilteredPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [filterOpen, setFilterOpen] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   const buttonRefs = useRef([]);
//   const dropdownRef = useRef(null);

//   const user = localStorage.getItem("user");
//   const userId = user ? JSON.parse(user).id : null;

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/plans/${userId}`);
//         const data = res.data.data;
//         let plansData = [];
        
//         if (Array.isArray(data)) {
//           plansData = data;
//         } else if (data) {
//           plansData = [data];
//         }
        
//         setPlans(plansData);
//         setFilteredPlans(plansData); // Initialize filtered plans with all plans
//       } catch (err) {
//         console.error(err);
//         setError("Server error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) fetchPlans();
//   }, [userId]);

//   useEffect(() => {
//     const handleClick = (e) => {
//       if (dropdownOpen === null) return;

//       const btn = buttonRefs.current[dropdownOpen];
//       const menu = dropdownRef.current;

//       if (
//         (btn && btn.contains(e.target)) ||
//         (menu && menu.contains(e.target))
//       ) {
//         return;
//       }
//       setDropdownOpen(null);
//     };

//     document.addEventListener("click", handleClick, true);
//     return () => document.removeEventListener("click", handleClick, true);
//   }, [dropdownOpen]);

//   const handleView = (plan) => {
//     navigate(`/admin/plan/details/${plan?.id || ""}`, { state: { plan } });
//     setDropdownOpen(null);
//   };

//   // ✅ FINAL DELETE CONFIRM
//   const confirmDelete = async () => {
//     try {
//       if (!userId || !selectedPlan) return;

//       await axios.delete(`${apiUrl}/plans/${selectedPlan.id}`, {
//         headers: { "Content-Type": "application/json" },
//         data: { userId },
//       });

//       setPlans((prev) => prev.filter((p) => p.id !== selectedPlan.id));
//       setFilteredPlans((prev) => prev.filter((p) => p.id !== selectedPlan.id));
//       setDeleteModalOpen(false);
//       setSelectedPlan(null);
//     } catch (error) {
//       console.error("Error deleting plan:", error);
//     }
//   };

//   const toggleDropdown = (index) => {
//     const rect = buttonRefs.current[index]?.getBoundingClientRect();
//     if (rect) {
//       setDropdownPosition({
//         top: rect.bottom + window.scrollY,
//         left: rect.right - 130,
//       });
//     }
//     setDropdownOpen((prev) => (prev === index ? null : index));
//   };

//   const handleEdit = (plan) => {
//     navigate(`/admin/plan/edit/${plan?.id}`, {state:  {plan }});
//     setDropdownOpen(null);
//   }

//   // Filter functions
//   const handleOpenFilter = () => {
//     setFilterOpen(true);
//   };

//   const handleCloseFilter = () => {
//     setFilterOpen(false);
//   };

//   const handleApplyFilter = (filters) => {
//     let filtered = [...plans];
    
//     // Apply date filter logic
//     if (filters.date) {
//       // Add your date filtering logic here
//       // For example, filter by plan creation date
//       filtered = filtered.filter(plan => {
//         // Implement date comparison based on your plan data structure
//         return true; // Placeholder
//       });
//     }
    
//     // Apply plan status filter
//     if (filters.plan) {
//       if (filters.plan === 'active') {
//         filtered = filtered.filter(plan => plan.status === 'active');
//       } else if (filters.plan === 'inactive') {
//         filtered = filtered.filter(plan => plan.status === 'inactive');
//       }
//       // Add more plan type filters as needed
//     }
    
//     setFilteredPlans(filtered);
//   };

//   const handleResetFilter = () => {
//     setFilteredPlans(plans);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h2 className="text-3xl font-semibold text-gray-900">Plans</h2>
//           <p className="text-md text-gray-500">All Plan List</p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Filter Button */}
//           <button
//             onClick={handleOpenFilter}
//             className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
//           >
//             <img src={Filters}/>
//             Filter
//           </button>

//           {/* Add New Plan Button */}
//           <button
//             onClick={() => navigate("/admin/plan/add")}
//             className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
//           >
//             <Plus size={16} />
//             Add New Plan
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center text-gray-500 py-8">Loading...</div>
//       ) : error ? (
//         <div className="text-center text-red-500 py-8">{error}</div>
//       ) : filteredPlans.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">No Plans found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-separate border-spacing-y-2 border-gray-200">
//             <thead>
//               <tr className="text-left text-gray-500 text-md border-t border-gray-200">
//                 <th className="px-4 py-2">Plan Name ↓</th>
//                 <th className="px-4 py-2">Segment ↓</th>
//                 <th className="px-4 py-2">Category ↓</th>
//                 <th className="px-4 py-2">Duration ↓</th>
//                 <th className="px-4 py-2">Avg Trades ↓</th>
//                 <th className="px-4 py-2">Plan Price ↓</th>
//                 <th className="px-4 py-2">Status ↓</th>
//                 <th className="px-4 py-2 text-right"></th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredPlans.map((plan, index) => (
//                 <tr key={plan.id || index} className="bg-gray-50 hover:bg-gray-100">
//                   <td className="px-4 py-3 flex items-center gap-2">
//                     <img
//                       src={plan.uplodedImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//                       className="w-7 h-7 rounded-full"
//                       alt={plan.planName}
//                     />
//                     <span className="font-medium">{plan.planName}</span>
//                   </td>

//                   <td className="px-4 py-3">{plan.segment}</td>
//                   <td className="px-4 py-3">{plan.category}</td>
//                   <td className="px-4 py-3">{plan.duration}</td>
//                   <td className="px-4 py-3">{plan.avg_trades}</td>
//                   <td className="px-4 py-3">{plan.plan_price}</td>

//                   <td className="px-4 py-3">
//                     <span className={`text-md px-2 py-1 rounded-full ${
//                       plan.status === "active"
//                         ? "text-green-700 bg-green-50"
//                         : "text-red-700 bg-red-50"
//                     }`}>
//                       {plan.status === "active" ? "Active" : "Inactive"}
//                     </span>
//                   </td>

//                   <td className="px-4 py-3 text-right">
//                     <button
//                       ref={(el) => (buttonRefs.current[index] = el)}
//                       onClick={() => toggleDropdown(index)}
//                       className="hover:bg-gray-200 p-1 rounded"
//                     >
//                       <MoreVertical size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {dropdownOpen !== null && (
//             <div
//               ref={dropdownRef}
//               className="fixed bg-white border border-gray-200 rounded-lg shadow-xl w-40 -ml-10 mt-1 z-[1000] backdrop-blur-sm"
//               style={{
//                 top: dropdownPosition.top,
//                 left: dropdownPosition.left,
//               }}
//             >
//               <button
//                 onClick={() => handleView(plans[dropdownOpen])}
//                 className="flex items-center w-full px-4 py-3 text-md text-gray-700 hover:text-blue-700 transition-all duration-150 ease-out group"
//               >
//                 <img src={viewIcon} alt="view" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
//                 <span className="font-medium">View</span>
//               </button>

//               <button
//                 onClick={() => handleEdit(plans[dropdownOpen])}
//                 className="flex items-center w-full px-4 py-3 text-md text-gray-700 hover:text-blue-700 transition-all duration-150 ease-out group"
//               >
//                 <img src={editIcon} alt="edit" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
//                 <span className="font-medium">Edit</span>
//               </button>

//               <div className="border-t border-gray-100 my-1"></div>

//               <button
//                 onClick={() => {
//                   setSelectedPlan(plans[dropdownOpen]);
//                   setDeleteModalOpen(true);
//                   setDropdownOpen(null);
//                 }}
//                 className="flex items-center w-full px-4 py-3 text-md text-gray-700 hover:text-red-800 transition-all duration-150 ease-out group"
//               >
//                 <img src={deleteIcon} alt="delete" className="inline-block w-5 h-5 mr-3 text-red-400 group-hover:text-red-600" />
//                 <span className="font-medium">Delete</span>
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Filter Component */}
//       <FilterComponent
//         open={filterOpen}
//         onClose={handleCloseFilter}
//         onApply={handleApplyFilter}
//         onReset={handleResetFilter}
//       />

//    <DeleteConfirmModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Delete Plan?"
//         description="This action will permanently remove the plan and it will no longer be visible to users."
//       />
//     </div>
//   );
// }




import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Plus, Filter } from "lucide-react";
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
import FilterComponent from "../../components/filters/PlanFilter";
import Filters from "../../../assets/card/filter.svg";

// ✅ Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Plan() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // AG Grid Column Definitions
  const columnDefs = useMemo(() => [
    {
      headerName: "Plan Name",
      field: "plan_name",
      minWidth: 220,
      // cellRenderer: (params) => (
      //   <div className="flex items-center gap-3 p-2">
      //     <img
      //       src={params.data.uplodedImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
      //       className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
      //       alt={params.value}
      //     />
      //     <span className="font-semibold text-gray-900 text-md">
      //       {params.value || "N/A"}
      //     </span>
      //   </div>
      // ),
      sortable: true,
      filter: true,
    },
    {
      headerName: "Segment",
      field: "segment",
      minWidth: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Category",
      field: "category",
      minWidth: 130,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Duration",
      field: "duration",
      minWidth: 110,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Avg Trades",
      field: "avg_trades",
      minWidth: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Plan Price",
      field: "plan_price",
      minWidth: 130,
      valueFormatter: (params) => formatPrice(params.value),
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      minWidth: 110,
      cellRenderer: (params) => {
        const isActive = params.value === "active";
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/plans/${userId}`);
        const data = res.data.data;
        let plansData = [];
        
        if (Array.isArray(data)) {
          plansData = data;
        } else if (data) {
          plansData = [data];
        }
        
        setPlans(plansData);
        setFilteredPlans(plansData);
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPlans();
  }, [userId, apiUrl]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const handleView = (plan) => {
    navigate(`/admin/plan/details/${plan?.id || ""}`, { state: { plan } });
  };

  const handleEdit = (plan) => {
    navigate(`/admin/plan/edit/${plan?.id}`, { state: { plan } });
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!userId || !selectedPlan) return;

      await axios.delete(`${apiUrl}/plans/${selectedPlan.id}`, {
        headers: { "Content-Type": "application/json" },
        data: { userId },
      });

      if (gridApi) {
        gridApi.applyTransaction({ remove: [selectedPlan] });
      }
      
      setDeleteModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error deleting plan:", error);
      setError("Failed to delete plan");
    }
  };

  const handleOpenFilter = () => {
    setFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  const handleApplyFilter = (filters) => {
    let filtered = [...plans];
    
    if (filters.date) {
      filtered = filtered.filter(plan => true); // Add date logic
    }
    
    if (filters.plan) {
      if (filters.plan === 'active') {
        filtered = filtered.filter(plan => plan.status === 'active');
      } else if (filters.plan === 'inactive') {
        filtered = filtered.filter(plan => plan.status === 'inactive');
      }
    }
    
    setFilteredPlans(filtered);
    handleCloseFilter();
  };

  const handleResetFilter = () => {
    setFilteredPlans(plans);
    handleCloseFilter();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Plans</h2>
          <p className="text-md text-gray-500">All Plan List</p>
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
            onClick={() => navigate("/admin/plan/add")}
            className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2.5 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all shadow-lg"
          >
            <Plus size={18} />
            Add New Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading plans...</p>
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
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-6 opacity-20">📋</div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Plans Found</h3>
          <p className="text-gray-500 mb-8">Get started by creating your first plan.</p>
          <button
            onClick={() => navigate("/admin/plan/add")}
            className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium"
          >
            Create First Plan
          </button>
        </div>
      ) : (
        <div className="ag-theme-quartz border rounded-xl shadow-sm" style={{ height: 650, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={filteredPlans}
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

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Plan?"
        description="This action will permanently remove the plan and it will no longer be visible to users."
      />
    </div>
  );
}
