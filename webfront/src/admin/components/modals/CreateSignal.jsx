import React, { useState, useEffect, useRef } from 'react';
import {
    FiChevronDown,
    FiChevronUp,
    FiCheck,
    FiSearch,
    FiX
} from 'react-icons/fi';
import PriceLevels from '../../components/modals/PricesLevels';

const CreateSignal = ({ data, onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [parentData, setParentData] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const user = localStorage.getItem("user");
    const userId = JSON.parse(user).id;

    const [formData, setFormData] = useState({
        instrument: '',
        instrumentType: '',
        tradeDirection: '',
        segment: '',
        exchange: '',
        duration: '',
        riskRewardRatio: ''
    });

    useEffect(() => {
        if (data) {
            setFormData(prev => ({ ...prev, ...data }));
            if (data.subscriptionPlan) {
                setSelectedPlan(data.subscriptionPlan);
            }
        }
    }, [data]);

    const planOptions = [
        { id: 'options-intraday-pro', name: 'Options Intraday Pro', description: 'Advanced intraday options strategies' },
        { id: 'options-intraday-basic', name: 'Options Intraday Basic', description: 'Basic intraday options trading' },
        { id: 'options-swing', name: 'Options Swing', description: 'Swing trading for options' },
        { id: 'equity-intraday', name: 'Equity Intraday', description: 'Intraday equity trading signals' },
        { id: 'premium-plan', name: 'Premium Plan', description: 'All inclusive premium plan' }
    ];

    const instrumentTypes = ['CE', 'PE', 'FUT', 'EQ'];
    const tradeDirections = ['BUY', 'SELL'];
    const segments = ['Options', 'Futures', 'Equity', 'Currency'];
    const exchanges = ['NSE', 'BSE', 'MCX'];
    const durations = ['Intraday', 'Swing', 'Positional', 'Long Term'];

    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(prev => (prev === dropdownName ? null : dropdownName));
    };

    const handleSelect = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setActiveDropdown(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            subscriptionPlan: selectedPlan,
             userId: userId,
        };
        setParentData(dataToSend);
        setShowPriceModal(true);
    };

    const handleCancel = () => {
        onClose();
    };

    const isFormValid = () => {
        return (
            selectedPlan &&
            formData.instrument &&
            formData.instrumentType &&
            formData.tradeDirection &&
            formData.segment &&
            formData.exchange &&
            formData.duration &&
            formData.riskRewardRatio
        );
    };

    const CustomDropdown = ({
        label,
        value,
        options,
        dropdownName,
        placeholder = "Select an option",
        onSelect
    }) => {
        const isOpen = activeDropdown === dropdownName;
        const localRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (localRef.current && !localRef.current.contains(event.target)) {
                    setActiveDropdown(prev => (prev === dropdownName ? null : prev));
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [dropdownName]);

        return (
            <div className="relative" ref={localRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
                <div
                    className={`w-full p-3 bg-white border rounded-lg cursor-pointer flex justify-between items-center transition-colors ${value ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
                        } ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}
                    onClick={() => toggleDropdown(dropdownName)}
                >
                    <span className={`${value ? 'text-gray-800' : 'text-gray-400'}`}>
                        {value || placeholder}
                    </span>
                    <span className="text-gray-500">
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {options.map((option) => {
                            const optionValue = typeof option === 'object' ? option.name : option;
                            const optionKey = typeof option === 'object' ? option.id || option.name : option;

                            return (
                                <div
                                    key={optionKey}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${value === optionValue ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => onSelect(dropdownName, optionValue)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`font-medium ${value === optionValue ? 'text-blue-700' : 'text-gray-800'
                                            }`}>
                                            {optionValue}
                                        </span>
                                        {value === optionValue && (
                                            <FiCheck className="text-green-500 text-lg" />
                                        )}
                                    </div>
                                    {typeof option === 'object' && option.description && (
                                        <span className="text-xs text-gray-500 mt-1 block">
                                            {option.description}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const handlePriceSubmit = async (priceData) => {
        try {
            const payload = {
                ...parentData,
                ...priceData,
                userId: userId,
            };

            const res = await fetch(`${apiUrl}/signals/create-signal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || 'Error creating signal');
                return;
            }

            const result = await res.json();
            console.log('Signal saved:', result);
            alert('Signal created successfully!');
            setShowPriceModal(false);
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300">
                <h1 className="text-2xl font-bold text-gray-800">Create Signal</h1>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FiX size={20} />
                </button>
            </div>

            <form onSubmit={handleNext}>
                <div className="space-y-6">
                    {/* Instrument/instrument */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instrument / instrument</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="instrument"
                                value={formData.instrument}
                                onChange={handleInputChange}
                                placeholder="e.g., SENSEX25DEC85800CE"
                                className="w-full pl-10 p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none "
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Enter the complete instrument with expiry and strike price</p>
                    </div>

                    {/* Instrument Type and Trade Direction */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomDropdown
                            label="Instrument Type"
                            value={formData.instrumentType}
                            options={instrumentTypes}
                            dropdownName="instrumentType"
                            placeholder="Select Type"
                            onSelect={handleSelect}
                        />

                        <CustomDropdown
                            label="Trade Direction"
                            value={formData.tradeDirection}
                            options={tradeDirections}
                            dropdownName="tradeDirection"
                            placeholder="Select Direction"
                            onSelect={handleSelect}
                        />
                    </div>

                    {/* Segment and Exchange */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomDropdown
                            label="Segment"
                            value={formData.segment}
                            options={segments}
                            dropdownName="segment"
                            placeholder="Select Segment"
                            onSelect={handleSelect}
                        />

                        <CustomDropdown
                            label="Exchange"
                            value={formData.exchange}
                            options={exchanges}
                            dropdownName="exchange"
                            placeholder="Select Exchange"
                            onSelect={handleSelect}
                        />
                    </div>

                    {/* Duration and Risk Reward */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomDropdown
                            label="Duration"
                            value={formData.duration}
                            options={durations}
                            dropdownName="duration"
                            placeholder="Select Duration"
                            onSelect={handleSelect}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Reward Ratio</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="riskRewardRatio"
                                    value={formData.riskRewardRatio}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1 : 6.7"
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Format: Risk : Reward (e.g., 1:2.5)</p>
                        </div>
                    </div>

                    {/* Subscription Plan Dropdown */}
                    <CustomDropdown
                        label="Subscription Plan"
                        value={selectedPlan}
                        options={planOptions}
                        dropdownName="subscriptionPlan"
                        placeholder="Select a subscription plan"
                        onSelect={(name, value) => {
                            setSelectedPlan(value);
                            setActiveDropdown(null);
                        }}
                    />
                    {!selectedPlan && (
                        <p className="mt-1 text-xs text-red-500">
                            Please select a subscription plan
                        </p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-10 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-10 py-2 bg-black text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isFormValid()}
                    >
                        submit
                    </button>
                </div>
            </form>

            {/* PriceLevels Modal */}
            {showPriceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">
                        <PriceLevels
                            onClose={() => setShowPriceModal(false)}
                            onSubmit={handlePriceSubmit}
                            data={null}
                            parentData={parentData}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateSignal;
