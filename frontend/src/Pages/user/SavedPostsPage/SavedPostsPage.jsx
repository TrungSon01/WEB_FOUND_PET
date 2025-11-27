// src/pages/SavedPostsPage/SavedPostsPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useSavedPosts } from "./hooks/useSavedPosts";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import SavedPostsHeader from "./components/SavedPostsHeader";
import PostsList from "./components/PostsList";
import "./styles/animations.css";

const SavedPostsPage = () => {
  const { user } = useSelector((state) => state.userSlice);
  const { savedPosts, loading, error, usersMap, handleDelete, refetch } =
    useSavedPosts();

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  // Error State
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // Empty State
  if (savedPosts.length === 0) {
    return <EmptyState />;
  }

  // Main Content
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <SavedPostsHeader postsCount={savedPosts.length} />

        {/* Posts List */}
        <PostsList
          posts={savedPosts}
          user={user}
          usersMap={usersMap}
          onDelete={handleDelete}
        />

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Tất cả các bài viết đã lưu sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default SavedPostsPage;
