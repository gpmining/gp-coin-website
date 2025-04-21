// controllers/miningController.js
const User = require("../models/User");

const BASE_RATES = {
  free: 0,
  silver: 35,
  gold: 75,
  diamond: 125,
  ultimate: 195
};

function getEffectiveMiningSpeed(user) {
  const baseRate = BASE_RATES[user.rank] || 0;
  const signupBonus = user.referralBonuses?.length || 0;
  const upgradeBonus = user.upgradedBonuses?.length || 0;
  const totalBonus = signupBonus + (upgradeBonus * 2);
  const limitedBonus = Math.min(totalBonus, 15);
  return baseRate + limitedBonus;
}

const startMining = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.rank === "free") return res.status(403).json({ message: "Please upgrade your rank" });

    const now = Date.now();
    const sessionActive = user.lastMiningStart && (now - user.lastMiningStart < 8 * 60 * 60 * 1000);
    if (sessionActive) return res.status(400).json({ message: "Mining already in progress." });

    user.lastMiningStart = now;
    user.isMining = true;
    await user.save();

    res.status(200).json({ success: true, message: "Mining started successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error starting mining", error: err.message });
  }
};

const getMiningProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = Date.now();
    const totalAllowedMs = 8 * 60 * 60 * 1000;
    const elapsedMs = now - (user.lastMiningStart || 0);

    if (!user.isMining || !user.lastMiningStart) {
      return res.status(200).json({
        success: true, mining: false, balance: user.balance,
        miningSpeed: 0, rank: user.rank, remainingTime: 0
      });
    }

    if (elapsedMs >= totalAllowedMs) {
      const speed = getEffectiveMiningSpeed(user);
      const finalGP = 8 * speed;

      user.balance += finalGP;
      user.isMining = false;
      user.lastMiningStart = null;
      await user.save();

      return res.status(200).json({
        success: true, mining: false, miningSpeed: speed,
        balance: user.balance, rank: user.rank, remainingTime: 0
      });
    }

    const speed = getEffectiveMiningSpeed(user);
    const gpEarned = (elapsedMs / 3600000) * speed;

    return res.status(200).json({
      success: true,
      mining: true,
      remainingTime: Math.floor((totalAllowedMs - elapsedMs) / 1000),
      gpEarned,
      miningSpeed: speed,
      balance: user.balance,
      rank: user.rank
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting mining progress", error: err.message });
  }
};

const stopMining = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isMining || !user.lastMiningStart) {
      return res.status(400).json({ message: "Mining not active" });
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - user.lastMiningStart) / 1000);
    const speed = getEffectiveMiningSpeed(user);
    const earnedGP = (elapsedSeconds / 3600) * speed;

    user.balance += earnedGP;
    user.isMining = false;
    user.lastMiningStart = null;
    await user.save();

    res.status(200).json({ success: true, message: "Mining stopped", earned: earnedGP });
  } catch (err) {
    res.status(500).json({ message: "Error stopping mining", error: err.message });
  }
};

module.exports = {
  startMining,
  getMiningProgress,
  stopMining
};
