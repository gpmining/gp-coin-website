const User = require("../models/User");
const Subscription = require("../models/subscription");
const rankData = require("../config/ranks");

const requestRankUpgrade = async (req, res) => {
    try {
        const { rank, transaction_id } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!rankData[rank]) return res.status(400).json({ message: "Invalid rank" });
        if (!transaction_id) return res.status(400).json({ message: "Transaction ID is required" });

        // Save subscription request for admin review
        const subscription = new Subscription({
            user_id: user._id,
            rank,
            amount_paid: rankData[rank].price,
            transaction_id,
            status: "pending"
        });
        await subscription.save();

        res.status(200).json({ message: `Rank upgrade request submitted. Waiting for admin approval.` });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit rank request", error: error.message });
    }
};

module.exports = { requestRankUpgrade };
