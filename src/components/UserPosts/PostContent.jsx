// components/Post/PostContent.jsx
import React from "react";

export default function PostContent({ post }) {
  return (
    <>
      <div className="post-desc post-desc-main">
        {post.description || "Không có mô tả"}
      </div>
      <div className="post-image-grid">
        <div className="post-image-main">
          {post.image && <img src={post.image} alt="pet" />}
        </div>
      </div>
    </>
  );
}
