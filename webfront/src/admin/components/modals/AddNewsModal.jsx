import { X, Upload, Trash2, ImageIcon, Calendar, Clock, Film } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddNewsModal({ open, onClose, onSuccess, editData = null }) {
  if (!open) return null;

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "draft",
    scheduledDate: null,
    shortDescription: "",
    fullArticle: ""
  });
  
  // Media states - combined for images and videos
  const [media, setMedia] = useState([]); // New files to upload
  const [mediaPreviews, setMediaPreviews] = useState([]); // All media (existing + new previews)
  const [existingMedia, setExistingMedia] = useState([]); // Store existing media separately
  console.log(existingMedia,1000)
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  const [categories] = useState([
    "Market News",
    "Stock Analysis",
    "IPO Updates",
    "Economy",
    "Sector Update",
    "Company News",
    "Global Markets",
    "Technical Analysis",
    "Fundamental Analysis"
  ]);

  const [statuses] = useState([
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "scheduled", label: "Scheduled" },
    { value: "archived", label: "Archived" }
  ]);

  // Load edit data if available
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        category: editData.category || "",
        status: editData.status || "draft",
        scheduledDate: editData.scheduled_date ? new Date(editData.scheduled_date) : null,
        shortDescription: editData.short_description || "",
        fullArticle: editData.full_article || ""
      });
      
      if (editData.tags) {
        setTags(editData.tags);
      }
      
      // Handle existing media (images + videos) properly
      if (editData.media && editData.media.length > 0) {
        const existingMediaObjects = editData.media.map((item, index) => {
          // Determine if it's video or image
          const isVideo = item.type === 'video' || 
                         (item.url && item.url.match(/\.(mp4|webm|ogg|mov)$/i)) ||
                         (item.mimeType && item.mimeType.startsWith('video/'));
          
          return {
            id: `existing-${Date.now()}-${index}`,
            url: typeof item === 'string' ? item : item.url,
            name: item.originalName || `Media ${index + 1}`,
            type: 'existing',
            mediaType: isVideo ? 'video' : 'image',
            key: item.key || null,
            originalName: item.originalName || `Media ${index + 1}`,
            thumbnail: item.thumbnail || null
          };
        });
        
        setExistingMedia(existingMediaObjects);
        setMediaPreviews(existingMediaObjects);
      }
      
      // Handle old format (images array for backward compatibility)
      else if (editData.images && editData.images.length > 0) {
        const existingMediaObjects = editData.images.map((img, index) => ({
          id: `existing-${Date.now()}-${index}`,
          url: typeof img === 'string' ? img : img.url,
          name: img.originalName || `Image ${index + 1}`,
          type: 'existing',
          mediaType: 'image',
          key: img.key || null,
          originalName: img.originalName || `Image ${index + 1}`
        }));
        
        setExistingMedia(existingMediaObjects);
        setMediaPreviews(existingMediaObjects);
      }
    } else {
      // Reset form when adding new
      setFormData({
        title: "",
        category: "",
        status: "draft",
        scheduledDate: null,
        shortDescription: "",
        fullArticle: ""
      });
      setTags([]);
      setMedia([]);
      setExistingMedia([]);
      setMediaPreviews([]);
    }
  }, [editData]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      mediaPreviews.forEach(preview => {
        if (preview.previewUrl && preview.type === 'new') {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, [mediaPreviews]);

  // Tag handling functions
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    
    if (!trimmedTag) return;
    
    let formattedTag = trimmedTag;
    if (!formattedTag.startsWith('#')) {
      formattedTag = '#' + formattedTag;
    }
    
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

  const handleFileChange = (e, fileType = 'image') => {
    const selectedFiles = Array.from(e.target.files);
    const totalMedia = existingMedia.length + media.length + selectedFiles.length;
    
    if (totalMedia > 20) { // Increased limit for media (images + videos)
      setError(`Maximum 20 files allowed. You can add ${20 - (existingMedia.length + media.length)} more.`);
      return;
    }

    // Filter files based on type
    const validFiles = selectedFiles.filter(file => {
      if (fileType === 'video') {
        return file.type.startsWith('video/');
      } else {
        return file.type.startsWith('image/');
      }
    });

    if (validFiles.length !== selectedFiles.length) {
      setError(`Please select only ${fileType} files`);
      return;
    }

    // Check file size (50MB for videos, 10MB for images)
    const oversizedFiles = validFiles.filter(file => {
      const maxSize = fileType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      return file.size > maxSize;
    });
    
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed size limit: ${oversizedFiles.map(f => f.name).join(", ")} 
        (Max: ${fileType === 'video' ? '50MB' : '10MB'} per file)`);
      return;
    }

    const newPreviews = validFiles.map(file => {
      const previewUrl = URL.createObjectURL(file);
      
      return {
        id: `new-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        previewUrl,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        type: 'new',
        mediaType: fileType,
        mimeType: file.type
      };
    });

    setMedia(prev => [...prev, ...validFiles]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
    setError("");
    
    // Reset file input
    if (fileType === 'video' && videoInputRef.current) {
      videoInputRef.current.value = "";
    } else if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (index) => {
    const mediaToRemove = mediaPreviews[index];
    
    if (mediaToRemove.type === 'new') {
      // Remove from new media array
      setMedia(prev => prev.filter((_, i) => i !== index));
      if (mediaToRemove.previewUrl) {
        URL.revokeObjectURL(mediaToRemove.previewUrl);
      }
    } else {
      // Remove from existing media array
      setExistingMedia(prev => prev.filter((_, i) => i !== index));
    }

    // Remove from previews
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError("Please enter news title");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!formData.shortDescription.trim()) {
      setError("Please enter short description");
      return;
    }

    if (!formData.fullArticle.trim()) {
      setError("Please enter full article");
      return;
    }

    if (formData.status === "scheduled" && !formData.scheduledDate) {
      setError("Please select scheduled date for publishing");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUploadProgress(0);

      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("scheduledDate", formData.scheduledDate ? formData.scheduledDate.toISOString() : "");
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("fullArticle", formData.fullArticle);
      formDataToSend.append("authorId", user?.id || "");
      formDataToSend.append("authorName", user?.name || "");
      
      // Add tags
      if (tags.length > 0) {
        formDataToSend.append("tags", JSON.stringify(tags));
      }

      // Add new media (images and videos)
      media.forEach((file) => {
        // Append with different field names based on type
        if (file.type.startsWith('video/')) {
          formDataToSend.append("videos", file);
        } else {
          formDataToSend.append("images", file);
        }
      });

      // If editing, add existing media in the correct format
      if (editData && existingMedia.length > 0) {
        const existingMediaFormatted = existingMedia.map(item => ({
          url: item.url,
          key: item.key || null,
          originalName: item.originalName || item.name,
          mediaType: item.mediaType || 'image'
        }));
        
        console.log("Existing media:", existingMediaFormatted);
        formDataToSend.append("existingMedia", JSON.stringify(existingMediaFormatted));
      }

      // Log all form data entries for debugging
      console.log("FormData entries:");
      for (let pair of formDataToSend.entries()) {
        if (pair[0] === 'images' || pair[0] === 'videos') {
          console.log(pair[0], pair[1].name, pair[1].type);
        } else if (pair[0] === 'existingMedia') {
          console.log(pair[0], pair[1]);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const url = editData 
        ? `${apiUrl}/news/${editData.id}`
        : `${apiUrl}/news/create`;

      const method = editData ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formDataToSend,
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
      });

      if (response.data.success) {
        alert(editData ? "News updated successfully!" : "News created successfully!");
        
        // Reset form
        setFormData({
          title: "",
          category: "",
          status: "draft",
          scheduledDate: null,
          shortDescription: "",
          fullArticle: ""
        });
        setTags([]);
        setMedia([]);
        setExistingMedia([]);
        mediaPreviews.forEach(preview => {
          if (preview.previewUrl && preview.type === 'new') {
            URL.revokeObjectURL(preview.previewUrl);
          }
        });
        setMediaPreviews([]);
        
        if (onSuccess) {
          onSuccess(response.data.news);
        }
        onClose();
      } else {
        setError(response.data.message || `Failed to ${editData ? 'update' : 'create'} news`);
      }
    } catch (error) {
      console.error("News create error:", error);
      let errorMessage = `Failed to ${editData ? 'update' : 'create'} news`;
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

  const handleDrop = (e, fileType = 'image') => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const event = { target: { files: droppedFiles } };
    handleFileChange(event, fileType);
  };

  const totalMedia = existingMedia.length + media.length;

  // Media Preview Component
  const MediaPreview = ({ media }) => {
    if (media.mediaType === 'video') {
      return (
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <video 
            src={media.type === 'new' ? media.previewUrl : media.url}
            className="w-full h-full object-cover"
            controls={false}
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Film className="text-white" size={24} />
          </div>
        </div>
      );
    } else {
      return (
        <img 
          src={media.type === 'new' ? media.previewUrl : media.url}
          alt={media.name}
          className="w-full h-full object-cover"
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {editData ? 'Edit News' : 'Add News'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* News Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              News Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter news title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled Date - Show only when status is scheduled */}
          {formData.status === 'scheduled' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Schedule Publish Date *
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.scheduledDate}
                  onChange={(date) => setFormData({...formData, scheduledDate: date})}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select date and time"
                  minDate={new Date()}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
          )}

          {/* Short Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Short Description *
            </label>
            <textarea
              rows={3}
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              placeholder="Brief summary of the news (will appear in preview)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum 200 characters recommended
            </p>
          </div>

          {/* Full Article */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Article *
            </label>
            <textarea
              rows={8}
              value={formData.fullArticle}
              onChange={(e) => setFormData({...formData, fullArticle: e.target.value})}
              placeholder="Write the complete news article here..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tags
            </label>
            
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
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
              
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "Add tags (press Enter)" : "Add more tags..."}
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                disabled={loading}
              />
            </div>
            
            <p className="mt-1 text-xs text-gray-500">
              Press Enter to add tag. Maximum 10 tags. # will be added automatically.
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

          {/* Media Previews (Images + Videos) */}
          {mediaPreviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Media ({totalMedia}/20)
                </h3>
                {!loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setMedia([]);
                      setExistingMedia([]);
                      mediaPreviews.forEach(preview => {
                        if (preview.previewUrl && preview.type === 'new') {
                          URL.revokeObjectURL(preview.previewUrl);
                        }
                      });
                      setMediaPreviews([]);
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mediaPreviews.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square">
                      {item.mediaType === 'video' ? (
                        <div className="relative w-full h-full bg-black">
                          <video 
                            src={item.type === 'new' ? item.previewUrl : item.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Film className="text-white opacity-70" size={30} />
                          </div>
                          <span className="absolute top-1 left-1 px-1 py-0.5 bg-blue-500 text-white text-xs rounded">
                            Video
                          </span>
                        </div>
                      ) : (
                        <img 
                          src={item.type === 'new' ? item.previewUrl : item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={loading}
                    >
                      <Trash2 size={14} />
                    </button>
                    
                    {item.type === 'existing' && (
                      <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/50 text-white text-xs rounded">
                        Existing
                      </span>
                    )}
                    
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/50 text-white text-xs rounded">
                      {formatFileSize(item.size)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload boxes */}
          {totalMedia < 20 && (
            <div className="space-y-3">
              {/* Image Upload Box */}
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'image')}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-4 text-center transition-all hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <ImageIcon className="text-blue-600" size={18} />
                  </div>
                  <p className="text-sm font-medium text-blue-600">
                    Click or drag to upload images
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG, GIF • Max 10MB per image
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  disabled={loading || totalMedia >= 20}
                />
              </div>

              {/* Video Upload Box */}
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'video')}
                  onClick={() => videoInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-4 text-center transition-all hover:border-purple-400 hover:bg-purple-50"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                    <Film className="text-purple-600" size={18} />
                  </div>
                  <p className="text-sm font-medium text-purple-600">
                    Click or drag to upload videos
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    MP4, WebM, MOV • Max 50MB per video
                  </p>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  disabled={loading || totalMedia >= 20}
                />
              </div>

              <p className="text-xs text-gray-500 text-center">
                {20 - totalMedia} files remaining (max 20 total)
              </p>
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
            disabled={loading || !formData.title || !formData.category || !formData.shortDescription || !formData.fullArticle}
            className="rounded-lg bg-black px-8 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
                <span>{editData ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              editData ? 'Update News' : 'Create News'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}