# PS-LICHDAY-V1.1.1 · 26/11/2026

- Nền học viên và thanh bên chuyển sang xám trung tính, giảm độ phủ xanh trên thẻ lịch.
- Trục thứ/ngày và ca/tiết dùng xanh đậm #244F75, chữ xanh rất nhạt #E8F3FF.
- Đồng bộ nút học viên sang xanh #2E6596: tuần/danh sách, thanh bên, sáng/tối, hướng dẫn, đóng và các nút trong hộp thoại.
- Darkmode học viên chuyển nền xám đen #18191B, panel xám #242629.
- Thay logo và icon bằng bộ Logo Proskills được cung cấp; tiêu đề dùng Nunito đóng gói tại máy.
- Bỏ đường dẫn “Đào tạo / …”; thu gọn khoảng cách dòng, đoạn và thẻ lịch, giữ cỡ chữ lịch tuần theo thiết kế đã chốt.
- Giữ logic lịch, dữ liệu, khóa localStorage và khả năng khôi phục bản sao lưu.

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
