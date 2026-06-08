import { X, Upload, Trash2, ImageIcon, VideoIcon, FileIcon, User, ChevronDown } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#c8b8a8]/50 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[32px] bg-white/15 backdrop-blur-xl border border-white/40 shadow-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/30 px-6 py-5">
          <h2 className="text-xl font-semibold font-['Sora'] text-[#2a2118]">Create Feed</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/30 transition-all" disabled={loading}>
            <X size={18} className="text-[#2a2118]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30 backdrop-blur-sm">
              <p className="text-sm text-red-400 font-['DM_Sans']">{error}</p>
            </div>
          )}

          {/* RA Selection */}
          {!isRA && (
            <div>
              <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Select Research Analyst *</label>
              <div className="relative">
                <select
                  value={selectedRA?.id || ""}
                  onChange={(e) => setSelectedRA(analysts.find(ra => ra.id === parseInt(e.target.value)))}
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
            </div>
          )}

          {/* Feed Text */}
          <div>
            <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Feed Content *</label>
            <textarea
              rows={4}
              value={feedText}
              onChange={(e) => setFeedText(e.target.value)}
              placeholder="Share your thoughts, analysis, or updates..."
              className="w-full resize-none rounded-xl bg-white/10 border border-white/30 px-4 py-3 text-sm font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Tags</label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/10 border border-white/30 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50">
              {tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-600 text-sm rounded-full">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(index)} className="hover:bg-blue-500/30 rounded p-0.5 transition-colors" disabled={loading}>
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
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50"
                disabled={loading}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#2a2118] font-['DM_Sans']">Uploading...</span>
                <span className="font-medium text-[#2a2118]">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* File Previews */}
          {filePreviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Selected Files ({filePreviews.length}/10)</h3>
                {!loading && (
                  <button onClick={() => {
                    setFiles([]);
                    filePreviews.forEach(preview => { if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl); });
                    setFilePreviews([]);
                  }} className="text-xs text-red-400 hover:text-red-500 font-['DM_Sans']">
                    Remove All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filePreviews.map((preview, index) => (
                  <div key={preview.id} className="flex items-center justify-between p-3 bg-white/10 border border-white/30 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0">
                        {preview.type === 'image' ? (
                          <img src={preview.previewUrl} alt={preview.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : preview.type === 'video' ? (
                          <video src={preview.previewUrl} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">{getFileIcon(preview.type)}</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#2a2118] truncate font-['DM_Sans']">{preview.name}</p>
                        <p className="text-xs text-[#6b5f55]">{preview.formattedSize}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(index)} className="p-1 text-red-400 hover:text-red-500 transition-colors" disabled={loading}>
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
              <div onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/40 bg-white/5 py-10 text-center transition-all hover:bg-white/10">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <Upload className="text-blue-500" size={22} />
                </div>
                <p className="text-sm font-medium text-blue-500 font-['DM_Sans']">Click or drag to upload Images or Videos</p>
                <p className="mt-1 text-xs text-[#6b5f55]">Supports JPG, PNG, GIF, MP4 • Max 50MB per file</p>
              </div>
              <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleFileChange} disabled={loading || files.length >= 10} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/30 px-6 py-5">
          <button onClick={onClose} disabled={loading} className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-[#2a2118] font-medium font-['DM_Sans'] hover:bg-white/30 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || (!feedText.trim() && files.length === 0) || !getRAId()} className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium font-['DM_Sans'] hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50">
            {loading ? "Creating..." : "Create Feed"}
          </button>
        </div>
      </div>
    </div>
  );
}