// AddFeedModal.jsx
import { X, Upload, Trash2, ImageIcon, VideoIcon, FileIcon, User, ChevronDown, Plus } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

export default function AddFeedModal({ open, onClose, onSuccess }) {
  if (!open) return null;

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const isRA = user?.role === "ra";
  
  const [feedText, setFeedText] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [analysts, setAnalysts] = useState([]);
  const [selectedRA, setSelectedRA] = useState(null);
  const [analystLoading, setAnalystLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const fileInputRef = useRef(null);
  const tagInputRef = useRef(null);

  const getRAId = () => {
    if (isRA) return user?.id;
    return selectedRA?.id || null;
  };

  const getRAName = () => {
    if (isRA) return user?.name;
    return selectedRA?.name || "";
  };

  const fetchAnalysts = useCallback(async () => {
    if (isRA) return;
    
    try {
      setAnalystLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data.success) {
        setAnalysts(res.data.data || []);
        if (res.data.data.length > 0 && !selectedRA) {
          setSelectedRA(res.data.data[0]);
        }
      } else {
        setError("Failed to fetch analysts");
      }
    } catch (err) {
      console.error("Error fetching analysts:", err);
      setError("Failed to load analysts");
    } finally {
      setAnalystLoading(false);
    }
  }, [apiUrl, isRA, selectedRA]);

  useEffect(() => {
    if (!isRA) fetchAnalysts();
  }, [fetchAnalysts]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl);
      });
    };
  }, [filePreviews]);

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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length + files.length > 10) {
      setError("Maximum 10 files allowed");
      return;
    }

    const oversizedFiles = selectedFiles.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed 50MB limit: ${oversizedFiles.map(f => f.name).join(", ")}`);
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
  };

  const removeFile = (index) => {
    if (filePreviews[index].previewUrl) URL.revokeObjectURL(filePreviews[index].previewUrl);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={16} className="text-blue-500" />;
      case 'video': return <VideoIcon size={16} className="text-red-500" />;
      default: return <FileIcon size={16} className="text-gray-500" />;
    }
  };

  const handleSubmit = async () => {
    if (!feedText.trim() && files.length === 0) {
      setError("Please add feed text or upload files");
      return;
    }

    if (!getRAId()) {
      setError("Please select a Research Analyst");
      return;
    }

    if (files.length > 10) {
      setError("Maximum 10 files allowed");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("ra_id", getRAId());
      formData.append("ra_name", getRAName());
      formData.append("feed_text", feedText.trim());
      if (tags.length > 0) formData.append("feed_tags", JSON.stringify(tags));
      files.forEach((file) => formData.append("documents", file));

      const response = await axios.post(`${apiUrl}/feeds/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      if (response.data.success) {
        setFeedText("");
        setTagInput("");
        setTags([]);
        setFiles([]);
        filePreviews.forEach(preview => {
          if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl);
        });
        setFilePreviews([]);
        if (onSuccess) onSuccess(response.data.data);
        onClose();
      } else {
        setError(response.data.message || "Failed to create feed");
      }
    } catch (error) {
      console.error("Feed create error:", error);
      setError(error.response?.data?.message || "Failed to create feed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl mx-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4">
          <h2 className="text-lg sm:text-xl font-semibold font-['DM_Sans'] text-gray-900">Create Feed</h2>
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
            Media ({files.length}/10)
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

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-['DM_Sans']">Uploading...</span>
                  <span className="font-medium text-gray-700">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* RA Selection */}
            {!isRA && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Select Research Analyst *</label>
                <div className="relative">
                  <select
                    value={selectedRA?.id || ""}
                    onChange={(e) => setSelectedRA(analysts.find(ra => ra.id === parseInt(e.target.value)))}
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
              </div>
            )}

            {/* Feed Text */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Feed Content *</label>
              <textarea
                rows={4}
                value={feedText}
                onChange={(e) => setFeedText(e.target.value)}
                placeholder="Share your thoughts, analysis, or updates..."
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-['DM_Sans'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                {tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg">
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeTag(index)} className="hover:bg-blue-200 rounded p-0.5 transition-colors" disabled={loading}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  ref={tagInputRef}
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
              <p className="mt-1 text-xs text-gray-500 font-['DM_Sans']">Press Enter to add tag. Maximum 10 tags.</p>
            </div>
          </div>

          {/* Media Tab Content */}
          <div className={`p-4 sm:p-6 ${activeTab === "media" ? "block" : "hidden lg:block"}`}>
            {/* File Previews */}
            {filePreviews.length > 0 && (
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold font-['DM_Sans'] text-gray-700">Selected Files ({filePreviews.length}/10)</h3>
                  {!loading && filePreviews.length > 0 && (
                    <button 
                      onClick={() => {
                        setFiles([]);
                        filePreviews.forEach(preview => { if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl); });
                        setFilePreviews([]);
                      }} 
                      className="text-xs text-red-600 hover:text-red-700 font-['DM_Sans']"
                    >
                      Remove All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filePreviews.map((preview, index) => (
                    <div key={preview.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          {preview.type === 'image' ? (
                            <img src={preview.previewUrl} alt={preview.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : preview.type === 'video' ? (
                            <video src={preview.previewUrl} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">{getFileIcon(preview.type)}</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate font-['DM_Sans']">{preview.name}</p>
                          <p className="text-xs text-gray-500">{preview.formattedSize}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(index)} className="p-1 text-red-500 hover:text-red-600 transition-colors" disabled={loading}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Box */}
            {files.length < 10 && (
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-center transition-all hover:bg-gray-100"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Upload className="text-blue-600" size={18} />
                  </div>
                  <p className="text-sm font-medium text-blue-600 font-['DM_Sans']">Click or drag to upload Images or Videos</p>
                  <p className="mt-1 text-xs text-gray-500">Supports JPG, PNG, GIF, MP4 • Max 50MB per file</p>
                </button>
                <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleFileChange} disabled={loading || files.length >= 10} />
                
                <p className="mt-3 text-xs text-gray-500 text-center font-['DM_Sans']">
                  {10 - files.length} files remaining (max 10 total)
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
            disabled={loading || (!feedText.trim() && files.length === 0) || !getRAId()} 
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium font-['DM_Sans'] hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              "Create Feed"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}