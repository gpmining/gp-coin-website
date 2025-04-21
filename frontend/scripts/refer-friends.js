const API_BASE_URL = "https://gp-coin-website.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const gpIdSpan = document.getElementById("gp-id");
  const referralList = document.getElementById("referral-list");
  const totalBonus = document.getElementById("total-bonus");

  if (!token) {
    alert("Login required!");
    window.location.href = "login.html";
    return;
  }

  try {
    const profileRes = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profile = await profileRes.json();
    const userGPID = profile.gp_id;
    gpIdSpan.textContent = userGPID;

    // Copy button
    document.getElementById("copy-btn").addEventListener("click", () => {
      navigator.clipboard.writeText(userGPID)
        .then(() => alert("GP ID copied!"))
        .catch(err => console.error("Copy failed:", err));
    });

    // Load referrals
    const referralsRes = await fetch(`${API_BASE_URL}/user/referrals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { friends } = await referralsRes.json();

    referralList.innerHTML = "";
    let bonusSum = 0;

    if (!friends || friends.length === 0) {
      referralList.innerHTML = "<p>No referrals yet.</p>";
    } else {
      friends.slice(0, 5).forEach(friend => {
        const div = document.createElement("div");

        const isUpgraded = friend.rank !== "free";
        const bonus = isUpgraded ? 3 : 1;
        bonusSum += bonus;

        const status = isUpgraded ? "Upgraded" : "Signed Up";
        const earnings = isUpgraded ? "+3 GP/hour" : "+1 GP/hour";

        div.innerHTML = `<p>GP ID: <strong>${friend.gp_id}</strong> - ${status} (${earnings})</p>`;
        referralList.appendChild(div);
      });
    }

    totalBonus.textContent = Math.min(bonusSum, 15); // max 15 GP/h

  } catch (err) {
    console.error("Error loading referrals:", err);
    referralList.innerHTML = "<p>Error loading referrals.</p>";
  }
});
