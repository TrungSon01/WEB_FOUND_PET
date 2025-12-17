import { useEffect, useRef, useState } from "react";
import {
  getAllUsers,
  getUserConversations,
  initSocket,
  offNewMessage,
  onNewMessage,
  sendMessage,
} from "../../../apis/NestJS_api/messageService";
import { CLOUNDINARY_IMAGE_URL } from "../../../common/url/url.common";
export default function useMessageProfile() {
  const [currentUserId, setCurrentUserId] = useState(1);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const messagesEndRef = useRef();
  const selectedConversationRef = useRef(selectedConversation);

  const checkAvatar = (avatar) => {
    if (avatar === null) return "null";
    const avatarUser = `${avatar}`;
    console.log(avatarUser);
    if (
      avatarUser[0] == "h" &&
      avatarUser[1] == "t" &&
      avatarUser[2] == "t" &&
      avatarUser[3] == "p"
    ) {
      return "google";
    }
    return "cloud";
  };

  const user = localStorage.getItem("userAccount");
  const userJson = user ? JSON.parse(user) : null;

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    const user = localStorage.getItem("userAccount");
    if (!user) {
      console.error("Không tìm thấy user trong localStorage");
      return;
    }

    const userJson = JSON.parse(user);
    setCurrentUserId(userJson.user_id);

    const socketInstance = initSocket(userJson.user_id);
    setSocket(socketInstance);

    loadConversations(userJson.user_id);

    const handleNewMessage = (message) => {
      console.log("Nhận tin nhắn mới:", message);
      console.log("Current user ID:", userJson.user_id); // ✅ Thêm log này
      console.log("Message sender ID:", message.userIdSender); // ✅ Thêm log này

      const currentConv = selectedConversationRef.current;

      if (currentConv && message.chatGroupId === currentConv.chatGroupId) {
        // ✅ Dùng userJson.user_id thay vì currentUserId
        if (message.userIdSender !== userJson.user_id) {
          setMessages((prev) => [...prev, message]);
        }
      }

      loadConversations(userJson.user_id);
    };

    onNewMessage(handleNewMessage);

    return () => {
      offNewMessage(handleNewMessage);
    };
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = (userId) => {
    getUserConversations(userId || currentUserId, (data) => {
      setConversations(Array.isArray(data) ? data : []);
    });
  };

  const loadAllUsers = () => {
    getAllUsers(currentUserId, (data) => {
      setAllUsers(Array.isArray(data) ? data : []);
    });
  };

  const handleSelectConversation = (conversation) => {
    console.log("Chọn conversation:", conversation);
    setSelectedConversation(conversation);

    if (socket && conversation.otherUser) {
      socket.emit(
        "getConversation",
        {
          userId1: currentUserId,
          userId2: conversation.otherUser.user_id,
        },
        (data) => {
          console.log("Lịch sử tin nhắn:", data);
          setMessages(Array.isArray(data) ? data : []);
        }
      );
    }
  };

  const handleStartNewChat = (user) => {
    const existingConv = conversations.find(
      (conv) => conv.otherUser?.user_id === user.user_id
    );

    if (existingConv) {
      handleSelectConversation(existingConv);
    } else {
      const newConversation = {
        chatGroupId: `temp_${user.user_id}`,
        otherUser: user,
        lastMessage: null,
      };
      setSelectedConversation(newConversation);
      setMessages([]);
    }

    setShowNewChatModal(false);
    setUserSearchQuery("");
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedConversation) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: selectedConversation.otherUser?.user_id,
      content: inputMessage.trim(),
    };

    const tempMessage = {
      id: `temp_${Date.now()}`,
      userIdSender: currentUserId,
      messageText: inputMessage.trim(),
      chatGroupId: selectedConversation.chatGroupId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInputMessage("");

    sendMessage(messageData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = Array.isArray(conversations)
    ? conversations.filter((conv) =>
        conv.otherUser?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredUsers = allUsers.filter((user) =>
    user.username?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const getAvatarUrl = (avatar) => {
    if (checkAvatar(avatar) == "cloud")
      return `${CLOUNDINARY_IMAGE_URL}/${avatar}`; // true <==> cloud
    else if (checkAvatar(avatar) == "google")
      return avatar; // false <==> google
    else if (checkAvatar(avatar) === "null")
      return "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg";
  };

  return {
    currentUserId,
    conversations,
    selectedConversation,
    messages,
    inputMessage,
    searchQuery,
    socket,
    allUsers,
    userSearchQuery,
    filteredUsers,
    filteredConversations,
    showNewChatModal,
    handleKeyPress,
    handleSelectConversation,
    handleSendMessage,
    handleStartNewChat,
    loadAllUsers,
    loadConversations,
    messagesEndRef,
    setInputMessage,
    setSearchQuery,
    setSelectedConversation,
    setUserSearchQuery,
    setShowNewChatModal,
    getAvatarUrl,
  };
}
