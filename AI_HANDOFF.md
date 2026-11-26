# Bàn giao dự án cho Codex, Claude, Gemini và công cụ AI khác

**Đọc file này trước khi sửa mã.** Đây là ngữ cảnh và quyết định đã thống nhất với chủ dự án, không phải một yêu cầu viết lại app. Yêu cầu mới nhất của người dùng luôn có ưu tiên cao hơn tài liệu này.

## 1. Mục tiêu và giai đoạn hiện tại

Chủ dự án muốn app lập lịch đào tạo hằng tuần thay cho Excel: mỗi tuần như một sheet, sao chép khung tuần cũ, gợi ý bài kế tiếp, quản lý lớp/giáo viên/phòng/chương trình, thống kê tiết và giúp học viên tìm lịch học bù trên điện thoại.

**Hiện tại:** thử nghiệm trong một repo GitHub riêng và phát qua GitHub Pages để Giáo vụ Hành chính dùng thử. Package này trở thành **nguồn mã chính để tiếp tục chỉnh sửa**. Không quay lại sửa nguồn bản Sites cũ rồi chép đè vào repo đang làm việc.

**Về sau:** kết nối thẻ “Lịch học” trong Proskills Hub. Khi học viên đã nhập tên/lớp, Hub tự lấy lịch phù hợp của tuần. Hiện app mới có xuất dữ liệu, chưa tích hợp hoặc đồng bộ với Hub.

Giao tiếp và tài liệu cho chủ dự án/Giáo vụ bằng tiếng Việt dễ hiểu. Thực hiện chỉnh sửa được yêu cầu, kiểm tra và bàn giao; không chỉ đưa đề xuất hoặc giả lập nút bấm.

## 2. Cách chạy và cấu trúc repo

App HTML/CSS/JavaScript thuần, **không framework, không build, không phụ thuộc npm**. `index.html` ở gốc để GitHub Pages dùng nhánh `main`, thư mục `/(root)`. Tài nguyên dùng đường dẫn tương đối, chạy được dưới `/ten-repo/`.

```text
index.html                Giao diện khung, thứ tự nạp script
config.js                 Mã băm mật khẩu giao diện và URL mở Teams
app.js                    Trạng thái ứng dụng, render, form, sự kiện, xuất/nhập
core.js                   Logic dữ liệu thuần, kiểm tra và chuyển tuần
modes.js                  Chế độ học viên/Giáo vụ, tìm học bù, chi tiết chỉ xem
greetings.js              Giao diện lịch chào thứ 6
colors.js                 Bảng chọn màu và thẻ tên giáo viên
ui.js                     Icon và lựa chọn sáng/tối
seed.js                   Dữ liệu mẫu window.SEED
fonts.css                 Font Be Vietnam Pro đóng gói tại máy
m3.css                    Giao diện Material 3 nền tảng
modes.css                 Vai trò, chữ nhỏ, nút cam đất, thẻ màu, lịch chào
*.woff2                   Font chữ/icon, không tải từ CDN lúc mở app
tests/check.cjs           Kiểm tra hồi quy lập lịch và phòng
tests/check-modes.cjs     Tuần học viên, học bù, lịch chào, roster, màu
scripts/verify.cjs        Cú pháp, tài nguyên và đường dẫn GitHub Pages
scripts/serve.cjs         Xem thử localhost, hỗ trợ --base=/ten-repo
docs/                     Hướng dẫn GitHub/Giáo vụ và ghi chú bản demo gốc
```

Chạy `npm start`; kiểm tra `npm test`. Không cần `npm install`. Có thể chạy `node scripts/serve.cjs --base=/ten-repo` để kiểm tra đường dẫn repo con.

**Thứ tự script quan trọng:** `ui.js` trong head; cuối body là `seed.js`, `core.js`, `config.js`, `modes.js`, `greetings.js`, `colors.js`, `app.js`. App dùng các binding toàn cục theo thứ tự này. `app.js` gọi `init()` ở cuối; không làm các file kia chạy logic truy cập `db` trước khi app khởi tạo.

