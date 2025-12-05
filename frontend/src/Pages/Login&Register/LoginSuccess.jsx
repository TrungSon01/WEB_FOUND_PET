import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserAction } from "../../redux/userSlice";
import { decodeAccessToken } from "../../common/token/tokens.common";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserFromToken = () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");

      if (!accessToken) {
        console.error("Access token không tồn tại!");
        navigate("/login");
        return;
      }

      try {
        const userInfo = decodeAccessToken(accessToken);

        // Lưu vào Redux store
        dispatch(setUserAction(userInfo));

        localStorage.setItem("userAccount", JSON.stringify(userInfo));

        navigate("/");
      } catch (error) {
        console.error("Lỗi decode token:", error);
        navigate("/login");
      }
    };

    fetchUserFromToken();
  }, [navigate, dispatch]);

  return <div>Đang đăng nhập...</div>;
}
