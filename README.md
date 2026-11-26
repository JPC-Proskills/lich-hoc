# Proskills · Lịch học trong tuần

Bản dùng thử độc lập cho học viên, giáo viên xem lịch và Giáo vụ Hành chính lập lịch. Phiên bản **PS-LICHDAY-V1.1.7 · 26/11/2026**.

**Đọc trước:** [Đưa lên GitHub Pages](docs/GITHUB-PAGES.md) · [Hướng dẫn Giáo vụ và sao lưu](docs/HUONG-DAN-GIAO-VU.md) · [Bàn giao cho AI tiếp tục phát triển](AI_HANDOFF.md).

## Giao diện học viên V1.1.7

Học viên chỉ xem tuần do Giáo vụ phát hành. **Tra cứu** cho phép chọn nhiều lớp và lọc nâng cao theo chuyên đề, giáo viên, đối tượng, cơ sở hoặc tiết. **Lịch tuần** có các nút nhóm lịch theo ngày giờ, giáo viên, lớp, cơ sở và đối tượng. Hai tab mở ở dạng danh sách. Bấm **Giáo viên** để mở hộp mật khẩu. Có thể giữ logo hoặc chữ Proskills **1,5 giây** để mở cùng hộp.

## Điện thoại, cài app và phát hành lịch

Vào **? → Cài app** để cài trên điện thoại. Học viên có thể mở chi tiết buổi học, xem chuyên đề của các buổi tiếp theo và tải tệp lịch `.ics` để thêm vào ứng dụng lịch.

Giáo vụ chọn **Hiển thị cho học viên** trên tuần cần phát hành, sau đó vào **Xuất & sao lưu → Tải lịch học viên để phát hành**. Đưa tệp **published-schedule.json** lên gốc repo GitHub Pages. Học viên tự nhận tệp mới khi ứng dụng kiểm tra cập nhật. Thay lịch mẫu trong gói bằng lịch đã duyệt trước khi gửi học viên. Xem [hướng dẫn điện thoại và phát hành](docs/DIEN-THOAI-PWA.md).

## Đưa lên repo riêng

1. Giải nén package. Đưa **nội dung bên trong thư mục `PS-LICHDAY-V1.1.7`** lên thư mục gốc của repo. `index.html` phải nằm ngay ở gốc, không nằm trong một thư mục con.
2. Vào **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
3. Mở **Visit site** ở phần Pages. Gửi **đường dẫn website** cho Giáo vụ; không gửi đường dẫn xem mã nguồn HTML trên GitHub.

Không cần cài thư viện, build hay cấu hình tên repo trong mã. Mọi tài nguyên được đóng gói cùng app và dùng đường dẫn tương đối. Có sẵn `.nojekyll` cho trang tĩnh. Xem các bước chi tiết và nguồn hướng dẫn GitHub trong [GITHUB-PAGES.md](docs/GITHUB-PAGES.md).

## Chức năng hiện có

- Mặc định chế độ học viên nền xám trung tính, điểm nhấn xanh đậm, xem một tuần đã phát hành; tra cứu nhiều lớp và xem gợi ý học bù khi dữ liệu chương trình đủ để dự kiến.
- Chế độ có mật khẩu dành cho Giáo vụ Hành chính: thêm/sửa lịch, tạo tuần mới từ tuần cũ, gợi ý bài kế tiếp và quản lý danh mục.
- Chương trình TTS `2025_JPC`: 25 bài/50 tiết; NH `NH4`: 18 bài/36 tiết. Có thể thêm chương trình và chọn 1 trong 10 màu.
- Phòng học theo AB1, AB2, Âu Cơ; giáo viên; lớp học; lớp hoàn thành được ẩn khi thêm lịch mới.
- Công suất: Giáo viên → Tổng tiết → Tiết ngày 1–8 → Tiết tối 9–12 → Chi tiết từng ngày.
- Lịch chào thứ 6: 7:30–7:45 và 12:45–13:00; có danh sách luân phiên, không tính vào số tiết dạy.
- Giao diện Material 3, tiêu đề Nunito và nội dung Be Vietnam Pro; logo Proskills mới; chế độ học viên nền xám, nút xanh đậm; hai chế độ dùng xanh dương và nền sáng, với thanh bên xanh lam nhạt cho Giáo vụ và xanh bạc hà cho học viên; khoảng cách gọn hơn trên điện thoại.
- Xuất CSV, JSON một tuần, sao lưu và khôi phục toàn bộ app. Soạn lời nhắn xin học bù, sao chép và mở MS Teams để tự gửi.

