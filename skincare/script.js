let products = [];

function displayProducts() {
  fetch("https://648362aef2e76ae1b95c693a.mockapi.io/skincare")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    })
    .then((fetchedProducts) => {
      products = fetchedProducts;
      const productsContainer = document.getElementById("products-container");
      productsContainer.innerHTML = "";

      const productGrid = document.createElement("div");
      productGrid.classList.add("product-grid");

      products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="product-details">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="product-info">
              <p>Price: ${product.price}</p>
              <p>Qty: ${product.qty}</p>
            </div>
          </div>
        `;

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.classList.add("add-to-cart-button");

        addToCartButton.addEventListener("click", () => {
          addToCart(product);
        });

        productCard.appendChild(addToCartButton);
        productGrid.appendChild(productCard);

        if ((index + 1) % 4 === 0) {
          productGrid.appendChild(document.createElement("br"));
        }
      });

      productsContainer.appendChild(productGrid);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = cartCount;
}

function addToCart(product) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const existingProduct = cartItems.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      qty: 1,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  updateCartCount();
  console.log("Product added to cart:", product);
}

window.addEventListener("DOMContentLoaded", () => {
  displayProducts();
  updateCartCount();
});
