require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // ✅ Using correct port for STARTTLS
  secure: false, // ✅ STARTTLS (false for port 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Optional: disables certificate validation errors
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.TEST_EMAIL || 'mailtonooralam@gmail.com', // ✅ Made configurable via env variable
  subject: 'Test Email from Nodemailer (Port 587)',
  text: 'This is a test email using port 587 with STARTTLS.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error:', error);
  }
  console.log('Email sent successfully:', info.response);
});
