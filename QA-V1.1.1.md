# Kiểm tra PS-LICHDAY-V1.1.1

Ngày kiểm tra: 26/11/2026.

## Kiểm tra tự động — đạt

Chạy toàn bộ ba lệnh tương đương script `npm test` bằng Node.js đi kèm môi trường (máy không có lệnh npm):

- `node scripts/verify.cjs`: cú pháp JavaScript, cấu hình, tài nguyên tương đối/font/logo, đầu vào GitHub Pages.
- `node tests/check.cjs`: hồi quy lập lịch, phòng, đổi tên, cơ sở, phòng ngừng hoạt động, tính toàn vẹn sao lưu.
- `node tests/check-modes.cjs`: tuần học viên, tìm học bù, lịch chào/luân phiên, roster, bảng màu, kiểm tra sao lưu.

## Trình duyệt — đạt

Chạy app tại đường dẫn con `/PS-LICHDAY-V1.1.1/`, phản hồi HTTP 200.

- Máy tính 1440×1000 và điện thoại 390×844; mặc định học viên.
- Kiểm tra trực quan nền trung tính, logo mới và tiêu đề Nunito.
- Kiểm tra lịch Tuần/Danh sách; trục lịch nền #244F75, chữ #E8F3FF, gồm cả giờ ca.
- Darkmode: nền #18191B, panel #242629; nút thao tác và nút đóng hướng dẫn dùng xanh.
- Chuyển giữa lịch học và học bù; mở/đóng hướng dẫn; ẩn/hiện thanh bên.
- Điện thoại không tràn ngang toàn trang (scrollWidth 375px trong viewport 390px có thanh cuộn).
- Không ghi nhận lỗi console trong các thao tác đã kiểm tra.

Phạm vi lần này là giao diện. Không chạy lại toàn bộ quy trình nhập/sửa lịch bằng tài khoản Giáo vụ trên trình duyệt; logic nghiệp vụ được kiểm tra bằng bộ hồi quy có sẵn. Không xóa hoặc đổi khóa lưu dữ liệu.
