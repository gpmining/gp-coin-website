const API_BASE_URL = "https://gp-coin-website.onrender.com/api";

document.getElementById("admin-login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("adminToken", data.token);
            alert("Login Successful!");
            window.location.href = "admin-panel.html"; // Redirect to Admin Panel
        } else {
            document.getElementById("error-message").textContent = data.message;
        }
    } catch (error) {
        console.error("Login failed:", error);
        document.getElementById("error-message").textContent = "An error occurred. Please try again.";
    }
});
