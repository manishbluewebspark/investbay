import React, { useState, useEffect } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Edit3, Trash2, Twitter, Linkedin, Facebook, Link2, Check, BadgeCheck
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostCard({ post: initialPost, onUpdate, userId }) {
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost.is_liked_by_user || false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(initialPost.feed_like_count || 0);
  const [commentsCount, setCommentsCount] = useState(initialPost.feed_comment_count || 0);
  const [sharesCount, setSharesCount] = useState(initialPost.feed_share_count || 0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(initialPost.comments || []);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  useEffect(() => {
    setComments(initialPost.comments || []);
    setIsLiked(initialPost.is_liked_by_user || false);
    setLikesCount(initialPost.feed_like_count || 0);
    setCommentsCount(initialPost.feed_comment_count || 0);
    setSharesCount(initialPost.feed_share_count || 0);
    setPost(initialPost);
  }, [initialPost]);

  const handleLike = async () => {
    if (!userId) {
      toast.warning("Please login to like this post", toastConfig);
      return;
    }

    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const res = await axios.post(
        `${apiUrl}/feeds/feeds/${post.id}/like`,
        { user_id: userId },
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsLiked(res.data.data.liked);
        setLikesCount(res.data.data.likes_count);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      setIsLiked(wasLiked);
      setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!userId) {
      toast.warning("Please login to comment", toastConfig);
      return;
    }

    const commentText = newComment.trim();
    setNewComment("");

    try {
      const res = await axios.post(
        `${apiUrl}/feeds/feeds/${post.id}/comments`,
        { comment_text: commentText, user_id: userId },
        { withCredentials: true }
      );
      if (res.data.success) {
        setComments(res.data.data.comments || []);
        setCommentsCount(res.data.data.comments_count || 0);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      setNewComment(commentText);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!userId) return;
    
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
    setCommentsCount((prev) => Math.max(0, prev - 1));

    try {
      await axios.delete(`${apiUrl}/feeds/feeds/${post.id}/comments/${commentId}`, {
        data: { user_id: userId },
        withCredentials: true,
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      setComments(comments);
      setCommentsCount((prev) => prev + 1);
    }
  };

  const handleShare = async (platform) => {
    if (!userId) {
      toast.warning("Please login to share", toastConfig);
      return;
    }

    setSharesCount((prev) => prev + 1);
    setShowShareOptions(false);

    try {
      const shareUrl = `${window.location.origin}/feed-view/${post.id}`;
      
      switch (platform) {
        case "copy":
          await navigator.clipboard.writeText(shareUrl);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
          break;
        default:
          break;
      }

      await axios.post(`${apiUrl}/feeds/feeds/${post.id}/share`, {
        platform, user_id: userId,
      }, { withCredentials: true });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      setSharesCount((prev) => Math.max(0, prev - 1));
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1 
      ? (parts[0][0] + parts[1][0]).toUpperCase() 
      : name[0].toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const postText = post.feed_text || "";
  const postImage = post.feed_documents?.[0]?.url;
  const shouldShowReadMore = postText.length > 180;

  return (
    <div className="group/card relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200 shadow-sm">
      <div className="p-5 pb-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-sm font-['Aileron_Black'] font-bold text-white flex-shrink-0">
              {getInitials(post.ra_name)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-['Aileron_Black'] font-bold text-gray-900 truncate">
                  {post.ra_name || "Unknown User"}
                </h3>
                <BadgeCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {post.ra_role || "Research Analyst"} · {formatDate(post.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-4 top-12 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                  <Edit3 className="w-4 h-4" /> Edit Post
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 w-full text-left">
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <p className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? "line-clamp-4" : ""}`}>
          {postText}
        </p>

        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-green-600 font-medium mt-1 hover:text-green-700 transition-colors"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Image */}
        {postImage && (
          <div className="mt-4">
            <img
              src={postImage}
              alt="Post"
              className="w-full h-64 object-cover rounded-xl bg-gray-50 border border-gray-100"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-gray-100 mt-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => {
              if (!userId) { toast.warning("Please login to view comments", toastConfig); return; }
              setShowComments(!showComments);
            }}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-300 ${
              showComments ? "text-green-600" : "text-gray-500 hover:text-green-600"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsCount}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                if (!userId) { toast.warning("Please login to share", toastConfig); return; }
                setShowShareOptions(!showShareOptions);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors duration-300"
            >
              <Share2 className="w-4 h-4" />
              <span>{sharesCount}</span>
            </button>

            {showShareOptions && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                {[
                  { icon: Twitter, label: "Twitter", action: "twitter" },
                  { icon: Linkedin, label: "LinkedIn", action: "linkedin" },
                  { icon: Facebook, label: "Facebook", action: "facebook" },
                  { icon: copySuccess ? Check : Link2, label: copySuccess ? "Copied!" : "Copy Link", action: "copy" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleShare(item.action)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <item.icon className="w-4 h-4" /> {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`transition-all duration-300 ${
              isSaved ? "text-green-600" : "text-gray-500 hover:text-green-600"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
          {userId ? (
            <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-['Aileron_Black'] font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </form>
          ) : (
            <div className="mb-4 p-3 bg-white rounded-xl text-center border border-gray-100">
              <p className="text-sm text-gray-500">Please login to comment</p>
            </div>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white border border-gray-100 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-xs font-['Aileron_Black'] font-bold text-white flex-shrink-0">
                      {getInitials(comment.user_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-['Aileron_Black'] font-semibold text-gray-800">
                          {comment.user_name || "User"}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{comment.comment_text}</p>
                    </div>
                    {comment.user_id === userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">
                No comments yet. Be the first!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles for Comments */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }
      `}</style>
    </div>
  );
}