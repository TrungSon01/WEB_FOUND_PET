import React from "react";
import { FaSignOutAlt, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";

export default function ProfileSidebar({ user, onLogout }) {
  return (
    <div className="profile-sidebar">
      {/* Thông tin cơ bản */}
      <div className="sidebar-card">
        <h3 className="card-title">Giới thiệu</h3>
        <div className="info-list">
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <div className="info-content">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
          </div>
          <div className="info-item">
            <FaPhone className="info-icon" />
            <div className="info-content">
              <span className="info-label">Số điện thoại</span>
              <span className="info-value">
                {user.phone || "Chưa cập nhật"}
              </span>
            </div>
          </div>
          <div className="info-item">
            <FaIdCard className="info-icon" />
            <div className="info-content">
              <span className="info-label">User ID</span>
              <span className="info-value">{user.user_id}</span>
            </div>
          </div>
        </div>
        <button className="sidebar-edit-btn">Chỉnh sửa thông tin</button>
      </div>

      {/* Hoạt động gần đây */}
      <div className="sidebar-card">
        <h3 className="card-title">Hoạt động gần đây</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🎉</div>
            <div className="activity-text">
              <p>Tham gia cộng đồng</p>
              <span>2 ngày trước</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-text">
              <p>Cập nhật thông tin</p>
              <span>1 tuần trước</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút đăng xuất */}
      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt /> Đăng xuất
      </button>
    </div>
  );
}
