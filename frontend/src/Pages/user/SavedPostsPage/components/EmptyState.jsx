// src/pages/SavedPostsPage/components/EmptyState.jsx
import React from "react";
import { FaInbox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center animate-scaleIn">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaInbox className="text-5xl text-purple-400 animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Chưa có bài viết nào
        </h3>
        <p className="text-gray-500 mb-6">
          Bạn chưa lưu bài viết nào. Hãy khám phá và lưu những bài viết thú vị!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          Khám phá ngay
        </button>
      </div>
    </div>
  );
}
