# Kiểm tra package v0.1.0

Ngày kiểm tra: **26/11/2026**.

## Kiểm tra tự động đã chạy

Đã chạy trực tiếp các lệnh tương ứng trong `npm test`, kết quả đạt:

```text
node scripts/verify.cjs
node tests/check.cjs
node tests/check-modes.cjs
```

- Cú pháp toàn bộ JavaScript ở gốc; đủ file CSS, font, icon và script được tham chiếu; đường dẫn tương đối; có `.nojekyll`.
- Cấu hình mã băm mật khẩu và URL Teams hợp lệ, `config.js` được nạp trước chế độ sử dụng.
- Tính toàn vẹn dữ liệu mẫu, chuyển bài TTS/NH, lớp hoàn thành, buổi hủy, ngày bắt đầu tuần, xung đột và tiết ngày/tối.
- Chuyển dữ liệu phòng cũ, đổi tên phòng và tham chiếu, phòng ngừng dùng, bảo vệ cơ sở và backup.
- Giới hạn tuần học viên, tuần trống, lọc học bù không dấu, lịch chào luân phiên, không cộng nhầm công suất, chuẩn hóa roster và bảng 10 màu.

## Kiểm tra trình duyệt đã chạy

Mở package qua server localhost dưới đường dẫn **`/proskills-lich-hoc/`**, mô phỏng repo con trên GitHub Pages:

- Trang tải và mặc định chế độ học viên; giao diện và tài nguyên có mặt.
- Đăng nhập chế độ Giáo vụ bằng cấu hình được tách trong package hoạt động.
- Hộp **Xuất & sao lưu** có đúng các nút được ghi trong hướng dẫn.
- **Tải bản sao lưu** tạo file JSON tải về thành công.
- Chọn lại chính file đó ở **Khôi phục bản sao lưu**: app đọc/kiểm tra được và hiển thị số tuần, lớp, giáo viên cùng các nút **Hủy / Sao lưu hiện tại / Thay dữ liệu & khôi phục**.
- Đã bấm **Hủy** ở bước xác nhận để không thay dữ liệu thử nghiệm đang có. Logic thay thế/kiểm tra cấu trúc còn được bao phủ bằng kiểm tra dữ liệu tự động.
- Không có lỗi JavaScript được ghi nhận trong lần kiểm tra này.

File tải thử lấy dữ liệu đang có trên trình duyệt thử nghiệm, **không được đưa vào package**. Package chứa mã nguồn và dữ liệu mẫu trong `seed.js`, không chứa dữ liệu cá nhân được lấy từ localStorage.

## Giới hạn xác minh

Chưa tạo repo, upload hay bật GitHub Pages trên tài khoản của người dùng. Link thật chỉ được xác nhận sau khi người dùng xuất bản. Kiểm tra đường dẫn repo con và tài nguyên cục bộ không thay thế bước mở link thật sau triển khai.

Package giữ nguyên các giới hạn của bản demo: dữ liệu từng trình duyệt, khóa giao diện phía máy khách, chưa có backend/đồng bộ và chưa tự gửi Teams.
