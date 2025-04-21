// scripts/main.js
const API_BASE_URL = "https://gp-coin-website.onrender.com/api";
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});
document.addEventListener("DOMContentLoaded", () => {
    const text = "GP Coin empowers users with fast, low-cost, and efficient earning, making it ideal for everyday use.";
    let index = 0;
    const speed = 80; // Adjust typing speed (lower is faster)

    function typeWriterEffect() {
        if (index < text.length) {
            document.getElementById("typewriter").textContent += text.charAt(index);
            index++;
            setTimeout(typeWriterEffect, speed);
        }
    }

    typeWriterEffect();
});
