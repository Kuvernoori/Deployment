document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");
    const carList = document.querySelector(".car-list");

    searchButton.addEventListener("click", async function (event) {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return alert("Please enter a car name!");

        try {
            const response = await fetch(`/api/search?name=${query}`);
            const data = await response.json();

            carList.innerHTML = "";

            if (data.message) {
                carList.innerHTML = `<p class="no-results">${data.message}</p>`;
                carList.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                data.forEach(car => {
                    let sellerLink = "#"
                    if (car.name === "BMW M3"){
                        sellerLink = `/cartrading/reviewExample.html`
                    }
                    const carItem = `
                        <div class="car-item">
                            <img src="${car.image ? `/images/${car.image}` : '/images/default_car.jpg'}" alt="${car.name}">
                            <h3>${car.name}</h3>
                            <p><strong>Year:</strong> ${car.year}</p>
                            <p><strong>Color:</strong> ${car.color}</p>
                            <p><strong>Seller:</strong> <a href = ${sellerLink}>${car.seller || "Unknown"}</a></p>
                            <p><strong>Rating:</strong> ⭐ ${car.rating}</p>
                            <p>${car.description}</p>
                            <button class="contact-button">Contact the seller</button>
                        </div>
                    `;
                    carList.innerHTML += carItem;
                    carList.scrollIntoView({ behavior: "smooth", block: "start" });
                });
            }
        } catch (error) {
            console.error("Error fetching car data:", error);
            alert("Server error, please try again later.");
        }
    });
});
