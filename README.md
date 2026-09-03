# ⚡ FySet Backend (`FySet-be`)

> Hệ thống máy chủ API RESTful & Dịch vụ WebSocket thời gian thực (Real-time) phục vụ nền tảng học lập trình & định hướng nghề nghiệp công nghệ **FySet**.

---

## 📖 Tổng quan dự án (Project Overview)

**FySet Backend** là hệ thống máy chủ dịch vụ trung tâm được xây dựng trên nền tảng **Node.js**, **Express 5**, **MongoDB (Mongoose)**, **Redis Cache** và **Socket.IO**. Hệ thống cung cấp toàn bộ dữ liệu nghiệp vụ, xác thực phân quyền đa phương thức (Local, Google OAuth 2.0, GitHub OAuth 2.0), quản lý phiên (Session & JWT), lưu trữ tập tin đa phương tiện lên **Cloudinary**, gửi thông báo qua **Nodemailer**, và đặc biệt là hệ thống trò chuyện trực tuyến (Real-time Chat & Notifications) với kiến trúc WebSocket 2 chiều.

Backend được thiết kế tương thích chặt chẽ với toàn bộ các tính năng hiển thị trên **FySet Frontend** (`FySet-fe`): từ hệ thống Khóa học (Courses), Lộ trình (Roadmaps), Bài tập thuật toán (Problems), Chấm bài (Submissions), Cuộc thi (Contests & Leaderboard), Danh hiệu (Badges), đến Không gian Trò chuyện & Kết bạn cộng đồng.

---

## ✨ Tính năng chính (Core Features)

- 🔐 **Xác thực & Phân quyền Đa kênh (Multi-Auth System)**:
  - Đăng ký & Đăng nhập truyền thống với xác thực mật khẩu an toàn qua `bcryptjs` và kiểm tra dữ liệu đầu vào bằng `zod`.
  - Đăng nhập một chạm qua **Google OAuth 2.0** & **GitHub OAuth 2.0** (`Passport.js`).
  - Quản lý phiên đăng nhập an toàn bằng `express-session` lưu trữ trên **Redis Store** kết hợp Cookie phiên `HttpOnly`.
  - Xác thực kích hoạt tài khoản qua Email (JWT Verification link) & Quên mật khẩu bằng mã **OTP 6 chữ số** (thời hạn 3 phút lưu trên Redis).
- 💬 **Hệ thống Trò chuyện Thời gian thực (Real-time Chat Engine)**:
  - Kết nối WebSocket namespace `/chat` bảo mật thông qua session xác thực `ensureAuthSocket`.
  - Hỗ trợ trò chuyện trực tiếp (1-1) và trò chuyện nhóm (Group Chat) với nhiều thành viên.
  - Gửi tin nhắn văn bản, phản hồi tin nhắn (Reply), đính kèm tệp đa phương tiện (Ảnh, Video, Tài liệu raw).
  - Quản lý trạng thái trực tuyến (Online/Offline tracking) và đồng bộ danh sách bạn bè đang hoạt động.
  - Bộ đếm tin nhắn chưa đọc (Unread message counter) và đánh dấu đã xem (Seen/Read status) theo thời gian thực.
- 👥 **Quản lý Người dùng & Mạng lưới Bạn bè (User & Friendship)**:
  - Cập nhật ảnh đại diện cá nhân tự động tối ưu qua **Cloudinary**.
  - Luồng kết bạn hai chiều: Gửi lời mời kết bạn (Pending), Chấp nhận (Accepted), Từ chối (Declined).
  - Tra cứu danh sách bạn bè & thống kê thành tích học tập (Daily streak, Pomodoro streak, Giờ tập trung, Điểm kinh nghiệm XP, Rating).
- 🗄️ **Mô hình Dữ liệu Đầy đủ cho Frontend**:
  - Schemas hoàn chỉnh cho Khóa học (`Course`), Bài học (`Lesson`), Lộ trình (`Roadmap`), Bài tập thuật toán (`Problem`), Lời giải (`Submission`), Cuộc thi (`Contest`), Bảng xếp hạng (`ContestLeaderboard`), Danh hiệu (`Badge`), Kế hoạch cá nhân (`Todo`), và Bài viết thảo luận (`Blog`, `Comment`).
