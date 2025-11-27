import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function FriendsTab() {
  return (
    <div className="content-card fade-in">
      <div className="empty-state">
        <FaUserCircle className="empty-icon" />
        <h3>Chưa có bạn bè nào</h3>
        <p>Kết nối với mọi người để mở rộng mạng lưới!</p>
        <button className="btn-primary">Tìm bạn bè</button>
      </div>
    </div>
  );
}