`m3.css` được nạp trước `modes.css`; một số quy tắc sau cố ý ghi đè giao diện cũ. Trước khi sửa CSS cần xem độ ưu tiên và cả chế độ sáng/tối/học viên.

## 3. Vai trò đã thống nhất

### Chế độ học viên — mặc định mỗi lần mở/tải lại

- Hệ màu **blue**, chỉ có “Lịch học trong tuần” và “Tìm buổi học bù”. Dành cho cả học viên và giáo viên xem lịch.
- Chỉ tuần hiện tại theo **Asia/Ho_Chi_Minh** và tuần kế tiếp **nếu đã có lịch**. Không tự chuyển về tuần mẫu/tháng 11/2026 khi ngày hiện tại đã khác. Tuần hiện tại thiếu thì dùng đối tượng tuần trống, không ghi nó vào dữ liệu.
- Có lọc và sắp xếp theo tên giáo viên, lớp, ngày/giờ. Chọn thẻ lịch mở chi tiết chỉ xem, không mở form sửa.
- Tìm học bù nhận tên lớp của học viên (để gợi ý chương trình), đối tượng, tên giáo viên, từ khóa chuyên đề. Kết quả gồm cả lớp khác, trong tuần hiện tại/tuần sau, từ ngày hiện tại trở đi, chỉ các buổi `planned`. Hiện chưa loại theo giờ đã kết thúc trong cùng ngày và chưa biết sức chứa.
- Phải nhắc **xin phép giáo viên qua MS Teams trước, đợi được đồng ý mới tham gia**. Có lời nhắn để sao chép và link mở Teams; không tự gửi hoặc tự đoán địa chỉ giáo viên.

### Chế độ giáo viên — thực chất dành cho Giáo vụ Hành chính

- Bấm nút chuyển chế độ và nhập mật khẩu chủ dự án đã chỉ định. Mã chỉ lưu giá trị SHA-256 trong `config.js`; không ghi mật khẩu rõ vào tài liệu/repo.
- Có tất cả các tuần, lập/sửa lịch, danh mục, công suất, sao lưu/khôi phục và lịch chào.
- Trạng thái được mở quyền chỉ ở bộ nhớ trang, **không giữ đăng nhập sau reload**. Chuyển về học viên phải đóng form đang mở, về tuần được phép và không còn đường thao tác sửa thông thường.
- Đây là **khóa giao diện bản tĩnh, không phải phân quyền máy chủ**. Không mô tả nó như một cơ chế chống truy cập dữ liệu hoặc bảo mật thật. Học viên kỹ thuật có thể đọc mã/trạng thái máy. GitHub Pages không có backend để tự bảo vệ các thao tác.

Đừng thay đổi yêu cầu vai trò/đối tượng xem hoặc đưa Giáo viên thông thường vào vai trò sửa chỉ vì nút có tên “Chế độ giáo viên”.

## 4. Dữ liệu và các ràng buộc

`schemaVersion: 1`. Bản sao lưu toàn bộ là đối tượng dữ liệu của app; `schedule.json` là định dạng xuất một tuần khác, không nhận làm backup.

| Nhóm | Trường chính / ý nghĩa |
| --- | --- |
| programs | `id`, `name`, `color?`, `lessons[]`; bài có `id`, `title`, `periods`, `section?`, tham chiếu nguồn nếu có |
| teachers | `id`, `name`, `active`, `color?`, `specialties?` |
| classes | `id`, `name`, `programId`, `active`, `baseline` — số tiết trước các tuần trong app |
| rooms | `id`, `name`, `campus`, `active` |
| weeks | `id`, `start` (Thứ 2, YYYY-MM-DD), `entries[]`, `greetings?`, `updatedAt?` |
| entries | `id`, `day` 0–6 (Thứ 2=0), `start`/`end` là số tiết 1–12, `classId`, `teacherId`, `room`, `campus`, `roomId?`, `lessonId`, `lessonOffset?`, `title`, `status`, các cờ gợi ý/nguồn |
| greetings | `id`, `day:4`, `startTime`, `endTime`, `teacherId`, `campus`, `note`, `rotate`, `rotationTeacherIds[]`, `needsReview?` |
| metadata | `updatedAt?`, `rosterVersion?`, ghi chú nguồn |

