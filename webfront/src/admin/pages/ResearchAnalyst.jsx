import React, { useEffect, useState, useRef } from "react";
import { MoreVertical, Plus } from "lucide-react";
import PersonalDetailsModal from "../components/modals/PersonalDetailsModal";
import ProfessionalDetailsModal from "../components/modals/ProfessionalDetailsModal";
import DocumentUploadModal from "../components/modals/DocumentUploadModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResearchAnalyst() {
  const [step, setStep] = useState(0);
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const buttonRefs = useRef([]);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    personal: {},
    professional: {},
    documents: {},
  });

  useEffect(() => {
    const fetchAnalysts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/research-analyst/all`);
        if (res.data.success) {
          setAnalysts(res.data.data || []);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching analysts:", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysts();
  }, [apiUrl]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownOpen === null) return;

      const btnEl = buttonRefs.current[dropdownOpen];
      const menuEl = dropdownRef.current;

      if ((btnEl && btnEl.contains(event.target)) || (menuEl && menuEl.contains(event.target))) {
        return;
      }
      setDropdownOpen(null);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [dropdownOpen]);


  const handleView = (analyst) => {
    navigate(`/admin/research-analyst/${analyst.id}`);
    setDropdownOpen(null);
  };

  const handleDelete = (analyst) => {
    setSelectedAnalyst(analyst);
    setDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/research-analyst/${selectedAnalyst.id}`);
      setAnalysts((prev) => prev.filter((ra) => ra.id !== selectedAnalyst.id));
      setDeleteModalOpen(false);
      setSelectedAnalyst(null);
    } catch (err) {
      console.error("Error deleting analyst:", err);
      setError("Failed to delete analyst");
    }
  };

  // Toggle dropdown
  const toggleDropdown = (index) => {
    if (buttonRefs.current[index]) {
      const rect = buttonRefs.current[index].getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 130,
      });
    }
    setDropdownOpen((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Research Analyst</h2>
          <p className="text-sm text-gray-500">
            Active purchase orders that are still open
          </p>
        </div>
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add New RA
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : analysts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No Research Analysts found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-4 py-2">RA Name ↓</th>
                <th className="px-4 py-2">SEBI Reg No. ↓</th>
                <th className="px-4 py-2">Experience ↓</th>
                <th className="px-4 py-2">Location ↓</th>
                <th className="px-4 py-2">Specialization ↓</th>
                <th className="px-4 py-2">Status ↓</th>
                <th className="px-4 py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {analysts.map((ra, index) => (
                <tr
                  key={ra.id || index}
                  className="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img
                      src={
                        ra.profileImage
                          ? `${apiUrl}/uploads/${ra.profileImage}`
                          : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">{ra.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{ra.sebiNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{ra.experience}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {ra.address && ra.city}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {ra.specialization}
                  </td>
                  <td className="px-4 py-3">
                    {ra.status === "Active" ? (
                      <span className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="dropdown-container inline-block">
                      <button
                        ref={(el) => (buttonRefs.current[index] = el)}
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => toggleDropdown(index)}
                        aria-haspopup="menu"
                        aria-expanded={dropdownOpen === index}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Dropdown (fixed position) */}
          {dropdownOpen !== null && (
            <div
              ref={dropdownRef}
              className="dropdown-container fixed bg-white rounded-md shadow-lg z-[1000] border border-gray-200 w-32"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
              onMouseDown={(e) => e.stopPropagation()}
              role="menu"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(analysts[dropdownOpen]);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                role="menuitem"
              >
                View
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(analysts[dropdownOpen]);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                role="menuitem"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step Modals */}
      {step === 1 && (
        <PersonalDetailsModal
          data={formData.personal}
          onNext={(data) => {
            setFormData((prev) => ({ ...prev, personal: data }));
            setStep(2);
          }}
          onClose={() => setStep(0)}
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
          onClose={() => setStep(0)}
        />
      )}

      {step === 3 && (
        <DocumentUploadModal
          data={formData.documents}
          parentData={formData}
          onSubmit={(data) => {
            setFormData((prev) => {
              const next = { ...prev, documents: data };
              console.log("Final Submitted Data:", next);
              return next;
            });
            setStep(0);
          }}
          onBack={() => setStep(2)}
          onClose={() => setStep(0)}
        />
      )}

      {/* Delete Confirmation Modal */}
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
