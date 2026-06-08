import { X, Upload, ChevronDown, ImageIcon, VideoIcon, FileIcon, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback,useRef } from "react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#c8b8a8]/50 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[32px] bg-white/15 backdrop-blur-xl border border-white/40 shadow-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/30 px-6 py-5">
          <h2 className="text-xl font-semibold font-['Sora'] text-[#2a2118]">Edit Feed</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/30 transition-all"
            disabled={loading}
          >
            <X size={18} className="text-[#2a2118]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30 backdrop-blur-sm">
              <p className="text-sm text-red-400 font-['DM_Sans']">{error}</p>
            </div>
          )}

          {/* RA Selection - Only for Admin */}
          {!isRA && (
            <div>
              <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">
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
                  className="w-full appearance-none rounded-full bg-white/10 border border-white/30 px-4 py-2.5 pr-10 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Choose Analyst</option>
                  {analysts.map((ra) => (
                    <option key={ra.id} value={ra.id}>{ra.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6b5f55]">
                  <ChevronDown size={16} />
                </div>
              </div>
              {analystLoading && (
                <p className="mt-1 text-xs text-[#6b5f55] font-['DM_Sans'] animate-pulse">Loading analysts...</p>
              )}
            </div>
          )}

          {/* Current RA display for RA users */}
          {isRA && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-sm">
              <p className="text-sm font-medium text-emerald-600 font-['DM_Sans']">
                RA: {user?.name || "You"}
              </p>
            </div>
          )}

          {/* Feed Text */}
          <div>
            <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">
              Feed Content *
            </label>
            <textarea
              rows={6}
              value={feedText}
              onChange={(e) => setFeedText(e.target.value)}
              placeholder="Write your feed content..."
              className="w-full resize-vertical rounded-xl bg-white/10 border border-white/30 px-4 py-3 text-sm font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/10 border border-white/30 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50">
              {tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-600 text-sm rounded-full">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:bg-blue-500/30 rounded p-0.5 transition-colors"
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
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-[#6b5f55] font-['DM_Sans']">
              Type tag name and press Enter to add. Maximum 10 tags.
            </p>
          </div>

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">
                Existing Files ({existingDocuments.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {existingDocuments.map((doc, index) => {
                  const isImage = doc.mimetype?.startsWith("image");
                  const src = doc.url || doc.filename;

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/10 border border-white/30 rounded-xl">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isImage ? (
                          <img src={src} alt={doc.originalName || doc.filename} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                            <FileIcon size={20} className="text-[#6b5f55]" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#2a2118] truncate font-['DM_Sans']">
                            {doc.originalName || doc.filename || 'Unknown file'}
                          </p>
                          <p className="text-xs text-[#6b5f55]">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingDocument(index)}
                        className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
            <div>
              <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">
                New Files ({filePreviews.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filePreviews.map((preview, index) => (
                  <div key={preview.id} className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {preview.type === 'image' ? (
                        <img src={preview.previewUrl} alt={preview.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                      ) : preview.type === 'video' ? (
                        <video src={preview.previewUrl} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                          {getFileIcon(preview.type)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#2a2118] truncate font-['DM_Sans']">{preview.name}</p>
                        <p className="text-xs text-[#6b5f55]">{preview.formattedSize}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(index)}
                      className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/40 bg-white/5 py-8 text-center transition-all hover:bg-white/10"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <Upload className="text-blue-500" size={22} />
              </div>
              <p className="text-sm font-medium text-blue-500 font-['DM_Sans']">
                Click to upload Images or Videos
              </p>
              <p className="mt-1 text-xs text-[#6b5f55]">
                JPG, PNG, GIF, MP4, MOV • Max 50MB per file
              </p>
              {(files.length > 0 || existingDocuments.length > 0) && (
                <p className="mt-2 text-xs text-[#6b5f55] font-medium">
                  {existingDocuments.length} existing, {files.length} new
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
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
        <div className="flex justify-end gap-3 border-t border-white/30 px-6 py-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-[#2a2118] font-medium font-['DM_Sans'] hover:bg-white/30 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) || (!isRA && !getRAId())}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium font-['DM_Sans'] hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
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