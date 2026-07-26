let products = [];

const state = {
  cart: JSON.parse(localStorage.getItem("nexa-demo-cart") || "[]")
};

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const productModal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalSpecs = document.getElementById("modalSpecs");
const modalAddButton = document.getElementById("modalAddButton");
const toast = document.getElementById("toast");
const navLinks = document.getElementById("navLinks");

const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);

function productArtwork(product) {
  if (product.image) {
    return `
      <img
        src="${product.image}"
        alt="${product.name}"
        style="position:relative;z-index:2;width:100%;height:250px;object-fit:contain;padding:24px;"
      />
    `;
  }

  if (product.category === "Peptides" || product.format === "Vial") {
    return `
      <div class="mini-vial">
        <div class="cap"></div>
        <div class="glass">
          <div class="label">${product.name.toUpperCase().replace(" ", "<br>")}</div>
        </div>
      </div>
    `;
  }

  if (
    product.category === "Skincare" ||
    product.format === "Serum" ||
    product.format === "Cream"
  ) {
    return `<div class="dropper-bottle"></div>`;
  }

  return `
    <div class="product-box">
      NEXA LABS<br />
      ${product.category.toUpperCase()}
    </div>
  `;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let filtered = products.filter((product) => {
    const searchableText = [
      product.name,
      product.category,
      product.format,
      product.sku,
      product.description
    ]
      .join(" ")
      .toLowerCase();

    return (
      product.inStock !== false &&
      (!query || searchableText.includes(query)) &&
      (!category || product.category === category)
    );
  });

  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sort === "featured") {
    filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  if (!filtered.length) {
    productGrid.innerHTML =
      '<div class="empty-state">No products match those filters.</div>';
    return;
  }

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            ${
              product.badge
                ? `<span class="product-badge">${product.badge}</span>`
                : ""
            }

            ${productArtwork(product)}
          </div>

          <div class="product-info">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>${product.size}</span>
            </div>

            <h3>
              <button
                style="all:unset;cursor:pointer"
                onclick="openProduct('${product.id}')"
              >
                ${product.name}
              </button>
            </h3>

            <p>${product.description}</p>

            <div class="product-bottom">
              <span class="price">${money(product.price)}</span>
              <button
                class="add-button"
                onclick="addToCart('${product.id}')"
              >
                Add to cart
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function saveCart() {
  localStorage.setItem("nexa-demo-cart", JSON.stringify(state.cart));
  renderCart();
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  showToast("Added to the demo cart.");
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  saveCart();
}

function renderCart() {
  const validItems = state.cart.filter((item) =>
    products.some((product) => product.id === item.id)
  );

  if (validItems.length !== state.cart.length) {
    state.cart = validItems;
    localStorage.setItem("nexa-demo-cart", JSON.stringify(state.cart));
  }

  const count = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cartCount.textContent = count;

  if (!state.cart.length) {
    cartItems.innerHTML =
      '<div class="empty-state">The demonstration cart is empty.</div>';
    cartTotal.textContent = money(0);
    return;
  }

  let total = 0;

  cartItems.innerHTML = state.cart
    .map((item) => {
      const product = products.find(
        (entry) => entry.id === item.id
      );

      if (!product) {
        return "";
      }

      total += product.price * item.quantity;

      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong><br />
            <small>${item.quantity} × ${money(product.price)}</small>
          </div>

          <button
            class="remove-button"
            onclick="removeFromCart('${product.id}')"
          >
            Remove
          </button>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = money(total);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

function openProduct(productId) {
  const product = products.find(
    (entry) => entry.id === productId
  );

  if (!product) {
    return;
  }

  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;

  const documentDisplay = product.document
    ? `<a href="${product.document}" target="_blank" rel="noopener">View document</a>`
    : "Not currently listed";

  modalSpecs.innerHTML = `
    <div><strong>Category</strong><br />${product.category}</div>
    <div><strong>Format</strong><br />${product.format}</div>
    <div><strong>Size</strong><br />${product.size}</div>
    <div><strong>SKU</strong><br />${product.sku}</div>
    <div><strong>Storage</strong><br />${product.storage}</div>
    <div><strong>Documents</strong><br />${documentDisplay}</div>
  `;

  modalAddButton.onclick = () => addToCart(product.id);
  productModal.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeProduct() {
  productModal.classList.remove("open");
  document.body.classList.remove("modal-open");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

async function loadProducts() {
  productGrid.innerHTML =
    '<div class="empty-state">Loading products...</div>';

  try {
    const response = await fetch(
      "00_PRODUCT_UPDATES_HERE/products.json",
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`Product file returned ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("products.json must contain a JSON array");
    }

    products = data;
    renderProducts();
    renderCart();
  } catch (error) {
    console.error("Unable to load products:", error);

    productGrid.innerHTML = `
      <div class="empty-state">
        Products could not be loaded. Check
        <strong>00_PRODUCT_UPDATES_HERE/products.json</strong>
        for missing commas, quotation marks or brackets.
      </div>
    `;
  }
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

document
  .getElementById("cartButton")
  .addEventListener("click", openCart);

document
  .getElementById("closeCartButton")
  .addEventListener("click", closeCart);

document
  .getElementById("drawerBackdrop")
  .addEventListener("click", closeCart);

document
  .getElementById("closeModalButton")
  .addEventListener("click", closeProduct);

productModal.addEventListener("click", (event) => {
  if (event.target === productModal) {
    closeProduct();
  }
});

document
  .getElementById("checkoutButton")
  .addEventListener("click", () => {
    showToast(
      "Checkout is intentionally disabled in this concept."
    );
  });

document
  .querySelectorAll("[data-demo-action]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      showToast(
        "This action will be connected after the direction is approved."
      );
    });
  });

document
  .getElementById("menuButton")
  .addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeProduct();
  }
});

loadProducts();
