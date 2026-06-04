import nodemailer from "nodemailer";

const sendMailViaApi = async ({ to, subject, html, from }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    body: JSON.stringify({
      htmlContent: html,
      sender: { email: from, name: "E-Commerce" },
      subject,
      to: [{ email: to }],
    }),
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Brevo API error: ${response.status} ${errBody}`);
  }
};

const trySendViaSmtp = async ({ to, subject, html, from }) => {
  const config = {
    auth: {
      pass: process.env.BREVO_SMTP_KEY,
      user: process.env.BREVO_SMTP_LOGIN,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    host: "smtp-relay.brevo.com",
    requireTLS: true,
    secure: false,
    socketTimeout: 10000,
  };

  const ports = [587, 2525];
  let lastError;

  for (const port of ports) {
    try {
      const transport = nodemailer.createTransport({ ...config, port });
      await transport.sendMail({ from, html, subject, to });
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

const sendMail = async ({ to, subject, html, from }) => {
  if (process.env.BREVO_API_KEY) {
    await sendMailViaApi({ from, html, subject, to });
    return;
  }

  if (process.env.BREVO_SMTP_KEY) {
    await trySendViaSmtp({ from, html, subject, to });
    return;
  }

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

  await transport.sendMail({ from, html, subject, to });
};

export default sendMail;
