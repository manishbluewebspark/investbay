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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6 text-center border border-gray-100">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>

        <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-6">
          {description}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-['Aileron_Black'] font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-['Aileron_Black'] font-semibold text-sm hover:bg-red-700 transition-all duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}