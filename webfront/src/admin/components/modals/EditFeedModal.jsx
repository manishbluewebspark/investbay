// EditFeedModal.jsx
import { X, Upload, ChevronDown, ImageIcon, VideoIcon, FileIcon, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export default function EditFeedModal({ open, onClose, feed, onUpdateSuccess }) {
  if (!open || !feed) return null;

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const isRA = userRole === "ra";
  
  const [feedText, setFeedText] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysts, setAnalysts] = useState([]);
  const [selectedRA, setSelectedRA] = useState(null);
  const [analystLoading, setAnalystLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const fileInputRef = useRef(null);

  // Dynamic RA ID based on role
  const getRAId = () => {
    if (isRA) return user?.id;
    return selectedRA?.id || feed.ra_id || user?.id;
  };

  const getRAName = () => {
    if (isRA) return user?.name;
    return selectedRA?.name || feed.ra_name || user?.name;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch analysts for admin only
  const fetchAnalysts = useCallback(async () => {
    if (isRA) return;
    
    try {
      setAnalystLoading(true);
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data.success) {
        setAnalysts(res.data.data || []);
        const currentRA = res.data.data.find(ra => ra.id === feed.ra_id);
        if (currentRA) {
          setSelectedRA(currentRA);
        } else if (res.data.data.length > 0) {
          setSelectedRA(res.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching analysts:", error);
    } finally {
      setAnalystLoading(false);
    }
  }, [apiUrl, isRA, feed.ra_id]);

  // Tag handling functions
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    
    let formattedTag = trimmedTag;
    if (!formattedTag.startsWith('#')) formattedTag = '#' + formattedTag;
    formattedTag = formattedTag.replace(/\s+/g, '');
    
    if (tags.includes(formattedTag)) {
      setError(`Tag "${formattedTag}" already exists`);
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    if (tags.length >= 10) {
      setError("Maximum 10 tags allowed");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setTags([...tags, formattedTag]);
    setTagInput("");
    setError("");
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // Initialize from feed data
  useEffect(() => {
    if (open && feed) {
      const cleanText = feed.feed_text
        ?.replace(/\\\\r\\\\n/g, '\n')
        .replace(/\\r\\n/g, '\n')
        .replace(/\r\n/g, '\n') || "";
      
      setFeedText(cleanText);
      
      // Parse tags
      if (feed.feed_tags) {
        let parsedTags = [];
        if (Array.isArray(feed.feed_tags)) {
          parsedTags = feed.feed_tags;
        } else if (typeof feed.feed_tags === 'string') {
          try {
            parsedTags = JSON.parse(feed.feed_tags);
          } catch {
            parsedTags = feed.feed_tags.split(/[,\s]+/).filter(t => t.trim());
          }
        }
        setTags(parsedTags);
      } else {
        setTags([]);
      }
      
      setExistingDocuments(feed.feed_documents || []);
      setDocumentsToDelete([]);
      setFiles([]);
      setFilePreviews([]);
      setTagInput("");
      setError("");
      
      if (!isRA) fetchAnalysts();
    }
  }, [open, feed, isRA, fetchAnalysts]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl);
      });
    };
  }, [filePreviews]);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length + files.length > 10) {
      setError("Maximum 10 files allowed");
      return;
    }

    const oversizedFiles = selectedFiles.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed 50MB limit`);
      return;
    }

    const newPreviews = selectedFiles.map(file => {
      const previewUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'document';
      
      return {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        type: fileType,
        previewUrl,
        size: file.size,
        formattedSize: formatFileSize(file.size)
      };
    });

    setFiles(prev => [...prev, ...selectedFiles]);
    setFilePreviews(prev => [...prev, ...newPreviews]);
    setError("");
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [files.length]);

  const handleRemoveExistingDocument = useCallback((docIndex) => {
    setDocumentsToDelete(prev => [...prev, docIndex]);
    setExistingDocuments(prev => {
      const newDocs = [...prev];
      newDocs.splice(docIndex, 1);
      return newDocs;
    });
  }, []);

  const handleRemoveNewFile = useCallback((index) => {
    if (filePreviews[index]?.previewUrl) {
      URL.revokeObjectURL(filePreviews[index].previewUrl);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  }, [filePreviews]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={16} className="text-blue-500" />;
      case 'video': return <VideoIcon size={16} className="text-red-500" />;
      default: return <FileIcon size={16} className="text-gray-500" />;
    }
  };

  const handleSubmit = async () => {
    if (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) {
      setError("Feed text or file is required");
      return;
    }

    if (!isRA && !getRAId()) {
      setError("Please select a Research Analyst");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("ra_id", getRAId());
      formData.append("ra_name", getRAName());
      formData.append("feed_text", feedText.trim());
      formData.append("id", feed.id);

      if (tags.length > 0) {
        formData.append("feed_tags", JSON.stringify(tags));
      }

      files.forEach((file) => formData.append("documents", file));
      documentsToDelete.forEach((docIndex) => formData.append("documents_to_delete[]", docIndex));

      await axios.put(`${apiUrl}/feeds/${feed.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Feed update error:", error);
      setError("Failed to update feed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Reset form on close
  useEffect(() => {
    if (!open) {
      setFeedText("");
      setTagInput("");
      setTags([]);
      setFiles([]);
      setFilePreviews([]);
      setExistingDocuments([]);
      setDocumentsToDelete([]);
      setSelectedRA(null);
      setAnalysts([]);
      setLoading(false);
      setError("");
    }
  }, [open]);

  const totalFiles = existingDocuments.length + files.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl mx-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4">
          <h2 className="text-lg sm:text-xl font-semibold font-['DM_Sans'] text-gray-900">Edit Feed</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all"
            disabled={loading}
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="flex border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 text-sm font-['DM_Sans'] transition-colors ${
              activeTab === "details" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-3 text-sm font-['DM_Sans'] transition-colors ${
              activeTab === "media" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Media ({totalFiles}/10)
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className={`p-4 sm:p-6 space-y-5 ${activeTab === "details" ? "block" : "hidden lg:block"}`}>
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-['DM_Sans']">{error}</p>
              </div>
            )}

            {/* RA Selection - Only for Admin */}
            {!isRA && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">
                  Select Research Analyst *
                </label>
                <div className="relative">
                  <select
                    value={selectedRA?.id || ""}
                    onChange={(e) => {
                      const ra = analysts.find(analyst => analyst.id === parseInt(e.target.value));
                      setSelectedRA(ra);
                    }}
                    disabled={loading || analystLoading}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose Analyst</option>
                    {analysts.map((ra) => (
                      <option key={ra.id} value={ra.id}>{ra.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
                {analystLoading && (
                  <p className="mt-1 text-xs text-gray-500 font-['DM_Sans'] animate-pulse">Loading analysts...</p>
                )}
              </div>
            )}

            {/* Current RA display for RA users */}
            {isRA && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-blue-700 font-['DM_Sans']">
                  RA: {user?.name || "You"}
                </p>
              </div>
            )}

            {/* Feed Text */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">
                Feed Content *
              </label>
              <textarea
                rows={6}
                value={feedText}
                onChange={(e) => setFeedText(e.target.value)}
                placeholder="Write your feed content..."
                className="w-full resize-vertical rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-['DM_Sans'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                {tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:bg-blue-200 rounded p-0.5 transition-colors"
                      disabled={loading}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder={tags.length === 0 ? "#NiftyAnalysis #MarketOutlook" : "Add more tags..."}
                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent font-['DM_Sans'] text-gray-900 placeholder:text-gray-400"
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 font-['DM_Sans']">
                Type tag name and press Enter to add. Maximum 10 tags.
              </p>
            </div>
          </div>

          {/* Media Tab Content */}
          <div className={`p-4 sm:p-6 ${activeTab === "media" ? "block" : "hidden lg:block"}`}>
            {/* Existing Documents */}
            {existingDocuments.length > 0 && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-gray-700">
                  Existing Files ({existingDocuments.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {existingDocuments.map((doc, index) => {
                    const isImage = doc.mimetype?.startsWith("image");
                    const src = doc.url || doc.filename;

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {isImage ? (
                            <img src={src} alt={doc.originalName || doc.filename} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 flex-shrink-0">
                              <FileIcon size={16} className="text-gray-500" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate font-['DM_Sans']">
                              {doc.originalName || doc.filename || 'Unknown file'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingDocument(index)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* New Files Preview */}
            {filePreviews.length > 0 && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-gray-700">
                  New Files ({filePreviews.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filePreviews.map((preview, index) => (
                    <div key={preview.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {preview.type === 'image' ? (
                          <img src={preview.previewUrl} alt={preview.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                        ) : preview.type === 'video' ? (
                          <video src={preview.previewUrl} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 flex-shrink-0">
                            {getFileIcon(preview.type)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate font-['DM_Sans']">{preview.name}</p>
                          <p className="text-xs text-gray-500">{preview.formattedSize}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewFile(index)}
                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Box */}
            {totalFiles < 10 && (
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-center transition-all hover:bg-gray-100"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Upload className="text-blue-600" size={18} />
                  </div>
                  <p className="text-sm font-medium text-blue-600 font-['DM_Sans']">
                    Click to upload Images or Videos
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG, GIF, MP4, MOV • Max 50MB per file
                  </p>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-500 text-center font-['DM_Sans']">
                  {10 - totalFiles} files remaining (max 10 total)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200 px-4 sm:px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium font-['DM_Sans'] hover:bg-gray-50 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) || (!isRA && !getRAId())}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium font-['DM_Sans'] hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              "Update Feed"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}