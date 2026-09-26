# MobiHub

MVP cửa hàng thiết bị công nghệ bằng React + Vite + TypeScript.

## Chạy dự án

```bash
npm install
npm run dev
```

Ứng dụng gồm giao diện cửa hàng, tìm kiếm/lọc sản phẩm, giỏ hàng, và dashboard admin. Dữ liệu sản phẩm/đơn hàng mẫu được lưu trong localStorage của trình duyệt.

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
