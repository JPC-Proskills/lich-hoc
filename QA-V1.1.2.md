# Kiểm tra V1.1.2 — 26/11/2026

## Kiểm tra tự động

Chạy bằng Node.js đi kèm môi trường, tương đương toàn bộ `npm test` (máy không có npm):

- `node scripts/verify.cjs`: cú pháp, tài nguyên tương đối, cấu hình và GitHub Pages.
- `node tests/check.cjs`: hồi quy lập lịch, phòng và backup.
- `node tests/check-modes.cjs`: tuần học viên, học bù, lịch chào và roster/màu.
- `node tests/check-pwa.cjs`: snapshot chỉ chứa tuần được phát hành; lọc trường nội bộ/buổi hủy; không sửa dữ liệu nguồn; dữ liệu public tách khỏi planner; lặp chuyển vai trò; phát hiện thay đổi và tuần rỗng sau khi hủy toàn bộ; icon đúng kích thước; đường dẫn dưới repo; cache nguyên bộ, chỉ dọn cache thuộc app; điều hướng offline; feed bypass cache; chỉ kích hoạt worker mới khi nhận lệnh.

## Trình duyệt

- Kiểm tra 390×844 và 320×700: header một hàng, nút Giáo viên không khóa, không sidebar/toggle, thanh dưới chỉ 2 nút cao khoảng 44px. Không tràn ngang trang (scrollWidth 375/305px do có thanh cuộn trong viewport 390/320px).
- Sáng/tối, lịch Tuần/Danh sách và Học bù; ngày danh sách nền xanh đậm; lịch chào ở cuối, mặc định đóng, mở/thu được.
- Cập nhật lịch lần đầu: thông báo có ngày tuần, bấm nhận, mở lại giữ bản đã nhận; kiểm tra lại báo đang xem lịch mới nhất.
- Ghi nhớ giáo viên lọc sau khi tải lại; sau thử đã bỏ bộ lọc test.
- Mở Hướng dẫn → Cài app hiển thị hướng dẫn khi trình duyệt xem thử không có lời mời cài native.
- Sau khi worker lưu tài nguyên, dừng máy chủ localhost rồi tải lại trang: giao diện và lịch đã nhận vẫn mở được.
- Thay phiên bản worker, dùng Kiểm tra cập nhật: hiện Cập nhật app; bấm cập nhật, app tải lại và giữ lịch học viên đã nhận.
- Chế độ Giáo vụ được kiểm tra trong đường dẫn QA riêng, với cấu hình mật khẩu thử chỉ phục vụ qua máy chủ QA; file config thật trong package giữ nguyên. Thử mật khẩu sai/đúng, vào Giáo vụ sau khi đã nhận lịch public, mở Xuất & sao lưu, tải file lịch học viên và kiểm tra file tải hợp lệ. Trở về học viên mở chi tiết chỉ xem, reload mặc định học viên.
- Không ghi nhận lỗi console trong các luồng đã kiểm tra.

## Giới hạn kiểm chứng

Chưa cài trực tiếp trên Android/iPhone thật. Icon, manifest và luồng hướng dẫn đã được kiểm tra tại máy; hộp cài native, splash screen, vùng tai thỏ/home indicator và màu thanh trạng thái cần xác nhận trên thiết bị thật. Không có backend Web Push, nên không có thông báo hệ thống lúc app đóng. Chưa upload hay deploy lên GitHub trong lượt này.
