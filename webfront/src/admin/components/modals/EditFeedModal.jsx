// import { X, Upload } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";

// export default function EditFeedModal({ open, onClose, feed, onUpdateSuccess }) {
//   // ✅ Proper null check
//   if (!open || !feed) return null;

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const user = JSON.parse(localStorage.getItem("user"));
//   const ra_id = user?.id;

//   // ✅ useCallback for stable functions
//   const [feedText, setFeedText] = useState("");
//   const [tags, setTags] = useState("");
//   const [files, setFiles] = useState([]);
//   const [existingDocuments, setExistingDocuments] = useState([]);
//   const [documentsToDelete, setDocumentsToDelete] = useState([]);
//   const [loading, setLoading] = useState(false);

//   console.log(feed,'10000')

//   // ✅ Proper initialization with useEffect
//   useEffect(() => {
//     if (open && feed) {
//       setFeedText(feed.feed_text || "");
//       setTags(feed.feed_tags?.join(" ") || "");
//       setExistingDocuments(feed.feed_documents || []);
//       setDocumentsToDelete([]);
//       setFiles([]);
//     }
//   }, [open, feed]);

//   const handleFileChange = useCallback((e) => {
//     setFiles(Array.from(e.target.files));
//   }, []);

//   const handleRemoveExistingDocument = useCallback((docId) => {
//     setDocumentsToDelete(prev => [...prev, docId]);
//     setExistingDocuments(prev => prev.filter(doc => doc.id !== docId));
//   }, []);

//   const handleRemoveNewFile = useCallback((index) => {
//     const newFiles = [...files];
//     newFiles.splice(index, 1);
//     setFiles(newFiles);
//   }, [files]);

//   const handleSubmit = async () => {
//     if (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) {
//       alert("Feed text or file is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("ra_id", ra_id);
//       formData.append("feed_text", feedText.trim());

//       // Add tags
//       tags
//         .split(" ")
//         .filter(Boolean)
//         .forEach((tag) => formData.append("feed_tags[]", tag.trim()));

//       // Add new files
//       files.forEach((file) => {
//         formData.append("documents", file);
//       });

//       // Add documents to delete
//       documentsToDelete.forEach((docId) => {
//         formData.append("documents_to_delete[]", docId);
//       });

//       await axios.put(
//         `${apiUrl}/feeds/update/${feed.id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       alert("Feed updated successfully!");
//       if (onUpdateSuccess) onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Feed update error:", error);
//       alert("Failed to update feed: " + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Reset form on close
//   useEffect(() => {
//     if (!open) {
//       setFeedText("");
//       setTags("");
//       setFiles([]);
//       setExistingDocuments([]);
//       setDocumentsToDelete([]);
//       setLoading(false);
//     }
//   }, [open]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">Edit Feed</h2>
//           <button
//             onClick={onClose}
//             className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-5 px-6 py-5 max-h-[70vh] overflow-y-auto">
//           {/* About Feed */}
//           <div>
//             <label className="mb-1 block text-md font-medium text-gray-700">
//               About Feed
//             </label>
//             <textarea
//               rows={4}
//               value={feedText}
//               onChange={(e) => setFeedText(e.target.value)}
//               placeholder="Write feed details..."
//               className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="mb-1 block text-md font-medium text-gray-700">
//               Tags
//             </label>
//             <input
//               type="text"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//               placeholder="#NiftyAnalysis #MarketOutlook"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Existing Documents */}
//           {existingDocuments.length > 0 && (
//             <div>
//               <label className="mb-2 block text-md font-medium text-gray-700">
//                 Existing Files
//               </label>
//               <div className="space-y-2">
//                 {existingDocuments.map((doc, index) => {
//                   const isImage = doc.mimetype?.startsWith("image");
//                   const src = doc.filename.startsWith("http")
//                     ? doc.filename
//                     : `${apiUrl}/${doc.filename}`;

