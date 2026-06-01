# API Test Postman Documentation

## Collections
- **Collection Name:** E-Commerce API
- **Description:** API hệ thống thương mại điện tử
- **Base URL:** `http://localhost:5000/api`

---
## Folder
- **Name:** Giỏ hàng (Cart)
- **Description:** Chứa tất cả các điểm cuối API liên quan đến quản lý giỏ hàng của người dùng.

---
## Request

### 1. Thêm sản phẩm vào giỏ hàng
- **Method:** POST
- **URL:** `http://localhost:5000/api/cart/add`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "product": "PRODUCT_ID"
  }
  ```

#### Response
- **Success (200/201 OK/Created):**
  ```json
  {
    "message": "Đã thêm vào giỏ hàng"
  }
  ```
- **Error (400 - Hết hàng):**
  ```json
  {
    "message": "Hết hàng"
  }
  ```

### 2. Xóa sản phẩm khỏi giỏ hàng
- **Method:** GET
- **URL:** `http://localhost:5000/api/cart/remove/:id`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  {
    "message": "Đã xóa khỏi giỏ hàng"
  }
  ```

### 3. Cập nhật số lượng sản phẩm
- **Method:** POST
- **URL:** `http://localhost:5000/api/cart/update?action=inc` (hoặc `dec`)

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Body
- **Format:** Raw JSON
- **Content:**
  ```json
  {
    "id": "CART_ITEM_ID"
  }
  ```

#### Response
- **Success (200 OK):**
  ```json
  {
    "message": "Giỏ hàng đã được cập nhật"
  }
  ```
- **Error (400 - Hết hàng / Không thể giảm):**
  ```json
  {
    "message": "Hết hàng"
  }
  ```
  hoặc
  ```json
  {
    "message": "Bạn chỉ có một sản phẩm"
  }
  ```

### 4. Lấy giỏ hàng
- **Method:** GET
- **URL:** `http://localhost:5000/api/cart/all`

#### Headers
- **Key:** `token`
- **Value:** `USER_JWT_TOKEN`
- **Required:** Có

#### Response
- **Success (200 OK):**
  ```json
  {
    "cart": [...],
    "subTotal": 1000000,
    "sumOfQuantity": 5
  }
  ```

---
## Test Cases
- **Test Case:** Thêm sản phẩm thành công
  - **Input:** Token hợp lệ, body có ID sản phẩm
  - **Expected Result:** 200/201 + "Đã thêm vào giỏ hàng"

- **Test Case:** Thêm sản phẩm thất bại (Hết hàng)
  - **Input:** Token hợp lệ, sản phẩm tồn kho bằng 0
  - **Expected Result:** 400 + "Hết hàng"

- **Test Case:** Xóa sản phẩm thành công
  - **Input:** Token hợp lệ, ID item giỏ hàng hợp lệ
  - **Expected Result:** 200 + "Đã xóa khỏi giỏ hàng"

- **Test Case:** Cập nhật số lượng thành công (Tăng)
  - **Input:** Token hợp lệ, ID item hợp lệ, action "inc"
  - **Expected Result:** 200 + "Giỏ hàng đã được cập nhật"

- **Test Case:** Cập nhật số lượng thành công (Giảm)
  - **Input:** Token hợp lệ, ID item hợp lệ, action "dec"
  - **Expected Result:** 200 + "Giỏ hàng đã được cập nhật"

- **Test Case:** Lấy giỏ hàng thành công
  - **Input:** Token hợp lệ
  - **Expected Result:** 200 + thông tin giỏ hàng + tổng tiền + tổng số lượng
