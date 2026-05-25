
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { MoreVertical, Plus } from "lucide-react";
// import PersonalDetailsModal from "../components/modals/PersonalDetailsModal";
// import ProfessionalDetailsModal from "../components/modals/ProfessionalDetailsModal";
// import DocumentUploadModal from "../components/modals/DocumentUploadModal";
// import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Users() {
//   const [step, setStep] = useState(0);
//   const [analysts, setAnalysts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedAnalyst, setSelectedAnalyst] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   const buttonRefs = useRef([]);
//   const dropdownRef = useRef(null);

//   const [formData, setFormData] = useState({
//     personal: {},
//     professional: {},
//     documents: {},
//   });

//   // Format date from ISO string to readable format
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', { 
//         day: '2-digit', 
//         month: 'short', 
//         year: 'numeric' 
//       });
//     } catch {
//       return "N/A";
//     }
//   };

//   // Get contact info (email or phone - showing email since phone not in data)
//   const getContactInfo = (analyst) => {
//     return analyst.email || "N/A";
//   };

//   const fetchAnalysts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${apiUrl}/users/user-all`);
//       if (res.data.success) {
//         setAnalysts(res.data.data || []);
//         console.log(res.data.data, 1000);
//       } else {
//         setError("Failed to fetch data");
//       }
//     } catch (err) {
//       console.error("Error fetching analysts:", err);
//       setError("Server error");
//     } finally {
//       setLoading(false);
//     }
//   }, [apiUrl]);

//   useEffect(() => {
//     fetchAnalysts();
//   }, [fetchAnalysts]);

//   useEffect(() => {
//     const handleDocumentClick = (event) => {
//       if (dropdownOpen === null) return;

//       const btnEl = buttonRefs.current[dropdownOpen];
//       const menuEl = dropdownRef.current;

//       if ((btnEl && btnEl.contains(event.target)) || (menuEl && menuEl.contains(event.target))) {
//         return;
//       }
//       setDropdownOpen(null);
//     };

//     document.addEventListener("click", handleDocumentClick, true);
//     return () => {
//       document.removeEventListener("click", handleDocumentClick, true);
//     };
//   }, [dropdownOpen]);

//   const handleView = (analyst) => {
//     navigate(`/admin/research-analyst/${analyst.id}`);
//     setDropdownOpen(null);
//   };

//   const handleDelete = (analyst) => {
//     setSelectedAnalyst(analyst);
//     setDeleteModalOpen(true);
//     setDropdownOpen(null);
//   };

//   const confirmDelete = async () => {
//     try {
//       await axios.delete(`${apiUrl}/research-analyst/${selectedAnalyst.id}`);
//       setAnalysts((prev) => prev.filter((ra) => ra.id !== selectedAnalyst.id));
//       setDeleteModalOpen(false);
//       setSelectedAnalyst(null);
//     } catch (err) {
//       console.error("Error deleting analyst:", err);
//       setError("Failed to delete analyst");
//     }
//   };

//   const toggleDropdown = (index) => {
//     if (buttonRefs.current[index]) {
//       const rect = buttonRefs.current[index].getBoundingClientRect();
//       setDropdownPosition({
//         top: rect.bottom + window.scrollY,
//         left: rect.right - 130,
//       });
//     }
//     setDropdownOpen((prev) => (prev === index ? null : index));
//   };

//   const handleCloseModals = () => {
//     setStep(0);
//     setFormData({
//       personal: {},
//       professional: {},
//       documents: {},
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h2 className="text-3xl font-semibold text-gray-900">Users</h2>
//           {/* <p className="text-md text-gray-500">
//             Active purchase orders that are still open
//           </p> */}
//         </div>
//         {/* <button
//           onClick={() => setStep(1)}
//           className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
//         >
//           <Plus size={16} />
//           Add New RA
//         </button> */}
//       </div>

