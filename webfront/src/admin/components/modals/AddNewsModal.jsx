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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#c8b8a8]/50 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-[32px] bg-white/15 backdrop-blur-xl border border-white/40 shadow-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-white/30 px-6 py-5">
          <h2 className="text-xl font-semibold font-['Sora'] text-[#2a2118]">{editData ? 'Edit News' : 'Add News'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/30 transition-all" disabled={loading}><X size={18} className="text-[#2a2118]" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30"><p className="text-sm text-red-400 font-['DM_Sans']">{error}</p></div>}

          <div><label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">News Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter news title" className="w-full rounded-xl bg-white/10 border border-white/30 px-4 py-2.5 text-sm font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" disabled={loading} /></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Category *</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-xl bg-white/10 border border-white/30 px-4 py-2.5 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50"><option value="">Select Category</option>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
            <div><label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Status *</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl bg-white/10 border border-white/30 px-4 py-2.5 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50">{statuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}</select></div>
          </div>

          {formData.status === 'scheduled' && (<div><label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Schedule Publish Date *</label><div className="relative"><DatePicker selected={formData.scheduledDate} onChange={(date) => setFormData({ ...formData, scheduledDate: date })} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMMM d, yyyy h:mm aa" placeholderText="Select date and time" minDate={new Date()} className="w-full rounded-xl bg-white/10 border border-white/30 px-4 py-2.5 text-sm font-['DM_Sans'] text-[#2a2118] focus:outline-none focus:ring-2 focus:ring-blue-500/50" disabled={loading} /><Calendar className="absolute right-3 top-2.5 text-[#6b5f55]" size={18} /></div></div>)}

          <div><label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Short Description *</label><textarea rows={3} value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Brief summary of the news" className="w-full rounded-xl bg-white/10 border border-white/30 px-4 py-2.5 text-sm font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" disabled={loading} /></div>
          <div><label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Full Article *</label><textarea rows={8} value={formData.fullArticle} onChange={(e) => setFormData({ ...formData, fullArticle: e.target.value })} placeholder="Write the complete news article here..." className="w-full rounded-xl bg-white/10 border border-white/30 px-4 py-2.5 text-sm font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" disabled={loading} /></div>

          <div><label className="mb-2 block text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Tags</label><div className="flex flex-wrap gap-2 p-3 bg-white/10 border border-white/30 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50">{tags.map((tag, index) => (<span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-600 text-sm rounded-full"><span>{tag}</span><button type="button" onClick={() => removeTag(index)} className="hover:bg-blue-500/30 rounded p-0.5 transition-colors" disabled={loading}><X size={12} /></button></span>))}<input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={tags.length === 0 ? "Add tags (press Enter)" : "Add more tags..."} className="flex-1 min-w-[120px] outline-none text-sm bg-transparent font-['DM_Sans'] text-[#2a2118] placeholder:text-[#6b5f55]/50" disabled={loading} /></div><p className="mt-1 text-xs text-[#6b5f55] font-['DM_Sans']">Press Enter to add tag. Maximum 10 tags.</p></div>

          {uploadProgress > 0 && uploadProgress < 100 && (<div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-[#2a2118]">Uploading...</span><span className="font-medium text-[#2a2118]">{uploadProgress}%</span></div><div className="h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} /></div></div>)}

          {mediaPreviews.length > 0 && (<div className="space-y-3"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold font-['DM_Sans'] text-[#2a2118]">Media ({totalMedia}/20)</h3>{!loading && (<button onClick={() => { setMedia([]); setExistingMedia([]); mediaPreviews.forEach(preview => { if (preview.previewUrl && preview.type === 'new') URL.revokeObjectURL(preview.previewUrl); }); setMediaPreviews([]); }} className="text-xs text-red-400 hover:text-red-500 font-['DM_Sans']">Remove All</button>)}</div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{mediaPreviews.map((item, index) => (<div key={item.id} className="relative group border border-white/30 rounded-xl overflow-hidden"><div className="aspect-square">{item.mediaType === 'video' ? (<div className="relative w-full h-full bg-black flex items-center justify-center"><video src={item.type === 'new' ? item.previewUrl : item.url} className="w-full h-full object-cover" muted /><Film className="absolute text-white opacity-70" size={30} /></div>) : (<img src={item.type === 'new' ? item.previewUrl : item.url} alt={item.name} className="w-full h-full object-cover" />)}</div><button onClick={() => removeMedia(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" disabled={loading}><Trash2 size={12} /></button>{item.type === 'existing' && <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/50 text-white text-xs rounded-full">Existing</span>}<span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/50 text-white text-xs rounded-full">{formatFileSize(item.size)}</span></div>))}</div></div>)}

          {totalMedia < 20 && (<div className="space-y-3">
            <div onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/40 bg-white/5 py-4 text-center transition-all hover:bg-white/10"><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20"><ImageIcon className="text-blue-500" size={18} /></div><p className="text-sm font-medium text-blue-500 font-['DM_Sans']">Click to upload images</p><p className="mt-1 text-xs text-[#6b5f55]">JPG, PNG, GIF • Max 10MB</p></div><input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'image')} disabled={loading || totalMedia >= 20} />
            <div onClick={() => videoInputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/40 bg-white/5 py-4 text-center transition-all hover:bg-white/10"><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20"><Film className="text-purple-500" size={18} /></div><p className="text-sm font-medium text-purple-500 font-['DM_Sans']">Click to upload videos</p><p className="mt-1 text-xs text-[#6b5f55]">MP4, WebM, MOV • Max 50MB</p></div><input ref={videoInputRef} type="file" className="hidden" multiple accept="video/*" onChange={(e) => handleFileChange(e, 'video')} disabled={loading || totalMedia >= 20} />
            <p className="text-xs text-[#6b5f55] text-center font-['DM_Sans']">{20 - totalMedia} files remaining (max 20 total)</p>
          </div>)}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/30 px-6 py-5">
          <button onClick={onClose} disabled={loading} className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-[#2a2118] font-medium font-['DM_Sans'] hover:bg-white/30 transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !formData.title || !formData.category || !formData.shortDescription || !formData.fullArticle} className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium font-['DM_Sans'] hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 flex items-center gap-2">{loading ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span><span>{editData ? 'Updating...' : 'Creating...'}</span></>) : (editData ? 'Update News' : 'Create News')}</button>
        </div>
      </div>
    </div>
  );
}