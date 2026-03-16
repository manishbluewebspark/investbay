import { X, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function UploadSignatureModal({ open, onClose, onProceed }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setError('');
    
    if (selected) {
      // Check file size (max 2MB)
      if (selected.size > 2 * 1024 * 1024) {
        setError('File size should be less than 2MB');
        setFile(null);
        return;
      }
      
      // Check file type
      if (!selected.type.startsWith('image/')) {
        setError('Please upload an image file');
        setFile(null);
        return;
      }
      
      setFile(selected);
    }
  };

  const handleProceed = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      await onProceed?.(file);
    } catch (error) {
      console.error('Error uploading signature:', error);
    } finally {
      setIsUploading(false);
    }
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
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 2MB (JPEG, PNG)
            </p>

            {file && (
              <div className="mt-2">
                <p className="text-xs text-green-600">
                  ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}

            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
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
            disabled={isUploading}
            className="rounded-md border border-gray-400 px-10 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={!file || isUploading || error}
            onClick={handleProceed}
            className={`rounded-md px-10 py-2 text-sm font-medium text-white
              ${
                file && !isUploading && !error
                  ? "bg-black hover:bg-gray-900"
                  : "cursor-not-allowed bg-gray-300"
              }`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </span>
            ) : 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}