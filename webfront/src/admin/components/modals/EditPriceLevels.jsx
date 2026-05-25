import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function EditPriceLevels({ onClose, onSubmit, data, parentData }) {
  const [priceData, setPriceData] = useState({
    entryPrice: "",
    stopLoss: "",
    targetFirst: "",
    targetSecond: "",
    targetThird: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!priceData.entryPrice || !priceData.stopLoss || !priceData.targetFirst) {
      toast.error("Please fill Entry Price, Stop Loss, and Target 1");
      return;
    }

    try {
      setIsSubmitting(true);

      if (onSubmit) {
        await onSubmit(priceData);
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating price levels!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-300 py-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Edit Price Levels
        </h2>
        <button
          onClick={handleCancel}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          disabled={isSubmitting}
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
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-md focus:outline-none no-spinner"
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
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-md focus:outline-none no-spinner"
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
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-md focus:outline-none no-spinner"
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
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-md focus:outline-none no-spinner"
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
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-md focus:outline-none no-spinner"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3 border-t border-gray-300 py-2">
        <button
          onClick={handleCancel}
          className="h-10 px-5 rounded-lg border border-gray-200 text-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="h-10 px-6 rounded-lg bg-gray-900 text-md text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            'Update Signal'
          )}
        </button>
      </div>
    </div>
  );
}