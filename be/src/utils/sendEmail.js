import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // tài khoản gmail
      pass: process.env.EMAIL_PASS, // app password (không phải mật khẩu thật)
    },
  });

  await transporter.sendMail({
    from: `"Real Madrid CF" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });
};
