import React from "react";
import AboutTab from "./tabs/AboutTab";
import PostsTab from "./tabs/PostsTab";
import PhotosTab from "./tabs/PhotosTab";
import FriendsTab from "./tabs/FriendsTab";

export default function ProfileContent({ activeTab, user }) {
  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutTab user={user} />;
      case "posts":
        return <PostsTab />;
      case "photos":
        return <PhotosTab />;
      case "friends":
        return <FriendsTab />;
      default:
        return <AboutTab user={user} />;
    }
  };

  return <div className="profile-content">{renderContent()}</div>;
}
