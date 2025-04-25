const API_BASE_URL = "https://gp-coin-website.onrender.com/api";

// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Toggle Password Visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggleBtn = input.nextElementSibling;

  if (input.type === "password") {
    input.type = "text";
    toggleBtn.textContent = "Hide";
  } else {
    input.type = "password";
    toggleBtn.textContent = "Show";
  }
}
// Login Form Submission
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login Successful!");
      localStorage.setItem("token", data.token); // ✅ Store JWT token
      localStorage.setItem("gp_id", data.gp_id); // ✅ Store GP ID
      window.location.href = "dashboard.html";
  } else {
      alert(data.message);
  }  
  } catch (error) {
    console.error("Login failed:", error);
    alert("An error occurred. Please try again.");
  }
});
