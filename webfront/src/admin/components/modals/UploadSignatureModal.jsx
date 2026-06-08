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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-['Aileron_Black'] font-bold text-gray-900">
            Upload Signature
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="px-6 py-8">
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center transition-all duration-300 hover:border-green-300 hover:bg-gray-100"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Upload className="text-gray-600" size={28} />
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-['Aileron_Black'] font-semibold text-gray-900">Click here</span>{" "}
              to upload or drag & drop
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Max file size: 2MB (JPEG, PNG)
            </p>

            {file && (
              <div className="mt-3 px-3 py-1.5 bg-green-50 rounded-full">
                <p className="text-xs text-green-700 font-medium">
                  ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}

            {error && (
              <p className="mt-3 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full">
                {error}
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Signature Guidelines */}
          <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-['Aileron_Black'] font-semibold text-gray-700">Guidelines:</span>
              <br />
              • Use a clear, high-contrast image of your signature on white background
              <br />
              • Signature should be centered and properly visible
              <br />
              • Supported formats: JPEG, PNG (max 2MB)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-xl border border-gray-300 px-8 py-2.5 text-sm font-['Aileron_Black'] font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={!file || isUploading || error}
            onClick={handleProceed}
            className={`rounded-xl px-8 py-2.5 text-sm font-['Aileron_Black'] font-semibold transition-all duration-200 ${
              file && !isUploading && !error
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
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