import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { getUserById } from "../../apis/userService";
import { useSelector, useDispatch } from "react-redux";
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
import { logoutUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import UserChangePassword from "./UserChangePassword"; // Cập nhật đúng đường dẫn

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const user_id = userAccount.user_id;
    if (!user_id) {
      setError("Không tìm thấy user_id. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserById(user_id)
      .then((res) => setUser(res.data))
      .catch(() => setError("Không thể tải thông tin người dùng."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
  }
  if (error) {
    return <div className="user-profile-error">{error}</div>;
  }
  if (!user) return null;
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("userAccount");
    navigate("/login"); // chuyển về trang login
  };
  return (
    <div className="user-profile-bg">
      {showChangePasswordModal && (
        <UserChangePassword onClose={() => setShowChangePasswordModal(false)} />
      )}

      <div className="user-profile-card animate-pop">
        <div className="user-profile-avatar-wrap">
          <img
            src={user.avatar || defaultAvatar}
            alt="avatar"
            className="user-profile-avatar"
          />
        </div>
        <h2 className="user-profile-name">{user.username || "Người dùng"}</h2>
        <div className="user-profile-info">
          <div>
            <b>Email:</b> <span>{user.email}</span>
          </div>
          <div>
            <b>Số điện thoại:</b> <span>{user.phone || "Chưa cập nhật"}</span>
          </div>
          <div>
            <b>User ID:</b> <span>{user.user_id}</span>
          </div>
        </div>
        <div className="user-profile-actions">
          <button
            className="user-profile-btn user-profile-btn-logout"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
          <button
            className="user-profile-btn"
            onClick={() => setShowChangePasswordModal(true)}
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}
