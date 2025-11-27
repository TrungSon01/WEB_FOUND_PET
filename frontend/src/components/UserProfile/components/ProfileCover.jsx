import React from "react";
import { FaCamera } from "react-icons/fa";

const defaultCover =
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200";

export default function ProfileCover({ coverImage = defaultCover, onEdit }) {
  return (
    <div className="profile-cover">
      <img src={coverImage} alt="cover" className="cover-image" />
      <button className="cover-edit-btn" onClick={onEdit}>
        <FaCamera /> Chỉnh sửa ảnh bìa
      </button>
    </div>
  );
}
