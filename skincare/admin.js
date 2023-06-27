async function fetchProducts() {
  try {
    const response = await fetch(
      "https://648362aef2e76ae1b95c693a.mockapi.io/skincare"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

function generateProductRows(products) {
  const tableBody = document.getElementById("products-table-body");

  tableBody.innerHTML = "";

  products.forEach((product) => {
    const { id, name, price, qty } = product;

    const row = document.createElement("tr");
    row.dataset.id = id;
    row.innerHTML = `
        <td class="product-id">${id}</td>
        <td class="product-name">${name}</td>
        <td class="product-price">${price}</td>
        <td class="product-qty">${qty}</td>
        <td>
          <button class="btn-edit-product" data-id="${id}">Edit</button>
          <button class="btn-delete-product" data-id="${id}">Delete</button>
        </td>
      `;

    tableBody.appendChild(row);
  });
}

function handleEditButtonClick(productId) {
  const productRow = document.querySelector(`tr[data-id="${productId}"]`);
  const nameCell = productRow.querySelector(".product-name");
  const priceCell = productRow.querySelector(".product-price");
  const qtyCell = productRow.querySelector(".product-qty");

  const currentName = nameCell.textContent;
  const currentPrice = parseFloat(priceCell.textContent);
  const currentQty = parseInt(qtyCell.textContent);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = currentName;

  const priceInput = document.createElement("input");
  priceInput.type = "text";
  priceInput.value = `RON ${currentPrice}`;

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.value = currentQty;

  nameCell.textContent = "";
  nameCell.appendChild(nameInput);

  priceCell.textContent = "";
  priceCell.appendChild(priceInput);

  qtyCell.textContent = "";
  qtyCell.appendChild(qtyInput);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("btn-save-product");

  const editButton = productRow.querySelector(".btn-edit-product");
  editButton.parentNode.replaceChild(saveButton, editButton);

  saveButton.addEventListener("click", () => {
    const updatedName = nameInput.value;
    const updatedPrice = parseFloat(priceInput.value.replace("RON ", ""));
    const updatedQty = parseInt(qtyInput.value);

    nameCell.textContent = updatedName;
    priceCell.textContent = `RON ${updatedPrice}`;
    qtyCell.textContent = updatedQty;

    const updatedData = {
      name: updatedName,
      price: updatedPrice,
      qty: updatedQty,
    };

    editProduct(productId, updatedData);
  });
}

function removeProductFromMainPage(productId) {
  const productElement = document.querySelector(`tr[data-id="${productId}"]`);

  if (productElement) {
    productElement.remove();
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(
      `https://648362aef2e76ae1b95c693a.mockapi.io/skincare/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      console.log(`Product with ID ${productId} deleted successfully`);
      removeProductFromMainPage(productId);
    } else {
      console.error(`Failed to delete product with ID ${productId}`);
    }
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
  }
}

function initAdminPage() {
  fetchProducts()
    .then((products) => {
      generateProductRows(products);

      const editButtons = document.querySelectorAll(".btn-edit-product");
      editButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const productId = button.dataset.id;
          handleEditButtonClick(productId);
        });
      });

      const deleteButtons = document.querySelectorAll(".btn-delete-product");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const productId = button.dataset.id;
          deleteProduct(productId);
        });
      });
    })
    .catch((error) => {
      console.error("Error initializing admin page:", error);
    });
}

window.addEventListener("DOMContentLoaded", initAdminPage);
