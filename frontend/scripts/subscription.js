const API_BASE_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", async () => {
  const rankPrices = {
    free: 0,
    silver: 20,
    gold: 50,
    diamond: 80,
    ultimate: 120
  };

  let currentRank = "";
  let currentRankPrice = 0;
  let selectedRank = null;
  let amountPaid = 0;

  const rankCards = document.querySelectorAll(".rank-card");
  const priceText = document.getElementById("selected-price");
  const selectedRankText = document.getElementById("selected-rank");
  const txnIdInput = document.getElementById("txn-id");
  const formMsg = document.getElementById("form-msg");

  // ✅ Fetch current user rank
  async function fetchCurrentRank() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      currentRank = data.rank || "free";
      currentRankPrice = rankPrices[currentRank] || 0;
    } catch (err) {
      console.error("Failed to fetch rank", err);
    }
  }

  await fetchCurrentRank();

  // ✅ Rank Card Click Handling
  rankCards.forEach(card => {
    card.addEventListener("click", () => {
      rankCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      selectedRank = card.dataset.rank;
      const selectedPrice = rankPrices[selectedRank] || 0;
      amountPaid = selectedPrice - currentRankPrice;

      selectedRankText.textContent = selectedRank.charAt(0).toUpperCase() + selectedRank.slice(1);
      if (amountPaid <= 0) {
        priceText.textContent = "No need to buy";
        amountPaid = 0;
      } else {
        priceText.textContent = `$${amountPaid.toFixed(2)}`;
      }
    });
  });

  // ✅ Copy Wallet Address
  document.getElementById("copy-address").addEventListener("click", () => {
    const address = document.getElementById("wallet-address").textContent;
    navigator.clipboard.writeText(address)
      .then(() => alert("Wallet address copied to clipboard!"))
      .catch(() => alert("Failed to copy address"));
  });

  // ✅ Submit Subscription
  document.getElementById("subscribe-btn").addEventListener("click", async () => {
    const txnId = txnIdInput.value.trim();
    if (!selectedRank) return alert("Please select a rank.");
    if (!txnId) return alert("Please enter transaction ID.");
    if (amountPaid <= 0) return alert("No need to subscribe to this rank.");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/subscription/subscribe`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rank: selectedRank,
          amount_paid: amountPaid,
          transaction_id: txnId
        })
      });

      const data = await response.json();

      if (response.ok) {
        formMsg.textContent = "✅ Subscription request submitted!";
        formMsg.style.color = "green";
        txnIdInput.value = "";
      } else {
        formMsg.textContent = data.message || "Something went wrong.";
        formMsg.style.color = "red";
      }
    } catch (err) {
      console.error("Subscription error:", err);
      formMsg.textContent = "Server error. Try again later.";
      formMsg.style.color = "red";
    }
  });
});
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
