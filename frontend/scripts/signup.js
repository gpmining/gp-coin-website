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

// CNIC Formatting
document.getElementById("cnic").addEventListener("input", function (e) {
  let digits = e.target.value.replace(/\D/g, "").substring(0, 13);
  let formatted = digits.replace(/^(\d{5})(\d{7})?(\d{1})?$/, "$1-$2-$3");
  e.target.value = formatted;
});

// Mobile Number Formatting
document.getElementById("mobile").addEventListener("input", function (e) {
  let digits = e.target.value.replace(/\D/g, "").substring(0, 11);
  let formatted = digits.replace(/^(\d{4})(\d{7})?$/, "$1-$2");
  e.target.value = formatted;
});

// Form Submission
document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn = document.querySelector(".signup-btn");
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  const recaptchaToken = grecaptcha.getResponse();
  if (!recaptchaToken) {
    alert("Please complete the reCAPTCHA.");
    return;
  }

  const formData = {
    name: document.getElementById("name").value,
    cnic: document.getElementById("cnic").value,
    mobile: document.getElementById("mobile").value,
    dob: document.getElementById("dob").value,
    email: document.getElementById("email").value,
    referralGPID: document.getElementById("referral-gp-id").value || "None",
    password: password,
    recaptchaToken: recaptchaToken,
  };

  // Show loading spinner
  btn.classList.add("loading");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Sign Up Successful! Redirecting to Login...");
      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("An error occurred. Please try again.");
  } finally {
    btn.classList.remove("loading");
  }
});
