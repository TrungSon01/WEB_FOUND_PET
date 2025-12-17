import React, {
  useEffect,
  useState,
  useRef,
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
import { FaBars, FaTimes } from "react-icons/fa";

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
  const mapRef = useRef(null);

  const [usersMap, setUsersMap] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false); // Auto close sidebar on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

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
    // Close sidebar on mobile when viewing post detail
    closeSidebar();
    // Close any open Leaflet popup so the detail modal isn't blocked
    if (mapRef.current && typeof mapRef.current.closePopup === "function") {
      mapRef.current.closePopup();
    }
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
        closeSidebar(); // Close sidebar when opening post detail
        // Ensure any open popup is closed
        if (mapRef.current && typeof mapRef.current.closePopup === "function") {
          mapRef.current.closePopup();
        }
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
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="post-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>Không có bài đăng nào.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostItem
                key={post.id || post.post_id}
                post={post}
                user={user}
                onDelete={handleDelete}
                onEdit={handleEdit}
                userEmail={usersMap[post.user_id]?.username}
                onClick={handlePostClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
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
                    <div className="popup-content">
                      <b>
                        {usersMap[post.user_id]?.username ||
                          `User #${post.user_id}`}
                      </b>
                      <br />
                      <p className="popup-description">{post.description}</p>
                      <button
                        className="post-detail-button"
                        onClick={() => handlePostClick(post)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>

      {/* Post Detail Modal */}
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
