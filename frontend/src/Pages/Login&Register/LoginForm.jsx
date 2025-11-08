import { Button, Checkbox, Form, Input, Row, Col, Tooltip } from "antd";
import { loginService } from "../../apis/userService";
import { useDispatch } from "react-redux";
import { setUserAction } from "../../redux/userSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FaGoogle, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";
import { hideLoading, showLoading } from "../../redux/loadingSlice";
// dispatch với use selector
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // jsx = html + js
  const handleLogin = (email, password) => {
    loginService({ email, password })
      .then((user) => {
        dispatch(setUserAction(user));

        const userAccount = {
          username: user.username,
          email: user.email,
          password: user.password,
          user_id: user.user_id,
          phone: user.phone,
        };

        console.log("userAccount", userAccount.user_id);
        localStorage.setItem("userAccount", JSON.stringify(userAccount));
        navigate("/");
        toast.success("đăng nhập thành công");
      })
      .catch((err) => {
        console.error("Lỗi khi đăng nhập:", err);
        toast.error("đăng nhập thất bại", err);
      });
  };

  const onFinish = (values) => {
    handleLogin(values.email, values.password);
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="login-container shadow shadow-gray-500 transition-shadow duration-300 hover:shadow-2xl hover:shadow-gray-500">
        <Form
          name="login"
          initialValues={{}}
          onFinish={onFinish}
          className="login-form"
        >
          <div className="grid grid-cols-2 items-center gap-x-12 relative before:content-[''] before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-gray-200 before:to-gray-400">
            <div>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="login-button"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className="flex justify-center items-center mt-6 space-x-8">
                <Tooltip title="Đăng nhập bằng Google">
                  <FaGoogle
                    onClick={() => handleSocialLogin("google")}
                    className="text-3xl text-[#DB4437] hover:text-[#c23321] cursor-pointer transition-transform transform hover:scale-125"
                  />
                </Tooltip>

                <Tooltip title="Đăng nhập bằng Facebook">
                  <FaFacebookF
                    onClick={() => handleSocialLogin("facebook")}
                    className="text-3xl text-[#1877F2] hover:text-[#0d65d9] cursor-pointer transition-transform transform hover:scale-125"
                  />
                </Tooltip>

                <Tooltip title="Đăng nhập bằng Instagram">
                  <FaInstagram
                    onClick={() => handleSocialLogin("instagram")}
                    className="text-3xl text-[#E4405F] hover:text-[#cc2e50] cursor-pointer transition-transform transform hover:scale-125"
                  />
                </Tooltip>

                <Tooltip title="Đăng nhập bằng GitHub">
                  <FaGithub
                    onClick={() => handleSocialLogin("github")}
                    className="text-3xl text-[#171515] hover:text-black cursor-pointer transition-transform transform hover:scale-125"
                  />
                </Tooltip>
              </div>
              <a href="/register" className="login-link">
                Bạn chưa có tài khoản? <strong>Đăng ký</strong>
              </a>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-bold mb-4">Đăng nhập</h2>
              <p className="text-gray-600 text-base leading-relaxed max-w-xs">
                Chào mừng bạn quay lại! Hãy đăng nhập để tiếp tục khám phá và
                trải nghiệm những tính năng tuyệt vời mà chúng tôi mang đến.
              </p>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
