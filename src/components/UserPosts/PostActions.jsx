import React, { useState } from "react";
import axios from "axios";

export default function PostActions({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);

  const handleLike = async () => {
    const updatedLikeCount = liked ? likeCount - 1 : likeCount + 1;

    try {
      await axios.patch(`http://127.0.0.1:8000/api/posts/${post.post_id}/`, {
        like_count: updatedLikeCount,
      });

      setLiked(!liked);
      setLikeCount(updatedLikeCount);
    } catch (err) {
      console.error("Lỗi khi cập nhật like:", err);
      console.log(err.response.data); // Xem chi tiết lỗi
    }
  };

  return (
    <div className="post-actions mt-2 flex items-center gap-3">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
          liked
            ? "text-black hover:text-black hover:cursor-pointer"
            : "text-black hover:bg-white hover:black hover:cursor-pointer"
        }`}
      >
        {liked ? "❤️" : "🤍"} {likeCount} lượt thích
      </button>
    </div>
  );
}