//                   return (
//                     <div key={doc.id || index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         {isImage ? (
//                           <img
//                             src={src}
//                             alt={doc.filename}
//                             className="h-12 w-12 rounded-md object-cover"
//                           />
//                         ) : (
//                           <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
//                             <span className="text-xs">Video</span>
//                           </div>
//                         )}
//                         <span className="text-md text-gray-700 truncate max-w-[200px]">
//                           {doc.original_filename || doc.filename}
//                         </span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveExistingDocument(doc.id)}
//                         className="rounded-md p-1 text-red-500 hover:bg-red-50"
//                         title="Remove this file"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* New Files */}
//           {files.length > 0 && (
//             <div>
//               <label className="mb-2 block text-md font-medium text-gray-700">
//                 New Files to Upload
//               </label>
//               <div className="space-y-2">
//                 {files.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-blue-50">
//                     <div className="flex items-center gap-3">
//                       {file.type.startsWith("image") ? (
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={file.name}
//                           className="h-12 w-12 rounded-md object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
//                           <span className="text-xs">Video</span>
//                         </div>
//                       )}
//                       <span className="text-md text-gray-700 truncate max-w-[200px]">
//                         {file.name}
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveNewFile(index)}
//                       className="rounded-md p-1 text-red-500 hover:bg-red-50"
//                       title="Remove this file"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Upload box */}
//           <div>
//             <label
//               htmlFor="feedUpload"
//               className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-10 text-center transition hover:bg-gray-50 hover:border-blue-400"
//             >
//               <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
//                 <Upload className="text-blue-600" size={22} />
//               </div>
//               <p className="text-md font-medium text-blue-600">
//                 Click here to upload Images or Videos
//               </p>
//               <p className="mt-1 text-xs text-gray-500">
//                 You can add new files or replace existing ones
//               </p>
//               {(files.length > 0 || existingDocuments.length > 0) && (
//                 <p className="mt-2 text-xs text-gray-500 font-medium">
//                   {existingDocuments.length} existing, {files.length} new
//                 </p>
//               )}
//             </label>
//             <input
//               id="feedUpload"
//               type="file"
//               className="hidden"
//               multiple
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//               disabled={loading}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="rounded-lg border px-10 py-2 text-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="rounded-lg bg-black px-10 py-2 text-md font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Updating..." : "Update Feed"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
















// import { X, Upload } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";

// export default function EditFeedModal({ open, onClose, feed, onUpdateSuccess }) {
//   // ✅ Proper null check
//   if (!open || !feed) return null;

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const user = JSON.parse(localStorage.getItem("user"));
//   const ra_id = user?.id;

//   const [feedText, setFeedText] = useState("");
//   const [tags, setTags] = useState("");
//   const [files, setFiles] = useState([]);
//   const [existingDocuments, setExistingDocuments] = useState([]);
//   const [documentsToDelete, setDocumentsToDelete] = useState([]);
//   const [loading, setLoading] = useState(false);

//   console.log('Feed data:', feed);

//   // ✅ FIXED: Proper data initialization for YOUR data structure
//   useEffect(() => {
//     if (open && feed) {
//       // Fix feed_text - handle escaped newlines
//       const cleanText = feed.feed_text
//         ?.replace(/\\\\r\\\\n/g, '\n')
//         .replace(/\\r\\n/g, '\n')
//         .replace(/\r\n/g, '\n') || "";
      
//       setFeedText(cleanText);
      
//       // Fix tags - split the concatenated string "#FII#NIFTY#NIFTY50"
//       if (feed.feed_tags && Array.isArray(feed.feed_tags) && feed.feed_tags.length > 0) {
//         const firstTag = feed.feed_tags[0] || "";
//         const tagArray = firstTag.split('#').filter(Boolean).join(' ');
//         setTags(tagArray);
//       } else {
//         setTags("");
//       }
      
//       // Fix documents - use YOUR exact structure
//       setExistingDocuments(feed.feed_documents || []);
//       setDocumentsToDelete([]);
//       setFiles([]);
//     }
//   }, [open, feed]);

//   const handleFileChange = useCallback((e) => {
//     setFiles(Array.from(e.target.files));
//   }, []);

//   const handleRemoveExistingDocument = useCallback((docIndex) => {
//     // Use index instead of id since your structure doesn't have id
//     setDocumentsToDelete(prev => [...prev, docIndex]);
//     setExistingDocuments(prev => {
//       const newDocs = [...prev];
//       newDocs.splice(docIndex, 1);
//       return newDocs;
//     });
//   }, []);

//   const handleRemoveNewFile = useCallback((index) => {
//     const newFiles = [...files];
//     newFiles.splice(index, 1);
//     setFiles(newFiles);
//   }, [files]);

