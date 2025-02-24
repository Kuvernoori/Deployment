document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found, please log in again.");
        alert("You must log in first.");
        return;
    }

    try {
        const response = await fetch("/api/user/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const user = await response.json();
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("display-gender").textContent = user.gender || "";
        document.getElementById("display-age").textContent = user.age || "";

        const genderSelect = document.getElementById("gender-select");
        const ageInput = document.getElementById("age-input");

        genderSelect.value = user.gender || "";
        ageInput.value = user.age || "";

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Unable to load user data. Please log in again.");
    }

    document.getElementById("edit-btn").addEventListener("click", () => {
        document.getElementById("editable-info").style.display = "block";
        document.getElementById("save-btn").style.display = "inline-block";
        document.getElementById("edit-btn").style.display = "none";
    });

    document.getElementById("save-btn").addEventListener("click", async () => {
        const gender = document.getElementById("gender-select").value;
        const age = document.getElementById("age-input").value;

        if (age < 18) {
            alert("Age must be 18 or older.");
            return;
        }

        const response = await fetch("/api/user/update", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ gender, age })
        });

        if (response.ok) {
            alert("Information updated successfully!");
            document.getElementById("display-gender").textContent = gender;
            document.getElementById("display-age").textContent = age;

            document.getElementById("editable-info").style.display = "none";
            document.getElementById("save-btn").style.display = "none";
            document.getElementById("edit-btn").style.display = "inline-block";
        } else {
            alert("Error updating information.");
        }
    });

    document.getElementById("change-name-btn").addEventListener("click", () => {
        document.getElementById("change-name-container").style.display = "block";
        document.getElementById("change-name-btn").style.display = "none";
    });

    document.getElementById("save-name-btn").addEventListener("click", async () => {
        const newUsername = document.getElementById("new-username").value;

        if (newUsername.trim() === "") {
            alert("Username cannot be empty.");
            return;
        }

        const response = await fetch("/api/user/check-username", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newUsername })
        });

        const usernameTaken = await response.json();
        if (usernameTaken.exists) {
            alert("Username is already taken.");
            return;
        }

        const updateResponse = await fetch("/api/user/change-name", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newUsername })
        });

        if (updateResponse.ok) {
            alert("Name updated successfully!");
            document.getElementById("username").textContent = newUsername;
        } else {
            alert("Error updating name.");
        }

        document.getElementById("change-name-container").style.display = "none";
        document.getElementById("change-name-btn").style.display = "inline-block";
    });

    document.getElementById("change-email-btn").addEventListener("click", () => {
        document.getElementById("change-email-container").style.display = "block";
        document.getElementById("change-email-btn").style.display = "none";
    });

    document.getElementById("save-email-btn").addEventListener("click", async () => {
        const newEmail = document.getElementById("new-email").value;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(newEmail)) {
            alert("Please enter a valid email address. (example@domain.tld)");
            return;
        }

        const response = await fetch("/api/user/check-email", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newEmail })
        });

        const emailTaken = await response.json();
        if (emailTaken.exists) {
            alert("Email is already in use.");
            return;
        }

        const updateResponse = await fetch("/api/user/change-email", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newEmail })
        });

        if (updateResponse.ok) {
            alert("Email updated successfully!");
            document.getElementById("email").textContent = newEmail;
        } else {
            alert("Error updating email.");
        }

        document.getElementById("change-email-container").style.display = "none";
        document.getElementById("change-email-btn").style.display = "inline-block";
    });

    document.getElementById("change-password-btn").addEventListener("click", () => {
        document.getElementById("change-password-container").style.display = "block";
        document.getElementById("change-password-btn").style.display = "none";
    });

    document.getElementById("save-password-btn").addEventListener("click", async () => {
        const currentPassword = document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert("Password must be at least 6 characters long and contain at least one letter and one number.");
            return;
        }

        const response = await fetch("/api/user/check-current-password", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ currentPassword })
        });

        if (!response.ok) {
            alert("Current password is incorrect.");
            return;
        }

        const updateResponse = await fetch("/api/user/change-password", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newPassword })
        });

        if (updateResponse.ok) {
            alert("Password updated successfully!");
        } else {
            alert("Error updating password.");
        }

        document.getElementById("change-password-container").style.display = "none";
        document.getElementById("change-password-btn").style.display = "inline-block";
    });
});
