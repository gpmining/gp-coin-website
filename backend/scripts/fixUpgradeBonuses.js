const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function runFix() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const users = await User.find({ referralGPID: { $ne: null, $ne: "None" } });

  let updatedCount = 0;

  for (const user of users) {
    // Skip if still on free rank
    if (user.rank === "free") continue;

    const referrer = await User.findOne({ gp_id: Number(user.referralGPID) });
    if (!referrer) continue;

    const referredId = user._id.toString();
    const alreadySignedUp = referrer.referralBonuses.includes(referredId);
    const alreadyUpgraded = referrer.upgradedBonuses.includes(referredId);

    if (alreadySignedUp && !alreadyUpgraded && referrer.referralBonuses.length <= 5) {
      referrer.upgradedBonuses.push(referredId);
      referrer.referral_earnings += 2;
      referrer.miningSpeed += 2;

      await referrer.save();
      console.log(`✅ Upgrade bonus fixed for referrer ${referrer.gp_id} from user ${user.gp_id}`);
      updatedCount++;
    }
  }

  console.log(`🎉 Done. Total referrers updated: ${updatedCount}`);
  mongoose.connection.close();
}

runFix().catch(err => {
  console.error("❌ Error running fix script:", err);
  mongoose.connection.close();
});