`status` của buổi học: `planned`, `done`, `cancelled`. Không suy diễn “đã dạy” từ việc xuất hiện trong lịch. ID giữ ổn định khi đổi tên; không dùng tên làm khóa liên kết.

**Lưu trữ:** localStorage, khóa lịch **`proskills-planner-v1`**. Giao diện sáng/tối có khóa riêng `proskills-appearance`. Không đổi khóa lịch hoặc xóa dữ liệu để “sửa lỗi”. Nếu cần đổi schema/namespace, viết migration và kiểm tra backup cũ. Nhiều đường dẫn trên cùng một origin có thể dùng chung localStorage: khi triển khai nhiều bản song song cần xem xét namespace và migration cụ thể.

App chỉ lưu trong trình duyệt hiện tại. Không có tài khoản, API, database, đồng bộ nhiều người, lưu lịch vào repo hoặc tự commit dữ liệu. Chuyển origin/máy phải sao lưu và khôi phục. Upload code lên GitHub không mang theo dữ liệu người dùng đã nhập ở trình duyệt.

**Khôi phục:** xác thực cấu trúc/tham chiếu trước, cho xem số tuần/lớp/GV, yêu cầu người dùng xác nhận thay dữ liệu, có nút sao lưu hiện tại. Đây là **thay thế**, không phải gộp hai bản. Không làm mất lựa chọn này khi nâng cấp.

Các migration hiện có: `ensureRooms`, `ensureGreetings` (chỉ bổ sung khi trường chưa tồn tại), `ensureRoster` theo `rosterVersion`, `ensureTeacherColors`. Không dùng migration để chép đè các phân công hoặc danh sách người dùng đã chỉnh.

## 5. Logic nghiệp vụ phải giữ

- Một buổi có lớp, GV, phòng, cơ sở, chuyên đề, ngày và khoảng tiết tách thành các giá trị riêng. Chế độ Dữ liệu đưa từng giá trị ra cột.
- Lớp hoàn thành `active:false` không có trong danh sách tạo buổi mới; lịch cũ vẫn tra cứu được. Tương tự giáo viên/phòng ngừng sử dụng.
- Cùng số phòng ở cơ sở khác là hai phòng khác nhau. Đổi tên phòng cập nhật buổi liên quan. Phòng đã có lịch không đổi cơ sở trực tiếp; tạo phòng mới để giữ lịch sử.
- Chặn trùng lớp, giáo viên hoặc phòng cùng cơ sở khi các khoảng tiết giao nhau; không tính buổi hủy.
- Copy tuần giữ ngày/ca/GV/phòng/cơ sở. Chuyển bài mặc định **theo lịch đã xếp**, có tùy chọn chỉ tính `done`. Mốc là phần xa nhất đã xếp trong chương trình; bài học bù ở phần trước không làm lùi mốc. Bài chưa khớp chương trình giữ để rà soát. Hết chương trình không quay về đầu. Hỗ trợ bài nhiều tiết/chia buổi.
- Công suất cộng từng tiết: **ngày 1–8, tối 9–12**; buổi hủy không tính. Buổi trùng vẫn nằm trong tổng nên cần xử lý trước khi chốt. Chưa có định mức, không trình bày tổng tiết như tỷ lệ phần trăm công suất.
- Thứ tự cột bảng/CSV công suất: **Giáo viên → Tổng tiết → Tiết ngày → Tiết tối → Chi tiết từng ngày**.
- Lịch chào thứ 6 **7:30–7:45**, **12:45–13:00**. Hai người tại hai ca cùng cơ sở; danh sách luân phiên do Giáo vụ chọn. Copy tuần chuyển người, bỏ qua người không hoạt động, tránh một người nhận cả hai ca cùng cơ sở khi còn lựa chọn khác. **Không cộng vào tiết dạy.**
- Các khung giờ 2 tiết: 08:00–09:30; 10:00–11:30; 13:15–14:45; 15:15–16:45; 17:45–19:15; 19:45–21:15. Tiết lẻ suy ra 45 phút, cần đối chiếu thực tế nếu quy ước thay đổi.
- Ngày cập nhật là ngày/giờ lưu dữ liệu, hiển thị theo Việt Nam. Backup cũ chưa có mốc phải nói chưa ghi nhận, không bịa mốc lịch sử.