- 📧 **Dịch vụ Email Tự động (Automated Mailing)**:
  - Tích hợp **Nodemailer** với công cụ mẫu giao diện **Handlebars (`hbs`)** cho email kích hoạt tài khoản và email gửi mã OTP.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Công nghệ | Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | Môi trường thực thi JavaScript phía Server (ES Modules) |
| **Express** | `^5.2.1` | Web Framework hiệu năng cao, định tuyến RESTful API |
| **MongoDB & Mongoose** | `^9.7.3` | Cơ sở dữ liệu NoSQL & ODM định nghĩa Schema dữ liệu |
| **Socket.IO** | `^4.8.3` | Giao thức truyền thông hai chiều WebSocket thời gian thực |
| **Redis** | `^6.1.0` | In-memory Data Store lưu trữ Session, OTP & Trạng thái Online |
| **Passport.js** | `^0.7.0` | Middleware xác thực hỗ trợ Local, Google OAuth 2.0 & GitHub |
| **Zod** | `^4.4.3` | Thư viện thẩm định & làm sạch Schema dữ liệu đầu vào (Validation) |
| **Bcryptjs** | `^3.0.3` | Băm mật khẩu một chiều an toàn (Pure JS, tương thích mọi OS) |
| **Cloudinary & Multer** | `^2.10.0` | Xử lý upload tập tin multipart và lưu trữ đám mây |
| **Nodemailer & Handlebars**| `^9.0.3` | Máy chủ gửi thư điện tử giao diện động (`.hbs`) |
| **JSON Web Token (JWT)** | `^9.0.3` | Ký và xác thực Token tạm thời cho Email & Đổi mật khẩu |

---

## 📁 Cấu trúc thư mục (Directory Structure)

```text
FySet-be/
├── src/
│   ├── configs/                 # Cấu hình dịch vụ bên ngoài
│   │   ├── cloudinary.js        # Cấu hình SDK lưu trữ ảnh/tập tin Cloudinary
│   │   ├── database.js          # Kết nối MongoDB (Mongoose) với cơ chế chịu lỗi
│   │   ├── multer.js            # Middleware bắt tải file multipart/form-data
│   │   ├── nodemailer.js        # Cấu hình SMTP & Handlebars email template engine
│   │   ├── passport.js          # Khởi tạo Passport Session Serialize/Deserialize
│   │   ├── redis.js             # Kết nối Redis Client & In-memory Fallback
│   │   └── socketIO.js          # Khởi tạo Socket.IO Server & Namespace Registry
│   ├── middlewares/             # Các lớp trung gian toàn cục
│   │   ├── ensureAuth.middleware.js       # Bảo vệ Route HTTP yêu cầu đăng nhập
│   │   ├── ensureAuthSocket.middleware.js # Bảo vệ kết nối Socket.IO yêu cầu Session
│   │   └── error.middleware.js            # Bắt lỗi tập trung (ApiError & Database)
│   ├── models/                  # Định nghĩa Mongoose Schemas (Khớp 100% với FySet-fe)
│   │   ├── badge.js             # Danh hiệu, huy hiệu & thành tích học tập
│   │   ├── blog.js              # Bài viết kiến thức & chia sẻ cộng đồng
│   │   ├── comment.js           # Bình luận bài viết và bài học
│   │   ├── contest.js           # Cuộc thi lập trình trực tiếp
│   │   ├── contestLeaderboard.js# Bảng xếp hạng điểm số cuộc thi
│   │   ├── conversation.js      # Phòng trò chuyện 1-1 & nhóm
│   │   ├── course.js            # Khóa học lập trình
│   │   ├── interaction.js       # Thả tim/tương tác bài viết
│   │   ├── lesson.js            # Bài học trong khóa học
│   │   ├── message.js           # Tin nhắn & tệp đính kèm trò chuyện
│   │   ├── notification.js      # Thông báo hệ thống
│   │   ├── problem.js           # Bài tập thuật toán (LeetCode-style)
│   │   ├── roadmap.js           # Lộ trình học nghề nghiệp (Frontend, Backend...)
│   │   ├── setting.js           # Cấu hình tùy chọn người dùng
│   │   ├── submission.js        # Lịch sử nộp bài thuật toán & kết quả chấm
│   │   ├── todo.js              # Nhiệm vụ học tập cá nhân
│   │   └── user.js              # Hồ sơ người dùng, bạn bè & tiến độ
│   ├── modules/                 # Các module nghiệp vụ chính (Controller - Route - Service)
│   │   ├── auth/                # Nghiệp vụ Đăng ký, Đăng nhập, Đăng xuất, OAuth
│   │   │   ├── strategies/      # Chiến lược Passport (Local, Google, GitHub)
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.middleware.js
│   │   │   ├── auth.route.js
│   │   │   └── auth.service.js
│   │   ├── chat/                # Nghiệp vụ Hội thoại & Tin nhắn
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.route.js
│   │   │   ├── chat.service.js
│   │   │   └── chat.socket.js   # Xử lý sự kiện WebSocket thời gian thực
│   │   ├── comment/             # Nghiệp vụ Bình luận thảo luận
│   │   └── user/                # Nghiệp vụ Hồ sơ, Bạn bè, Avatar, OTP
│   │       ├── user.controller.js
│   │       ├── user.route.js
│   │       ├── user.service.js
│   │       └── user.socket.js
│   ├── services/                # Các dịch vụ dùng chung
│   │   ├── jwt.service.js       # Tạo & kiểm tra tính hợp lệ của JWT
│   │   ├── mail.service.js      # Gửi email kích hoạt & OTP
│   │   ├── notification.service.js # Dịch vụ thông báo
│   │   ├── otp.service.js       # Sinh mã OTP 6 số và lưu tạm thời
│   │   └── upload.service.js    # Tải lên & xóa file trên Cloudinary
│   ├── utils/                   # Công cụ hỗ trợ
│   │   ├── ApiError.js          # Lớp định nghĩa lỗi chuẩn HTTP
│   │   ├── formatArrayOfObjectIds.js
│   │   └── getFileType.js
│   ├── views/                   # Mẫu Handlebars cho Email
│   │   ├── layouts/main.layout.hbs
│   │   ├── pages/email.page.hbs # Giao diện Email kích hoạt tài khoản
│   │   └── pages/otp.page.hbs   # Giao diện Email nhận mã OTP
│   ├── routes.js                # Tổng hợp Router trung tâm (`/api/v1`)
│   ├── server.config.js         # Khởi tạo Express App, Session, CORS & Middleware
│   └── server.js                # Entry point kết nối Database, Socket & Listen Server
├── .env.example                 # Mẫu cấu hình biến môi trường
├── package.json
└── README.md
```

