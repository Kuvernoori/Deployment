document.addEventListener("DOMContentLoaded", function () {
    const filterButton = document.getElementById("filterButton");
    const yearInput = document.getElementById("yearInput");
    const colorInput = document.getElementById("colorInput");
    const carList = document.querySelector(".car-list");

    let allCars = [];

    async function fetchCars() {
        try {
            const response = await fetch("/api/cars/all");
            if (!response.ok) throw new Error(`Error fetching: ${response.status}`);

            allCars = await response.json();
            displayCars(allCars);
        } catch (error) {
            console.error("Cars fetching error:", error);
            displayCars([]);
        }
    }

    function applyFilters() {
        let filteredCars = allCars;

        const yearFilter = yearInput.value.trim();
        const colorFilter = colorInput.value.trim().toLowerCase();

        if(!yearFilter && !colorFilter) {
            return alert("Please enter at least one parameter before applying filters!")
        }
        if (yearFilter) {
            filteredCars = filteredCars.filter(car => String(car.year) === yearFilter);
        }

        if (colorFilter) {
            filteredCars = filteredCars.filter(car => car.color?.toLowerCase() === colorFilter);
        }

        displayCars(filteredCars);
        if (filteredCars.length > 0) {
            carList.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function displayCars(cars) {
        carList.innerHTML = "";

        if (!cars || cars.length === 0) {
            carList.innerHTML = '<p class="no-results">No cars found</p>';
            carList.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        cars.forEach(car => {
            let sellerLink = "#"
            if (car.name === "BMW M3"){
                sellerLink = `/cartrading/reviewExample.html`
            }

            const carItem = `
                <div class="car-item">
                    <img src="${car.image ? `/images/${car.image}` : '/images/default_car.jpg'}" alt="${car.name}">
                    <h3>${car.name}</h3>
                    <p><strong>Year:</strong> ${car.year || "N/A"}</p>
                    <p><strong>Color:</strong> ${car.color || "N/A"}</p>
                    <p><strong>Seller:</strong> <a href = ${sellerLink}>${car.seller || "Unknown"}</a></p>
                    <p><strong>Rating:</strong> ⭐ ${car.rating || "N/A"}</p>
                    <p>${car.description || "No description available"}</p>
                    <button class="contact-button">Contact the seller</button>
                </div>
            `;
            carList.innerHTML += carItem;
        });
    }

    fetchCars();

    filterButton.addEventListener("click", function (event){
        event.preventDefault();
        applyFilters();
    });

    window.displayCars = displayCars;
});
