import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  ImageIcon,
} from "lucide-react";
import {
  initSocket,
  sendMessage,
  onNewMessage,
  offNewMessage,
  getUserConversations,
} from "../../apis/messageService";

export default function Message() {
  const [currentUserId] = useState(1); // ID của user hiện tại (lấy từ auth)
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Khởi tạo socket khi component mount
  useEffect(() => {
    const socketInstance = initSocket(currentUserId);
    setSocket(socketInstance);

    // Lấy danh sách conversations
    loadConversations();

    // Lắng nghe tin nhắn mới
    const handleNewMessage = (message) => {
      console.log("New message received:", message);

      // Nếu tin nhắn thuộc conversation đang mở
      if (selectedConversation) {
        const isFromCurrentConversation =
          (message.userIdSender === selectedConversation.otherUser?.user_id &&
            message.chatGroupId === selectedConversation.chatGroupId) ||
          (message.userIdSender === currentUserId &&
            message.chatGroupId === selectedConversation.chatGroupId);

        if (isFromCurrentConversation) {
          setMessages((prev) => [...prev, message]);
        }
      }

      // Cập nhật danh sách conversations
      loadConversations();
    };

    // Lắng nghe sự kiện typing
    socketInstance.on("userTyping", ({ userId }) => {
      if (selectedConversation?.otherUser?.user_id === userId) {
        setIsTyping(true);
      }
    });

    socketInstance.on("userStopTyping", ({ userId }) => {
      if (selectedConversation?.otherUser?.user_id === userId) {
        setIsTyping(false);
      }
    });

    onNewMessage(handleNewMessage);

    return () => {
      offNewMessage(handleNewMessage);
      if (socketInstance) {
        socketInstance.off("userTyping");
        socketInstance.off("userStopTyping");
      }
    };
  }, [currentUserId, selectedConversation]);

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = () => {
    getUserConversations(currentUserId, (data) => {
      console.log("Conversations:", data);
      setConversations(data || []);
    });
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);

    // Lấy tin nhắn của conversation
    if (socket && conversation.otherUser) {
      socket.emit(
        "getConversation",
        {
          userId1: currentUserId,
          userId2: conversation.otherUser.user_id,
        },
        (data) => {
          console.log("Messages:", data);
          setMessages(data || []);
        }
      );
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !selectedConversation) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: selectedConversation.otherUser?.user_id,
      content: inputMessage.trim(),
    };

    sendMessage(messageData);
    setInputMessage("");

    // Stop typing
    if (socket) {
      socket.emit("stopTyping", {
        senderId: currentUserId,
        receiverId: selectedConversation.otherUser?.user_id,
      });
    }
  };

  const handleTyping = (e) => {
    setInputMessage(e.target.value);

    if (!socket || !selectedConversation) return;

    // Emit typing event
    socket.emit("typing", {
      senderId: currentUserId,
      receiverId: selectedConversation.otherUser?.user_id,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: currentUserId,
        receiverId: selectedConversation.otherUser?.user_id,
      });
    }, 1000);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Hôm qua";
    } else if (days < 7) {
      return d.toLocaleDateString("vi-VN", { weekday: "short" });
    } else {
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Danh sách conversations */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tin nhắn</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.chatGroupId}
                onClick={() => handleSelectConversation(conv)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                  selectedConversation?.chatGroupId === conv.chatGroupId
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                    {conv.otherUser?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {conv.otherUser?.username || "Unknown"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conv.lastMessage &&
                        formatTime(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage?.messageText || "Chưa có tin nhắn"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {selectedConversation.otherUser?.username
                    ?.charAt(0)
                    .toUpperCase() || "?"}
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold text-gray-800">
                    {selectedConversation.otherUser?.username || "Unknown"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isTyping ? "Đang nhập..." : "Đang hoạt động"}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.userIdSender === currentUserId;
                  const showAvatar =
                    index === 0 ||
                    messages[index - 1].userIdSender !== msg.userIdSender;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end ${
                        isMe ? "justify-end" : "justify-start"
                      } ${showAvatar ? "mt-4" : "mt-1"}`}
                    >
                      {!isMe && showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold mr-2 flex-shrink-0">
                          {msg.Users?.username?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      {!isMe && !showAvatar && <div className="w-8 mr-2" />}

                      <div
                        className={`max-w-md ${
                          isMe ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMe
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                          }`}
                        >
                          <p className="text-sm break-words">
                            {msg.messageText}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 px-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>

                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inputMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />

                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`p-3 rounded-full transition-all ${
                    inputMessage.trim()
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Send className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Chọn một cuộc trò chuyện
              </h2>
              <p className="text-gray-600">
                Chọn một người để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
