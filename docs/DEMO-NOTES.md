# Proskills · Lịch dạy (demo)

## Chế độ xem và Giáo vụ Hành chính

- Mỗi lần mở hoặc tải lại trang mặc định **Chế độ học viên**, hệ màu xanh. Chế độ này dành cho cả học viên và giáo viên xem lịch, lọc hoặc sắp xếp theo giáo viên/lớp/ngày giờ; không có các thao tác sửa lịch hoặc danh mục.
- Học viên chỉ xem tuần hiện tại theo múi giờ Việt Nam và tuần kế tiếp nếu đã có lịch. Khi chưa có tuần hiện tại, hiển thị tuần trống, không tự chuyển về lịch cũ. Dữ liệu mẫu của tháng 11 sẽ không được coi là lịch hiện tại khi thời gian thực đã sang tuần khác.
- **Chế độ giáo viên** yêu cầu mật khẩu được người dùng chỉ định và dành cho **Giáo vụ Hành chính** điều chỉnh. Quyền chỉnh sửa chỉ giữ trong bộ nhớ của trang, không lưu phiên giáo viên sau khi tải lại.
- Đây vẫn là bản demo tĩnh. Mật khẩu kiểm tra bằng mã băm ở trình duyệt, khóa các thao tác thông thường trên giao diện; **không phải xác thực/phân quyền từ máy chủ**. Chưa có dữ liệu dùng chung giữa các trình duyệt hoặc tài khoản học viên. Quyền truy cập trang Sites vẫn riêng tư như trước; chế độ học viên không tự mở quyền truy cập cho người khác.
- Tab **Tìm buổi học bù** nhận tên lớp (gợi ý đối tượng), đối tượng/chương trình, tên giáo viên và từ khóa chuyên đề. Tìm các buổi chưa hủy/chưa xác nhận dạy trong tuần hiện tại và tuần kế tiếp, từ ngày hiện tại trở đi. Có thể tìm ở lớp khác. Kết quả không xác nhận được tham gia hoặc còn chỗ.
- Chi tiết buổi học ở chế độ học viên chỉ hiển thị dữ liệu; có tên người xin phép và lời nhắn để sao chép, kèm nút mở MS Teams. Cần tự chọn đúng giáo viên, dán và gửi lời nhắn; app chưa có địa chỉ Teams của giáo viên và không tự gửi tin nhắn.
- Cả hai chế độ đều xem **Lịch chào thứ 6**, 7:30–7:45 và 12:45–13:00. Các ca này được lưu riêng, không cộng vào tiết ngày/tối. Giáo vụ có thể thêm/sửa/xóa, gán cơ sở và chọn danh sách giáo viên luân phiên cho từng ca. Khi sao chép tuần, chuyển sang người kế tiếp trong danh sách còn hoạt động; hai ca cùng cơ sở ưu tiên hai người khác nhau. Bỏ chọn luân phiên để giữ nguyên người phụ trách.
- Đã nhập 10 phân công chào tường minh từ 5 sheet lịch tuần nguồn. Các tuần mẫu có sẵn được bổ sung khi nâng cấp nếu trước đó chưa có trường lịch chào; không thay lịch chào đã được người dùng lưu. Lịch chào nguồn giữ tham chiếu sheet/ô. Giáo vụ cần rà soát danh sách luân phiên theo tình hình thực tế.
- Giáo viên GDTC: Cô Nguyễn Trang, Cô Lê Uyên, Thầy Vi San, Thầy Trung Hiếu. Bổ sung Cô Xuân Thủy; chuẩn hóa tên Vi San/Xuân Thủy trên các phân công gắn cùng mã giáo viên. Không tự suy đoán người phụ trách từng buổi có tên chung `GV GDTC` trong Excel.
- Tên tab: **Lịch học trong tuần**, **Chương trình đào tạo**. Nhãn `Chưa cấu hình` đã đổi thành **Chưa thiết lập**.
- Tạo chương trình có 10 màu: Clay, Sky, Olive, Fig, Heather, Cactus, Coral, Kraft, Manilla, Slate. Có thể đổi màu chương trình đã tạo. Màu được giữ trong bản sao lưu và dùng cho lịch/chú giải.
- Tên giáo viên nằm trong thẻ màu nhẹ riêng; màu tự gán và giữ theo mã giáo viên. Khi số giáo viên vượt số màu trong bảng, màu có thể lặp lại.
- Chế độ Tuần dùng chữ 12px cho các thông tin trong buổi, chỉ tên lớp in đậm. Thứ và ngày cùng 13px, Thứ in đậm và ngày không in đậm. Vùng điều hướng và trục ca/ngày có nền đậm hơn, có nút ẩn/hiện thanh bên để mở rộng lịch. Các nút thao tác dùng màu cam đất.
- Dòng cập nhật lịch dùng ngày/giờ lưu gần nhất theo Việt Nam. Bản sao lưu cũ chưa có mốc thời gian sẽ ghi rõ chưa có ngày cập nhật, không suy diễn một ngày lịch sử.

