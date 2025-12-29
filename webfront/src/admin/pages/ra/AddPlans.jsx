import React, { useEffect, useState } from "react";
import { FiChevronDown, FiCheck, FiPlus } from "react-icons/fi";

export default function AddPlans() {
    const [segmentOpen, setSegmentOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [riskOpen, setRiskOpen] = useState(false);
    const [durationOpen, setDurationOpen] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState("Options");
    const [selectedCategory, setSelectedCategory] = useState("Intraday");
    const [selectedRisk, setSelectedRisk] = useState("Medium");
    const [selectedDuration, setSelectedDuration] = useState("1 Month");
    const [planName, setPlanName] = useState("BankNifty Options Intraday");
    const [idealCapital, setIdealCapital] = useState("₹50,000");
    const [planPrice, setPlanPrice] = useState("₹5,000");
    const [discount, setDiscount] = useState("10%");
    const [stopLoss, setStopLoss] = useState("20%");
    const [avgTrades, setAvgTrades] = useState("1 Daily");
    const [shortDescription, setShortDescription] = useState("");
    const [refundPolicy, setRefundPolicy] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const user = localStorage.getItem("user");
    const userId =  JSON.parse(user).id;


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setSegmentOpen(false);
                setCategoryOpen(false);
                setRiskOpen(false);
                setDurationOpen(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const segments = ["Options", "Futures", "Equity", "Currency", "Commodity"];
    const categories = ["Intraday", "Swing", "Positional", "Long-term"];
    const risks = ["Low", "Medium", "High", "Very High"];
    const durations = ["1 Week", "2 Weeks", "1 Month", "3 Months", "6 Months", "1 Year"];

    const apiUrl = import.meta.env.VITE_API_URL;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            if (imageFile) formData.append('uplodedImage', imageFile);
            formData.append("userId", userId);
            formData.append('planName', planName);
            formData.append('segment', selectedSegment);
            formData.append('category', selectedCategory);
            formData.append('risk', selectedRisk);
            formData.append('idealCapital', idealCapital.replace('₹', '').replace(',', ''));
            formData.append('duration', selectedDuration);
            formData.append('planPrice', planPrice.replace('₹', '').replace(',', ''));
            formData.append('discount', discount.replace('%', ''));
            formData.append('stopLoss', stopLoss.replace('%', ''));
            formData.append('avgTrades', avgTrades);
            formData.append('shortDescription', shortDescription);
            formData.append('refundPolicy', refundPolicy);

            const response = await fetch(`${apiUrl}/plans/add-plan`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add plan');
            }

            const result = await response.json();
            console.log("Plan added successfully:", result);
            
            alert("Plan created successfully!");
            resetForm();
            
        } catch (error) {
            console.error("Error adding plan:", error);
            alert("Failed to create plan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setPlanName("BankNifty Options Intraday");
        setSelectedSegment("Options");
        setSelectedCategory("Intraday");
        setSelectedRisk("Medium");
        setIdealCapital("₹50,000");
        setSelectedDuration("1 Month");
        setPlanPrice("₹5,000");
        setDiscount("10%");
        setStopLoss("20%");
        setAvgTrades("1 Daily");
        setShortDescription("");
        setRefundPolicy("");
        setImageFile(null);
        setImagePreview("");
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
            resetForm();
        }
    };

    const handleCurrencyChange = (value, setter) => {
        let numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue) {
            const formattedValue = new Intl.NumberFormat('en-IN').format(numericValue);
            setter(`₹${formattedValue}`);
        } else {
            setter('₹');
        }
    };

    const handlePercentageChange = (value, setter) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue) {
            setter(`${numericValue}%`);
        } else {
            setter('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="w-full max-w-full bg-white rounded-xl border border-gray-300">
                    <div className="px-6 py-4 border-b border-gray-300">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Create New Plan
                        </h2>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer">
                                <div className="w-20 h-20 border-2 border-dashed border-blue-400 rounded-lg flex flex-col items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
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
                                    onChange={handleImageUpload}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600 font-medium">Plan Name</label>
                                <input
                                    type="text"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none "
                                    required
                                />
                            </div>

                            <div className="relative dropdown">
                                <label className="text-sm text-gray-600 font-medium">Segment</label>
                                <div
                                    onClick={() => setSegmentOpen(!segmentOpen)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm bg-white border-gray-300 focus:outline-none cursor-pointer flex items-center justify-between hover:bg-gray-50"
                                >
                                    <span>{selectedSegment}</span>
                                    <FiChevronDown className={`text-gray-500 transition-transform ${segmentOpen ? "rotate-180" : ""}`} />
                                </div>

                                {segmentOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                        {segments.map((segment) => (
                                            <div
                                                key={segment}
                                                onClick={() => {
                                                    setSelectedSegment(segment);
                                                    setSegmentOpen(false);
                                                }}
                                                className="px-3 py-2.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                                            >
                                                <span>{segment}</span>
                                                {selectedSegment === segment && <FiCheck className="text-blue-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative dropdown">
                                <label className="text-sm text-gray-600 font-medium">Category</label>
                                <div
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm bg-white border-gray-300 focus:outline-none cursor-pointer flex items-center justify-between hover:bg-gray-50"
                                >
                                    <span>{selectedCategory}</span>
                                    <FiChevronDown className={`text-gray-500 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                                </div>

                                {categoryOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                        {categories.map((category) => (
                                            <div
                                                key={category}
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setCategoryOpen(false);
                                                }}
                                                className="px-3 py-2.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                                            >
                                                <span>{category}</span>
                                                {selectedCategory === category && <FiCheck className="text-blue-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative dropdown">
                                <label className="text-sm text-gray-600 font-medium">Risk</label>
                                <div
                                    onClick={() => setRiskOpen(!riskOpen)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm bg-white border-gray-300 focus:outline-none cursor-pointer flex items-center justify-between hover:bg-gray-50"
                                >
                                    <span>{selectedRisk}</span>
                                    <FiChevronDown className={`text-gray-500 transition-transform ${riskOpen ? "rotate-180" : ""}`} />
                                </div>

                                {riskOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                        {risks.map((risk) => (
                                            <div
                                                key={risk}
                                                onClick={() => {
                                                    setSelectedRisk(risk);
                                                    setRiskOpen(false);
                                                }}
                                                className="px-3 py-2.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                                            >
                                                <span>{risk}</span>
                                                {selectedRisk === risk && <FiCheck className="text-blue-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium">Ideal Capital</label>
                                <input
                                    type="text"
                                    value={idealCapital}
                                    onChange={(e) => handleCurrencyChange(e.target.value, setIdealCapital)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm border-gray-300 focus:outline-none "
                                    required
                                />
                            </div>

                            <div className="relative dropdown">
                                <label className="text-sm text-gray-600 font-medium">Duration</label>
                                <div
                                    onClick={() => setDurationOpen(!durationOpen)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm bg-white border-gray-300 focus:outline-none cursor-pointer flex items-center justify-between hover:bg-gray-50"
                                >
                                    <span>{selectedDuration}</span>
                                    <FiChevronDown className={`text-gray-500 transition-transform ${durationOpen ? "rotate-180" : ""}`} />
                                </div>

                                {durationOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                        {durations.map((duration) => (
                                            <div
                                                key={duration}
                                                onClick={() => {
                                                    setSelectedDuration(duration);
                                                    setDurationOpen(false);
                                                }}
                                                className="px-3 py-2.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                                            >
                                                <span>{duration}</span>
                                                {selectedDuration === duration && <FiCheck className="text-blue-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium">Plan Price</label>
                                <input
                                    type="text"
                                    value={planPrice}
                                    onChange={(e) => handleCurrencyChange(e.target.value, setPlanPrice)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm border-gray-300 focus:outline-none "
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium">Discount %(Optinal)</label>
                                <input
                                    type="text"
                                    value={discount}
                                    onChange={(e) => handlePercentageChange(e.target.value, setDiscount)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm border-gray-300 focus:outline-none "
                                    required
                                />
                            </div>
                        </div>

                        {/* Stop Loss and Avg Trades */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600 font-medium">Stoploss %</label>
                                <input
                                    type="text"
                                    value={stopLoss}
                                    onChange={(e) => handlePercentageChange(e.target.value, setStopLoss)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm border-gray-300 focus:outline-none "
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium">Avg Trades</label>
                                <input
                                    type="text"
                                    value={avgTrades}
                                    onChange={(e) => setAvgTrades(e.target.value)}
                                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm border-gray-300 focus:outline-none "
                                    required
                                />
                            </div>
                        </div>

                        {/* Description and Refund Policy */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600 font-medium">
                                    Short Description(Optinal)
                                </label>
                                <textarea
                                    value={shortDescription}
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    placeholder="Enter description"
                                    className="mt-1 w-full h-28 border rounded-lg px-3 py-2.5 text-sm resize-none border-gray-300 focus:outline-none "
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium">Refund Policy(Optinal)</label>
                                <textarea
                                    value={refundPolicy}
                                    onChange={(e) => setRefundPolicy(e.target.value)}
                                    placeholder="Enter policy"
                                    className="mt-1 w-full h-28 border rounded-lg px-3 py-2.5 text-sm resize-none border-gray-300 focus:outline-none "
                                    required
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-300">
                            <button 
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-6 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}