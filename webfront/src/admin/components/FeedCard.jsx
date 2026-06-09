// FeedCard.jsx
import { FiMoreVertical, FiThumbsUp, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronUp, FiSend, FiFile } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/modals/DeleteModal";
import EditFeedModal from "../components/modals/EditFeedModal";
import axios from "axios";
import { FaThumbsUp as FaThumbsUpSolid } from "react-icons/fa";

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
      <div className="relative group">
        {/* Clean white card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          
          {/* Header */}
          <div className="flex justify-between items-start p-4">
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="relative">
                {feed.ra_avatar ? (
                  <img
                    src={feed.ra_avatar}
                    alt={feed.ra_name}
                    className="relative w-10 h-10 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`${feed.ra_avatar ? 'hidden' : 'flex'} fallback-avatar relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                  {getUserInitials()}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 hover:text-gray-700 cursor-pointer transition-colors">
                  {feed.ra_name || "Unknown User"}
                </h4>
                <p className="text-xs text-gray-400">
                  {formatDate(feed.created_at || feed.updated_at)}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <FiMoreVertical className="text-gray-400 hover:text-gray-600" size={16} />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1">
                  <button
                    onClick={handleView}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FiEye size={14} />
                    <span>View post</span>
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FiEdit size={14} />
                    <span>Edit post</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <FiTrash2 size={14} />
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
                className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words ${
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
                  className="flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <FiChevronUp size={12} />
                      Show less
                    </>
                  ) : (
                    <>
                      <FiChevronDown size={12} />
                      Read more
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Documents/Media */}
          {documents.length > 0 && (
            <div className="mt-2 px-4 pb-3">
              <div className={`grid ${documents.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                {documents.map((doc, index) => {
                  const src = getDocumentSource(doc);
                  const isImage = isImageDocument(doc);
                  const isVideo = isVideoDocument(doc);

                  if (!src) return null;

                  return (
                    <div 
                      key={index} 
                      className={`relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 ${
                        documents.length === 1 ? 'w-full' : ''
                      } group/media`}
                    >
                      {isImage ? (
                        <img
                          src={src}
                          alt={doc.originalName || `Media ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover/media:scale-105 cursor-pointer"
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
                          className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-lg"
                        >
                          <div className="p-2 bg-gray-200 rounded-lg">
                            <FiFile className="text-gray-600" size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
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
            <div className="px-4 mt-1 pb-2 flex flex-wrap gap-1.5">
              {tags.slice(0, 5).map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 px-2 py-0.5 rounded-full transition-all duration-200 cursor-pointer"
                >
                  #{tag.replace(/^#+/, '')}
                </span>
              ))}
              {tags.length > 5 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  +{tags.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Stats Bar */}
          <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            {likeCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaThumbsUpSolid className="text-white" size={7} />
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
          <div className="grid grid-cols-3 border-t border-gray-100">
            {/* Like Button */}
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
                isLiked 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isLiked ? (
                <FaThumbsUpSolid size={14} />
              ) : (
                <FiThumbsUp size={14} />
              )}
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
            
            {/* Comment Button */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
                showComments 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiMessageSquare size={14} />
              <span>Comment</span>
            </button>
            
            {/* Share Button */}
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <FiShare2 size={14} />
              <span>Share</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-3 mb-4">
                <div className="flex-shrink-0">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
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
                    className="w-full px-4 py-2 pr-20 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
                  >
                    <FiSend size={10} />
                    Post
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        {comment.user_avatar ? (
                          <img
                            src={comment.user_avatar}
                            alt={comment.user_name}
                            className="w-7 h-7 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-semibold text-xs">
                            {comment.user_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-xs font-semibold text-gray-900">
                              {comment.user_name || 'User'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-line break-words">
                            {comment.comment_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2">
                      <FiMessageSquare className="text-gray-400" size={16} />
                    </div>
                    <p className="text-gray-500 text-xs">No comments yet. Be the first!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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