Kiểm tra bổ sung: `node check-modes.cjs` kiểm tra tuần được phép xem, tìm học bù không dấu, luân phiên lịch chào, bảo toàn công suất, chuyển dữ liệu cũ, danh sách GDTC và màu chương trình. Đã thử qua giao diện: mặc định chỉ xem, chặn mật khẩu sai, đăng nhập đúng, chi tiết học bù/lời nhắn Teams, sắp xếp giáo viên, tạo ca chào và tuần mới, tạo chương trình với 10 màu, ngày cập nhật, ẩn thanh bên và kích thước điện thoại 390px.

## Cập nhật Material 3

- Giao diện theo phong cách Material 3: thanh điều hướng có vùng chọn dạng viên, nút bo tròn, khối lịch/thẻ và hộp thoại bo góc, các lớp nền và trạng thái tương tác rõ ràng. Điện thoại có thanh điều hướng dưới cùng và hộp thoại dạng bảng trượt từ dưới.
- Bảng màu riêng: Clay `#D97757`, Book Cloth `#CC785C`, Crail `#C15F3C`, Kraft `#D4A27F`, Manilla `#EBDBBC`, Ivory Light `#FAF9F5`, Ivory Medium `#F0EEE6`, đường viền `#E8E6DC`, Slate Dark `#141413`. Màu phụ Sky/Olive/Fig/Heather/Cactus/Coral dùng cho các vai trò thông tin và nhóm nội dung; các nền nhạt và màu chữ tương ứng được điều chỉnh để dễ đọc.
- Có nút chuyển sáng/tối ở góc trên; lựa chọn được nhớ trên trình duyệt. Nền tối `#262624`, thanh bên và trường nhập `#1F1E1D`. Các chữ nhỏ dùng Cloud Medium hoặc màu phụ có độ tương phản rõ, thay vì dùng Mid Gray làm chữ chính.
- Toàn bộ chữ dùng **Be Vietnam Pro**, đã đóng gói đủ dấu tiếng Việt và các độ đậm 400/500/600/700. Biểu tượng dùng **Material Symbols Rounded** chính thức của Google, được đóng gói tại máy và kèm giấy phép Apache 2.0; app không cần gọi Google Fonts khi mở.
- Bảng công suất và CSV có thứ tự: **Giáo viên → Tổng tiết → Tiết ngày → Tiết tối → Chi tiết từng ngày**.
- Danh mục mới **Phòng học**: thêm/sửa tên, chọn cơ sở AB1/AB2/Âu Cơ, ngừng sử dụng phòng. Các phòng có sẵn trong lịch được đưa vào danh mục tự động. Trong buổi học chọn cơ sở rồi chọn phòng; danh sách chỉ hiện phòng đang sử dụng của cơ sở đó, vẫn giữ phòng cũ khi mở sửa một buổi cũ.
- Không tạo phòng trùng tên trong cùng cơ sở; cùng tên ở cơ sở khác vẫn hợp lệ. Đổi tên phòng cập nhật các buổi liên quan. Phòng đã có lịch không thể đổi cơ sở để tránh sửa sai lịch sử; tạo một phòng mới cho cơ sở khác.
- Bản sao lưu cũ vẫn khôi phục được; danh mục phòng được tạo từ thông tin phòng và cơ sở hiện có. Bản sao lưu mới có cả danh mục phòng. Đổi giao diện không thay khóa lưu lịch trên trình duyệt.

