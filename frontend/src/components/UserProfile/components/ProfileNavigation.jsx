import React from "react";

const tabs = [
  { id: "about", label: "Giới thiệu" },
  { id: "posts", label: "Bài viết" },
  { id: "photos", label: "Ảnh" },
  { id: "friends", label: "Bạn bè" },
];

export default function ProfileNavigation({ activeTab, onTabChange }) {
  return (
    <div className="profile-nav">
      <div className="profile-nav-wrapper">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
