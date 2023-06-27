function displayCartItems() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("cart-table");

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
    <th class="table-header-cell">Product</th>
    <th class="table-header-cell">Price</th>
    <th class="table-header-cell">Quantity</th>
    <th class="table-header-cell">Total</th>
    <th class="table-header-cell">Actions</th>
  `;
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  const cartItems = JSON.parse(localStorage.getItem("cartItems"));

  if (!cartItems || cartItems.length === 0) {
    cartContainer.textContent = "Your cart is empty.";
    return;
  }

  cartItems.forEach((item) => {
    const { id, name, price, qty } = item;
    const priceValue = parseFloat(price.replace("RON ", ""));
    const total = priceValue * qty;

    console.log("price:", price);
    console.log("qty:", qty);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${price}</td>
      <td>${qty}</td>
      <td>${total}</td>
      <td>
        <button class="btn-increase-quantity" data-id="${id}">+</button>
        <button class="btn-decrease-quantity" data-id="${id}">-</button>
        <button class="btn-remove-product" data-id="${id}">Remove</button>
      </td>
    `;

    const increaseBtn = row.querySelector(".btn-increase-quantity");
    const decreaseBtn = row.querySelector(".btn-decrease-quantity");
    const removeBtn = row.querySelector(".btn-remove-product");

    increaseBtn.addEventListener("click", () => {
      adjustQuantity(id, 1);
    });

    decreaseBtn.addEventListener("click", () => {
      adjustQuantity(id, -1);
    });

    removeBtn.addEventListener("click", () => {
      removeProduct(id);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  cartContainer.appendChild(table);
  console.log(cartItems);
}

window.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
});
function removeProduct(productId) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const updatedCartItems = cartItems.filter((item) => item.id !== productId);

  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  displayCartItems();
}

function adjustQuantity(productId, amount) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const targetProduct = cartItems.find((item) => item.id === productId);

  if (targetProduct) {
    targetProduct.qty += amount;

    if (targetProduct.qty <= 0) {
      removeProduct(productId);
      return;
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    displayCartItems();
  }
}
function placeOrder() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const totalPrice = cartItems.reduce(
    (accumulator, item) =>
      accumulator + item.qty * parseFloat(item.price.replace("RON ", "")),
    0
  );

  const orderDetails = {
    items: cartItems,
    total: totalPrice,
  };

  alert("Your order has been placed!");

  localStorage.removeItem("cartItems");

  displayCartItems();
}

window.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  const placeOrderBtn = document.getElementById("place-order-btn");
  placeOrderBtn.addEventListener("click", placeOrder);
});
