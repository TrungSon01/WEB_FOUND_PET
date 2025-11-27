// src/pages/SavedPostsPage/hooks/useSavedPosts.js
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deletePost, getSavedPosts } from "../../../../apis/postFormService";
import { getUserById } from "../../../../apis/userService";
import { deletePosts, setSavePosts } from "../../../../redux/postSlice";
import toast from "react-hot-toast";

export const useSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSavedPosts();
  }, [dispatch]);

  const fetchSavedPosts = async () => {
    try {
      const userAccount = JSON.parse(localStorage.getItem("userAccount"));
      const userId = userAccount?.user_id;

      if (!userId) {
        setError("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      // Fetch saved posts
      const data = await getSavedPosts(userId);
      const posts = data.saved_posts || data || [];

      setSavedPosts(posts);
      dispatch(setSavePosts(posts));

      // Fetch user data for each post
      await fetchUsersData(posts);
    } catch (err) {
      setError("Không thể tải bài viết đã lưu. Vui lòng thử lại.");
      console.error("Error fetching saved posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async (posts) => {
    const uniqueUserIds = [...new Set(posts.map((post) => post.user_id))];
    const usersData = await Promise.all(
      uniqueUserIds.map((id) =>
        getUserById(id)
          .then((res) => ({ id, data: res.data }))
          .catch(() => ({ id, data: null }))
      )
    );

    const userMap = {};
    usersData.forEach(({ id, data }) => {
      if (data) userMap[id] = data;
    });
    setUsersMap(userMap);
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      dispatch(deletePosts(id));
      setSavedPosts((prev) => prev.filter((post) => post.post_id !== id));
      toast.success("Đã xóa bài đăng thành công");
    } catch (error) {
      console.error("Lỗi xóa bài đăng:", error);
      toast.error("Xóa bài đăng thất bại");
    }
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchSavedPosts();
  };

  return {
    savedPosts,
    loading,
    error,
    usersMap,
    handleDelete,
    refetch,
  };
};
