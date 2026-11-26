# Proskills trên điện thoại — V1.1.2

## Đưa bản mới lên GitHub

Đưa **toàn bộ nội dung bên trong `PS-LICHDAY-V1.1.3`** lên gốc repo, ghi đè các file app cũ. `index.html`, `manifest.webmanifest`, `sw.js` và `published-schedule.json` phải nằm cùng cấp. Giữ `assets/` và các tài nguyên đi kèm. Không upload ZIP thay cho nội dung và không tạo thêm thư mục con bọc app.

Giữ GitHub Pages ở nhánh đang dùng, thư mục `/(root)`. Mở URL GitHub Pages qua HTTPS để cài app và lưu ngoại tuyến. Mở trực tiếp file HTML trên máy không hỗ trợ đầy đủ PWA.

## Cài trên điện thoại

- **Android:** mở website bằng Chrome → nút **?** → **Cài app**. Nếu trình duyệt chưa hiện hộp cài trực tiếp, dùng menu ⋮ → Cài đặt ứng dụng / Thêm vào màn hình chính.
- **iPhone/iPad:** mở website bằng Safari → Chia sẻ → Thêm vào Màn hình chính → bật Mở dưới dạng ứng dụng nếu có → Thêm.
- Icon launcher là logo Proskills gốc trên nền xám đen, dùng cho cả giao diện sáng và tối. App mở ở chế độ standalone khi được cài bằng trình duyệt hỗ trợ.

Màu thanh hệ thống lấy theo theme của app qua `theme-color`, nền trang và vùng an toàn trên/dưới. iOS có quy tắc riêng cho status bar; màu/chữ cuối cùng phụ thuộc phiên bản hệ điều hành và cách mở app. Cần kiểm tra trên điện thoại thật trước khi chốt màu thanh hệ thống.

## Giao diện học viên từ V1.1.3

- Header chỉ còn logo và dấu hỏi, cuộn cùng nội dung. Không có nút Giáo viên hoặc sáng/tối ở màn hình học viên. Giữ giao diện đã lưu trên thiết bị.
- **Giữ logo 3 giây** để mở hộp mật khẩu Giáo viên. Chạm nhanh, thả sớm hoặc kéo trang sẽ hủy. Trên bàn phím, chọn logo rồi giữ Enter/Space 3 giây. Sau khi đăng nhập, dùng nút Chế độ học viên để trở về.
- Thanh dưới nổi cao54px, bo tròn4góc, chỉ Lịch học/Học bù. Cuộn xuống để ẩn, cuộn lên để hiện; tôn trọng vùng an toàn điện thoại. Chuyển tab sẽ lên đầu nội dung mới.
- Nút học viên xanh nhạt, dấu hỏi nhỏ cân với logo. Hướng dẫn xem trong dấu hỏi.
- Bộ lọc giáo viên và lớp mỗi ô một dòng, tên dài tự xuống dòng. Placeholder14px và màu mờ hơn; chữ nhập thực tế16px.
- Chi tiết buổi học trình bày riêng chuyên đề, ngày, giờ, giáo viên, phòng/cơ sở. Không cần nhập họ tên hay soạn lời nhắn. Nếu đi học bù, bạn nhớ xin phép giáo viên trước ít nhất 1 ngày.

## Ghi chú giao diện V1.1.2 (lịch sử, thay bởi V1.1.3 ở trên)

- Thanh trên cùng một hàng: logo, Giáo viên, sáng/tối, hướng dẫn. Không có nút ẩn/hiện sidebar, tên thương hiệu dài hoặc biểu tượng khóa ở nút Giáo viên trên điện thoại.
- Thanh dưới chỉ có **Lịch học** và **Học bù**, cao 44px cộng vùng an toàn của điện thoại. Không còn hàng tab tuần dưới cùng. Đổi tuần bằng hộp chọn phía trên nội dung.
- Lịch chào giáo viên ở cuối lịch học, mặc định thu gọn. Chạm tiêu đề để mở/đóng.
- Tiêu đề ngày trong Danh sách dùng xanh đậm, chữ sáng.
- Nội dung giao diện không chọn chữ khi chạm giữ; ô nhập và lời nhắn xin học bù vẫn cho chọn/sửa/sao chép.
- Ghi nhớ bộ lọc lớp, giáo viên, sắp xếp và kiểu xem trên thiết bị; không lưu trạng thái mở quyền Giáo vụ.

