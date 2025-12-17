import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { getNotifications } from "../../apis/notificationService";
import { FaBell } from "react-icons/fa";
import "./Notification.css";
import { timeAgo } from "../../apis/postFormService";
import { notification } from "antd";
import toast from "react-hot-toast";
import { BellOutlined } from "@ant-design/icons";

export default function Notification({
  onNotificationClick,
  className = "",
  iconClassName = "",
  iconSize = 22,
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const closeTimer = useRef(null);
  const bellRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();

  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const ws = useRef(null);

  const fetchNotifications = async () => {
    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const user_id = userAccount.user_id;
    if (!user_id) return;
    setLoading(true);
    try {
      const data = await getNotifications(user_id);
      setNotifications(data);
      setUnread(data.filter((n) => !n.read_status).length);
    } catch {
      setNotifications([]);
      setUnread(0);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán vị trí dropdown thông minh
  const calculateDropdownPosition = () => {
    if (!bellRef.current) return;

    const rect = bellRef.current.getBoundingClientRect();
    const dropdownWidth = 380;
    const dropdownMaxHeight = window.innerHeight - 80;

    let top = rect.top + window.scrollY;
    let left = rect.right + 8 + window.scrollX;

    // Kiểm tra nếu dropdown vượt quá màn hình bên phải
    if (left + dropdownWidth > window.innerWidth) {
      left = rect.left + window.scrollX - dropdownWidth - 8;
    }

    // Kiểm tra nếu dropdown vượt quá màn hình bên dưới
    if (top + dropdownMaxHeight > window.innerHeight + window.scrollY) {
      top = Math.max(
        40,
        window.innerHeight + window.scrollY - dropdownMaxHeight - 20
      );
    }

    setDropdownPos({ top, left });
  };

  const handleBellClick = () => {
    if (!open) {
      fetchNotifications();
      setTimeout(calculateDropdownPosition, 0);
      startAutoCloseTimer();
    } else {
      clearAutoCloseTimer();
    }
    setOpen((prev) => !prev);
  };

  const handleNotificationClick = (post_id) => {
    setOpen(false);
    if (onNotificationClick) onNotificationClick(post_id);
    clearAutoCloseTimer();
  };

  const startAutoCloseTimer = () => {
    clearAutoCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 10000);
  };

  const clearAutoCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleDropdownMouseEnter = () => clearAutoCloseTimer();
  const handleDropdownMouseLeave = () => startAutoCloseTimer();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target) &&
        document.getElementById("notification-portal") &&
        !document.getElementById("notification-portal").contains(e.target)
      ) {
        setOpen(false);
        clearAutoCloseTimer();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // WebSocket connection
  useEffect(() => {
    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const user_id = userAccount.user_id;

    if (!user_id) return;

    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(
      `ws://localhost:8000/ws/notifications/${user_id}/`
    );

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
      fetchNotifications();
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);

      if (data.type === "notification_message") {
        setNotifications((prevNotifications) => {
          const newNotifications = [data.message, ...prevNotifications];
          return newNotifications;
        });
        setUnread((prevUnread) => prevUnread + 1);
      }
      toast.success("bạn có thông báo mới");
      api.open({
        message: (
          <span className="text-white font-semibold flex items-center gap-2">
            <BellOutlined className="text-yellow-400" />
            Thông báo mới từ hệ thống
          </span>
        ),
        description: (
          <div className="text-gray-200">
            {data.message || "Bạn có thông báo mới"}
          </div>
        ),
        placement: "topRight",
        duration: 6,
        style: {
          backgroundColor: "#374151",
          border: "1px solid #4b5563",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
          borderRadius: "0.75rem",
          cursor: "pointer",
          color: "white",
        },
        onClick: () => handleNotificationClick(data.post_id),
      });
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Tạo portal node
  useEffect(() => {
    let portal = document.getElementById("notification-portal");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "notification-portal";
      document.body.appendChild(portal);
    }
  }, []);

  // Recalculate position on window resize
  useEffect(() => {
    if (!open) return;
    const handleResize = () => calculateDropdownPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <>
      {contextHolder}
      <div className="notification-wrap">
        <button
          className={className || "notification-bell"}
          onClick={handleBellClick}
          ref={bellRef}
        >
          <FaBell size={iconSize} className={iconClassName} />
          {unread > 0 && <span className="notification-badge">{unread}</span>}
        </button>
        {open &&
          createPortal(
            <div
              className="notification-dropdown-right animate-fade-in"
              style={{
                position: "absolute",
                top: dropdownPos.top,
                left: dropdownPos.left,
                zIndex: 9999,
              }}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="notification-title">Thông báo</div>
              {loading ? (
                <div className="notification-loading">Đang tải...</div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty" />
              ) : (
                <ul className="notification-list">
                  {notifications.map((n) => (
                    <li
                      key={n.noti_id}
                      className={
                        "notification-item" + (!n.read_status ? " unread" : "")
                      }
                      onClick={() => handleNotificationClick(n.post_id)}
                    >
                      <div className="notification-content">{n.message}</div>
                      <div className="notification-time">
                        {timeAgo(n.created_at)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>,
            document.getElementById("notification-portal")
          )}
      </div>
    </>
  );
}
