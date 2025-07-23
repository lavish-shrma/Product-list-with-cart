function copyright() {
  const date = document.getElementById("date");
  const year = new Date().getFullYear();
  if (date) {
    date.innerHTML = year;
  }
}

async function loadJson(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error loading JSON: ${error.message}`);
  }
}

/**
 * When I click on the Add to Cart button,
 * I want to add an active class to the plus/minus div
 * and remove the active class from the add to cart button.
 */
function toggleButton() {
  const gridWrap = document.querySelector(".grid-wrap");

  // Use event delegation to handle clicks on .cart-button
  gridWrap.addEventListener("click", (e) => {
    // Look for the closest element with the class "cart-button"
    const cartButton = e.target.closest(".cart-button");

    if (cartButton) {
      // Use nextElementSibling to get the cart-plus-minus directly after the button
      const cartPlusMinus = cartButton.nextElementSibling;

      // const cartSidebar = document.querySelector(".side-wrap");
      // console.log(cartSidebar, "the sidebar is available");

      if (cartPlusMinus) {
        if (cartButton.classList.contains("active")) {
          // Remove active from the button, add it to cart-plus-minus
          cartButton.classList.remove("active");
          cartPlusMinus.classList.add("active");

          // Add item to the cart
          const gridItem = cartButton.closest(".grid-item");
          addToCart(gridItem);
        }
      }
    }
  });
}

/**
 * When I click the add to cart button,
 * I want to add the item data to the cart/sidebar.
 */
function addToCart(gridItem) {
  // Get item details from gridItem
  const itemPhoto = gridItem.querySelector(".image-container img").src;
  const itemName = gridItem.querySelector(".tertiary-header").innerText;
  const itemPrice = parseFloat(gridItem.querySelector(".item-price").innerText.replace("$", ""));
  let currentQuantity = 1;

  // Create the new cart item markup
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-label", `${itemName}`);
  cartItem.innerHTML = `
	<div class="cart-quantity">
      <p class="cart-heading">${itemName}</p>
      <div class="quantity-wrap">
		<span class="quantity">${currentQuantity}x</span>
        <span class="each-item">@$${itemPrice.toFixed(2)}</span>
        <span class="item-total">$${itemPrice.toFixed(2)}</span>
      </div>
    </div>
    <button class="remove-item" aria-label="Remove ${itemName} from Cart">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" /></svg>
    </button>
  `;

  // Create the new cart popover item markup
  const cartItemPopover = document.createElement("article");
  cartItemPopover.classList.add("cart-item-popover");
  cartItemPopover.setAttribute("data-label", `${itemName}`);
  cartItemPopover.innerHTML = `
	<figure class="image-container">
		<img src="${itemPhoto}" alt="${itemName}" />
	</figure>
	<div class="cart-quantity">
      <p class="cart-heading">${itemName}</p>
      <div class="quantity-wrap">
		<span class="quantity">${currentQuantity}x</span>
        <span class="each-item">@ $${itemPrice.toFixed(2)}</span>
      </div>
    </div>
	<div class="item-total">$${itemPrice.toFixed(2)}</div>
  `;

  // Append the new cart item to the sidebar
  const cartSidebar = document.querySelector(".cart-container");
  const cartPopover = document.querySelector(".cart-popover");
  if (cartSidebar) {
    cartSidebar.appendChild(cartItem);
    cartPopover.appendChild(cartItemPopover);
  }

  const cartButton = gridItem.querySelector(".cart-button");
  const cartPlusMinus = gridItem.querySelector(".cart-plus-minus");
  const gridItemQuantity = gridItem.querySelector(".item-quantity");
  const dataGridItem = gridItem.getAttribute(`${itemName}`);
  const dataCartItem = cartItem.getAttribute(`${itemName}`);
  updateCartItemCount();

  // Add functionality to remove the item from the cart
  const removeButton = cartItem.querySelector(".remove-item");
  const itemQuantitySpan = cartItem.querySelector(".quantity");
  const itemTotalSpan = cartItem.querySelector(".item-total");
  const itemQuantitySpanPopover = cartItemPopover.querySelector(".quantity");
  const itemTotalSpanPopover = cartItemPopover.querySelector(".item-total");

  removeButton.addEventListener("click", () => {
    cartSidebar.removeChild(cartItem);
    cartPopover.removeChild(cartItemPopover);
    updateCartItemCount();

    if (dataGridItem == dataCartItem) {
      cartPlusMinus.classList.remove("active");
      cartButton.classList.add("active");
      gridItemQuantity.innerHTML = 1;
    }
  });

  // Add functionality for increment and decrement quantity
  const incrementButton = gridItem.querySelector(".increment");
  const decrementButton = gridItem.querySelector(".decrement");

  incrementButton.addEventListener("click", () => {
    currentQuantity++;
    itemQuantitySpan.innerText = `${currentQuantity}x`;
    itemTotalSpan.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
    itemQuantitySpanPopover.innerText = `${currentQuantity}x`;
    itemTotalSpanPopover.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
    updateCartItemCount();
  });

  decrementButton.addEventListener("click", () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      itemQuantitySpan.innerText = `${currentQuantity}x`;
      itemTotalSpan.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
      itemQuantitySpanPopover.innerText = `${currentQuantity}x`;
      itemTotalSpanPopover.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
      updateCartItemCount();
    }
  });
}

/**
 * Functionality to increment and decrement the item quantity in the cart.
 */
function setupCartPlusMinus() {
  const gridWrap = document.querySelector(".grid-wrap");

  if (!gridWrap) {
    console.error("gridWrap not found");
    return;
  }

  gridWrap.addEventListener("click", (e) => {
    const decrementButton = e.target.closest(".decrement");
    const incrementButton = e.target.closest(".increment");

    if (decrementButton) {
      itemQuantitySpan = decrementButton.nextElementSibling;
      if (itemQuantitySpan && itemQuantitySpan.classList.contains("item-quantity")) {
        let quantity = parseInt(itemQuantitySpan.innerText);
        if (quantity > 1) {
          itemQuantitySpan.innerText = quantity - 1;
        }
      }
    }

    if (incrementButton) {
      itemQuantitySpan = incrementButton.previousElementSibling;
      if (itemQuantitySpan && itemQuantitySpan.classList.contains("item-quantity")) {
        let quantity = parseInt(itemQuantitySpan.innerText);
        itemQuantitySpan.innerText = quantity + 1;
      }
    }
  });
}

function updateCartItemCount() {
  const cartItems = document.querySelectorAll(".cart-item");
  const cartCountElement = document.querySelector(".cart-count");
  const cartTotalAmount = document.querySelector(".total-amount");
  const cartTotalAmountPopover = document.querySelector(".total-amount-popover");
  let totalQuantity = 0;
  let totalAmount = 0;

  cartItems.forEach((item) => {
    const quantityText = item.querySelector(".quantity").innerText;
    const quantity = parseInt(quantityText);
    totalQuantity += quantity;

    const totalAmtText = item.querySelector(".item-total").innerText.replace("$", "");
    const total = parseFloat(totalAmtText);
    totalAmount += total;
  });

  if (cartCountElement) {
    cartCountElement.innerText = `Your Cart (${totalQuantity})`;
  }

  if (cartTotalAmount) {
    cartTotalAmount.innerHTML = `$${totalAmount.toFixed(2)}`;
    cartTotalAmountPopover.innerHTML = `$${totalAmount.toFixed(2)}`;
  }
}

function clearCart() {
  const clearCartButton = document.getElementById("clear-cart");

  clearCartButton.addEventListener("click", () => {
    // Select the cart items at the time of the click event
    const cartItems = document.querySelectorAll(".cart-item");
    const cartItemPopovers = document.querySelectorAll(".cart-item-popover");
    console.log(cartItems.length);

    // Loop through all cart items and remove them
    if (cartItems.length >= 1) {
      cartItems.forEach((item) => item.remove());
      cartItemPopovers.forEach((item) => item.remove());
    }

    // Reset grid items
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((gridItem) => {
      const cartButton = gridItem.querySelector(".cart-button");
      const cartPlusMinus = gridItem.querySelector(".cart-plus-minus");
      const gridItemQuantity = gridItem.querySelector(".item-quantity");

      // Reset button classes and quantity
      cartButton.classList.add("active");
      cartPlusMinus.classList.remove("active");
      gridItemQuantity.innerHTML = 1;
    });

    // Update the cart item count and total amount after clearing
    updateCartItemCount();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  copyright();
  loadJson("data.json")
    .then((data) => {
      const gridWrap = document.querySelector(".grid-wrap");
      data.forEach((item) => {
        const article = document.createElement("article");
        article.classList.add("grid-item");
        article.setAttribute("data-label", `${item.name}`);
        let itemQuantity = 1;
        article.innerHTML = `
					<div class="button-container">
						<figure class="image-container">
							<img src="${item.image.desktop}" alt="${item.name}" />
						</figure>
						<button class="cart-button active" aria-label="Add ${item.name} to Cart">
							<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z" /><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z" /></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z" /></clipPath></defs></svg>
							Add to Cart
						</button>
						<div class="cart-plus-minus">
							<span class="access-hidden">${item.name} Quantity</span>
							<button class="more-less decrement" aria-label="Decrease Quantity">
								<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="" d="M0 .375h10v1.25H0V.375Z" /></svg>
							</button>
							<span class="item-quantity">${itemQuantity}</span>
							<button class="more-less increment" aria-label="Increase Quantity">
								<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" /></svg>
							</button>
						</div>
					</div>
					<div class="item-category">${item.category}</div>
					<h3 class="tertiary-header">${item.name}</h3>
					<div class="item-price">$${item.price.toFixed(2)}</div>
				`;
        gridWrap.appendChild(article);
      });
      toggleButton();
      setupCartPlusMinus();
      updateCartItemCount();
      clearCart();
    })
    .catch((error) => {
      console.error("Error loading JSON data: ", error);
    });
});