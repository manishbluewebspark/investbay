// import { useEffect, useState } from "react";
// import {
//   FiPlay,
//   FiTrash2,
//   FiEdit,
//   FiCalendar,
//   FiEye,
//   FiDownload,
//   FiX
// } from "react-icons/fi";

// export default function VideoList({ courseId, userId, API_URL }) {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeVideo, setActiveVideo] = useState(null);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       if (!courseId || !userId) return;

//       try {
//         setLoading(true);
//         const res = await fetch(
//           `${API_URL}/videos/videos/course/${courseId}/${userId}`
//         );
//         const data = await res.json();

//         if (data.success) {
//           setVideos(data.data);
//         } else {
//           setError(data.message || "No videos found");
//         }
//       } catch (err) {
//         setError("Failed to fetch videos");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, [courseId, userId, API_URL]);

//   if (loading) return <p className="p-6">Loading videos...</p>;

//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
//         {videos.map((video) => (
//           <div
//             key={video.id}
//             className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all w-full max-w-sm"
//           >
//             {/* VIDEO THUMBNAIL - CENTERED & REDUCED HEIGHT */}
//             <div className="relative h-32 bg-black overflow-hidden flex items-center justify-center">
//               <video
//                 src={`{video.videoUrl}`}
//                 className="w-full h-full object-cover"
//                 muted
//                 preload="metadata"
//               />
//               <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
//                 <FiPlay className="w-12 h-12 text-white opacity-90" />
//               </div>
//               <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
//                 {video.videoDuration
//                   ? `${video.videoDuration}:00`
//                   : "00:00"}
//               </div>
//             </div>

//             {/* INFO */}
//             <div className="p-4">
//               <div className="flex justify-between mb-2">
//                 <h4 className="font-bold text-sm line-clamp-2 flex-1 pr-2">
//                   {video.videoTitle}
//                 </h4>
//                 <div className="flex gap-1 flex-shrink-0">
//                   <button className=" text-indigo-600 hover:bg-indigo-100 rounded p-1 transition-colors">
//                     <FiEdit size={14} />
//                   </button>
//                   <button className=" text-red-600 hover:bg-red-100 rounded p-1 transition-colors">
//                     <FiTrash2 size={14} />
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
//                 <div className="flex items-center gap-1">
//                   <FiCalendar size={12} />
//                   {new Date(video.createdAt).toLocaleDateString()}
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <FiEye size={12} /> 0
//                   <FiDownload size={12} /> 0
//                 </div>
//               </div>

//               <div className="mt-4 grid grid-cols-2 gap-2">
//                 <button
//                   onClick={() => setActiveVideo(video)}
//                   className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-all font-medium"
//                 >
//                   <FiPlay size={14} /> Play
//                 </button>
//                 <a
//                   href={`${API_URL}${video.videoUrl}`}
//                   download
//                   className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-all font-medium"
//                 >
//                   <FiDownload size={14} /> Download
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* FIXED VIDEO PLAYER MODAL - RESPONSIVE & BETTER POSITIONING */}
//       {activeVideo && (
//         <div 
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
//           onClick={() => setActiveVideo(null)}
//         >
//           <div 
//             className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* HEADER WITH CLOSE BUTTON */}
//             <div className="p-6 pb-2 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold text-gray-900">
//                   {activeVideo.videoTitle}
//                 </h3>
//                 <button
//                   onClick={() => setActiveVideo(null)}
//                   className="p-2 hover:bg-gray-100 rounded-xl transition-all group"
//                   aria-label="Close video"
//                 >
//                   <FiX className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
//                 </button>
//               </div>
//             </div>

//             {/* VIDEO PLAYER */}
//             <div className="relative">
//               <video
//                 src={`${activeVideo.videoUrl}`}
//                 controls
//                 autoPlay
//                 className="w-full h-96 md:h-[500px] object-contain bg-black rounded-b-2xl"
//               />
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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

  useEffect(() => {
    const fetchVideos = async () => {
      if (!courseId || !userId) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${API_URL}/videos/videos/course/${courseId}/${userId}`
        );
        const data = await res.json();
        if (data.success) {
          setVideos(data.data);
        } else {
          setError(data.message || "No videos found");
        }
      } catch (err) {
        setError("Failed to fetch videos");
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
            generateThumbnail(video.id, video.videoUrl);
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
      video.src = `${videoUrl}`;

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

      video.onerror = () => {
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
      }, 5000);
    },
    [thumbnails, generatingThumbnails]
  );

  const handleVideoClick = (video) => {
    if (!thumbnails[video.id] && !generatingThumbnails[video.id]) {
      generateThumbnail(video.id, video.video_url);
    }
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
    setDeleteLoading(true)
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

    // 🔥 FIX HERE
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


  const VideoPlaceholder = ({ className = "" }) => (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gray-900 to-black ${className}`}>
      <div className="text-center">
        <FiVideo className="w-10 h-10 text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500 text-xs">Loading thumbnail...</p>
      </div>
    </div>
  );

  if (loading) return <p className="p-6">Loading videos...</p>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const thumbnailSrc = thumbnails[video.id];
          const isGenerating = generatingThumbnails[video.id];

          return (
            <div
              key={video.id}
              className="relative group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
              onClick={() => handleVideoClick(video)}
              onMouseEnter={() => setHoveredVideoId(video.id)}
              onMouseLeave={() => setHoveredVideoId(null)}
            >
              <div className="relative h-44 w-full overflow-hidden">
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
                    className={`absolute inset-0 w-full h-full object-fill transition-transform duration-500 ${!isGenerating ? "group-hover:scale-105" : ""
                      }`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.querySelector('.video-placeholder')?.classList.remove('hidden');
                    }}
                  />
                ) : null}

                {!thumbnailSrc && (
                  <VideoPlaceholder className="absolute inset-0 w-full h-full" />
                )}

                {/* Delete Button - Appears on hover at top right */}
                <div
                  className={`absolute top-3 right-3 transition-all duration-300 transform ${hoveredVideoId === video.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                >
                  <button
                    onClick={(e) => openDeleteModal(video.id, e)}
                    className="p-2 rounded-full backdrop-blur-lg bg-gray-600/90 hover:bg-gray-700 transition-colors shadow-lg"
                    title="Delete video"
                  >
                    <FiTrash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 p-3 backdrop-blur-2xl bg-opacity-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {video.video_title}
                    </h4>
                    <p className="text-xs text-white mt-1">
                      {video.video_duration || 0} min
                    </p>
                  </div>
                  <button className="ml-2 p-2 rounded-full backdrop-blur-sm bg-black/40 transition-colors cursor-pointer">
                    <FiPlay className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">
                  {activeVideo.video_title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Duration: {activeVideo.video_duration || 0} minutes
                </p>
              </div>

              {/* Delete button in modal */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => openDeleteModal(activeVideo.id, e)}
                  className="p-2 rounded-lg hover:bg-red-900/30 transition-colors text-red-400 hover:text-red-300"
                  title="Delete video"
                >
                  <FiTrash2 size={20} />
                </button>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="ml-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiX size={24} className="text-gray-300" />
                </button>
              </div>
            </div>
            <div className="relative bg-black">
              <video
                key={activeVideo.id}
                src={`${activeVideo.video_url}`}
                controls
                autoPlay
                className="w-full h-[70vh] object-contain"
                controlsList="nodownload"
                poster={thumbnails[activeVideo.id]}
              >
                Your browser does not support the video tag.
              </video>

              {!thumbnails[activeVideo.id] && (
                <VideoPlaceholder className="absolute inset-0 w-full h-full" />
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