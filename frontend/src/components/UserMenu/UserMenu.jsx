import React, { useEffect, useState } from "react";
import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import "./UserMenu.css";
export default function UserMenu() {
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userAccount"));
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  const handleLogout = () => {
    // 1. Xóa Redux
    dispatch(logoutUser());

    // 2. Xóa localStorage
    localStorage.removeItem("userAccount");

    // 3. Điều hướng về trang login
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: (
        <span className="dropdown-item" style={{ animationDelay: "0.1s" }}>
          Tên: {user?.email}
        </span>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <span
          className="dropdown-item"
          onClick={() => navigate("/profile")}
          style={{ animationDelay: "0.25s" }}
        >
          Hồ sơ cá nhân
        </span>
      ),
    },
    {
      type: "divider",
    },

    {
      key: "3",
      label: (
        <span
          className="dropdown-item"
          onClick={() =>
            (window.location.href =
              "http://127.0.0.1:8000/admin/login/?next=/admin/")
          }
          style={{ animationDelay: "0.4s" }}
        >
          Trang quản lý
        </span>
      ),
    },

    {
      type: "divider",
    },

    {
      key: "4",
      label: (
        <span
          className="dropdown-item"
          onClick={handleLogout}
          style={{ animationDelay: "0.55s" }}
        >
          Đăng xuất
        </span>
      ),
    },
  ];

  if (!user) return null;

  return (
    <div className="flex justify-end p-4">
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        arrow
        trigger={["click"]}
      >
        <Avatar
          size="large"
          icon={<UserOutlined />}
          className="cursor-pointer"
        />
      </Dropdown>
    </div>
  );
}
