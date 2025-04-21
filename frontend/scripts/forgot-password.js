const API_BASE_URL = "http://localhost:3000/api/forgot-password";

document.addEventListener("DOMContentLoaded", () => {
  const emailForm = document.getElementById("forgot-password-form");
  const otpForm = document.getElementById("otp-form");
  const resetForm = document.getElementById("reset-form");

  const emailInput = document.getElementById("email");
  const otpInput = document.getElementById("otp");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const msgBox = document.getElementById("form-msg");

  let currentEmail = "";

  // Step 1: Send OTP
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return showMessage("Please enter your email.", "red");

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        currentEmail = email;
        showMessage("✅ OTP sent to your email.", "green");
        emailForm.style.display = "none";
        otpForm.style.display = "block";
      } else {
        showMessage(data.message || "Failed to send OTP", "red");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      showMessage("Server error. Please try again.", "red");
    }
  });

  // Step 2: Verify OTP
  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = otpInput.value.trim();
    if (!otp) return showMessage("Please enter the OTP.", "red");

    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        showMessage("✅ OTP verified! Enter your new password.", "green");
        otpForm.style.display = "none";
        resetForm.style.display = "block";
      } else {
        showMessage(data.message || "Invalid OTP", "red");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      showMessage("Server error. Please try again.", "red");
    }
  });

  // Step 3: Reset Password (to be implemented on backend later)
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword.length < 6) {
      return showMessage("Password must be at least 6 characters.", "red");
    }

    if (newPassword !== confirmPassword) {
      return showMessage("Passwords do not match.", "red");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        showMessage("✅ Password reset successfully!", "green");
        resetForm.reset();
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        showMessage(data.message || "Failed to reset password", "red");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      showMessage("Server error. Please try again.", "red");
    }
  });

  // Utility to show messages
  function showMessage(msg, color = "red") {
    msgBox.textContent = msg;
    msgBox.style.color = color;
  }

  // Hamburger toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
});
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
  }
});
