# Hướng dẫn Giáo vụ làm lịch, sao lưu và khôi phục

## Điểm cần nhớ trước khi làm

- App lưu lịch **trên trình duyệt đang dùng**. Cùng một link nhưng mở trên máy khác hoặc trình duyệt khác thì dữ liệu không tự giống nhau.
- Sau khi làm lịch, hãy tải **bản sao lưu toàn bộ app** về máy. Bản này giữ cả lịch các tuần trước.
- Khi tải lại trang, app về chế độ học viên để xem. Muốn chỉnh tiếp, đăng nhập lại **Chế độ giáo viên** bằng mật khẩu chủ dự án đã cung cấp.
- Trong bản dùng thử, chỉ Giáo vụ Hành chính được phân công nên làm lịch. Giáo viên/học viên xem lịch có thể dùng chế độ học viên.

## A. Làm lịch một tuần

1. Mở link app → **Chế độ giáo viên** → nhập mật khẩu.
2. Vào **Lịch học trong tuần**, chọn tuần cần làm ở **Chọn tuần** hoặc các tab tuần phía dưới.
3. Chọn **Thêm buổi học** hoặc bấm một buổi có sẵn để sửa.
4. Chọn lớp, ngày, giáo viên, tiết bắt đầu/kết thúc, cơ sở, phòng và chuyên đề. Danh sách phòng được lọc theo cơ sở.
5. Bấm **Lưu buổi học**. Nếu báo trùng giáo viên/lớp/phòng, điều chỉnh trước khi lưu.
6. Cần sửa tên giáo viên/lớp, thêm phòng hoặc chương trình: vào **Chương trình đào tạo**.
7. Kiểm tra **Công suất giáo viên**: các cột tổng, tiết ngày và tiết tối nằm trước chi tiết từng ngày.
8. **Tải bản sao lưu toàn bộ app sau khi làm xong.**

### Tạo tuần kế tiếp từ tuần cũ

1. Chọn tuần nguồn → **Tạo tuần mới**.
2. Kiểm tra tuần nguồn và ngày Thứ 2 bắt đầu tuần mới.
3. Giữ **Giữ khung lịch tuần cũ** để sao chép lớp, giáo viên, phòng và giờ.
4. Giữ **Tự gợi ý bài tiếp theo**, căn cứ mặc định **Theo lịch đã xếp**.
5. Giữ **Luân phiên giáo viên lịch chào** nếu muốn chuyển người phụ trách theo danh sách đã chọn.
6. Tạo tuần mới, rà soát các thẻ “Gợi ý tuần mới”, “Cần rà soát” và điều chỉnh theo thực tế.

Đây là gợi ý theo tiến độ đã xếp, không khẳng định lớp đã dạy xong. Không tự quay lại bài đầu khi hết chương trình. Lớp hoàn thành và buổi đã hủy không được sao chép như buổi bình thường.

### Thêm lịch chào

Ở **Lịch chào thứ 6**, chọn **Thêm lịch chào**. Chọn ca sáng **7:30–7:45** hoặc ca trưa **12:45–13:00**, cơ sở và giáo viên. Nếu bật luân phiên, chọn ít nhất hai giáo viên, gồm người đang phụ trách. Hai ca cùng cơ sở cần hai người khác nhau. Lịch chào không cộng vào số tiết dạy.

## B. Tải về để sao lưu toàn bộ các tuần

**Dùng cách này để giữ cả lịch tuần trước, không chỉ lịch đang xem.**

1. Đăng nhập **Chế độ giáo viên**.
2. Bấm **Xuất & sao lưu** ở phía trên.
3. Tìm mục **Sao lưu toàn bộ app**.
4. Bấm **Tải bản sao lưu**.
5. Trình duyệt tải về một file JSON, thường tên như `proskills-backup-2026-11-23.json`.
6. Mở thư mục **Downloads / Tải xuống** trên máy và kiểm tra đã có file.
7. Chuyển file vào thư mục sao lưu do đơn vị quản lý, ví dụ `Lich-hoc/Sao-luu/`. Có thể lưu thêm một bản ở vị trí nội bộ được đơn vị cho phép.
8. Nên đổi tên dễ nhận biết, ví dụ `LichHoc_toanbo_2026-11-26_1630.json`. **Giữ đuôi `.json`, không mở và lưu lại bằng Excel.**

**Lưu ý về tên file:** ngày trong tên mặc định là ngày bắt đầu **tuần đang chọn**, không nhất thiết là thời điểm bạn vừa sao lưu. Nội dung vẫn chứa **toàn bộ các tuần**. Hãy thêm ngày/giờ tải thực tế vào tên để tránh nhầm phiên bản.

Bản sao lưu gồm các tuần đã lưu, buổi học, lịch chào, lớp, giáo viên, phòng, chương trình, chuyên đề và các màu đã chọn. Nó không lưu phiên đăng nhập Giáo vụ và không chứa mã nguồn app.

### Nên sao lưu khi nào?

- Sau mỗi lần hoàn tất hoặc điều chỉnh lịch tuần.
- Trước khi cập nhật mã app, đổi link, đổi trình duyệt hoặc đổi máy.
- Trước khi xóa dữ liệu trình duyệt hoặc khôi phục một file khác.

