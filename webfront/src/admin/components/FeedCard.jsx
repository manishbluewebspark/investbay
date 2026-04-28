// import { FiMoreVertical, FiThumbsUp, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DeleteConfirmModal from "../components/modals/DeleteModal";
// import EditFeedModal from "../components/modals/EditFeedModal";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// const FeedCard = ({ feed, onDeleteSuccess }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false); // ✅ Edit modal state
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleView = () => {
//     setShowDropdown(false);
//     console.log("View feed:", feed.id);
//     navigate(`/admin/adminfeed/view/${feed.id}`, { state: { feed } });
//   };

//   // ✅ Updated handleEdit - Modal open karta hai
//   const handleEdit = () => {
//     setShowDropdown(false);
//     setEditModalOpen(true);
//   };

//   const handleDelete = () => {
//     setShowDropdown(false);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const ra_id = user?.id;
//       if (!ra_id) return;

//       await axios.delete(`${API_URL}/feeds/delete/${feed.id}`, {
//         data: { ra_id },
//       });

//       onDeleteSuccess();
//       setDeleteModalOpen(false);
//     } catch (error) {
//       console.error("Delete failed:", error.response?.data || error);
//     }
//   };

//   // ✅ Update success handler
//   const handleUpdateSuccess = () => {
//     setEditModalOpen(false);
//     if (onDeleteSuccess) onDeleteSuccess(); // Refresh list
//   };

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden relative">
//         <div className="flex justify-between items-start p-4">
//           <div className="flex gap-3">
//             <img
//               src={feed.ra_avatar || "https://via.placeholder.com/40"}
//               alt="user"
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             <div>
//               <h4 className="text-md font-semibold text-gray-900">{feed.ra_name}</h4>
//               <p className="text-xs text-gray-500">{new Date(feed.created_at).toLocaleString()}</p>
//             </div>
//           </div>

//           <div className="relative" ref={dropdownRef}>
//             <FiMoreVertical 
//               className="text-gray-500 cursor-pointer hover:text-gray-700" 
//               onClick={() => setShowDropdown(!showDropdown)}
//             />
            
//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-300 z-10 py-1">
//                 <button
//                   onClick={handleView}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEye className="text-gray-500" size={16} />
//                   <span>View</span>
//                 </button>
//                 <button
//                   onClick={handleEdit}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEdit className="text-gray-500" size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-red-600 hover:bg-gray-50"
//                 >
//                   <FiTrash2 className="text-red-500" size={16} />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="px-4 text-md text-gray-700 leading-relaxed">
//           {feed.feed_text}
//         </div>

//         {feed.feed_documents?.length > 0 && (
//           <div className="mt-4 flex flex-col gap-3">
//             {feed.feed_documents.map((doc, index) => {
//               const isImage = doc.mimetype?.startsWith("image");
//               const isVideo = doc.mimetype?.startsWith("video");

//               const src = doc.filename.startsWith("http")
//                 ? doc.filename
//                 : `${API_URL}/${doc.filename}`;

//               return isImage ? (
//                 <img
//                   key={index}
//                   src={src}
//                   alt={doc.filename}
//                   className="w-full h-56 object-cover rounded-md"
//                 />
//               ) : isVideo ? (
//                 <video
//                   key={index}
//                   controls
//                   className="w-full h-56 object-cover rounded-md"
//                 >
//                   <source src={src} type={doc.mimetype} />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : null;
//             })}
//           </div>
//         )}

//         <div className="px-4 mt-3 text-xs text-blue-600 flex flex-wrap gap-2">
//           {feed.feed_tags?.map((tag, index) => (
//             <span key={index}>#{tag.replace("#", "")}</span>
//           ))}
//         </div>

//         <div className="flex justify-between border-t border-gray-300 mt-4 px-4 py-3 text-md text-gray-600">
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiThumbsUp /> {feed.feed_like_count || 0} Like
//           </button>
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiMessageSquare /> {feed.feed_comment_count || 0} Comment
//           </button>
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiShare2 /> {feed.feed_share_count || 0} Share
//           </button>
//         </div>
//       </div>

//       {/* ✅ Delete Modal */}
//       <DeleteConfirmModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Delete Feed?"
//         description="This action will permanently remove the feed and it will no longer be visible to users."
//       />

//       {/* ✅ Edit Modal */}
//       <EditFeedModal
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         feed={feed}
//         onUpdateSuccess={handleUpdateSuccess}
//       />
//     </>
//   );
// };

// export default FeedCard;







// import { FiMoreVertical, FiThumbsUp, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DeleteConfirmModal from "../components/modals/DeleteModal";
// import EditFeedModal from "../components/modals/EditFeedModal";
// import axios from "axios";
// import { FaUserTie } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;

// const FeedCard = ({ feed, onDeleteSuccess }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);



  
//   // Safely parse feed_documents
//   const getFeedDocuments = () => {
//     try {
//       if (!feed?.feed_documents) return [];
      
//       // Agar string hai to parse karein
//       if (typeof feed.feed_documents === 'string') {
//         // Check if it's valid JSON
//         try {
//           const parsed = JSON.parse(feed.feed_documents);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch (e) {
//           console.error("Error parsing JSON:", e);
//           return [];
//         }
//       }
      
//       // Agar already array hai to return karein
//       if (Array.isArray(feed.feed_documents)) {
//         return feed.feed_documents;
//       }
      
//       return [];
//     } catch (error) {
//       console.error("Error parsing feed_documents:", error);
//       return [];
//     }
//   };

//   // Safely parse feed_tags
//   const getFeedTags = () => {
//     try {
//       if (!feed?.feed_tags) return [];
      
//       // Agar string hai to parse karein
//       if (typeof feed.feed_tags === 'string') {
//         // Check if it's JSON
//         try {
//           const parsed = JSON.parse(feed.feed_tags);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch {
//           // If not JSON, split by comma or space
//           return feed.feed_tags.split(/[,\s]+/).filter(tag => tag && tag.trim() !== '');
//         }
//       }
      
//       // Agar already array hai to return karein
//       if (Array.isArray(feed.feed_tags)) {
//         return feed.feed_tags;
//       }
      
//       return [];
//     } catch (error) {
//       console.error("Error parsing tags:", error);
//       return [];
//     }
//   };

//   const documents = getFeedDocuments();
//   const tags = getFeedTags();

//   const handleView = () => {
//     setShowDropdown(false);
//     navigate(`/admin/adminfeed/view/${feed.id}`, { state: { feed } });
//   };

//   const handleEdit = () => {


//     setShowDropdown(false);
//     setEditModalOpen(true);
//   };

//   const handleDelete = () => {

    
//     setShowDropdown(false);
//     setDeleteModalOpen(true);
//   };




//   const confirmDelete = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const ra_id = user?.id;
//       if (!ra_id) return;

//       await axios.delete(`${API_URL}/feeds/delete/${feed.id}`, {
//         data: { ra_id },
//       });

//       onDeleteSuccess();
//       setDeleteModalOpen(false);
//     } catch (error) {
//       console.error("Delete failed:", error.response?.data || error);
//     }
//   };





//   const handleUpdateSuccess = () => {
//     setEditModalOpen(false);
//     if (onDeleteSuccess) onDeleteSuccess(); // Refresh list
//   };

//   // Safely format date
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return dateString || '';
//     }
//   };

//   // Get document source URL safely
//   const getDocumentSource = (doc) => {
//     try {
//       // Priority: url field
//       if (doc.url) return doc.url;
      
//       // Fallback: filename/path
//       if (doc.filename && doc.filename.startsWith('http')) {
//         return doc.filename;
//       }
      
//       // If we have filename but not full URL, construct from API
//       if (doc.filename) {
//         return `${API_URL}/uploads/${doc.filename}`;
//       }
      
//       return '';
//     } catch (error) {
//       console.error("Error getting document source:", error);
//       return '';
//     }
//   };

//   // Check if document is image
//   const isImageDocument = (doc) => {
//     try {
//       if (doc.mimetype?.startsWith("image")) return true;
//       if (doc.type === 'image') return true;
//       if (doc.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return true;
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Check if document is video
//   const isVideoDocument = (doc) => {
//     try {
//       if (doc.mimetype?.startsWith("video")) return true;
//       if (doc.type === 'video') return true;
//       if (doc.filename?.match(/\.(mp4|mov|avi|mkv|webm|wmv)$/i)) return true;
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden relative">
//         <div className="flex justify-between items-start p-4">
//           <div className="flex gap-3">
//               {feed.ra_avatar?<>
//             <img
//               src={feed.ra_avatar || "https://via.placeholder.com/40"}
//               alt="user"
//               className="w-10 h-10 rounded-full object-cover"
//               onError={(e) => {
//                 e.target.src = "https://via.placeholder.com/40";
//               }}
//             />
//             </>:<>
            
//             <FaUserTie className="w-10 h-10 rounded-2xl" />
            
//             </>}
//             <div>
//               <h4 className="text-md font-semibold text-gray-900">
//                 {feed.ra_name || "Unknown User"}
//               </h4>
//               <p className="text-xs text-gray-500">
//                 {formatDate(feed.created_at || feed.updated_at)}
//               </p>
//             </div>
//           </div>

//           <div className="relative" ref={dropdownRef}>
//             <FiMoreVertical 
//               className="text-gray-500 cursor-pointer hover:text-gray-700" 
//               onClick={() => setShowDropdown(!showDropdown)}
//             />
            
//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-300 z-10 py-1">
//                 <button
//                   onClick={handleView}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEye className="text-gray-500" size={16} />
//                   <span>View</span>
//                 </button>
//                 <button
//                   onClick={handleEdit}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEdit className="text-gray-500" size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-red-600 hover:bg-gray-50"
//                 >
//                   <FiTrash2 className="text-red-500" size={16} />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {feed.feed_text && (
//           <div className="px-4 text-md text-gray-700 leading-relaxed whitespace-pre-line">
//             {feed.feed_text}
//           </div>
//         )}

//         {documents.length > 0 && (
//           <div className="mt-4 flex flex-col gap-3">
//             {documents.map((doc, index) => {
//               const src = getDocumentSource(doc);
//               const isImage = isImageDocument(doc);
//               const isVideo = isVideoDocument(doc);

//               if (!src) return null;

//               return isImage ? (
//                 <img
//                   key={index}
//                   src={src}
//                   alt={doc.filename || `Document ${index + 1}`}
//                   className="w-full h-56 object-cover rounded-md"
//                   onError={(e) => {
//                     console.error("Error loading image:", src);
//                     e.target.style.display = 'none';
//                   }}
//                 />
//               ) : isVideo ? (
//                 <video
//                   key={index}
//                   controls
//                   className="w-full h-56 object-cover rounded-md"
//                 >
//                   <source src={src} type={doc.mimetype || 'video/mp4'} />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <div key={index} className="p-4 border rounded-md bg-gray-50">
//                   <p className="text-md text-gray-600 truncate">
//                     📄 {doc.filename || `Document ${index + 1}`}
//                   </p>
//                   <a 
//                     href={src} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-500 hover:underline"
//                   >
//                     View Document
//                   </a>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {tags.length > 0 && (
//           <div className="px-4 mt-3 text-xs text-blue-600 flex flex-wrap gap-2">
//             {tags.map((tag, index) => (
//               <span key={index} className="bg-blue-50 px-2 py-1 rounded">
//                 #{tag.replace("#", "")}
//               </span>
//             ))}
//           </div>
//         )}

//         <div className="flex justify-between border-t border-gray-300 mt-4 px-4 py-3 text-md text-gray-600">
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiThumbsUp /> {feed.feed_like_count || 0} Like
//           </button>
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiMessageSquare /> {feed.feed_comment_count || 0} Comment
//           </button>
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiShare2 /> {feed.feed_share_count || 0} Share
//           </button>
//         </div>
//       </div>

//       {/* Delete Modal */}
//       <DeleteConfirmModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Delete Feed?"
//         description="This action will permanently remove the feed and it will no longer be visible to users."
//       />

//       {/* Edit Modal */}
//       <EditFeedModal
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         feed={feed}
//         onUpdateSuccess={handleUpdateSuccess}
//       />
//     </>
//   );
// };

// export default FeedCard;


// import { FiMoreVertical, FiThumbsUp, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronUp } from "react-icons/fi";
// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DeleteConfirmModal from "../components/modals/DeleteModal";
// import EditFeedModal from "../components/modals/EditFeedModal";
// import axios from "axios";
// import { FaUserTie } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;

// const FeedCard = ({ feed, onDeleteSuccess }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [showReadMore, setShowReadMore] = useState(false);
//   const textRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Check if text needs read more button
//   useEffect(() => {
//     if (textRef.current && feed?.feed_text) {
//       // Check if text height exceeds 3 lines (approx 4.5rem)
//       const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight) || 20;
//       const maxHeight = lineHeight * 3; // 3 lines height
//       setShowReadMore(textRef.current.scrollHeight > maxHeight);
//     }
//   }, [feed?.feed_text]);

//   // Safely parse feed_documents
//   const getFeedDocuments = () => {
//     try {
//       if (!feed?.feed_documents) return [];
      
//       if (typeof feed.feed_documents === 'string') {
//         try {
//           const parsed = JSON.parse(feed.feed_documents);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch (e) {
//           console.error("Error parsing JSON:", e);
//           return [];
//         }
//       }
      
//       if (Array.isArray(feed.feed_documents)) {
//         return feed.feed_documents;
//       }
      
//       return [];
//     } catch (error) {
//       console.error("Error parsing feed_documents:", error);
//       return [];
//     }
//   };

//   // Safely parse feed_tags
//   const getFeedTags = () => {
//     try {
//       if (!feed?.feed_tags) return [];
      
//       if (typeof feed.feed_tags === 'string') {
//         try {
//           const parsed = JSON.parse(feed.feed_tags);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch {
//           return feed.feed_tags.split(/[,\s]+/).filter(tag => tag && tag.trim() !== '');
//         }
//       }
      
//       if (Array.isArray(feed.feed_tags)) {
//         return feed.feed_tags;
//       }
      
//       return [];
//     } catch (error) {
//       console.error("Error parsing tags:", error);
//       return [];
//     }
//   };

//   const documents = getFeedDocuments();
//   const tags = getFeedTags();

//   const handleView = () => {
//     setShowDropdown(false);
//     navigate(`/admin/adminfeed/view/${feed.id}`, { state: { feed } });
//   };

//   const handleEdit = () => {
//     setShowDropdown(false);
//     setEditModalOpen(true);
//   };

//   const handleDelete = () => {
//     setShowDropdown(false);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const ra_id = user?.id;
//       if (!ra_id) return;

//       await axios.delete(`${API_URL}/feeds/delete/${feed.id}`, {
//         data: { ra_id },
//       });

//       onDeleteSuccess();
//       setDeleteModalOpen(false);
//     } catch (error) {
//       console.error("Delete failed:", error.response?.data || error);
//     }
//   };

//   const handleUpdateSuccess = () => {
//     setEditModalOpen(false);
//     if (onDeleteSuccess) onDeleteSuccess(); // Refresh list
//   };

//   // Safely format date
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return dateString || '';
//     }
//   };

//   // Get document source URL safely
//   const getDocumentSource = (doc) => {
//     try {
//       if (doc.url) return doc.url;
      
//       if (doc.filename && doc.filename.startsWith('http')) {
//         return doc.filename;
//       }
      
//       if (doc.filename) {
//         return `${API_URL}/uploads/${doc.filename}`;
//       }
      
//       return '';
//     } catch (error) {
//       console.error("Error getting document source:", error);
//       return '';
//     }
//   };

//   // Check if document is image
//   const isImageDocument = (doc) => {
//     try {
//       if (doc.mimetype?.startsWith("image")) return true;
//       if (doc.type === 'image') return true;
//       if (doc.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return true;
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Check if document is video
//   const isVideoDocument = (doc) => {
//     try {
//       if (doc.mimetype?.startsWith("video")) return true;
//       if (doc.type === 'video') return true;
//       if (doc.filename?.match(/\.(mp4|mov|avi|mkv|webm|wmv)$/i)) return true;
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden relative">
//         <div className="flex justify-between items-start p-4">
//           <div className="flex gap-3">
//             {feed.ra_avatar ? (
//               <img
//                 src={feed.ra_avatar || "https://via.placeholder.com/40"}
//                 alt="user"
//                 className="w-10 h-10 rounded-full object-cover"
//                 onError={(e) => {
//                   e.target.src = "https://via.placeholder.com/40";
//                 }}
//               />
//             ) : (
//               <FaUserTie className="w-10 h-10 rounded-2xl" />
//             )}
//             <div>
//               <h4 className="text-md font-semibold text-gray-900">
//                 {feed.ra_name || "Unknown User"}
//               </h4>
//               <p className="text-xs text-gray-500">
//                 {formatDate(feed.created_at || feed.updated_at)}
//               </p>
//             </div>
//           </div>

//           <div className="relative" ref={dropdownRef}>
//             <FiMoreVertical 
//               className="text-gray-500 cursor-pointer hover:text-gray-700" 
//               onClick={() => setShowDropdown(!showDropdown)}
//             />
            
//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-300 z-10 py-1">
//                 <button
//                   onClick={handleView}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEye className="text-gray-500" size={16} />
//                   <span>View</span>
//                 </button>
//                 <button
//                   onClick={handleEdit}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEdit className="text-gray-500" size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-md text-red-600 hover:bg-gray-50"
//                 >
//                   <FiTrash2 className="text-red-500" size={16} />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {feed.feed_text && (
//           <div className="px-4">
//             <div
//               ref={textRef}
//               className={`text-md text-gray-700 leading-relaxed whitespace-pre-line ${
//                 !isExpanded ? 'line-clamp-3' : ''
//               }`}
//               style={!isExpanded ? { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}}
//             >
//               {feed.feed_text}
//             </div>
            
//             {showReadMore && (
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="flex items-center gap-1 mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
//               >
//                 {isExpanded ? (
//                   <>
//                     <FiChevronUp size={16} />
//                     Show less
//                   </>
//                 ) : (
//                   <>
//                     <FiChevronDown size={16} />
//                     Read more
//                   </>
//                 )}
//               </button>
//             )}
//           </div>
//         )}

//         {documents.length > 0 && (
//           <div className="mt-4 flex flex-col gap-3 px-4">
//             {documents.map((doc, index) => {
//               const src = getDocumentSource(doc);
//               const isImage = isImageDocument(doc);
//               const isVideo = isVideoDocument(doc);

//               if (!src) return null;

//               return isImage ? (
//                 <img
//                   key={index}
//                   src={src}
//                   alt={doc.filename || `Document ${index + 1}`}
//                   className="w-full h-56 object-cover rounded-md"
//                   onError={(e) => {
//                     console.error("Error loading image:", src);
//                     e.target.style.display = 'none';
//                   }}
//                 />
//               ) : isVideo ? (
//                 <video
//                   key={index}
//                   controls
//                   className="w-full h-56 object-cover rounded-md"
//                 >
//                   <source src={src} type={doc.mimetype || 'video/mp4'} />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <div key={index} className="p-4 border rounded-md bg-gray-50">
//                   <p className="text-md text-gray-600 truncate">
//                     📄 {doc.filename || `Document ${index + 1}`}
//                   </p>
//                   <a 
//                     href={src} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-500 hover:underline"
//                   >
//                     View Document
//                   </a>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {tags.length > 0 && (
//           <div className="px-4 mt-3 text-xs text-blue-600 flex flex-wrap gap-2">
//             {tags.map((tag, index) => (
//               <span key={index} className="bg-blue-50 px-2 py-1 rounded">
//                 #{tag.replace("#", "")}
//               </span>
//             ))}
//           </div>
//         )}

//         <div className="flex justify-between border-t border-gray-300 mt-4 px-4 py-3 text-md text-gray-600">
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiThumbsUp /> {feed.feed_like_count || 0} Like
//           </button>
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiMessageSquare /> {feed.feed_comment_count || 0} Comment
//           </button>
//           <button className="flex items-center gap-2 hover:text-black">
//             <FiShare2 /> {feed.feed_share_count || 0} Share
//           </button>
//         </div>
//       </div>

//       {/* Delete Modal */}
//       <DeleteConfirmModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={confirmDelete}
//         title="Delete Feed?"
//         description="This action will permanently remove the feed and it will no longer be visible to users."
//       />

//       {/* Edit Modal */}
//       <EditFeedModal
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         feed={feed}
//         onUpdateSuccess={handleUpdateSuccess}
//       />
//     </>
//   );
// };

// export default FeedCard;



import { FiMoreVertical, FiThumbsUp, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronUp, FiSend } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/modals/DeleteModal";
import EditFeedModal from "../components/modals/EditFeedModal";
import axios from "axios";
import { FaUserTie, FaRegComment, FaRegShareSquare, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const FeedCard = ({ feed, onDeleteSuccess }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef(null);
  const dropdownRef = useRef(null);
  const commentInputRef = useRef(null);
  const navigate = useNavigate();

  // State for interactive counts
  const [likeCount, setLikeCount] = useState(feed.feed_like_count || 0);
  const [commentCount, setCommentCount] = useState(feed.feed_comment_count || 0);
  const [shareCount, setShareCount] = useState(feed.feed_share_count || 0);
  const [isLiked, setIsLiked] = useState(feed.is_liked_by_user || false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // State for comments
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(feed.feed_comments || feed.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Get current user
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if text needs read more button
  useEffect(() => {
    if (textRef.current && feed?.feed_text) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight) || 20;
      const maxHeight = lineHeight * 3;
      setShowReadMore(textRef.current.scrollHeight > maxHeight);
    }
  }, [feed?.feed_text]);

  // Focus comment input when comments section opens
  useEffect(() => {
    if (showComments && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showComments]);

  // Safely parse feed_documents
  const getFeedDocuments = () => {
    try {
      if (!feed?.feed_documents) return [];
      
      if (typeof feed.feed_documents === 'string') {
        try {
          const parsed = JSON.parse(feed.feed_documents);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      
      if (Array.isArray(feed.feed_documents)) {
        return feed.feed_documents;
      }
      
      return [];
    } catch (error) {
      return [];
    }
  };

  // Safely parse feed_tags
  const getFeedTags = () => {
    try {
      if (!feed?.feed_tags) return [];
      
      if (typeof feed.feed_tags === 'string') {
        try {
          const parsed = JSON.parse(feed.feed_tags);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return feed.feed_tags.split(/[,\s]+/).filter(tag => tag && tag.trim() !== '');
        }
      }
      
      if (Array.isArray(feed.feed_tags)) {
        return feed.feed_tags;
      }
      
      return [];
    } catch (error) {
      return [];
    }
  };

  const documents = getFeedDocuments();
  const tags = getFeedTags();

  const handleView = () => {
    setShowDropdown(false);
    navigate(`/admin/adminfeed/view/${feed.id}`, { state: { feed } });
  };

  const handleEdit = () => {
    setShowDropdown(false);
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const user = getCurrentUser();
      const ra_id = user?.id;
      if (!ra_id) return;

      await axios.delete(`${API_URL}/feeds/delete/${feed.id}`, {
        data: { ra_id },
      });

      onDeleteSuccess();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error);
    }
  };

  const handleUpdateSuccess = () => {
    setEditModalOpen(false);
    if (onDeleteSuccess) onDeleteSuccess();
  };

  // Handle Like/Unlike
  const handleLike = async () => {
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      const user = getCurrentUser();
      if (!user?.id) return;

      const response = await axios.post(`${API_URL}/feeds/${feed.id}/like`, {
        user_id: user.id
      });

      if (response.data.success) {
        setLikeCount(response.data.like_count);
        setIsLiked(response.data.is_liked);
      }
    } catch (error) {
      console.error("Error liking feed:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Share
  const handleShare = async () => {
    if (isSharing) return;
    
    try {
      setIsSharing(true);
      const user = getCurrentUser();
      
      const response = await axios.post(`${API_URL}/feeds/${feed.id}/share`, {
        user_id: user?.id
      });

      if (response.data.success) {
        setShareCount(response.data.share_count);
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Feed by ${feed.ra_name}`,
              text: feed.feed_text?.substring(0, 100) + '...',
              url: window.location.origin + `/admin/adminfeed/view/${feed.id}`
            });
          } catch (shareError) {
            // User cancelled share
          }
        }
      }
    } catch (error) {
      console.error("Error sharing feed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // Handle Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      const user = getCurrentUser();
      if (!user?.id) return;

      const response = await axios.post(`${API_URL}/feeds/${feed.id}/comment`, {
        user_id: user.id,
        comment_text: newComment.trim()
      });

      if (response.data.success) {
        const newCommentObj = {
          id: response.data.comment_id,
          user_id: user.id,
          user_name: user.name || user.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          comment_text: newComment.trim()
        };
        
        setComments([newCommentObj, ...comments]);
        setCommentCount(response.data.comment_count);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString || '';
    }
  };

  // Get document source URL safely
  const getDocumentSource = (doc) => {
    try {
      if (doc.url) return doc.url;
      if (doc.filename && doc.filename.startsWith('http')) return doc.filename;
      if (doc.filename) return `${API_URL}/uploads/${doc.filename}`;
      return '';
    } catch (error) {
      return '';
    }
  };

  // Check if document is image
  const isImageDocument = (doc) => {
    try {
      if (doc.mimetype?.startsWith("image")) return true;
      if (doc.type === 'image') return true;
      if (doc.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return true;
      return false;
    } catch (error) {
      return false;
    }
  };

  // Check if document is video
  const isVideoDocument = (doc) => {
    try {
      if (doc.mimetype?.startsWith("video")) return true;
      if (doc.type === 'video') return true;
      if (doc.filename?.match(/\.(mp4|mov|avi|mkv|webm|wmv)$/i)) return true;
      return false;
    } catch (error) {
      return false;
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (feed.ra_name) {
      return feed.ra_name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-start p-4">
          <div className="flex gap-3">
            {/* Avatar with fallback */}
            {feed.ra_avatar ? (
              <img
                src={feed.ra_avatar}
                alt={feed.ra_name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`${feed.ra_avatar ? 'hidden' : 'flex'} fallback-avatar w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center text-white font-semibold text-md`}>
              {getUserInitials()}
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 hover:underline cursor-pointer">
                {feed.ra_name || "Unknown User"}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDate(feed.created_at || feed.updated_at)}
              </p>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiMoreVertical className="text-gray-500" size={18} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                <button
                  onClick={handleView}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiEye className="text-gray-500" size={16} />
                  <span>View post</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiEdit className="text-gray-500" size={16} />
                  <span>Edit post</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="text-red-500" size={16} />
                  <span>Delete post</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feed Text */}
        {feed.feed_text && (
          <div className="px-4 pb-2">
            <div
              ref={textRef}
              className={`text-md text-gray-800 leading-relaxed whitespace-pre-line break-words ${
                !isExpanded ? 'line-clamp-3' : ''
              }`}
              style={!isExpanded ? { 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden' 
              } : {}}
            >
              {feed.feed_text}
            </div>
            
            {showReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <FiChevronUp size={16} />
                    Show less
                  </>
                ) : (
                  <>
                    <FiChevronDown size={16} />
                    Read more
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Documents/Media */}
        {documents.length > 0 && (
          <div className="mt-2 px-4 pb-2">
            <div className={`grid ${documents.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
              {documents.map((doc, index) => {
                const src = getDocumentSource(doc);
                const isImage = isImageDocument(doc);
                const isVideo = isVideoDocument(doc);

                if (!src) return null;

                return (
                  <div 
                    key={index} 
                    className={`relative rounded-lg overflow-hidden bg-gray-100 ${
                      documents.length === 1 ? 'w-full' : ''
                    }`}
                  >
                    {isImage ? (
                      <img
                        src={src}
                        alt={doc.originalName || `Media ${index + 1}`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => window.open(src, '_blank')}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+not+found';
                        }}
                      />
                    ) : isVideo ? (
                      <video
                        src={src}
                        controls
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-gray-200"
                      >
                        <div className="p-2 bg-white rounded-lg">
                          <FiEye className="text-gray-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-md font-medium text-gray-900 truncate">
                            {doc.originalName || doc.filename || `Document ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : 'Click to view'}
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="px-4 mt-2 pb-2 flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                #{tag.replace(/^#+/, '')}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                +{tags.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Stats Bar */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
          {likeCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaThumbsUp className="text-white" size={10} />
                </div>
              </div>
              <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            </div>
          )}
          {commentCount > 0 && (
            <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
          )}
          {shareCount > 0 && (
            <span>{shareCount} {shareCount === 1 ? 'share' : 'shares'}</span>
          )}
        </div>

        {/* Interaction Buttons */}
        <div className="grid grid-cols-3 border-t border-gray-200">
          {/* Like Button */}
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center justify-center gap-2 py-3 text-md font-medium transition-colors hover:bg-gray-50 ${
              isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {isLiked ? (
              <FaThumbsUp className="text-blue-600" size={16} />
            ) : (
              <FiThumbsUp size={16} />
            )}
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          {/* Comment Button */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center justify-center gap-2 py-3 text-md font-medium transition-colors hover:bg-gray-50 ${
              showComments ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <FiMessageSquare size={16} />
            <span>Comment</span>
          </button>
          
          {/* Share Button */}
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 py-3 text-md font-medium text-gray-600 hover:text-blue-600 transition-colors hover:bg-gray-50"
          >
            <FiShare2 size={16} />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
              <div className="flex-shrink-0">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1 relative">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 pr-20 text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  disabled={isSubmittingComment}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="absolute right-1 top-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <FiSend size={14} />
                  Post
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="flex-shrink-0">
                      {comment.user_avatar ? (
                        <img
                          src={comment.user_avatar}
                          alt={comment.user_name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold text-xs">
                          {comment.user_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl px-4 py-2.5 shadow-sm">
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="text-xs font-semibold text-gray-900">
                            {comment.user_name || 'User'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-md text-gray-800 whitespace-pre-line break-words">
                          {comment.comment_text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <FaRegComment className="text-gray-400" size={20} />
                  </div>
                  <p className="text-gray-500 text-md">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete post?"
        description="This action cannot be undone. The post will be permanently removed from your feed."
      />

      {/* Edit Modal */}
      <EditFeedModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        feed={feed}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default FeedCard;