//       {loading ? (
//         <div className="text-center text-gray-500 py-8">Loading...</div>
//       ) : error ? (
//         <div className="text-center text-red-500 py-8">{error}</div>
//       ) : analysts.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           No Research Analysts found.
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-separate border-spacing-y-2">
//             <thead>
//               <tr className="text-left text-gray-500 text-md">
//                 <th className="px-4 py-2">Name ↓</th>
//                 <th className="px-4 py-2">PAN No. ↓</th>
//                 {/* <th className="px-4 py-2">Experience ↓</th> */}
//                 <th className="px-4 py-2">State ↓</th>
//                 {/* <th className="px-4 py-2">Specialization ↓</th> */}
//                 <th className="px-4 py-2">Registered Date ↓</th>
//                 <th className="px-4 py-2">Phone ↓</th>
//                 <th className="px-4 py-2">Email ↓</th>
//                 {/* <th className="px-4 py-2">Status ↓</th> */}
//                 {/* <th className="px-4 py-2 text-right"></th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {analysts.map((ra, index) => (
//                 <tr
//                   key={ra.id || index}
//                   className="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
//                 >
//                   <td className="px-4 py-3 flex items-center gap-2">
//                     <img
//                       src={
//                         ra.profile_image || ra.profileImage
//                           ? ra.profile_image || ra.profileImage
//                           : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                       }
//                       alt="Profile"
//                       className="w-7 h-7 rounded-full object-cover"
//                     />
//                     <span className="font-medium text-gray-800">{ra.name}</span>
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     {ra.pan || ra.pan || "N/A"}
//                   </td>
//                   {/* <td className="px-4 py-3 text-gray-700">
//                     {ra.experience || "N/A"}
//                   </td> */}
//                   <td className="px-4 py-3 text-gray-700">
//                     {ra.state || "N/A"}
//                   </td>
//                   {/* <td className="px-4 py-3 text-gray-700">
//                     {ra.specialization || "N/A"}
//                   </td> */}
//                   <td className="px-4 py-3 text-gray-700">
//                     {formatDate(ra.created_at)}
//                   </td>
//                    <td className="px-4 py-3 text-gray-700">
//                     <div className="text-md">
//                       {ra.phone}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-gray-700">
//                     <div className="text-md">
//                       {ra.email}
//                     </div>
//                   </td>
                  

//                   {/* <td className="px-4 py-3">
//                     {ra.status === "active" ? (
//                       <span className="flex items-center gap-1 text-md text-green-700 bg-green-50 px-2 py-1 rounded-full">
//                         <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                         Active
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-1 text-md text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
//                         <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
//                         Inactive
//                       </span>
//                     )}
//                   </td> */}
//                   {/* <td className="px-4 py-3 text-right">
//                     <div className="dropdown-container inline-block">
//                       <button
//                         ref={(el) => (buttonRefs.current[index] = el)}
//                         className="text-gray-500 hover:text-gray-700"
//                         onClick={() => toggleDropdown(index)}
//                         aria-haspopup="menu"
//                         aria-expanded={dropdownOpen === index}
//                       >
//                         <MoreVertical size={18} />
//                       </button>
//                     </div>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Dropdown (fixed position) */}
//           {dropdownOpen !== null && (
//             <div
//               ref={dropdownRef}
//               className="dropdown-container fixed bg-white rounded-md shadow-lg z-[1000] border border-gray-200 w-32"
//               style={{
//                 top: dropdownPosition.top,
//                 left: dropdownPosition.left,
//               }}
//               onMouseDown={(e) => e.stopPropagation()}
//               role="menu"
//             >
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleView(analysts[dropdownOpen]);
//                 }}
//                 className="block w-full text-left px-4 py-2 text-md text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
//                 role="menuitem"
//               >
//                 View
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDelete(analysts[dropdownOpen]);
//                 }}
//                 className="block w-full text-left px-4 py-2 text-md text-red-600 hover:bg-gray-100 transition"
//                 role="menuitem"
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Step Modals */}
//       {step === 1 && (
//         <PersonalDetailsModal
//           data={formData.personal}
//           onNext={(data) => {
//             setFormData((prev) => ({ ...prev, personal: data }));
//             setStep(2);
//           }}
//           onClose={handleCloseModals}
//         />
//       )}

//       {step === 2 && (
//         <ProfessionalDetailsModal
//           data={formData.professional}
//           onNext={(data) => {
//             setFormData((prev) => ({ ...prev, professional: data }));
//             setStep(3);
//           }}
//           onBack={() => setStep(1)}
//           onClose={handleCloseModals}
//         />
//       )}

//       {step === 3 && (
//         <DocumentUploadModal
//           data={formData.documents}
//           parentData={formData}
//           onSubmit={(data) => {
//             setFormData((prev) => {
//               const next = { ...prev, documents: data };
//               console.log("Final Submitted Data:", next);
//               return next;
//             });

