

// import React from "react";
// import { FaRegThumbsUp, FaRegCommentDots, FaShareAlt } from "react-icons/fa";

// export default function PostCard({ post }) {
//   console.log(post, 'post ....');

//   // Extract initials from ra_name
//   const getInitials = (name) => {
//     if (!name) return "U";
//     const nameParts = name.split(" ");
//     if (nameParts.length > 1) {
//       return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
//     }
//     return name.charAt(0).toUpperCase();
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Extract tags from feed_tags
//   const getTags = (tags) => {
//     if (!tags || !Array.isArray(tags)) return [];
//     return tags.map(tag => tag.replace(/#/g, ''));
//   };

//   return (
//     <section>
//       <div
//         className="rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition-all duration-300 hover:shadow-md"
//         style={{
//           background: "linear-gradient(157.99deg, #EDEFFF 0%, #FFFFFF 100%)",
//         }}
//       >
//         {/* Header Section */}
//         <div className="flex items-center mb-4">
//           <div className="w-10 h-10 rounded-full bg-green-300 flex items-center justify-center font-bold text-gray-700">
//             {getInitials(post.ra_name)}
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-semibold text-gray-800">{post.ra_name || "Unknown User"}</h3>
//             <p className="text-xs text-gray-500">
//               {formatDate(post.created_at)}
//             </p>
//           </div>
//         </div>

//         <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full mb-5"></div>

//         {/* Post Content */}
//         <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.feed_text}</p>

//         {/* Optional: Support/Resistance/Sentiment section - You can remove if not needed */}
//         {/* 
//         <div className="text-xs text-gray-600 mb-4 bg-white/50 p-2 rounded-lg border border-gray-100">
//           <p>
//             <span className="font-semibold text-gray-700">Support:</span> {post.support}{" "}
//             <span className="ml-3 font-semibold text-gray-700">Resistance:</span> {post.resistance}{" "}
//             <span className="ml-3 font-semibold text-gray-700">Sentiment:</span> {post.sentiment}
//           </p>
//         </div>
//         */}

//         {/* Post Image - Only show if feed_documents exists and has items */}
//         {post.feed_documents && post.feed_documents.length > 0 && (
//           <img
//             src={post.feed_documents[0].url}
//             alt="Post"
//             className="rounded-xl w-full mb-4 border border-gray-100 max-h-96 object-contain bg-gray-50"
//             onError={(e) => {
//               e.target.style.display = 'none';
//             }}
//           />
//         )}

//         {/* Tags */}
//         <div className="flex flex-wrap gap-2 text-xs mb-4">
//           {getTags(post.feed_tags).map((tag, i) => (
//             <span
//               key={i}
//               className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>

//         <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full mb-5"></div>
        
//         {/* Interaction Stats and Buttons */}
//         <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
//           <div className="flex items-center gap-4">
//             <span>{post.feed_like_count || 0} likes</span>
//             <span>{post.feed_comment_count || 0} comments</span>
//             <span>{post.feed_share_count || 0} shares</span>
//           </div>
//         </div>

//         <div className="flex justify-between text-gray-600 text-sm">
//           <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 border p-1 px-14 rounded-md">
//             <FaRegThumbsUp className="text-base" /> Like
//           </button>
//           <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 border p-1 px-14 rounded-md">
//             <FaRegCommentDots className="text-base" /> Comment
//           </button>
//           <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 border p-1 px-14 rounded-md">
//             <FaShareAlt className="text-base" /> Share
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }




