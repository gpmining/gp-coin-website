const API_BASE_URL = "https://gp-coin-website.onrender.com/api";

// Hamburger Menu
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("hamburger").classList.toggle("active");
  document.getElementById("nav-links").classList.toggle("active");
});

// Profile dropdown
document.getElementById("user-icon").addEventListener("click", () => {
  document.getElementById("user-dropdown").classList.toggle("show");
});

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "login.html");

  const miningBtn = document.getElementById("start-mining");
  const miningStatus = document.getElementById("mining-status");
  const gpBalanceElement = document.getElementById("gp-balance");
  const exchangeRateElement = document.getElementById("exchange-rate");
  const gpSpeedElement = document.getElementById("gp-speed");

  let countdownTime = 8 * 60 * 60;
  let mining = false;
  let miningInterval, countdownInterval;

  // Check token expiration
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      throw new Error("Token expired");
    }
  } catch {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  // Load profile (name & ID)
  try {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById("user-name").textContent = data.name || "N/A";
      document.getElementById("user-id").textContent = data.gp_id || "N/A";
    }
  } catch (err) {
    console.error("Error loading profile:", err);
  }

  // Fetch mining data
  async function fetchUserData() {
    try {
      const res = await fetch(`${API_BASE_URL}/mine/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        mining = data.mining;
        countdownTime = data.remainingTime;

        const base = getBaseRate(data.rank);
        const bonus = data.miningSpeed - base;

        gpBalanceElement.textContent = `${data.balance.toFixed(2)} GP`;
        exchangeRateElement.textContent = `$${(data.balance / 582).toFixed(2)}`;
        gpSpeedElement.textContent = `${data.miningSpeed} GP/h (Base ${base} + Bonus ${bonus})`;

        miningStatus.textContent = mining ? "Mining..." : "Idle";
        document.body.className = data.rank;
        updateCountdownDisplay();

        if (mining) startMiningTimers();
      } else {
        console.warn("Mining inactive");
        miningBtn.textContent = "Start";
      }
    } catch (err) {
      console.error("Fetch mining failed:", err);
    }
  }

  // Base GP/h by rank
  function getBaseRate(rank) {
    const rates = {
      free: 0,
      silver: 35,
      gold: 75,
      diamond: 125,
      ultimate: 195
    };
    return rates[rank] || 0;
  }

  // Update countdown on screen
  function updateCountdownDisplay() {
    const h = Math.floor(countdownTime / 3600);
    const m = Math.floor((countdownTime % 3600) / 60);
    const s = countdownTime % 60;
    miningBtn.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // Mining timer logic
  function startMiningTimers() {
    clearInterval(countdownInterval);
    clearInterval(miningInterval);

    countdownInterval = setInterval(() => {
      countdownTime--;
      updateCountdownDisplay();

      if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        clearInterval(miningInterval);
        mining = false;
        miningBtn.disabled = false;
        miningBtn.textContent = "Start";
        miningStatus.textContent = "Complete";
        stopMiningOnServer();
      }
    }, 1000);

    miningInterval = setInterval(fetchUserData, 30000);
  }

  // Start mining request
  async function startMining() {
    if (mining) return alert("Already mining");

    try {
      const res = await fetch(`${API_BASE_URL}/mine/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        countdownTime = 8 * 60 * 60;
        mining = true;
        miningStatus.textContent = "Mining...";
        startMiningTimers();
      } else {
        alert(data.message || "Unable to start mining");
      }
    } catch (err) {
      console.error("Start mining error:", err);
    }
  }

  async function stopMiningOnServer() {
    try {
      await fetch(`${API_BASE_URL}/mine/stop`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Stop mining error:", err);
    }
  }

  miningBtn.addEventListener("click", () => {
    if (!mining) startMining();
    else alert("Mining already in progress!");
  });

  // Password modal
  window.logout = () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  };

  window.changePassword = () => {
    document.getElementById("password-modal").style.display = "flex";
  };

  document.getElementById("password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const current = document.getElementById("current-password").value;
    const next = document.getElementById("new-password").value;
    const msg = document.getElementById("password-msg");

    try {
      const res = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: current, newPassword: next })
      });

      const data = await res.json();
      msg.style.color = res.ok ? "green" : "red";
      msg.textContent = res.ok ? "✅ Password updated!" : `❌ ${data.message}`;
      if (res.ok) setTimeout(() => closePasswordModal(), 1500);
    } catch (err) {
      msg.textContent = "❌ Something went wrong.";
    }
  });
  // ✖ Close icon handler
document.getElementById("close-password-modal").addEventListener("click", closePasswordModal);

  function closePasswordModal() {
    document.getElementById("password-modal").style.display = "none";
    document.getElementById("password-form").reset();
    document.getElementById("password-msg").textContent = "";
  }

  // Load user mining data on page load
  await fetchUserData();
});
