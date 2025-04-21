const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const otpStore = {}; // Temporary in-memory store: { email: { otp, expiresAt } }

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Or use 'gmail' if using Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }  
});

// ✅ Send OTP
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

    otpStore[email] = { otp, expiresAt };

    // Send email
    await transporter.sendMail({
      from: '"GP Coin Support" <gpcoin@proton.com>',
      to: email,
      subject: "Your OTP for GP Coin Password Reset",
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });

    console.log(`📧 OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("❌ sendOTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

// ✅ Verify OTP
const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const entry = otpStore[email];

  if (!entry) return res.status(400).json({ message: "No OTP sent to this email." });
  if (Date.now() > entry.expiresAt) return res.status(400).json({ message: "OTP expired." });
  if (entry.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

  // Mark verified (you could store in DB or session if needed)
  entry.verified = true;
  res.status(200).json({ message: "OTP verified!" });
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const entry = otpStore[email];

  if (!entry || !entry.verified) {
    return res.status(403).json({ message: "OTP not verified or expired." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    // Clean up
    delete otpStore[email];

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ resetPassword Error:", err);
    res.status(500).json({ message: "Failed to reset password." });
  }
};

module.exports = { sendOTP, verifyOTP, resetPassword };
