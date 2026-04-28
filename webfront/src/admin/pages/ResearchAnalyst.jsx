import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule  // ✅ CORRECT import name
} from "ag-grid-community";  // ✅ CORRECT package
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import PersonalDetailsModal from "../components/modals/PersonalDetailsModal";
import ProfessionalDetailsModal from "../components/modals/ProfessionalDetailsModal";
import DocumentUploadModal from "../components/modals/DocumentUploadModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ FIXED: Register modules BEFORE component renders
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ResearchAnalyst() {
  // ... your existing state variables (same as before)
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

  // Format date function (same)
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

  // Column definitions (same beautiful design)
  const columnDefs = useMemo(() => [
    {
      headerName: "RA Name",
      field: "name",
    },
    {
      headerName: "SEBI Reg No.",
      field: "sebi_number",
      minWidth: 140,
      valueGetter: (params) => params.data.sebi_number || params.data.sebiNumber || "N/A",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Experience",
      field: "experience",
      minWidth: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Location",
      minWidth: 160,
      valueGetter: (params) => {
        const city = params.data.city || '';
        const state = params.data.state || '';
        return city && state ? `${city}, ${state}` : params.data.address || "N/A";
      },
      sortable: true,
      filter: true,
    },
    {
      headerName: "Specialization",
      field: "specialization",
      minWidth: 150,
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
      headerName: "Contact",
      field: "email",
      minWidth: 180,
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
            isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
            <span className={`w-2 h-2 rounded-full mr-1 ${
              isActive ? "bg-green-500" : "bg-gray-400"
            }`}></span>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      width: 90,
      cellRenderer: (params) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => handleView(params.data)}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all text-md"
            title="View"
          >
            👁️
          </button>
          <button
            onClick={() => handleDelete(params.data)}
            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all text-md"
            title="Delete"
          >
            🗑️
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

  // ... rest of your functions remain EXACTLY same (fetchAnalysts, handleView, etc.)
  const fetchAnalysts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data.success) {
        setAnalysts(res.data.data || []);
        console.log("Analysts loaded:", res.data.data);
      } else {
        setError("Failed to fetch analysts");
      }
    } catch (err) {
      console.error("Error:", err);
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

  const handleView = (analyst) => {
    navigate(`/admin/research-analyst/${analyst.id}`);
  };

  const handleDelete = (analyst) => {
    setSelectedAnalyst(analyst);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/research-analyst/${selectedAnalyst.id}`);
      if (gridApi) {
        gridApi.applyTransaction({ remove: [selectedAnalyst] });
      }
      setDeleteModalOpen(false);
      setSelectedAnalyst(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete");
      fetchAnalysts();
    }
  };

  const handleCloseModals = () => {
    setStep(0);
    setFormData({ personal: {}, professional: {}, documents: {} });
  };

  // JSX same as before
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Research Analysts</h2>
          <p className="text-md text-gray-500 mt-1">Manage RA profiles</p>
        </div>
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-all"
        >
          <Plus size={20} />
          Add New RA
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-xl font-semibold text-red-600 mb-6">{error}</div>
          <button
            onClick={fetchAnalysts}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : analysts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Analysts Found</h3>
          <button
            onClick={() => setStep(1)}
            className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Add First RA
          </button>
        </div>
      ) : (
        <div className="ag-theme-quartz border rounded-xl" style={{ height: 650, width: "100%" }}>
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

      {/* Your existing modals - copy paste exactly same */}
      {/* {step === 1 && (
        <PersonalDetailsModal
          data={formData.personal}
          onNext={(data) => {
            setFormData((prev) => ({ ...prev, personal: data }));
            setStep(2);
          }}
          onClose={handleCloseModals}
        />
      )} */}
      {step === 1 && (
  <PersonalDetailsModal
    data={formData.personal}
    onNext={(data) => {
      // Store the personal data including signature file
      setFormData((prev) => ({ 
        ...prev, 
        personal: {
          ...data,
          // Ensure signature is preserved
          signature: data.signature
        } 
      }));
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
          itemName={selectedAnalyst?.name || "Research Analyst"}
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
