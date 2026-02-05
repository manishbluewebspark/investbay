import { X, Upload } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function EditFeedModal({ open, onClose, feed, onUpdateSuccess }) {
  // ✅ Proper null check
  if (!open || !feed) return null;

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const ra_id = user?.id;

  // ✅ useCallback for stable functions
  const [feedText, setFeedText] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Proper initialization with useEffect
  useEffect(() => {
    if (open && feed) {
      setFeedText(feed.feed_text || "");
      setTags(feed.feed_tags?.join(" ") || "");
      setExistingDocuments(feed.feed_documents || []);
      setDocumentsToDelete([]);
      setFiles([]);
    }
  }, [open, feed]);

  const handleFileChange = useCallback((e) => {
    setFiles(Array.from(e.target.files));
  }, []);

  const handleRemoveExistingDocument = useCallback((docId) => {
    setDocumentsToDelete(prev => [...prev, docId]);
    setExistingDocuments(prev => prev.filter(doc => doc.id !== docId));
  }, []);

  const handleRemoveNewFile = useCallback((index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }, [files]);

  const handleSubmit = async () => {
    if (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) {
      alert("Feed text or file is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("ra_id", ra_id);
      formData.append("feed_text", feedText.trim());

      // Add tags
      tags
        .split(" ")
        .filter(Boolean)
        .forEach((tag) => formData.append("feed_tags[]", tag.trim()));

      // Add new files
      files.forEach((file) => {
        formData.append("documents", file);
      });

      // Add documents to delete
      documentsToDelete.forEach((docId) => {
        formData.append("documents_to_delete[]", docId);
      });

      await axios.put(
        `${apiUrl}/feeds/update/${feed.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Feed updated successfully!");
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Feed update error:", error);
      alert("Failed to update feed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset form on close
  useEffect(() => {
    if (!open) {
      setFeedText("");
      setTags("");
      setFiles([]);
      setExistingDocuments([]);
      setDocumentsToDelete([]);
      setLoading(false);
    }
  }, [open]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Feed</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* About Feed */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              About Feed
            </label>
            <textarea
              rows={4}
              value={feedText}
              onChange={(e) => setFeedText(e.target.value)}
              placeholder="Write feed details..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#NiftyAnalysis #MarketOutlook"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Existing Files
              </label>
              <div className="space-y-2">
                {existingDocuments.map((doc, index) => {
                  const isImage = doc.mimetype?.startsWith("image");
                  const src = doc.filename.startsWith("http")
                    ? doc.filename
                    : `${apiUrl}/${doc.filename}`;

                  return (
                    <div key={doc.id || index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50">
                      <div className="flex items-center gap-3">
                        {isImage ? (
                          <img
                            src={src}
                            alt={doc.filename}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                            <span className="text-xs">Video</span>
                          </div>
                        )}
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">
                          {doc.original_filename || doc.filename}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingDocument(doc.id)}
                        className="rounded-md p-1 text-red-500 hover:bg-red-50"
                        title="Remove this file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* New Files */}
          {files.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Files to Upload
              </label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-blue-50">
                    <div className="flex items-center gap-3">
                      {file.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                          <span className="text-xs">Video</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(index)}
                      className="rounded-md p-1 text-red-500 hover:bg-red-50"
                      title="Remove this file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload box */}
          <div>
            <label
              htmlFor="feedUpload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-10 text-center transition hover:bg-gray-50 hover:border-blue-400"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Upload className="text-blue-600" size={22} />
              </div>
              <p className="text-sm font-medium text-blue-600">
                Click here to upload Images or Videos
              </p>
              <p className="mt-1 text-xs text-gray-500">
                You can add new files or replace existing ones
              </p>
              {(files.length > 0 || existingDocuments.length > 0) && (
                <p className="mt-2 text-xs text-gray-500 font-medium">
                  {existingDocuments.length} existing, {files.length} new
                </p>
              )}
            </label>
            <input
              id="feedUpload"
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-10 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-black px-10 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Feed"}
          </button>
        </div>
      </div>
    </div>
  );
}
