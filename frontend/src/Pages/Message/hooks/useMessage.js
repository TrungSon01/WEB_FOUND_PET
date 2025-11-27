import { useEffect, useRef, useState } from "react";
import {
  getAllUsers,
  getUserConversations,
  initSocket,
  offNewMessage,
  onNewMessage,
  sendMessage,
} from "../../../apis/NestJS_api/messageService";

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

      const currentConv = selectedConversationRef.current;

      if (currentConv && message.chatGroupId === currentConv.chatGroupId) {
        setMessages((prev) => [...prev, message]);
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

    console.log("Gửi tin nhắn:", messageData);

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
  };
}
