


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
  const [tags, setTags] = useState([]); // Changed to array
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

  // RA ID logic - Dynamic based on user role
  const getRAId = () => {
    if (isRA) {
      return user?.id;
    }
    return selectedRA?.id || null;
  };

  const getRAName = () => {
    if (isRA) {
      return user?.name;
    }
    return selectedRA?.name || "";
  };

  // Fetch all analysts for admin
  const fetchAnalysts = useCallback(async () => {
    if (isRA) return; // RA users don't need dropdown
    
    try {
      setAnalystLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data.success) {
        setAnalysts(res.data.data || []);
        // Auto-select first analyst if available
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
    if (!isRA) {
      fetchAnalysts();
    }
  }, [fetchAnalysts]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        if (preview.previewUrl) {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, [filePreviews]);

  // Tag handling functions
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    
    if (!trimmedTag) return;
    
    // Add # if not present
    let formattedTag = trimmedTag;
    if (!formattedTag.startsWith('#')) {
      formattedTag = '#' + formattedTag;
    }
    
    // Remove spaces from tag
    formattedTag = formattedTag.replace(/\s+/g, '');
    
    // Check if tag already exists
    if (tags.includes(formattedTag)) {
      setError(`Tag "${formattedTag}" already exists`);
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    // Check maximum tags (optional - limit to 10)
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
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags.length - 1);
    }
  };

  const handleTagInputBlur = () => {
    if (tagInput.trim()) {
      addTag();
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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    if (filePreviews[index].previewUrl) {
      URL.revokeObjectURL(filePreviews[index].previewUrl);
    }

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
      case 'image':
        return <ImageIcon size={16} className="text-blue-500" />;
      case 'video':
        return <VideoIcon size={16} className="text-red-500" />;
      default:
        return <FileIcon size={16} className="text-gray-500" />;
    }
  };

  const handleSubmit = async () => {
    // Validation
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

      // Dynamic RA fields
      formData.append("ra_id", getRAId());
      formData.append("ra_name", getRAName());
      formData.append("feed_text", feedText.trim());

      // Tags - Send as JSON string to maintain array format
      if (tags.length > 0) {
        formData.append("feed_tags", JSON.stringify(tags));
      }

      // Files
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await axios.post(
        `${apiUrl}/feeds/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      if (response.data.success) {
        alert("Feed created successfully!");
        
        // Reset form
        setFeedText("");
        setTagInput("");
        setTags([]);
        setFiles([]);
        filePreviews.forEach(preview => {
          if (preview.previewUrl) {
            URL.revokeObjectURL(preview.previewUrl);
          }
        });
        setFilePreviews([]);
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || "Failed to create feed");
      }
    } catch (error) {
      console.error("Feed create error:", error);
      let errorMessage = "Failed to create feed";
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const event = { target: { files: droppedFiles } };
    handleFileChange(event);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Feed</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* RA Selection - Only for Admin */}
          {!isRA && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Research Analyst *
              </label>
              <div className="relative">
                <select
                  value={selectedRA?.id || ""}
                  onChange={(e) => {
                    const ra = analysts.find(analyst => analyst.id === e.target.value);
                    setSelectedRA(ra);
                  }}
                  disabled={loading || analystLoading}
                  className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Choose Analyst</option>
                  {analysts.map((ra) => (
                    <option key={ra.id} value={ra.id}>
                      {ra.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>
              {analystLoading && (
                <p className="mt-1 text-xs text-gray-500">Loading analysts...</p>
              )}
              {!analysts.length && !analystLoading && (
                <p className="mt-1 text-xs text-gray-500">No analysts available</p>
              )}
            </div>
          )}

          {/* About Feed */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              About Feed *
            </label>
            <textarea
              rows={4}
              value={feedText}
              onChange={(e) => setFeedText(e.target.value)}
              placeholder="Share your thoughts, analysis, or updates..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              {files.length === 0 ? "Text or file upload is required" : "Add text to provide context"}
            </p>
          </div>

          {/* Tags - Enhanced with chips */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tags
            </label>
            
            {/* Tag Input with Chips */}
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              {/* Existing Tags */}
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:bg-blue-100 rounded p-0.5 transition-colors"
                    disabled={loading}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              {/* Tag Input Field */}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={handleTagInputBlur}
                placeholder={tags.length === 0 ? "#NiftyAnalysis #MarketOutlook" : "Add more tags..."}
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                disabled={loading}
              />
            </div>
            
            <p className="mt-1 text-xs text-gray-500">
              Type tag name and press Enter to add. Maximum 10 tags. # will be added automatically.
            </p>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* File Previews */}
          {filePreviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Selected Files ({filePreviews.length}/10)
                </h3>
                {!loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setFiles([]);
                      filePreviews.forEach(preview => {
                        if (preview.previewUrl) {
                          URL.revokeObjectURL(preview.previewUrl);
                        }
                      });
                      setFilePreviews([]);
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filePreviews.map((preview, index) => (
                  <div
                    key={preview.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="flex-shrink-0">
                        {preview.type === 'image' ? (
                          <div className="w-12 h-12 rounded overflow-hidden">
                            <img 
                              src={preview.previewUrl} 
                              alt={preview.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : preview.type === 'video' ? (
                          <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                            <video 
                              src={preview.previewUrl}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center">
                            {getFileIcon(preview.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {preview.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 capitalize">
                            {preview.type}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {preview.formattedSize}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload box */}
          {files.length < 10 && (
            <div>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-10 text-center transition-all hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Upload className="text-blue-600" size={22} />
                </div>
                <p className="text-sm font-medium text-blue-600">
                  Click or drag to upload Images or Videos
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Supports JPG, PNG, GIF, MP4, AVI, MOV • Max 50MB per file
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {10 - files.length} files remaining
                </p>
              </div>

              <input
                ref={fileInputRef}
                id="feedUpload"
                type="file"
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={loading || files.length >= 10}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!feedText.trim() && files.length === 0) || !getRAId()}
            className="rounded-lg bg-black px-8 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
                <span>Uploading...</span>
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