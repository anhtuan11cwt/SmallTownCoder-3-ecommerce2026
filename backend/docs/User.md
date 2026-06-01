# API Test Postman Documentation

## Collections
- **Collection Name:** E-Commerce API
- **Description:** API hệ thống thương mại điện tử
- **Base URL:** `http://localhost:5000/api`

---
## Folder
- **Name:** Người dùng (User)
- **Description:** Chứa tất cả các điểm cuối API liên quan đến người dùng.

---
## Request

### 1. Đăng nhập / Gửi OTP
- **Method:** POST
- **URL:** `http://localhost:5000/api/user/login`

#### Headers
- **Key:** `Content-Type`
- **Value:** `application/json`
- **Required:** Có
- **Description:** Định dạng nội dung yêu cầu
- **Authorization Headers:** Không yêu cầu

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "email": "example@gmail.com"
  }
  ```

#### Response
- **Success (200 OK):**
  ```json
  {
    "message": "Đã gửi OTP đến email của bạn"
  }
  ```
- **Error (500 - Gửi email thất bại):**
  ```json
  {
    "success": false,
    "message": "Lỗi gửi email"
  }
  ```

### 2. Xác thực OTP / Đăng nhập
- **Method:** POST
- **URL:** `http://localhost:5000/api/user/verify`

#### Headers
- **Key:** `Content-Type`
- **Value:** `application/json`
- **Required:** Có
- **Description:** Định dạng nội dung yêu cầu
- **Authorization Headers:** Không yêu cầu

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "email": "example@gmail.com",
    "otp": "123456"
  }
  ```

#### Response
- **Success (200 OK) - Người dùng mới:**
  ```json
  {
    "message": "Đăng nhập thành công",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d5ec49f1b2c51f3c8e4d2a",
      "email": "example@gmail.com",
      "createdAt": "2026-05-29T15:56:00.000Z",
      "updatedAt": "2026-05-29T15:56:00.000Z"
    }
  }
  ```
- **Success (200 OK) - Người dùng đã tồn tại:**
  ```json
  {
    "message": "Đăng nhập thành công",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d5ec49f1b2c51f3c8e4d2a",
      "email": "example@gmail.com",
      "createdAt": "2026-05-29T15:56:00.000Z",
      "updatedAt": "2026-05-29T16:00:00.000Z"
    }
  }
  ```
- **Error (400 - Sai OTP):**
  ```json
  {
    "message": "Sai mã OTP"
  }
  ```
- **Error (400 - OTP hết hạn):**
  ```json
  {
    "message": "Mã OTP đã hết hạn"
  }
  ```

---
## Test Cases
- **Test Case:** Gửi OTP thành công
  - **Input:** Email hợp lệ
  - **Expected Result:** 200 + "Đã gửi OTP đến email của bạn"

- **Test Case:** Gửi OTP với email không hợp lệ
  - **Input:** Email sai định dạng
  - **Expected Result:** 500 - Lỗi gửi email

- **Test Case:** Xác thực OTP thành công (người dùng mới)
  - **Input:** Email + OTP chính xác, email chưa tồn tại
  - **Expected Result:** 200 + token JWT + thông tin user mới

- **Test Case:** Xác thực OTP thành công (người dùng cũ)
  - **Input:** Email + OTP chính xác, email đã tồn tại
  - **Expected Result:** 200 + token JWT + thông tin user cũ

- **Test Case:** Sai mã OTP
  - **Input:** Email hợp lệ, OTP sai
  - **Expected Result:** 400 + "Sai mã OTP"

- **Test Case:** OTP đã hết hạn
  - **Input:** Email hợp lệ, OTP đã hết hạn
  - **Expected Result:** 400 + "Mã OTP đã hết hạn"
