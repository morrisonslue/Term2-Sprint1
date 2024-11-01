// Description: JS functions for online ordering features of the website
// Authors: Chris Morrison, Steve Morrison - SD12
// Date(s): October 23 - Novemver 1, 2024
// Version 1.0


window.addEventListener('DOMContentLoaded', function() {
    fetch('../json/menu-items.json')
        .then(response => response.json())
        .then(data => {
            const menuItemsData = data.menuItems;
            const itemsByCategory = {}; // Organize the json items by category
            menuItemsData.forEach(item => {
                if (!itemsByCategory[item.category]) {
                    itemsByCategory[item.category] = [];
                }
                itemsByCategory[item.category].push(item);
            });
            window.itemsByCategory = itemsByCategory; // Store categorized items

            // event listener when picking a category on webpage
            const categorySelect = document.getElementById('category-select');
            const itemSelect = document.getElementById('item-select');

            categorySelect.addEventListener('change', function() {
                const selectedCategory = categorySelect.value;
                itemSelect.innerHTML = '<option value="">Choose an Item</option>';

                if (selectedCategory && itemsByCategory[selectedCategory]) {
                    itemsByCategory[selectedCategory].forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.title;
                        option.textContent = `${item.title} - $${item.price.toFixed(2)}`;
                        option.setAttribute('data-price', item.price);
                        itemSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching menu items:', error));

    // delivery information info retrieval
    const deliveryForm = document.getElementById('delivery-form');
    const submitDeliveryInfoButton = document.getElementById('submit-delivery-info');
    const deliveryInfoDisplay = document.getElementById('delivery-info-display');

    let deliveryInfo = null;

    submitDeliveryInfoButton.addEventListener('click', function() {
        // Inputs
        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const customerEmail = document.getElementById('customer-email').value.trim();
        const streetNumber = document.getElementById('street-number').value.trim();
        const streetName = document.getElementById('street-name').value.trim();
        const city = document.getElementById('city').value.trim();
        const postalCode = document.getElementById('postal-code').value.trim();

        // Input validations
        const nameRegex = /^[A-Za-z\s]+$/;
        const phoneRegex = /^[0-9]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const streetNumberRegex = /^[0-9]+$/;
        const cityRegex = /^[A-Za-z\s]+$/;
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;

        if (!nameRegex.test(customerName)) {
            alert('Please enter a valid name (letters only).');
            return;
        }
        if (!phoneRegex.test(customerPhone)) {
            alert('Please enter a valid phone number (numbers only).');
            return;
        }
        if (!emailRegex.test(customerEmail)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!streetNumberRegex.test(streetNumber)) {
            alert('Please enter a valid street number (numbers only).');
            return;
        }
        if (!nameRegex.test(streetName)) {
            alert('Please enter a valid street name (letters only).');
            return;
        }
        if (!cityRegex.test(city)) {
            alert('Please enter a valid city name (letters only).');
            return;
        }
        if (!postalCodeRegex.test(postalCode)) {
            alert('Please enter a valid postal code (format A1A1A1)');
            return;
        }

        // Store delivery info
        deliveryInfo = {
            customerName,
            customerPhone,
            customerEmail,
            streetNumber,
            streetName,
            city,
            postalCode
        };

        // Display deliver info
        displayDeliveryInfo();

        // Clear the form option in case of typos
        deliveryForm.reset();

        console.log('Delivery information submitted:', deliveryInfo);
    });

    // Delivery info function
    function displayDeliveryInfo() {
        deliveryInfoDisplay.innerHTML = `
            <h4>Delivery Information:</h4>
            <p>Name: ${deliveryInfo.customerName}</p>
            <p>Phone: ${deliveryInfo.customerPhone}</p>
            <p>Email: ${deliveryInfo.customerEmail}</p>
            <p>Address: ${deliveryInfo.streetNumber} ${deliveryInfo.streetName}, ${deliveryInfo.city}, ${deliveryInfo.postalCode}</p>
            <button id="edit-delivery-info">Edit Delivery Information</button>
        `;

        // event listener and ability to clear the forms
        const editDeliveryInfoButton = document.getElementById('edit-delivery-info');
        editDeliveryInfoButton.addEventListener('click', function() {
            // Clear the displayed delivery info
            deliveryInfoDisplay.innerHTML = '';
            // Reset deliveryInfo 
            deliveryInfo = null;
        });
    }

    // Order Form
    const orderForm = document.getElementById('order-form');
    const addToOrderButton = document.getElementById('add-to-order');
    const orderTableBody = document.querySelector('#order-table tbody');
    const orderTotalDisplay = document.getElementById('order-total');
    const taxAmountDisplay = document.getElementById('tax-amount');
    const gratuityInput = document.getElementById('gratuity');
    const gratuityTypeSelect = document.getElementById('gratuity-type');
    const gratuityAmountDisplay = document.getElementById('gratuity-amount');
    const deliveryFeeDisplay = document.getElementById('delivery-fee');
    const grandTotalDisplay = document.getElementById('grand-total');
    const placeOrderButton = document.getElementById('place-order');

    let orderItems = [];
    const deliveryFee = 10.00;

    addToOrderButton.addEventListener('click', function() {
        const categorySelect = document.getElementById('category-select');
        const itemSelect = document.getElementById('item-select');
        const itemQuantityInput = document.getElementById('item-quantity');

        const selectedCategory = categorySelect.value;
        const selectedItemTitle = itemSelect.value;
        const selectedItemOption = itemSelect.selectedOptions[0];
        const itemQuantity = parseInt(itemQuantityInput.value);

        // Input validations
        if (!selectedCategory) {
            alert('Please select a category.');
            return;
        }
        if (!selectedItemTitle) {
            alert('Please select an item.');
            return;
        }
        if (isNaN(itemQuantity) || itemQuantity < 1 || itemQuantity > 10) {
            alert('Please enter a valid quantity (1-10).');
            return;
        }

        // Fetch price
        const itemPrice = parseFloat(selectedItemOption.getAttribute('data-price'));

        // Create order item as an object
        const orderItem = {
            title: selectedItemTitle,
            price: itemPrice,
            quantity: itemQuantity,
            total: itemPrice * itemQuantity
        };

        // Add item to orderItems 
        orderItems.push(orderItem);

        // summary tables
        updateOrderSummary();
        updatePaymentSummary();

        // Reset items
        itemSelect.innerHTML = '<option value="">Choose an Item</option>';
        categorySelect.value = '';
        itemQuantityInput.value = 1;

        console.log('Item added to order:', orderItem);
    });

    function updateOrderSummary() {
        // Clear table if needed
        orderTableBody.innerHTML = '';

        let orderTotal = 0;

        orderItems.forEach((item, index) => {
            const row = document.createElement('tr');

            const cellTitle = document.createElement('td');
            cellTitle.textContent = item.title;

            const cellPrice = document.createElement('td');
            cellPrice.textContent = `$${item.price.toFixed(2)}`;

            const cellQuantity = document.createElement('td');
            cellQuantity.textContent = item.quantity;

            const cellTotal = document.createElement('td');
            cellTotal.textContent = `$${item.total.toFixed(2)}`;

            const cellRemove = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.classList.add('remove-item');
            removeButton.setAttribute('data-index', index);
            cellRemove.appendChild(removeButton);

            row.appendChild(cellTitle);
            row.appendChild(cellPrice);
            row.appendChild(cellQuantity);
            row.appendChild(cellTotal);
            row.appendChild(cellRemove);

            orderTableBody.appendChild(row);

            orderTotal += item.total;
        });

        orderTotalDisplay.textContent = orderTotal.toFixed(2);
    }

    // Remove items
    orderTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            orderItems.splice(index, 1);
            updateOrderSummary();
            updatePaymentSummary();
            console.log(`Item at index ${index} removed from order.`);
        }
    });

    // Update summaries
    function updatePaymentSummary() {
        const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        orderTotalDisplay.textContent = orderTotal.toFixed(2);

        const taxAmount = orderTotal * 0.15;
        taxAmountDisplay.textContent = taxAmount.toFixed(2);

        let gratuityAmount = parseFloat(gratuityInput.value);
        if (isNaN(gratuityAmount) || gratuityAmount < 0) {
            gratuityAmount = 0;
        }

        if (gratuityTypeSelect.value === 'percentage') {
            gratuityAmount = orderTotal * (gratuityAmount / 100);
        } else if (gratuityTypeSelect.value !== 'amount') {
            gratuityAmount = 0;
        }

        gratuityAmountDisplay.textContent = gratuityAmount.toFixed(2);

        const grandTotal = orderTotal + taxAmount + gratuityAmount + deliveryFee;
        grandTotalDisplay.textContent = grandTotal.toFixed(2);
    }

    // Event listner and tip options
    gratuityInput.addEventListener('input', updatePaymentSummary);
    gratuityTypeSelect.addEventListener('change', function() {
        if (gratuityTypeSelect.value === 'none') {
            gratuityInput.value = '0.00';
            gratuityInput.disabled = true;
        } else {
            gratuityInput.disabled = false;
        }
        updatePaymentSummary();
    });

    // Place Order
    placeOrderButton.addEventListener('click', function() {
        if (!deliveryInfo) {
            alert('Please give delivery info before placing your order.');
            return;
        }

        if (orderItems.length === 0) {
            alert('Your order is empty.');
            return;
        }

        // Retrieve payment summary information
        const orderTotal = parseFloat(orderTotalDisplay.textContent);
        const taxAmount = parseFloat(taxAmountDisplay.textContent);
        const gratuityAmount = parseFloat(gratuityAmountDisplay.textContent);
        const grandTotal = parseFloat(grandTotalDisplay.textContent);

        // Place the order (well kind of this is pretend)
        const orderDetails = {
            deliveryInfo,
            orderItems,
            paymentSummary: {
                orderTotal,
                taxAmount,
                gratuityAmount,
                deliveryFee,
                grandTotal
            }
        };

        console.log('Order placed:', orderDetails);

        alert('Thank you for your order! Your order has been placed successfully.');

        // Reset forms
        deliveryInfo = null;
        deliveryInfoDisplay.innerHTML = '';
        orderItems = [];
        updateOrderSummary();
        updatePaymentSummary();

        gratuityTypeSelect.value = 'none';
        gratuityInput.value = '0.00';
        gratuityInput.disabled = true;
    });
});