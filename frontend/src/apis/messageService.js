import { io } from "socket.io-client";

// Simple client wrapper for socket.io using the server default in this repo.
// Adjust SERVER_URL to match backend host/port.
const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

let socket = null;

export function initSocket(userId) {
  if (socket) return socket;

  socket = io(SERVER_URL, {
    transports: ["websocket"],
    auth: {},
  });

  socket.on("connect", () => {
    console.log("Socket connected", socket.id);
    if (userId) socket.emit("userOnline", { userId });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
}

export function sendMessage(payload) {
  if (!socket) throw new Error("Socket not initialized");
  socket.emit("createMessage", payload);
}

export function onNewMessage(cb) {
  if (!socket) throw new Error("Socket not initialized");
  socket.on("newMessage", cb);
}

export function offNewMessage(cb) {
  if (!socket) return;
  socket.off("newMessage", cb);
}

export function getUserConversations(userId, cb) {
  if (!socket) throw new Error("Socket not initialized");
  socket.emit("getUserConversations", { userId }, (res) => cb(res));
}

export default {
  initSocket,
  sendMessage,
  onNewMessage,
  offNewMessage,
  getUserConversations,
};
