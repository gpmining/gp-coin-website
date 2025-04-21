const API_BASE_URL = "https://gp-coin-website.onrender.com/api";
const API_BASE_URL = "https://gp-coin-website.onrender.com/api"; // Change this if backend is running on a different port

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Login failed:", error);
    }
}
