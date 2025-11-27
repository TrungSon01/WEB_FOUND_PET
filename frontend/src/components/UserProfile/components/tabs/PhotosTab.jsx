import React from "react";
import { FaCamera } from "react-icons/fa";

export default function PhotosTab() {
  return (
    <div className="content-card fade-in">
      <div className="empty-state">
        <FaCamera className="empty-icon" />
        <h3>Chưa có ảnh nào</h3>
        <p>Thêm ảnh để chia sẻ khoảnh khắc đẹp!</p>
        <button className="btn-primary">Thêm ảnh</button>
      </div>
    </div>
  );
}
