import React, { useRef } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaKey, FaCamera, FaCog } from "react-icons/fa";
import { getAvatarUrl } from "../../../common/functions/app.function";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function ProfileHeader({
  user,
  onChangePassword,
  onEditProfile,
  onAvatarUpdate,
}) {
  const fileInputRef = useRef(null);

  const handleUpdateAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    const loadingToast = toast.loading("Đang cập nhật ảnh đại diện...");

    try {
      const formData = new FormData();
      formData.append("Web_Found_Pet_Avatar_User", file);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8001/api/user/upload-cloud-avatar-user?user_id=${user.user_id}`,
        {
          method: "POST",

          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Gọi callback để cập nhật avatar trong component cha
      if (onAvatarUpdate) {
        await onAvatarUpdate(data.avatar || data.avatarUrl || data.url);
      }

      toast.success("Cập nhật ảnh đại diện thành công!", {
        id: loadingToast,
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật ảnh!", {
        id: loadingToast,
      });
      console.error("Error uploading avatar:", error);
    }

    // Reset input để có thể chọn lại cùng một file
    e.target.value = "";
  };
  const userAvatar = getAvatarUrl(user.avatar);
  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <img
              src={userAvatar || defaultAvatar}
              alt="avatar"
              className="profile-avatar"
            />
            <button className="avatar-edit-btn" onClick={handleUpdateAvatar}>
              <FaCamera />
            </button>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
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
