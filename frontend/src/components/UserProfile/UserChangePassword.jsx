import React, { useState } from "react";
import "./UserChangePassword.css"; // Tạo file CSS riêng cho modal
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { https } from "../../apis/config";
import toast from "react-hot-toast";
import Input from "../Input/Input";
import { logoutUser } from "../../redux/userSlice";
export default function UserChangePassword({ onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userSlice.user);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    console.log("user redux", user);

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu chưa khớp bạn ơi");
      return;
    }

    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const userId = userAccount.user_id;

    console.log("id change pass", userId);
    try {
      await https.put(`/api/users/${userId}/`, {
        email: user.email,
        username: user.username,
        phone: user.phone,
        user_id: user.user_id,
        password: newPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      dispatch(logoutUser());
      localStorage.removeItem("userAccount");
      navigate("/login");
      toast.success("Đổi mật khẩu thành công");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Đổi mật khẩu</h2>
        <Input
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Input
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <div className="modal-actions flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-rose-500 bg-rose-500 text-white rounded-lg shadow-sm font-medium transition-all duration-200 hover:bg-yellow-400 hover:text-white hover:cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 border border-rose-600 bg-rose-500 text-white rounded-lg shadow-sm font-medium transition-all duration-200 hover:bg-yellow-400 hover:text-white hover:cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
