const API_BASE_URL = "http://localhost:3000/api";
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const closePopup = document.getElementById("close-popup");

    // Function to show popup with a message
    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = "flex";
    }

    // Click event for Watch Ads
    document.getElementById("watch-ads").addEventListener("click", () => {
        showPopup("There is no ad to watch.");
    });

    // Click event for Watch Videos
    document.getElementById("watch-videos").addEventListener("click", () => {
        showPopup("There is no video to watch.");
    });

    // Close the popup
    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });
});
