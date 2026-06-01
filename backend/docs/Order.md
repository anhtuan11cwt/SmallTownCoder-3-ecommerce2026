# API Test Postman Documentation

## Collections
- **Collection Name:** E-Commerce API
- **Description:** API hệ thống thương mại điện tử
- **Base URL:** `http://localhost:5000/api`

---
## Folder
- **Name:** Đơn hàng (Order)
- **Description:** Chứa tất cả các điểm cuối API liên quan đến quản lý đơn hàng.

---
## Request

### 1. Tạo đơn hàng mới (COD)
- **Method:** POST
- **URL:** `http://localhost:5000/api/order/new/cod`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "method": "COD",
    "phoneNumber": "0901234567",
    "address": "Số 1, Đường A, Quận B, TP.HCM"
  }
  ```

#### Response
- **Success (201 Created):**
  ```json
  {
    "message": "Đơn hàng đã được tạo thành công",
    "order": { ... }
  }
  ```
- **Error (400 - Giỏ hàng trống):**
  ```json
  {
    "message": "Giỏ hàng trống"
  }
  ```

### 2. Lấy đơn hàng của người dùng
- **Method:** GET
- **URL:** `http://localhost:5000/api/order/all`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  [
    {
      "_id": "60d5ec49f1b2c51f3c8e4d2a",
      "items": [...],
      "subTotal": 1000000,
      "status": "Pending",
      "createdAt": "2026-06-01T10:00:00.000Z"
    }
  ]
  ```

### 3. Lấy tất cả đơn hàng (Admin)
- **Method:** GET
- **URL:** `http://localhost:5000/api/order/all/admin`

#### Headers
- **Key:** `token`
- **Value:** `ADMIN_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  [...]
  ```
- **Error (403 - Không phải Admin):**
  ```json
  {
    "message": "Bạn không phải là admin"
  }
  ```

### 4. Lấy thống kê đơn hàng (Admin)
- **Method:** GET
- **URL:** `http://localhost:5000/api/order/stats`

#### Headers
- **Key:** `token`
- **Value:** `ADMIN_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  {
    "codOrder": 10,
    "onlineOrder": 5,
    "data": [
      { "name": "Sản phẩm A", "sold": 20 }
    ]
  }
  ```

### 5. Lấy chi tiết đơn hàng
- **Method:** GET
- **URL:** `http://localhost:5000/api/order/:id`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  {
    "_id": "60d5ec49f1b2c51f3c8e4d2a",
    "items": [...],
    "user": { ... }
  }
  ```

### 6. Cập nhật trạng thái đơn hàng (Admin)
- **Method:** POST
- **URL:** `http://localhost:5000/api/order/status/:id`

#### Headers
- **Key:** `token`
- **Value:** `ADMIN_JWT_TOKEN`
- **Required:** Có

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "status": "Shipped"
  }
  ```

#### Response
- **Success (200 OK):**
  ```json
  {
    "message": "Trạng thái đơn hàng đã được cập nhật",
    "order": { ... }
  }
  ```
- **Error (403 - Không phải Admin):**
  ```json
  {
    "message": "Bạn không phải là admin"
  }
  ```

---
## Test Cases
- **Test Case:** Tạo đơn hàng thành công
  - **Input:** Token hợp lệ, body đầy đủ
  - **Expected Result:** 201 + "Đơn hàng đã được tạo thành công"

- **Test Case:** Lấy danh sách đơn hàng (User) thành công
  - **Input:** Token user hợp lệ
  - **Expected Result:** 200 + danh sách đơn hàng

- **Test Case:** Lấy danh sách đơn hàng (Admin) thành công
  - **Input:** Token admin hợp lệ
  - **Expected Result:** 200 + tất cả đơn hàng

- **Test Case:** Lấy thống kê đơn hàng thành công (Admin)
  - **Input:** Token admin hợp lệ
  - **Expected Result:** 200 + số liệu thống kê

- **Test Case:** Lấy chi tiết đơn hàng thành công
  - **Input:** Token hợp lệ, ID đơn hàng hợp lệ
  - **Expected Result:** 200 + chi tiết đơn hàng

- **Test Case:** Cập nhật trạng thái đơn hàng thành công (Admin)
  - **Input:** Token admin, ID đơn hàng hợp lệ, status mới
  - **Expected Result:** 200 + "Trạng thái đơn hàng đã được cập nhật"