---

## ⚙️ Cấu hình biến môi trường (Environment Variables)

Liên hệ team Backend để nhận file .env gốc

> **Lưu ý**: Hệ thống đã trang bị sẵn **In-memory Mock Fallback** cho Redis và kết nối MongoDB an toàn, giúp máy chủ vẫn khởi động bình thường phục vụ việc phát triển giao diện ngay cả khi chưa kết nối database ngoài.

---

## 🚀 Hướng dẫn chạy dự án (Getting Started)

### Yêu cầu môi trường

- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`
- **MongoDB** & **Redis** (Khuyến nghị cho môi trường đầy đủ)

### 1. Cài đặt thư viện phụ thuộc

```bash
npm install
```

### 2. Chạy máy chủ ở chế độ phát triển (Development)

```bash
npm run dev

# Hoặc: npm start
```

Máy chủ API sẽ chạy tại: `http://localhost:3000`  
Endpoint kiểm tra sức khỏe hệ thống (Health check): `GET http://localhost:3000/`

### 3. Kiểm tra cú pháp mã nguồn (Lint)

```bash
npm run lint
```

---

## 📡 Tài liệu API Endpoint

Tất cả các API nghiệp vụ đều có tiền tố: `http://localhost:3000/api/v1`

> ⚠️ **Quy tắc xác thực quan trọng**:
> - Hệ thống sử dụng cơ chế **Cookie Session** (Cookie name: `LearnFlow`, `httpOnly: true`).
> - Khi gọi API từ Frontend (Axios / Fetch), **BẮT BUỘC** phải bật cấu hình `withCredentials: true` (hoặc `credentials: 'include'`).

---

### 1. Module Xác thực (`/api/v1/auth`)

