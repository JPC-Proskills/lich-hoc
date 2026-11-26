# Đưa package lên GitHub và lấy link gửi Giáo vụ

## 1. Chuẩn bị repo

1. Giải nén ZIP và mở thư mục `proskills-lich-hoc`.
2. Tạo một repo riêng trên GitHub, ví dụ `proskills-lich-hoc`. Không cần dùng đúng tên ví dụ này.
3. Đưa toàn bộ **nội dung** của thư mục đã giải nén lên repo, giữ nguyên các thư mục con. Không upload chỉ mỗi file ZIP hoặc chỉ mỗi `index.html`.
4. Kiểm tra ở trang chính repo phải thấy `index.html`, `config.js`, `app.js`, `core.js`, `seed.js`, các file CSS, font và thư mục `docs`, `scripts`, `tests`.
5. Giữ cả `.nojekyll` ở gốc và các tệp hướng dẫn AI. Nếu công cụ upload bỏ sót tệp bắt đầu bằng dấu chấm, bật hiển thị hoặc tạo lại `.nojekyll` trên GitHub.

Theo tài liệu GitHub, GitHub Free hỗ trợ Pages với repo công khai; hỗ trợ repo riêng phụ thuộc gói tài khoản. Việc một repo là riêng tư không đồng nghĩa website Pages cũng riêng tư. Nguồn: [Tạo GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## 2. Bật website

1. Mở repo → **Settings**.
2. Chọn **Pages**.
3. Trong **Build and deployment**, chọn **Source: Deploy from a branch**.
4. Chọn nhánh chứa mã, thường là **main**.
5. Chọn **/(root)** → **Save**.
6. Khi GitHub triển khai xong, quay lại **Settings → Pages → Visit site**.

Giữ `index.html` ngay ở gốc để phù hợp lựa chọn `/(root)`. Không cần chọn GitHub Actions hoặc thêm bước build cho package này. Nguồn: [Cấu hình nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Link thường có dạng `https://ten-tai-khoan.github.io/ten-repo/`. Hãy dùng **link thực tế do GitHub trả về**, không suy đoán từ ví dụ.

## 3. Gửi cho Giáo vụ

Gửi link **Visit site** và file [HUONG-DAN-GIAO-VU.md](HUONG-DAN-GIAO-VU.md). Gửi mật khẩu chế độ chỉnh sửa riêng cho người được phép.

Trang mở mặc định ở chế độ học viên. Giáo vụ bấm **Chế độ giáo viên**, nhập mật khẩu để làm lịch. Giáo viên chỉ cần xem lịch có thể dùng chế độ học viên mà không cần mật khẩu.

Nếu muốn tiếp tục với dữ liệu đã làm ở trang cũ, Giáo vụ cần **tải bản sao lưu toàn bộ app từ trang cũ rồi khôi phục ở trang GitHub mới**. Dữ liệu không tự chuyển theo mã nguồn.

## 4. Kiểm tra sau khi xuất bản

- Chữ có dấu tiếng Việt, icon và màu hiển thị đầy đủ.
- Trang mặc định màu xanh, không có nút sửa/thêm lịch.
- Chế độ Giáo vụ mở được sau khi nhập mật khẩu.
- Lưu thử một thay đổi rồi tải lại vẫn còn; trang trở về chế độ chỉ xem.
- Tải bản sao lưu và thử khôi phục trên một trình duyệt thử nghiệm riêng nếu cần.

## 5. Những điểm dễ nhầm

**Link mã nguồn HTML không phải link app.** Link kiểu `github.com/.../blob/main/index.html` chỉ xem mã. Dùng **Visit site**.

**Upload mã mới không upload lịch Giáo vụ đang làm.** Lịch nằm trong trình duyệt. Muốn trao đổi giữa hai máy, dùng file sao lưu JSON. Muốn đồng bộ nhiều người cần phát triển thêm phần dữ liệu dùng chung.

**Không tự chép bản sao lưu thật lên repo công khai.** File đó là dữ liệu làm việc, không phải mã nguồn. Thư mục `backups/` đã được bỏ qua trong cấu hình Git.

**Cập nhật app:** sao lưu dữ liệu trước, thay mã đúng phiên bản, giữ nguyên khóa lưu dữ liệu và quy trình chuyển đổi; mở lại website và kiểm tra. Nếu đổi tài khoản/tên miền/nguồn trang, dùng bản sao lưu để chuyển dữ liệu.

**Trang trắng hoặc lỗi font:** kiểm tra đã upload đủ file; tên file phân biệt chữ hoa/thường trên hosting. Package dùng đường dẫn tương đối để hỗ trợ repo con, không đổi chúng thành đường dẫn `/...` ở gốc tên miền.

## Đổi mật khẩu sau này

Không đổi mật khẩu bằng cách ghi rõ nó vào mã. Nếu cần, trên máy chạy `npm run password:hash`, nhập mật khẩu ở terminal (không hiện chữ), lấy giá trị SHA-256 và thay `teacherPasswordSha256` trong `config.js`. Script không tự ghi file. Cách này vẫn chỉ là khóa giao diện của app tĩnh; muốn bảo vệ thật bằng tài khoản cần cơ chế phía máy chủ.
