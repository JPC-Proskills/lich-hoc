# Kiểm tra V1.1.3 — 26/11/2026

## Tự động

Chạy đủ nội dung `npm test` bằng Node.js được cung cấp (máy không có npm): `scripts/verify.cjs`, `tests/check.cjs`, `tests/check-modes.cjs`, `tests/check-pwa.cjs`, `tests/check-mobile-ui.cjs`.

Các kiểm tra gồm cú pháp/tài nguyên, hồi quy lập lịch, backup, lịch chào, snapshot public không ghi đè planner, worker/offline và cập nhật tuần rỗng. Bổ sung kiểm tra giữ logo: đúng ngưỡng3giây, thả sớm, di chuyển, pointercancel, mất focus, một lần mở mỗi lần giữ, chặn khi đã là Giáo vụ và hỗ trợ bàn phím. Kiểm tra nav ẩn khi xuống, hiện khi lên và phục hồi ở cuối trang.

## Trình duyệt

- 390px: thanh trên chỉ logo/dấu hỏi, không cố định; bỏ nút Giáo viên/theme; nav nổi bo tròn4góc, cao54px.
- Giữ logo thực tế 3,2giây mở hộp mật khẩu; hủy rồi chạm nhanh logo không mở hộp.
- Cuộn xuống: header ra ngoài màn hình, nav ẩn và inert. Cuộn lên: nav hiện lại. Chuyển tab về đầu nội dung mới.
- Bộ lọc GV/lớp mỗi ô một dòng; chọn tên lớp “KIẾN THỨC NGHỀ 87A (CƠ KHÍ & KHÁC)” và xác nhận tên xuống dòng, không bị cắt. Đã bỏ bộ lọc thử sau kiểm tra.
- Placeholder học bù14px, màu #7B8794 ở giao diện sáng.
- Popup buổi học có thẻ tên lớp/chuyên đề, bốn ô thông tin và đúng một câu nhắc xin phép trước ít nhất1ngày; không còn ô họ tên/lời nhắn/nút sao chép Teams.
- Không ghi nhận lỗi console trong luồng đã thử.

Giới hạn: chưa kiểm tra trực tiếp trên điện thoại thật. Không đổi mật khẩu thật hoặc schema/khóa dữ liệu. Chưa upload lên GitHub trong lượt này.