## Dữ liệu và giới hạn cần biết khi thử

**Dữ liệu lịch được lưu trong trình duyệt của từng máy.** App không tự lưu lên repo và không tự đồng bộ giữa Giáo vụ với học viên/người dùng khác. Người mở website trên máy khác chỉ có dữ liệu mẫu cho đến khi khôi phục bản sao lưu. Mỗi lần chỉnh lịch xong, Giáo vụ nên tải **bản sao lưu toàn bộ app**.

**CSV / schedule.json chỉ là lịch của một tuần**, không dùng thay bản sao lưu toàn bộ. Bản sao lưu toàn bộ giữ các tuần trước, lớp, giáo viên, phòng, chương trình và lịch chào. Khôi phục sẽ **thay toàn bộ** dữ liệu trên trình duyệt đích, không gộp hai bản. Xem [hướng dẫn có từng nút bấm](docs/HUONG-DAN-GIAO-VU.md).

- Khi chuyển từ bản Sites hoặc đường dẫn khác sang GitHub Pages: tải bản sao lưu từ trang cũ, mở trang mới, vào chế độ Giáo vụ và khôi phục. Việc tải package không tự lấy các thay đổi đang nằm trong trình duyệt của bạn.
- Khóa bằng mật khẩu trong bản tĩnh chỉ bảo vệ thao tác giao diện thông thường, **chưa phải tài khoản và phân quyền máy chủ**. Mật khẩu giữ như bản demo đã thống nhất; chủ dự án gửi riêng cho Giáo vụ. Không ghi mật khẩu rõ trong repo.
- GitHub Pages thông thường là website công khai; mật khẩu chỉnh sửa trong app không giới hạn người xem trang. Cân nhắc điều này trước khi đưa dữ liệu thật lên repo/website.
- Lịch mẫu nhập **một phần** từ Excel, chưa đầy đủ ô gộp/ca nối; công suất mẫu chưa đại diện toàn bộ file nguồn. NH4 là lớp minh họa. Gói demo phát hành tuần 23.11-29.11 để dùng thử. Khi đưa vào sử dụng, Giáo vụ chọn và phát hành tuần cần hiển thị.
- Chưa tự gửi tin Teams, chưa có địa chỉ Teams từng giáo viên, chưa tự kết nối Proskills Hub.

## Tiếp tục phát triển

Từ lần bàn giao này, **repo/package này là nguồn mã chính**. Không tiếp tục sửa bản cũ trong `app/dist` rồi chép đè lại repo vì có thể mất các thay đổi mới.

Khi làm với Codex, Claude, Gemini hoặc công cụ khác, yêu cầu đọc **[AI_HANDOFF.md](AI_HANDOFF.md)** trước. `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` và hướng dẫn Copilot đều dẫn về tài liệu đó. Cập nhật `CHANGELOG.md` sau mỗi lần thay đổi có ý nghĩa.

## Chạy và kiểm tra trên máy, nếu cần

Cài Node.js 20 trở lên, mở terminal tại thư mục repo:

```text
npm start
```

Mở đường dẫn được in ra, mặc định `http://127.0.0.1:4173/`. Không cần `npm install` vì package không có thư viện phụ thuộc.

```text
npm test
```

Kiểm tra mô phỏng đường dẫn repo GitHub Pages:

```text
node scripts/serve.cjs --base=/ten-repo
```

Không khuyến nghị mở bằng cách nhấp đúp `index.html`: khóa giáo viên và lưu trữ cần được thử qua HTTP localhost hoặc HTTPS GitHub Pages.

## Tài nguyên

Font và biểu tượng có giấy phép đi kèm, xem [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Chưa chọn giấy phép công khai cho mã app; trường `UNLICENSED` trong package không áp dụng thay giấy phép riêng của các tài nguyên này.
