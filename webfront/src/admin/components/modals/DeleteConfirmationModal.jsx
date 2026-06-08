import React from "react";
import { Trash2 } from "lucide-react";

const DeleteConfirmationModal = ({ onConfirm, onCancel, itemName = "Research Analyst" }) => {
  return (
    <div
      className="fixed inset-0 z-[2000] bg-[#c8b8a8]/50 backdrop-blur-md flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white/15 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-2xl w-full max-w-sm text-center py-10 px-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft glowing orb behind icon */}
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-red-400/30 to-amber-400/20 blur-2xl" />
        
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/10 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
            <Trash2 className="w-10 h-10 text-red-400 drop-shadow-md" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-[#2a2118] mb-2 font-['Sora']">
          Delete {itemName}
        </h2>
        
        <p className="text-sm text-[#8a7e74] mb-6 font-['DM_Sans']">
          Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-[#2a2118] font-medium font-['DM_Sans'] hover:bg-white/30 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium font-['DM_Sans'] hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;