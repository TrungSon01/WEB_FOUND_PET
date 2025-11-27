import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../../apis/userService";
import * as userSlice from "../../../redux/userSlice";

export default function useUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const user_id = userAccount.user_id;

    if (!user_id) {
      setError("Không tìm thấy user_id. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserById(user_id)
      .then((res) => setUser(res.data))
      .catch(() => setError("Không thể tải thông tin người dùng."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    dispatch(userSlice.logoutUser());
    localStorage.removeItem("userAccount");
    navigate("/login");
  };

  return { user, loading, error, handleLogout };
}
