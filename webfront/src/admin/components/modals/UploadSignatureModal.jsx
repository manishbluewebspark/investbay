import { X, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function UploadSignatureModal({ open, onClose, onProceed }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  if (!open) return null;

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Upload Signature
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <hr className="text-gray-300"/>

        {/* Upload Area */}
        <div className="px-6 py-6">
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-center"
          >
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Upload className="text-blue-600" size={28} />
            </div>

            <p className="text-sm text-gray-700">
              <span className="font-medium text-blue-600">Click here</span>{" "}
              to upload or drop here
            </p>

            {file && (
              <p className="mt-2 text-xs text-gray-500">
                Selected file: {file.name}
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        <hr className="text-gray-300"/>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-400 px-10 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={!file}
            onClick={() => onProceed?.(file)}
            className={`rounded-md px-10 py-2 text-sm font-medium text-white
              ${
                file
                  ? "bg-black hover:bg-gray-900"
                  : "cursor-not-allowed bg-gray-300"
              }`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
