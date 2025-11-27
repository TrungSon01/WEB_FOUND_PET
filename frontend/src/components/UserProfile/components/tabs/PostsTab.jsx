import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function PostsTab() {
  return (
    <div className="content-card fade-in">
      <div className="empty-state">
        <FaUserCircle className="empty-icon" />
        <h3>Chưa có bài viết nào</h3>
        <p>Hãy chia sẻ suy nghĩ của bạn với cộng đồng!</p>
        <button className="btn-primary">Tạo bài viết</button>
      </div>
    </div>
  );
}
