//controllers/withdrawalController.js
const Withdrawal = require("../models/withdrawal");
const User = require("../models/User");

const GP_RATE = 582; // 1 USD = 582 GP
const MIN_USD = 3;
const MAX_USD = 100;

// ✅ Submit a withdrawal request
const submitWithdrawal = async (req, res) => {
  try {
    const { amount_usd, binance_id } = req.body;
    const userId = req.user.id;

    if (!amount_usd || isNaN(amount_usd)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (amount_usd < MIN_USD || amount_usd > MAX_USD) {
      return res.status(400).json({ message: `Amount must be between $${MIN_USD} and $${MAX_USD}` });
    }

    if (!binance_id) {
      return res.status(400).json({ message: "Binance ID is required" });
    }

    const user = await User.findById(userId);
    const gpRequired = Math.round(amount_usd * GP_RATE);

    if (user.balance < gpRequired) {
      return res.status(400).json({ message: "Insufficient GP balance" });
    }

    // Deduct GP immediately
    user.balance -= gpRequired;
    await user.save();

    const withdrawal = new Withdrawal({
      user_id: userId,
      amount_usd,
      binance_id,
      gp_cost: gpRequired,
      status: "pending"
    });

    await withdrawal.save();

    res.status(200).json({ success: true, message: "Withdrawal request submitted!" });
  } catch (err) {
    console.error("Withdrawal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get withdrawal history for the logged-in user
const getUserWithdrawals = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Withdrawal.find({ user_id: userId }).sort({ date: -1 });
    res.status(200).json({ success: true, withdrawals: history });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error fetching withdrawals" });
  }
};

// ✅ Admin: Get all withdrawal requests
const getAllWithdrawals = async (req, res) => {
  try {
    const list = await Withdrawal.find().populate("user_id", "name email gp_id").sort({ date: -1 });
    res.status(200).json({ success: true, withdrawals: list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch withdrawal requests" });
  }
};

// ✅ Admin: Approve or reject a withdrawal
const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal request not found" });

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Only update if it's still pending
    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "This request is already processed" });
    }

    // Refund GP if rejected
    if (status === "rejected") {
      const user = await User.findById(withdrawal.user_id);
      if (user) {
        user.balance += withdrawal.gp_cost;
        await user.save();
      }
    }

    withdrawal.status = status;
    await withdrawal.save();

    res.status(200).json({ success: true, message: `Withdrawal ${status}` });

  } catch (err) {
    console.error("Admin withdrawal update error:", err);
    res.status(500).json({ message: "Failed to update withdrawal status" });
  }
};


module.exports = {
  submitWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus
};
