import React, { useState, useEffect, useRef } from "react";
import { Send, Search, Plus, X } from "lucide-react";

import useMessageProfile from "./hooks/useMessage.js";

export default function Message() {
  const {
    allUsers,
    conversations,
    currentUserId,
    filteredConversations,
    filteredUsers,
    handleKeyPress,
    handleSelectConversation,
    handleSendMessage,
    handleStartNewChat,
    loadAllUsers,
    loadConversations,
    inputMessage,
    messages,
    searchQuery,
    selectedConversation,
    socket,
    userSearchQuery,
    messagesEndRef,
    setInputMessage,
    setSearchQuery,
    setSelectedConversation,
    setUserSearchQuery,
    showNewChatModal,
    setShowNewChatModal,
    getAvatarUrl,
  } = useMessageProfile();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Tin nhắn</h1>
            <button
              onClick={() => {
                setShowNewChatModal(true);
                loadAllUsers();
              }}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="Tin nhắn mới"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 px-4">
              <p className="mb-2">Chưa có cuộc trò chuyện nào</p>
              <p className="text-sm">Nhấn nút + để bắt đầu chat</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.chatGroupId}
                onClick={() => handleSelectConversation(conv)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedConversation?.chatGroupId === conv.chatGroupId
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  <img
                    src={getAvatarUrl(conv.otherUser?.avatar)}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt=""
                  />{" "}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {conv.otherUser?.username || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage?.messageText || "Bắt đầu trò chuyện"}
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
            <div className="bg-white border-b border-gray-200 p-2 flex items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold ">
                <img
                  src={getAvatarUrl(selectedConversation.otherUser?.avatar)}
                  style={{
                    width: "90px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "full",
                  }}
                />
              </div>
              <div className="ml-6">
                <h2 className="font-semibold text-gray-800">
                  {selectedConversation.otherUser?.username || "Unknown"}
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.userIdSender === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-2xl ${
                          isMe
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 shadow-sm"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.messageText}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`p-3 rounded-full ${
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
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
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

      {/* Modal chọn người chat mới */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Tin nhắn mới</h2>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setUserSearchQuery("");
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm người dùng..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Không tìm thấy người dùng
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => handleStartNewChat(user)}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
