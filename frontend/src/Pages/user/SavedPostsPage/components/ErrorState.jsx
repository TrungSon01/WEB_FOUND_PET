// src/pages/SavedPostsPage/components/ErrorState.jsx
import React from "react";

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-scaleIn">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
