// ResearchAnalyst.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, RefreshCw, Eye, Trash2, Search, ChevronLeft, ChevronRight, Users, UserCheck, Calendar, MapPin } from "lucide-react";
import PersonalDetailsModal from "../components/modals/PersonalDetailsModal";
import ProfessionalDetailsModal from "../components/modals/ProfessionalDetailsModal";
import DocumentUploadModal from "../components/modals/DocumentUploadModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 12;

export default function ResearchAnalyst() {
  const [step, setStep] = useState(0);
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ personal: {}, professional: {}, documents: {} });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return "—"; }
  };

  const fetchAnalysts = useCallback(async () => {
    try {
      setLoading(true); 
      setError(null);
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data.success) {
        const data = res.data.data || [];
        setAnalysts(data);
        // Calculate stats
        const activeCount = data.filter(a => a.status === "active").length;
        const inactiveCount = data.filter(a => a.status === "inactive").length;
        setStats({
          total: data.length,
          active: activeCount,
          inactive: inactiveCount
        });
      } else setError("Failed to fetch analysts");
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  }, [apiUrl]);

  useEffect(() => { fetchAnalysts(); }, [fetchAnalysts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return analysts.filter(a =>
      !q ||
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      (a.sebi_number || a.sebiNumber || "").toLowerCase().includes(q) ||
      a.specialization?.toLowerCase().includes(q)
    );
  }, [analysts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleView = (analyst) => navigate(`/admin/research-analyst/${analyst.id}`);
  const handleDelete = (analyst) => { setSelectedAnalyst(analyst); setDeleteModalOpen(true); };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/research-analyst/${selectedAnalyst.id}`);
      await fetchAnalysts();
      setDeleteModalOpen(false); 
      setSelectedAnalyst(null);
      if (paginated.length === 1 && page > 1) setPage(page - 1);
    } catch { setError("Failed to delete"); fetchAnalysts(); }
  };
  const handleCloseModals = () => { setStep(0); setFormData({ personal: {}, professional: {}, documents: {} }); };

  const StatusBadge = ({ status }) => {
    const active = status === "active";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
        active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
        {active ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-5 p-4 sm:p-6">
        {/* Header with Stats */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['DM_Sans'] text-gray-900">
                Research Analysts
              </h2>
              <p className="text-sm font-['DM_Sans'] text-gray-500 mt-1">Manage RA profiles and onboarding</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Add New RA
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-['DM_Sans'] uppercase tracking-wider">Total Analysts</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-['DM_Sans'] uppercase tracking-wider">Active</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-['DM_Sans'] uppercase tracking-wider">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600 mt-1">{stats.inactive}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {!loading && !error && analysts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, SEBI no., specialization…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="h-9 w-9 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin" />
              <p className="text-sm text-gray-500 font-['DM_Sans']">Loading analysts…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-sm font-semibold text-red-600">{error}</p>
              <button onClick={fetchAnalysts}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-all font-medium">
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && analysts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-semibold font-['DM_Sans'] text-gray-900">No Analysts Yet</h3>
              <p className="text-sm text-gray-500 font-['DM_Sans']">Add your first Research Analyst to get started</p>
              <button onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm">
                <Plus className="h-4 w-4" /> Add First RA
              </button>
            </div>
          )}

          {/* No results from search */}
          {!loading && !error && analysts.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-sm font-semibold text-gray-600">No results for "<span className="text-blue-600">{search}</span>"</p>
              <button onClick={() => setSearch("")} className="text-sm text-blue-600 hover:underline font-medium">Clear search</button>
            </div>
          )}

          {/* Desktop Table View (hidden on mobile) */}
          {!loading && !error && paginated.length > 0 && (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {["RA Name", "SEBI Reg No.", "Specialization", "Experience", "Location", "Registered", "Contact", "Status", "Actions"].map(col => (
                        <th key={col} className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap font-['DM_Sans']">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((analyst) => (
                      <tr key={analyst.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {analyst.profile_image ? (
                              <img src={analyst.profile_image} alt={analyst.name} className="w-8 h-8 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-blue-600 font-['DM_Sans']">
                                  {analyst.name?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap font-['DM_Sans']">
                              {analyst.name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 font-mono whitespace-nowrap">
                          {analyst.sebi_number || analyst.sebiNumber || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                          {analyst.specialization || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                          {analyst.experience ? `${analyst.experience} yrs` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                          {analyst.city && analyst.state ? `${analyst.city}, ${analyst.state}` : analyst.address || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(analyst.created_at)}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                          {analyst.email || "—"}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={analyst.status} />
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleView(analyst)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="View">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(analyst)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-['DM_Sans'] order-2 sm:order-1">
                      Showing <strong className="text-gray-700">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong className="text-gray-700">{filtered.length}</strong> analysts
                    </p>
                    <div className="flex items-center gap-1.5 order-1 sm:order-2">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-all border ${
                            p === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                          }`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Card View (visible on mobile/tablet) */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginated.map((analyst) => (
                  <div key={analyst.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {analyst.profile_image ? (
                          <img src={analyst.profile_image} alt={analyst.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600 font-['DM_Sans']">
                              {analyst.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 font-['DM_Sans']">{analyst.name || "—"}</h4>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">{analyst.sebi_number || analyst.sebiNumber || "No SEBI no."}</p>
                        </div>
                      </div>
                      <StatusBadge status={analyst.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div>
                        <p className="text-gray-400 font-['DM_Sans']">Specialization</p>
                        <p className="text-gray-700 font-medium">{analyst.specialization || "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-['DM_Sans']">Experience</p>
                        <p className="text-gray-700 font-medium">{analyst.experience ? `${analyst.experience} yrs` : "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-['DM_Sans']">Location</p>
                        <p className="text-gray-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {analyst.city && analyst.state ? `${analyst.city}, ${analyst.state}` : analyst.address || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-['DM_Sans']">Registered</p>
                        <p className="text-gray-700 font-medium">{formatDate(analyst.created_at)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400 font-['DM_Sans']">Contact</p>
                        <p className="text-gray-700 font-medium break-all">{analyst.email || "—"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button onClick={() => handleView(analyst)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all text-sm font-medium">
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                      <button onClick={() => handleDelete(analyst)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition-all text-sm font-medium">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-3 px-4 py-4 border-t border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs text-gray-600 font-['DM_Sans'] px-3">
                        Page {page} of {totalPages}
                      </span>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 font-['DM_Sans']">
                      Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Step modals */}
        {step === 1 && <PersonalDetailsModal 
          data={formData.personal}
          onNext={(data) => { setFormData(p => ({ ...p, personal: { ...data, signature: data.signature } })); setStep(2); }}
          onClose={handleCloseModals} 
        />}
        {step === 2 && <ProfessionalDetailsModal 
          data={formData.professional}
          onNext={(data) => { setFormData(p => ({ ...p, professional: data })); setStep(3); }}
          onBack={() => setStep(1)} 
          onClose={handleCloseModals} 
        />}
        {step === 3 && <DocumentUploadModal 
          data={formData.documents} 
          parentData={formData}
          onSubmit={() => { fetchAnalysts(); handleCloseModals(); }}
          onBack={() => setStep(2)} 
          onClose={handleCloseModals} 
        />}
        {deleteModalOpen && <DeleteConfirmationModal
          itemName={selectedAnalyst?.name || "Research Analyst"}
          onConfirm={confirmDelete}
          onCancel={() => { setDeleteModalOpen(false); setSelectedAnalyst(null); }} 
        />}
      </div>
    </div>
  );
}