import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  loginService,
  registerService,
} from "../../apis/userService";
import { useDispatch } from "react-redux";
import { setUserAction } from "../../redux/userSlice";
import { decodeAccessToken } from "../../common/token/tokens.common";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");

      if (!accessToken) return;

      const userInfo = decodeAccessToken(accessToken);

      const data = {
        username: userInfo.username,
        password: userInfo.password || "",
        email: userInfo.email,
        user_id: userInfo.user_id,
        avatar: userInfo.avatar,
        role: userInfo.role,
      };

      console.log("Decoded user:", data);

      const res = await getUserById(data.user_id);
      if (res.error) {
        try {
          console.log("đã chạy đến đây");
          const createdUser = await registerService(data);
          dispatch(setUserAction(createdUser));
          localStorage.setItem("userAccount", JSON.stringify(createdUser));
          navigate("/");
        } catch (err) {
          console.log("Lỗi tạo user qua Google:", err);
        }
      } else {
        dispatch(setUserAction(res));
        localStorage.setItem("userAccount", JSON.stringify(res));
      }

      navigate("/");
    };

    fetchUser();
  }, [navigate, dispatch]);

  return <div>Đang đăng nhập...</div>;
}
