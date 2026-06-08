import React, { useEffect, useState, useCallback, useRef } from "react";
import { Search, MoreVertical } from "lucide-react";
import PersonalDetailsModal from "../components/modals/PersonalDetailsModal";
import ProfessionalDetailsModal from "../components/modals/ProfessionalDetailsModal";
import DocumentUploadModal from "../components/modals/DocumentUploadModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const glass = {
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1.5px solid rgba(255,255,255,0.38)",
  borderRadius: "20px",
};

const glassRow = {
  background: "rgba(255,255,255,0.22)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "14px",
};

export default function Users() {
  const [step, setStep] = useState(0);
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const btnRefs = useRef([]);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({ personal: {}, professional: {}, documents: {} });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "N/A"; }
  };

  const fetchAnalysts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/users/user-all`);
      if (res.data.success) setAnalysts(res.data.data || []);
      else setError("Failed to fetch users");
    } catch { setError("Server error"); }
    finally { setLoading(false); }
  }, [apiUrl]);

  useEffect(() => { fetchAnalysts(); }, [fetchAnalysts]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownOpen === null) return;
      const btn = btnRefs.current[dropdownOpen];
      if ((btn && btn.contains(e.target)) || (dropdownRef.current && dropdownRef.current.contains(e.target))) return;
      setDropdownOpen(null);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [dropdownOpen]);

  const toggleDropdown = (index) => {
    if (btnRefs.current[index]) {
      const rect = btnRefs.current[index].getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + window.scrollY + 4, left: rect.right - 140 });
    }
    setDropdownOpen((p) => (p === index ? null : index));
  };

  const filtered = analysts.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").includes(q) ||
      (u.state || "").toLowerCase().includes(q) ||
      (u.pan || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/users/${selectedAnalyst.id}`);
      setAnalysts((p) => p.filter((u) => u.id !== selectedAnalyst.id));
      setDeleteModalOpen(false);
      setSelectedAnalyst(null);
    } catch { setError("Failed to delete user"); fetchAnalysts(); }
  };

  const handleCloseModals = () => {
    setStep(0);
    setFormData({ personal: {}, professional: {}, documents: {} });
  };

  const cols = ["Name", "PAN No.", "State", "Registered", "Phone", "Email", ""];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .user-row:hover { background: rgba(255,255,255,0.32) !important; }
        .user-row { transition: background 0.18s; cursor: default; }
        .page-btn:hover { background: rgba(255,255,255,0.35) !important; }
        .page-btn { transition: background 0.15s; }
        .action-btn:hover { background: rgba(255,255,255,0.4) !important; }
        ::-webkit-scrollbar { height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
      `}</style>

      <div style={{ ...glass, padding: "24px 24px 0" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, color: "#2a2118", margin: 0 }}>
              Users
            </h2>
            <p style={{ fontSize: 12, color: "#8a7e74", margin: "4px 0 0" }}>
              {analysts.length} total accounts
            </p>
          </div>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.28)",
            border: "1.5px solid rgba(255,255,255,0.45)",
            borderRadius: 12, padding: "7px 14px",
            backdropFilter: "blur(10px)",
            minWidth: 220,
          }}>
            <Search size={14} color="#8a7e74" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search users..."
              style={{
                background: "none", border: "none", outline: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#2a2118",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "3px solid rgba(110,124,248,0.15)",
              borderTopColor: "#6e7cf8",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ fontSize: 13, color: "#8a7e74" }}>Loading users...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 16 }}>{error}</p>
            <button onClick={fetchAnalysts} style={{
              padding: "8px 20px", borderRadius: 20, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, rgba(110,124,248,0.85), rgba(79,195,247,0.8))",
              color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            }}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 12, opacity: 0.25 }}>👥</p>
            <p style={{ fontSize: 14, color: "#8a7e74" }}>{search ? "No results found" : "No users yet"}</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", minWidth: 700 }}>
                <thead>
                  <tr>
                    {cols.map((col, i) => (
                      <th key={i} style={{
                        textAlign: i === cols.length - 1 ? "right" : "left",
                        padding: "6px 14px",
                        fontSize: 11, fontWeight: 600,
                        color: "#8a7e74",
                        fontFamily: "'DM Sans', sans-serif",
                        whiteSpace: "nowrap",
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((user, i) => (
                    <tr key={user.id || i} className="user-row" style={{ ...glassRow }}>
                      {/* Name */}
                      <td style={{ padding: "10px 14px", borderRadius: "14px 0 0 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img
                            src={user.profile_image || user.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            alt=""
                            style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.6)", flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#2a2118", whiteSpace: "nowrap" }}>
                            {user.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      {/* PAN */}
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          display: "inline-block", padding: "3px 10px", borderRadius: 20,
                          background: "rgba(110,124,248,0.1)", border: "1px solid rgba(110,124,248,0.2)",
                          fontSize: 11, fontWeight: 600, color: "#6e7cf8", letterSpacing: "0.03em",
                        }}>
                          {user.pan || "N/A"}
                        </span>
                      </td>
                      {/* State */}
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#5a4e44" }}>
                        {user.state ? user.state.charAt(0).toUpperCase() + user.state.slice(1) : "N/A"}
                      </td>
                      {/* Date */}
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#8a7e74", whiteSpace: "nowrap" }}>
                        {formatDate(user.created_at)}
                      </td>
                      {/* Phone */}
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#5a4e44", whiteSpace: "nowrap" }}>
                        {user.phone || "N/A"}
                      </td>
                      {/* Email */}
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#5a4e44", maxWidth: 200 }}>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user.email || "N/A"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "10px 14px", textAlign: "right", borderRadius: "0 14px 14px 0" }}>
                        <button
                          ref={(el) => (btnRefs.current[i] = el)}
                          className="action-btn"
                          onClick={() => toggleDropdown(i)}
                          style={{
                            width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer",
                            background: "rgba(255,255,255,0.3)",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <MoreVertical size={14} color="#5a4e44" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 4px 20px", flexWrap: "wrap", gap: 8,
            }}>
              <p style={{ fontSize: 12, color: "#8a7e74" }}>
                Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  style={{
                    padding: "5px 14px", borderRadius: 20, border: "1.5px solid rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.2)", cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: 12, color: currentPage === 1 ? "#c0b8b0" : "#2a2118",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className="page-btn"
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: 30, height: 30, borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.4)",
                        background: currentPage === page
                          ? "linear-gradient(135deg, rgba(110,124,248,0.85), rgba(79,195,247,0.8))"
                          : "rgba(255,255,255,0.2)",
                        cursor: "pointer", fontSize: 12,
                        color: currentPage === page ? "#fff" : "#2a2118",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                        boxShadow: currentPage === page ? "0 2px 8px rgba(110,124,248,0.3)" : "none",
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  style={{
                    padding: "5px 14px", borderRadius: 20, border: "1.5px solid rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.2)", cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: 12, color: currentPage === totalPages ? "#c0b8b0" : "#2a2118",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dropdown */}
      {dropdownOpen !== null && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: dropdownPos.top,
            left: dropdownPos.left,
            zIndex: 1000,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255,255,255,0.5)",
            borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            minWidth: 140,
          }}
        >
          <button
            onClick={() => { navigate(`/admin/users/${paginated[dropdownOpen]?.id}`); setDropdownOpen(null); }}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: "#2a2118", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              borderBottom: "1px solid rgba(255,255,255,0.4)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(110,124,248,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            👁 View
          </button>
          <button
            onClick={() => { setSelectedAnalyst(paginated[dropdownOpen]); setDeleteModalOpen(true); setDropdownOpen(null); }}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: "#ef4444", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            🗑 Delete
          </button>
        </div>
      )}

      {/* Modals */}
      {step === 1 && <PersonalDetailsModal data={formData.personal} onNext={(d) => { setFormData(p => ({ ...p, personal: d })); setStep(2); }} onClose={handleCloseModals} />}
      {step === 2 && <ProfessionalDetailsModal data={formData.professional} onNext={(d) => { setFormData(p => ({ ...p, professional: d })); setStep(3); }} onBack={() => setStep(1)} onClose={handleCloseModals} />}
      {step === 3 && <DocumentUploadModal data={formData.documents} parentData={formData} onSubmit={() => { fetchAnalysts(); handleCloseModals(); }} onBack={() => setStep(2)} onClose={handleCloseModals} />}
      {deleteModalOpen && <DeleteConfirmationModal itemName={selectedAnalyst?.name || "User"} onConfirm={confirmDelete} onCancel={() => { setDeleteModalOpen(false); setSelectedAnalyst(null); }} />}
    </div>
  );
}