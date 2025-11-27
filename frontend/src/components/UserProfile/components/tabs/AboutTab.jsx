import React from "react";

export default function AboutTab({ user }) {
  return (
    <div className="content-card fade-in">
      <h3 className="card-title">Thông tin chi tiết</h3>
      <div className="details-grid">
        <div className="detail-item">
          <h4>Thông tin cá nhân</h4>
          <p>
            <strong>Họ và tên:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}
          </p>
        </div>
        <div className="detail-item">
          <h4>Thông tin tài khoản</h4>
          <p>
            <strong>User ID:</strong> {user.user_id}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className="status-active">Đang hoạt động</span>
          </p>
        </div>
      </div>
    </div>
  );
}
