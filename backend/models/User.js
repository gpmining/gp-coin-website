//models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  gp_id: { type: Number, unique: true, required: true },      // 5-digit unique GP ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },                  // Hashed password
  cnic: { type: String, required: true },
  mobile: { type: String, required: true },
  dob: { type: String, required: true },

  // Referrals
  referralGPID: { type: String, default: "None" },
  referred_friends: { type: Number, default: 0 },
  referral_earnings: { type: Number, default: 0 },
  referralBonuses: { type: [String], default: [] },         // users they referred
  upgradedBonuses: { type: [String], default: [] },         // users who upgraded
           // GP earned from referrals

  // Account & Earnings
  rank: { type: String, default: "free" },                     // free | silver | gold | diamond | ultimate
  balance: { type: Number, default: 0 },                       // GP balance
  miningSpeed: { type: Number, default: 0 },                   // GP/h based on rank + referrals

  // Mining fields
  isMining: { type: Boolean, default: false },
  lastMiningStart: { type: Number, default: 0 },               // timestamp (ms)
  miningStartTime: { type: Date, default: null },
  miningProgress: { type: Number, default: 0 },                // Optional for tracking total mined
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("User", userSchema);
