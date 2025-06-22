// components/Post/PostHeader.jsx
import React, { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const defaultAvatar =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
import { timeAgo } from "../../apis/postFormService";
import PostDetail from "./PostDetail";
import { getUserById } from "../../apis/userService";

export default function PostHeader({
  post,
  userEmail,
  onDelete,
  onEdit,
  onSavePost,
}) {
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useSelector((state) => state.userSlice);
const[username, setUsername] = useState("");
 useEffect(() => {
    if (post?.user_id) {
      getUserById(post.user_id)
        .then((res) => {
          setUsername(res.username); 
        })
        .catch((err) => {
          console.error("Lỗi khi lấy username:", err);
        });
    }
  }, [post?.user_id]);


  return (
    <div className="post-header">
      <div className="post-avatar-block">
        <img
          src={defaultAvatar}
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
          <div className="post-author text-gray-700">
            {post?.username ||
              post?.author_name ||
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
            <div className="post-dropdown-item" onClick={onEdit}>
              Chỉnh sửa
            </div>
            {post.user_id === currentUser?.user_id && (
              <div
                className="post-dropdown-item"
                onClick={() => onDelete(post.post_id)}
              >
                Xóa
              </div>
            )}
            <div className="post-dropdown-item">Chi tiết</div>
            <div
              className="post-dropdown-item"
              onClick={async (e) => {
                e.stopPropagation(); // Prevent the post item click from being triggered
                setOpen(false); // Close the dropdown after clicking
                try {
                  const response = await onSavePost(post.id || post.post_id);
                  alert(response.message || "Bài viết đã được lưu thành công!");
                } catch (error) {
                  alert("Lỗi khi lưu bài viết.");
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
