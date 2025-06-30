const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});
