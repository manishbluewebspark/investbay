import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PlanFilter = ({ open, onClose, onApply, onReset }) => {
    const [filters, setFilters] = useState({
        date: "",
        plan: "",
        startDate: null,
        endDate: null,
        customDateRange: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "date" && value === "custom") {
            setFilters((prev) => ({
                ...prev,
                [name]: value,
                customDateRange: true,
            }));
        } else if (name === "date") {
            setFilters((prev) => ({
                ...prev,
                [name]: value,
                customDateRange: false,
                startDate: null,
                endDate: null,
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleStartDateChange = (date) => {
        setFilters((prev) => ({
            ...prev,
            startDate: date,
        }));
    };

    const handleEndDateChange = (date) => {
        setFilters((prev) => ({
            ...prev,
            endDate: date,
        }));
    };

    const handleApply = () => {
        // Prepare final filters object
        const finalFilters = {
            plan: filters.plan,
            date: filters.date,
        };

        // If custom date range is selected, include the dates
        if (filters.customDateRange && filters.startDate && filters.endDate) {
            finalFilters.startDate = filters.startDate;
            finalFilters.endDate = filters.endDate;
        }

        onApply(finalFilters);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            date: "",
            plan: "",
            startDate: null,
            endDate: null,
            customDateRange: false,
        });
        onReset();
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0  backdrop-blur-sm bg-opacity-50 z-50"
                onClick={onClose}
            ></div>

            {/* Filter Panel */}
            <div className="fixed top-50 right-0  w-90 bg-white shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto rounded-tl-xl rounded-bl-xl">
                <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 border-b border-gray-300 py-2">
                        <h3 className="text-xl font-semibold text-gray-900">Filter</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                            aria-label="Close filter"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 space-y-6">
                        {/* Date Filter */}
                        <div className="space-y-4">
                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} />
                                    Date Range
                                </label>
                                <div className="relative">
                                    <select
                                        name="date"
                                        value={filters.date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none appearance-none pr-10"
                                    >
                                        <option value="">Select Date Range</option>
                                        <option value="today">Today</option>
                                        <option value="yesterday">Yesterday</option>
                                        <option value="last7">Last 7 days</option>
                                        <option value="last30">Last 30 days</option>
                                        <option value="thisMonth">This Month</option>
                                        <option value="lastMonth">Last Month</option>
                                        <option value="custom">Custom Range</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <ChevronDown size={18} className="text-gray-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Custom Date Range Selector */}
                            {filters.customDateRange && (
                                <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={filters.startDate}
                                                onChange={handleStartDateChange}
                                                selectsStart
                                                startDate={filters.startDate}
                                                endDate={filters.endDate}
                                                maxDate={filters.endDate || new Date()}
                                                placeholderText="Select start date"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none pr-10"
                                                dateFormat="MMM dd, yyyy"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <Calendar size={16} className="text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={filters.endDate}
                                                onChange={handleEndDateChange}
                                                selectsEnd
                                                startDate={filters.startDate}
                                                endDate={filters.endDate}
                                                minDate={filters.startDate}
                                                maxDate={new Date()}
                                                placeholderText="Select end date"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none pr-10"
                                                dateFormat="MMM dd, yyyy"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <Calendar size={16} className="text-gray-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Show selected range summary */}
                                    {filters.startDate && filters.endDate && (
                                        <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                                            Selected: {filters.startDate.toLocaleDateString()} - {filters.endDate.toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Plan Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan
                            </label>
                            <div className="relative">
                                <select
                                    name="plan"
                                    value={filters.plan}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none appearance-none pr-10"
                                >
                                    <option value="">Select Plan Type</option>
                                    <option value="active">Active Plans</option>
                                    <option value="inactive">Inactive Plans</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDown size={18} className="text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-6 border-t border-gray-200 mt-6 flex gap-4">
                        <button
                            onClick={handleReset}
                            className="flex-1 h-10 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center"
                        >
                            Reset All
                        </button>

                        <button
                            onClick={handleApply}
                            disabled={filters.customDateRange && (!filters.startDate || !filters.endDate)}
                            className={`flex-1 h-10 px-4 bg-black text-white rounded-lg transition font-medium flex items-center justify-center ${filters.customDateRange && (!filters.startDate || !filters.endDate)
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-800'
                                }`}
                        >
                            Apply Filter
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PlanFilter;