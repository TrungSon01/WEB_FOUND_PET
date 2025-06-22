import React from "react";

export default function CommentForm({
  comment,
  setComment,
  sending,
  handleSend,
}) {
  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 mt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        placeholder="Viết bình luận..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={sending}
        className="flex-1 border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <button
        type="submit"
        disabled={sending || !comment.trim()}
        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
      >
        {sending ? "Đang gửi..." : "Đăng"}
      </button>
    </form>
  );
}
