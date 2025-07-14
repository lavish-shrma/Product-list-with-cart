function copyright() {
  const date = document.getElementById('date');
  const year = new Date().getFullYear();
  if (date) {
    date.innerHTML = year;
  };
};

async function loadJson(filepath) {
  try {
    const response = await fetch(filepath);
    if (!response) {
      throw new Error(`Network response was not ok`);
    };
    const date = await response.json();
    return date;
  } catch (error) {
    throw new Error(`Error loading JSON ${error.message}`);
  };
};

function toggleButton() {
  const gridWrap = document.querySelector(".grid-wrap")

  // use event delagation to handle clicks on .cart-buttons
  gridWrap.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-button")) {
      const cartButton = e.target;
      const cartPlusMinus = cartButton.nextElementSibling;

      if (cartPlusMinus && cartPlusMinus.classList.contains("cart-plus-minus")) {
        if (cartButton.classList.contains("active")) {
          cartButton.classList.remove("active");
          cartPlusMinus.classList.add("active");
        } else {
          cartButton.classList.add("active");
          cartPlusMinus.classList.remove("active");
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  copyright();
  loadJson("data.json")
    .then((data) => {
      const gridWrap = document.querySelector(".grid-wrap");
      data.forEach((item) => {
        const article = document.createElement("article");
        article.classList.add('grid-item');

        article.innerHTML = `
                <div class="button-container">
                        <figure class="image-container">
                        <img
                            src="${item.image.desktop}"
                            alt="${item.name}"
                        />
                        </figure>
                        <button class="cart-button active">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="20"
                            fill="none"
                            viewBox="0 0 21 20"
                        >
                            <g fill="#C73B0F" clip-path="url(#a)">
                            <path
                                d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"
                            />
                            <path
                                d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"
                            />
                            </g>
                            <defs>
                            <clipPath id="a">
                                <path fill="#fff" d="M.333 0h20v20h-20z" />
                            </clipPath>
                            </defs>
                        </svg>
                        Add to Cart
                        </button>
                        <div class="cart-plus-minus">
                        <span class="access-hidden">Cart Quantity</span>
                        <button class="more-less">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="2"
                            fill="none"
                            viewBox="0 0 10 2"
                            >
                            <path fill="" d="M0 .375h10v1.25H0V.375Z" />
                            </svg>
                        </button>
                        <span class="item-quantity">1</span>
                        <button class="more-less">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            fill="none"
                            viewBox="0 0 10 10"
                            >
                            <path
                                fill=""
                                d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                            />
                            </svg>
                        </button>
                        </div>
                    </div>
                    <div class="item-category">${item.category}</div>
                    <h3 class="tertiary-header">${item.name}</h3>
                    <div class="item-price">${item.price}</div>
                `;
        gridWrap.appendChild(article);
      });
      toggleButton();
    })
    .catch(error => {
      console.log(`Error laoding JSON data: `, error);
    });
});

/* <article class="grid-item">
              <div class="button-container">
                <figure class="image-container">
                  <img
                    src="assets/images/image-baklava-desktop.jpg"
                    alt="image placeholder text"
                  />
                </figure>
                <button class="cart-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="20"
                    fill="none"
                    viewBox="0 0 21 20"
                  >
                    <g fill="#C73B0F" clip-path="url(#a)">
                      <path
                        d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"
                      />
                      <path
                        d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"
                      />
                    </g>
                    <defs>
                      <clipPath id="a">
                        <path fill="#fff" d="M.333 0h20v20h-20z" />
                      </clipPath>
                    </defs>
                  </svg>
                  Add to Cart
                </button>
                <div class="cart-plus-minus active">
                  <span class="access-hidden">Cart Quantity</span>
                  <button class="more-less">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="2"
                      fill="none"
                      viewBox="0 0 10 2"
                    >
                      <path fill="" d="M0 .375h10v1.25H0V.375Z" />
                    </svg>
                  </button>
                  <span class="item-quantity">1</span>
                  <button class="more-less">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="none"
                      viewBox="0 0 10 10"
                    >
                      <path
                        fill=""
                        d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="item-category">Creme Brulee</div>
              <h3 class="tertiary-header">Vanilla Bean Creme Brulee</h3>
              <div class="item-price">$7.00</div>
            </article> 
*/