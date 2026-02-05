import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const FeedView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const feed = state?.feed;

  if (!feed) {
    return (
      <div className="p-6 text-center text-red-500">
        Feed data not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-4"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="bg-white shadow rounded-xl p-6">
        {/* User */}
        <div className="flex gap-3 mb-4">
          <img
            src={feed.ra_avatar || "https://via.placeholder.com/40"}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{feed.ra_name}</h3>
            <p className="text-xs text-gray-500">
              {new Date(feed.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Text */}
        <p className="text-gray-700 mb-4">{feed.feed_text}</p>

        {/* Media */}
        {feed.feed_documents?.map((doc, i) => {
          const src = doc.filename.startsWith("http")
            ? doc.filename
            : `${API_URL}/${doc.filename}`;

          if (doc.mimetype?.startsWith("image")) {
            return (
              <img
                key={i}
                src={src}
                className="w-full rounded-md mb-3"
              />
            );
          }

          if (doc.mimetype?.startsWith("video")) {
            return (
              <video key={i} controls className="w-full rounded-md mb-3">
                <source src={src} type={doc.mimetype} />
              </video>
            );
          }
          return null;
        })}

        {/* Tags */}
        <div className="mt-3 flex gap-2 text-blue-600 text-sm">
          {feed.feed_tags?.map((tag, i) => (
            <span key={i}>#{tag.replace("#", "")}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedView;
