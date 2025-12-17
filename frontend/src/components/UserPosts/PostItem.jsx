// components/Post/PostItem.jsx
import React, { useState, useRef } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { savePost } from "../../apis/postFormService";
import { useSelector } from "react-redux";

export default function PostItem({
  post,
  user,
  userEmail,
  onDelete,
  onEdit,
  onClick,
}) {
  const { user: currentUser } = useSelector((state) => state.userSlice);

  const lastClickTime = useRef(0);
  const DOUBLE_CLICK_DELAY = 180;

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < DOUBLE_CLICK_DELAY) {
      onClick(post); // Double click opens detail
    }
    lastClickTime.current = now;
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    onClick(post); // Single click on comment icon opens detail
  };

  return (
    <div
      className="post-item"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <PostHeader
        post={post}
        user={user}
        onDelete={onDelete}
        onEdit={onEdit}
        userEmail={userEmail}
        onSavePost={savePost}
      />
      <PostContent post={post} />

      {/* Actions + Comment nằm ngang */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <PostActions post={post} />

        {currentUser && (
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 group"
            onClick={handleCommentClick}
            aria-label="Bình luận"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/3114/3114810.png"
              alt="Comment"
              className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
            />
            <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-200">
              Bình luận
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
