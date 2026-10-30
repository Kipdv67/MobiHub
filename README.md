# MobiHub

MVP cửa hàng thiết bị công nghệ bằng React + Vite + TypeScript.

## Chạy dự án

```bash
npm install
npm run dev
```

Ứng dụng gồm:

- Catalog có tìm kiếm, lọc danh mục/thương hiệu/khoảng giá và sắp xếp.
- Trang chi tiết sản phẩm, thông số do quản trị viên cập nhật, đánh giá lưu trên trình duyệt và so sánh tối đa 3 sản phẩm.
- Giỏ hàng có tăng/giảm số lượng, mã khuyến mãi, giao hàng hoặc chọn điểm nhận minh họa; tài khoản có lịch sử đơn và hóa đơn.
- Khu vực ưu đãi, tìm cửa hàng theo khu vực, bài viết công nghệ, FAQ và biểu mẫu hỗ trợ.
- Dashboard admin để quản lý catalog và đơn hàng.

Mã ưu đãi mẫu: `MOBI10` giảm 10% cho đơn từ 2.000.000đ (tối đa 500.000đ); `TECH100` giảm 100.000đ cho đơn từ 5.000.000đ.

Dữ liệu catalog, đơn hàng, tài khoản, đánh giá và lời nhắn hỗ trợ được lưu trong `localStorage` của trình duyệt. Đây là bản demo frontend: địa chỉ cửa hàng chỉ minh họa, tồn kho theo chi nhánh, thanh toán, giao hàng và gửi yêu cầu hỗ trợ chưa kết nối dịch vụ thực tế.

## Deploy giao diện lên Render

Repository đã có `render.yaml` cho Render Static Site. Đẩy code lên GitHub, vào Render chọn **New + > Blueprint**, kết nối repository này và xác nhận tạo dịch vụ `mobihub`. Render sẽ chạy `npm ci && npm run build`, sau đó publish thư mục `dist`.

Đây là bản deploy giao diện React tĩnh; dữ liệu vẫn nằm trong `localStorage` của từng trình duyệt. API và MySQL trong cấu hình Docker Compose không được triển khai bởi Static Site.

## Chạy bằng Docker Compose

Yêu cầu Docker Desktop đang chạy. Từ thư mục dự án, chạy:

```powershell
docker compose up --build -d
docker compose ps
```

Mở `http://localhost:3000` để truy cập giao diện. Kiểm tra API xác nhận kết nối MySQL:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

Kết quả thành công có `status: ok`, `database: connected` và tên database. API thực hiện truy vấn MySQL thật; database dùng volume `mysql_data` để giữ dữ liệu qua lần khởi động lại.

Dừng các dịch vụ nhưng giữ dữ liệu database:

```powershell
docker compose down
```

Muốn xóa cả dữ liệu database, dùng `docker compose down -v`. Các thông tin đăng nhập mặc định trong Compose chỉ dành cho môi trường thực hành local; có thể sao chép `.env.example` thành `.env` để thay đổi chúng.