//             fetchAnalysts();
//             handleCloseModals();
//           }}
//           onBack={() => setStep(2)}
//           onClose={handleCloseModals}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && (
//         <DeleteConfirmationModal
//           itemName={selectedAnalyst?.name || "Research Analyst"}
//           onConfirm={confirmDelete}
//           onCancel={() => {
//             setDeleteModalOpen(false);
//             setSelectedAnalyst(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import PersonalDetailsModal from "../components/modals/PersonalDetailsModal";
import ProfessionalDetailsModal from "../components/modals/ProfessionalDetailsModal";
import DocumentUploadModal from "../components/modals/DocumentUploadModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Register AG Grid modules (CRITICAL)
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Users() {
  const [step, setStep] = useState(0);
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const gridRef = React.useRef();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personal: {},
    professional: {},
    documents: {},
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return "N/A";
    }
  };

  // AG Grid Column Definitions
  const columnDefs = useMemo(() => [
    {
      headerName: "Name",
      field: "name",
      minWidth: 200,
      // cellRenderer: (params) => (
      //   <div className="flex items-center gap-3 p-2">
      //     <img
      //       src={
      //         params.data.profile_image || params.data.profileImage
      //           ? params.data.profile_image || params.data.profileImage
      //           : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      //       }
      //       alt="Profile"
      //       className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
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
      headerName: "PAN No.",
      field: "pan",
      minWidth: 140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "State",
      field: "state",
      minWidth: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Registered",
      field: "created_at",
      minWidth: 130,
      valueFormatter: (params) => formatDate(params.value),
      sortable: true,
      filter: true,
    },
    {
      headerName: "Phone",
      field: "phone",
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="text-md font-medium text-gray-900">
          {params.value || "N/A"}
        </div>
      ),
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "email",
      minWidth: 220,
      cellRenderer: (params) => (
        <div className="text-md font-medium text-gray-900 truncate max-w-[200px]">
          {params.value || "N/A"}
        </div>
      ),
      sortable: true,
      filter: true,
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  }), []);

  const fetchAnalysts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/users/user-all`);
      if (res.data.success) {
        setAnalysts(res.data.data || []);
        console.log("Users loaded:", res.data.data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchAnalysts();
  }, [fetchAnalysts]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const handleView = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleDelete = (user) => {
    setSelectedAnalyst(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/users/${selectedAnalyst.id}`);
      if (gridApi) {
        gridApi.applyTransaction({ remove: [selectedAnalyst] });
      }
      setDeleteModalOpen(false);
      setSelectedAnalyst(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete user");
      fetchAnalysts();
    }
  };

  const handleCloseModals = () => {
    setStep(0);
    setFormData({
      personal: {},
      professional: {},
      documents: {},
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Users</h2>
          <p className="text-md text-gray-500 mt-1">Manage user accounts</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading users...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-xl font-semibold text-red-600 mb-6">{error}</div>
          <button
            onClick={fetchAnalysts}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            🔄 Retry
          </button>
        </div>
      ) : analysts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-6 opacity-20">👥</div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Users Found</h3>
          <p className="text-gray-500 mb-8">No user accounts available.</p>
        </div>
      ) : (
        <div className="ag-theme-quartz border rounded-xl shadow-sm" style={{ height: 650, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={analysts}
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

      {/* Keep your existing modals */}
      {step === 1 && (
        <PersonalDetailsModal
          data={formData.personal}
          onNext={(data) => {
            setFormData((prev) => ({ ...prev, personal: data }));
            setStep(2);
          }}
          onClose={handleCloseModals}
        />
      )}
      {step === 2 && (
        <ProfessionalDetailsModal
          data={formData.professional}
          onNext={(data) => {
            setFormData((prev) => ({ ...prev, professional: data }));
            setStep(3);
          }}
          onBack={() => setStep(1)}
          onClose={handleCloseModals}
        />
      )}
      {step === 3 && (
        <DocumentUploadModal
          data={formData.documents}
          parentData={formData}
          onSubmit={(data) => {
            fetchAnalysts();
            handleCloseModals();
          }}
          onBack={() => setStep(2)}
          onClose={handleCloseModals}
        />
      )}
      {deleteModalOpen && (
        <DeleteConfirmationModal
          itemName={selectedAnalyst?.name || "User"}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedAnalyst(null);
          }}
        />
      )}
    </div>
  );
}

