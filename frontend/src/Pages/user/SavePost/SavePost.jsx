import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { savePost } from "../../apis/postFormService";

const SavePost = () => {
  const { postId } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleSavePost = async () => {
      try {
        const response = await savePost(postId);
        setMessage(response.message || "Bài viết đã được lưu thành công!");
      } catch (error) {
        setMessage("Lỗi khi lưu bài viết.");
      }
    };

    if (postId) {
      handleSavePost();
    }
  }, [postId]);

  return (
    <div>
      <h2>Lưu Bài Viết</h2>
      <p>{message}</p>
    </div>
  );
};

export default SavePost;
