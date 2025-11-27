import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8001"; // URL backend của bạn
let socket = null;

// Khởi tạo socket
export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};

// Gửi tin nhắn
export const sendMessage = (messageData) => {
  if (socket) {
    console.log("📤 Gửi tin nhắn:", messageData);
    socket.emit("sendMessage", messageData);
  }
};

// Lắng nghe tin nhắn mới
export const onNewMessage = (callback) => {
  if (socket) {
    socket.on("newMessage", callback);
  }
};

// Hủy lắng nghe tin nhắn
export const offNewMessage = (callback) => {
  if (socket) {
    socket.off("newMessage", callback);
  }
};

// Lấy danh sách conversations (qua HTTP)
export const getUserConversations = async (userId, callback) => {
  try {
    console.log(`🔍 Đang lấy conversations cho user ${userId}`);
    const response = await fetch(
      `${SOCKET_URL}/api/messages/conversations/${userId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Đã lấy conversations:", data);

    callback(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("❌ Lỗi khi lấy conversations:", error);
    callback([]);
  }
};
// Thêm vào file messageService.js
export const getAllUsers = async (currentUserId, callback) => {
  try {
    const response = await fetch(`${SOCKET_URL}/api/user`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Lọc bỏ user hiện tại
    const filteredUsers = data.filter((user) => user.user_id !== currentUserId);
    callback(filteredUsers);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách users:", error);
    callback([]);
  }
};
