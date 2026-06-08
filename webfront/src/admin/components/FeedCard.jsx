import { FiMoreVertical, FiThumbsUp, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronUp, FiSend, FiPaperclip, FiImage, FiFile } from "react-icons/fi";
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
      <div className="relative group">
        {/* Glass morphism card with backdrop blur */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-glow">
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="relative flex justify-between items-start p-5">
            <div className="flex gap-3">
              {/* Avatar with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md group-hover:blur-lg transition-all duration-300" />
                {feed.ra_avatar ? (
                  <img
                    src={feed.ra_avatar}
                    alt={feed.ra_name}
                    className="relative w-11 h-11 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`${feed.ra_avatar ? 'hidden' : 'flex'} fallback-avatar relative w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 items-center justify-center text-white font-semibold text-md shadow-lg`}>
                  {getUserInitials()}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-white/90 hover:text-white cursor-pointer transition-colors">
                  {feed.ra_name || "Unknown User"}
                </h4>
                <p className="text-xs text-white/40">
                  {formatDate(feed.created_at || feed.updated_at)}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <FiMoreVertical className="text-white/50 hover:text-white/80" size={18} />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0a1017]/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl z-20 py-1">
                  <button
                    onClick={handleView}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <FiEye size={16} />
                    <span>View post</span>
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <FiEdit size={16} />
                    <span>Edit post</span>
                  </button>
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <FiTrash2 size={16} />
                    <span>Delete post</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Feed Text */}
          {feed.feed_text && (
            <div className="relative px-5 pb-3">
              <div
                ref={textRef}
                className={`text-[15px] text-white/70 leading-relaxed whitespace-pre-line break-words ${
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
                  className="flex items-center gap-1 mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <FiChevronUp size={14} />
                      Show less
                    </>
                  ) : (
                    <>
                      <FiChevronDown size={14} />
                      Read more
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Documents/Media */}
          {documents.length > 0 && (
            <div className="relative mt-3 px-5 pb-3">
              <div className={`grid ${documents.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                {documents.map((doc, index) => {
                  const src = getDocumentSource(doc);
                  const isImage = isImageDocument(doc);
                  const isVideo = isVideoDocument(doc);

                  if (!src) return null;

                  return (
                    <div 
                      key={index} 
                      className={`relative rounded-xl overflow-hidden bg-black/30 border border-white/10 ${
                        documents.length === 1 ? 'w-full' : ''
                      } group/media`}
                    >
                      {isImage ? (
                        <img
                          src={src}
                          alt={doc.originalName || `Media ${index + 1}`}
                          className="w-full h-52 object-cover transition-transform duration-500 group-hover/media:scale-105 cursor-pointer"
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
                          className="w-full h-52 object-cover"
                        />
                      ) : (
                        <a
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 transition-all duration-200 rounded-lg border border-white/10"
                        >
                          <div className="p-2 bg-white/10 rounded-lg">
                            <FiFile className="text-white/60" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/80 truncate">
                              {doc.originalName || doc.filename || `Document ${index + 1}`}
                            </p>
                            <p className="text-xs text-white/40">
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
            <div className="relative px-5 mt-2 pb-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 5).map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-white/5 hover:bg-white/10 text-cyan-300 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer border border-white/5"
                >
                  #{tag.replace(/^#+/, '')}
                </span>
              ))}
              {tags.length > 5 && (
                <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full border border-white/5">
                  +{tags.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Stats Bar */}
          <div className="relative px-5 py-2 border-t border-white/10 flex items-center gap-4 text-xs text-white/40">
            {likeCount > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-glow-sm">
                    <FaThumbsUp className="text-white" size={9} />
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
          <div className="relative grid grid-cols-3 border-t border-white/10">
            {/* Like Button */}
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all duration-200 ${
                isLiked 
                  ? 'text-blue-400 bg-blue-500/5' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {isLiked ? (
                <FaThumbsUp className="text-blue-400" size={15} />
              ) : (
                <FiThumbsUp size={15} />
              )}
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
            
            {/* Comment Button */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all duration-200 ${
                showComments 
                  ? 'text-blue-400 bg-blue-500/5' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <FiMessageSquare size={15} />
              <span>Comment</span>
            </button>
            
            {/* Share Button */}
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-white/50 hover:text-white/80 transition-all duration-200 hover:bg-white/5"
            >
              <FiShare2 size={15} />
              <span>Share</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="relative border-t border-white/10 bg-black/30 backdrop-blur-sm px-5 py-4">
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-3 mb-5">
                <div className="flex-shrink-0">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs shadow-lg">
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
                    className="w-full px-4 py-2.5 pr-20 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white/80 placeholder-white/30"
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 shadow-glow-sm"
                  >
                    <FiSend size={12} />
                    Post
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        {comment.user_avatar ? (
                          <img
                            src={comment.user_avatar}
                            alt={comment.user_name}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold text-xs">
                            {comment.user_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white/5 rounded-2xl px-4 py-2.5 border border-white/10">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-xs font-semibold text-white/80">
                              {comment.user_name || 'User'}
                            </span>
                            <span className="text-xs text-white/30">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 whitespace-pre-line break-words">
                            {comment.comment_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-full mb-3 border border-white/10">
                      <FaRegComment className="text-white/30" size={20} />
                    </div>
                    <p className="text-white/40 text-sm">
                      No comments yet. Be the first to comment!
                    </p>
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