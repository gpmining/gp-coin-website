const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.protonmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,  // gpcoin@proton.com
    pass: process.env.EMAIL_PASS   // protonmail app password
  }
});

module.exports = transporter;