//   const handleSubmit = async () => {
//     if (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) {
//       alert("Feed text or file is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("ra_id", ra_id);
//       formData.append("feed_text", feedText.trim());

//       // ✅ FIXED: Handle tags properly
//       const tagArray = tags
//         .split(/[\s,]+/)
//         .map(tag => tag.replace(/^#/, '').trim())
//         .filter(Boolean);
      
//       tagArray.forEach((tag) => {
//         formData.append("feed_tags[]", `#${tag}`);
//       });

//       // Add new files
//       files.forEach((file) => {
//         formData.append("documents", file);
//       });

//       // Add documents to delete (using original index/position)
//       documentsToDelete.forEach((docIndex) => {
//         formData.append("documents_to_delete[]", docIndex);
//       });

//       // Add feed ID
//       formData.append("id", feed.id);

//       await axios.put(
//         `${apiUrl}/feeds/update/${feed.id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       alert("Feed updated successfully!");
//       if (onUpdateSuccess) onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Feed update error:", error);
//       alert("Failed to update feed: " + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form on close
//   useEffect(() => {
//     if (!open) {
//       setFeedText("");
//       setTags("");
//       setFiles([]);
//       setExistingDocuments([]);
//       setDocumentsToDelete([]);
//       setLoading(false);
//     }
//   }, [open]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">Edit Feed</h2>
//           <button
//             onClick={onClose}
//             className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-5 px-6 py-5 overflow-y-auto flex-1">
//           {/* Feed Text */}
//           <div>
//             <label className="mb-1 block text-md font-medium text-gray-700">
//               Feed Content
//             </label>
//             <textarea
//               rows={6}
//               value={feedText}
//               onChange={(e) => setFeedText(e.target.value)}
//               placeholder="Write your feed content..."
//               className="w-full resize-vertical rounded-lg border border-gray-300 px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="mb-1 block text-md font-medium text-gray-700">
//               Tags (space separated)
//             </label>
//             <input
//               type="text"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//               placeholder="FII NIFTY NIFTY50"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <p className="mt-1 text-xs text-gray-500"># will be added automatically</p>
//           </div>

//           {/* Existing Documents */}
//           {existingDocuments.length > 0 && (
//             <div>
//               <label className="mb-2 block text-md font-medium text-gray-700">
//                 Existing Files ({existingDocuments.length})
//               </label>
//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {existingDocuments.map((doc, index) => {
//                   const isImage = doc.mimetype?.startsWith("image");
//                   const src = doc.url || doc.filename;

//                   return (
//                     <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50">
//                       <div className="flex items-center gap-3 flex-1 min-w-0">
//                         {isImage ? (
//                           <img
//                             src={src}
//                             alt={doc.originalName || doc.filename}
//                             className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                               e.target.nextSibling.style.display = 'flex';
//                             }}
//                           />
//                         ) : (
//                           <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
//                             <span className="text-xs font-medium">Video</span>
//                           </div>
//                         )}
//                         <div className="min-w-0 flex-1">
//                           <p className="text-md font-medium text-gray-900 truncate">
//                             {doc.originalName || doc.filename || 'Unknown file'}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {(doc.size / 1024 / 1024).toFixed(2)} MB
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveExistingDocument(index)}
//                         className="ml-4 rounded-md p-1.5 text-red-500 hover:bg-red-50 flex-shrink-0"
//                         title="Remove this file"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* New Files */}
//           {files.length > 0 && (
//             <div>
//               <label className="mb-2 block text-md font-medium text-gray-700">
//                 New Files to Upload ({files.length})
//               </label>
//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {files.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-blue-50">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       {file.type.startsWith("image") ? (
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={file.name}
//                           className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
//                         />
//                       ) : (
//                         <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
//                           <span className="text-xs font-medium">Video</span>
//                         </div>
//                       )}
//                       <div className="min-w-0 flex-1">
//                         <p className="text-md font-medium text-gray-900 truncate">{file.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveNewFile(index)}
//                       className="ml-4 rounded-md p-1.5 text-red-500 hover:bg-red-50 flex-shrink-0"
//                       title="Remove this file"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Upload box */}
//           <div>
//             <label
//               htmlFor="feedUpload"
//               className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-10 text-center transition hover:bg-gray-50 hover:border-blue-400"
//             >
//               <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
//                 <Upload className="text-blue-600 h-6 w-6" />
//               </div>
//               <p className="text-md font-medium text-blue-600">
//                 Click to upload Images or Videos
//               </p>
//               <p className="mt-1 text-xs text-gray-500">
//                 PNG, JPG, WEBP up to 10MB
//               </p>
//               {(files.length > 0 || existingDocuments.length > 0) && (
//                 <p className="mt-2 text-xs text-gray-500 font-medium">
//                   {existingDocuments.length} existing, {files.length} new
//                 </p>
//               )}
//             </label>
//             <input
//               id="feedUpload"
//               type="file"
//               className="hidden"
//               multiple
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//               disabled={loading}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4 shrink-0">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="rounded-lg border px-8 py-2.5 text-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading || (!feedText.trim() && files.length === 0 && existingDocuments.length === 0)}
//             className="rounded-lg bg-black px-8 py-2.5 text-md font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Updating..." : "Update Feed"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// import { X, Upload, ChevronDown } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";

