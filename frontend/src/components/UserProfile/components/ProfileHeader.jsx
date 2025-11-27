import React from "react";
import { FaEdit, FaKey, FaCamera, FaCog } from "react-icons/fa";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function ProfileHeader({
  user,
  onChangePassword,
  onEditProfile,
}) {
  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <img
              src={user.avatar || defaultAvatar}
              alt="avatar"
              className="profile-avatar"
            />
            <button className="avatar-edit-btn">
              <FaCamera />
            </button>
          </div>
          <div className="profile-name-section">
            <h1 className="profile-name">{user.username || "Người dùng"}</h1>
            <p className="profile-bio">Thành viên của cộng đồng</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-btn btn-primary" onClick={onEditProfile}>
            <FaEdit /> Chỉnh sửa trang cá nhân
          </button>
          <button
            className="action-btn btn-secondary"
            onClick={onChangePassword}
          >
            <FaKey /> Đổi mật khẩu
          </button>
          <button className="action-btn btn-settings">
            <FaCog />
          </button>
        </div>
      </div>
    </div>
  );
}
