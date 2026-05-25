// import { useLocation, useNavigate } from "react-router-dom";
// import { FiArrowLeft } from "react-icons/fi";

// const API_URL = import.meta.env.VITE_API_URL;

// const FeedView = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const feed = state?.feed;

//   console.log(feed,1000)

//   if (!feed) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         Feed data not found
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-2 text-md mb-4"
//       >
//         <FiArrowLeft /> Back
//       </button>

//       <div className="bg-white shadow rounded-xl p-6">
//         {/* User */}
//         <div className="flex gap-3 mb-4">
//           <img
//             src={feed.ra_avatar || "https://via.placeholder.com/40"}
//             className="w-12 h-12 rounded-full"
//           />
//           <div>
//             <h3 className="font-semibold">{feed.ra_name}</h3>
//             <p className="text-xs text-gray-500">
//               {new Date(feed.created_at).toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* Text */}
//         <p className="text-gray-700 mb-4">{feed.feed_text}</p>

//         {/* Media */}
//         {feed.feed_documents?.map((doc, i) => {
//           const src = doc.filename.startsWith("http")
//             ? doc.filename
//             : `${API_URL}/${doc.filename}`;

//           if (doc.mimetype?.startsWith("image")) {
//             return (
//               <img
//                 key={i}
//                 src={src}
//                 className="w-full rounded-md mb-3"
//               />
//             );
//           }

//           if (doc.mimetype?.startsWith("video")) {
//             return (
//               <video key={i} controls className="w-full rounded-md mb-3">
//                 <source src={src} type={doc.mimetype} />
//               </video>
//             );
//           }
//           return null;
//         })}

//         {/* Tags */}
//         <div className="mt-3 flex gap-2 text-blue-600 text-md">
//           {feed.feed_tags?.map((tag, i) => (
//             <span key={i}>#{tag.replace("#", "")}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedView;






import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const FeedView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const feed = state?.feed;

  if (!feed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6 opacity-20">📝</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Feed Not Found</h2>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format feed text with proper line breaks
  const formatFeedText = (text) => {
    if (!text) return '';
    return text
      .replace(/\\\\r\\\\n/g, '\n')
      .replace(/\\r\\n/g, '\n')
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => (
        <p key={index} className="mb-4 text-gray-800 leading-relaxed">
          {line}
        </p>
      ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 p-2 hover:bg-gray-100 rounded-lg"
      >
        <FiArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          {/* User Info */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b">
            {feed.ra_avatar?<>
            
             <img
              src={feed.ra_avatar || "https://via.placeholder.com/60"}
              className="w-16 h-16 rounded-2xl"
              alt={feed.ra_name}
            />
            
            </>:<>
            
            <FaUserTie className="w-16 h-16 rounded-2xl" />
            
            </>}
           
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{feed.ra_name}</h1>
              <p className="text-md text-gray-500 mt-1">RA ID: {feed.ra_id}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Formatted Text */}
            <div>{formatFeedText(feed.feed_text)}</div>

            {/* Images */}
            {feed.feed_documents?.map((doc, i) => (
              doc.mimetype?.startsWith('image/') && (
                <img
                  key={i}
                  src={doc.url}
                  className="w-full rounded-xl shadow-md"
                  alt="Feed media"
                />
              )
            ))}

            {/* Tags */}
            {feed.feed_tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {feed.feed_tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-md">
                    {tag.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex gap-6 text-md">
                <span><FiHeart size={18} className="inline mr-1" /> {feed.feed_like_count}</span>
                <span><FiMessageCircle size={18} className="inline mr-1" /> {feed.feed_comment_count}</span>
                <span><FiShare2 size={18} className="inline mr-1" /> {feed.feed_share_count}</span>
              </div>
              <p className="text-md text-gray-500">{formatDate(feed.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedView;
