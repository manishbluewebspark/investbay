// components/modals/AddNewsModal.jsx
import { X, Upload, Trash2, ImageIcon, Calendar, Clock } from "lucide-react";
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
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);
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
        scheduledDate: editData.scheduledDate ? new Date(editData.scheduledDate) : null,
        shortDescription: editData.shortDescription || "",
        fullArticle: editData.fullArticle || ""
      });
      
      if (editData.tags) {
        setTags(editData.tags);
      }
      
      if (editData.images && editData.images.length > 0) {
        setImagePreviews(editData.images.map((img, index) => ({
          id: Date.now() + index,
          url: img,
          name: `Image ${index + 1}`,
          type: 'existing'
        })));
      }
    }
  }, [editData]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.previewUrl && preview.type !== 'existing') {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, [imagePreviews]);

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

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length + images.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed 10MB limit: ${oversizedFiles.map(f => f.name).join(", ")}`);
      return;
    }

    const newPreviews = selectedFiles.map(file => {
      const previewUrl = URL.createObjectURL(file);
      
      return {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        previewUrl,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        type: 'new'
      };
    });

    setImages(prev => [...prev, ...selectedFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    if (imagePreviews[index].previewUrl && imagePreviews[index].type !== 'existing') {
      URL.revokeObjectURL(imagePreviews[index].previewUrl);
    }

    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
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

      // Add new images
      images.forEach((image) => {
    formDataToSend.append("documents", image);
      });

      // If editing, add existing images URLs
      const existingImages = imagePreviews
        .filter(p => p.type === 'existing')
        .map(p => p.url);
      
      if (existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
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
        setImages([]);
        imagePreviews.forEach(preview => {
          if (preview.previewUrl && preview.type !== 'existing') {
            URL.revokeObjectURL(preview.previewUrl);
          }
        });
        setImagePreviews([]);
        
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const event = { target: { files: droppedFiles } };
    handleImageChange(event);
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

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Images ({imagePreviews.length}/10)
                </h3>
                {!loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setImages([]);
                      imagePreviews.forEach(preview => {
                        if (preview.previewUrl && preview.type !== 'existing') {
                          URL.revokeObjectURL(preview.previewUrl);
                        }
                      });
                      setImagePreviews([]);
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview.id}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square">
                      {preview.type === 'existing' ? (
                        <img 
                          src={preview.url} 
                          alt={preview.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={preview.previewUrl} 
                          alt={preview.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={loading}
                    >
                      <Trash2 size={14} />
                    </button>
                    
                    {preview.type === 'existing' && (
                      <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/50 text-white text-xs rounded">
                        Existing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload box */}
          {imagePreviews.length < 10 && (
            <div>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Upload className="text-blue-600" size={18} />
                </div>
                <p className="text-sm font-medium text-blue-600">
                  Click or drag to upload images
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supports JPG, PNG, GIF • Max 10MB per image
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {10 - imagePreviews.length} images remaining
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading || imagePreviews.length >= 10}
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