Giữ ít nhất **bản mới nhất và một vài bản trước đó**. Không ghi đè toàn bộ các bản cũ bằng một file duy nhất. Không chỉ dựa vào việc “tải lại trang vẫn còn” để coi là đã sao lưu.

## C. Tải lên để khôi phục hoặc chuyển máy

**Khôi phục là thay toàn bộ dữ liệu ở trình duyệt đang mở app. App chưa gộp hai bản lịch.**

1. Chuẩn bị file **bản sao lưu toàn bộ app** có đuôi `.json`.
2. Mở link app trên máy/trình duyệt đích.
3. Đăng nhập **Chế độ giáo viên**.
4. Nếu trên máy này đã có lịch cần giữ, vào **Xuất & sao lưu → Sao lưu toàn bộ app → Tải bản sao lưu** trước.
5. Trong **Xuất & sao lưu**, tìm mục **Khôi phục bản sao lưu**.
6. Bấm nút chọn tệp của trình duyệt, thường là **Choose File / Chọn tệp**.
7. Chọn đúng file sao lưu `.json` muốn khôi phục.
8. App kiểm tra cấu trúc file và hiện số tuần, số lớp, số giáo viên. Đọc lại để chắc chắn đúng file.
9. Ở hộp xác nhận, có thể bấm **Sao lưu hiện tại** nếu chưa tải dữ liệu đang có.
10. Khi đã chắc chắn, bấm **Thay dữ liệu & khôi phục**. Bấm **Hủy** nếu chọn nhầm file.
11. Kiểm tra thông báo khôi phục thành công, các tab tuần trước, một vài buổi học và danh mục.
12. Tải lại trang, đăng nhập lại nếu cần và kiểm tra lịch còn đúng. Sau đó tải một bản sao lưu mới với tên dễ nhận biết.

File được đọc trên trình duyệt để khôi phục dữ liệu tại máy đích; thao tác này **không upload lịch lên GitHub** và không tự cập nhật các máy khác.

### Chuyển từ bản web cũ sang GitHub Pages

1. Trên **trang cũ**: tải **bản sao lưu toàn bộ app**.
2. Trên **link GitHub Pages mới**: dùng mục khôi phục để chọn file vừa tải.
3. Kiểm tra đầy đủ các tuần. Từ đây làm tiếp trên link mới và dùng một bản dữ liệu chính đã thống nhất.

Không cần nhập lại từng buổi. Nếu chỉ đưa mã nguồn lên GitHub mà không khôi phục file, app mới sẽ mở bằng dữ liệu mẫu.

## D. Phân biệt ba loại file tải về

| Nút / file | Chứa gì? | Dùng để khôi phục toàn bộ app? |
| --- | --- | --- |
| **Tải bản sao lưu** → `proskills-backup-....json` | Mọi tuần và danh mục, chương trình, lịch chào | **Có** |
| **Tải schedule.json** | Lịch của tuần đang chọn, chuẩn bị cho tích hợp Hub | **Không** |
| **Tải CSV mở bằng Excel** | Bảng lịch của tuần đang chọn | **Không** |

CSV công suất cũng chỉ là bảng thống kê, không phải bản sao lưu. File ZIP mã nguồn là app, không phải lịch cá nhân đang lưu trong trình duyệt.

## E. Nếu có lỗi hoặc chọn nhầm file

- **Không thấy file vừa tải:** kiểm tra Downloads, danh sách tải xuống của trình duyệt và tên file bị thêm `(1)`, `(2)` khi tải nhiều lần.
- **Báo file không đúng cấu trúc:** kiểm tra có chọn đúng bản sao lưu toàn bộ app không; không chọn `schedule.json`, CSV hoặc ZIP. Không tự sửa nội dung JSON để ép app nhận.
- **Khôi phục nhầm:** dùng bản đã tải trước đó ở nút **Sao lưu hiện tại** rồi khôi phục lại đúng quy trình. App không có tự động gộp/khôi phục bản bị thay nếu trước đó không có file sao lưu.
- **Máy A có lịch nhưng máy B không có:** đây là cách lưu của bản demo. Tải bản sao lưu ở A rồi khôi phục ở B. Nếu cả hai máy cùng sửa, cần thống nhất máy/bản nào là bản chính trước khi chuyển; không khôi phục chồng tùy ý.
- **Học viên không thấy tuần:** chế độ học viên chỉ hiện tuần thực tế đang diễn ra và tuần kế tiếp đã có lịch. Đăng nhập Giáo vụ để kiểm tra ngày tuần và tạo lịch đúng thời gian.
- **Thông báo không lưu được:** giữ trang đang mở và tải bản sao lưu ngay để tránh mất các thay đổi đang có trong bộ nhớ.

## F. Khi gửi phản hồi dùng thử

Ghi lại: đang dùng link nào, tuần nào, lớp/giáo viên nào, thao tác vừa làm, kết quả mong muốn và kết quả thực tế. Có thể gửi ảnh màn hình đã kiểm tra nội dung phù hợp. Gửi file sao lưu qua kênh nội bộ được phép nếu cần tái hiện lỗi; không đưa file dữ liệu thật vào issue/repo công khai.
