// src/pages/SavedPosts/SavedPostsPage.jsx
import React, { useEffect, useState } from "react";
import { getSavedPosts } from "../../../apis/postFormService";
import PostItem from "../../../components/UserPosts/PostItem";
import {
  SavedPostsContainer,
  Title,
  PostList,
  PostWrapper,
} from "./SavedPostsPage.styles";
import { useDispatch, useSelector } from "react-redux";
import { setSavePosts } from "../../../redux/postSlice";
import { getUserById } from "../../../apis/userService";

const SavedPostsPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.userSlice);
  const [usersMap, setUsersMap] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    const userJson = localStorage.getItem("userAccount");
    const user = JSON.parse(userJson);
    getSavedPosts(user.user_id).then((data) => {
      dispatch(setSavePosts(data));
      const uniqueUserIds = [...new Set(data.map((post) => post.user_id))];
      Promise.all(
        uniqueUserIds.map((id) =>
          getUserById(id).then((res) => ({ id, data: res.data }))
        )
      ).then((results) => {
        const userMap = {};
        results.forEach(({ id, data }) => {
          userMap[id] = data;
        });
        setUsersMap(userMap);
      });
    });
    console.log("usersMap", usersMap);
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
        console.log(data);
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
              <PostItem
                post={post}
                user={user}
                userEmail={usersMap[post.user_id]?.email}
              />
            </PostWrapper>
          ))}
        </PostList>
      )}
    </SavedPostsContainer>
  );
};

export default SavedPostsPage;
