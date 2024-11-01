// Description: JavaScript functions for populating the cards from the dropdown of the menu items
// Authors: Chris Morrison, Steve Morrison - SD12
// Date(s): October 23 - Novemver 1, 2024
// Version 1.0

// Fetch menu items from JSON
fetch('../json/menu-items.json')
    .then(response => response.json())
    .then(data => {
        const menuItemsData = data.menuItems;
        const categorySelect = document.getElementById('menu-category-select');
        const menuItemsContainer = document.getElementById('menu-items-container');

        // Function to display menu items based on selected category
        function displayMenuItems(category) {
            menuItemsContainer.innerHTML = '';
            const filteredItems = menuItemsData.filter(item => item.category === category);

            filteredItems.forEach(item => {
                const menuItemCard = document.createElement('div');
                menuItemCard.classList.add('menu-item-card');

                const itemImage = document.createElement('img');
                itemImage.src = `../menu_images/${item.image}`;
                itemImage.alt = item.title;

                const itemContent = document.createElement('div');
                itemContent.classList.add('menu-item-content');

                const itemTitle = document.createElement('h3');
                itemTitle.textContent = item.title;

                const itemDescription = document.createElement('p');
                itemDescription.textContent = item.description;

                const itemPrice = document.createElement('p');
                itemPrice.classList.add('price');
                itemPrice.textContent = `Price: $${item.price.toFixed(2)}`;

                itemContent.appendChild(itemTitle);
                itemContent.appendChild(itemDescription);
                itemContent.appendChild(itemPrice);

                if (item.ingredients) {
                    const itemIngredients = document.createElement('p');
                    itemIngredients.classList.add('ingredients');
                    itemIngredients.textContent = `Ingredients: ${item.ingredients.join(', ')}`;
                    itemContent.appendChild(itemIngredients);
                }

                if (item.allergyInfo) {
                    const itemAllergyInfo = document.createElement('p');
                    itemAllergyInfo.classList.add('allergy-info');
                    itemAllergyInfo.textContent = `Allergy Info: ${item.allergyInfo}`;
                    itemContent.appendChild(itemAllergyInfo);
                }

                if (item.size) {
                    const itemSize = document.createElement('p');
                    itemSize.textContent = `Size: ${item.size}`;
                    itemContent.appendChild(itemSize);
                }

                menuItemCard.appendChild(itemImage);
                menuItemCard.appendChild(itemContent);

                menuItemsContainer.appendChild(menuItemCard);
            });
        }

        // Event listener listening when category is picked by user
        categorySelect.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            if (selectedCategory) {
                displayMenuItems(selectedCategory);
            } else {
                menuItemsContainer.innerHTML = '';
            }
        });
    })
    .catch(error => console.error('Error fetching menu items:', error));

