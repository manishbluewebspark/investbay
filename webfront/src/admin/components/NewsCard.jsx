// components/NewsCard.jsx
import { useState } from "react";
import { FiEye, FiCalendar, FiClock, FiUser, FiTag, FiImage } from "react-icons/fi";
import { format } from "date-fns";

const NewsCard = ({ news, onPreview, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {news.images && news.images.length > 0 && !imageError ? (
          <img
            src={news.images[0]}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <FiImage size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(news.status)}`}>
            {news.status?.charAt(0).toUpperCase() + news.status?.slice(1) || 'Draft'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
            {news.category || 'Uncategorized'}
          </span>
        </div>

        {/* Image Count Badge (if multiple images) */}
        {news.images && news.images.length > 1 && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm flex items-center gap-1">
              <FiImage size={12} />
              {news.images.length}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {news.title || 'Untitled'}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {truncateText(news.shortDescription, 120)}
        </p>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
              >
                <FiTag size={10} />
                {tag}
              </span>
            ))}
            {news.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{news.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          {/* Author */}
          {news.author_name && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiUser size={12} className="text-gray-400" />
              <span>{news.author_name}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar size={12} className="text-gray-400" />
            <span>{formatDate(news.scheduled_date || news.created_at)}</span>
            
            {/* Schedule Indicator */}
            {news.status === 'scheduled' && news.scheduled_date && (
              <>
                <FiClock size={12} className="text-gray-400 ml-1" />
                <span>
                  {format(new Date(news.scheduled_date), 'hh:mm a')}
                </span>
              </>
            )}
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiEye size={12} className="text-gray-400" />
            <span>{news.views || 0} views</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onPreview && onPreview(news)}
            className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <FiEye size={14} />
            Preview
          </button>
          
          <button
            onClick={() => onEdit && onEdit(news)}
            className="flex-1 px-3 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <FiEye size={14} className="rotate-180" />
            Edit
          </button>
          
          {onDelete && (
            <button
              onClick={() => onDelete && onDelete(news.id)}
              className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;