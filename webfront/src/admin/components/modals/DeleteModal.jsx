// DeleteModal.jsx
import { Trash2 } from "lucide-react";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
        {/* Icon */}
        <div className="mx-auto w-14 h-14 mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 className="w-7 h-7 text-red-600" />
        </div>

        <h3 className="text-lg font-semibold font-['DM_Sans'] text-gray-900 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-6 font-['DM_Sans']">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-['DM_Sans'] font-medium text-sm hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 order-2 sm:order-1"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-600 text-white font-['DM_Sans'] font-medium text-sm hover:bg-red-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}