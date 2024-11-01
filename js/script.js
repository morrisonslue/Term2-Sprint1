// Description: JavaScript functions for newsletter and reviews on Gary Blue's Diner Homepage
// Authors: Chris Morrison, Steve Morrison - SD12
// Date(s): October 23 - Novemver 1, 2024
// Version 1.0


/* Function to retrieve and populate customer reviews from JSON file */

fetch('../json/reviews.json')
    .then(response => response.json())
    .then(data => {
        const reviewsContainer = document.getElementById('reviews-container');
        data.reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');

            const reviewName = document.createElement('h3');
            reviewName.textContent = review.name;

            const reviewRating = document.createElement('p');
            reviewRating.innerHTML = 'Rating: ' + '⭐'.repeat(review.rating);

            const reviewComment = document.createElement('p');
            reviewComment.textContent = review.comment;

            reviewCard.appendChild(reviewName);
            reviewCard.appendChild(reviewRating);
            reviewCard.appendChild(reviewComment);

            reviewsContainer.appendChild(reviewCard);
        });
    })
    .catch(error => console.error('Error fetching reviews:', error));

/* Newsletter signup form functionality and error handling + confirmation message */

document.getElementById('newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const message = document.getElementById('newsletter-message');
    if (validateEmail(emailInput.value)) {
        localStorage.setItem('subscriberEmail', emailInput.value);
        message.textContent = 'Thank you for subscribing!';
        message.style.color = 'green';
        emailInput.value = '';
    } else {
        message.textContent = 'Please enter a valid email address.';
        message.style.color = 'red';
    }
});

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}




