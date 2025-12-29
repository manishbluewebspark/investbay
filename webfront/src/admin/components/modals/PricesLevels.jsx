// PriceLevels.jsx
import React, { useState, useEffect } from "react";

export default function PriceLevels({ onClose, onSubmit, data, parentData }) {
  const [priceData, setPriceData] = useState({
    entryPrice: "",
    stopLoss: "",
    targetFirst: "",
    targetSecond: "",
    targetThird: ""
  });

  useEffect(() => {
    if (data) {
      setPriceData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPriceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!priceData.entryPrice || !priceData.stopLoss || !priceData.targetFirst) {
      alert("Please fill all required fields: Entry Price, Stop Loss, and Target 1");
      return;
    }

    if (onSubmit) {
      onSubmit(priceData);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Price Levels
        </h2>
        <button
          onClick={handleCancel}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Entry Price *
          </label>
          <input
            type="number"
            name="entryPrice"
            value={priceData.entryPrice}
            onChange={handleInputChange}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none no-spinner"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Stop Loss (SL) *
          </label>
          <input
            type="number"
            name="stopLoss"
            value={priceData.stopLoss}
            onChange={handleInputChange}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none no-spinner"
            required
          />
        </div>

        <div />

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Target 1 *
          </label>
          <input
            type="number"
            name="targetFirst"
            value={priceData.targetFirst}
            onChange={handleInputChange}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none no-spinner"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Target 2 (Optional)
          </label>
          <input
            type="number"
            name="targetSecond"
            value={priceData.targetSecond}
            onChange={handleInputChange}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none no-spinner"
            placeholder="Enter target"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Target 3 (Optional)
          </label>
          <input
            type="number"
            name="targetThird"
            value={priceData.targetThird}
            onChange={handleInputChange}
            placeholder="Enter target"
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none no-spinner"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="h-10 px-5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="h-10 px-6 rounded-lg bg-gray-900 text-sm text-white hover:bg-black"
        >
          Submit Signal
        </button>
      </div>
    </div>
  );
}
