// Description: JS functions for making online reservations for the diner
// Authors: Chris Morrison, Steve Morrison - SD12
// Date(s): October 23 - Novemver 1, 2024
// Version 1.0


// Set up time options from open hours on 24 hour clock using hourly increments
window.addEventListener('DOMContentLoaded', function () {
    const reservationTimeSelect = document.getElementById('reservation-time');
    const openHour = 11; 
    const closeHour = 22; 
    const timeIncrement = 1; 

    for (let hour = openHour; hour <= closeHour; hour += timeIncrement) {
        const option = document.createElement('option');
        const timeString = formatHour(hour);
        option.value = timeString;
        option.textContent = timeString;
        reservationTimeSelect.appendChild(option);
    }

    // function to format time
    function formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${hour12}:00 ${period}`;
    }

    // reservation form submission
    const reservationForm = document.getElementById('reservation-form');
    const selectedDateDisplay = document.getElementById('selected-date');
    const selectedTimeDisplay = document.getElementById('selected-time');
    const selectedGuestsDisplay = document.getElementById('selected-guests');
    const reservationMessage = document.getElementById('reservation-message');

    reservationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get data
        const reservationDate = document.getElementById('reservation-date').value;
        const reservationTime = document.getElementById('reservation-time').value;
        const numberOfGuests = parseInt(document.getElementById('number-of-guests').value);
        const customerEmail = document.getElementById('customer-email').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();

        // Input validations
        if (!reservationDate || !reservationTime || isNaN(numberOfGuests) || !customerEmail || !customerPhone) {
            alert('Please fill out all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(customerPhone)) {
            alert('Please enter a valid phone number (digits only).');
            return;
        }

        // Display reservation info
        selectedDateDisplay.textContent = `Date: ${reservationDate}`;
        selectedTimeDisplay.textContent = `Time: ${reservationTime}`;
        selectedGuestsDisplay.textContent = `Guests: ${numberOfGuests}`;

        reservationMessage.textContent = 'Thank you! Your reservation has been submitted.';

        // Log reservation to console
        console.log('Reservation Submitted:');
        console.log('Date:', reservationDate);
        console.log('Time:', reservationTime);
        console.log('Number of Guests:', numberOfGuests);
        console.log('Email:', customerEmail);
        console.log('Phone:', customerPhone);

        // Reset the form
        reservationForm.reset();
    });
});