Tham khảo thiết kế: [Material 3](https://m3.material.io/), [Tổng quan thành phần Material trên Android](https://developer.android.com/design/ui/mobile/guides/components/material-overview?hl=vi), [Material Symbols của Google](https://github.com/google/material-design-icons).

Mở bản đã triển khai bằng liên kết trong cuộc trò chuyện, hoặc mở `dist/index.html` trên máy tính để dùng bản độc lập. Các tệp trong `dist` phải nằm cùng nhau.

## Dùng thử

1. Chọn tuần 23/11/2026, lọc lớp NH4 để xem lịch minh họa.
2. Bấm **Tạo tuần mới**, giữ khung lịch và gợi ý bài **Theo lịch đã xếp**.
3. Tuần mới sẽ chuyển NH4 sang bài tiếp theo. Bấm vào thẻ lịch để thay giáo viên, ngày, tiết, phòng, cơ sở, chuyên đề hoặc trạng thái.
4. Trong **Danh mục**, thay tên lớp/giáo viên; bỏ chọn “Lớp còn đang học” để ẩn lớp hoàn thành khỏi danh sách thêm buổi mới.
5. **Công suất giáo viên** cộng riêng tiết ngày 1–8 và tiết tối 9–12. Không tính các buổi đã hủy; vẫn cộng các buổi trùng nên cần xử lý cảnh báo trước khi chốt.
6. **Tra cứu** hỗ trợ tìm không dấu theo lớp, giáo viên, chuyên đề, cơ sở hoặc phòng. Chọn tìm mọi tuần để tìm buổi học bù. Cần xác nhận với giáo viên trước khi tham gia.
7. **Xuất & sao lưu** cho phép xuất CSV, JSON tuần, sao lưu toàn bộ và khôi phục.

## Nguồn và giới hạn

- TTS: 25 chuyên đề, 50 tiết; trích nguyên văn sheet `2025_JPC` của `5. PHIẾU QUẢN LÝ HỌC TẬP.xlsx`.
- Nhà hàng: 18 chuyên đề, 36 tiết; trích nguyên văn sheet `NH4`.
- Có 5 tuần mẫu từ 26/10 đến 23/11/2026. Chỉ nhập các block có lớp, một giáo viên và chuyên đề trong các ô tường minh. Các ô gộp, ca nối, hoạt động phụ và nhóm nhiều giáo viên chưa được suy diễn. Đây là dữ liệu demo một phần, không phải bản chuyển đổi toàn bộ Excel. Cần kiểm tra lại với file gốc trước khi dùng chính thức.
- Mã lớp được thống nhất giữa các tuần khi chỉ khác ghi chú `(TRÁI BUỔI)`. Các lớp ghép vẫn giữ riêng.
- Ghép tên bài trong lịch với bài trong chương trình là gợi ý dựa trên tên, cần rà soát. Không suy diễn đã học xong: buổi nhập có trạng thái đã xếp; những buổi ghi nghỉ lễ được đánh dấu hủy.
- NH4 là lớp minh họa, không phải lịch NH4 có thật trong file lịch tuần.
- Khi chuyển bài, lấy mốc xa nhất đã xếp trong chương trình, cộng theo số tiết; bài học bù ở phần trước không làm lùi mốc. Có thể chọn chỉ dựa trên buổi đã xác nhận dạy. Bài chưa gán được chương trình được giữ lại để sửa. Hết chương trình thì bỏ khung lịch thay vì quay lại bài đầu.
- Demo lưu bằng localStorage trên từng trình duyệt/nguồn trang. Dữ liệu ở bản trên máy và bản triển khai không tự đồng bộ. Chưa có tài khoản, phân quyền, lưu chung hay chỉnh sửa đồng thời. Nên tải bản sao lưu sau khi làm lịch.
- App có chặn trùng giáo viên/lớp/phòng khi lưu. Nhóm đồng giảng, phòng online và đổi cơ sở cần mở rộng trong phiên sau.
- Xuất `schedule.json` chuẩn bị cho kết nối Proskills Hub; chưa thay đổi Hub và chưa cập nhật GitHub của khóa học.
- Khung giờ mỗi tiết 45 phút được suy từ 6 ca hai tiết trong file lịch và Hub. Khi xếp tiết lẻ cần kiểm tra quy ước giờ thực tế.

## Kết nối Proskills Hub sau này

`schedule.json` chứa `schemaVersion`, `timeZone`, `exportedAt`, `week.startDate`, `week.endDate`, `week.sessions`. Mỗi buổi có ngày ISO, mã và tên lớp/giáo viên, tiết bắt đầu/kết thúc, giờ học, phòng, cơ sở, mã bài và nội dung chuyên đề tách riêng. Buổi hủy không nằm trong lịch xuất cho học viên. Có cờ `isSuggestion` và `isDemo` để tránh nhầm lịch mẫu với lịch chính thức.

Hub hiện lưu lịch cá nhân trong `PS.prefs().lich` ở `hub/lich.js`. Phiên tích hợp cần bổ sung đọc dữ liệu theo tuần, ánh xạ lớp học viên vào `classId`, xử lý tên/mã lớp, xuất bản lịch đã duyệt và tránh cache lịch cũ. Không cần học viên nhập lại từng ca.

## Kiểm tra

`node check.cjs` kiểm tra cấu trúc dữ liệu, chuyển bài TTS/NH, bài nhiều tiết/chia buổi, dừng cuối chương trình, bỏ lớp hoàn thành và buổi hủy, ngày tuần, xung đột, tính tiết ngày/tối, khôi phục và chế độ xác nhận đã dạy.

Đã thử qua giao diện: tạo tuần mới, NH4 chuyển bài, sửa phòng, tra cứu nhiều tuần, bảng công suất; kiểm tra bố cục 1440px và 390px. Công cụ chụp ảnh màn hình không trả được ảnh nên chưa xác minh bằng ảnh; kiểm tra cấu trúc giao diện và kích thước hiển thị cho thấy thẻ lịch không tràn ngang trên 390px.

Font Be Vietnam Pro được sao chép từ bộ tài nguyên Proskills do người dùng cung cấp, theo giấy phép đi kèm `dist/FONT-LICENSE.txt`.
