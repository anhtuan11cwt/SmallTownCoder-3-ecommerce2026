import nodemailer from "nodemailer";

const sendOtp = async (email, subject, otp) => {
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

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Xác thực OTP</title>
  <style>
    body {
      margin: 0; padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f4f7fa;
    }
    .container {
      max-width: 480px; margin: 40px auto;
      background: #ffffff; border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px; text-align: center;
    }
    .header h1 {
      color: #ffffff; margin: 0; font-size: 24px;
    }
    .body {
      padding: 30px; text-align: center;
    }
    .body p {
      color: #555; font-size: 16px; line-height: 1.6;
    }
    .otp-box {
      display: inline-block;
      background: #f0f4ff; border: 2px dashed #667eea;
      border-radius: 10px; padding: 15px 30px;
      margin: 20px 0; font-size: 32px;
      font-weight: bold; color: #667eea;
      letter-spacing: 8px;
    }
    .footer {
      padding: 20px; text-align: center;
      color: #aaa; font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ứng dụng E-Commerce</h1>
    </div>
    <div class="body">
      <p>Mã xác thực OTP của bạn là:</p>
      <div class="otp-box">${otp}</div>
      <p>Mã này có hiệu lực trong <strong>5 phút</strong>. Không chia sẻ mã cho bất kỳ ai.</p>
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
    console.error(`[sendOtp] Lỗi gửi email đến ${email}:`, error.message);
    throw new Error("Không thể gửi OTP. Vui lòng thử lại sau.", {
      cause: error,
    });
  }
};

export default sendOtp;