| Method | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/auth/` | **Có** | Kiểm tra trạng thái đăng nhập hiện tại |
| `GET` | `/api/v1/auth/sign-in` | Không | Lấy thông tin trang đăng nhập |
| `GET` | `/api/v1/auth/sign-up` | Không | Lấy thông tin trang đăng ký |
| `POST` | `/api/v1/auth/sign-up` | Không | Đăng ký tài khoản mới & gửi email xác nhận |
| `POST` | `/api/v1/auth/sign-in` | Không | Đăng nhập tài khoản & thiết lập Session Cookie |
| `POST` | `/api/v1/auth/sign-out`| **Có** | Đăng xuất, hủy Session, ngắt socket, xóa Cookie |
| `GET` | `/api/v1/auth/google` | Không | Chuyển hướng đến màn hình xác thực Google OAuth |
| `GET` | `/api/v1/auth/google/callback` | Không | Callback nhận kết quả đăng nhập từ Google |
| `GET` | `/api/v1/auth/github` | Không | Chuyển hướng đến màn hình xác thực GitHub OAuth |
| `GET` | `/api/v1/auth/github/callback` | Không | Callback nhận kết quả đăng nhập từ GitHub |

#### Chi tiết Request/Response Auth:

- **Đăng ký (`POST /api/v1/auth/sign-up`)**:
  ```json
  // Request Body
  {
    "username": "coder_fyset",
    "email": "user@fyset.dev",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```
  ```json
  // Response (200 OK)
  {
    "message": "Đăng ký thành công",
    "data": {
      "_id": "664f1b2...",
      "username": "coder_fyset",
      "email": "user@fyset.dev",
      "role": "user",
      "accountStatus": "inactive",
      "avatar": { "url": "..." }
    }
  }
  ```

- **Đăng nhập (`POST /api/v1/auth/sign-in`)**:
  ```json
  // Request Body
  {
    "username": "coder_fyset",
    "email": "user@fyset.dev",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```
  ```json
  // Response (200 OK) - Kèm Set-Cookie: LearnFlow=...
  {
    "message": "Đăng nhập thành công",
    "data": {
      "_id": "664f1b2...",
      "username": "coder_fyset",
      "email": "user@fyset.dev",
      "dailyStreak": 5,
      "experiencePoints": 120
    }
  }
  ```

---

### 2. Module Người dùng & Bạn bè (`/api/v1/user`)

| Method | Endpoint | Yêu cầu Auth | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/v1/user/friend` | **Có** | JSON | Lấy danh sách bạn bè của tài khoản hiện tại |
| `POST` | `/api/v1/user/avatar` | **Có** | `multipart/form-data` | Tải lên và cập nhật ảnh đại diện lên Cloudinary |
| `POST` | `/api/v1/user/friend/add` | **Có** | JSON | Gửi lời mời kết bạn tới người dùng khác |
| `POST` | `/api/v1/user/friend/accept` | **Có** | JSON | Trả lời lời mời kết bạn (Chấp nhận / Từ chối) |
| `POST` | `/api/v1/user/forgot-password` | Không | JSON | Gửi mã OTP 6 số qua email để phục hồi mật khẩu |
| `POST` | `/api/v1/user/verify-otp` | Header Token | JSON | Xác thực mã OTP trong thời hạn 3 phút |
| `POST` | `/api/v1/user/change-password` | Header Token | JSON | Đổi mật khẩu sau khi xác thực OTP thành công |
| `POST` | `/api/v1/user/reset-password` | **Có** | JSON | Đổi mật khẩu trực tiếp (cần mật khẩu cũ) |
| `POST` | `/api/v1/user/verify-email` | Header / Query | JSON | Kích hoạt tài khoản từ đường dẫn email xác nhận |

#### Chi tiết Request/Response User:

- **Đổi ảnh đại diện (`POST /api/v1/user/avatar`)**:
  - `Content-Type`: `multipart/form-data`
  - Field name file: `image`
  - Response: `{ "success": true, "message": "Cập nhật ảnh đại diện thành công", "data": { ... } }`

- **Gửi lời mời kết bạn (`POST /api/v1/user/friend/add`)**:
  ```json
  { "receiverId": "664f1b2c4945d81f61f18baa" }
  ```

- **Phản hồi lời mời kết bạn (`POST /api/v1/user/friend/accept`)**:
  ```json
  {
    "receiverId": "664f1b2c4945d81f61f18baa",
    "status": "accepted" // "accepted" hoặc "declined"
  }
  ```

- **Quên mật khẩu & Xác thực OTP**:
  1. `POST /api/v1/user/forgot-password` gửi `{ "email": "user@fyset.dev" }` nhận về chuỗi JWT token.
  2. `POST /api/v1/user/verify-otp` gửi `{ "otp": "123456" }` kèm Header `Authorization: Bearer <token>`.
  3. `POST /api/v1/user/change-password` gửi `{ "email": "...", "password": "NewPassword123!", "confirmPassword": "NewPassword123!" }` kèm Header `Authorization: Bearer <token>`.

---

### 3. Module Trò chuyện (`/api/v1/chat`)

| Method | Endpoint | Yêu cầu Auth | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/v1/chat/` | **Có** | JSON | Kiểm tra quyền truy cập không gian chat |
| `GET` | `/api/v1/chat/conversation` | **Có** | JSON | Lấy toàn bộ danh sách hội thoại của người dùng |
| `POST` | `/api/v1/chat/conversation` | **Có** | JSON | Tạo phòng hội thoại mới (1-1 hoặc Nhóm) |
| `POST` | `/api/v1/chat/message` | **Có** | `multipart/form-data` | Gửi tin nhắn mới kèm file đính kèm |
| `POST` | `/api/v1/chat/avatar` | **Có** | `multipart/form-data` | Cập nhật ảnh đại diện cho phòng trò chuyện nhóm |

#### Chi tiết Request Chat:

- **Tạo hội thoại (`POST /api/v1/chat/conversation`)**:
  ```json
  {
    "title": "Nhóm ôn luyện thuật toán FySet",
    "participants": "[\"664f1b2...\", \"664f1b3...\"]" // JSON stringified mảng ObjectId
  }
  ```

- **Gửi tin nhắn (`POST /api/v1/chat/message`)**:
  - `Content-Type`: `multipart/form-data`
  - Field: `conversationId` (chuỗi ID phòng)
  - Field: `content` (nội dung tin nhắn text)
  - Field: `attachments` (danh sách tệp đính kèm tối đa qua multer)

---

## 💬 Hướng dẫn kết nối WebSocket (Socket.IO Guide)

Hệ thống WebSocket phục vụ tính năng nhắn tin tức thì, trạng thái bạn bè online/offline và thông báo đẩy.

### 1. Khởi tạo kết nối từ Frontend (`socket.io-client`)

```javascript
import { io } from "socket.io-client";

// Kết nối trực tiếp vào namespace /chat và truyền cookie phiên
const socket = io("http://localhost:3000/chat", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Đã kết nối WebSocket FySet:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Lỗi xác thực socket (Chưa đăng nhập):", err.message);
});
```

### 2. Danh sách các sự kiện (Socket Events Reference)

#### 📤 Client phát lên Server (Client Emitters):

- **Vào phòng trò chuyện**:
  ```javascript
  socket.emit("joinConversation", { roomId: "conversation_id_here" });
  ```
- **Rời phòng trò chuyện**:
  ```javascript
  socket.emit("leaveConversation", {
    roomId: "conversation_id_here",
    messageId: "last_read_message_id",
  });
  ```
- **Gửi thông báo tin nhắn mới**:
  ```javascript
  socket.emit("sendMessage", {
    roomId: "conversation_id_here",
    messageId: "new_message_id",
    messageReplyId: "replied_message_id", // Tùy chọn nếu là tin nhắn reply
  });
  ```
- **Đánh dấu đã đọc tin nhắn**:
  ```javascript
  socket.emit("markMessageAsSeen", {
    roomId: "conversation_id_here",
    messageId: "seen_message_id",
  });
  ```

#### 📥 Server phát về Client (Client Listeners):

- **Thay đổi trạng thái danh sách bạn bè Online**:
  ```javascript
  socket.on("changeOnlineFriendsList", ({ usersOnline, usersOffline }) => {
    // Cập nhật trạng thái chấm xanh/xám của bạn bè trên giao diện
  });
  ```
- **Thông báo được thêm vào nhóm mới**:
  ```javascript
  socket.on("addMemberToConversation", (message) => {
    // Hiển thị Toast thông báo: "Bạn vừa được thêm vào một nhóm mới"
  });
  ```
- **Tin nhắn khởi tạo cuộc hội thoại**:
  ```javascript
  socket.on("welcomeMessage", (welcomeSystemMessage) => {
    // Render tin nhắn hệ thống thông báo tạo nhóm thành công
  });
  ```
- **Thông báo tức thì**:
  ```javascript
  socket.on("sendNotification", (notificationData) => {
    // Kích hoạt Toast notification trên giao diện Frontend
  });
  ```

---

## 🔗 Hướng dẫn tích hợp kết nối Frontend (`FySet-fe`) & Backend (`FySet-be`)

Để kết nối mượt mà giữa ứng dụng React Frontend (`http://localhost:5173`) và Node.js Backend (`http://localhost:3000`):

### Cách 1: Thiết lập cấu hình Axios tập trung trên Frontend

Tạo file `src/services/api.js` trong thư mục `FySet-fe`:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // QUAN TRỌNG: Gửi kèm Cookie phiên đăng nhập
  headers: {
    "Content-Type": "application/json",
  },
});

