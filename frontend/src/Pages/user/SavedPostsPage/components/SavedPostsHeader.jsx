// src/pages/SavedPostsPage/components/SavedPostsHeader.jsx
import React from "react";
import { FaBookmark } from "react-icons/fa";

export default function SavedPostsHeader({ postsCount }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
          <FaBookmark className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bài viết đã lưu
          </h1>
          <p className="text-gray-500 text-sm mt-1">{postsCount} bài viết</p>
        </div>
      </div>
    </div>
  );
}
