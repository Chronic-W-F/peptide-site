const products = [
      {
        id: "formula-alpha",
        name: "Formula Alpha",
        category: "Peptides",
        format: "Vial",
        size: "10 mg",
        sku: "NXL-PA-010",
        price: 59,
        badge: "Featured",
        art: "vial",
        description:
          "Placeholder product copy for a peptide-format item. Final specifications, intended-use language and supporting documents will replace this text.",
        storage: "Placeholder storage guidance",
        documents: "Batch document available"
      },
      {
        id: "formula-beta",
        name: "Formula Beta",
        category: "Peptides",
        format: "Vial",
        size: "5 mg",
        sku: "NXL-PB-005",
        price: 42,
        badge: "New",
        art: "vial",
        description:
          "Sample copy showing how a second product can appear in the catalog without making health or treatment claims.",
        storage: "Placeholder storage guidance",
        documents: "Batch document available"
      },
      {
        id: "skin-complex",
        name: "Skin Complex",
        category: "Skincare",
        format: "Serum",
        size: "30 mL",
        sku: "NXL-SC-030",
        price: 48,
        badge: "Popular",
        art: "bottle",
        description:
          "A sample premium skincare product page with room for ingredients, directions, size and approved cosmetic copy.",
        storage: "Store in a cool, dry place",
        documents: "Manufacturer document"
      },
      {
        id: "recovery-cream",
        name: "Recovery Cream",
        category: "Skincare",
        format: "Cream",
        size: "50 mL",
        sku: "NXL-RC-050",
        price: 39,
        badge: "",
        art: "bottle",
        description:
          "Placeholder product copy for a topical cream. Replace with approved ingredients, directions and labeling.",
        storage: "Store at room temperature",
        documents: "Manufacturer document"
      },
      {
        id: "daily-wellness",
        name: "Daily Wellness",
        category: "Wellness",
        format: "Capsules",
        size: "60 count",
        sku: "NXL-WD-060",
        price: 34,
        badge: "",
        art: "box",
        description:
          "Placeholder consumer wellness product with room for approved facts, warnings and supporting information.",
        storage: "Store in a cool, dry place",
        documents: "Specification sheet"
      },
      {
        id: "travel-case",
        name: "Insulated Travel Case",
        category: "Accessories",
        format: "Storage",
        size: "Compact",
        sku: "NXL-AC-100",
        price: 24,
        badge: "",
        art: "box",
        description:
          "A sample accessory listing showing how non-consumable products can be included in the same storefront.",
        storage: "Not applicable",
        documents: "Not applicable"
      }
    ];

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
      if (product.art === "vial") {
        return `
          <div class="mini-vial">
            <div class="cap"></div>
            <div class="glass">
              <div class="label">${product.name.toUpperCase().replace(" ", "<br>")}</div>
            </div>
          </div>
        `;
      }

      if (product.art === "bottle") {
        return `<div class="dropper-bottle"></div>`;
      }

      return `<div class="product-box">NEXA LABS<br>${product.category.toUpperCase()}</div>`;
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
          product.sku
        ]
          .join(" ")
          .toLowerCase();

        return (
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

      if (!filtered.length) {
        productGrid.innerHTML =
          '<div class="empty-state">No placeholder products match those filters.</div>';
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
                    style="all: unset; cursor: pointer;"
                    onclick="openProduct('${product.id}')"
                  >
                    ${product.name}
                  </button>
                </h3>

                <p>${product.description}</p>

                <div class="product-bottom">
                  <span class="price">${money(product.price)}</span>
                  <button class="add-button" onclick="addToCart('${product.id}')">
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
        state.cart.push({ id: productId, quantity: 1 });
      }

      saveCart();
      showToast("Added to the demo cart.");
    }

    function removeFromCart(productId) {
      state.cart = state.cart.filter((item) => item.id !== productId);
      saveCart();
    }

    function renderCart() {
      const count = state.cart.reduce((total, item) => total + item.quantity, 0);
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
          const product = products.find((entry) => entry.id === item.id);

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
      const product = products.find((entry) => entry.id === productId);

      if (!product) {
        return;
      }

      modalTitle.textContent = product.name;
      modalDescription.textContent = product.description;

      modalSpecs.innerHTML = `
        <div><strong>Category</strong><br />${product.category}</div>
        <div><strong>Format</strong><br />${product.format}</div>
        <div><strong>Size</strong><br />${product.size}</div>
        <div><strong>SKU</strong><br />${product.sku}</div>
        <div><strong>Storage</strong><br />${product.storage}</div>
        <div><strong>Documents</strong><br />${product.documents}</div>
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

    searchInput.addEventListener("input", renderProducts);
    categoryFilter.addEventListener("change", renderProducts);
    sortFilter.addEventListener("change", renderProducts);

    document.getElementById("cartButton").addEventListener("click", openCart);
    document.getElementById("closeCartButton").addEventListener("click", closeCart);
    document.getElementById("drawerBackdrop").addEventListener("click", closeCart);

    document.getElementById("closeModalButton").addEventListener("click", closeProduct);

    productModal.addEventListener("click", (event) => {
      if (event.target === productModal) {
        closeProduct();
      }
    });

    document.getElementById("checkoutButton").addEventListener("click", () => {
      showToast("Checkout is intentionally disabled in this concept.");
    });

    document.querySelectorAll("[data-demo-action]").forEach((button) => {
      button.addEventListener("click", () => {
        showToast("This action will be connected after the direction is approved.");
      });
    });

    document.getElementById("menuButton").addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCart();
        closeProduct();
      }
    });

    renderProducts();
    renderCart();