// export default function EditFeedModal({ open, onClose, feed, onUpdateSuccess }) {
//   if (!open || !feed) return null;

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userRole = user?.role;
//   const isRA = userRole === "ra";
  
//   const [feedText, setFeedText] = useState("");
//   const [tags, setTags] = useState("");
//   const [files, setFiles] = useState([]);
//   const [existingDocuments, setExistingDocuments] = useState([]);
//   const [documentsToDelete, setDocumentsToDelete] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [analysts, setAnalysts] = useState([]);
//   const [selectedRA, setSelectedRA] = useState(null);
//   const [analystLoading, setAnalystLoading] = useState(false);

//   // Dynamic RA ID based on role
//   const getRAId = () => {
//     if (isRA) {
//       return user?.id;
//     }
//     return selectedRA?.id || feed.ra_id || user?.id;
//   };

//   const getRAName = () => {
//     if (isRA) {
//       return user?.name;
//     }
//     return selectedRA?.name || feed.ra_name || user?.name;
//   };

//   // Fetch analysts for admin only
//   const fetchAnalysts = useCallback(async () => {
//     if (isRA) return;
    
//     try {
//       setAnalystLoading(true);
//       const res = await axios.get(`${apiUrl}/research-analyst/all`);
//       if (res.data.success) {
//         setAnalysts(res.data.data || []);
//         // Auto-select current RA if available
//         const currentRA = res.data.data.find(ra => ra.id === feed.ra_id);
//         if (currentRA) {
//           setSelectedRA(currentRA);
//         } else if (res.data.data.length > 0) {
//           setSelectedRA(res.data.data[0]);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching analysts:", error);
//     } finally {
//       setAnalystLoading(false);
//     }
//   }, [apiUrl, isRA, feed.ra_id]);

//   // Initialize form data
//   useEffect(() => {
//     if (open && feed) {
//       const cleanText = feed.feed_text
//         ?.replace(/\\\\r\\\\n/g, '\n')
//         .replace(/\\r\\n/g, '\n')
//         .replace(/\r\n/g, '\n') || "";
      
//       setFeedText(cleanText);
      
//       if (feed.feed_tags && Array.isArray(feed.feed_tags) && feed.feed_tags.length > 0) {
//         const firstTag = feed.feed_tags[0] || "";
//         const tagArray = firstTag.split('#').filter(Boolean).join(' ');
//         setTags(tagArray);
//       } else {
//         setTags("");
//       }
      
//       setExistingDocuments(feed.feed_documents || []);
//       setDocumentsToDelete([]);
//       setFiles([]);
      
//       // Fetch analysts for admin
//       if (!isRA) {
//         fetchAnalysts();
//       }
//     }
//   }, [open, feed, isRA, fetchAnalysts]);

//   const handleFileChange = useCallback((e) => {
//     setFiles(Array.from(e.target.files));
//   }, []);

//   const handleRemoveExistingDocument = useCallback((docIndex) => {
//     setDocumentsToDelete(prev => [...prev, docIndex]);
//     setExistingDocuments(prev => {
//       const newDocs = [...prev];
//       newDocs.splice(docIndex, 1);
//       return newDocs;
//     });
//   }, []);

