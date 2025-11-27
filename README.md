🐾 WEB_FOUND_PET — Hệ thống tìm thú cưng thất lạc
<p align="center"> <img src="https://img.shields.io/badge/Status-Active-brightgreen" /> <img src="https://img.shields.io/badge/Version-1.0.0-blue" /> </p> <p align="center"> <img src="https://i.imgur.com/OQJY7l2.jpeg" width="600" /> </p>
🚀 Giới thiệu

WEB_FOUND_PET là nền tảng giúp cộng đồng tìm và trả lại thú cưng thất lạc.
Hệ thống hỗ trợ đăng tin, định vị, nhắn tin thời gian thực, và đăng nhập bằng mạng xã hội.

🧠 Công nghệ sử dụng
<p align="center"> <img src="https://skillicons.dev/icons?i=react,vite,nestjs,django,mysql,docker,prisma,redis,js,ts,github,facebook,google" /> </p>
🛠️ Danh sách công nghệ chi tiết
⚛️ Frontend

React + Vite

JavaScript / TypeScript

Fetch API / Axios

Socket.IO Client

🔴 Backend 1 – NestJS

NestJS

Prisma ORM

JWT Authentication

OAuth2 (Google, Facebook, GitHub, Instagram)

Socket.IO Realtime

Redis Pub/Sub

🟩 Backend 2 – Django

Django

Django REST Framework

MySQL

Docker-compose môi trường backend

🐳 Docker

Container hóa toàn bộ hệ thống

Tách môi trường độc lập:

NestJS

Django

MySQL

Redis

📦 Cài đặt và chạy dự án
1️⃣ Clone dự án
git clone https://github.com/TrungSon01/WEB_FOUND_PET

2️⃣ Chạy NestJS Backend
cd nestjs
npm install
npm run dev

3️⃣ Chạy Django Backend (Docker)
cd backend/myprojectc
docker-compose up --build

4️⃣ Chạy frontend

Frontend thường nằm trong thư mục frontend/ (hoặc Vite root):

npm install
npm run dev


Sau đó truy cập:

👉 http://localhost:5173

📁 Cấu trúc thư mục
WEB_FOUND_PET/
│── nestjs/            # Backend chính (SocketIO + JWT + OAuth + Prisma)
│── backend/           # Django API + Docker
│── frontend/          # React + Vite
│── docs/              # Hình ảnh - tài liệu
└── README.md

✨ Tính năng chính

📍 Định vị thú cưng thất lạc

🔍 Đăng tin tìm / nhặt thú cưng

💬 Chat realtime (Socket.IO)

👤 Đăng nhập bằng Google/Facebook/GitHub/Instagram

🔐 JWT Authentication

🐳 Chạy đa dịch vụ bằng Docker

🔔 Notifications

📸 Upload hình ảnh thú cưng

📜 License

MIT © 2025 — WEB_FOUND_PET Team
