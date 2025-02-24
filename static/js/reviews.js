let currentUserId = null;

document.addEventListener("DOMContentLoaded", async () => {
    currentUserId = await getCurrentUserId();
    await loadReviews();
});

const token = localStorage.getItem("token");

async function loadReviews() {
    const userId = "65f1a5c2d7e6e3b9a0b6f123";

    try {
        const response = await fetch(`/api/reviews?userId=${userId}`);
        const reviews = await response.json();

        const reviewsContainer = document.getElementById("reviews-container");
        reviewsContainer.innerHTML = "";

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
            return;
        }

        reviews.forEach(review => addReviewToUI(review));

    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

async function addReview() {
    if (!token) {
        alert("You need to log in before submitting a review.");
        return;
    }

    const userId = "65f1a5c2d7e6e3b9a0b6f123";
    const reviewText = document.getElementById("review-text").value;
    const reviewRating = document.getElementById("review-rating").value;


    if (!reviewText || !reviewRating) {
        alert("Please enter a review and rating.");
        return;
    }

    if (!reviewRating || isNaN(reviewRating) || reviewRating < 0.1 || reviewRating > 5) {
        alert("Please enter a valid rating (0.1-5.0).");
        return;
    }

    try {
        const userResponse = await fetch("/api/user/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error("Failed to fetch user data.");
        }

        const userData = await userResponse.json();
        const reviewerName = userData.username;
        const reviewerId = userData.userId

        const response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                userId,
                reviewerName,
                reviewerId,
                text: reviewText,
                rating: parseFloat(reviewRating),
                timestamps: true
            })
        });


        if (!response.ok) throw new Error("Failed to submit review.");

        const newReview = await response.json();

        addReviewToUI(newReview);

        document.getElementById("review-text").value = "";
        document.getElementById("review-rating").value = "5.0";

    } catch (error) {
        console.error("Error adding review:", error);
    }
}

async function getCurrentUserId() {
    try {
        const response = await fetch("/api/user/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        return userData.userId;
    } catch (error) {
        console.error("Error fetching current user ID:", error);
        return null;
    }
}


async function addReviewToUI(review) {

    const reviewsContainer = document.getElementById("reviews-container");

    if (!currentUserId) {
        currentUserId = await getCurrentUserId();
    }

    const reviewElement = document.createElement("div");
    const formatDateTime = (dateString) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const createdAt = formatDateTime(review.createdAt);
    const updatedAt = review.updatedAt && review.updatedAt !== review.createdAt
        ? formatDateTime(review.updatedAt)
        : null;

    reviewElement.classList.add("review");

    reviewElement.innerHTML = `
        <p><strong>User:</strong> ${review.reviewerName}</p>
        <p><strong>Rating:</strong> ⭐<span class="review-rating">${review.rating}</span></p>
        <p class="review-text">${review.text}</p>
        <p class="review-timestamp">
            <strong>Created:</strong> ${createdAt} 
            ${updatedAt ? `<br><strong>Updated:</strong> ${updatedAt}` : ""}
        </p>    
        `;

    const reviewerId = review.reviewerId?._id || review.reviewerId;

    if (token && String(reviewerId) === String(currentUserId)) {

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("review-buttons");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button-review");
        editButton.onclick = () => editReview(review, reviewElement);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button-review");
        deleteButton.onclick = () => deleteReview(review._id, reviewElement);

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);
        reviewElement.appendChild(buttonsContainer);
    }

    reviewsContainer.appendChild(reviewElement);
}

function editReview(review, reviewElement) {
    const newText = prompt("Edit your review:", review.text);
    if (!newText) {
        alert("Review text cannot be empty.");
        return;
    }

    const newRating = parseFloat(prompt("Edit your rating:", review.rating));
    if (!newRating || isNaN(newRating) || newRating < 0.1 || newRating > 5) {
        alert("Please enter a valid rating (0.1-5.0).");
        return;
    }

    fetch(`/api/reviews/${review._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({text: newText, rating: newRating})
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to edit review");
            return res.json();
        })
        .then(updatedReview => {
            reviewElement.querySelector(".review-text").textContent = updatedReview.text;
            reviewElement.querySelector(".review-rating").textContent = `${updatedReview.rating}`;
            const updatedAt = new Date(updatedReview.updatedAt).toLocaleString();
            const timestampElement = reviewElement.querySelector(".review-timestamp");
            if (timestampElement) {
                timestampElement.innerHTML = `<strong>Created:</strong> ${new Date(review.createdAt).toLocaleString()}<br>
                                              <strong>Updated:</strong> ${updatedAt}`;
            }

        })
        .catch(error => console.error("Error editing review:", error));
}

function deleteReview(reviewId, reviewElement) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to delete review");
            reviewElement.remove();
        })
        .catch(error => console.error("Error deleting review:", error));
}


