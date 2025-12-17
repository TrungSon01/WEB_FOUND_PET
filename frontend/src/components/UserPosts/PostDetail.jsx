import React, { useState } from "react";
import "./PostDetail.css";
import { createComment, getComments } from "../../apis/postFormService";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import { getUserById } from "../../apis/userService";
import { timeAgo } from "../../apis/postFormService";
import { FaTimes, FaUser, FaPaw, FaDna, FaComment } from "react-icons/fa";

export default function PostDetail({ post, comments, loading, onClose }) {
  const { user } = useSelector((state) => state.userSlice);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [userInfo, setUserInfo] = useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(post.user_id);
        setUserInfo(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin user:", err);
      }
    };
    if (post.user_id) {
      fetchUser();
    }

    const loadCommentsWithUser = async () => {
      try {
        const updatedComments = await Promise.all(
          comments.map(async (cmt) => {
            try {
              const userRes = await getUserById(cmt.sender_id);
              return {
                ...cmt,
                username: userRes.data.username,
              };
            } catch (err) {
              console.error("Lỗi lấy user cho comment:", err);
              return {
                ...cmt,
                username: "Không rõ",
              };
            }
          })
        );
        setLocalComments(updatedComments);
      } catch (err) {
        console.error("Lỗi xử lý comment:", err);
      }
    };

    if (comments && comments.length > 0) {
      loadCommentsWithUser();
    } else {
      setLocalComments([]);
    }
  }, [comments, post.user_id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      await createComment(post.id || post.post_id, {
        content: comment,
        sender_id: user?.user_id,
        receiver_id: post.user_id,
      });
      setComment("");
      const newComments = await getComments(post.id || post.post_id);

      // Load usernames for new comments
      const updatedComments = await Promise.all(
        newComments.map(async (cmt) => {
          try {
            const userRes = await getUserById(cmt.sender_id);
            return { ...cmt, username: userRes.data.username };
          } catch (err) {
            return { ...cmt, username: "Không rõ" };
          }
        })
      );
      setLocalComments(updatedComments);
    } catch (err) {
      console.error("Lỗi gửi comment:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="post-detail-modal" onClick={onClose}>
      <div className="post-detail-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="post-detail-header">
          <h2 className="post-detail-title">Chi tiết bài đăng</h2>
          <button className="post-detail-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Main Content */}
        <div className="border-b border-gray-100">
          <div className="post-detail-main">
            <div className="post-detail-image-wrapper">
              <img
                src={post.image}
                alt="pet"
                className="post-detail-image"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x300?text=No+Image";
                }}
              />
            </div>

            <div className="post-detail-info">
              {/* Tác giả - Riêng 1 dòng */}
              <div className="info-item">
                <FaUser className="info-icon" />
                <div>
                  <span className="info-label">Tác giả</span>
                  <span className="info-value">
                    {userInfo?.username || "Đang tải..."}
                  </span>
                </div>
              </div>

              {/* Loài và Giống - Cùng 1 dòng */}
              <div className="info-row">
                <div className="info-item">
                  <FaPaw className="info-icon" />
                  <div>
                    <span className="info-label">Loài</span>
                    <span className="info-value">
                      {post.species || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <FaDna className="info-icon" />
                  <div>
                    <span className="info-label">Giống</span>
                    <span className="info-value">
                      {post.breed || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mô tả - Chiếm toàn bộ chiều rộng */}
          {post.description && (
            <div className="mx-7 mb-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Mô tả
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-3">
                  {post.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="post-detail-comments-section">
          <div className="comments-header">
            <FaComment className="comments-icon" />
            <h3>Bình luận ({localComments.length})</h3>
          </div>

          <div className="comments-list-wrapper">
            {loading ? (
              <div className="comments-loading">
                <div className="loading-spinner-small"></div>
                <p>Đang tải bình luận...</p>
              </div>
            ) : localComments.length === 0 ? (
              <div className="comments-empty">
                <div className="empty-icon">💬</div>
                <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              <ul className="post-detail-comments">
                {localComments.map((cmt, index) => (
                  <li
                    key={`${cmt.cmt_id}-${cmt.created_at}-${index}`}
                    className="post-detail-comment"
                  >
                    <div className="comment-avatar">
                      {cmt.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="comment-body">
                      <div className="comment-header-info">
                        <span className="comment-username">{cmt.username}</span>
                        <span className="comment-time">
                          {timeAgo(cmt.created_at)}
                        </span>
                      </div>
                      <p className="comment-content">{cmt.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Comment Form */}
          {user && (
            <div className="comment-form-wrapper">
              <CommentForm
                comment={comment}
                setComment={setComment}
                sending={sending}
                handleSend={handleSend}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
