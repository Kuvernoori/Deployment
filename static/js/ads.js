document.addEventListener("DOMContentLoaded", async function () {
    async function getUserUsername() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User is not authenticated");

            const response = await fetch("http://localhost:3000/api/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Error fetching user data");

            const data = await response.json();
            return data.username;
        } catch (error) {
            console.error("Error retrieving user username:", error);
            return null;
        }
    }

    let editingAdId = null;

    async function saveAd() {
        let title = document.getElementById("title")?.value.trim();
        let year = document.getElementById("year")?.value.trim();
        let color = document.getElementById("color")?.value.trim();
        let description = document.getElementById("description")?.value.trim();
        let imageFile = document.getElementById("image")?.files[0];

        if (!title || !year || !color || !description || !imageFile) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        let username = await getUserUsername();
        if (!username) {
            alert("Error retrieving user information.");
            return;
        }

        let ads = JSON.parse(localStorage.getItem("my_ads")) || {};
        if (!ads[username]) {
            ads[username] = [];
        }

        if (editingAdId) {
            let userAds = ads[username];
            let adIndex = userAds.findIndex(car => car.id === editingAdId);
            if (adIndex === -1) {
                alert("Error: Ad not found.");
                return;
            }

            userAds[adIndex].name = title;
            userAds[adIndex].year = year;
            userAds[adIndex].color = color;
            userAds[adIndex].description = description;

            if (imageFile) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    userAds[adIndex].image = e.target.result;
                    ads[username] = userAds;
                    localStorage.setItem("my_ads", JSON.stringify(ads));
                    displayAds();
                    closePopup();
                    editingAdId = null;
                };
                reader.readAsDataURL(imageFile);
            } else {
                ads[username] = userAds;
                localStorage.setItem("my_ads", JSON.stringify(ads));
                displayAds();
                closePopup();
                editingAdId = null;
            }
        } else {
            let reader = new FileReader();
            reader.onload = function (e) {
                let newAd = {
                    id: Date.now(),
                    name: title,
                    year: year,
                    color: color,
                    description: description,
                    image: e.target.result,
                    seller: username,
                    rating: 5
                };

                ads[username].push(newAd);
                localStorage.setItem("my_ads", JSON.stringify(ads));

                displayAds();
                closePopup();
            };
            reader.readAsDataURL(imageFile);
        }
    }

    async function displayAds() {
        let adsList = document.getElementById("ads-list");
        adsList.innerHTML = "";

        let username = await getUserUsername();
        let ads = JSON.parse(localStorage.getItem("my_ads")) || {};
        let userAds = ads[username] || [];

        if (userAds.length === 0) {
            adsList.innerHTML = '<p class="no-results" style="font-size:24px; color:#777; font-weight:bold; text-align:center; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:100%;">You have no ads yet.</p>';
            return;
        }

        userAds.forEach(car => {
            const carItem = `
                <div class="car-item" data-id="${car.id}">
                    <img src="${car.image ? car.image : '/images/default_car.jpg'}" alt="${car.name}">
                    <h3>${car.name}</h3>
                    <p><strong>Year:</strong> ${car.year}</p>
                    <p><strong>Color:</strong> ${car.color}</p>
                    <p><strong>Seller:</strong> <a href="#">${car.seller || "Unknown"}</a></p>
                    <p><strong>Rating:</strong> ⭐ ${car.rating}</p>
                    <p>${car.description}</p>
                    <button class="edit-button" onclick="editAd(${car.id})">Edit</button>
                    <button class="delete-button" onclick="deleteAd(${car.id})">Delete</button>
                </div>
            `;
            adsList.innerHTML += carItem;
        });
    }

    async function editAd(id) {
        let username = await getUserUsername();
        let ads = JSON.parse(localStorage.getItem("my_ads")) || {};
        let userAds = ads[username] || [];

        let adIndex = userAds.findIndex(car => car.id === id);
        if (adIndex === -1) {
            alert("Ad not found!");
            return;
        }

        let ad = userAds[adIndex];

        document.getElementById("title").value = ad.name;
        document.getElementById("year").value = ad.year;
        document.getElementById("color").value = ad.color;
        document.getElementById("description").value = ad.description;

        editingAdId = id;
        openPopup();
    }

    async function deleteAd(id) {
        let username = await getUserUsername();
        let ads = JSON.parse(localStorage.getItem("my_ads")) || {};
        let userAds = ads[username] || [];

        let confirmDelete = confirm("Are you sure you want to delete this ad?");
        if (!confirmDelete) return;

        ads[username] = userAds.filter(car => car.id !== id);
        localStorage.setItem("my_ads", JSON.stringify(ads));

        displayAds();
    }

    function ensureCreateAdButton() {
        let buttonContainer = document.getElementById("create-ad-container");
        if (!buttonContainer) {
            console.error("Error: #create-ad-container element not found!");
            return;
        }

        let existingButton = document.getElementById("create-ad-button");
        if (!existingButton) {
            let createButton = document.createElement("button");
            createButton.textContent = "Create Ad";
            createButton.classList.add("btn-create-primary");
            createButton.id = "create-ad-button";
            createButton.onclick = openPopup;
            buttonContainer.appendChild(createButton);
        }
    }

    function openPopup() {
        let popup = document.getElementById("popup");
        if (popup) {
            popup.style.display = "block";
        } else {
            console.error("Popup element not found!");
        }
    }

    function closePopup() {
        let popup = document.getElementById("popup");
        if (popup) {
            popup.style.display = "none";
        } else {
            console.error("Popup element not found!");
        }
    }

    window.saveAd = saveAd;
    window.displayAds = displayAds;
    window.editAd = editAd;
    window.deleteAd = deleteAd;
    window.openPopup = openPopup;
    window.closePopup = closePopup;

    await displayAds();
    ensureCreateAdButton();
});
