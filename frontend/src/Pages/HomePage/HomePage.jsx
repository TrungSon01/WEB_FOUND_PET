import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Popconfirm } from "antd";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./HomePage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPosts, deletePosts, setLoading } from "../../redux/postSlice";
import {
  getPosts,
  deletePost,
  getComments,
  searchPosts,
} from "../../apis/postFormService";
import toast from "react-hot-toast";
import PostItem from "../../components/UserPosts/PostItem";
import { getUserById } from "../../apis/userService";
import PostDetail from "../../components/UserPosts/PostDetail";
import Notification from "../../components/Notification/Notification";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const HomePage = forwardRef(function HomePage(props, ref) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.postSlice);
  const { user } = useSelector((state) => state.userSlice);

  const [usersMap, setUsersMap] = useState({}); // State để lưu usersMap
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchPosts = () => {
    dispatch(setLoading(true));
    getPosts()
      .then((data) => {
        dispatch(setPosts(data));
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
      })
      .catch(() => dispatch(setPosts([])))
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    if (user && !isSearching) {
      fetchPosts();
    }
  }, [dispatch, user, isSearching]);

  const handleSearch = async (query) => {
    if (!query) {
      setIsSearching(false);
      // Khi query rỗng, fetch lại tất cả bài post
      fetchPosts();
      return;
    }
    setIsSearching(true);
    dispatch(setLoading(true));
    try {
      const { data } = await searchPosts(query);
      dispatch(setPosts(data));
    } catch (error) {
      toast.error("Không tìm thấy kết quả nào.");
      dispatch(setPosts([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const center = posts.length
    ? [posts[0].latitude, posts[0].longitude]
    : [21.0, 105.85];

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      dispatch(deletePosts(id));
      toast.success("Đã xóa bài đăng thành công");
    } catch (error) {
      console.error("Lỗi xóa bài đăng:", error);
      toast.error("Xóa bài đăng thất bại");
    }
  };

  const handleEdit = () => {
    toast("🚧 Đang cập nhật chức năng này", {
      icon: "ℹ️",
      position: "top-right",
    });
  };

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    setCommentsLoading(true);
    try {
      const res = await getComments(post.id || post.post_id);
      setComments(res);
    } catch (err) {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    setComments([]);
  };

  const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
  const user_id = userAccount.user_id;

  useImperativeHandle(ref, () => ({
    openPostDetailById: async (post_id) => {
      const post = posts.find(
        (p) =>
          p.id === post_id ||
          p.post_id === post_id ||
          String(p.id) === String(post_id) ||
          String(p.post_id) === String(post_id)
      );
      if (post) {
        setSelectedPost(post);
        setCommentsLoading(true);
        try {
          const res = await getComments(post.id || post.post_id);
          setComments(res);
        } catch (err) {
          setComments([]);
        } finally {
          setCommentsLoading(false);
        }
      }
    },
    handleSearch,
  }));

  return (
    <div className="homepage">
      <div className="sidebar">
        <div className="post-list">
          {loading ? (
            <div>Đang tải...</div>
          ) : posts.length === 0 ? (
            <div>Không có bài đăng nào.</div>
          ) : (
            posts.map((post) => (
              <PostItem
                key={post.id || post.post_id}
                post={post}
                user={user}
                onDelete={handleDelete}
                onEdit={handleEdit}
                userEmail={usersMap[post.user_id]?.email}
                onClick={handlePostClick}
              />
            ))
          )}
        </div>
      </div>
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {posts.map(
            (post) =>
              post.latitude &&
              post.longitude && (
                <Marker
                  key={post.id || post.post_id}
                  position={[post.latitude, post.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <b>{post.user_id}</b>
                    <br />
                    {post.description}
                    <br />
                    <button
                      className="post-detail-button"
                      onClick={() => handlePostClick(post)}
                    >
                      Xem chi tiết
                    </button>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          comments={comments}
          loading={commentsLoading}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
});

export default HomePage;
