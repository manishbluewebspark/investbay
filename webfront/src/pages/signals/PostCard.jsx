import React from "react";
import { FaRegThumbsUp, FaRegCommentDots, FaShareAlt } from "react-icons/fa";
import postImg from "../../assets/signals.jpg";

export default function PostCard({ post }) {
  return (
<section>
        <div
      className="rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition-all duration-300 hover:shadow-md"
      style={{
        background: "linear-gradient(157.99deg, #EDEFFF 0%, #FFFFFF 100%)",
      }}
    >
      {/* Header Section */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-green-300 flex items-center justify-center font-bold text-gray-700">
          {post.name.charAt(0)}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-gray-800">{post.name}</h3>
          <p className="text-xs text-gray-500">{post.date}</p>
        </div>
      </div>

      <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full mb-5"></div>

      {/* Post Content */}
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.content}</p>

      <div className="text-xs text-gray-600 mb-4 bg-white/50 p-2 rounded-lg border border-gray-100">
        <p>
          <span className="font-semibold text-gray-700">Support:</span> {post.support}{" "}
          <span className="ml-3 font-semibold text-gray-700">Resistance:</span> {post.resistance}{" "}
          <span className="ml-3 font-semibold text-gray-700">Sentiment:</span> {post.sentiment}
        </p>
      </div>

      {/* Post Image */}
      <img
        src={postImg}
        alt="Stock Chart"
        className="rounded-xl w-full mb-4 border border-gray-100"
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 text-xs mb-4">
        {post.tags.map((tag, i) => (
          <span
            key={i}
            className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="w-full mx-auto mt-3 h-[1.5px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-50 rounded-full mb-5"></div>
      
      <div className="flex justify-between text-gray-600 text-sm">
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200  border p-1 px-14 rounded-md">
          <FaRegThumbsUp className="text-base" /> Like
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 border p-1 px-14 rounded-md">
          <FaRegCommentDots className="text-base" /> Comment
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 border p-1 px-14 rounded-md">
          <FaShareAlt className="text-base" /> Share
        </button>
      </div>
    </div>
</section>
  );
}
