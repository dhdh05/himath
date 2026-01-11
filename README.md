# HI MATH - Bé Học Toán 🧮

Chào mừng đến với **Hi Math** - nền tảng học toán tương tác vui nhộn dành cho trẻ em tiền tiểu học(5 tuổi). Dự án kết hợp giữa các trò chơi giáo dục và công nghệ AI để tạo ra trải nghiệm học tập thú vị.

## 🚀 Tính Năng Nổi Bật

### 🎮 Trò Chơi Giáo Dục
*   **Kéo Co Math**: Trò chơi đối kháng kịch tính, trả lời đúng để kéo thắng đối thủ (Có hỗ trợ giọng đọc câu hỏi).
*   **Học Chữ Số**: Làm quen với các con số qua hình ảnh và âm thanh.
*   **Phép So Sánh**: Học so sánh lớn hơn, nhỏ hơn, bằng nhau.
*   **Bé Tập Viết Số**: Luyện viết số ngay trên màn hình cảm ứng/chuột.
*   **Tính Toán**: Các bài tập cộng trừ cơ bản.
*   **Tính Bằng Ngón Tay**: Phương pháp Finger Math trực quan.

### 🤖 AI Chatbot "Bạn Nhỏ Thông Thái"
*   Tích hợp **Google Gemini AI**.
*   Hỗ trợ **Hỏi đáp Toán học** và trò chuyện vui vẻ.
*   **Nhận diện giọng nói (STT)** & **Đọc văn bản (TTS)** tiếng Việt tự nhiên.
*   Kéo thả cửa sổ chat linh hoạt trên giao diện.

### � Hệ Thống Quản Lý
*   **Phụ huynh**: Theo dõi tiến độ, thời gian học của con.
*   **Bảng xếp hạng**: Đua top điểm số và thời gian học.
*   **Thành tích & Phần thưởng**: Mở khóa huy hiệu khi hoàn thành nhiệm vụ.

---

## 🛠️ Công Nghệ Sử Dụng

*   **Frontend**: HTML5, Vanilla CSS (Grid/Flexbox), Vanilla JavaScript.
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL (sử dụng thư viện `mysql2`).
*   **AI**: Google Gemini API.
*   **Deployment**: Render (Frontend & Backend tách biệt).

---

## � Cấu Trúc Dự Án

```
himath/
├── backEnd/                # Backend Server
│   ├── src/
│   │   ├── config/         # Cấu hình DB
│   │   ├── controllers/    # Xử lý logic API
│   │   ├── routes/         # Định tuyến API
│   │   └── server.js       # Entry point
│   ├── .env                # Biến môi trường (Git ignored)
│   └── package.json
│
├── frontEnd/               # Frontend Client
│   ├── assets/             # CSS, JS, Images, Sounds
│   ├── panels/             # Source code các game/tính năng
│   │   ├── practice-keo-co/ # Game Kéo Co
│   │   ├── about-us/
│   │   └── ...
│   ├── config.js           # Cấu hình kết nối API
│   └── index.html          # Trang chủ
│
└── database/               # SQL Scripts
    ├── ktpmud.sql          # Schema chính
    └── seed_keo_co.sql     # Dữ liệu mẫu game Kéo Co
```

---

## ⚙️ Cài Đặt & Chạy Local

1.  **Clone dự án**:
    ```bash
    git clone https://github.com/your-repo/himath.git
    cd himath
    ```

2.  **Cài đặt Database**:
    *   Cài MySQL Server (hoặc dùng XAMPP).
    *   Tạo database tên `ktpmud`.
    *   Import file `database/ktpmud.sql` và `database/seed_keo_co.sql`.

3.  **Chạy Backend**:
    ```bash
    cd backEnd
    npm install
    # Tạo file .env dựa trên mẫu
    npm run dev
    ```

4.  **Chạy Frontend**:
    *   Dùng **Live Server** (VS Code extension) mở file `frontEnd/index.html`.

---

## ☁️ Hướng Dẫn Deploy (Render.com)

Dự án được triển khai theo mô hình **Frontend riêng - Backend riêng** để tối ưu hiệu suất và quản lý.

### 1. Backend Service (Web Service)
*   **Build Command**: `cd backEnd && npm install`
*   **Start Command**: `cd backEnd && node src/server.js`
*   **Environment Variables**:
    *   `PORT`: `3000` (hoặc port mặc định Render cấp)
    *   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Thông tin kết nối MySQL (External DB).
    *   `GEMINI_API_KEY`: API Key của Google Gemini (cho Chatbot).
    *   `FRONTEND_URL`: URL của Frontend sau khi deploy.

### 2. Frontend Service (Static Site)
*   **Publish Directory**: `frontEnd`
*   **Lưu ý quan trọng**:
    *   File `frontEnd/config.js` đã được cấu hình tự động trỏ về Backend URL khi chạy trên môi trường Render.
    *   Đảm bảo URL Backend trong `config.js` chính xác: `https://himath-be.onrender.com` (hoặc domain backend của bạn).

---

## � Khắc Phục Lỗi Thường Gặp

#### 1. Lỗi "Lỗi tải câu hỏi từ Server!" trong game Kéo Co
*   **Nguyên nhân**:
    *   Database chưa có dữ liệu `game_questions`.
    *   Frontend gọi sai đường dẫn API (do chạy trên 2 domain khác nhau).
*   **Cách sửa**:
    *   Chạy script `database/seed_keo_co.sql` vào database.
    *   Kiểm tra file `frontEnd/config.js`, đảm bảo Backend URL chính xác.

#### 2. Chatbot báo lỗi kết nối
*   **Nguyên nhân**: Thiếu `GEMINI_API_KEY` trên Backend.
*   **Cách sửa**: Vào Dashboard Render -> Backend -> Environment -> Thêm `GEMINI_API_KEY`.

---

## 📜 License
Dự án được phát triển bởi **Huy(dhdh)** cho môn học Kỹ thuật phần mềm ứng dụng.
