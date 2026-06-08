import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import PersonalDetailsModal from "../components/modals/PersonalDetailsModal";
import ProfessionalDetailsModal from "../components/modals/ProfessionalDetailsModal";
import DocumentUploadModal from "../components/modals/DocumentUploadModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function ResearchAnalyst() {
  const [step, setStep] = useState(0);
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const gridRef = React.useRef();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ personal: {}, professional: {}, documents: {} });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "N/A"; }
  };

  const columnDefs = useMemo(() => [
    { headerName: "RA Name", field: "name" },
    {
      headerName: "SEBI Reg No.", field: "sebi_number", minWidth: 140,
      valueGetter: (p) => p.data.sebi_number || p.data.sebiNumber || "N/A",
    },
    { headerName: "Experience", field: "experience", minWidth: 120 },
    {
      headerName: "Location", minWidth: 160,
      valueGetter: (p) => {
        const c = p.data.city || "", s = p.data.state || "";
        return c && s ? `${c}, ${s}` : p.data.address || "N/A";
      },
    },
    { headerName: "Specialization", field: "specialization", minWidth: 150 },
    { headerName: "Registered", field: "created_at", minWidth: 130, valueFormatter: (p) => formatDate(p.value) },
    { headerName: "Contact", field: "email", minWidth: 180 },
    {
      headerName: "Status", field: "status", minWidth: 110,
      cellRenderer: (p) => {
        const active = p.value === "active";
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium
            ${active ? "bg-green-400/20 text-green-700" : "bg-gray-400/20 text-gray-600"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
            {active ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      headerName: "Actions", width: 90, pinned: "right", sortable: false, filter: false,
      cellRenderer: (p) => (
        <div className="flex gap-1 items-center justify-center h-full">
          <button onClick={() => handleView(p.data)}
            className="p-1.5 rounded-lg text-[#6e7cf8] hover:bg-[#6e7cf8]/10 transition-all text-sm" title="View">👁️</button>
          <button onClick={() => handleDelete(p.data)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all text-sm" title="Delete">🗑️</button>
        </div>
      ),
    },
  ], []);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true, flex: 1 }), []);

  const fetchAnalysts = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data.success) setAnalysts(res.data.data || []);
      else setError("Failed to fetch analysts");
    } catch { setError("Server error"); }
    finally { setLoading(false); }
  }, [apiUrl]);

  useEffect(() => { fetchAnalysts(); }, [fetchAnalysts]);

  const onGridReady = useCallback((p) => { setGridApi(p.api); p.api.sizeColumnsToFit(); }, []);
  const handleView = (analyst) => navigate(`/admin/research-analyst/${analyst.id}`);
  const handleDelete = (analyst) => { setSelectedAnalyst(analyst); setDeleteModalOpen(true); };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/research-analyst/${selectedAnalyst.id}`);
      if (gridApi) gridApi.applyTransaction({ remove: [selectedAnalyst] });
      setDeleteModalOpen(false); setSelectedAnalyst(null);
    } catch { setError("Failed to delete"); fetchAnalysts(); }
  };
  const handleCloseModals = () => { setStep(0); setFormData({ personal: {}, professional: {}, documents: {} }); };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-['Sora'] text-[20px] font-bold text-[#2a2118] tracking-tight">
            Research Analysts
          </h2>
          <p className="text-[12.5px] text-[#8a7e74] mt-0.5">Manage RA profiles and onboarding</p>
        </div>
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-white text-[13px] font-medium
            transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #6e7cf8, #4fc3f7)" }}
        >
          <Plus className="h-4 w-4" />
          Add New RA
        </button>
      </div>

      {/* Content card */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-[20px] p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-[#6e7cf8]/30 border-t-[#6e7cf8] animate-spin" />
            <p className="text-[13px] text-[#8a7e74]">Loading analysts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-[14px] font-semibold text-red-500">{error}</p>
            <button onClick={fetchAnalysts}
              className="flex items-center gap-2 px-5 py-2 rounded-[12px] bg-white/30 border border-white/45 text-[13px] text-[#2a2118] hover:bg-white/40 transition-all">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        ) : analysts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-16 w-16 rounded-[18px] bg-white/30 border border-white/45 flex items-center justify-center">
              <Plus className="h-7 w-7 text-[#8a7e74]" />
            </div>
            <p className="font-['Sora'] text-[15px] font-bold text-[#2a2118]">No Analysts Yet</p>
            <p className="text-[12.5px] text-[#8a7e74]">Add your first Research Analyst to get started</p>
            <button onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-[14px] text-white text-[13px] font-medium"
              style={{ background: "linear-gradient(135deg, #6e7cf8, #4fc3f7)" }}>
              Add First RA
            </button>
          </div>
        ) : (
          <div className="ag-theme-quartz rounded-[14px] overflow-hidden border border-white/40"
            style={{ height: 620, width: "100%" }}>
            <AgGridReact
              ref={gridRef}
              rowData={analysts}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              animateRows
              pagination
              paginationPageSize={15}
              paginationPageSizeSelector={[10, 15, 25, 50]}
            />
          </div>
        )}
      </div>

      {step === 1 && (
        <PersonalDetailsModal
          data={formData.personal}
          onNext={(data) => { setFormData((p) => ({ ...p, personal: { ...data, signature: data.signature } })); setStep(2); }}
          onClose={handleCloseModals}
        />
      )}
      {step === 2 && (
        <ProfessionalDetailsModal
          data={formData.professional}
          onNext={(data) => { setFormData((p) => ({ ...p, professional: data })); setStep(3); }}
          onBack={() => setStep(1)}
          onClose={handleCloseModals}
        />
      )}
      {step === 3 && (
        <DocumentUploadModal
          data={formData.documents}
          parentData={formData}
          onSubmit={() => { fetchAnalysts(); handleCloseModals(); }}
          onBack={() => setStep(2)}
          onClose={handleCloseModals}
        />
      )}
      {deleteModalOpen && (
        <DeleteConfirmationModal
          itemName={selectedAnalyst?.name || "Research Analyst"}
          onConfirm={confirmDelete}
          onCancel={() => { setDeleteModalOpen(false); setSelectedAnalyst(null); }}
        />
      )}
    </div>
  );
}