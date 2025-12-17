import React, { useEffect, useState } from "react";
import { Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MessageOutlined,
  DashboardOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import "./UserMenu.css";
import { getAvatarUrl } from "../../common/functions/app.function";

export default function UserMenu() {
  const [userInfo, setUserInfo] = useState(null);
  const [avatarUser, setAvatarUser] = useState("");
  const { user } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userAccount"));
    const avatarUser = getAvatarUrl(user?.avatar);
    if (user) {
      setUserInfo(user);
      const avatarUser = getAvatarUrl(user?.avatar);
      setAvatarUser(avatarUser);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("userAccount");
    navigate("/login");
  };

  const items = [
    {
      key: "profile-info",
      label: (
        <div
          className="dropdown-profile-header"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="profile-avatar-wrapper">
            {avatarUser ? (
              <img
                src={avatarUser}
                alt="avatar"
                className="profile-avatar-img"
              />
            ) : (
              <Avatar
                size={48}
                icon={<UserOutlined />}
                className="profile-avatar-default"
              />
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.username || "Người dùng"}</div>
            <div className="profile-email">
              <MailOutlined className="email-icon" />
              {user?.email || "email@example.com"}
            </div>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
      style: { margin: "8px 0", backgroundColor: "#E8E4FF" },
    },
    {
      key: "2",
      label: (
        <div
          className="dropdown-item"
          onClick={() => navigate("/profile")}
          style={{ animationDelay: "0.1s" }}
        >
          <UserOutlined className="item-icon" />
          <span>Hồ sơ cá nhân</span>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="dropdown-item"
          onClick={() => navigate("/message")}
          style={{ animationDelay: "0.15s" }}
        >
          <MessageOutlined className="item-icon" />
          <span>Tin nhắn</span>
        </div>
      ),
    },
    ...(user?.role === "admin"
      ? [
          {
            key: "4",
            label: (
              <div
                className="dropdown-item"
                onClick={() =>
                  (window.location.href =
                    "http://127.0.0.1:8000/admin/login/?next=/admin/")
                }
                style={{ animationDelay: "0.2s" }}
              >
                <DashboardOutlined className="item-icon" />
                <span>Trang quản lý</span>
              </div>
            ),
          },
        ]
      : []),
    {
      type: "divider",
      style: { margin: "8px 0", backgroundColor: "#E8E4FF" },
    },
    {
      key: "5",
      label: (
        <div
          className="dropdown-item logout-item"
          onClick={handleLogout}
          style={{ animationDelay: "0.25s" }}
        >
          <LogoutOutlined className="item-icon" />
          <span>Đăng xuất</span>
        </div>
      ),
    },
  ];

  if (!user) return null;

  return (
    <div className="user-menu-wrapper">
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        trigger={["click"]}
        overlayClassName="custom-dropdown-overlay"
      >
        <div className="avatar-trigger">
          {avatarUser ? (
            <img src={avatarUser} alt="avatar" className="avatar-img" />
          ) : (
            <Avatar
              size={40}
              icon={<UserOutlined />}
              className="avatar-default"
            />
          )}
          <div className="avatar-status-dot"></div>
        </div>
      </Dropdown>
    </div>
  );
}