## Phát hành lịch mới để học viên nhận được

1. Giáo vụ mở chế độ **Giáo viên**, lập và rà soát lịch tuần này/tuần sau.
2. Vào **Xuất & sao lưu → Tải lịch học viên để phát hành**.
3. Upload file **`published-schedule.json`** vừa tải lên **cùng cấp với `index.html`** trong repo GitHub, thay file cũ và lưu thay đổi. Chờ GitHub Pages cập nhật.
4. Khi mở app, quay lại app hoặc đang dùng app, thiết bị kiểm tra file này (mỗi 60 giây khi trang đang hiển thị). Nếu dữ liệu khác bản đã nhận, hiện **“Có lịch mới tuần dd/mm – dd/mm”** cùng nút **Cập nhật lịch**.
5. Học viên bấm cập nhật để xem bản mới và lưu bản đó trên thiết bị. Lần đầu nhận bản phát hành cũng cần bấm nút này.

**File đi kèm package là lịch mẫu**, chưa phải lịch thật đã được Giáo vụ duyệt. Hãy thay nó bằng file xuất từ dữ liệu đang làm trước khi gửi link cho học viên.

Đây là phát hành một chiều qua GitHub: sửa lịch trên máy Giáo vụ **không tự upload**. File phát hành chỉ chứa lịch tuần này/tuần sau và các danh mục cần hiển thị; bỏ buổi hủy, tham chiếu nguồn nội bộ, ghi chú/luân phiên lịch chào. File này **không thay thế bản sao lưu**. Không dùng `schedule.json` một tuần hoặc backup toàn bộ để thay tên cho file này.

Lịch phát hành được lưu riêng với dữ liệu lập lịch. Chuyển sang Giáo vụ sẽ dùng lại dữ liệu chỉnh sửa trên máy; không lấy bản học viên ghi đè lên lịch Giáo vụ. Giữ khóa `proskills-planner-v1` và khả năng khôi phục backup cũ.

## Mất mạng và cập nhật app

Sau khi mở trực tuyến và tải tài nguyên hoàn tất, app giữ giao diện/font/icon để mở lại khi mất mạng. Lịch đã nhận hoặc dữ liệu có sẵn trên máy vẫn xem được; chưa tải lịch thì không thể tự tạo ra lịch mới khi ngoại tuyến.

Nút **? → Kiểm tra cập nhật** kiểm tra cả lịch mới và phiên bản app. Khi website có phiên bản phần mềm mới, app hiện nút **Cập nhật app**; chỉ tải lại sau khi người dùng bấm, tránh tự đóng màn hình đang thao tác. Nút này khác với **Cập nhật lịch**.

Thông báo lịch hiện **trong app khi mở hoặc đang sử dụng**. Bản này không có máy chủ Web Push nên **không gửi thông báo hệ thống khi app đã đóng**. Không yêu cầu quyền thông báo khi vừa mở.

## Ghi chú cho lần phát triển sau

- `mobile.css` nạp cuối, chỉ thu gọn shell học viên ở breakpoint ≤760px. Giáo vụ giữ điều hướng chỉnh sửa.
- `feed-core.js` định nghĩa/kiểm tra/lọc snapshot; `student-sync.js` nhận và chọn dữ liệu chỉ xem; `pwa.js` phụ trách cài đặt, trạng thái, kiểm tra phiên bản và ghi nhớ bộ lọc.
- Đường dẫn feed, manifest, worker, icon đều tương đối để chạy ở `/ten-repo/`.
- Khi thay tài nguyên app, tăng `VERSION` trong `sw.js` và cập nhật danh sách `ASSETS` nếu thêm/bớt file. Worker cài đủ một bộ tài nguyên rồi mới sẵn sàng, chờ người dùng bấm cập nhật trước khi thay worker đang hoạt động. Lịch JSON luôn lấy qua mạng, không dùng bản cũ từ cache shell.
- Cache, dữ liệu lịch học viên và bộ lọc có tên theo đường dẫn repo để không lẫn các app khác cùng tên miền. Dữ liệu Giáo vụ giữ khóa cũ để tương thích.

Tham khảo kỹ thuật: [Service workers và ngoại tuyến](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [cài PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt), [theme-color](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color), [status bar trên iOS](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html).
