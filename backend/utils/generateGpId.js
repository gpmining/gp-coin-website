//utils/generateGpId.js
const User = require("../models/User");

async function generateUniqueGpId() {
  let unique = false;
  let gpId;

  while (!unique) {
    gpId = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    const existing = await User.findOne({ gp_id: gpId });
    if (!existing) unique = true;
  }

  return gpId;
}

module.exports = generateUniqueGpId;
