import { X, Upload } from "lucide-react";
import { useState, useRef } from "react";

const AddVideoModal = ({ isOpen, onClose, courseId, userId }) => {
  if (!isOpen) return null;

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!videoTitle || !videoDuration || !selectedFile || !courseId || !userId) {
      alert("Please fill all fields and select a video");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('videoFile', selectedFile);
    formData.append('courseId', courseId);
    formData.append('userId', userId);
    formData.append('videoTitle', videoTitle);
    formData.append('videoDuration', videoDuration);

    try {
      const response = await fetch(`${apiUrl}/videos/add-videos`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Video added successfully!");
        onClose();
        // Reset form
        setVideoTitle("");
        setVideoDuration("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert("Failed to add video");
      }
    } catch (error) {
      alert("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800">Add Video</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            disabled={uploading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Video Title</label>
              <input
                type="text"
                placeholder="Options Intraday Pro"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Video Duration</label>
              <input
                type="text"
                placeholder="12 min"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Box */}
          <div 
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
              selectedFile 
                ? "border-green-400 bg-green-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClickUpload}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Upload size={20} className="text-gray-600" />
            </div>

            {selectedFile ? (
              <>
                <p className="text-sm font-medium text-green-700 mb-1">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                <span className="text-blue-600 cursor-pointer font-medium hover:underline">
                  Click here
                </span>{" "}
                or drop video here
              </p>
            )}
          </div>

          {/* Add Video Button */}
          <button 
            onClick={handleSubmit}
            disabled={!videoTitle || !videoDuration || !selectedFile || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              "+ Add Video"
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-300 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-12 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!videoTitle || !videoDuration || !selectedFile || uploading}
            className="rounded-lg bg-black px-12 py-2 text-sm text-white hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? "Uploading..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;