//   const handleRemoveNewFile = useCallback((index) => {
//     const newFiles = [...files];
//     newFiles.splice(index, 1);
//     setFiles(newFiles);
//   }, [files]);

//   const handleSubmit = async () => {
//     if (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) {
//       alert("Feed text or file is required");
//       return;
//     }

//     if (!isRA && !getRAId()) {
//       alert("Please select a Research Analyst");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("ra_id", getRAId());
//       formData.append("ra_name", getRAName());
//       formData.append("feed_text", feedText.trim());
//       formData.append("id", feed.id);

//       // Handle tags
//       const tagArray = tags
//         .split(/[\s,]+/)
//         .map(tag => tag.replace(/^#/, '').trim())
//         .filter(Boolean);
      
//       tagArray.forEach((tag) => {
//         formData.append("feed_tags[]", `#${tag}`);
//       });

//       // New files
//       files.forEach((file) => {
//         formData.append("documents", file);
//       });

//       // Documents to delete
//       documentsToDelete.forEach((docIndex) => {
//         formData.append("documents_to_delete[]", docIndex);
//       });

//       await axios.put(
//         `${apiUrl}/feeds/update/${feed.id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       alert("Feed updated successfully!");
//       if (onUpdateSuccess) onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Feed update error:", error);
//       alert("Failed to update feed: " + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form on close
//   useEffect(() => {
//     if (!open) {
//       setFeedText("");
//       setTags("");
//       setFiles([]);
//       setExistingDocuments([]);
//       setDocumentsToDelete([]);
//       setSelectedRA(null);
//       setAnalysts([]);
//       setLoading(false);
//     }
//   }, [open]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">Edit Feed</h2>
//           <button
//             onClick={onClose}
//             className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
//             disabled={loading}
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-5 px-6 py-5 overflow-y-auto flex-1">
//           {/* RA Selection - Only for Admin */}
//           {!isRA && (
//             <div>
//               <label className="mb-2 block text-md font-medium text-gray-700">
//                 Select Research Analyst *
//               </label>
//               <div className="relative">
//                 <select
//                   value={selectedRA?.id || ""}
//                   onChange={(e) => {
//                     const ra = analysts.find(analyst => analyst.id === parseInt(e.target.value));
//                     setSelectedRA(ra);
//                   }}
//                   disabled={loading || analystLoading}
//                   className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-10 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                 >
//                   <option value="">Choose Analyst</option>
//                   {analysts.map((ra) => (
//                     <option key={ra.id} value={ra.id}>
//                       {ra.name}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
//                   <ChevronDown size={16} />
//                 </div>
//               </div>
//               {analystLoading && (
//                 <p className="mt-1 text-xs text-gray-500 animate-pulse">Loading analysts...</p>
//               )}
//             </div>
//           )}

//           {/* Current RA display for RA users */}
//           {isRA && (
//             <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
//               <p className="text-md text-emerald-800 font-medium">
//                 RA: {user?.name || "You"}
//               </p>
//             </div>
//           )}

//           {/* Feed Text */}
//           <div>
//             <label className="mb-1 block text-md font-medium text-gray-700">
//               Feed Content *
//             </label>
//             <textarea
//               rows={6}
//               value={feedText}
//               onChange={(e) => setFeedText(e.target.value)}
//               placeholder="Write your feed content..."
//               className="w-full resize-vertical rounded-lg border border-gray-300 px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             />
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="mb-1 block text-md font-medium text-gray-700">
//               Tags (space separated)
//             </label>
//             <input
//               type="text"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//               placeholder="FII NIFTY NIFTY50"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             />
//             <p className="mt-1 text-xs text-gray-500"># will be added automatically</p>
//           </div>

//           {/* Existing Documents */}
//           {existingDocuments.length > 0 && (
//             <div>
//               <label className="mb-2 block text-md font-medium text-gray-700">
//                 Existing Files ({existingDocuments.length})
//               </label>
//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {existingDocuments.map((doc, index) => {
//                   const isImage = doc.mimetype?.startsWith("image");
//                   const src = doc.url || doc.filename;

