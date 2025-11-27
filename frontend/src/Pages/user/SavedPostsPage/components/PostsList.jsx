// src/pages/SavedPostsPage/components/PostsList.jsx
import React from "react";
import PostItem from "../../../../components/UserPosts/PostItem";
import "../styles/animations.css";

export default function PostsList({ posts, user, usersMap, onDelete }) {
  return (
    <div className="grid gap-6">
      {posts.map((post, index) => (
        <div
          key={post.id || post.post_id}
          className="stagger-item bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PostItem
            post={post}
            user={user}
            userEmail={usersMap[post.user_id]?.email}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
