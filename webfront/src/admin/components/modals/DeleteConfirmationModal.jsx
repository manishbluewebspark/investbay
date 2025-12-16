import React from "react";
import { Trash2 } from "lucide-react";
import Delete from "../../../assets/delete.png"

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center py-8 px-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto w-30 h-30">
          <div className="w-30 h-30 rounded-full  flex items-center justify-center">
            <img
              src={Delete}
              alt="User Avatar"
              className="w-24 h-24"
            />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Delete RA
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this Research Analyst
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-8 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition font-medium"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
