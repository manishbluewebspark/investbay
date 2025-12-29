import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X, Plus, ChevronDown, Search, Check } from "lucide-react";
import { FiPlus } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

// Custom Dropdown Component
const CustomDropdown = ({ label, options, value, onChange, placeholder = "Select" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {/* Dropdown Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-all duration-200 ${
                    isOpen
                        ? "border-blue-500 ring-2 ring-blue-200 bg-white"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
            >
                <span className={selectedOption?.value ? "text-gray-900" : "text-gray-400"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-xl animate-fadeIn">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between group ${
                                        option.value === value
                                            ? "bg-blue-50 text-blue-600"
                                            : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {option.value === value && (
                                        <Check size={16} className="text-blue-600" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const AddCourseModal = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        category: "",
        level: "",
        language: "",
        validity: "",
        price: "",
        discount: "",
        description: "",
        uplodedImage: null,
    });

    // Dropdown options
    const categoryOptions = [
        { value: "options", label: "Options Trading" },
        { value: "equity", label: "Equity Trading" },
        { value: "futures", label: "Futures & Commodities" },
        { value: "forex", label: "Forex Trading" },
        { value: "crypto", label: "Cryptocurrency" },
        { value: "mutual-funds", label: "Mutual Funds" },
        { value: "technical-analysis", label: "Technical Analysis" },
        { value: "fundamental-analysis", label: "Fundamental Analysis" },
    ];

    const levelOptions = [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
        { value: "expert", label: "Expert" },
        { value: "all-levels", label: "All Levels" },
    ];

    const languageOptions = [
        { value: "hindi", label: "Hindi" },
        { value: "english", label: "English" },
        { value: "tamil", label: "Tamil" },
        { value: "telugu", label: "Telugu" },
        { value: "kannada", label: "Kannada" },
        { value: "malayalam", label: "Malayalam" },
        { value: "bengali", label: "Bengali" },
        { value: "marathi", label: "Marathi" },
    ];

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setForm({ ...form, uplodedImage: e.target.files[0] });
        }
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

const handleSubmit = async () => {
    try {
        setLoading(true);
        setError("");

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        if (userId) {
            formData.append("userId", userId);
        }

        await axios.post(`${API_URL}/courses/add-course`, formData);

        onSuccess?.();
        onClose();
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Failed to create course. Please try again."
        );
        console.error(err);
    } finally {
        setLoading(false);
    }
};



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-300 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Create Course
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-8">
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer">
                                <div className="w-20 h-20 border-2 border-dashed border-blue-400 rounded-lg flex flex-col items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                                    {form.uplodedImage ? (
                                        <img
                                            src={URL.createObjectURL(form.uplodedImage)}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <FiPlus className="w-7 h-7" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="uplodedImage"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <div>
                                <p className="text-sm font-medium">Upload Image</p>
                                <p className="text-sm text-gray-400">
                                    Recommend size: 400×400px
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Course Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Title *
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Advanced Options Trading Masterclass"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-3 focus:ring-blue-100 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Selects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <CustomDropdown
                            label="Trading Category *"
                            options={categoryOptions}
                            value={form.category}
                            onChange={(value) => handleChange("category", value)}
                            placeholder="Select category"
                        />

                        <CustomDropdown
                            label="Course Level *"
                            options={levelOptions}
                            value={form.level}
                            onChange={(value) => handleChange("level", value)}
                            placeholder="Select level"
                        />

                        <CustomDropdown
                            label="Language *"
                            options={languageOptions}
                            value={form.language}
                            onChange={(value) => handleChange("language", value)}
                            placeholder="Select language"
                        />
                    </div>

                    {/* Price Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Access Validity
                            </label>
                            <div className="relative">
                                <input
                                    name="validity"
                                    value={form.validity}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1 Year"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-3 focus:ring-blue-100 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Price (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    ₹
                                </span>
                                <input
                                    name="price"
                                    value={form.price}
                                    onChange={handleInputChange}
                                    placeholder="4999"
                                    className="w-full rounded-xl border border-gray-300 px-11 py-3.5 text-sm focus:border-blue-500 focus:ring-3 focus:ring-blue-100 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount
                            </label>
                            <div className="relative">
                                <input
                                    name="discount"
                                    value={form.discount}
                                    onChange={handleInputChange}
                                    placeholder="20%"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-3 focus:ring-blue-100 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Description *
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            rows="5"
                            onChange={handleInputChange}
                            placeholder="Provide a detailed description of what students will learn in this course..."
                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-3 focus:ring-blue-100 focus:outline-none transition-all"
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-shake">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <X size={16} className="text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-red-600">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-300">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-500">
                                <span className="text-red-500">*</span> Required fields
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-6 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        loading ||
                                        !form.title ||
                                        !form.category ||
                                        !form.level ||
                                        !form.language
                                    }
                                    className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-black text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating Course...
                                        </>
                                    ) : (
                                        <>
                                            Next
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCourseModal;
