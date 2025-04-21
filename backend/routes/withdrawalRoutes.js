// routes/withdrawalRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  submitWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus
} = require("../controllers/withdrawalController");

router.post("/withdraw", auth, submitWithdrawal); // ✅ user withdraw request
router.get("/user/withdrawals", auth, getUserWithdrawals); // ✅ user history

router.get("/admin/withdrawals", getAllWithdrawals); // ✅ admin view all
router.put("/admin/update/:id", updateWithdrawalStatus); // ✅ approve/reject


module.exports = router;
