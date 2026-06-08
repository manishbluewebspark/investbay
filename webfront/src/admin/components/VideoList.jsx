import { useEffect, useState, useRef, useCallback } from "react";
import { FiPlay, FiX, FiVideo, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../admin/components/modals/DeleteModal";

export default function VideoList({ courseId, userId, API_URL }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [generatingThumbnails, setGeneratingThumbnails] = useState({});
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canvasRefs = useRef({});
  const videoElementsRef = useRef({});
  const videoPlayerRef = useRef(null);

  // Format duration accurately
  const formatDuration = (durationInSeconds) => {
    if (!durationInSeconds || durationInSeconds === 0) return "--:--";
    const totalSeconds = Math.floor(durationInSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      if (!courseId) {
        setError("Course ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Build URL based on whether userId is provided
        let url = `${API_URL}/videos/videos/course/${courseId}`;
        if (userId) {
          url += `/${userId}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          setVideos(data.data);
          setError("");
        } else {
          setError(data.message || "No videos found");
          setVideos([]);
        }
      } catch (err) {
        console.error("Fetch videos error:", err);
        setError("Failed to fetch videos");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [courseId, userId, API_URL]);

  useEffect(() => {
    if (videos.length === 0) return;

    const generateThumbnailsForVideos = () => {
      videos.forEach((video) => {
        if (!thumbnails[video.id] && !generatingThumbnails[video.id]) {
          setTimeout(() => {
            generateThumbnail(video.id, video.video_url);
          }, 100);
        }
      });
    };

    const timeoutId = setTimeout(generateThumbnailsForVideos, 500);
    return () => clearTimeout(timeoutId);
  }, [videos, thumbnails, generatingThumbnails]);

  const generateThumbnail = useCallback(
    (videoId, videoUrl) => {
      if (generatingThumbnails[videoId] || thumbnails[videoId]) {
        return;
      }

      setGeneratingThumbnails((prev) => ({ ...prev, [videoId]: true }));

      const canvas = canvasRefs.current[videoId];
      if (!canvas) {
        setTimeout(() => generateThumbnail(videoId, videoUrl), 200);
        return;
      }

      if (videoElementsRef.current[videoId]) {
        videoElementsRef.current[videoId].remove();
      }

      const video = document.createElement("video");
      videoElementsRef.current[videoId] = video;

      video.crossOrigin = "anonymous";
      video.muted = true;
      video.preload = "metadata";
      
      const fullVideoUrl = videoUrl.startsWith('http') ? videoUrl : `${API_URL}${videoUrl}`;
      video.src = fullVideoUrl;

      video.onloadedmetadata = () => {
        const targetTime = Math.min(video.duration * 0.1, 1);
        video.currentTime = targetTime;
      };

      video.onseeked = () => {
        if (canvas) {
          try {
            const ctx = canvas.getContext("2d");
            canvas.width = 320;
            canvas.height = 180;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.9);

            setThumbnails((prev) => ({
              ...prev,
              [videoId]: thumbnailDataUrl,
            }));

            video.remove();
            delete videoElementsRef.current[videoId];
            setGeneratingThumbnails((prev) => ({ ...prev, [videoId]: false }));
          } catch (error) {
            console.error("Error drawing thumbnail:", error);
            setGeneratingThumbnails((prev) => ({ ...prev, [videoId]: false }));
          }
        }
      };

      video.onerror = (e) => {
        console.error("Video error for thumbnail:", e);
        video.remove();
        delete videoElementsRef.current[videoId];
        setGeneratingThumbnails((prev) => ({ ...prev, [videoId]: false }));
      };

      setTimeout(() => {
        if (video && video.readyState < 2) {
          video.remove();
          delete videoElementsRef.current[videoId];
          setGeneratingThumbnails((prev) => ({ ...prev, [videoId]: false }));
        }
      }, 8000);
    },
    [thumbnails, generatingThumbnails, API_URL]
  );

  const handleVideoClick = (video) => {
    setActiveVideo(video);
  };

  const openDeleteModal = (videoId, e) => {
    e.stopPropagation();
    setVideoToDelete(videoId);
    setDeleteModalOpen(true);
  };

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      setDeleteLoading(true);
      const id = videoToDelete;

      const response = await fetch(`${API_URL}/videos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          userId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVideos(prev => prev.filter(video => video.id !== videoToDelete));

        setThumbnails(prev => {
          const newThumbnails = { ...prev };
          delete newThumbnails[videoToDelete];
          return newThumbnails;
        });

        setGeneratingThumbnails(prev => {
          const newGenerating = { ...prev };
          delete newGenerating[videoToDelete];
          return newGenerating;
        });

        if (activeVideo?.id === videoToDelete) {
          setActiveVideo(null);
        }

        toast.success("Video deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete video");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting video");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    }
  };

  const closeVideoModal = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
      videoPlayerRef.current.src = '';
    }
    setActiveVideo(null);
  };

  const VideoPlaceholder = ({ className = "" }) => (
    <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
      <div className="text-center">
        <FiVideo className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-xs">Loading thumbnail...</p>
      </div>
    </div>
  );

  if (loading) return <p className="p-6 text-gray-500">Loading videos...</p>;
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        {!userId && (
          <p className="text-gray-500 text-sm">Sign in to view course videos</p>
        )}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No videos available for this course</p>
        {!userId && (
          <p className="text-gray-400 text-sm mt-2">Sign in to access course videos</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const thumbnailSrc = thumbnails[video.id];
          const isGenerating = generatingThumbnails[video.id];

          return (
            <div
              key={video.id}
              className="relative group rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg bg-white border border-gray-100"
              onClick={() => handleVideoClick(video)}
              onMouseEnter={() => setHoveredVideoId(video.id)}
              onMouseLeave={() => setHoveredVideoId(null)}
            >
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <canvas
                  ref={(el) => {
                    if (el) {
                      canvasRefs.current[video.id] = el;
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                  width="320"
                  height="180"
                />

                {thumbnailSrc ? (
                  <img
                    src={thumbnailSrc}
                    alt={video.video_title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${!isGenerating ? "group-hover:scale-105" : ""
                      }`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <VideoPlaceholder className="absolute inset-0 w-full h-full" />
                )}

                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${hoveredVideoId === video.id ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <FiPlay className="w-6 h-6 text-gray-900 ml-1" />
                  </div>
                </div>

                {/* Only show delete button if userId exists (user is logged in) */}
                {userId && (
                  <div
                    className={`absolute top-3 right-3 transition-all duration-300 transform ${hoveredVideoId === video.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                  >
                    <button
                      onClick={(e) => openDeleteModal(video.id, e)}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-lg"
                      title="Delete video"
                    >
                      <FiTrash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-md text-xs text-white font-mono">
                  {formatDuration(video.video_duration)}
                </div>
              </div>

              <div className="p-3 bg-white">
                <h4 className="text-sm font-['Aileron_Black'] font-semibold text-gray-900 truncate">
                  {video.video_title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeVideoModal}
        >
          <div
            className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-['Aileron_Black'] font-bold text-gray-900 truncate">
                  {activeVideo.video_title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Duration: {formatDuration(activeVideo.video_duration)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Only show delete button in modal if userId exists */}
                {userId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(activeVideo.id, e);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500 hover:text-red-600"
                    title="Delete video"
                  >
                    <FiTrash2 size={20} />
                  </button>
                )}
                <button
                  onClick={closeVideoModal}
                  className="ml-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX size={24} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="relative bg-black flex-1 min-h-[500px]">
              <video
                ref={videoPlayerRef}
                key={activeVideo.id}
                src={activeVideo.video_url.startsWith('http') ? activeVideo.video_url : `${API_URL}${activeVideo.video_url}`}
                controls
                autoPlay
                className="w-full h-full object-contain"
                controlsList="nodownload"
                poster={thumbnails[activeVideo.id]}
              >
                <source src={activeVideo.video_url.startsWith('http') ? activeVideo.video_url : `${API_URL}${activeVideo.video_url}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {!thumbnails[activeVideo.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p className="text-white">Loading video...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVideoToDelete(null);
        }}
        onConfirm={handleDeleteVideo}
        loading={deleteLoading} 
        title="Delete Video?"
        description="This action will permanently remove the video and it will no longer be visible to users."
      />
    </div>
  );
}