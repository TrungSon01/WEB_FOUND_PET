import React, { useState } from "react";
import axios from "axios";

export default function PostActions({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent post click
    const updatedLikeCount = liked ? likeCount - 1 : likeCount + 1;

    try {
      await axios.patch(`http://127.0.0.1:8000/api/posts/${post.post_id}/`, {
        like_count: updatedLikeCount,
      });

      setLiked(!liked);
      setLikeCount(updatedLikeCount);
    } catch (err) {
      console.error("Lỗi khi cập nhật like:", err);
      console.log(err.response?.data);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg 
        transition-all duration-200 group
        ${
          liked
            ? ""
            : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50"
        }
      `}
      aria-label="Thích"
    >
      <span
        className={`
          text-xl transition-all duration-200
          ${liked ? "animate-bounce" : "group-hover:scale-110"}
        `}
      >
        {liked ? "❤️" : "🤍"}
      </span>
      <span
        className={`
          text-sm font-medium transition-colors duration-200
          ${
            liked ? "text-red-500" : "text-gray-600 group-hover:text-purple-600"
          }
        `}
      >
        {likeCount > 0 ? `${likeCount} lượt thích` : "Thích"}
      </span>
    </button>
  );
}
