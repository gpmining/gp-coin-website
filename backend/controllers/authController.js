// controllers/authController.js
const axios = require("axios");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateUniqueGpId = require("../utils/generateGpId");
require("dotenv").config(); // ⬅️ Make sure this is added at the top (only once globally if not already)

const signup = async (req, res) => {
  try {
    const { name, email, password, mobile, cnic, dob, referralGPID, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ message: "reCAPTCHA token missing" });
    }
    
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    const recaptchaRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken
      }
    });

    if (!recaptchaRes.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    // ✅ Continue signup
    const hashedPassword = await bcrypt.hash(password, 10);
    const gp_id = await generateUniqueGpId();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      cnic,
      dob,
      gp_id,
      referralGPID: referralGPID !== "None" ? referralGPID : null
    });

    await newUser.save();

    // ✅ Handle referral signup bonus
    if (referralGPID && referralGPID !== "None") {
      const referrer = await User.findOne({ gp_id: Number(referralGPID) });

      if (referrer && referrer.referralBonuses.length < 5) {
        if (!referrer.referralBonuses.includes(newUser._id.toString())) {
          referrer.referralBonuses.push(newUser._id.toString());
          referrer.referral_earnings += 1;
          referrer.miningSpeed += 1;
          await referrer.save();
          console.log("✅ Signup bonus applied to referrer:", referrer.email);
        }
      }
    }

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, gp_id: user.gp_id, rank: user.rank }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token, gp_id: user.gp_id });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = { signup, login };
