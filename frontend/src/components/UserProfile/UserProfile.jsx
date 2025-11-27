import React, { useState } from "react";
import "./UserProfile.css";
import useUserProfile from "./hooks/useUserProfile";
import ProfileCover from "./components/ProfileCover";
import ProfileHeader from "./components/ProfileHeader";
import ProfileNavigation from "./components/ProfileNavigation";
import ProfileSidebar from "./components/ProfileSideBar";
import ProfileContent from "./components/ProfileContent";
import UserChangePassword from "./UserChangePassword";

export default function UserProfile() {
  const { user, loading, error, handleLogout } = useUserProfile();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!user) return null;

  return (
    <div className="profile-container">
      {showChangePasswordModal && (
        <UserChangePassword onClose={() => setShowChangePasswordModal(false)} />
      )}

      <ProfileCover />

      <ProfileHeader
        user={user}
        onChangePassword={() => setShowChangePasswordModal(true)}
      />

      <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="profile-main">
        <ProfileSidebar user={user} onLogout={handleLogout} />

        <ProfileContent activeTab={activeTab} user={user} />
      </div>
    </div>
  );
}