## 6. Nguồn và dữ liệu mẫu

Người dùng đã cung cấp:

- `1. LỊCH KỸ NĂNG 2026 (2).xlsx`: 5 tuần từ 26/10/2026 đến 23/11/2026.
- `5. PHIẾU QUẢN LÝ HỌC TẬP.xlsx`: sheet **2025_JPC** cho TTS (25 chuyên đề, 50 tiết), sheet **NH4** cho Nhà hàng (18 chuyên đề, 36 tiết).
- Proskills Hub phiên bản `PS1.4.1`, trong đó `hub/lich.js` là lịch cá nhân học viên.

Các file Excel/Hub gốc không nằm trong repo này. `seed.js` chứa phần dữ liệu đã trích. **Không tuyên bố đã chuyển đổi đầy đủ Excel:** chỉ lấy các block rõ lớp/GV/chuyên đề; còn thiếu ô gộp/ca nối/hoạt động phụ. Ghép bài với chương trình là gợi ý cần rà soát; không coi là hồ sơ hoàn thành khóa.

NH4 là lớp/lịch **minh họa**, chương trình lấy từ sheet thật. 10 phân công chào được lấy từ các ô nguồn có ghi rõ. Mã `source` nên giữ để đối chiếu. Không tự đoán giáo viên cụ thể cho ô chung “GV GDTC”.

Giáo viên GDTC người dùng xác nhận: **Cô Nguyễn Trang, Cô Lê Uyên, Thầy Vi San, Thầy Trung Hiếu**. Có **Cô Xuân Thủy** trong danh sách chung. Không tự gán chuyên môn GDTC cho Cô Xuân Thủy nếu chưa được xác nhận. Tên Vi San/Xuân Thủy đã chuẩn hóa khi nâng cấp dữ liệu cũ; không tạo trùng người.

## 7. Thiết kế đã được yêu cầu rõ

- Phong cách **Material 3**, font toàn app **Be Vietnam Pro**; icon **Material Symbols Rounded**.
- Bảng nền/chữ: Ivory Light `#FAF9F5`, Medium `#F0EEE6`, viền `#E8E6DC`, Slate Dark `#141413`, chữ phụ Cloud `#666663`/`#73726C`.
- Các nút thao tác **cam đất**: Clay `#D97757`, Book Cloth `#CC785C`, Crail `#C15F3C`; nút dùng chủ yếu Crail/chữ trắng. Chế độ học viên vẫn có nền/điều hướng blue để nhận ra vai trò.
- Chế độ tối nền `#262624`, vùng nhập/thanh bên `#1F1E1D` ở Giáo vụ; học viên dùng biến thể xanh tối.
- 10 màu chương trình: Clay, Sky `#6A9BCC`, Olive `#788C5D`, Fig `#C46686`, Heather `#CBCADB`, Cactus `#BCD1CA`, Coral `#EBCECE`, Kraft `#D4A27F`, Manilla `#EBDBBC`, Slate `#666663`.
- Tên GV trong thẻ nhỏ như “Cần rà soát”, có màu nhẹ nhất quán theo mã GV; có thể lặp khi vượt số màu. Màu thẻ GV và màu khối chương trình là hai vai trò riêng.
- **Chế độ Tuần:** mọi chữ trong block buổi học 12px; chỉ tên lớp in đậm. Tên GV/phòng/cơ sở cùng cỡ này. Không tự tăng lại lên 14–16px chỉ vì quy tắc chung.
- Thứ và ngày dưới Thứ cùng 13px; **Thứ in đậm, ngày không in đậm**. Trục ca/ngày và thanh điều hướng nền đậm hơn. Có ẩn/hiện thanh bên để mở rộng lịch.
- Placeholder nhỏ đồng bộ; điện thoại có chế độ Danh sách rõ và điều hướng dưới cùng, không tràn ngang toàn trang.
- Tên đã chốt: **“Lịch học trong tuần”**, **“Chương trình đào tạo”**, **“Chưa thiết lập”**. Không đổi ngược về “Lịch giảng dạy”, “Danh mục & chương trình”, “Chưa cấu hình”.
- Bỏ khẩu hiệu cũ “Mỗi tuần, một trang lịch / Tiếp nối tuần cũ / Chủ động cho tuần mới”, thay bằng dòng ngày cập nhật.

