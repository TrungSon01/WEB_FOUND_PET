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
import { registerService } from "../apis/userService";
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
    console.log("user want register", user);
    registerService(user)
      .then((res) => {
        console.log("register success", res);
        toast.success("Đăng kí tài khoản thành công");
        navigate("/login");
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.log("register failed", err);
        toast.error("Đăng kí thất bại, lỗi lỗi lỗi ...");
      });
  };
  const [form] = Form.useForm();

  const onFinish = (values) => {
    handleRegister(values, onSuccess);
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="register-container shadow shadow-gray-500 transition-shadow duration-300 hover:shadow-2xl hover:shadow-gray-500">
        <div className="register-form">
          <div className="register-title">Đăng ký</div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{ role: false }}
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
              <Button htmlType="submit" className="register-button">
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <div className="switch-link">
            Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
