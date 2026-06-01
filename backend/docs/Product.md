# API Test Postman Documentation

## Collections
- **Collection Name:** E-Commerce API
- **Description:** API hệ thống thương mại điện tử
- **Base URL:** `http://localhost:5000/api`

---
## Folder
- **Name:** Sản phẩm (Product)
- **Description:** Chứa các điểm cuối API liên quan đến quản lý và truy vấn sản phẩm.

---
## Request

### 1. Tạo sản phẩm mới
- **Method:** POST
- **URL:** `http://localhost:5000/api/product/new`

#### Headers
- **Key:** `token`
- **Value:** `ADMIN_JWT_TOKEN`
- **Required:** Có
- **Description:** Token xác thực của admin

#### Body
- **Format:** FormData
- **Fields:**
  - `title` (text): Tên sản phẩm
  - `about` (text): Mô tả sản phẩm
  - `category` (text): Danh mục sản phẩm
  - `price` (number): Giá sản phẩm
  - `stock` (number): Số lượng tồn kho
  - `files` (file): Danh sách tệp hình ảnh sản phẩm

#### Response
- **Success (201 Created):**
  ```json
  {
    "message": "Sản phẩm đã được tạo thành công",
    "product": {
      "_id": "60d5ec49f1b2c51f3c8e4d2a",
      "title": "Sản phẩm A",
      "about": "Mô tả sản phẩm A",
      "category": "Điện tử",
      "price": 1000000,
      "stock": 10,
      "images": [
        {
          "id": "public_id_1",
          "url": "http://res.cloudinary.com/..."
        }
      ],
      "createdAt": "2026-06-01T10:00:00.000Z"
    }
  }
  ```
- **Error (401 - Không phải Admin):**
  ```json
  {
    "message": "Bạn không phải là admin"
  }
  ```
- **Error (400 - Thiếu tệp ảnh):**
  ```json
  {
    "message": "Không có tệp nào để tải lên"
  }
  ```

### 2. Lấy danh sách sản phẩm
- **Method:** GET
- **URL:** `http://localhost:5000/api/product/all?search=abc&category=Điện tử&page=1&sortByPrice=lowToHigh`

#### Query Parameters
- `search` (optional): Từ khóa tìm kiếm theo tên
- `category` (optional): Lọc theo danh mục
- `page` (optional): Số trang
- `sortByPrice` (optional): "lowToHigh" hoặc "highToLow"

#### Response
- **Success (200 OK):**
  ```json
  {
    "categories": ["Điện tử", "Thời trang"],
    "newProducts": [...],
    "products": [...],
    "totalPages": 5
  }
  ```

### 3. Lấy chi tiết sản phẩm
- **Method:** GET
- **URL:** `http://localhost:5000/api/product/:id`

#### Response
- **Success (200 OK):**
  ```json
  {
    "product": { ... },
    "relatedProducts": [...]
  }
  ```
- **Error (404 - Không tìm thấy):**
  ```json
  {
    "message": "Không tìm thấy sản phẩm"
  }
  ```

### 4. Cập nhật thông tin sản phẩm
- **Method:** PUT
- **URL:** `http://localhost:5000/api/product/:id`

#### Headers
- **Key:** `token`
- **Value:** `ADMIN_JWT_TOKEN`
- **Required:** Có

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "title": "Tên mới",
    "about": "Mô tả mới",
    "price": 2000000,
    "stock": 5,
    "category": "Điện tử"
  }
  ```

#### Response
- **Success (200 OK):**
  ```json
  {
    "message": "Sản phẩm đã được cập nhật",
    "updatedProduct": { ... }
  }
  ```
- **Error (401 - Không phải Admin):**
  ```json
  {
    "message": "Bạn không phải là admin"
  }
  ```
- **Error (404 - Không tìm thấy):**
  ```json
  {
    "message": "Không tìm thấy sản phẩm"
  }
  ```

### 5. Cập nhật hình ảnh sản phẩm
- **Method:** POST
- **URL:** `http://localhost:5000/api/product/image/:id`

#### Headers
- **Key:** `token`
- **Value:** `ADMIN_JWT_TOKEN`
- **Required:** Có

#### Body
- **Format:** FormData
- **Fields:**
  - `files` (file): Danh sách tệp hình ảnh sản phẩm mới

#### Response
- **Success (200 OK):**
  ```json
  {
    "message": "Hình ảnh đã được cập nhật",
    "product": { ... }
  }
  ```
- **Error (401 - Không phải Admin):**
  ```json
  {
    "message": "Bạn không phải là admin"
  }
  ```
- **Error (400 - Thiếu tệp ảnh):**
  ```json
  {
    "message": "Không có tệp nào để tải lên"
  }
  ```
- **Error (404 - Không tìm thấy):**
  ```json
  {
    "message": "Không tìm thấy sản phẩm"
  }
  ```

---
## Test Cases
- **Test Case:** Tạo sản phẩm thành công (Admin)
  - **Input:** Token admin hợp lệ, body đầy đủ, có file ảnh
  - **Expected Result:** 201 + thông tin sản phẩm vừa tạo

- **Test Case:** Tạo sản phẩm thất bại (User thường)
  - **Input:** Token user thường hoặc không có token
  - **Expected Result:** 401 + "Bạn không phải là admin"

- **Test Case:** Lấy danh sách sản phẩm thành công
  - **Input:** Không có query hoặc có query lọc
  - **Expected Result:** 200 + danh sách sản phẩm + phân trang + danh mục

- **Test Case:** Lấy chi tiết sản phẩm thành công
  - **Input:** ID sản phẩm hợp lệ
  - **Expected Result:** 200 + thông tin sản phẩm + sản phẩm liên quan

- **Test Case:** Lấy chi tiết sản phẩm thất bại
  - **Input:** ID sản phẩm không tồn tại
  - **Expected Result:** 404 + "Không tìm thấy sản phẩm"

- **Test Case:** Cập nhật thông tin sản phẩm thành công (Admin)
  - **Input:** Token admin, ID sản phẩm hợp lệ, body hợp lệ
  - **Expected Result:** 200 + thông tin sản phẩm đã cập nhật

- **Test Case:** Cập nhật thông tin sản phẩm thất bại (User thường)
  - **Input:** Token user thường, ID sản phẩm hợp lệ
  - **Expected Result:** 401 + "Bạn không phải là admin"

- **Test Case:** Cập nhật hình ảnh sản phẩm thành công (Admin)
  - **Input:** Token admin, ID sản phẩm hợp lệ, có file ảnh mới
  - **Expected Result:** 200 + thông tin sản phẩm với hình ảnh mới

- **Test Case:** Cập nhật hình ảnh sản phẩm thất bại (Thiếu tệp)
  - **Input:** Token admin, ID sản phẩm hợp lệ, không có file ảnh
  - **Expected Result:** 400 + "Không có tệp nào để tải lên"
