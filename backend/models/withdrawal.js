//models/withdrawal.js
const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount_usd: {
    type: Number,
    required: true,
    min: 3,
    max: 100
  },
  gp_cost: {
    type: Number,
    required: true
  },
  binance_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
