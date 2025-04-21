const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  resetPassword  // ✅ Import this
} = require("../controllers/forgotPasswordController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset", resetPassword); // ✅ Route added

module.exports = router;
