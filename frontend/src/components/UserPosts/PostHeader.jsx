// components/Post/PostHeader.jsx
import React, { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
const defaultAvatar =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
import { timeAgo } from "../../apis/postFormService";
import PostDetail from "./PostDetail";
import { getUserById } from "../../apis/userService";
import { Popconfirm } from "antd";
import "./PostHeader.css";
import toast from "react-hot-toast";
import { CLOUNDINARY_IMAGE_URL } from "../../common/url/url.common";
import { getAvatarUrl } from "../../common/functions/app.function";
export default function PostHeader({
  post,
  userEmail,
  onDelete,
  onEdit,
  onSavePost,
}) {
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useSelector((state) => state.userSlice);
  const [username, setUsername] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [avatarUser, setAvatarUser] = useState("");
  useEffect(() => {
    if (post?.user_id) {
      getUserById(post.user_id)
        .then((res) => {
          setUsername(res.username);
          if (res.data.avatar !== "") {
            setAvatarUser(getAvatarUrl(res.data.avatar));
          }
        })
        .catch((err) => {
          console.error("Lỗi khi lấy username:", err);
        });
    }
    // console.log(post);
  }, [post?.user_id]);

  const profileUser = async (user_id) => {
    try {
      const res = await getUserById(user_id);
      alert(`User ID: ${res.data.user_id} - Tên: ${res.data.username}`);
      setUserInfo(res.data);
      console.log(userInfo);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin user:", err);
      alert("Không thể lấy thông tin người dùng!");
    }
  };

  return (
    <div className="post-header">
      <div className="post-avatar-block">
        <img
          src={avatarUser || defaultAvatar}
          alt="avatar"
          className="avatar"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <div
            className="post-author text-gray-700 hover:text-blue-500 hover:underline cursor-pointer"
            onClick={() => profileUser(post.user_id)}
          >
            {post?.username ||
              post?.author_name ||
              post?.email ||
              userEmail ||
              `Người dùng #${post?.user_id}`}
          </div>
          <div className="post-time">
            {post?.post_time ? timeAgo(post.post_time) : ""}
          </div>
        </div>
      </div>
      <div className="post-dropdown-wrapper">
        <button className="post-dropdown-btn" onClick={() => setOpen(!open)}>
          <SlOptionsVertical size={18} color="gray" />
        </button>
        {open && (
          <div className="post-dropdown-menu">
            <div
              className="post-dropdown-item"
              onClick={onEdit}
              style={{ animationDelay: "0.05s" }}
            >
              Chỉnh sửa
            </div>
            {post.user_id === currentUser?.user_id && (
              <Popconfirm
                title="Xóa bài đăng"
                description="Bạn có chắc muốn xóa bài đăng này không?"
                onConfirm={() => onDelete(post.post_id)}
                okText="Có"
                cancelText="Không"
                okButtonProps={{ danger: true }}
              >
                <div
                  style={{ animationDelay: "0.15s" }}
                  className="post-dropdown-item text-red-600"
                >
                  Xóa
                </div>
              </Popconfirm>
            )}

            <div
              style={{ animationDelay: "0.25s" }}
              className="post-dropdown-item"
            >
              Chi tiết
            </div>
            <div
              style={{ animationDelay: "0.35s" }}
              className="post-dropdown-item"
              onClick={async (e) => {
                e.stopPropagation(); // Prevent the post item click from being triggered
                setOpen(false); // Close the dropdown after clicking
                try {
                  const response = await onSavePost(post.id || post.post_id);
                  toast.success(
                    response.message || "Bài viết đã được lưu thành công!"
                  );
                } catch (error) {
                  toast.error("Lỗi khi lưu bài viết.");
                }
              }}
            >
              Lưu bài viết
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
