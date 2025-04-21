// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const {
  getUserProfile,
  changePassword
} = require("../controllers/userController");

// ✅ View user profile
router.get("/profile", auth, getUserProfile);

// ✅ Change user password
router.post("/change-password", auth, changePassword);

router.get("/referrals", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const referred = await User.find({ referralGPID: String(user.gp_id) });

    res.json({
      friends: referred.map(u => ({
        name: u.name,
        gp_id: u.gp_id,
        rank: u.rank,
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch referrals" });
  }
});

module.exports = router;
