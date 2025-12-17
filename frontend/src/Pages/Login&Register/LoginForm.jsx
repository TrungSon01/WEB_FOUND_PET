import { Button, Form, Input, Tooltip } from "antd";
import { loginService } from "../../apis/userService";
import { useDispatch } from "react-redux";
import { setUserAction } from "../../redux/userSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FaGoogle, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";
import { loginServiceNest } from "../../apis/NestJS_api/userService";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hàm xử lý sau khi login thành công
  const handleLoginSuccess = (userData) => {
    dispatch(setUserAction(userData));

    const userAccount = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      user_id: userData.user_id,
      avatar: userData.avatar || "No avatar",
    };

    localStorage.setItem("userAccount", JSON.stringify(userAccount));
    navigate("/");
    toast.success("Đăng nhập thành công");
  };

  const handleLogin = async (user) => {
    try {
      console.log("Đang thử đăng nhập qua cả 2 backend...");

      const racePromises = [
        // NestJS với timeout 3s
        Promise.race([
          loginServiceNest(user).then((res) => ({
            source: "NestJS",
            success: res?.success && res?.user,
            data: res?.user,
          })),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("NestJS timeout")), 3000)
          ),
        ]).catch((err) => ({
          source: "NestJS",
          success: false,
          error: err.message,
        })),

        // Django với timeout 3s
        Promise.race([
          loginService(user).then((res) => ({
            source: "Django",
            success: res && res.user_id,
            data: res,
          })),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Django timeout")), 3000)
          ),
        ]).catch((err) => ({
          source: "Django",
          success: false,
          error: err.message,
        })),
      ];

      const results = await Promise.all(racePromises);

      // Ưu tiên NestJS nếu cả 2 đều thành công
      const successResult = results.find((r) => r.success) || results[0];
      console.log(successResult);
      if (successResult.success) {
        console.log(`Đăng nhập thành công qua ${successResult.source}`);
        handleLoginSuccess(successResult.data);
      } else {
        console.error("Cả 2 backend đều thất bại:", results);
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (error) {
      console.error("Lỗi không mong muốn:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const onFinish = (values) => {
    handleLogin(values);
  };

  const handleSocialLogin = (type) => {
    const socialUrls = {
      google: "http://localhost:8001/api/authentication/google",
      facebook: "http://localhost:8001/api/authentication/facebook",
      github: "http://localhost:8001/api/authentication/github",
    };

    if (socialUrls[type]) {
      window.location.href = socialUrls[type];
    }
  };

  const socialIcons = [
    {
      name: "google",
      Icon: FaGoogle,
      color: "text-[#DB4437]",
      hoverColor: "hover:text-[#c23321]",
      title: "Đăng nhập bằng Google",
    },
    {
      name: "facebook",
      Icon: FaFacebookF,
      color: "text-[#1877F2]",
      hoverColor: "hover:text-[#0d65d9]",
      title: "Đăng nhập bằng Facebook",
    },
    {
      name: "instagram",
      Icon: FaInstagram,
      color: "text-[#E4405F]",
      hoverColor: "hover:text-[#cc2e50]",
      title: "Đăng nhập bằng Instagram",
    },
    {
      name: "github",
      Icon: FaGithub,
      color: "text-[#171515]",
      hoverColor: "hover:text-black",
      title: "Đăng nhập bằng GitHub",
    },
  ];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="login-container shadow shadow-gray-500 transition-shadow duration-300 hover:shadow-2xl hover:shadow-gray-500">
        <Form
          name="login"
          initialValues={{}}
          onFinish={onFinish}
          className="login-form"
        >
          <div className="grid grid-cols-2 items-center gap-x-12 relative before:content-[''] before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-gray-200 before:to-gray-400">
            {/* Form Section */}
            <div>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
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

              {/* Social Login Icons */}
              <div className="flex justify-center items-center mt-6 space-x-8">
                {socialIcons.map(({ name, Icon, color, hoverColor, title }) => (
                  <Tooltip key={name} title={title}>
                    <Icon
                      onClick={() => handleSocialLogin(name)}
                      className={`text-3xl ${color} ${hoverColor} cursor-pointer transition-transform transform hover:scale-125`}
                    />
                  </Tooltip>
                ))}
              </div>

              <a href="/register" className="login-link">
                Bạn chưa có tài khoản? <strong>Đăng ký</strong>
              </a>
            </div>

            {/* Welcome Section */}
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
