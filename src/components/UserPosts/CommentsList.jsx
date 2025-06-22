// components/Post/CommentsList.jsx
import React from "react";

export default function CommentsList({ comments }) {
  return (
    <div className="comments-list">
      {comments.map((comment, i) => (
        <div key={i} className="comment">
          <strong>{comment.user}</strong>: {comment.text}
        </div>
      ))}
    </div>
  );
}
