const API_BASE_URL = "https://gp-coin-website.onrender.com/api";

// Protect the page
window.onload = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    // Optional: Validate token expiry
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp || Date.now() >= payload.exp * 1000) {
            throw new Error("Token expired");
        }
    } catch {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
};

// DOM Elements
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userGPID = document.getElementById("user-id");
const userCNIC = document.getElementById("user-cnic");
const userMobile = document.getElementById("user-mobile");
const userDOB = document.getElementById("user-dob");
const rankTitle = document.getElementById("user-rank");
const rankLogo = document.getElementById("rank-logo");

// Fetch user profile from backend
async function loadUserProfile() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
            userName.textContent = data.name || "N/A";
            userEmail.textContent = data.email || "N/A";
            userGPID.textContent = data.gp_id || "N/A";
            userCNIC.textContent = data.cnic || "N/A";
            userMobile.textContent = data.mobile || "N/A";
            userDOB.textContent = data.dob || "N/A";
            rankTitle.textContent = data.rank || "Free";
            rankLogo.src = `assets/icons/${data.rank}-logo.png`;
            document.body.className = data.rank; // Apply rank background style
        } else {
            alert("Failed to load profile: " + data.message);
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

loadUserProfile();

// Logout Function
function logout() {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Change Password Function (basic prompt version)
async function changePassword() {
    const currentPassword = prompt("Enter your current password:");
    if (!currentPassword) return;
  
    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return;
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Password changed successfully!");
      } else {
        alert("Failed to change password: " + data.message);
      }
    } catch (error) {
      console.error("Password change error:", error);
      alert("An error occurred while changing password.");
    }
  }
  

// Attach to window
window.logout = logout;
window.changePassword = changePassword;
