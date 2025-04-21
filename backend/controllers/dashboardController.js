
const User = require("../models/User");

// Fetch user data for the dashboard
const getDashboardData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("balance rank");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Define mining speed based on rank
        const miningSpeeds = {
            silver: 35,
            gold: 75,
            diamond: 125,
            ultimate: 195
        };

        const miningSpeed = miningSpeeds[user.rank] || 0; // Default 0 for free users

        res.status(200).json({
            balance: user.balance,
            rank: user.rank,
            miningSpeed: miningSpeed
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dashboard data", error: error.message });
    }
};

module.exports = { getDashboardData };