//                   return (
//                     <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50">
//                       <div className="flex items-center gap-3 flex-1 min-w-0">
//                         {isImage ? (
//                           <img
//                             src={src}
//                             alt={doc.originalName || doc.filename}
//                             className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
//                             <span className="text-xs font-medium">File</span>
//                           </div>
//                         )}
//                         <div className="min-w-0 flex-1">
//                           <p className="text-md font-medium text-gray-900 truncate">
//                             {doc.originalName || doc.filename || 'Unknown file'}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {(doc.size / 1024 / 1024).toFixed(2)} MB
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveExistingDocument(index)}
//                         className="ml-4 rounded-md p-1.5 text-red-500 hover:bg-red-50 flex-shrink-0 disabled:opacity-50"
//                         disabled={loading}
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* New Files */}
//           {files.length > 0 && (
//             <div>
//               <label className="mb-2 block text-md font-medium text-gray-700">
//                 New Files to Upload ({files.length})
//               </label>
//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {files.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-blue-50">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       {file.type.startsWith("image") ? (
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={file.name}
//                           className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
//                         />
//                       ) : (
//                         <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
//                           <span className="text-xs font-medium">Video</span>
//                         </div>
//                       )}
//                       <div className="min-w-0 flex-1">
//                         <p className="text-md font-medium text-gray-900 truncate">{file.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveNewFile(index)}
//                       className="ml-4 rounded-md p-1.5 text-red-500 hover:bg-red-50 flex-shrink-0 disabled:opacity-50"
//                       disabled={loading}
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Upload box */}
//           <div>
//             <label
//               htmlFor="feedUpload"
//               className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-10 text-center transition hover:bg-gray-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
//                 <Upload className="text-blue-600 h-6 w-6" />
//               </div>
//               <p className="text-md font-medium text-blue-600">
//                 Click to upload Images or Videos
//               </p>
//               <p className="mt-1 text-xs text-gray-500">
//                 PNG, JPG, WEBP up to 10MB
//               </p>
//               {(files.length > 0 || existingDocuments.length > 0) && (
//                 <p className="mt-2 text-xs text-gray-500 font-medium">
//                   {existingDocuments.length} existing, {files.length} new
//                 </p>
//               )}
//             </label>
//             <input
//               id="feedUpload"
//               type="file"
//               className="hidden"
//               multiple
//               accept="image/*,video/*"
//               onChange={handleFileChange}
//               disabled={loading}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4 shrink-0">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="rounded-lg border px-8 py-2.5 text-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading || (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) || (!isRA && !getRAId())}
//             className="rounded-lg bg-black px-8 py-2.5 text-md font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Updating...
//               </>
//             ) : (
//               "Update Feed"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import { X, Upload, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function EditFeedModal({ open, onClose, feed, onUpdateSuccess }) {
  if (!open || !feed) return null;

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const isRA = userRole === "ra";
  
  const [feedText, setFeedText] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]); // Changed to array
  const [files, setFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysts, setAnalysts] = useState([]);
  const [selectedRA, setSelectedRA] = useState(null);
  const [analystLoading, setAnalystLoading] = useState(false);
  const [error, setError] = useState("");

  // Dynamic RA ID based on role
  const getRAId = () => {
    if (isRA) {
      return user?.id;
    }
    return selectedRA?.id || feed.ra_id || user?.id;
  };

  const getRAName = () => {
    if (isRA) {
      return user?.name;
    }
    return selectedRA?.name || feed.ra_name || user?.name;
  };

  // Fetch analysts for admin only
  const fetchAnalysts = useCallback(async () => {
    if (isRA) return;
    
    try {
      setAnalystLoading(true);
      const res = await axios.get(`${apiUrl}/research-analyst/all`);
      if (res.data.success) {
        setAnalysts(res.data.data || []);
        // Auto-select current RA if available
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
    
    // Check maximum tags (limit to 10)
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

  // Initialize tags from feed data
  useEffect(() => {
    if (open && feed) {
      const cleanText = feed.feed_text
        ?.replace(/\\\\r\\\\n/g, '\n')
        .replace(/\\r\\n/g, '\n')
        .replace(/\r\n/g, '\n') || "";
      
      setFeedText(cleanText);
      
      // Parse tags from feed
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
      setTagInput("");
      setError("");
      
      // Fetch analysts for admin
      if (!isRA) {
        fetchAnalysts();
      }
    }
  }, [open, feed, isRA, fetchAnalysts]);

  const handleFileChange = useCallback((e) => {
    setFiles(Array.from(e.target.files));
  }, []);

  const handleRemoveExistingDocument = useCallback((docIndex) => {
    setDocumentsToDelete(prev => [...prev, docIndex]);
    setExistingDocuments(prev => {
      const newDocs = [...prev];
      newDocs.splice(docIndex, 1);
      return newDocs;
    });
  }, []);

  const handleRemoveNewFile = useCallback((index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }, [files]);

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

      // Handle tags - Send as JSON string
      if (tags.length > 0) {
        formData.append("feed_tags", JSON.stringify(tags));
      }

      // New files
      files.forEach((file) => {
        formData.append("documents", file);
      });

      // Documents to delete
      documentsToDelete.forEach((docIndex) => {
        formData.append("documents_to_delete[]", docIndex);
      });

      await axios.put(
        `${apiUrl}/feeds/${feed.id}`,
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
      setExistingDocuments([]);
      setDocumentsToDelete([]);
      setSelectedRA(null);
      setAnalysts([]);
      setLoading(false);
      setError("");
    }
  }, [open]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Feed</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5 overflow-y-auto flex-1">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-md text-red-600">{error}</p>
            </div>
          )}

          {/* RA Selection - Only for Admin */}
          {!isRA && (
            <div>
              <label className="mb-2 block text-md font-medium text-gray-700">
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
                  className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-10 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                <p className="mt-1 text-xs text-gray-500 animate-pulse">Loading analysts...</p>
              )}
            </div>
          )}

          {/* Current RA display for RA users */}
          {isRA && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-md text-emerald-800 font-medium">
                RA: {user?.name || "You"}
              </p>
            </div>
          )}

          {/* Feed Text */}
          <div>
            <label className="mb-1 block text-md font-medium text-gray-700">
              Feed Content *
            </label>
            <textarea
              rows={6}
              value={feedText}
              onChange={(e) => setFeedText(e.target.value)}
              placeholder="Write your feed content..."
              className="w-full resize-vertical rounded-lg border border-gray-300 px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Tags - Enhanced with chips */}
          <div>
            <label className="mb-1 block text-md font-medium text-gray-700">
              Tags
            </label>
            
            {/* Tag Input with Chips */}
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              {/* Existing Tags */}
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-md rounded-md"
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
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={handleTagInputBlur}
                placeholder={tags.length === 0 ? "#NiftyAnalysis #MarketOutlook" : "Add more tags..."}
                className="flex-1 min-w-[120px] outline-none text-md bg-transparent"
                disabled={loading}
              />
            </div>
            
            <p className="mt-1 text-xs text-gray-500">
              Type tag name and press Enter to add. Maximum 10 tags. # will be added automatically.
            </p>
          </div>

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <div>
              <label className="mb-2 block text-md font-medium text-gray-700">
                Existing Files ({existingDocuments.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {existingDocuments.map((doc, index) => {
                  const isImage = doc.mimetype?.startsWith("image");
                  const src = doc.url || doc.filename;

                  return (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isImage ? (
                          <img
                            src={src}
                            alt={doc.originalName || doc.filename}
                            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
                            <span className="text-xs font-medium">File</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-md font-medium text-gray-900 truncate">
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
                        className="ml-4 rounded-md p-1.5 text-red-500 hover:bg-red-50 flex-shrink-0 disabled:opacity-50"
                        disabled={loading}
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
              <label className="mb-2 block text-md font-medium text-gray-700">
                New Files to Upload ({files.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-blue-50">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
                          <span className="text-xs font-medium">Video</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-md font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(index)}
                      className="ml-4 rounded-md p-1.5 text-red-500 hover:bg-red-50 flex-shrink-0 disabled:opacity-50"
                      disabled={loading}
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
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-10 text-center transition hover:bg-gray-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Upload className="text-blue-600 h-6 w-6" />
              </div>
              <p className="text-md font-medium text-blue-600">
                Click to upload Images or Videos
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, WEBP up to 10MB
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
        <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-8 py-2.5 text-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!feedText.trim() && files.length === 0 && existingDocuments.length === 0) || (!isRA && !getRAId())}
            className="rounded-lg bg-black px-8 py-2.5 text-md font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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