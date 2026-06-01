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
