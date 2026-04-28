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
  FaCheck,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostCard({ post: initialPost, onUpdate }) {
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost.is_liked_by_user || false);
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;
  const apiUrl = import.meta.env.VITE_API_URL;

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  const isAuthenticated = () => {
    const user = localStorage.getItem("user");
    return user && JSON.parse(user).id;
  };

  const requireAuth = (action) => {
    if (!isAuthenticated()) {
      toast.warning(`🔐 Please login to ${action}`, {
        ...toastConfig,
        autoClose: 4000,
        theme: "light",
        icon: "🔒",
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    setComments(initialPost.comments || []);
    setIsLiked(initialPost.is_liked_by_user || false);
    setLikesCount(initialPost.feed_like_count || 0);
    setCommentsCount(initialPost.feed_comment_count || 0);
    setSharesCount(initialPost.feed_share_count || 0);
    setPost(initialPost);
    setIsExpanded(false);
    setShowComments(false);
    setShowMenu(false);
    setShowShareOptions(false);
  }, [initialPost]);

  const handleLike = async () => {
    if (!requireAuth("like this post")) return;

    const wasLiked = isLiked;
    const previousLikes = likesCount;

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

        toast.success(res.data.data.liked ? "Post liked!" : "Post unliked!", {
          ...toastConfig,
          icon: res.data.data.liked ? "👍" : "👎",
          theme: "dark",
          autoClose: 2000,
        });

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      setIsLiked(wasLiked);
      setLikesCount(previousLikes);
      console.error("Error toggling like:", error);
      toast.error("Failed to like post. Please try again.", toastConfig);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Please enter a comment", toastConfig);
      return;
    }

    if (!requireAuth("comment on this post")) return;

    const commentText = newComment.trim();
    setNewComment("");

    try {
      const res = await axios.post(
        `${apiUrl}/feeds/feeds/${post.id}/comments`,
        {
          comment_text: commentText,
          user_id: userId,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments(res.data.data.comments || []);
        setCommentsCount(res.data.data.comments_count || 0);

        toast.success("💬 Comment added successfully!", {
          ...toastConfig,
          icon: "✅",
          autoClose: 2000,
        });

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      setNewComment(commentText);
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.", toastConfig);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) {
      toast.error("Please enter comment text", toastConfig);
      return;
    }

    if (!requireAuth("edit this comment")) return;

    try {
      const res = await axios.put(
        `${apiUrl}/feeds/feeds/${post.id}/comments/${commentId}`,
        {
          comment_text: editingText.trim(),
          user_id: userId,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setComments(res.data.data.comments || []);
        setEditingCommentId(null);
        setEditingText("");

        toast.success("✏️ Comment updated successfully!", {
          ...toastConfig,
          icon: "✅",
          autoClose: 2000,
        });

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      if (error.response?.status === 403) {
        toast.error("You can only edit your own comments", toastConfig);
      } else {
        toast.error("Failed to edit comment. Please try again.", toastConfig);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!requireAuth("delete this comment")) return;

    const commentToDelete = comments.find((c) => c.id === commentId);
    const updatedComments = comments.filter((c) => c.id !== commentId);

    setComments(updatedComments);
    setCommentsCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await axios.delete(
        `${apiUrl}/feeds/feeds/${post.id}/comments/${commentId}`,
        {
          data: { user_id: userId },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setComments(res.data.data.comments || []);
        setCommentsCount(res.data.data.comments_count || 0);

        toast.success("🗑️ Comment deleted successfully!", {
          ...toastConfig,
          icon: "✅",
          autoClose: 2000,
        });

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      if (commentToDelete) {
        setComments((prev) =>
          [...prev, commentToDelete].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
        setCommentsCount((prev) => prev + 1);
      }

      console.error("Error deleting comment:", error);
      if (error.response?.status === 403) {
        toast.error("You can only delete your own comments", toastConfig);
      } else {
        toast.error("Failed to delete comment. Please try again.", toastConfig);
      }
    }
  };

  const handleShare = async (platform) => {
    if (!requireAuth("share this post")) return;

    setSharesCount((prev) => prev + 1);
    setShowShareOptions(false);

    try {
      const shareUrl = `${window.location.origin}/feed-view/${post.id}`;

      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              post.feed_text || ""
            )}&url=${encodeURIComponent(shareUrl)}`,
            "_blank"
          );
          toast.info("Opening Twitter...", {
            ...toastConfig,
            icon: "🐦",
            autoClose: 1500,
          });
          break;

        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`,
            "_blank"
          );
          toast.info("Opening LinkedIn...", {
            ...toastConfig,
            icon: "💼",
            autoClose: 1500,
          });
          break;

        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`,
            "_blank"
          );
          toast.info("Opening Facebook...", {
            ...toastConfig,
            icon: "📘",
            autoClose: 1500,
          });
          break;

        case "copy":
          await navigator.clipboard.writeText(shareUrl);
          setCopySuccess(true);
          toast.success("🔗 Link copied to clipboard!", {
            ...toastConfig,
            icon: "📋",
            autoClose: 2000,
          });
          setTimeout(() => setCopySuccess(false), 2000);
          break;

        default:
          break;
      }

      await axios.post(
        `${apiUrl}/feeds/feeds/${post.id}/share`,
        {
          platform,
          user_id: userId,
        },
        { withCredentials: true }
      );

      if (platform !== "copy") {
        toast.success("📤 Post shared successfully!", {
          ...toastConfig,
          icon: "🎉",
          autoClose: 2000,
        });
      }

      if (onUpdate) onUpdate();
    } catch (error) {
      setSharesCount((prev) => Math.max(0, prev - 1));
      console.error("Error sharing:", error);
      toast.error("Failed to share post. Please try again.", toastConfig);
    }
  };

  const handleEditPost = () => {
    if (!requireAuth("edit this post")) return;
    toast.info("Edit feature coming soon!", toastConfig);
  };

  const handleDeletePost = () => {
    if (!requireAuth("delete this post")) return;

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="text-md font-semibold">Delete Post?</p>
          <p className="text-xs text-gray-600">
            This will permanently delete this post and all its comments.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={async () => {
                closeToast();
                try {
                  toast.success("🗑️ Post deleted successfully!", {
                    ...toastConfig,
                    icon: "✅",
                    autoClose: 2000,
                  });
                  if (onUpdate) onUpdate();
                } catch (error) {
                  toast.error("Failed to delete post. Please try again.", toastConfig);
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
          background: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    if (nameParts.length > 1) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTags = (tags) => {
    if (!tags || !Array.isArray(tags)) return [];
    return tags
      .map((tag) => {
        if (typeof tag === "string") return tag.replace(/#/g, "");
        return tag?.name?.replace(/#/g, "") || "";
      })
      .filter(Boolean);
  };

  const handleCommentButtonClick = () => {
    if (!requireAuth("view comments")) return;
    setShowComments((prev) => !prev);
  };

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const postTags = getTags(post.feed_tags || []);
  const postImage = post.feed_documents?.[0]?.url;
  const postText = post.feed_text || "";
  const shouldShowReadMore = postText.length > 180;

  return (
    <div className="max-w-full mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center font-bold text-white text-md flex-shrink-0">
              {getInitials(post.ra_name)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-md font-semibold text-gray-900 leading-tight">
                  {post.ra_name || "Unknown User"}
                </h3>
                <span className="text-[11px] text-blue-600 font-medium">
                  • Follow
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {post.ra_role || "Research Analyst"} · {formatDate(post.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {post.ra_id === userId && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaEllipsisV className="text-gray-500 text-xs" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-20 border border-gray-200 overflow-hidden">
                    <button
                      onClick={handleEditPost}
                      className="flex items-center gap-2 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <FaEdit className="text-blue-500" />
                      Edit Post
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="flex items-center gap-2 px-4 py-2.5 text-md text-red-600 hover:bg-gray-50 w-full text-left"
                    >
                      <FaTrash />
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p
          className={`text-[13px] sm:text-md text-gray-700 mt-4 leading-6 whitespace-pre-line ${
            !isExpanded ? "line-clamp-4" : ""
          }`}
        >
          {postText}
        </p>

        {shouldShowReadMore && (
          <button
            type="button"
            className="text-[13px] text-blue-600 font-medium mt-1 hover:underline"
            onClick={toggleReadMore}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-100">
            Support {likesCount.toLocaleString()}
          </span>
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs border border-red-100">
            Resistance {commentsCount.toLocaleString()}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-100">
            Target {sharesCount.toLocaleString()}
          </span>
        </div>

        {postImage && (
          <div className="mt-4">
            <img
              src={postImage}
              alt="Post"
              className="w-full h-[280px] sm:h-[340px] object-cover rounded-2xl bg-gray-50 border border-gray-100"
              onError={(e) => {
                e.target.style.display = "none";
                toast.error("Failed to load image", {
                  ...toastConfig,
                  autoClose: 2000,
                });
              }}
            />
          </div>
        )}

        {postTags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {postTags.map((tag, i) => (
              <span
                key={i}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-4 sm:px-5 py-3">
        <div className="flex items-center justify-between text-gray-500">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-md transition-colors ${
              isLiked ? "text-blue-600" : "hover:text-blue-600"
            }`}
          >
            {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleCommentButtonClick}
            className={`flex items-center gap-2 text-md transition-colors ${
              showComments ? "text-blue-600" : "hover:text-blue-600"
            }`}
          >
            <FaRegCommentDots />
            <span>{commentsCount}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                if (requireAuth("share this post")) {
                  setShowShareOptions((prev) => !prev);
                }
              }}
              className="flex items-center gap-2 text-md hover:text-blue-600 transition-colors"
            >
              <FaShareAlt />
              <span>{sharesCount}</span>
            </button>

            {showShareOptions && isAuthenticated() && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-lg z-20 border border-gray-200 overflow-hidden">
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center gap-2 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <FaTwitter className="text-blue-400" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center gap-2 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <FaLinkedin className="text-blue-600" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center gap-2 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <FaFacebook className="text-blue-600" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="flex items-center gap-2 px-4 py-2.5 text-md text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  {copySuccess ? (
                    <>
                      <FaCheck className="text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FaLink />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-100 px-4 sm:px-5 py-4 bg-gray-50/40">
          {isAuthenticated() ? (
            <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-300 text-md bg-white"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white text-md rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </form>
          ) : (
            <div className="mb-4 p-3 bg-white rounded-xl text-center border border-gray-200">
              <p className="text-md text-gray-600 mb-2">Please login to post comments</p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-blue-500 text-white px-4 py-1.5 text-xs rounded-md hover:bg-blue-600 transition-colors"
              >
                Login to Continue
              </button>
            </div>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        {getInitials(comment.user_name || "User")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-800">
                            {comment.user_name || "User"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>

                        {editingCommentId === comment.id ? (
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="flex-1 px-2 py-1 text-md border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleEditComment(comment.id)}
                              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              type="button"
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
                          <p className="text-md text-gray-600 mt-1 break-words">
                            {comment.comment_text}
                          </p>
                        )}
                      </div>
                    </div>

                    {isAuthenticated() && comment.user_id === userId && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
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
                          type="button"
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
              <p className="text-center text-gray-400 text-md py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}