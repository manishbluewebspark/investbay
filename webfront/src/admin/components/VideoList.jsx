import { useEffect, useState } from "react";
import {
  FiPlay,
  FiTrash2,
  FiEdit,
  FiCalendar,
  FiEye,
  FiDownload,
  FiX
} from "react-icons/fi";

export default function VideoList({ courseId, userId, API_URL }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

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

  if (loading) return <p className="p-6">Loading videos...</p>;

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all w-full max-w-sm"
          >
            {/* VIDEO THUMBNAIL - CENTERED & REDUCED HEIGHT */}
            <div className="relative h-32 bg-black overflow-hidden flex items-center justify-center">
              <video
                src={`${API_URL}${video.videoUrl}`}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                <FiPlay className="w-12 h-12 text-white opacity-90" />
              </div>
              <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.videoDuration
                  ? `${video.videoDuration}:00`
                  : "00:00"}
              </div>
            </div>

            {/* INFO */}
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <h4 className="font-bold text-sm line-clamp-2 flex-1 pr-2">
                  {video.videoTitle}
                </h4>
                <div className="flex gap-1 flex-shrink-0">
                  <button className=" text-indigo-600 hover:bg-indigo-100 rounded p-1 transition-colors">
                    <FiEdit size={14} />
                  </button>
                  <button className=" text-red-600 hover:bg-red-100 rounded p-1 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <FiCalendar size={12} />
                  {new Date(video.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  <FiEye size={12} /> 0
                  <FiDownload size={12} /> 0
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-all font-medium"
                >
                  <FiPlay size={14} /> Play
                </button>
                <a
                  href={`${API_URL}${video.videoUrl}`}
                  download
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-all font-medium"
                >
                  <FiDownload size={14} /> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FIXED VIDEO PLAYER MODAL - RESPONSIVE & BETTER POSITIONING */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER WITH CLOSE BUTTON */}
            <div className="p-6 pb-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {activeVideo.videoTitle}
                </h3>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all group"
                  aria-label="Close video"
                >
                  <FiX className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                </button>
              </div>
            </div>

            {/* VIDEO PLAYER */}
            <div className="relative">
              <video
                src={`${API_URL}/uploads/videos/${activeVideo.videoUrl}`}
                controls
                autoPlay
                className="w-full h-96 md:h-[500px] object-contain bg-black rounded-b-2xl"
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
