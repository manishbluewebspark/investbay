// AddNewsModal.jsx
import { X, Upload, Trash2, ImageIcon, Calendar, Clock, Film, Plus } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddNewsModal({ open, onClose, onSuccess, editData = null }) {
  if (!open) return null;

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "", category: "", status: "draft", scheduledDate: null,
    shortDescription: "", fullArticle: ""
  });

  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const categories = ["Market News", "Stock Analysis", "IPO Updates", "Economy", "Sector Update", "Company News", "Global Markets", "Technical Analysis", "Fundamental Analysis"];
  const statuses = [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "scheduled", label: "Scheduled" }, { value: "archived", label: "Archived" }];

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "", category: editData.category || "", status: editData.status || "draft",
        scheduledDate: editData.scheduled_date ? new Date(editData.scheduled_date) : null,
        shortDescription: editData.short_description || "", fullArticle: editData.full_article || ""
      });
      if (editData.tags) setTags(editData.tags);
      if (editData.media && editData.media.length > 0) {
        const existingMediaObjects = editData.media.map((item, index) => ({
          id: `existing-${Date.now()}-${index}`, url: item.url, name: item.originalName || `Media ${index + 1}`,
          type: 'existing', mediaType: item.type === 'video' || (item.url && item.url.match(/\.(mp4|webm|ogg|mov)$/i)) ? 'video' : 'image',
          key: item.key || null, originalName: item.originalName || `Media ${index + 1}`, size: item.size || 0
        }));
        setExistingMedia(existingMediaObjects);
        setMediaPreviews(existingMediaObjects);
      }
    } else {
      setFormData({ title: "", category: "", status: "draft", scheduledDate: null, shortDescription: "", fullArticle: "" });
      setTags([]); setMedia([]); setExistingMedia([]); setMediaPreviews([]);
    }
  }, [editData]);

  useEffect(() => {
    return () => { mediaPreviews.forEach(preview => { if (preview.previewUrl && preview.type === 'new') URL.revokeObjectURL(preview.previewUrl); }); };
  }, [mediaPreviews]);

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    let formattedTag = trimmedTag.startsWith('#') ? trimmedTag : '#' + trimmedTag;
    formattedTag = formattedTag.replace(/\s+/g, '');
    if (tags.includes(formattedTag)) { setError(`Tag "${formattedTag}" already exists`); setTimeout(() => setError(""), 3000); return; }
    if (tags.length >= 10) { setError("Maximum 10 tags allowed"); setTimeout(() => setError(""), 3000); return; }
    setTags([...tags, formattedTag]); setTagInput(""); setError("");
  };

  const removeTag = (indexToRemove) => setTags(tags.filter((_, index) => index !== indexToRemove));
  const handleTagKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) removeTag(tags.length - 1); };

  const handleFileChange = (e, fileType = 'image') => {
    const selectedFiles = Array.from(e.target.files);
    const totalMedia = existingMedia.length + media.length + selectedFiles.length;
    if (totalMedia > 20) { setError(`Maximum 20 files allowed. You can add ${20 - (existingMedia.length + media.length)} more.`); return; }
    const validFiles = selectedFiles.filter(file => fileType === 'video' ? file.type.startsWith('video/') : file.type.startsWith('image/'));
    if (validFiles.length !== selectedFiles.length) { setError(`Please select only ${fileType} files`); return; }
    const maxSize = fileType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const oversizedFiles = validFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) { setError(`Some files exceed size limit (Max: ${fileType === 'video' ? '50MB' : '10MB'})`); return; }
    const newPreviews = validFiles.map(file => ({ id: `new-${Date.now()}-${Math.random()}`, file, name: file.name, previewUrl: URL.createObjectURL(file), size: file.size, formattedSize: formatFileSize(file.size), type: 'new', mediaType: fileType, mimeType: file.type }));
    setMedia(prev => [...prev, ...validFiles]); setMediaPreviews(prev => [...prev, ...newPreviews]); setError("");
    if (fileType === 'video' && videoInputRef.current) videoInputRef.current.value = "";
    else if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index) => {
    const mediaToRemove = mediaPreviews[index];
    if (mediaToRemove.type === 'new') { setMedia(prev => prev.filter((_, i) => i !== index)); if (mediaToRemove.previewUrl) URL.revokeObjectURL(mediaToRemove.previewUrl); }
    else setExistingMedia(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { setError("Please enter news title"); return; }
    if (!formData.category) { setError("Please select a category"); return; }
    if (!formData.shortDescription.trim()) { setError("Please enter short description"); return; }
    if (!formData.fullArticle.trim()) { setError("Please enter full article"); return; }
    if (formData.status === "scheduled" && !formData.scheduledDate) { setError("Please select scheduled date for publishing"); return; }

    try {
      setLoading(true); setError(""); setUploadProgress(0);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title); formDataToSend.append("category", formData.category);
      formDataToSend.append("status", formData.status); formDataToSend.append("scheduledDate", formData.scheduledDate ? formData.scheduledDate.toISOString() : "");
      formDataToSend.append("shortDescription", formData.shortDescription); formDataToSend.append("fullArticle", formData.fullArticle);
      formDataToSend.append("authorId", user?.id || ""); formDataToSend.append("authorName", user?.name || "");
      if (tags.length > 0) formDataToSend.append("tags", JSON.stringify(tags));
      media.forEach((file) => { if (file.type.startsWith('video/')) formDataToSend.append("videos", file); else formDataToSend.append("images", file); });
      if (editData && existingMedia.length > 0) { formDataToSend.append("existingMedia", JSON.stringify(existingMedia.map(item => ({ url: item.url, key: item.key || null, originalName: item.originalName || item.name, mediaType: item.mediaType || 'image' })))); }

      const response = await axios({ method: editData ? 'put' : 'post', url: editData ? `${apiUrl}/news/${editData.id}` : `${apiUrl}/news/create`, data: formDataToSend, headers: { "Content-Type": "multipart/form-data" }, onUploadProgress: (progressEvent) => { if (progressEvent.total) setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total)); } });
      if (response.data.success) {
        setFormData({ title: "", category: "", status: "draft", scheduledDate: null, shortDescription: "", fullArticle: "" });
        setTags([]); setMedia([]); setExistingMedia([]);
        mediaPreviews.forEach(preview => { if (preview.previewUrl && preview.type === 'new') URL.revokeObjectURL(preview.previewUrl); });
        setMediaPreviews([]);
        if (onSuccess) onSuccess(response.data.news);
        onClose();
      } else setError(response.data.message || `Failed to ${editData ? 'update' : 'create'} news`);
    } catch (error) { setError(`Failed to ${editData ? 'update' : 'create'} news: ${error.response?.data?.message || error.message}`); }
    finally { setLoading(false); setUploadProgress(0); }
  };

  const totalMedia = existingMedia.length + media.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl mx-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4">
          <h2 className="text-lg sm:text-xl font-semibold font-['DM_Sans'] text-gray-900">
            {editData ? 'Edit News' : 'Add News'}
          </h2>
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
            Media ({totalMedia}/20)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-['DM_Sans']">{error}</p>
            </div>
          )}

          {/* Details Tab Content */}
          <div className={`p-4 sm:p-6 space-y-4 ${activeTab === "details" ? "block" : "hidden lg:block"}`}>
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">News Title *</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="Enter news title" 
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-['DM_Sans'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                disabled={loading} 
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Category *</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Status *</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
                </select>
              </div>
            </div>

            {/* Scheduled Date */}
            {formData.status === 'scheduled' && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Schedule Publish Date *</label>
                <div className="relative">
                  <DatePicker 
                    selected={formData.scheduledDate} 
                    onChange={(date) => setFormData({ ...formData, scheduledDate: date })} 
                    showTimeSelect 
                    timeFormat="HH:mm" 
                    timeIntervals={15} 
                    dateFormat="MMMM d, yyyy h:mm aa" 
                    placeholderText="Select date and time" 
                    minDate={new Date()} 
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-['DM_Sans'] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    disabled={loading} 
                  />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            )}

            {/* Short Description */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Short Description *</label>
              <textarea 
                rows={3} 
                value={formData.shortDescription} 
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} 
                placeholder="Brief summary of the news" 
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-['DM_Sans'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                disabled={loading} 
              />
            </div>

            {/* Full Article */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold font-['DM_Sans'] text-gray-700">Full Article *</label>
              <textarea 
                rows={8} 
                value={formData.fullArticle} 
                onChange={(e) => setFormData({ ...formData, fullArticle: e.target.value })} 
                placeholder="Write the complete news article here..." 
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-['DM_Sans'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
                  type="text" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={handleTagKeyDown} 
                  placeholder={tags.length === 0 ? "Add tags (press Enter)" : "Add more tags..."} 
                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent font-['DM_Sans'] text-gray-900 placeholder:text-gray-400" 
                  disabled={loading} 
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 font-['DM_Sans']">Press Enter to add tag. Maximum 10 tags.</p>
            </div>
          </div>

          {/* Media Tab Content */}
          <div className={`p-4 sm:p-6 ${activeTab === "media" ? "block" : "hidden lg:block"}`}>
            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Uploading...</span>
                  <span className="font-medium text-gray-700">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Media Grid */}
            {mediaPreviews.length > 0 && (
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold font-['DM_Sans'] text-gray-700">Media ({totalMedia}/20)</h3>
                  {!loading && totalMedia > 0 && (
                    <button 
                      onClick={() => { 
                        setMedia([]); 
                        setExistingMedia([]); 
                        mediaPreviews.forEach(preview => { 
                          if (preview.previewUrl && preview.type === 'new') URL.revokeObjectURL(preview.previewUrl); 
                        }); 
                        setMediaPreviews([]); 
                      }} 
                      className="text-xs text-red-600 hover:text-red-700 font-['DM_Sans']"
                    >
                      Remove All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaPreviews.map((item, index) => (
                    <div key={item.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100">
                        {item.mediaType === 'video' ? (
                          <div className="relative w-full h-full bg-black flex items-center justify-center">
                            <video src={item.type === 'new' ? item.previewUrl : item.url} className="w-full h-full object-cover" muted />
                            <Film className="absolute text-white/70" size={24} />
                          </div>
                        ) : (
                          <img src={item.type === 'new' ? item.previewUrl : item.url} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <button 
                        onClick={() => removeMedia(index)} 
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={loading}
                      >
                        <Trash2 size={10} />
                      </button>
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/60 text-white text-[10px] rounded">
                        {formatFileSize(item.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Buttons */}
            {totalMedia < 20 && (
              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-6 text-center transition-all hover:bg-gray-100"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <ImageIcon className="text-blue-600" size={18} />
                  </div>
                  <p className="text-sm font-medium text-blue-600 font-['DM_Sans']">Upload Images</p>
                  <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF • Max 10MB each</p>
                </button>
                <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'image')} disabled={loading || totalMedia >= 20} />

                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-6 text-center transition-all hover:bg-gray-100"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Film className="text-purple-600" size={18} />
                  </div>
                  <p className="text-sm font-medium text-purple-600 font-['DM_Sans']">Upload Videos</p>
                  <p className="mt-1 text-xs text-gray-500">MP4, WebM, MOV • Max 50MB each</p>
                </button>
                <input ref={videoInputRef} type="file" className="hidden" multiple accept="video/*" onChange={(e) => handleFileChange(e, 'video')} disabled={loading || totalMedia >= 20} />

                <p className="text-xs text-gray-500 text-center font-['DM_Sans']">
                  {20 - totalMedia} files remaining (max 20 total)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
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
            disabled={loading || !formData.title || !formData.category || !formData.shortDescription || !formData.fullArticle} 
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium font-['DM_Sans'] hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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