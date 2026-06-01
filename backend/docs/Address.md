# API Test Postman Documentation

## Collections
- **Collection Name:** E-Commerce API
- **Description:** API hệ thống thương mại điện tử
- **Base URL:** `http://localhost:5000/api`

---
## Folder
- **Name:** Địa chỉ (Address)
- **Description:** Chứa tất cả các điểm cuối API liên quan đến quản lý địa chỉ của người dùng.

---
## Request

### 1. Tạo địa chỉ mới
- **Method:** POST
- **URL:** `http://localhost:5000/api/address/new`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "address": "Số 1, Đường A, Quận B, TP.HCM",
    "phoneNumber": "0901234567"
  }
  ```

#### Response
- **Success (201 Created):**
  ```json
  {
    "message": "Địa chỉ đã được tạo"
  }
  ```

### 2. Lấy danh sách địa chỉ
- **Method:** GET
- **URL:** `http://localhost:5000/api/address/all`

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
      "address": "Số 1, Đường A, Quận B, TP.HCM",
      "phoneNumber": "0901234567",
      "user": "60d5ec49f1b2c51f3c8e4d2b"
    }
  ]
  ```

### 3. Lấy chi tiết địa chỉ
- **Method:** GET
- **URL:** `http://localhost:5000/api/address/:id`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  {
    "_id": "60d5ec49f1b2c51f3c8e4d2a",
    "address": "Số 1, Đường A, Quận B, TP.HCM",
    "phoneNumber": "0901234567",
    "user": "60d5ec49f1b2c51f3c8e4d2b"
  }
  ```

### 4. Xóa địa chỉ
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/address/:id`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  {
    "message": "Địa chỉ đã được xóa"
  }
  ```

---
## Test Cases
- **Test Case:** Tạo địa chỉ thành công
  - **Input:** Token hợp lệ, body có địa chỉ và số điện thoại
  - **Expected Result:** 201 + "Địa chỉ đã được tạo"

- **Test Case:** Lấy danh sách địa chỉ thành công
  - **Input:** Token hợp lệ
  - **Expected Result:** 200 + danh sách địa chỉ của người dùng

- **Test Case:** Lấy chi tiết địa chỉ thành công
  - **Input:** Token hợp lệ, ID địa chỉ hợp lệ
  - **Expected Result:** 200 + thông tin địa chỉ

- **Test Case:** Xóa địa chỉ thành công
  - **Input:** Token hợp lệ, ID địa chỉ hợp lệ
  - **Expected Result:** 200 + "Địa chỉ đã được xóa"
