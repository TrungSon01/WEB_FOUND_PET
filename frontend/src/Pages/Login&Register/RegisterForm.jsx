import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import "./Register.css";
// let navigate = useNavigate();
// const dispatch = useDispatch();
import { registerService } from "../../apis/userService";
import { registerServiceNest } from "../../apis/NestJS_api/userService";
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  let handleRegister = (user, onSuccess) => {
    registerServiceNest(user)
      .then(() => {
        toast.success("Đăng ký thành công");
        navigate("/login");
      })
      .catch(() => {
        toast.error("User đã tồn tại");
      });
  };
  const [form] = Form.useForm();

  const onFinish = (values) => {
    handleRegister(values, onSuccess);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="register-container shadow shadow-gray-500 transition-shadow duration-300 hover:shadow-2xl hover:shadow-gray-500 p-10 rounded-2xl">
        <div className="grid grid-cols-2 items-center gap-x-12 relative before:content-[''] before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-gray-200 before:to-gray-400">
          <div className="flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl font-bold mb-4">Đăng ký</h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-xs">
              Tạo tài khoản mới để bắt đầu hành trình của bạn cùng chúng tôi.
              Khám phá những tính năng thú vị và quản lý thông tin của bạn một
              cách dễ dàng!
            </p>
          </div>
          <div className="register-form w-full max-w-md">
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              initialValues={{ role: "user" }}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { type: "email", message: "Email không hợp lệ!" },
                  { required: true, message: "Vui lòng nhập email!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
              </Form.Item>

              <Form.Item name="role" hidden>
                <Input type="hidden" />
              </Form.Item>

              <Form.Item>
                <Button htmlType="submit" className="register-button w-full">
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>

            <div className="switch-link text-center">
              Bạn đã có tài khoản?{" "}
              <a href="/login">
                <strong>Đăng nhập</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
