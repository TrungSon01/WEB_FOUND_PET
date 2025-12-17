// UserChangePassword.jsx
import React, { useState } from "react";
import "./UserChangePassword.css";
import { useDispatch, useSelector } from "react-redux";
import { https } from "../../apis/config";
import toast from "react-hot-toast";
import { logoutUser } from "../../redux/userSlice";

export default function UserChangePassword({ onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userSlice.user);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận chưa khớp!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const userId = userAccount.user_id;

    try {
      await https.put(`/api/users/${userId}/`, {
        email: user.email,
        username: user.username,
        phone: user.phone,
        user_id: user.user_id,
        password: newPassword,
      });
      setSuccess("Đổi mật khẩu thành công!");
      setTimeout(() => {
        dispatch(logoutUser());
        localStorage.removeItem("userAccount");
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError("Có lỗi xảy ra khi đổi mật khẩu.");
      setIsLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = passwordStrength(newPassword);
  const strengthLabels = ["", "Yếu", "Trung bình", "Mạnh"];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Decorative gradient background */}
        <div className="modal-gradient-bg"></div>

        {/* Close button */}
        <button onClick={onClose} className="modal-close-btn">
          <span className="close-icon">×</span>
        </button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="modal-title">Đổi Mật Khẩu</h2>
          <p className="modal-subtitle">
            Tạo mật khẩu mới an toàn cho tài khoản của bạn
          </p>
        </div>

        {/* Form */}
        <div className="modal-form">
          {/* New Password Input */}
          <div className="input-group">
            <label className="input-label">Mật khẩu mới</label>
            <div className="input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="modal-input"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="eye-button"
              >
                {showNewPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {newPassword && (
              <div className="strength-indicator">
                <div className="strength-bars">
                  <div
                    className={`strength-bar ${
                      strength >= 1 ? "strength-" + strength : ""
                    }`}
                  ></div>
                  <div
                    className={`strength-bar ${
                      strength >= 2 ? "strength-" + strength : ""
                    }`}
                  ></div>
                  <div
                    className={`strength-bar ${
                      strength >= 3 ? "strength-" + strength : ""
                    }`}
                  ></div>
                </div>
                {strength > 0 && (
                  <p className={`strength-text strength-${strength}`}>
                    Độ mạnh: {strengthLabels[strength]}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <label className="input-label">Xác nhận mật khẩu</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="modal-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-button"
              >
                {showConfirmPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            {/* Match indicator */}
            {confirmPassword && (
              <div className="match-indicator">
                {newPassword === confirmPassword ? (
                  <>
                    <svg
                      className="match-icon success"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="match-text success">Mật khẩu khớp</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="match-icon error"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="match-text error">Mật khẩu chưa khớp</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="message-box error-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="message-box success-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-cancel"
            >
              Hủy
            </button>
            <button
              onClick={handleChangePassword}
              disabled={isLoading || !newPassword || !confirmPassword}
              className="btn btn-confirm"
            >
              {isLoading ? (
                <span className="loading-content">
                  <span className="spinner"></span>
                  Đang xử lý...
                </span>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================
   UserChangePassword.css
   =================================== */

/* Animations */
