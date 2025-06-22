// components/Post/PostItem.jsx
import React, { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import {
  createComment,
  getComments,
  savePost,
} from "../../apis/postFormService";
import { useSelector } from "react-redux";
import { useRef } from "react";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";

export default function PostItem({
  post,
  user,
  userEmail,
  onDelete,
  onEdit,
  onClick,
}) {
  const { user: currentUser } = useSelector((state) => state.userSlice);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [localComments, setLocalComments] = useState([]);

  // Load comments for this post when mounted (optional, or can skip for perf)
  // React.useEffect(() => {
  //   getComments(post.id || post.post_id).then(setLocalComments);
  // }, [post.id, post.post_id]);

  const handleSend = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      await createComment(post.id || post.post_id, {
        content: comment,
        sender_id: currentUser?.user_id,
        receiver_id: post.user_id,
      });
      setComment("");
      // Reload comments for this post (optional)
      // const newComments = await getComments(post.id || post.post_id);
      // setLocalComments(newComments);
    } catch (err) {
      // handle error
    } finally {
      setSending(false);
    }
  };

  const lastClickTime = useRef(0);
  const DOUBLE_CLICK_DELAY = 180; // giảm thời gian nhận double click xuống 200ms

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < DOUBLE_CLICK_DELAY) {
      onClick(post); // xử lý double click
    }
    lastClickTime.current = now;
  };

  return (
    <div
      className="post-item"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <PostHeader
        post={post}
        user={user}
        onDelete={onDelete}
        onEdit={onEdit}
        userEmail={userEmail}
        onSavePost={savePost}
      />
      <PostContent post={post} />
      <PostActions post={post} />
      {currentUser && (
        <CommentForm
          comment={comment}
          setComment={setComment}
          sending={sending}
          handleSend={handleSend}
        />
      )}
    </div>
  );
}
