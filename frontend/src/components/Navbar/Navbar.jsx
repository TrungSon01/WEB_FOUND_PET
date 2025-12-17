import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPlus,
  FaBookmark,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import UserMenu from "../UserMenu/UserMenu";
import Notification from "../Notification/Notification";

const Navbar = ({ onCreatePost, onNotificationPostClick, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      id: "home",
      icon: FaHouseChimney,
      label: "Trang chủ",
      onClick: () => {
        navigate("/");
        setMobileMenuOpen(false);
      },
      path: "/",
    },
    {
      id: "search",
      icon: FaSearch,
      label: "Tìm kiếm",
      onClick: () => {
        navigate("/search");
        setMobileMenuOpen(false);
      },
      path: "/search",
    },
    {
      id: "map",
      icon: FaMapMarkerAlt,
      label: "Bản đồ",
      onClick: () => {
        navigate("/map");
        setMobileMenuOpen(false);
      },
      path: "/map",
    },
    {
      id: "create",
      icon: FaPlus,
      label: "Tạo bài viết",
      onClick: () => {
        navigate("/create-post");
        setMobileMenuOpen(false);
      },
      path: "/create-post",
    },
    {
      id: "saved",
      icon: FaBookmark,
      label: "Đã lưu",
      onClick: () => {
        navigate("/saved-posts");
        setMobileMenuOpen(false);
      },
      path: "/saved-posts",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <nav className="fixed h-screen w-20 bg-gradient-to-b from-[#F6F6FF] to-white border-r border-[#E8E4FF] hidden lg:flex flex-col justify-between items-center py-5 z-50 shadow-lg">
        <div className="w-full flex justify-center">
          <UserMenu />
        </div>

        <div className="flex-1 flex flex-col justify-start items-center gap-2 mt-8 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`
                  relative group w-14 h-14 text-xl cursor-pointer flex flex-col justify-center items-center
                  transition-all duration-300 rounded-xl
                  ${
                    active
                      ? "text-white bg-gradient-to-br from-[#965BFF] to-[#5279FF] shadow-lg scale-105"
                      : "text-gray-600 hover:text-[#5279FF] hover:bg-gradient-to-br hover:from-[#F6F6FF] hover:to-[#E8E4FF] hover:scale-105"
                  }
                `}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className={active ? "animate-pulse" : ""} />

                {/* Tooltip */}
                <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></span>
                </span>
              </button>
            );
          })}

          {/* Notification Button */}
          <div className="relative group">
            <Notification
              onNotificationClick={onNotificationPostClick}
              className="relative w-14 h-14 text-xl cursor-pointer flex flex-col justify-center items-center transition-all duration-300 rounded-xl text-gray-600 hover:text-[#5279FF] hover:bg-gradient-to-br hover:from-[#F6F6FF] hover:to-[#E8E4FF] hover:scale-105"
              iconClassName="text-inherit"
              iconSize={22}
            />

            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
              Thông báo
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></span>
            </span>
          </div>
        </div>

        <div className="mb-2"></div>
      </nav>

      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#F6F6FF] to-white border-b border-[#E8E4FF] lg:hidden flex items-center justify-between px-4 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#965BFF] to-[#5279FF] text-white hover:scale-105 transition-transform duration-200 shadow-lg"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#965BFF] to-[#5279FF] bg-clip-text text-transparent">
            Social App
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/search")}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F6F6FF] text-gray-600 hover:text-[#5279FF] transition-all duration-200"
          >
            <FaSearch size={18} />
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40 transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <nav
          className={`fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[#F6F6FF] to-white shadow-2xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#965BFF] to-[#5279FF] bg-clip-text text-transparent">
                Menu
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E8E4FF] text-gray-600 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-left
                      ${
                        active
                          ? "bg-gradient-to-r from-[#965BFF] to-[#5279FF] text-white shadow-lg"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-[#F6F6FF] hover:to-[#E8E4FF] hover:text-[#5279FF]"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Notification Item */}
              <div className="w-full">
                <Notification
                  onNotificationClick={(postId) => {
                    onNotificationPostClick(postId);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-[#F6F6FF] hover:to-[#E8E4FF] hover:text-[#5279FF] transition-all duration-200 text-left"
                  iconSize={20}
                  iconClassName="text-inherit"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-[#F6F6FF] to-white border-t border-[#E8E4FF] lg:hidden flex items-center justify-around px-2 z-40 shadow-2xl">
        {[navItems[0], navItems[1], navItems[3], navItems[4]].map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`
                flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200
                ${
                  active
                    ? "text-white bg-gradient-to-br from-[#965BFF] to-[#5279FF] shadow-lg scale-105"
                    : "text-gray-600 hover:text-[#5279FF] hover:bg-[#F6F6FF]"
                }
              `}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
