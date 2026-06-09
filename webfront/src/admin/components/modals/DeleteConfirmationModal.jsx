
import React from "react";
import { Trash2, X } from "lucide-react";

export default function DeleteConfirmationModal({ onConfirm, onCancel, itemName = "Research Analyst" }) {
  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/30 flex items-center justify-center px-4"
      style={{ backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="bg-white border border-gray-100 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.1)] w-full max-w-sm p-8 text-center relative"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        {/* Close */}
        <button onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <Trash2 className="w-7 h-7 text-red-500" strokeWidth={1.8} />
        </div>

        {/* Text */}
        <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 18, color: "#111827", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Delete {itemName}?
        </h2>
        <p className="text-[13.5px] text-gray-500 leading-relaxed mb-7">
          Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition-all hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:-translate-y-0.5"
            style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
