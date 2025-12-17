import { notification } from "antd";
import { useEffect } from "react";

export const NoticMessage = ({
  message = "Thông báo",
  description = "Không có nội dung",
  pauseOnHover = true,
  onClickShowPost = () => {},
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (message && description) {
      api.open({
        message,
        description,
        pauseOnHover,
        placement: "topRight",
        style: {
          cursor: "pointer",
        },
        onClick: onClickShowPost,
      });
    }
  }, [message, description]);

  return <>{contextHolder}</>;
};
