document.addEventListener("DOMContentLoaded", function () {
    const popup = document.createElement("div");
    const contactButtons = document.querySelectorAll(".contact-button");


    popup.id = "contact-popup";
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Contact the Seller</h2>
            <textarea id="message" placeholder="Write your message..."></textarea>
            <button id="sendMessage">Send</button>
            <button id="closePopup">Close</button>
        </div>
    `;
    document.body.appendChild(popup);

    function isUserLoggedIn() {
        return localStorage.getItem("token") !== null || sessionStorage.getItem("token") !== null;
    }

    const notification = document.createElement("div");
    notification.id = "notification";
    notification.innerHTML = "Message sent successfully!";
    document.body.appendChild(notification);

    contactButtons.forEach(button => {
        button.addEventListener("click", function () {
            popup.style.display = "flex";
        });
    });

    document.getElementById("closePopup").addEventListener("click", function () {
        popup.style.display = "none";
    });

    document.getElementById("sendMessage").addEventListener("click", function () {

        const message = document.getElementById("message").value.trim();
        if (message === "") {
            showNotification("Please enter a message.", "error");
            return;
        }

        showNotification("Message sent successfully!", "success");
        document.getElementById("message").value = "";
        popup.style.display = "none";
    });

    function showNotification(text, type) {
        notification.innerHTML = text;
        notification.className = type;
        notification.style.display = "block";

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.style.display = "none";
                notification.style.opacity = "1";
            }, 500);
        }, 2000);
    }

    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("contact-button")) {
            if (!isUserLoggedIn()) {
                alert("You need to log in first!");
                return;
            }
            popup.style.display = "flex";
        }
    });
    document.getElementById("logoutButton")?.addEventListener("click", function () {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    });
});
