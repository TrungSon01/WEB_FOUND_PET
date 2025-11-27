// src/pages/SavedPostsPage/components/LoadingState.jsx
import React from "react";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">
          Đang tải bài viết đã lưu...
        </p>
      </div>
    </div>
  );
}
