import React, { useEffect, useState, useRef } from "react";
import { MoreVertical, Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import viewIcon from "../../../assets/card/view.svg";
import editIcon from "../../../assets/card/edit.svg";
import deleteIcon from "../../../assets/card/delete.svg";
import DeleteConfirmModal from "../../components/modals/DeleteModal";
import CreateSignal from "../../components/modals/CreateSignal";
import PriceLevels from "../../components/modals/PricesLevels";

export default function PanelSignals() {
    const [signals, setsignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedsignal, setSelectedsignal] = useState(null);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        personal: {},
        documents: {}
    });
    const [isCreatingSignal, setIsCreatingSignal] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const buttonRefs = useRef([]);
    const dropdownRef = useRef(null);

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;

    useEffect(() => {
        const fetchsignals = async () => {
            try {
                const res = await axios.get(`${apiUrl}/signals/get-signals/${userId}`);
                const data = res.data.data;
                if (Array.isArray(data)) {
                    setsignals(data);
                } else if (data) {
                    setsignals([data]);
                } else {
                    setsignals([]);
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchsignals();
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

    const handleView = (signal) => {
        navigate(`/admin/signals/details/${signal?.id || ""}`, { state: { signal } });
        setDropdownOpen(null);
    };

    const handleEdit = (signal) => {
        console.log("Edit signal:", signal);
        setDropdownOpen(null);
    };

    const confirmDelete = async () => {
        try {
            if (!userId || !selectedsignal) return;

            await axios.delete(`${apiUrl}/signals/${selectedsignal.id}`, {
                headers: { "Content-Type": "application/json" },
                data: { userId },
            });

            setsignals((prev) => prev.filter((p) => p.id !== selectedsignal.id));
            setDeleteModalOpen(false);
            setSelectedsignal(null);
        } catch (error) {
            console.error("Error deleting signal:", error);
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

    const handleAddSignalClick = () => {
        setStep(1);
        setIsCreatingSignal(true);
    };

    const handleCreateSignalNext = (data) => {
        setFormData((prev) => ({ ...prev, personal: data }));
        setStep(2);
    };

    const handlePriceLevelsSubmit = async (data) => {
        try {
            // Combine data from both forms
            const finalData = {
                ...formData.personal,
                ...data,
                userId: userId
            };

            console.log("Final data to submit:", finalData);

            // Submit to your API endpoint
            const response = await axios.post(`${apiUrl}/signals`, finalData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Signal created successfully:", response.data);

            // Reset form and close modals
            resetAndClose();

            // Refresh the signals list
            // You can add a fetchSignals function here if needed

        } catch (error) {
            console.error("Error creating signal:", error);
            alert("Failed to create signal. Please try again.");
        }
    };

    const resetAndClose = () => {
        setStep(0);
        setIsCreatingSignal(false);
        setFormData({
            personal: {},
            documents: {}
        });
    };

    const handleCloseModals = () => {
        resetAndClose();
    };

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


    return (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 relative">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-900">Signals</h2>
                    <p className="text-sm text-gray-500">All Signal List</p>
                </div>

                <button
                    onClick={handleAddSignalClick}
                    className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    <Plus size={16} />
                    Add Signal
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : signals.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No signals found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2 border-gray-200">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-t border-gray-200">
                                <th className="px-4 py-2">Symbol ↓</th>
                                <th className="px-4 py-2">Trade Direction ↓</th>
                                <th className="px-4 py-2">Entry Price ↓</th>
                                <th className="px-4 py-2">Stop Loss(SL) ↓</th>
                                <th className="px-4 py-2">Target 1 ↓</th>
                                <th className="px-4 py-2">Date ↓</th>
                                <th className="px-4 py-2">Time ↓</th>
                                <th className="px-4 py-2 text-right"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {signals.map((signal, index) => (
                                <tr key={signal.id || index} className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <img
                                            src={signal.uplodedImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                            className="w-7 h-7 rounded-full"
                                            alt="symbol"
                                        />
                                        <span className="font-medium">{signal.instrument}</span>
                                    </td>

                                    <td className="px-4 py-3">{signal.tradeDirection}</td>
                                    <td className="px-4 py-3">{signal.entryPrice}</td>
                                    <td className="px-4 py-3">{signal.stopLoss}</td>
                                    <td className="px-4 py-3">{signal.targetFirst}</td>
                                    <td className="px-4 py-3">
                                        {formatISTDate(signal.createdAt)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {formatISTTime(signal.createdAt)}
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
                                onClick={() => handleView(signals[dropdownOpen])}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
                            >
                                <img src={viewIcon} alt="view" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                                <span className="font-medium">View </span>
                            </button>

                            <button
                                onClick={() => handleEdit(signals[dropdownOpen])}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700  hover:text-blue-700 transition-all duration-150 ease-out group"
                            >
                                <img src={editIcon} alt="edit" className="inline-block w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                                <span className="font-medium">Edit</span>
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                onClick={() => {
                                    setSelectedsignal(signals[dropdownOpen]);
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

            {/* Create Signal Modal */}
            {isCreatingSignal && step === 1 && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <CreateSignal
                            data={formData.personal}
                            onNext={handleCreateSignalNext}
                            onClose={handleCloseModals}
                        />
                    </div>
                </div>
            )}

            {/* Price Levels Modal */}
            {isCreatingSignal && step === 2 && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl w-[680px] mx-4">
                        <PriceLevels
                            data={formData.documents}
                            parentData={formData}
                            onSubmit={handlePriceLevelsSubmit}
                            onClose={handleCloseModals}
                        />
                    </div>
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