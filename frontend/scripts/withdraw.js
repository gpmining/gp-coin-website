//scripts/withdraw.js
const API_BASE_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");
  const binanceInput = document.getElementById("binance-id");
  const withdrawForm = document.getElementById("withdraw-form");
  const gpPreview = document.getElementById("gp-preview");

  const GP_RATE = 582; // 1 USD = 582 GP
  const MIN_USD = 3;
  const MAX_USD = 100;

  // ✅ Live GP Cost Preview
  amountInput.addEventListener("input", () => {
    const usd = parseFloat(amountInput.value);
    if (!isNaN(usd) && usd >= MIN_USD && usd <= MAX_USD) {
      const gpCost = Math.round(usd * GP_RATE);
      gpPreview.textContent = `💰 You will be charged ${gpCost} GP for $${usd.toFixed(2)}`;
    } else {
      gpPreview.textContent = `💰 Enter a valid amount between $${MIN_USD} and $${MAX_USD}`;
    }
  });

  // ✅ Submit Withdrawal
  withdrawForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usdAmount = parseFloat(amountInput.value);
    const binanceId = binanceInput.value.trim();

    if (isNaN(usdAmount) || usdAmount < MIN_USD || usdAmount > MAX_USD) {
      alert(`Withdrawal amount must be between $${MIN_USD} and $${MAX_USD}`);
      return;
    }

    if (!binanceId) {
      alert("Please enter your Binance ID.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/withdrawal/withdraw`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount_usd: usdAmount,
          binance_id: binanceId
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Withdrawal request submitted successfully!");
        amountInput.value = "";
        binanceInput.value = "";
        gpPreview.textContent = "";
      } else {
        alert(data.message || "Failed to submit withdrawal.");
      }
    } catch (err) {
      console.error("Error submitting withdrawal:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});
