//script/transaction-history.js
const API_BASE_URL = "https://gp-coin-website.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to view transaction history.");
    window.location.href = "login.html";
    return;
  }

  try {
    // Fetch Subscriptions
    const subRes = await fetch(`${API_BASE_URL}/subscription/history`, {
      headers: { "Authorization": `Bearer ${token}` }
    });    
    const subData = await subRes.json();

    if (subData.success && subData.subscriptions) {
      const subTable = document.getElementById("subscription-history-body");
      subTable.innerHTML = subData.subscriptions.map(sub => `
        <tr>
          <td>${sub.rank}</td>
          <td>$${sub.amount_paid}</td>
          <td>${sub.transaction_id}</td>
          <td><span class="status ${sub.status}">${sub.status}</span></td>
          <td>${new Date(sub.date).toLocaleString()}</td>
        </tr>
      `).join("");
    }

    // Fetch Withdrawals
    const withdrawRes = await fetch(`${API_BASE_URL}/withdrawal/user/withdrawals`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const withdrawData = await withdrawRes.json();

    if (withdrawData.success && withdrawData.withdrawals) {
      const withdrawTable = document.getElementById("withdrawal-history-body");
      withdrawTable.innerHTML = withdrawData.withdrawals.map(w => `
        <tr>
          <td>$${w.amount_usd}</td>
          <td>${w.binance_id}</td>
          <td><span class="status ${w.status}">${w.status}</span></td>
          <td>${new Date(w.date).toLocaleString()}</td>
        </tr>
      `).join("");
    }
  } catch (err) {
    console.error("Error loading transaction history:", err);
    alert("Failed to load transaction history. Try again later.");
  }
});