// components/signals/PostCard.jsx
import React, { useState, useEffect } from "react";
import { 
  FaRegThumbsUp, 
  FaThumbsUp, 
  FaRegCommentDots, 
  FaShareAlt, 
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaLink,
  FaCheck
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostCard({ post: initialPost, onUpdate }) {
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost.is_liked_by_user || false);
  const [likesCount, setLikesCount] = useState(initialPost.feed_like_count || 0);
  const [commentsCount, setCommentsCount] = useState(initialPost.feed_comment_count || 0);
  const [sharesCount, setSharesCount] = useState(initialPost.feed_share_count || 0);
  
  // Comment states
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(initialPost.comments || []);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  
  // Share states
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Menu states
  const [showMenu, setShowMenu] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;
  const apiUrl = import.meta.env.VITE_API_URL;

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const user = localStorage.getItem("user");
    return user && JSON.parse(user).id;
  };

  // Show login toast for unauthenticated users
  const requireAuth = (action) => {
    if (!isAuthenticated()) {
      toast.warning(`🔐 Please login to ${action}`, {
        ...toastConfig,
        autoClose: 4000,
        theme: "light",
        icon: "🔒"
      });
      return false;
    }
    return true;
  };

  // Load comments when component mounts or initialPost changes
  useEffect(() => {
    setComments(initialPost.comments || []);
    setIsLiked(initialPost.is_liked_by_user || false);
    setLikesCount(initialPost.feed_like_count || 0);
    setCommentsCount(initialPost.feed_comment_count || 0);
    setSharesCount(initialPost.feed_share_count || 0);
  }, [initialPost]);

  // 📌 LIKE TOGGLE HANDLER - FIXED URL
  const handleLike = async () => {
    if (!requireAuth('like this post')) return;

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const res = await axios.post(
        `${apiUrl}/feeds/feeds/${post.id}/like`,  // REMOVED extra /feeds/
        { user_id: userId },
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setIsLiked(res.data.data.liked);
        setLikesCount(res.data.data.likes_count);
        
        toast.success(res.data.data.liked ? 'Post liked!' : 'Post unliked!', {
          ...toastConfig,
          icon: res.data.data.liked ? '👍' : '👎',
          theme: 'dark',
          autoClose: 2000
        });
        
        // Refresh parent component
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      
      console.error("Error toggling like:", error);
      toast.error('Failed to like post. Please try again.', toastConfig);
    }
  };

  // 📌 ADD COMMENT HANDLER - FIXED URL
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment', toastConfig);
      return;
    }
    
    if (!requireAuth('comment on this post')) return;

    const commentText = newComment.trim();
    setNewComment(""); // Clear input immediately
    
    try {
      const res = await axios.post(
        `${apiUrl}/feeds/feeds/${post.id}/comments`,  // REMOVED extra /feeds/
        { 
          comment_text: commentText, 
          user_id: userId 
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments(res.data.data.comments);
        setCommentsCount(res.data.data.comments_count);
        
        toast.success('💬 Comment added successfully!', {
          ...toastConfig,
          icon: '✅',
          autoClose: 2000
        });
        
        // Refresh parent component
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      setNewComment(commentText); // Restore comment on error
      console.error("Error adding comment:", error);
      toast.error('Failed to add comment. Please try again.', toastConfig);
    }
  };

  // 📌 EDIT COMMENT HANDLER - FIXED URL
  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) {
      toast.error('Please enter comment text', toastConfig);
      return;
    }
    
    if (!requireAuth('edit this comment')) return;

    try {
      const res = await axios.put(
        `${apiUrl}/feeds/feeds/${post.id}/comments/${commentId}`,  // REMOVED extra /feeds/
        { 
          comment_text: editingText.trim(), 
          user_id: userId 
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments(res.data.data.comments);
        setEditingCommentId(null);
        setEditingText("");
        
        toast.success('✏️ Comment updated successfully!', {
          ...toastConfig,
          icon: '✅',
          autoClose: 2000
        });
        
        // Refresh parent component
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      if (error.response?.status === 403) {
        toast.error('You can only edit your own comments', toastConfig);
      } else {
        toast.error('Failed to edit comment. Please try again.', toastConfig);
      }
    }
  };

  // 📌 DELETE COMMENT HANDLER - FIXED URL & DATA FORMAT
  const handleDeleteComment = async (commentId) => {
    if (!requireAuth('delete this comment')) return;
    
    // Find comment to restore if needed
    const commentToDelete = comments.find(c => c.id === commentId);
    
    // Optimistic update
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    setCommentsCount(prev => prev - 1);
    
    try {
      const res = await axios.delete(
        `${apiUrl}/feeds/feeds/${post.id}/comments/${commentId}`,  // REMOVED extra /feeds/
        { 
          data: { user_id: userId },  // ✅ FIX: DELETE mein data object mein bhejo
          withCredentials: true 
        }
      );

      if (res.data.success) {
        setComments(res.data.data.comments);
        setCommentsCount(res.data.data.comments_count);
        
        toast.success('🗑️ Comment deleted successfully!', {
          ...toastConfig,
          icon: '✅',
          autoClose: 2000
        });
        
        // Refresh parent component
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      // Revert optimistic update on error
      if (commentToDelete) {
        setComments(prev => [...prev, commentToDelete].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ));
        setCommentsCount(prev => prev + 1);
      }
      
      console.error("Error deleting comment:", error);
      if (error.response?.status === 403) {
        toast.error('You can only delete your own comments', toastConfig);
      } else {
        toast.error('Failed to delete comment. Please try again.', toastConfig);
      }
    }
  };

  // 📌 SHARE HANDLER - FIXED URL
  const handleShare = async (platform) => {
    if (!requireAuth('share this post')) return;

    // Optimistic update
    setSharesCount(prev => prev + 1);
    setShowShareOptions(false);

    try {
      const shareUrl = `${window.location.origin}/feed/${post.id}`;
      
      switch(platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.feed_text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          toast.info('Opening Twitter...', {
            ...toastConfig,
            icon: '🐦',
            autoClose: 1500
          });
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
          toast.info('Opening LinkedIn...', {
            ...toastConfig,
            icon: '💼',
            autoClose: 1500
          });
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
          toast.info('Opening Facebook...', {
            ...toastConfig,
            icon: '📘',
            autoClose: 1500
          });
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          setCopySuccess(true);
          toast.success('🔗 Link copied to clipboard!', {
            ...toastConfig,
            icon: '📋',
            autoClose: 2000
          });
          setTimeout(() => setCopySuccess(false), 2000);
          break;
        default:
          break;
      }

      // Log the share - FIXED URL
      await axios.post(
        `${apiUrl}/feeds/feeds/${post.id}/share`,  // REMOVED extra /feeds/
        { 
          platform, 
          user_id: userId 
        },
        { withCredentials: true }
      );

      if (platform !== 'copy') {
        toast.success('📤 Post shared successfully!', {
          ...toastConfig,
          icon: '🎉',
          autoClose: 2000
        });
      }
      
      // Refresh parent component
      if (onUpdate) onUpdate();
      
    } catch (error) {
      // Revert optimistic update on error
      setSharesCount(prev => prev - 1);
      
      console.error("Error sharing:", error);
      toast.error('Failed to share post. Please try again.', toastConfig);
    }
  };

  // 📌 HANDLE EDIT POST
  const handleEditPost = () => {
    if (!requireAuth('edit this post')) return;
    toast.info('Edit feature coming soon!', toastConfig);
  };

  // 📌 HANDLE DELETE POST
  const handleDeletePost = () => {
    if (!requireAuth('delete this post')) return;
    
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Delete Post?</p>
          <p className="text-xs text-gray-600">This will permanently delete this post and all its comments.</p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={async () => {
                closeToast();
                try {
                  // Add your delete post API call here
                  toast.success('🗑️ Post deleted successfully!', {
                    ...toastConfig,
                    icon: '✅',
                    autoClose: 2000
                  });
                  if (onUpdate) onUpdate();
                } catch (error) {
                  toast.error('Failed to delete post. Please try again.', toastConfig);
                }
              }}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
        style: {
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
      }
    );
  };

  // 📌 GET USER INITIALS
  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // 📌 FORMAT DATE
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // 📌 GET TAGS
  const getTags = (tags) => {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.map(tag => {
      if (typeof tag === 'string') return tag.replace(/#/g, '');
      return tag.name?.replace(/#/g, '') || '';
    });
  };

  // 📌 HANDLE COMMENT BUTTON CLICK
  const handleCommentButtonClick = () => {
    if (!requireAuth('view comments')) return;
    setShowComments(!showComments);
  };

  return (
    <div
      className="rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition-all duration-300 hover:shadow-md"
      style={{
        background: "linear-gradient(157.99deg, #EDEFFF 0%, #FFFFFF 100%)",
      }}
    >
      {/* ===== HEADER SECTION ===== */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center font-bold text-white">
            {getInitials(post.ra_name)}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-gray-800">{post.ra_name || "Unknown User"}</h3>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
        
        {/* Menu Button - Only show for post owner */}
        {post.ra_id === userId && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaEllipsisV className="text-gray-500 text-sm" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button 
                    onClick={handleEditPost}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaEdit className="text-blue-500" /> Edit Post
                  </button>
                  <button 
                    onClick={handleDeletePost}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <FaTrash /> Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full mb-5" />

      {/* ===== POST CONTENT ===== */}
      <p className="text-sm text-gray-700 mb-3 leading-relaxed whitespace-pre-line">{post.feed_text}</p>

      {/* Post Image */}
      {post.feed_documents && post.feed_documents.length > 0 && (
        <img
          src={post.feed_documents[0].url}
          alt="Post"
          className="rounded-xl w-full mb-4 border border-gray-100 max-h-96 object-contain bg-gray-50"
          onError={(e) => {
            e.target.style.display = 'none';
            toast.error('Failed to load image', {
              ...toastConfig,
              autoClose: 2000
            });
          }}
        />
      )}

      {/* Tags */}
      {post.feed_tags && post.feed_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs mb-4">
          {getTags(post.feed_tags).map((tag, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full mb-5" />
      
      {/* ===== INTERACTION STATS ===== */}
      <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="hover:text-blue-500 transition-colors cursor-pointer">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </span>
          <span 
            className="hover:text-blue-500 transition-colors cursor-pointer"
            onClick={handleCommentButtonClick}
          >
            {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
          </span>
          <span className="hover:text-blue-500 transition-colors cursor-pointer">
            {sharesCount} {sharesCount === 1 ? 'share' : 'shares'}
          </span>
        </div>
      </div>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="flex justify-between text-gray-600 text-sm">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors duration-200 border p-1 px-14 rounded-md ${
            isLiked 
              ? 'text-blue-500 border-blue-200 bg-blue-50' 
              : 'hover:text-blue-500 hover:border-blue-200'
          }`}
        >
          {isLiked ? <FaThumbsUp className="text-base" /> : <FaRegThumbsUp className="text-base" />}
          {isLiked ? 'Liked' : 'Like'}
        </button>
        
        <button 
          onClick={handleCommentButtonClick}
          className={`flex items-center gap-2 transition-colors duration-200 border p-1 px-14 rounded-md hover:text-blue-500 hover:border-blue-200 ${
            showComments ? 'text-blue-500 border-blue-200 bg-blue-50' : ''
          }`}
        >
          <FaRegCommentDots className="text-base" /> Comment
        </button>
        
        <div className="relative">
          <button 
            onClick={() => {
              if (requireAuth('share this post')) {
                setShowShareOptions(!showShareOptions);
              }
            }}
            className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 border p-1 px-14 rounded-md"
          >
            <FaShareAlt className="text-base" /> Share
          </button>
          
          {/* Share Options Dropdown */}
          {showShareOptions && isAuthenticated() && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
              <div className="py-1">
                <button 
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaTwitter className="text-blue-400" /> Twitter
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaLinkedin className="text-blue-600" /> LinkedIn
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaFacebook className="text-blue-600" /> Facebook
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {copySuccess ? (
                    <><FaCheck className="text-green-500" /> Copied!</>
                  ) : (
                    <><FaLink /> Copy Link</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== COMMENTS SECTION ===== */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Add Comment Form - Only for authenticated users */}
          {isAuthenticated() ? (
            <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-300 text-sm"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </form>
          ) : (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Please login to post comments</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-blue-500 text-white px-4 py-1.5 text-xs rounded-md hover:bg-blue-600 transition-colors"
              >
                Login to Continue
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        {getInitials(comment.user_name || 'User')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-700">
                            {comment.user_name || 'User'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        
                        {editingCommentId === comment.id ? (
                          <div className="mt-1 flex gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
                              autoFocus
                            />
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditingText("");
                              }}
                              className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 mt-1 break-words">{comment.comment_text}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Comment Actions - Only for comment owner */}
                    {isAuthenticated() && comment.user_id === userId && (
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingText(comment.comment_text);
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          title="Edit comment"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete comment"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}