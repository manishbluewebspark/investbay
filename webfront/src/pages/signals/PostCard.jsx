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
    theme: "dark",
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
    <div className="group/card relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      <div className="p-5 pb-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {getInitials(post.ra_name)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#f0f4f8] truncate">
                  {post.ra_name || "Unknown User"}
                </h3>
                <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {post.ra_role || "Research Analyst"} · {formatDate(post.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/[0.05] rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </button>

            {showMenu && (
              <div className="absolute right-4 top-12 w-44 bg-[#0a0f16] backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl z-20 overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] w-full text-left">
                  <Edit3 className="w-4 h-4" /> Edit Post
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/[0.05] w-full text-left">
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <p className={`text-sm text-slate-300 leading-relaxed ${!isExpanded ? "line-clamp-4" : ""}`}>
          {postText}
        </p>

        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-emerald-400 font-medium mt-1 hover:text-emerald-300 transition-colors"
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
              className="w-full h-64 object-cover rounded-xl bg-white/[0.02] border border-white/[0.05]"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-white/[0.05] mt-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${
              isLiked ? "text-red-400" : "text-slate-500 hover:text-red-400"
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
              showComments ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"
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
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors duration-300"
            >
              <Share2 className="w-4 h-4" />
              <span>{sharesCount}</span>
            </button>

            {showShareOptions && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#0a0f16] backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl z-20 overflow-hidden">
                {[
                  { icon: Twitter, label: "Twitter", action: "twitter" },
                  { icon: Linkedin, label: "LinkedIn", action: "linkedin" },
                  { icon: Facebook, label: "Facebook", action: "facebook" },
                  { icon: copySuccess ? Check : Link2, label: copySuccess ? "Copied!" : "Copy Link", action: "copy" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleShare(item.action)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] w-full text-left"
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
              isSaved ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-white/[0.05] px-5 py-4 bg-white/[0.01]">
          {userId ? (
            <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </form>
          ) : (
            <div className="mb-4 p-3 bg-white/[0.02] rounded-xl text-center border border-white/[0.05]">
              <p className="text-sm text-slate-400">Please login to comment</p>
            </div>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {getInitials(comment.user_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-300">
                          {comment.user_name || "User"}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{comment.comment_text}</p>
                    </div>
                    {comment.user_id === userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm py-4">
                No comments yet. Be the first!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}