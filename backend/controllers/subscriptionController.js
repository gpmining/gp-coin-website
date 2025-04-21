// controllers/subscriptionController.js

const Subscription = require("../models/subscription");
const User = require("../models/User");

// ✅ Create subscription request
const createSubscription = async (req, res) => {
    try {
        const { rank, amount_paid, transaction_id } = req.body;
        const user_id = req.user.id;

        const newRequest = new Subscription({
            user_id,
            rank,
            amount_paid,
            transaction_id
        });

        await newRequest.save();
        res.status(200).json({ success: true, message: "Subscription request submitted!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to submit request", error: error.message });
    }
};

// ✅ Get all subscription requests of a user
const getUserSubscriptions = async (req, res) => {
    try {
        const user_id = req.user.id;
        const subs = await Subscription.find({ user_id }).sort({ date: -1 });
        res.status(200).json({ success: true, subscriptions: subs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching history", error: error.message });
    }
};

// ✅ Get all pending/approved/rejected subscription requests (for admin)
const getAllSubscriptions = async (req, res) => {
    try {
        const allSubs = await Subscription.find().populate("user_id", "name email gp_id").sort({ date: -1 });
        res.status(200).json({ success: true, subscriptions: allSubs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch subscriptions", error: error.message });
    }
};

// ✅ Admin: Approve or reject a request
const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    subscription.status = status;
    await subscription.save();

    if (status === "approved") {
      const user = await User.findById(subscription.user_id);
      if (user) {
        const wasFree = user.rank === "free";
        user.rank = subscription.rank;
        await user.save();

        // ✅ Referral bonus logic
        if (
          wasFree &&
          user.referralGPID &&
          user.referralGPID !== "None"
        ) {
          const referrer = await User.findOne({ gp_id: Number(user.referralGPID) });

          if (referrer) {
            const referredId = user._id.toString();

            // Ensure arrays exist
            if (!Array.isArray(referrer.referralBonuses)) {
              referrer.referralBonuses = [];
            }
            if (!Array.isArray(referrer.upgradedBonuses)) {
              referrer.upgradedBonuses = [];
            }

            // Add to referralBonuses if not already there
            if (!referrer.referralBonuses.includes(referredId)) {
              if (referrer.referralBonuses.length < 5) {
                referrer.referralBonuses.push(referredId);
                referrer.referred_friends += 1;
                referrer.referral_earnings += 1;
                referrer.miningSpeed += 1;
              }
            }

            // Add to upgradedBonuses if eligible
            const alreadyUpgraded = referrer.upgradedBonuses.includes(referredId);

            if (
              !alreadyUpgraded &&
              referrer.referralBonuses.includes(referredId) &&
              referrer.upgradedBonuses.length < 5
            ) {
              referrer.upgradedBonuses.push(referredId);
              referrer.referral_earnings += 2;
              referrer.miningSpeed += 2;
            }

            await referrer.save();
            console.log(`✅ Referrer ${referrer.gp_id} updated with bonuses from ${user.gp_id}`);
          }
        }
      }
    }

    res.status(200).json({ success: true, message: `Request ${status}` });
  } catch (error) {
    console.error("❌ Subscription approval error:", error);
    res.status(500).json({ success: false, message: "Failed to update request", error: error.message });
  }
};

module.exports = {
    createSubscription,
    getUserSubscriptions,
    getAllSubscriptions,
    updateSubscriptionStatus
};
