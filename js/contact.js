// Description: JavaScript functionality for contact form
// Authors: Chris Morrison, Steve Morrison - SD12
// Date(s): October 23 - Novemver 1, 2024
// Version 1.0


// Contact form submission function
window.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const contactName = document.getElementById('contact-name').value.trim();
        const contactEmail = document.getElementById('contact-email').value.trim();
        const contactSubject = document.getElementById('contact-subject').value.trim();
        const contactMessage = document.getElementById('contact-message').value.trim();

        // Input validations
        if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
            alert('Please fill out all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Display confirmation message
        formMessage.textContent = 'Thank you for reaching out! We will get back to you soon.';

        // Log from contact info to console
        console.log('Contact Form Submitted:');
        console.log('Name:', contactName);
        console.log('Email:', contactEmail);
        console.log('Subject:', contactSubject);
        console.log('Message:', contactMessage);

        // Reset the form
        contactForm.reset();
    });
});
