const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // false for 587 (TLS), true for 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,      // yourname@gmail.com
    pass: process.env.SMTP_PASS,      // 16-char app password
  },
});

// Verify Gmail connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail SMTP Configuration Error:', error);
    console.error('Check your .env file and App Password');
  } else {
    console.log('✅ Gmail SMTP Server ready to send emails');
  }
});

module.exports = transporter;