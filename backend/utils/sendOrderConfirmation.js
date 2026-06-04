import nodemailer from "nodemailer";

const sendOrderConfirmation = async (
  email,
  subject,
  orderId,
  products,
  totalAmount,
) => {
  const transport = nodemailer.createTransport({
    auth: {
      pass: process.env.GMAIL_PASSWORD,
      user: process.env.GMAIL,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    host: "smtp.gmail.com",
    port: 587,
    requireTLS: true,
    secure: false,
    socketTimeout: 15000,
  });

  const productsHtml = products
    .map(
      (p) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">${p.name}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${p.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${p.price.toLocaleString()} đ</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Xác nhận đơn hàng</title>
  <style>
    body { margin:0; padding:0; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background:#f4f7fa; }
    .container { max-width:520px; margin:40px auto; background:#fff; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.08); overflow:hidden; }
    .header { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:30px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:24px; }
    .body { padding:30px; }
    .body p { color:#555; font-size:15px; line-height:1.6; }
    table { width:100%; border-collapse:collapse; margin:20px 0; }
    th { background:#f0f4ff; padding:12px 10px; text-align:left; font-size:13px; color:#667eea; }
    .total { font-size:18px; font-weight:bold; color:#333; text-align:right; margin-top:10px; }
    .footer { padding:20px; text-align:center; color:#aaa; font-size:12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Xác nhận đơn hàng</h1>
    </div>
    <div class="body">
      <p>Xin chào <strong>${email}</strong>,</p>
      <p>Đơn hàng <strong>#${orderId}</strong> của bạn đã được đặt thành công!</p>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th style="text-align:center;">Số lượng</th>
            <th style="text-align:right;">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>
      <p class="total">Tổng cộng: ${totalAmount.toLocaleString()} đ</p>
      <p>Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi!</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Ứng dụng E-Commerce. Bảo lưu mọi quyền.
    </div>
  </div>
</body>
</html>`;

  try {
    await transport.sendMail({
      from: process.env.GMAIL,
      html,
      subject,
      to: email,
    });
  } catch (error) {
    console.error(
      `[sendOrderConfirmation] Lỗi gửi email xác nhận đến ${email}:`,
      error.message,
    );
    throw new Error("Không thể gửi email xác nhận đơn hàng.", { cause: error });
  }
};

export default sendOrderConfirmation;
