import React, { useEffect, useState, useRef } from "react";
import { MoreVertical, Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import viewIcon from "../../../assets/card/view.svg";
import editIcon from "../../../assets/card/edit.svg";
import deleteIcon from "../../../assets/card/delete.svg";
import DeleteConfirmModal from "../../components/modals/DeleteModal"; 

export default function Plan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); 

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const buttonRefs = useRef([]);
  const dropdownRef = useRef(null);

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${apiUrl}/plans/${userId}`);
        const data = res.data.data;
        if (Array.isArray(data)) {
          setPlans(data);
        } else if (data) {
          setPlans([data]);
        } else {
          setPlans([]);
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPlans();
  }, [userId]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownOpen === null) return;

      const btn = buttonRefs.current[dropdownOpen];
      const menu = dropdownRef.current;

      if (
        (btn && btn.contains(e.target)) ||
        (menu && menu.contains(e.target))
      ) {
        return;
      }
      setDropdownOpen(null);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [dropdownOpen]);

  const handleView = (plan) => {
    navigate(`/admin/plan/details/${plan?.id || ""}`, { state: { plan } });
    setDropdownOpen(null);
  };

  // ✅ FINAL DELETE CONFIRM
  const confirmDelete = async () => {
    try {
      if (!userId || !selectedPlan) return;

      await axios.delete(`${apiUrl}/plans/${selectedPlan.id}`, {
        headers: { "Content-Type": "application/json" },
        data: { userId },
      });

      setPlans((prev) => prev.filter((p) => p.id !== selectedPlan.id));
      setDeleteModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const toggleDropdown = (index) => {
    const rect = buttonRefs.current[index]?.getBoundingClientRect();
    if (rect) {
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
          <h2 className="text-3xl font-semibold text-gray-900">Plans</h2>
          <p className="text-sm text-gray-500">All Plan List</p>
        </div>

        <button
          onClick={() => navigate("/admin/plan/add")}
          className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : plans.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No Plans found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 border-gray-200">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-t border-gray-200">
                <th className="px-4 py-2">Plan Name ↓</th>
                <th className="px-4 py-2">Segment ↓</th>
                <th className="px-4 py-2">Category ↓</th>
                <th className="px-4 py-2">Duration ↓</th>
                <th className="px-4 py-2">Avg Trades ↓</th>
                <th className="px-4 py-2">Plan Price ↓</th>
                <th className="px-4 py-2">Status ↓</th>
                <th className="px-4 py-2 text-right"></th>
              </tr>
            </thead>

            <tbody>
              {plans.map((plan, index) => (
                <tr key={plan.id || index} className="bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img
                      src={plan.uplodedImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="font-medium">{plan.planName}</span>
                  </td>

                  <td className="px-4 py-3">{plan.segment}</td>
                  <td className="px-4 py-3">{plan.category}</td>
                  <td className="px-4 py-3">{plan.duration}</td>
                  <td className="px-4 py-3">{plan.avgTrades}</td>
                  <td className="px-4 py-3">{plan.planPrice}</td>

                  <td className="px-4 py-3">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      plan.status === "active"
                        ? "text-green-700 bg-green-50"
                        : "text-red-700 bg-red-50"
                    }`}>
                      {plan.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      ref={(el) => (buttonRefs.current[index] = el)}
                      onClick={() => toggleDropdown(index)}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dropdownOpen !== null && (
            <div
              ref={dropdownRef}
              className="fixed bg-white border border-gray-200 rounded-lg shadow-xl w-40 -ml-10 mt-1 z-[1000] backdrop-blur-sm "
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
            >
              <button
                onClick={() => handleView(plans[dropdownOpen])}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
              >
                <img src={viewIcon} alt="view" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                <span className="font-medium">View </span>
              </button>

              <button
                onClick={() => handleEdit(plans[dropdownOpen])}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
              >
                <img src={editIcon} alt="edit" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                <span className="font-medium">Edit</span>
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                                onClick={() => {
                  setSelectedPlan(plans[dropdownOpen]);
                  setDeleteModalOpen(true);
                  setDropdownOpen(null);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700   hover:text-red-800 transition-all duration-150 ease-out group"
              >
                <img src={deleteIcon} alt="delete" className="inline-block w-5 h-5 mr-3 text-red-400 group-hover:text-red-600" />
                <span className="font-medium">Delete</span>
              </button>
            </div>
          )}
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