// Xử lý bắt lỗi phản hồi toàn cục
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data;
    const message = errorResponse?.message || "Đã có lỗi xảy ra, vui lòng thử lại!";
    return Promise.reject({ message, errors: errorResponse?.errors });
  }
);
```

### Cách 2: Thiết lập Vite Proxy (Khuyên dùng để tránh lỗi CORS)

Trong file `vite.config.js` của `FySet-fe`:

```javascript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
});
```
*Khi dùng Proxy, trên Frontend chỉ cần gọi `api.get('/api/v1/auth/')` mà không lo ngại về địa chỉ CORS.*

---

## 🗃️ Bản đồ Mô hình Dữ liệu (Database Models Mapping)

Dưới đây là ánh xạ giữa các Schemas MongoDB của Backend với các trang hiển thị trên **FySet Frontend**:

| Trang Frontend (`FySet-fe`) | Model tương ứng (`src/models/`) | Các trường dữ liệu chính |
| :--- | :--- | :--- |
| **Courses** (`/courses`) | `course.js`, `lesson.js` | `title`, `slug`, `thumbnail`, `category`, `price`, `salePrice`, `level`, `stats` (learners, rating, lessons) |
| **Roadmaps** (`/roadmaps`) | `roadmap.js` | `title`, `slug`, `difficulty`, `topics` (stepNumber, topicName, attachedCourses, attachedProblems) |
| **Problems** (`/problems`) | `problem.js`, `submission.js` | `title`, `slug`, `difficulty`, `topics`, `codeStubs`, `sampleTestcases`, `stats` (acceptanceRate, points) |
| **Contests** (`/contests`) | `contest.js`, `contestLeaderboard.js` | `title`, `slug`, `startTime`, `endTime`, `duration`, `status`, `problems`, `stats` |
| **Leaderboard** (`/leaderboard`) | `user.js`, `contestLeaderboard.js` | `rating`, `experiencePoints`, `dailyStreak`, `rank`, `score` |
| **Badges** (`/badges`) | `badge.js` | `name`, `description`, `thumbnail`, `category`, `rarity` (common, rare, epic, legendary), `pointsReward` |
| **Chat & Friends** | `conversation.js`, `message.js`, `user.js` | `participants`, `isGroup`, `content`, `attachments`, `interactionStatus`, `friends` |
| **Profile & Habits** | `user.js`, `todo.js`, `setting.js` | `pomodoroStreak`, `hoursFocused`, `dailyStreak`, `avatar`, `role` |

---

## 🛡️ Quy chuẩn Xử lý lỗi (Error Handling Standard)

Mọi lỗi trả về từ hệ thống đều tuân thủ cấu trúc đồng nhất qua lớp `ApiError`:

```json
{
  "message": "Dữ liệu đăng ký không hợp lệ",
  "errors": {
    "password": "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&...)",
    "confirmPassword": "Mật khẩu xác nhận không khớp"
  }
}
```

Mã lỗi HTTP thường gặp:
- `200 OK` / `201 Created`: Thao tác thành công.
- `400 Bad Request`: Sai định dạng dữ liệu (bắt bởi Zod Validation).
- `401 Unauthorized`: Chưa đăng nhập hoặc phiên làm việc đã hết hạn.
- `403 Forbidden`: Không có quyền truy cập tài nguyên.
- `404 Not Found`: Không tìm thấy bản ghi.
- `500 Internal Server Error`: Lỗi máy chủ xử lý.

---

## 📄 Bản quyền (License)

Dự án được phát triển bởi **FySet Team**. Bảo lưu mọi bản quyền © 2026.
