import React, { useState } from "react";
import "./PostDetail.css";
import { createComment, getComments } from "../../apis/postFormService";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import { getUserById } from "../../apis/userService";
import { timeAgo } from "../../apis/postFormService";

export default function PostDetail({ post, comments, loading, onClose }) {
  const { user } = useSelector((state) => state.userSlice);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [reload, setReload] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  React.useEffect(() => {
    // lấy người dùng về
    const fetchUser = async () => {
      try {
        const res = await getUserById(post.user_id); // axios response
        setUserInfo(res.data); // lấy dữ liệu từ response
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
      setLocalComments([]); // trường hợp không có bình luận
    }
  }, [comments]);

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
      // Reload comments
      const newComments = await getComments(post.id || post.post_id);
      setLocalComments(newComments);
    } catch (err) {
      // handle error
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="post-detail-modal">
      <div className="post-detail-content">
        <button className="post-detail-close" onClick={onClose}>
          &times;
        </button>
        <h2>Chi tiết bài đăng</h2>
        <div className="post-detail-main">
          <img src={post.image} alt="pet" className="post-detail-image" />
          <div className="post-detail-info">
            <div>
              <b>Tác giả:</b> {userInfo?.username || "Đang tải..."}
            </div>
            <div>
              <b>Mô tả:</b> {post.description}
            </div>
            <div>
              <b>Loài:</b> {post.species}
            </div>
            <div>
              <b>Giống:</b> {post.breed}
            </div>
          </div>
        </div>
        <h3>Bình luận</h3>
        {loading ? (
          <div>Đang tải bình luận...</div>
        ) : localComments.length === 0 ? (
          <div>Chưa có bình luận nào.</div>
        ) : (
          <ul className="post-detail-comments">
            {localComments.map((cmt, index) => (
              <li
                key={`${cmt.cmt_id}-${cmt.created_at}-${index}`}
                className="post-detail-comment"
              >
                <div>
                  <b>Người gửi:</b> {cmt.username}
                </div>

                <div>
                  {" "}
                  <b>Nội dung: </b>
                  {cmt.content}
                </div>

                <div className="post-detail-comment-time">
                  {timeAgo(cmt.created_at)}
                </div>
              </li>
            ))}
          </ul>
        )}
        {user && (
          <CommentForm
            comment={comment}
            setComment={setComment}
            sending={sending}
            handleSend={handleSend}
          />
        )}
      </div>
    </div>
  );
}
