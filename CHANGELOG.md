# Nhật ký thay đổi

## 0.1.0 — 26/11/2026

Đóng gói lần đầu cho repo GitHub riêng, kế thừa bản demo đã thống nhất với chủ dự án.

- Đặt app và `index.html` ở gốc, dùng đường dẫn tương đối, thêm `.nojekyll` cho GitHub Pages; không cần build.
- Chế độ học viên mặc định chỉ xem, màu xanh, giới hạn tuần hiện tại/tuần sau; lọc/sắp xếp và tìm học bù, lời nhắn xin phép Teams.
- Chế độ có mật khẩu dành cho Giáo vụ Hành chính; lập/sửa lịch, sao chép tuần và chuyển bài, quản lý lớp/GV/phòng/chương trình, công suất ngày/tối.
- Lịch chào thứ 6 với luân phiên, roster GDTC, 10 màu chương trình và thẻ màu giáo viên.
- Material 3, Be Vietnam Pro, sáng/tối, nút cam đất, chữ gọn trong lưới tuần và ẩn thanh bên.
- Tách cấu hình mã băm mật khẩu/URL Teams sang `config.js`, giữ nguyên hành vi và khóa lưu dữ liệu.
- Bổ sung tài liệu đưa lên GitHub, hướng dẫn Giáo vụ sao lưu/khôi phục và bàn giao cho các công cụ AI.
- Bổ sung kiểm tra tài nguyên, cấu hình và các bài hồi quy có thể chạy bằng `npm test`.

Bản nền từ nguồn demo Sites, commit `a9a8f374d45dc58645a60f12bda1e7dec2550bd7`. Đây là mốc tham chiếu của nguồn demo, không phải lịch sử Git đã có trong repo mới.
