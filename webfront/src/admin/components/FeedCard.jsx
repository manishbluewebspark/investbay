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
//               <h4 className="text-sm font-semibold text-gray-900">{feed.ra_name}</h4>
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
//                   className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEye className="text-gray-500" size={16} />
//                   <span>View</span>
//                 </button>
//                 <button
//                   onClick={handleEdit}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                 >
//                   <FiEdit className="text-gray-500" size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
//                 >
//                   <FiTrash2 className="text-red-500" size={16} />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="px-4 text-sm text-gray-700 leading-relaxed">
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

//         <div className="flex justify-between border-t border-gray-300 mt-4 px-4 py-3 text-sm text-gray-600">
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


import { FiMoreVertical, FiThumbsUp, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/modals/DeleteModal";
import EditFeedModal from "../components/modals/EditFeedModal";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const FeedCard = ({ feed, onDeleteSuccess }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  // Safely parse feed_documents
  const getFeedDocuments = () => {
    try {
      if (!feed?.feed_documents) return [];
      
      // Agar string hai to parse karein
      if (typeof feed.feed_documents === 'string') {
        // Check if it's valid JSON
        try {
          const parsed = JSON.parse(feed.feed_documents);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Error parsing JSON:", e);
          return [];
        }
      }
      
      // Agar already array hai to return karein
      if (Array.isArray(feed.feed_documents)) {
        return feed.feed_documents;
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing feed_documents:", error);
      return [];
    }
  };

  // Safely parse feed_tags
  const getFeedTags = () => {
    try {
      if (!feed?.feed_tags) return [];
      
      // Agar string hai to parse karein
      if (typeof feed.feed_tags === 'string') {
        // Check if it's JSON
        try {
          const parsed = JSON.parse(feed.feed_tags);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // If not JSON, split by comma or space
          return feed.feed_tags.split(/[,\s]+/).filter(tag => tag && tag.trim() !== '');
        }
      }
      
      // Agar already array hai to return karein
      if (Array.isArray(feed.feed_tags)) {
        return feed.feed_tags;
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing tags:", error);
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
      const user = JSON.parse(localStorage.getItem("user"));
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
    if (onDeleteSuccess) onDeleteSuccess(); // Refresh list
  };

  // Safely format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString || '';
    }
  };

  // Get document source URL safely
  const getDocumentSource = (doc) => {
    try {
      // Priority: url field
      if (doc.url) return doc.url;
      
      // Fallback: filename/path
      if (doc.filename && doc.filename.startsWith('http')) {
        return doc.filename;
      }
      
      // If we have filename but not full URL, construct from API
      if (doc.filename) {
        return `${API_URL}/uploads/${doc.filename}`;
      }
      
      return '';
    } catch (error) {
      console.error("Error getting document source:", error);
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

  return (
    <>
      <div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden relative">
        <div className="flex justify-between items-start p-4">
          <div className="flex gap-3">
            <img
              src={feed.ra_avatar || "https://via.placeholder.com/40"}
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40";
              }}
            />
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {feed.ra_name || "Unknown User"}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDate(feed.created_at || feed.updated_at)}
              </p>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <FiMoreVertical 
              className="text-gray-500 cursor-pointer hover:text-gray-700" 
              onClick={() => setShowDropdown(!showDropdown)}
            />
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-300 z-10 py-1">
                <button
                  onClick={handleView}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiEye className="text-gray-500" size={16} />
                  <span>View</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiEdit className="text-gray-500" size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <FiTrash2 className="text-red-500" size={16} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {feed.feed_text && (
          <div className="px-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {feed.feed_text}
          </div>
        )}

        {documents.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {documents.map((doc, index) => {
              const src = getDocumentSource(doc);
              const isImage = isImageDocument(doc);
              const isVideo = isVideoDocument(doc);

              if (!src) return null;

              return isImage ? (
                <img
                  key={index}
                  src={src}
                  alt={doc.filename || `Document ${index + 1}`}
                  className="w-full h-56 object-cover rounded-md"
                  onError={(e) => {
                    console.error("Error loading image:", src);
                    e.target.style.display = 'none';
                  }}
                />
              ) : isVideo ? (
                <video
                  key={index}
                  controls
                  className="w-full h-56 object-cover rounded-md"
                >
                  <source src={src} type={doc.mimetype || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div key={index} className="p-4 border rounded-md bg-gray-50">
                  <p className="text-sm text-gray-600 truncate">
                    📄 {doc.filename || `Document ${index + 1}`}
                  </p>
                  <a 
                    href={src} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View Document
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {tags.length > 0 && (
          <div className="px-4 mt-3 text-xs text-blue-600 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-50 px-2 py-1 rounded">
                #{tag.replace("#", "")}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between border-t border-gray-300 mt-4 px-4 py-3 text-sm text-gray-600">
          <button className="flex items-center gap-2 hover:text-black">
            <FiThumbsUp /> {feed.feed_like_count || 0} Like
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <FiMessageSquare /> {feed.feed_comment_count || 0} Comment
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <FiShare2 /> {feed.feed_share_count || 0} Share
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Feed?"
        description="This action will permanently remove the feed and it will no longer be visible to users."
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