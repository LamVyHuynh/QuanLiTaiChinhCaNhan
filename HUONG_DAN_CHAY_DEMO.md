# 🚀 HƯỚNG DẪN CHẠY DEMO NỘI BỘ - VÍ TÀI CHÍNH GEN Z 💸

> Dự án **Quản Lý Tài Chính Cá Nhân** dành riêng cho giới trẻ và sinh viên.
> Stack: **React 19 + TailwindCSS + Node.js (Express + SQLite)**.

---

## 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 20 trở lên (khuyên dùng Node.js 22 hoặc 24 có tích hợp sẵn SQLite).
- **npm**: Đi kèm theo Node.js.

---

## 2. Cách khởi động ứng dụng (1-Click Run)

### Cách A: Chạy cả Backend & Frontend cùng lúc (Khuyên dùng)

Mở 2 cửa sổ dòng lệnh Terminal trong thư mục dự án:

**Terminal 1: Khởi động Backend API (Node.js)**
```bash
npm run server
```
> Server sẽ chạy tại: `http://localhost:5000` (API: `http://localhost:5000/api`)
> Cơ sở dữ liệu SQLite tự động tạo tại `server/data/finance.sqlite` và tự động nạp sẵn dữ liệu mẫu cho giới trẻ.

**Terminal 2: Khởi động Frontend Web (Vite + React)**
```bash
npm run dev
```
> Mở trình duyệt truy cập: `http://localhost:5173`
> Khi backend đang chạy, góc trên bên phải ứng dụng sẽ hiện trạng thái: 🟢 **API Online**.

---

### Cách B: Chạy Frontend độc lập (Chế độ Offline / Không cần bật Server)
Nếu bạn chỉ muốn xem thử nhanh giao diện mà không muốn bật server:
```bash
npm run dev
```
> Ứng dụng tích hợp sẵn cơ chế **Fallback LocalStorage**: Góc trên sẽ hiển thị 🟡 **Offline Mode**, toàn bộ thao tác Thêm, Sửa, Xóa, Lọc, Biểu đồ thống kê vẫn hoạt động 100% mượt mà trên trình duyệt.

---

## 3. Các tính năng chính đã hoàn thiện
1. 💸 **Ghi chép giao dịch siêu nhanh**:
   - Chuyển đổi linh hoạt giữa **Khoản Chi** và **Khoản Thu**.
   - Phím tắt cộng nhanh số tiền: `+20k`, `+50k`, `+100k`, `+200k`, `+500k`.
   - Danh mục icon emoji chuẩn Gen Z: *Trà sữa / Cà phê, Ăn uống, Mua sắm, Tiền trọ, Đi lại, Học tập, v.v.*
2. 👁️ **Bảo mật số dư**: Bấm nút con mắt để ẩn/hiện số dư khi ở nơi đông người.
3. 🔍 **Bộ lọc & Tìm kiếm tức thì**:
   - Lọc theo mốc thời gian: *Hôm nay, 7 ngày qua, Tháng này, Tất cả*.
   - Lọc theo loại thu/chi hoặc theo danh mục.
   - Tìm kiếm nhanh theo từ khóa tên hoặc ghi chú.
4. 📊 **Biểu đồ phân bổ chi tiêu & Lời khuyên dí dỏm**:
   - Biểu đồ Stacked Bar trực quan từng nhóm % chi tiêu.
   - Trợ lý tài chính đưa ra nhận xét hóm hỉnh phù hợp theo thói quen tiêu tiền (cảnh báo khi uống quá nhiều trà sữa hoặc săn sale quá đà).
5. 🎯 **Hạn mức ngân sách & Cảnh báo "cháy túi"**:
   - Đặt hạn mức chi tiêu trong tháng với các gợi ý nhanh (3tr, 4.5tr, 6tr, 8tr, 10tr).
   - Thanh tiến trình động đổi màu: 🟢 An toàn (< 75%) -> 🟡 Cảnh báo (75-99%) -> 🔴 Nguy cơ cháy túi (≥ 100%).
6. 📱 **Tối ưu Mobile App**:
   - Giao diện dạng khung App hiện đại ở trung tâm màn hình.
   - Tích hợp thanh điều hướng dưới đáy màn hình (**Bottom Navigation Bar**) khi mở trên điện thoại di động.

---

## 4. Chạy kiểm thử tự động (Automated Tests)

- **Kiểm tra Backend API (9 test cases)**:
  ```bash
  node server/test-api.js
  ```
- **Kiểm tra cú pháp & Chuẩn mã nguồn (ESLint)**:
  ```bash
  npm run lint
  ```
- **Kiểm tra đóng gói sản phẩm (Production Build)**:
  ```bash
  npm run build
  ```