## 8. Tích hợp Proskills Hub trong tương lai

Hub hiện lưu lịch người học tự đặt trong `PS.prefs().lich` ở `hub/lich.js`; chưa đọc file lịch do Giáo vụ xuất.

`schedule.json` hiện xuất `schemaVersion`, `timeZone`, `exportedAt`, `week` gồm ngày bắt đầu/kết thúc, mốc cập nhật, `sessions`, `greetings`. Buổi có mã/tên lớp, GV, phòng/cơ sở, mã bài, chủ đề, ngày ISO, khoảng tiết và giờ; buổi hủy không xuất cho học viên. Giữ các cờ gợi ý/minh họa để tránh nhận nhầm là lịch đã duyệt.

Hướng mong muốn: Giáo vụ làm lịch → cập nhật dữ liệu vào repo hoặc kho dùng chung → Hub lấy tuần và ánh xạ **mã lớp** với lớp học viên đã nhập → hiện lịch của học viên. Cần thiết kế dữ liệu dùng chung, bản nháp/đã duyệt, version/cache và quyền chỉnh sửa. Không tự triển khai tích hợp này trong một yêu cầu chỉ sửa giao diện.

## 9. Cách sửa an toàn và kiểm tra

1. Đọc yêu cầu mới, `AGENTS.md`, file này và vùng mã liên quan; xem thay đổi đang có để không ghi đè công việc mới.
2. Sửa **trực tiếp trong repo/package này**, không sinh một bản nguồn khác rồi quên đồng bộ.
3. Giữ schema/ID/khóa lưu và backup cũ. Không dùng xóa localStorage hoặc làm mới seed như cách sửa lỗi mặc định.
4. Nếu thay đổi dữ liệu, bổ sung migration và kiểm tra cả backup cũ lẫn mới. Không ghi file sao lưu thật vào repo công khai.
5. Chạy `npm test`. Khi thay đổi giao diện/role, thử trên trình duyệt: mặc định học viên, mật khẩu sai/đúng, chuyển về học viên/reload, form chỉ xem, lọc/sort, tuần hiện tại/tuần sau, màn hình 390px và máy tính, sáng/tối.
6. Với lịch chào hoặc chuyển bài, kiểm tra luân phiên, buổi hủy, lớp kết thúc, chương trình hết và công suất không cộng nhầm ca chào.
7. Với xuất/nhập, phân biệt **backup toàn bộ** và **schedule.json một tuần**, giữ bước xác nhận thay dữ liệu. Cập nhật hướng dẫn Giáo vụ nếu nút/quy trình thay đổi.
8. Ghi thay đổi có ý nghĩa vào `CHANGELOG.md`; cập nhật tài liệu này khi yêu cầu được chốt thay đổi. Đừng ghi kết quả kiểm tra chưa chạy.

## 10. Chưa làm / không được ngầm tuyên bố đã có

- Đồng bộ nhiều máy, đăng nhập/tài khoản riêng, backend phân quyền, lưu lịch vào GitHub tự động.
- Lịch xuất bản dùng chung có trạng thái duyệt, sức chứa phòng/lớp và xác nhận còn chỗ học bù.
- Gửi tin Teams trực tiếp, tra email/Teams của giáo viên tự động.
- Chuyển đổi đầy đủ Excel và xác thực tiến độ thật của từng lớp.
- Kết nối thẻ lịch của Proskills Hub.

Người dùng sẽ dùng thử trước và quay lại chỉnh tiếp. Các điểm trên là hướng phát triển, không phải lý do tự mở rộng phạm vi của yêu cầu hiện tại.
