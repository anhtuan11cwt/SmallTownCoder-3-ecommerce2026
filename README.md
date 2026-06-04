# QuickCart — SmallTownCoder E-Commerce 2026

> A full-stack e-commerce web application (MERN-style) with OTP email login, Stripe online payments, COD, Cloudinary image storage, and a complete admin dashboard with analytics.

> Tác giả: **Trần Anh Tuấn** • Repo: `anhtuan11cwt/SmallTownCoder-3-ecommerce2026`

---

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Tính năng nổi bật](#tính-năng-nổi-bật)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
5. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
6. [Cài đặt & Cấu hình](#cài-đặt--cấu-hình)
7. [Chạy dự án (Development)](#chạy-dự-án-development)
8. [Build & Deploy (Production)](#build--deploy-production)
9. [Tài khoản mặc định](#tài-khoản-mặc-định)
10. [Tài liệu API](#tài-liệu-api)
11. [Cơ sở dữ liệu (Mongoose Models)](#cơ-sở-dữ-liệu-mongoose-models)
12. [Luồng hoạt động chính](#luồng-hoạt-động-chính)
13. [Scripts có sẵn](#scripts-có-sẵn)
14. [License](#license)

---

## Giới thiệu

**QuickCart** là một ứng dụng thương mại điện tử hoàn chỉnh gồm hai phần:

- **Backend** (`/backend`): RESTful API xây dựng bằng **Node.js + Express 5 + MongoDB (Mongoose)**, hỗ trợ xác thực OTP qua email, JWT, upload ảnh lên Cloudinary, thanh toán Stripe và tích hợp gửi email xác nhận đơn hàng.
- **Frontend** (`/frontend`): SPA viết bằng **React 19 + Vite 8 + TailwindCSS v4 + shadcn/ui**, có đầy đủ trang mua sắm cho khách hàng và **trang quản trị (admin dashboard)** với biểu đồ thống kê (Recharts).

Hệ thống hỗ trợ đầy đủ luồng mua sắm từ **duyệt sản phẩm → thêm giỏ hàng → thanh toán (COD / Online qua Stripe) → quản lý đơn hàng**, kèm theo **phân quyền Admin/User** chặt chẽ.

> Giao diện & thông báo trong ứng dụng được Việt hóa toàn bộ.

---

## Tính năng nổi bật

### Phía người dùng (Customer)

- **Đăng nhập bằng OTP qua email** — chỉ cần email, hệ thống tự tạo tài khoản nếu chưa tồn tại.
- **Trang chủ (Home)** với banner Hero và danh sách sản phẩm mới nhất.
- **Danh sách sản phẩm (Products)** với:
  - Tìm kiếm theo tên
  - Lọc theo danh mục
  - Sắp xếp theo giá (Thấp → Cao, Cao → Thấp)
  - Phân trang (8 sản phẩm/trang)
- **Chi tiết sản phẩm** với carousel ảnh, sản phẩm liên quan cùng danh mục.
- **Giỏ hàng (Cart)**: thêm, tăng/giảm số lượng, xóa sản phẩm (có kiểm tra tồn kho).
- **Thanh toán (Checkout)** — quản lý nhiều địa chỉ giao hàng.
- **Thanh toán (Payment)** hỗ trợ 2 phương thức:
  - **COD** (Cash on Delivery — Thanh toán khi nhận hàng)
  - **Online** qua **Stripe Checkout** (VND)
- **Trang đơn hàng (Orders)** + **chi tiết đơn hàng** có thể in được.
- **Trang xử lý đơn hàng** sau thanh toán online (`/order/success?session_id=...`).
- **Light / Dark theme** với shadcn/ui `mode-toggle`.
- **Responsive** trên mobile và desktop.

### Phía quản trị (Admin)

- Đăng nhập riêng tại `/admin/login` (email + password).
- **Dashboard Analytics** (Recharts):
  - Biểu đồ tròn (Donut): tỉ lệ đơn hàng COD vs Online
  - Biểu đồ cột: số lượng đã bán theo từng sản phẩm
- **Quản lý sản phẩm**:
  - Thêm sản phẩm mới (upload nhiều ảnh, lưu trên Cloudinary)
  - Sửa thông tin sản phẩm (tiêu đề, mô tả, giá, tồn kho, danh mục)
  - Cập nhật lại toàn bộ hình ảnh sản phẩm
- **Quản lý đơn hàng**:
  - Xem tất cả đơn hàng
  - Tìm theo email hoặc mã đơn
  - Cập nhật trạng thái: `pending` → `shipped` → `delivered`

### Bảo mật & Xác thực

- **JWT** lưu trong cả `localStorage` và `Cookie` (hỗ trợ HTTPS).
- Middleware `isAuth` (bắt buộc đăng nhập) + `isAdmin` (yêu cầu role admin).
- Mã **OTP có thời hạn 5 phút** (MongoDB TTL Index tự động xóa).
- Route guarding ở frontend với `<ProtectedRoute />` (chặn cả chiều admin → user).
- Tự động đăng xuất nếu token hết hạn / không hợp lệ.

---

## Công nghệ sử dụng

### Backend

| Công nghệ          | Mục đích                     |
| ------------------ | ---------------------------- |
| **Node.js (ESM)**  | Runtime                      |
| **Express 5**      | Web framework                |
| **Mongoose 9**     | ODM cho MongoDB              |
| **JSON Web Token** | Xác thực                     |
| **Multer**         | Upload file (memory storage) |
| **Cloudinary**     | Lưu trữ & tối ưu ảnh         |
| **Nodemailer**     | Gửi email OTP / xác nhận đơn |
| **Stripe**         | Thanh toán online            |
| **dotenv**         | Quản lý biến môi trường      |
| **cors**           | Cho phép CORS                |
| **nodemon**        | Auto-reload khi dev          |
| **biome / eslint** | Format & lint                |

### Frontend

| Công nghệ                      | Mục đích                                    |
| ------------------------------ | ------------------------------------------- |
| **React 19**                   | UI Framework                                |
| **Vite 8**                     | Build tool                                  |
| **React Router 7**             | Routing SPA                                 |
| **TailwindCSS v4**             | Utility-first CSS (qua `@tailwindcss/vite`) |
| **shadcn/ui**                  | Component library (Radix UI + Tailwind)     |
| **Radix UI**                   | Headless UI primitives                      |
| **lucide-react**               | Icon set                                    |
| **Axios**                      | HTTP client                                 |
| **js-cookie**                  | Quản lý cookie JWT                          |
| **react-hot-toast**            | Thông báo                                   |
| **@stripe/stripe-js**          | Stripe client                               |
| **recharts**                   | Biểu đồ thống kê                            |
| **embla-carousel-react**       | Carousel ảnh sản phẩm                       |
| **@fontsource-variable/inter** | Font Inter                                  |

---

## Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND  (React 19 + Vite)               │
│  / (Home)  /products  /product/:id  /cart  /checkout        │
│  /payment/:id  /orders  /order/:id  /order/success          │
│  /login  /verify                                            │
│  /admin/login  /admin/dashboard  /admin/products            │
│  /admin/products/:id  /admin/orders                         │
└────────────────┬─────────────────────────────────────────────┘
                 │  HTTP (Axios) — JWT in headers
                 ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND  (Node.js + Express 5)              │
│                                                              │
│  /api/user      (login OTP, verify, me, admin/login)         │
│  /api/product   (CRUD + image upload, search, filter)        │
│  /api/cart      (add, remove, update, fetch)                 │
│  /api/address   (add, list, get, delete)                     │
│  /api/order     (cod, online, verify, stats, status)         │
│                                                              │
│  Middleware: isAuth → isAdmin → multer → tryCatch            │
└────────┬─────────────┬──────────────┬────────────┬───────────┘
         │             │              │            │
         ▼             ▼              ▼            ▼
     MongoDB      Cloudinary      Stripe      Gmail SMTP
   (Atlas/Local)  (ảnh SP)     (thanh toán)  (OTP/Order)
```

Trong production, **Express** phục vụ luôn `frontend/dist` (đã build bằng Vite) — không cần Nginx riêng.

---

## Cấu trúc thư mục

```
SmallTownCoder-3-ecommerce2026/
├── README.md                     # (file này)
├── .gitignore
│
├── backend/                      # Node.js + Express API
├── frontend/                     # React 19 + Vite
```

---

## Cài đặt & Cấu hình

### 1. Yêu cầu môi trường

- **Node.js** ≥ 20.x (khuyến nghị bản LTS mới nhất)
- **npm** ≥ 10.x (hoặc pnpm/yarn)
- **MongoDB** — có thể dùng MongoDB Atlas (cloud) hoặc MongoDB Community Server (local)
- Tài khoản **Cloudinary** (miễn phí tại [cloudinary.com](https://cloudinary.com))
- Tài khoản **Stripe** (test mode tại [dashboard.stripe.com](https://dashboard.stripe.com))
- Tài khoản **Gmail** bật **App Password** (2FA + App Password) để gửi OTP

### 2. Clone & cài đặt dependencies

```bash
git clone https://github.com/anhtuan11cwt/SmallTownCoder-3-ecommerce2026.git
cd SmallTownCoder-3-ecommerce2026

# Backend
cd backend
npm install
cp .env.example .env         # rồi chỉnh sửa các giá trị bên dưới

# Frontend
cd ../frontend
npm install
cp .env.example .env         # mặc định: VITE_SERVER_URL=http://localhost:5000
```

### 3. Cấu hình biến môi trường

#### `backend/.env`

```env
PORT=5000
NODE_ENV=development                    # đổi thành "production" khi deploy
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ecommerce2025?retryWrites=true&w=majority
JWT_SECRET=chuoi_bi_mat_cuc_ky_dai_kho_doan

# Gmail (App Password, KHÔNG dùng mật khẩu chính)
GMAIL=your_email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Stripe (test mode secret key — bắt đầu bằng sk_test_...)
STRIPE_SECRET_KEY=sk_test_

# Frontend URL (dùng cho Stripe success_url / cancel_url)
FRONTEND_URL=http://localhost:5173
```

#### `frontend/.env`

```env
VITE_SERVER_URL=http://localhost:5000
```

### 4. Lấy thông tin Cloudinary

Đăng ký → vào **Dashboard** → copy `Cloud name`, `API Key`, `API Secret`.

### 5. Lấy Stripe Secret Key

Đăng ký → vào **Developers → API keys** → lấy **Secret key** (test mode).

### 6. Tạo App Password cho Gmail

Vào [myaccount.google.com](https://myaccount.google.com) → **Security** → bật **2-Step Verification** → tạo **App password** cho "Mail".

---

## Chạy dự án (Development)

Mở 2 terminal:

**Terminal 1 — Backend** (Node + Express + nodemon, port `5000`):

```bash
cd backend
npm run dev
# predev: kill-port 5000 (đảm bảo cổng trống)
# → Server chạy tại http://localhost:5000
```

**Terminal 2 — Frontend** (Vite dev server, port `5173`):

```bash
cd frontend
npm run dev
# → App chạy tại http://localhost:5173
```

Khi backend khởi động lần đầu:

- Kết nối MongoDB thành công.
- Tự động **seed admin** (`admin@example.com / adminpassword123`) nếu chưa có.
- Tự động **seed 10 sản phẩm mẫu** (Apple AirPods, Bose, Samsung, MacBook, PS5, Canon EOS R5, ...) kèm upload ảnh lên Cloudinary nếu collection `Product` đang rỗng.

Truy cập: **http://localhost:5173**

---

## Build & Deploy (Production)

### Bước 1 — Build frontend

```bash
cd frontend
npm run build
# → output: frontend/dist/
```

### Bước 2 — Cấu hình backend

Trong `backend/.env` đặt:

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### Bước 3 — Khởi động backend

```bash
cd backend
npm start
```

Backend sẽ:

1. Phục vụ API tại `https://your-domain.com/api/*`
2. Phục vụ static `frontend/dist` cho tất cả route còn lại (SPA fallback) — không cần Nginx riêng.

> **Mẹo deploy:** Render, Railway, Fly.io, VPS (PM2 + Nginx), Vercel (chỉ frontend) đều chạy được. Nhớ whitelist IP trên MongoDB Atlas.

### Yêu cầu khi deploy

- Whitelist IP server trên **MongoDB Atlas** (Network Access).
- Bật HTTPS để cookie `secure` hoạt động (đã được code xử lý tự động qua `location.protocol`).
- Cấu hình **CORS** nếu tách frontend/backend khác domain — hiện đang bật `app.use(cors())` mặc định (mọi origin).

---

## Tài khoản mặc định

| Role      | Email               | Password           | Đăng nhập tại       |
| --------- | ------------------- | ------------------ | ------------------- |
| **Admin** | `admin@example.com` | `adminpassword123` | `/admin/login`      |
| **User**  | _bất kỳ email nào_  | _(không cần)_      | `/login` → nhận OTP |

> **Quan trọng:** Đổi mật khẩu admin ngay sau lần đăng nhập đầu tiên khi đi vào production. Hiện tại mật khẩu đang lưu plain-text trong `seedAdmin.js` (chỉ dùng cho mục đích demo).

User đăng nhập bằng **OTP** — chỉ cần nhập email, mã 6 số sẽ được gửi qua Gmail (hết hạn sau 5 phút, có thể gửi lại sau 90 giây).

---

## Tài liệu API

Tất cả endpoint đều có tiền tố `/api` và base URL `http://localhost:5000`.

> **Tài liệu chi tiết theo từng resource** (Postman-style) nằm trong thư mục `backend/docs/`:
>
> - `User.md`, `Product.md`, `Cart.md`, `Order.md`, `Address.md`

### Tóm tắt nhanh

#### User (`/api/user`)

| Method | Endpoint            | Auth | Mô tả                              |
| ------ | ------------------- | ---- | ---------------------------------- |
| POST   | `/user/login`       | ❌   | Gửi mã OTP đến email               |
| POST   | `/user/verify`      | ❌   | Xác thực OTP, trả về JWT           |
| POST   | `/user/admin/login` | ❌   | Đăng nhập admin (email + password) |
| GET    | `/user/me`          | ✅   | Lấy thông tin user hiện tại        |

#### Product (`/api/product`)

| Method | Endpoint             | Auth     | Mô tả                                                      |
| ------ | -------------------- | -------- | ---------------------------------------------------------- |
| POST   | `/product/new`       | 👑 Admin | Tạo SP mới (multipart, upload ảnh)                         |
| GET    | `/product/all`       | ❌       | DS SP — query: `search`, `category`, `page`, `sortByPrice` |
| GET    | `/product/:id`       | ❌       | Chi tiết SP + sản phẩm liên quan                           |
| PUT    | `/product/:id`       | 👑 Admin | Cập nhật thông tin SP                                      |
| POST   | `/product/image/:id` | 👑 Admin | Cập nhật toàn bộ ảnh SP                                    |

#### Cart (`/api/cart`)

| Method | Endpoint                       | Auth | Mô tả                                  |
| ------ | ------------------------------ | ---- | -------------------------------------- |
| POST   | `/cart/add`                    | ✅   | Thêm SP vào giỏ (tự +1 nếu đã tồn tại) |
| GET    | `/cart/remove/:id`             | ✅   | Xóa 1 item khỏi giỏ                    |
| POST   | `/cart/update?action=inc\|dec` | ✅   | Tăng/giảm số lượng                     |
| GET    | `/cart/all`                    | ✅   | Lấy giỏ hàng + tổng tiền + tổng SL     |

#### Address (`/api/address`)

| Method | Endpoint       | Auth | Mô tả                  |
| ------ | -------------- | ---- | ---------------------- |
| POST   | `/address/new` | ✅   | Thêm địa chỉ giao hàng |
| GET    | `/address/all` | ✅   | DS địa chỉ của user    |
| GET    | `/address/:id` | ✅   | Chi tiết 1 địa chỉ     |
| DELETE | `/address/:id` | ✅   | Xóa địa chỉ            |

#### Order (`/api/order`)

| Method | Endpoint                               | Auth     | Mô tả                                 |
| ------ | -------------------------------------- | -------- | ------------------------------------- |
| POST   | `/order/new/cod`                       | ✅       | Tạo đơn COD                           |
| POST   | `/order/new/online`                    | ✅       | Tạo Stripe session, trả về `url`      |
| POST   | `/order/verify/payment?session_id=...` | ✅       | Xác nhận thanh toán Stripe            |
| GET    | `/order/all`                           | ✅       | DS đơn hàng của user                  |
| GET    | `/order/all/admin`                     | 👑 Admin | Tất cả đơn hàng                       |
| GET    | `/order/stats`                         | 👑 Admin | COD count, Online count, sold/Product |
| GET    | `/order/:id`                           | ✅       | Chi tiết đơn                          |
| POST   | `/order/status/:id`                    | 👑 Admin | Cập nhật trạng thái                   |

> **Auth header:** `token: <JWT_TOKEN>`

---

## Cơ sở dữ liệu (Mongoose Models)

| Model       | Các trường chính                                                                                                                                         | Ghi chú                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **User**    | `email` (unique), `password`, `role` (default `user`)                                                                                                    | `password` chỉ dùng cho admin                 |
| **Product** | `title`, `about`, `category`, `price`, `stock`, `sold` (default 0), `images[{public_id, url}]`, `createdAt`                                              | `images` chứa URL Cloudinary                  |
| **Cart**    | `user` (ref User), `product` (ref Product), `quantity`                                                                                                   | Unique theo (user, product) ở tầng controller |
| **Order**   | `user`, `items[{product, quantity}]`, `address`, `phoneNumber`, `subTotal`, `method` (COD/Online), `status` (default `pending`), `paymentInfo`, `paidAt` | Khi đặt hàng: trừ `stock`, tăng `sold`        |
| **Address** | `user`, `address`, `phoneNumber`                                                                                                                         | Quản lý địa chỉ giao hàng                     |
| **Otp**     | `email` (unique), `otp`, `expiresAt`                                                                                                                     | TTL Index — tự xóa sau 5 phút                 |

---

## Luồng hoạt động chính

### Luồng mua hàng (Customer)

1. User nhập email tại `/login` → backend sinh OTP 6 số, lưu MongoDB, gửi qua Gmail.
2. User nhập OTP tại `/verify` → backend tìm `Otp` (còn hạn) → tạo/tìm `User` → trả JWT.
3. JWT được lưu cả `localStorage` và `Cookie` (15 ngày).
4. User duyệt `/products` → `GET /api/product/all?search=...&category=...&page=...&sortByPrice=...`.
5. Click "Thêm vào giỏ" → `POST /api/cart/add` (kiểm tra tồn kho).
6. Tại `/cart` có thể tăng/giảm/xóa; tổng tiền tính phía server.
7. Tại `/checkout` quản lý nhiều địa chỉ → chọn 1 địa chỉ → `/payment/:addressId`.
8. Chọn phương thức:
   - **COD** → `POST /api/order/new/cod` → tạo Order, trừ stock, gửi email xác nhận, xóa cart → về `/orders`.
   - **Online** → `POST /api/order/new/online` → backend tạo Stripe Session → redirect sang `checkout.stripe.com`.
9. Stripe redirect về `/order/success?session_id=...` → `POST /api/order/verify/payment` xác minh → tạo Order, trừ stock, xóa cart → sau 10s về `/orders`.

### Luồng quản lý (Admin)

1. Vào `/admin/login` → đăng nhập `admin@example.com` / `adminpassword123`.
2. Vào `/admin/dashboard` — xem biểu đồ:
   - Donut chart: tỉ lệ đơn COD/Online.
   - Bar chart: số lượng bán theo sản phẩm.
3. `/admin/products` — danh sách + thêm mới (FormData + nhiều ảnh).
4. Click 1 sản phẩm → `/admin/products/:id` — sửa thông tin hoặc upload lại toàn bộ ảnh.
5. `/admin/orders` — bảng đơn hàng (search theo email/mã), cập nhật trạng thái trực tiếp.

---

## Scripts có sẵn

### Backend (`/backend`)

| Lệnh             | Mô tả                                                   |
| ---------------- | ------------------------------------------------------- |
| `npm run dev`    | Chạy server với nodemon, kill port 5000 trước khi start |
| `npm start`      | Chạy server (production, dùng `node index.js`)          |
| `npm run build`  | Alias của `start`                                       |
| `npm run lint`   | Chạy ESLint                                             |
| `npm run lint2`  | Chạy Biome lint + auto-fix                              |
| `npm run check`  | Biome check + auto-fix                                  |
| `npm run check2` | Biome check + auto-fix unsafe                           |
| `npm run format` | Biome format + auto-fix                                 |

### Frontend (`/frontend`)

| Lệnh              | Mô tả                         |
| ----------------- | ----------------------------- |
| `npm run dev`     | Khởi động Vite dev server     |
| `npm run build`   | Build production ra `dist/`   |
| `npm run preview` | Preview bản build local       |
| `npm run lint`    | Chạy ESLint                   |
| `npm run lint2`   | Chạy Biome lint + auto-fix    |
| `npm run check`   | Biome check + auto-fix        |
| `npm run check2`  | Biome check + auto-fix unsafe |
| `npm run format`  | Biome format + auto-fix       |

---

## License

Dự án phát hành dưới giấy phép **ISC** (theo `package.json` của backend).

Bạn có thể tự do sử dụng, chỉnh sửa, phân phối cho mục đích học tập và thương mại.

---

## Tác giả

**Trần Anh Tuấn** — [github.com/anhtuan11cwt](https://github.com/anhtuan11cwt)
