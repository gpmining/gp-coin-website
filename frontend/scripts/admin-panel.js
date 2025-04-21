const API_BASE_URL = "https://gp-coin-website.onrender.com/api";

// Ensure admin is authenticated
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return (window.location.href = "admin-login.html");
  }

  fetchUsers();
  fetchSubscriptions();
  fetchWithdrawals();
});

// Sidebar toggle
document.getElementById("sidebar-toggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

// Sidebar navigation
document.getElementById("users-link").addEventListener("click", () => {
  showSection("users-section");
});
document.getElementById("subscription-requests-link").addEventListener("click", () => {
  showSection("subscription-requests-section");
});
document.getElementById("withdraw-requests-link").addEventListener("click", () => {
  showSection("withdraw-requests-section");
});

function showSection(id) {
  document.querySelectorAll("main section").forEach(sec => (sec.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
});

// Fetch Users
async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    const data = await res.json();
    if (res.ok) populateUsers(data);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

function populateUsers(users) {
  const tbody = document.getElementById("user-table-body");
  tbody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.gp_id}</td>
      <td>${user.name}</td>
      <td>${user.email || "N/A"}</td>
      <td>${user.mobile || "N/A"}</td>
      <td>${user.cnic || "N/A"}</td>
      <td>${user.rank}</td>
      <td>
        <select onchange="updateUserRank('${user._id}', this.value)">
          <option value="free">Free</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="diamond">Diamond</option>
          <option value="ultimate">Ultimate</option>
        </select>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Update User Rank
async function updateUserRank(userId, newRank) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/update-rank`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, new_rank: newRank }),
    });

    const data = await res.json();
    alert(data.message || "Rank updated.");
    fetchUsers();
  } catch (err) {
    console.error("Rank update error:", err);
  }
}

// Delete User
async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/delete-user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await res.json();
    alert(data.message || "User deleted.");
    fetchUsers();
  } catch (err) {
    console.error("User delete error:", err);
  }
}

// Fetch Subscription Requests
async function fetchSubscriptions() {
  try {
    const res = await fetch(`${API_BASE_URL}/subscription/all`);
    const { subscriptions } = await res.json();

    const tbody = document.getElementById("subscription-requests-table-body");
    tbody.innerHTML = "";

    subscriptions.forEach(req => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${req.user_id?.gp_id || "N/A"}</td>
        <td>${req.user_id?.name || "N/A"}</td>
        <td>${req.rank}</td>
        <td>$${req.amount_paid}</td>
        <td>${req.transaction_id}</td>
        <td><span class="status ${req.status}">${req.status}</span></td>
        <td>
          ${
            req.status === "pending"
              ? `<button onclick="updateSubscription('${req._id}', 'approved')">Approve</button>
                 <button onclick="updateSubscription('${req._id}', 'rejected')">Reject</button>`
              : ""
          }
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading subscriptions:", err);
  }
}

// Update Subscription Request
async function updateSubscription(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/subscription/update/${id}`, {
      method: "PUT", // ✅ should be PUT not POST
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    
    const data = await res.json();
    alert(data.message);
    fetchSubscriptions();
  } catch (err) {
    console.error("Failed to update subscription:", err);
  }
}

// Fetch Withdrawals
async function fetchWithdrawals() {
  try {
    const res = await fetch(`${API_BASE_URL}/withdrawal/admin/withdrawals`);
    const { withdrawals } = await res.json();

    const tbody = document.getElementById("withdraw-requests-table-body");
    tbody.innerHTML = "";

    withdrawals.forEach(req => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${req.user_id?.gp_id || "N/A"}</td>
        <td>${req.user_id?.name || "N/A"}</td>
        <td>${req.user_id?.email || "N/A"}</td>
        <td>$${req.amount_usd}</td>
        <td>${req.binance_id}</td>
        <td><span class="status ${req.status}">${req.status}</span></td>
        <td>
          ${
            req.status === "pending"
              ? `<button onclick="updateWithdrawal('${req._id}', 'approved')">Approve</button>
                 <button onclick="updateWithdrawal('${req._id}', 'rejected')">Reject</button>`
              : ""
          }
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching withdrawals:", err);
  }
}

// Update Withdrawal Request
async function updateWithdrawal(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/withdrawal/admin/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    alert(data.message);
    fetchWithdrawals(); // Refresh the table
  } catch (err) {
    console.error("Failed to update withdrawal:", err);
  }
}


// Expose global functions
window.updateUserRank = updateUserRank;
window.deleteUser = deleteUser;
