// SinglePostView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FiArrowLeft } from 'react-icons/fi';
import PostCard from '../../pages/signals/PostCard';

const API_URL = import.meta.env.VITE_API_URL;

const SinglePostView = () => {
  const { feed_id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/feeds/feeds/${feed_id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setPost(response.data.data);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (feed_id) {
      fetchPost();
    }
  }, [feed_id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The post you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Post</h1>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PostCard 
          key={post.id} 
          post={post} 
          onUpdate={fetchPost}
          isSingleView={true}
        />
        
        {/* Related Posts or Comments Section can go here */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>End of post</p>
        </div>
      </div>
    </div>
  );
};

export default SinglePostView;