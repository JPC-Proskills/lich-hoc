# Hướng dẫn cho AI làm việc trong repo

1. Đọc `AI_HANDOFF.md` trước khi chỉnh sửa. Nó chứa yêu cầu đã chốt, nguồn dữ liệu, thiết kế, vai trò và các giới hạn của bản demo.
2. Repo này là nguồn mã chính. Sửa trực tiếp ở đây, không quay lại nguồn Sites cũ hoặc tạo bản khác để chép đè.
3. Yêu cầu mới nhất của người dùng có ưu tiên hơn tài liệu. Giữ các thay đổi hiện có chưa thuộc phạm vi công việc của mình.
4. Giữ dữ liệu người dùng: không xóa localStorage, không thay khóa `proskills-planner-v1`, không đổi schema/ID mà thiếu migration. Sao lưu và khôi phục phải tương thích.
5. Không đưa file backup thật, thông tin xác thực hoặc tài liệu nội bộ không được phép vào repo công khai. Mật khẩu bản tĩnh chỉ là khóa giao diện; không mô tả là phân quyền máy chủ.
6. Giữ đường dẫn tài nguyên tương đối và `index.html` ở gốc cho GitHub Pages. Không tự chuyển framework/build/hosting khi người dùng chỉ yêu cầu chỉnh chức năng hay giao diện.
7. Chạy `npm test`; kiểm tra trình duyệt phù hợp với thay đổi. Cập nhật `CHANGELOG.md`, `AI_HANDOFF.md` và hướng dẫn Giáo vụ nếu hành vi/quy trình thay đổi.
8. Trả lời người dùng bằng tiếng Việt rõ ràng, tập trung vào kết quả và giới hạn có thật.
