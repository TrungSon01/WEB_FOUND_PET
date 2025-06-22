// src/pages/SavedPosts/SavedPostsPage.jsx
import React, { useEffect, useState } from "react";
import { getSavedPosts } from "../../apis/postFormService";
import PostItem from "../../components/UserPosts/PostItem";
import {
  SavedPostsContainer,
  Title,
  PostList,
  PostWrapper,
} from "./SavedPostsPage.styles";

const SavedPostsPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const userAccount = JSON.parse(localStorage.getItem("userAccount"));
        const userId = userAccount ? userAccount.user_id : null;

        if (!userId) {
          setError("Không tìm thấy ID người dùng trong bộ nhớ cục bộ.");
          setLoading(false);
          return;
        }

        const data = await getSavedPosts(userId);
        setSavedPosts(data.saved_posts || data);
      } catch (err) {
        setError("Không thể tải bài viết đã lưu.");
        console.error("Error fetching saved posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  if (loading) {
    return (
      <SavedPostsContainer>
        <p>Đang tải bài viết đã lưu...</p>
      </SavedPostsContainer>
    );
  }

  if (error) {
    return (
      <SavedPostsContainer>
        <p style={{ color: "red" }}>{error}</p>
      </SavedPostsContainer>
    );
  }

  return (
    <SavedPostsContainer>
      <Title>Bài viết đã lưu</Title>
      {savedPosts.length === 0 ? (
        <p>Bạn chưa lưu bài viết nào.</p>
      ) : (
        <PostList>
          {savedPosts.map((post) => (
            <PostWrapper key={post.id || post.post_id}>
              <PostItem post={post} />
            </PostWrapper>
          ))}
        </PostList>
      )}
    </SavedPostsContainer>
  );
};

export default SavedPostsPage;
