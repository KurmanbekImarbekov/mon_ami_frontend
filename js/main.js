(function () {
  "use strict";

  var DELIVERY_FEE = 180;
  var SERVICE_FEE = 0;
  var DELIVERY_ETA = "35-45 мин";
  var PICKUP_ETA = "20-30 мин";
  var CART_KEY = "monamiCart";
  var FAVORITES_KEY = "monamiFavorites";
  var PROMO_KEY = "monamiPromo";

  var menu = window.MENU_DATA || { categories: [], products: [] };
  var categories = menu.categories.slice().sort(function (a, b) {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
  var categoryById = new Map(
    categories.map(function (category) {
      return [category.id, category];
    }),
  );
  var categoryOrder = new Map(
    categories.map(function (category, index) {
      return [category.id, index];
    }),
  );
  var products = menu.products.slice().sort(sortProducts);
  var productById = new Map(
    products.map(function (product) {
      return [product.id, product];
    }),
  );

  var state = {
    activeCategory: "all",
    query: "",
    cart: normalizeCart(readJson(CART_KEY, [])),
    favorites: new Set(readJson(FAVORITES_KEY, [])),
    promoCode: localStorage.getItem(PROMO_KEY) || "",
    dialogProductId: null,
    dialogQuantity: 1,
  };

  var els = {};
  var toastTimer = null;

  var categoryImages = {
    "cat-breakfast":
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=80",
    "cat-appetizers":
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    "cat-soups":
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
    "cat-salads":
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    "cat-burgers":
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    "cat-pizza":
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
    "cat-pasta":
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80",
    "cat-main-dishes":
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    "cat-hot-dishes":
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80",
    "cat-side-dishes":
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
    "cat-bakery":
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    "cat-cookies":
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
    "cat-desserts":
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    "cat-sauces":
      "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=900&q=80",
    "cat-barista":
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
    "cat-coffee":
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    "cat-tea":
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
    "cat-cold-tea":
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
    "cat-lemonades":
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
    "cat-cocktails":
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=80",
    "cat-fresh-smoothies":
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80",
    "cat-milkshakes":
      "https://images.unsplash.com/photo-1572490122747-3e9197aa8a8e?auto=format&fit=crop&w=900&q=80",
    "cat-soft-drinks":
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80",
    "cat-tobacco":
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "cat-cigar-tobacco":
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "cat-cabins":
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  };

  var nameImages = [
    {
      test: /стейк|рибай|томагавк|тибон|вырезка/i,
      url: categoryImages["cat-hot-dishes"],
    },
    {
      test: /кофе|эспрессо|капучино|латте|раф|американо/i,
      url: categoryImages["cat-coffee"],
    },
    { test: /чай|улун|сенча|жасмин/i, url: categoryImages["cat-tea"] },
    {
      test: /десерт|эклер|тарт|шарлот|карамель|шоколад/i,
      url: categoryImages["cat-desserts"],
    },
    { test: /салат|нисуа|авокадо/i, url: categoryImages["cat-salads"] },
    { test: /суп|биск|том ям|крем/i, url: categoryImages["cat-soups"] },
    {
      test: /паста|спагетти|равиоли|фетучини|ригатони/i,
      url: categoryImages["cat-pasta"],
    },
    {
      test: /рыба|форель|сибас|кревет|мидии|лосось|семга/i,
      url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
    },
    {
      test: /лимонад|смузи|фреш|коктейль|напиток|сок|cola|sprite|red bull|schweppes/i,
      url: categoryImages["cat-fresh-smoothies"],
    },
  ];

  var pdfImageRanges = {
    "cat-breakfast": range(1, 15),
    "cat-appetizers": range(16, 19),
    "cat-soups": range(20, 26),
    "cat-salads": range(27, 34),
    "cat-burgers": range(35, 40),
    "cat-pizza": range(41, 48),
    "cat-pasta": range(49, 53),
    "cat-main-dishes": range(54, 60),
    "cat-hot-dishes": range(61, 65),
    "cat-side-dishes": range(66, 69),
    "cat-bakery": range(70, 75),
    "cat-cookies": range(76, 81),
    "cat-desserts": range(82, 88),
    "cat-sauces": range(89, 100),
    "cat-barista": range(101, 112),
    "cat-coffee": range(113, 118),
    "cat-tea": range(119, 120),
    "cat-cold-tea": range(121, 124),
    "cat-lemonades": range(125, 132),
    "cat-cocktails": range(133, 137),
    "cat-fresh-smoothies": range(138, 142),
    "cat-milkshakes": range(137, 142),
    "cat-soft-drinks": range(143, 152),
    "cat-tobacco": range(153, 163),
    "cat-cigar-tobacco": range(164, 166),
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    hydrateCheckoutDraft();
    renderStats();
    renderCategories();
    renderFeatured();
    renderProducts();
    renderCart();
    renderCheckoutSummary();
    syncPromoInput();
    bindEvents();
    revealOnScroll();
    setTimeout(function () {
      if (els.loader) els.loader.classList.add("is-hidden");
    }, 450);
  }

  function cacheElements() {
    els.loader = document.getElementById("siteLoader");
    els.navbar = document.getElementById("navbar");
    els.mobileMenuButton = document.getElementById("mobileMenuButton");
    els.mobilePanel = document.getElementById("mobilePanel");
    els.globalSearch = document.getElementById("globalSearch");
    els.menuSearch = document.getElementById("menuSearch");
    els.categoryStrip = document.getElementById("categoryStrip");
    els.productsGrid = document.getElementById("productsGrid");
    els.resultsLine = document.getElementById("resultsLine");
    els.featuredRow = document.getElementById("featuredRow");
    els.cartButton = document.getElementById("cartButton");
    els.closeCartButton = document.getElementById("closeCartButton");
    els.cartDrawer = document.getElementById("cartDrawer");
    els.scrim = document.getElementById("scrim");
    els.cartCount = document.getElementById("cartCount");
    els.cartTitle = document.getElementById("cartTitle");
    els.cartItems = document.getElementById("cartItems");
    els.cartSummary = document.getElementById("cartSummary");
    els.subtotalValue = document.getElementById("subtotalValue");
    els.deliveryValue = document.getElementById("deliveryValue");
    els.serviceValue = document.getElementById("serviceValue");
    els.discountValue = document.getElementById("discountValue");
    els.totalValue = document.getElementById("totalValue");
    els.cartEta = document.getElementById("cartEta");
    els.promoInput = document.getElementById("promoInput");
    els.applyPromoButton = document.getElementById("applyPromoButton");
    els.clearCartButton = document.getElementById("clearCartButton");
    els.checkoutLink = document.getElementById("checkoutLink");
    els.checkoutForm = document.getElementById("checkoutForm");
    els.checkoutNote = document.getElementById("checkoutNote");
    els.submitOrderButton = document.getElementById("submitOrderButton");
    els.checkoutItemCount = document.getElementById("checkoutItemCount");
    els.checkoutSubtotal = document.getElementById("checkoutSubtotal");
    els.checkoutDelivery = document.getElementById("checkoutDelivery");
    els.checkoutService = document.getElementById("checkoutService");
    els.checkoutDiscount = document.getElementById("checkoutDiscount");
    els.checkoutTotal = document.getElementById("checkoutTotal");
    els.checkoutEta = document.getElementById("checkoutEta");
    els.productDialog = document.getElementById("productDialog");
    els.productDialogContent = document.getElementById("productDialogContent");
    els.closeProductButton = document.getElementById("closeProductButton");
    els.authModal = document.getElementById("authModal");
    els.authModalClose = document.getElementById("authModalClose");
    els.authModalOverlay = document.getElementById("authModalOverlay");
    els.registerBlock = document.getElementById("registerBlock");
    els.loginBlock = document.getElementById("loginBlock");
    els.registerForm = document.getElementById("registerForm");
    els.customerLoginForm = document.getElementById("customerLoginForm");
    els.showLoginButton = document.getElementById("showLoginButton");
    els.showRegisterButton = document.getElementById("showRegisterButton");
    els.registerError = document.getElementById("registerError");
    els.loginError = document.getElementById("loginError");
    els.successSection = document.getElementById("success");
    els.successOrderNumber = document.getElementById("successOrderNumber");
    els.successOrderStatus = document.getElementById("successOrderStatus");
    els.successEta = document.getElementById("successEta");
    els.continueShoppingButton = document.getElementById(
      "continueShoppingButton",
    );
    els.toast = document.getElementById("toast");
    els.aiInput = document.getElementById("aiInput");
    els.aiRecommendButton = document.getElementById("aiRecommendButton");
    els.aiMessages = document.getElementById("aiMessages");
    els.aiStatus = document.getElementById("aiStatus");
    els.aiResult = document.getElementById("aiResult");
    els.aiProducts = document.getElementById("aiProducts");
    els.aiTotal = document.getElementById("aiTotal");
    els.aiAddAll = document.getElementById("aiAddAll");
    els.aiAnother = document.getElementById("aiAnother");
  }

  function bindEvents() {
    window.addEventListener(
      "scroll",
      function () {
        if (els.navbar)
          els.navbar.classList.toggle("is-scrolled", window.scrollY > 24);
      },
      { passive: true },
    );

    if (els.mobileMenuButton && els.mobilePanel) {
      els.mobileMenuButton.addEventListener("click", toggleMobileMenu);
      els.mobilePanel.addEventListener("click", function (event) {
        if (event.target.closest("a")) closeMobileMenu();
      });
    }

    [els.globalSearch, els.menuSearch].forEach(function (input) {
      if (!input) return;
      input.addEventListener("input", function () {
        setSearch(input.value);
      });
      input.addEventListener("focus", function () {
        document
          .getElementById("menu")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if (els.categoryStrip) {
      els.categoryStrip.addEventListener("click", function (event) {
        var button = event.target.closest("[data-category]");
        if (!button) return;
        state.activeCategory = button.dataset.category;
        renderCategories();
        renderProducts();
      });
    }

    if (els.productsGrid)
      els.productsGrid.addEventListener("click", onProductGridClick);
    if (els.featuredRow) {
      els.featuredRow.addEventListener("click", function (event) {
        var card = event.target.closest("[data-id]");
        if (card) openProduct(card.dataset.id);
      });
    }

    if (els.cartButton) els.cartButton.addEventListener("click", openCart);
    if (els.closeCartButton)
      els.closeCartButton.addEventListener("click", closeCart);
    if (els.scrim) els.scrim.addEventListener("click", closeCart);
    if (els.clearCartButton)
      els.clearCartButton.addEventListener("click", clearCart);
    if (els.checkoutLink) {
      els.checkoutLink.addEventListener("click", function () {
        closeCart();
        renderCheckoutSummary();
      });
    }
    if (els.cartItems) els.cartItems.addEventListener("click", onCartClick);
    if (els.applyPromoButton)
      els.applyPromoButton.addEventListener("click", applyPromo);
    if (els.promoInput) {
      els.promoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          applyPromo();
        }
      });
    }

    if (els.closeProductButton)
      els.closeProductButton.addEventListener("click", closeProduct);
    if (els.productDialog)
      els.productDialog.addEventListener("click", onProductDialogClick);
    if (els.authModalClose)
      els.authModalClose.addEventListener("click", closeAuthModal);
    if (els.authModalOverlay)
      els.authModalOverlay.addEventListener("click", closeAuthModal);
    if (els.showLoginButton)
      els.showLoginButton.addEventListener("click", showLoginForm);
    if (els.showRegisterButton)
      els.showRegisterButton.addEventListener("click", showRegisterForm);
    if (els.registerForm)
      els.registerForm.addEventListener("submit", registerCustomer);
    if (els.customerLoginForm)
      els.customerLoginForm.addEventListener("submit", loginCustomer);
    if (els.checkoutForm) bindCheckoutForm();
    if (els.toast) {
      els.toast.addEventListener("click", function (event) {
        if (event.target.closest("[data-toast-cart]")) openCart();
      });
    }
    if (els.continueShoppingButton) {
      els.continueShoppingButton.addEventListener("click", function () {
        if (els.successSection) els.successSection.hidden = true;
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeCart();
        closeMobileMenu();
        closeProduct();
      }
    });

    if (els.aiRecommendButton) {
      els.aiRecommendButton.addEventListener("click", getAIRecommendation);
    }
    if (els.aiAddAll) {
      els.aiAddAll.addEventListener("click", addAllAIProductsToCart);
    }
    if (els.aiAnother) {
      els.aiAnother.addEventListener("click", getAnotherAIRecommendation);
    }
    if (els.aiInput && els.aiRecommendButton) {
      els.aiInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (!els.aiRecommendButton.disabled) {
            getAIRecommendation();
          }
        }
      });
    }
    document.querySelectorAll(".ai-suggestion").forEach(function (button) {
      button.addEventListener("click", function () {
        els.aiInput.value = button.dataset.aiText;
        getAIRecommendation();
      });
    });
  }

  function bindCheckoutForm() {
    els.checkoutForm.addEventListener("input", function (event) {
      saveCheckoutDraft();
      if (event.target.name) validateField(event.target.name);
    });
    els.checkoutForm.addEventListener("change", function (event) {
      saveCheckoutDraft();
      if (event.target.name === "deliveryMethod") {
        updateDeliveryFieldVisibility();
        renderCart();
        renderCheckoutSummary();
        clearValidation();
      }
    });
    els.checkoutForm.addEventListener("submit", submitCheckout);
    updateDeliveryFieldVisibility();
  }

  function renderStats() {
    setText("categoryStat", categories.length);
    setText("productStat", products.length);
  }

  function renderCategories() {
    if (!els.categoryStrip) return;
    var chips = [
      '<button class="category-chip' +
        (state.activeCategory === "all" ? " is-active" : "") +
        '" type="button" data-category="all">Все</button>',
    ];
    categories.forEach(function (category) {
      chips.push(
        '<button class="category-chip' +
          (state.activeCategory === category.id ? " is-active" : "") +
          '" type="button" data-category="' +
          escapeHtml(category.id) +
          '">' +
          escapeHtml(category.name) +
          "</button>",
      );
    });
    els.categoryStrip.innerHTML = chips.join("");
  }

  function renderFeatured() {
    if (!els.featuredRow) return;
    var featured = products
      .filter(function (product) {
        return product.featured && product.available;
      })
      .slice(0, 4);

    els.featuredRow.innerHTML = featured
      .map(function (product) {
        var category = categoryById.get(product.category);
        return (
          '<button class="featured-card reveal" type="button" data-id="' +
          escapeHtml(product.id) +
          '">' +
          '<img src="' +
          escapeHtml(getProductImage(product)) +
          '" alt="' +
          escapeHtml(product.name) +
          '" loading="lazy">' +
          "<div>" +
          "<span>" +
          escapeHtml(category ? category.name : "Mon Ami") +
          "</span>" +
          "<h3>" +
          escapeHtml(product.name) +
          "</h3>" +
          "<p>" +
          formatPrice(product.price) +
          "</p>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");
  }

  function renderProducts() {
    if (!els.productsGrid) return;
    var filtered = getFilteredProducts();
    var activeCategory = categoryById.get(state.activeCategory);
    var label = state.query
      ? "Найдено: " + filtered.length
      : activeCategory
        ? activeCategory.name + ": " + filtered.length
        : "Все позиции: " + filtered.length;

    if (els.resultsLine) els.resultsLine.textContent = label;
    if (!filtered.length) {
      els.productsGrid.innerHTML =
        '<div class="empty-state"><strong>Ничего не найдено</strong><span>Попробуйте другой запрос или категорию.</span></div>';
      return;
    }

    els.productsGrid.innerHTML = filtered.map(buildProductCard).join("");
    revealOnScroll();
  }

  function buildProductCard(product) {
    var category = categoryById.get(product.category);
    var favorite = state.favorites.has(product.id);
    var quantity = getCartQuantity(product.id);
    var availableLabel = product.available ? "В наличии" : "Недоступно";

    return (
      '<article class="product-card reveal" data-id="' +
      escapeHtml(product.id) +
      '">' +
      '<div class="product-card-inner">' +
      '<button class="product-media product-open" type="button" data-view="' +
      escapeHtml(product.id) +
      '" aria-label="Открыть ' +
      escapeHtml(product.name) +
      '">' +
      '<img src="' +
      escapeHtml(getProductImage(product)) +
      '" alt="' +
      escapeHtml(product.name) +
      '" loading="lazy" onerror="this.src=\'' +
      escapeHtml(getFallbackImage(product)) +
      "'\">" +
      '<div class="badge-row">' +
      '<div class="badge-stack">' +
      '<span class="badge">' +
      escapeHtml(category ? category.name : "Mon Ami") +
      "</span>" +
      '<span class="badge ' +
      (product.available ? "available" : "unavailable") +
      '">' +
      availableLabel +
      "</span>" +
      "</div>" +
      "</div>" +
      "</button>" +
      '<button class="product-action favorite-button' +
      (favorite ? " is-active" : "") +
      '" type="button" data-favorite="' +
      escapeHtml(product.id) +
      '" aria-label="Избранное">' +
      heartIcon() +
      "</button>" +
      '<div class="product-body">' +
      '<span class="product-kicker">' +
      escapeHtml(category ? category.name_en : "Menu") +
      "</span>" +
      '<button class="product-title-button" type="button" data-view="' +
      escapeHtml(product.id) +
      '"><h3 class="product-title">' +
      escapeHtml(product.name) +
      "</h3></button>" +
      '<p class="product-description">' +
      escapeHtml(product.description || "Описание уточняется.") +
      "</p>" +
      '<div class="product-meta">' +
      '<div><strong class="product-price">' +
      formatPrice(product.price) +
      '</strong><br><span class="product-weight">' +
      escapeHtml(formatWeight(product.weight)) +
      "</span></div>" +
      '<div class="product-actions">' +
      buildProductAction(product, quantity) +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function buildProductAction(product, quantity) {
    if (!product.available) {
      return (
        '<button class="product-action add" type="button" disabled aria-label="Недоступно">' +
        plusIcon() +
        "</button>"
      );
    }
    if (quantity > 0) {
      return (
        '<div class="quantity-control card-quantity" aria-label="Количество в корзине">' +
        '<button class="quantity-button" type="button" data-card-minus="' +
        escapeHtml(product.id) +
        '">-</button>' +
        "<span>" +
        quantity +
        "</span>" +
        '<button class="quantity-button" type="button" data-card-plus="' +
        escapeHtml(product.id) +
        '">+</button>' +
        "</div>"
      );
    }
    return (
      '<button class="product-action add" type="button" data-add="' +
      escapeHtml(product.id) +
      '" aria-label="Добавить в корзину">' +
      plusIcon() +
      "</button>"
    );
  }

  function getFilteredProducts() {
    var query = normalize(state.query);
    return products.filter(function (product) {
      var categoryMatch =
        state.activeCategory === "all" ||
        product.category === state.activeCategory;
      if (!categoryMatch) return false;
      if (!query) return true;
      var haystack = normalize(
        [
          product.name,
          product.description,
          (product.tags || []).join(" "),
        ].join(" "),
      );
      return haystack.indexOf(query) !== -1;
    });
  }

  function onProductGridClick(event) {
    var favorite = event.target.closest("[data-favorite]");

    var add = event.target.closest("[data-add]");

    var plus = event.target.closest("[data-card-plus]");

    var minus = event.target.closest("[data-card-minus]");

    var view = event.target.closest("[data-view]");

    if (favorite) {
      return toggleFavorite(favorite.dataset.favorite);
    }

    if (add) {
      return handleAddToCart(add.dataset.add, 1);
    }

    if (plus) {
      return handleAddToCart(plus.dataset.cardPlus, 1);
    }

    if (minus) {
      return changeQuantity(minus.dataset.cardMinus, -1);
    }

    if (view) {
      return openProduct(view.dataset.view);
    }
  }

  function setSearch(value) {
    state.query = value.trim();
    if (els.globalSearch && els.globalSearch.value !== value)
      els.globalSearch.value = value;
    if (els.menuSearch && els.menuSearch.value !== value)
      els.menuSearch.value = value;
    renderProducts();
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast({ title: "Удалено из избранного", tone: "neutral" });
    } else {
      state.favorites.add(id);
      showToast({ title: "Добавлено в избранное", tone: "success" });
    }
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(Array.from(state.favorites)),
    );
    renderProducts();
  }
  var pendingProductId = null;
  var pendingProductAmount = 1;

  function handleAddToCart(id, amount) {
    var token = localStorage.getItem("monami_customer_token");
    if (!token) {
      openAuthModal(id, amount);
      return;
    }

    verifyCustomerToken(token).then(function (valid) {
      if (!valid) {
        localStorage.removeItem("monami_customer_token");
        openAuthModal(id, amount);
        return;
      }
      addToCart(id, amount, { openCart: false });
    });
  }

  function verifyCustomerToken(token) {
    return fetch("https://bubble-cigarettes-inter-chosen.trycloudflare.com/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    })
      .then(function (response) {
        if (!response.ok) return false;
        return response.json();
      })
      .then(function (data) {
        return !!(data && data.user && data.user.role === "customer");
      })
      .catch(function () {
        return false;
      });
  }

  function openAuthModal(productId, amount) {
    pendingProductId = productId;
    pendingProductAmount = amount;
    if (!els.authModal) return;
    els.authModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    showRegisterForm();
  }

  function closeAuthModal() {
    if (!els.authModal) return;
    els.authModal.classList.remove("is-open");
    document.body.style.overflow = "";
    pendingProductId = null;
    pendingProductAmount = 1;
    if (els.registerError) els.registerError.textContent = "";
    if (els.loginError) els.loginError.textContent = "";
  }

  function showRegisterForm() {
    if (els.loginBlock) els.loginBlock.style.display = "none";
    if (els.registerBlock) els.registerBlock.style.display = "block";
    if (els.registerError) els.registerError.textContent = "";
  }

  function showLoginForm() {
    if (els.registerBlock) els.registerBlock.style.display = "none";
    if (els.loginBlock) els.loginBlock.style.display = "block";
    if (els.loginError) els.loginError.textContent = "";
  }

  function addPendingProductToCart() {
    if (!pendingProductId) return;
    var productId = pendingProductId;
    var amount = pendingProductAmount;
    pendingProductId = null;
    pendingProductAmount = 1;
    addToCart(productId, amount, { openCart: false });
  }

  function registerCustomer(event) {
    event.preventDefault();
    var username = document.getElementById("registerUsername").value.trim();
    var password = document.getElementById("registerPassword").value;
    var passwordConfirm = document.getElementById("registerPasswordConfirm").value;
    if (els.registerError) els.registerError.textContent = "";

    if (!username) {
      if (els.registerError) els.registerError.textContent = "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f";
      return;
    }
    if (password.length < 6) {
      if (els.registerError) els.registerError.textContent = "\u041f\u0430\u0440\u043e\u043b\u044c \u0434\u043e\u043b\u0436\u0435\u043d \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u0442\u044c \u043c\u0438\u043d\u0438\u043c\u0443\u043c 6 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432";
      return;
    }
    if (password !== passwordConfirm) {
      if (els.registerError) els.registerError.textContent = "\u041f\u0430\u0440\u043e\u043b\u0438 \u043d\u0435 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442";
      return;
    }

    fetch("https://bubble-cigarettes-inter-chosen.trycloudflare.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(parseAuthResponse)
      .then(function () { return loginRequest(username, password); })
      .then(function (data) {
        localStorage.setItem("monami_customer_token", data.access_token);
        addPendingProductToCart();
        closeAuthModal();
      })
      .catch(function (error) {
        console.error("Registration error:", error);
        if (els.registerError) els.registerError.textContent = error.message;
      });
  }

  function loginCustomer(event) {
    event.preventDefault();
    var username = document.getElementById("loginUsername").value.trim();
    var password = document.getElementById("loginPassword").value;
    if (els.loginError) els.loginError.textContent = "";
    if (!username) {
      if (els.loginError) els.loginError.textContent = "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f";
      return;
    }
    if (!password) {
      if (els.loginError) els.loginError.textContent = "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c";
      return;
    }
    loginRequest(username, password)
      .then(function (data) {
        localStorage.setItem("monami_customer_token", data.access_token);
        addPendingProductToCart();
        closeAuthModal();
      })
      .catch(function (error) {
        console.error("Login error:", error);
        if (els.loginError) els.loginError.textContent = error.message;
      });
  }

  function loginRequest(username, password) {
    return fetch("https://bubble-cigarettes-inter-chosen.trycloudflare.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(parseAuthResponse)
      .then(function (data) {
        if (!data.user || data.user.role !== "customer") {
          throw new Error("\u042d\u0442\u043e \u043d\u0435 \u043a\u043b\u0438\u0435\u043d\u0442\u0441\u043a\u0438\u0439 \u0430\u043a\u043a\u0430\u0443\u043d\u0442");
        }
        return data;
      });
  }

  function parseAuthResponse(response) {
    return response.json().then(function (data) {
      if (!response.ok) throw new Error(data.detail || "\u041e\u0448\u0438\u0431\u043a\u0430 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438");
      return data;
    });
  }

  function addToCart(id, amount, options) {
    var product = productById.get(id);
    var quantityToAdd = Math.max(Number(amount) || 1, 1);
    if (!product || !product.available) {
      showToast({ title: "Позиция недоступна", tone: "error" });
      return;
    }

    var item = state.cart.find(function (cartItem) {
      return cartItem.id === id;
    });
    if (item) {
      item.quantity += quantityToAdd;
    } else {
      state.cart.push({ id: id, quantity: quantityToAdd });
    }

    persistCart();
    refreshOrderingUi();
    pulseCartButton();
    showToast({
      title: product.name,
      message:
        quantityToAdd > 1
          ? "Добавлено: " + quantityToAdd + " шт."
          : "Блюдо добавлено в корзину",
      tone: "success",
      action: "Корзина",
    });

    if (options && options.openCart) openCart();
  }

  function changeQuantity(id, delta) {
    var item = state.cart.find(function (cartItem) {
      return cartItem.id === id;
    });
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter(function (cartItem) {
        return cartItem.id !== id;
      });
      showToast({ title: "Позиция удалена", tone: "neutral" });
    }
    persistCart();
    refreshOrderingUi();
  }

  function removeCartItem(id) {
    state.cart = state.cart.filter(function (item) {
      return item.id !== id;
    });
    persistCart();
    refreshOrderingUi();
    showToast({ title: "Позиция удалена", tone: "neutral" });
  }

  function clearCart() {
    state.cart = [];
    persistCart();
    refreshOrderingUi();
    showToast({ title: "Корзина очищена", tone: "neutral" });
  }

  function refreshOrderingUi() {
    renderCart();
    renderProducts();
    renderCheckoutSummary();
    if (state.dialogProductId && els.productDialog && els.productDialog.open) {
      renderProductDialog(productById.get(state.dialogProductId));
    }
  }

  function persistCart() {
    state.cart = normalizeCart(state.cart);
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  }

  function onCartClick(event) {
    var minus = event.target.closest("[data-minus]");
    var plus = event.target.closest("[data-plus]");
    var remove = event.target.closest("[data-remove]");
    if (minus) changeQuantity(minus.dataset.minus, -1);
    if (plus) handleAddToCart(plus.dataset.plus, 1);
    if (remove) removeCartItem(remove.dataset.remove);
  }

  function renderCart() {
    var details = getCartDetails();
    var totals = calculateTotals();
    var eta = getCurrentEta();

    if (els.cartCount) els.cartCount.textContent = details.itemCount;
    if (els.cartTitle)
      els.cartTitle.textContent = details.itemCount
        ? details.itemCount + " поз."
        : "Корзина пуста";
    if (els.cartEta) els.cartEta.textContent = eta;
    if (els.subtotalValue)
      els.subtotalValue.textContent = formatPrice(totals.subtotal);
    if (els.deliveryValue)
      els.deliveryValue.textContent = formatPrice(totals.deliveryFee);
    if (els.serviceValue)
      els.serviceValue.textContent = formatPrice(totals.serviceFee);
    if (els.discountValue)
      els.discountValue.textContent = totals.discount
        ? "-" + formatPrice(totals.discount)
        : formatPrice(0);
    if (els.totalValue) els.totalValue.textContent = formatPrice(totals.total);
    syncPromoInput();

    if (!els.cartItems) return;
    if (!details.items.length) {
      els.cartItems.innerHTML =
        '<div class="cart-empty"><strong>Корзина пуста</strong><span>Добавьте блюдо, и здесь появится ваш заказ.</span></div>';
      return;
    }

    els.cartItems.innerHTML = details.items
      .map(function (item) {
        var product = item.product;
        return (
          '<article class="cart-item">' +
          '<img src="' +
          escapeHtml(getProductImage(product)) +
          '" alt="' +
          escapeHtml(product.name) +
          '" loading="lazy">' +
          '<div class="cart-item-main">' +
          '<div class="cart-item-top">' +
          "<div><h4>" +
          escapeHtml(product.name) +
          "</h4><small>" +
          escapeHtml(formatWeight(product.weight)) +
          "</small></div>" +
          '<button class="remove-button" type="button" data-remove="' +
          escapeHtml(product.id) +
          '">Убрать</button>' +
          "</div>" +
          '<div class="cart-item-bottom">' +
          '<div class="quantity-control" aria-label="Количество">' +
          '<button class="quantity-button" type="button" data-minus="' +
          escapeHtml(product.id) +
          '">-</button>' +
          "<span>" +
          item.quantity +
          "</span>" +
          '<button class="quantity-button" type="button" data-plus="' +
          escapeHtml(product.id) +
          '">+</button>' +
          "</div>" +
          "<strong>" +
          formatPrice(product.price * item.quantity) +
          "</strong>" +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function applyPromo() {
    var raw = els.promoInput ? els.promoInput.value.trim() : "";
    state.promoCode = raw.toUpperCase();
    if (state.promoCode) localStorage.setItem(PROMO_KEY, state.promoCode);
    else localStorage.removeItem(PROMO_KEY);

    renderCart();
    renderCheckoutSummary();
    if (!state.promoCode) {
      showToast({ title: "Промокод очищен", tone: "neutral" });
      return;
    }
    if (getPromoDiscount(calculateSubtotal()) > 0) {
      showToast({
        title: "Промокод применен",
        message: "Скидка 10% на блюда",
        tone: "success",
      });
    } else {
      showToast({
        title: "Промокод сохранен",
        message: "Пока это UI-only поле",
        tone: "neutral",
      });
    }
  }

  function renderCheckoutSummary() {
    var details = getCartDetails();
    var totals = calculateTotals();
    var eta = getCurrentEta();
    if (els.checkoutItemCount)
      els.checkoutItemCount.textContent = details.itemCount
        ? details.itemCount + " поз."
        : "Корзина пуста";
    if (els.checkoutSubtotal)
      els.checkoutSubtotal.textContent = formatPrice(totals.subtotal);
    if (els.checkoutDelivery)
      els.checkoutDelivery.textContent = formatPrice(totals.deliveryFee);
    if (els.checkoutService)
      els.checkoutService.textContent = formatPrice(totals.serviceFee);
    if (els.checkoutDiscount)
      els.checkoutDiscount.textContent = totals.discount
        ? "-" + formatPrice(totals.discount)
        : formatPrice(0);
    if (els.checkoutTotal)
      els.checkoutTotal.textContent = formatPrice(totals.total);
    if (els.checkoutEta) {
      els.checkoutEta.textContent = details.itemCount
        ? "Ожидаемое время: " + eta
        : "Добавьте блюда, чтобы увидеть время доставки.";
    }
  }

  function openCart() {
    if (!els.cartDrawer) return;
    els.cartDrawer.classList.add("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "false");
    if (els.scrim) els.scrim.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeCart() {
    if (!els.cartDrawer) return;
    els.cartDrawer.classList.remove("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "true");
    if (els.scrim) els.scrim.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function openProduct(id) {
    var product = productById.get(id);
    if (!product || !els.productDialog || !els.productDialogContent) return;
    state.dialogProductId = id;
    state.dialogQuantity = Math.max(getCartQuantity(id), 1);
    renderProductDialog(product);
    if (typeof els.productDialog.showModal === "function") {
      els.productDialog.showModal();
    } else {
      els.productDialog.setAttribute("open", "");
    }
  }

  function renderProductDialog(product) {
    if (!product || !els.productDialogContent) return;
    var category = categoryById.get(product.category);
    var related = getRelatedProducts(product);
    var ingredients =
      Array.isArray(product.ingredients) && product.ingredients.length
        ? product.ingredients
        : Array.isArray(product.tags)
          ? product.tags.slice(0, 5)
          : [];

    els.productDialogContent.innerHTML =
      '<div class="dialog-grid">' +
      '<div class="dialog-media"><img src="' +
      escapeHtml(getProductImage(product)) +
      '" alt="' +
      escapeHtml(product.name) +
      '"></div>' +
      '<div class="dialog-body">' +
      '<p class="eyebrow">' +
      escapeHtml(category ? category.name : "Mon Ami") +
      "</p>" +
      "<h2>" +
      escapeHtml(product.name) +
      "</h2>" +
      '<p class="dialog-description">' +
      escapeHtml(product.description || "Описание уточняется.") +
      "</p>" +
      '<div class="dialog-meta">' +
      "<span>" +
      escapeHtml(formatWeight(product.weight)) +
      "</span>" +
      "<span>" +
      escapeHtml(formatPrice(product.price)) +
      "</span>" +
      "<span>" +
      escapeHtml(product.available ? "В наличии" : "Недоступно") +
      "</span>" +
      "</div>" +
      '<div class="ingredient-list">' +
      (ingredients.length
        ? ingredients
            .map(function (item) {
              return "<span>" + escapeHtml(item) + "</span>";
            })
            .join("")
        : "<span>Состав уточняется</span>") +
      "</div>" +
      '<div class="dialog-order-row">' +
      '<div class="quantity-control dialog-quantity" aria-label="Количество">' +
      '<button class="quantity-button" type="button" data-dialog-minus>-</button>' +
      "<span>" +
      state.dialogQuantity +
      "</span>" +
      '<button class="quantity-button" type="button" data-dialog-plus>+</button>' +
      "</div>" +
      '<button class="primary-button" type="button" data-dialog-add="' +
      escapeHtml(product.id) +
      '">' +
      "Добавить " +
      state.dialogQuantity +
      " • " +
      formatPrice(product.price * state.dialogQuantity) +
      "</button>" +
      "</div>" +
      '<div class="related-block">' +
      "<strong>Похожие блюда</strong>" +
      '<div class="related-list">' +
      related.map(buildRelatedDish).join("") +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }

  function buildRelatedDish(product) {
    return (
      '<button class="related-dish" type="button" data-related="' +
      escapeHtml(product.id) +
      '">' +
      '<img src="' +
      escapeHtml(getProductImage(product)) +
      '" alt="' +
      escapeHtml(product.name) +
      '" loading="lazy">' +
      "<span>" +
      escapeHtml(product.name) +
      "</span>" +
      "<strong>" +
      formatPrice(product.price) +
      "</strong>" +
      "</button>"
    );
  }

  function onProductDialogClick(event) {
    if (event.target === els.productDialog) return closeProduct();
    var minus = event.target.closest("[data-dialog-minus]");
    var plus = event.target.closest("[data-dialog-plus]");
    var add = event.target.closest("[data-dialog-add]");
    var related = event.target.closest("[data-related]");

    if (minus) {
      state.dialogQuantity = Math.max(1, state.dialogQuantity - 1);
      return renderProductDialog(productById.get(state.dialogProductId));
    }
    if (plus) {
      state.dialogQuantity += 1;
      return renderProductDialog(productById.get(state.dialogProductId));
    }
    if (add) {
      handleAddToCart(add.dataset.dialogAdd, state.dialogQuantity);
      closeProduct();
      return;
    }
    if (related) {
      openProduct(related.dataset.related);
    }
  }

  function closeProduct() {
    if (!els.productDialog || !els.productDialog.open) return;
    els.productDialog.close();
    state.dialogProductId = null;
    state.dialogQuantity = 1;
  }

  // ─── CHECKOUT ────────────────────────────────────────────────────────────────

  function submitCheckout(event) {
    event.preventDefault();

    if (!state.cart.length) {
      showToast({
        title: "Корзина пуста",
        message: "Добавьте блюда перед оформлением.",
        tone: "error",
      });
      document
        .getElementById("menu")
        .scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    clearValidation();
    var validation = validateCheckout();
    if (!validation.valid) {
      showToast({
        title: "Проверьте поля",
        message: "Нужно заполнить данные заказа.",
        tone: "error",
      });
      focusFirstInvalid(validation.errors);
      return;
    }

    var formData = new FormData(els.checkoutForm);
    var deliveryMethod = formData.get("deliveryMethod");
    var paymentMethod = formData.get("payment");
    var details = getCartDetails();
    var totals = calculateTotals();

    var orderItems = details.items.map(function (item) {
      return {
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        weight: item.product.weight,
        image: getProductImage(item.product),
        categoryId: item.product.category,
      };
    });

    // Создаём заказ локально — Telegram НЕ отправляем ещё
    var order = window.OrderService.createOrder({
      customer: {
        name: formData.get("name").trim(),
        phone: formData.get("phone").trim(),
      },
      deliveryMethod: deliveryMethod,
      deliveryAddress:
        deliveryMethod === "delivery"
          ? {
              address: formData.get("address").trim(),
              apartment: formData.get("apartment").trim(),
              floor: formData.get("floor").trim(),
              entrance: formData.get("entrance").trim(),
              comment: formData.get("comment").trim(),
            }
          : null,
      paymentMethod: paymentMethod,
      items: orderItems,
      promoCode: state.promoCode,
      totals: totals,
      estimatedDelivery: getCurrentEta(),
      statusLabel: "Создан",
    });

    // Наличные — сразу в Telegram, QR не нужен
    if (paymentMethod === "Cash") {
      window.OrderService.confirmPayment(order.id).then(function () {
        finishOrder(order);
      });
      return;
    }

    // MBank / Bakai — показываем экран с QR
    showPaymentScreen(order, totals.total);
  }

  function showPaymentScreen(order, total) {
    var checkout = document.getElementById("checkout");
    var existing = document.getElementById("payment-screen");
    if (existing) existing.remove();

    var qrSrc =
      order.paymentMethod === "Bakai"
        ? "assets/qr-bakai.png"
        : "assets/qr-mbank.png";

    var screen = document.createElement("section");
    screen.id = "payment-screen";
    screen.className = "checkout-preview";
    screen.innerHTML = [
      '<div class="checkout-copy reveal is-visible">',
      '<p class="eyebrow">Оплата</p>',
      "<h2>Оплатите через " + escapeHtml(order.paymentMethod) + "</h2>",
      "<p>Отсканируйте QR в приложении и переведите <strong>" +
        formatPrice(total) +
        "</strong>.</p>",
      "<p>После оплаты нажмите кнопку ниже — заказ уйдёт на кухню.</p>",
      "</div>",
      '<div class="checkout-stack reveal is-visible">',
      '<div class="checkout-card" style="text-align:center">',
      "<img",
      ' src="' + escapeHtml(qrSrc) + '"',
      ' alt="QR ' + escapeHtml(order.paymentMethod) + '"',
      ' style="width:220px;height:220px;object-fit:contain;margin:0 auto 24px;display:block;border-radius:12px;border:1px solid var(--border,#eee)"',
      ">",
      '<p style="margin-bottom:8px;font-size:15px">',
      "Номер заказа: <strong>" + escapeHtml(order.orderNumber) + "</strong>",
      "</p>",
      '<p style="margin-bottom:24px;font-size:15px">',
      "К оплате: <strong>" + formatPrice(total) + "</strong>",
      "</p>",
      '<button class="primary-button" id="btnPaid" type="button">',
      "✅ Я оплатил",
      "</button>",
      '<p style="margin-top:16px;font-size:13px;opacity:.6">',
      "Нажмите только после успешной оплаты",
      "</p>",
      "</div>",
      '<aside class="checkout-summary" aria-label="Итог заказа">',
      '<div class="summary-heading">',
      "<span>Ваш заказ</span>",
      "<strong>" + order.items.length + " поз.</strong>",
      "</div>",
      '<div class="summary-lines">',
      order.items
        .map(function (item) {
          return (
            "<div><span>" +
            escapeHtml(item.name) +
            " × " +
            item.quantity +
            "</span>" +
            "<strong>" +
            formatPrice(item.price * item.quantity) +
            "</strong></div>"
          );
        })
        .join(""),
      '<div class="total-row"><span>Итого</span><strong>' +
        formatPrice(total) +
        "</strong></div>",
      "</div>",
      "</aside>",
      "</div>",
    ].join("");

    checkout.insertAdjacentElement("afterend", screen);
    screen.scrollIntoView({ behavior: "smooth", block: "start" });

    document.getElementById("btnPaid").addEventListener("click", function () {
      onPaidClick(order);
    });
  }

  function onPaidClick(order) {
    var btn = document.getElementById("btnPaid");
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = "Отправляем заказ...";

    window.OrderService.confirmPayment(order.id)
      .then(function () {
        var screen = document.getElementById("payment-screen");
        if (screen) screen.remove();
        finishOrder(order);
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "✅ Я оплатил";
        showToast({
          title: "Ошибка отправки",
          message: "Попробуйте ещё раз.",
          tone: "error",
        });
      });
  }

  function finishOrder(order) {
    state.cart = [];
    persistCart();
    window.OrderService.clearDraft();
    els.checkoutForm.reset();
    state.promoCode = "";
    localStorage.removeItem(PROMO_KEY);
    updateDeliveryFieldVisibility();
    refreshOrderingUi();
    showSuccess(order);
    showToast({
      title: "Заказ принят",
      message: "Номер " + order.orderNumber,
      tone: "success",
    });
  }

  // ─── VALIDATION ──────────────────────────────────────────────────────────────

  function validateCheckout() {
    var formData = new FormData(els.checkoutForm);
    var deliveryMethod = formData.get("deliveryMethod");
    var errors = {};
    var phone = String(formData.get("phone") || "").trim();

    requireField(errors, formData, "name", "Введите имя");
    requireField(errors, formData, "phone", "Введите телефон");
    if (phone && !/^[+0-9()\s-]{9,}$/.test(phone)) {
      errors.phone = "Введите корректный телефон";
    }
    if (deliveryMethod === "delivery") {
      requireField(errors, formData, "address", "Введите адрес");
      requireField(errors, formData, "apartment", "Укажите квартиру");
      requireField(errors, formData, "floor", "Укажите этаж");
      requireField(errors, formData, "entrance", "Укажите подъезд");
    }

    Object.keys(errors).forEach(function (name) {
      showFieldError(name, errors[name]);
    });

    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  function validateField(name) {
    var field = els.checkoutForm.querySelector(
      '[name="' + cssEscape(name) + '"]',
    );
    if (!field) return;
    var value = String(field.value || "").trim();
    if (
      !value &&
      field.dataset.required === "true" &&
      !field.closest("[hidden]")
    )
      return;
    if (name === "phone" && value && !/^[+0-9()\s-]{9,}$/.test(value)) {
      showFieldError(name, "Введите корректный телефон");
      return;
    }
    clearFieldError(name);
  }

  function requireField(errors, formData, name, message) {
    if (!String(formData.get(name) || "").trim()) errors[name] = message;
  }

  function showFieldError(name, message) {
    var field = els.checkoutForm.querySelector(
      '[name="' + cssEscape(name) + '"]',
    );
    var error = els.checkoutForm.querySelector(
      '[data-error-for="' + cssEscape(name) + '"]',
    );
    if (field) field.setAttribute("aria-invalid", "true");
    if (error) error.textContent = message;
  }

  function clearFieldError(name) {
    var field = els.checkoutForm.querySelector(
      '[name="' + cssEscape(name) + '"]',
    );
    var error = els.checkoutForm.querySelector(
      '[data-error-for="' + cssEscape(name) + '"]',
    );
    if (field) field.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  }

  function clearValidation() {
    if (!els.checkoutForm) return;
    els.checkoutForm
      .querySelectorAll("[aria-invalid]")
      .forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });
    els.checkoutForm.querySelectorAll(".field-error").forEach(function (error) {
      error.textContent = "";
    });
    if (els.checkoutNote) els.checkoutNote.textContent = "";
  }

  function focusFirstInvalid(errors) {
    var first = Object.keys(errors)[0];
    var field =
      first &&
      els.checkoutForm.querySelector('[name="' + cssEscape(first) + '"]');
    if (field) field.focus();
  }

  // ─── SUCCESS ─────────────────────────────────────────────────────────────────

  function showSuccess(order) {
    if (!els.successSection) return;
    if (els.successOrderNumber)
      els.successOrderNumber.textContent = order.orderNumber;
    if (els.successOrderStatus) els.successOrderStatus.textContent = "Создан";
    if (els.successEta) els.successEta.textContent = order.estimatedDelivery;
    els.successSection.hidden = false;
    els.successSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ─── DRAFT ───────────────────────────────────────────────────────────────────

  function hydrateCheckoutDraft() {
    if (!els.checkoutForm || !window.OrderService) return;
    var draft = window.OrderService.getDraft();
    Object.keys(draft).forEach(function (name) {
      var field = els.checkoutForm.elements[name];
      if (!field) return;
      if (field instanceof RadioNodeList) {
        Array.prototype.forEach.call(field, function (radio) {
          radio.checked = radio.value === draft[name];
        });
      } else {
        field.value = draft[name];
      }
    });
    updateDeliveryFieldVisibility();
  }

  function saveCheckoutDraft() {
    if (!els.checkoutForm || !window.OrderService) return;
    var formData = new FormData(els.checkoutForm);
    var draft = {};
    formData.forEach(function (value, key) {
      draft[key] = value;
    });
    window.OrderService.saveDraft(draft);
  }

  function updateDeliveryFieldVisibility() {
    if (!els.checkoutForm) return;
    var method = getDeliveryMethod();
    els.checkoutForm
      .querySelectorAll(".delivery-field")
      .forEach(function (field) {
        field.hidden = method === "pickup";
      });
  }

  function getDeliveryMethod() {
    if (!els.checkoutForm) return "delivery";
    var selected = els.checkoutForm.querySelector(
      'input[name="deliveryMethod"]:checked',
    );
    return selected ? selected.value : "delivery";
  }

  function getCurrentEta() {
    return getDeliveryMethod() === "pickup" ? PICKUP_ETA : DELIVERY_ETA;
  }

  // ─── CALCULATIONS ─────────────────────────────────────────────────────────────

  function calculateSubtotal() {
    return getCartDetails().items.reduce(function (sum, item) {
      return sum + item.product.price * item.quantity;
    }, 0);
  }

  function calculateTotals() {
    var subtotal = calculateSubtotal();
    var deliveryFee =
      subtotal > 0 && getDeliveryMethod() === "delivery" ? DELIVERY_FEE : 0;
    var serviceFee = subtotal > 0 ? SERVICE_FEE : 0;
    var discount = getPromoDiscount(subtotal);
    return {
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      serviceFee: serviceFee,
      discount: discount,
      total: Math.max(subtotal + deliveryFee + serviceFee - discount, 0),
    };
  }

  function getPromoDiscount(subtotal) {
    return state.promoCode === "MONAMI10" ? Math.round(subtotal * 0.1) : 0;
  }

  function getCartDetails() {
    var items = state.cart
      .map(function (item) {
        return { product: productById.get(item.id), quantity: item.quantity };
      })
      .filter(function (item) {
        return item.product && item.quantity > 0;
      });
    var itemCount = items.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
    return { items: items, itemCount: itemCount };
  }

  function getCartQuantity(id) {
    var item = state.cart.find(function (cartItem) {
      return cartItem.id === id;
    });
    return item ? item.quantity : 0;
  }

  function getRelatedProducts(product) {
    return products
      .filter(function (candidate) {
        return (
          candidate.id !== product.id &&
          candidate.category === product.category &&
          candidate.available
        );
      })
      .slice(0, 3);
  }

  // ─── UI HELPERS ──────────────────────────────────────────────────────────────

  function toggleMobileMenu() {
    var isOpen = els.mobilePanel.classList.toggle("is-open");
    els.mobilePanel.setAttribute("aria-hidden", String(!isOpen));
    els.mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  }

  function closeMobileMenu() {
    if (!els.mobilePanel || !els.mobileMenuButton) return;
    els.mobilePanel.classList.remove("is-open");
    els.mobilePanel.setAttribute("aria-hidden", "true");
    els.mobileMenuButton.setAttribute("aria-expanded", "false");
  }

  function revealOnScroll() {
    var items = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function getProductImage(product) {
    var pdfImage = getPdfImage(product);
    if (pdfImage) return pdfImage;
    if (product.image && /^(https?:)?\/\//.test(product.image))
      return product.image;
    if (product.image && /^assets\//.test(product.image)) return product.image;
    return getFallbackImage(product);
  }

  function getPdfImage(product) {
    var images = pdfImageRanges[product.category];
    if (!images || !images.length) return "";
    var index = Math.max((product.sortOrder || 1) - 1, 0) % images.length;
    return images[index];
  }

  function getFallbackImage(product) {
    var text = [
      product.name,
      product.description,
      (product.tags || []).join(" "),
    ].join(" ");
    var matched = nameImages.find(function (entry) {
      return entry.test.test(text);
    });
    if (matched) return matched.url;
    return (
      categoryImages[product.category] ||
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
    );
  }

  function showToast(config) {
    if (!els.toast) return;
    var payload = typeof config === "string" ? { title: config } : config;
    window.clearTimeout(toastTimer);
    els.toast.className =
      "toast is-visible " + (payload.tone ? "toast-" + payload.tone : "");
    els.toast.innerHTML =
      '<span class="toast-icon">' +
      (payload.tone === "error" ? "!" : "✓") +
      "</span>" +
      '<span class="toast-copy"><strong>' +
      escapeHtml(payload.title || "") +
      "</strong>" +
      (payload.message
        ? "<small>" + escapeHtml(payload.message) + "</small>"
        : "") +
      "</span>" +
      (payload.action
        ? '<button type="button" data-toast-cart>' +
          escapeHtml(payload.action) +
          "</button>"
        : "");
    toastTimer = window.setTimeout(function () {
      els.toast.classList.remove("is-visible");
    }, 3600);
  }

  function pulseCartButton() {
    if (!els.cartButton) return;
    els.cartButton.classList.remove("is-pulsing");
    void els.cartButton.offsetWidth;
    els.cartButton.classList.add("is-pulsing");
  }

  function syncPromoInput() {
    if (els.promoInput && els.promoInput.value !== state.promoCode) {
      els.promoInput.value = state.promoCode;
    }
  }

  // ─── UTILS ───────────────────────────────────────────────────────────────────

  function normalizeCart(cart) {
    return (Array.isArray(cart) ? cart : [])
      .map(function (item) {
        return {
          id: item.id,
          quantity: Math.max(Number(item.quantity || item.qty || 1), 1),
        };
      })
      .filter(function (item) {
        return item.id && productById.has(item.id);
      });
  }

  function sortProducts(a, b) {
    var categoryDiff =
      (categoryOrder.get(a.category) || 0) -
      (categoryOrder.get(b.category) || 0);
    if (categoryDiff) return categoryDiff;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU").format(Number(value) || 0) + " сом";
  }

  function formatWeight(weight) {
    if (!weight) return "Вес уточняется";
    var value = String(weight).trim();
    return /^\d+$/.test(value) ? value + " г" : value;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/ё/g, "е");
  }

  function range(start, end) {
    var images = [];
    for (var i = start; i <= end; i += 1) {
      images.push(
        "assets/pdf-images/pdf-img-" + String(i).padStart(3, "0") + ".jpg",
      );
    }
    return images;
  }

  function readJson(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return value || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function cssEscape(value) {
    if (window.CSS && window.CSS.escape) return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function plusIcon() {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  }

  function heartIcon() {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 8.6c0 5-8.8 10.2-8.8 10.2S3.2 13.6 3.2 8.6a4.6 4.6 0 0 1 8.2-2.8 4.6 4.6 0 0 1 8.2 2.8Z"/></svg>';
  }

  let aiShownProductIds = [];

  function getAIRecommendation() {
    var message = els.aiInput.value.trim();
    window.lastAIMessage = message;

    if (!message) {
      els.aiStatus.textContent = "\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435, \u0447\u0442\u043e \u0432\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u043f\u043e\u0435\u0441\u0442\u044c.";
      return;
    }

    aiShownProductIds = [];
    addAIUserMessage(message);

    els.aiInput.value = "";
    els.aiStatus.textContent = "Mon Ami AI \u043f\u043e\u0434\u0431\u0438\u0440\u0430\u0435\u0442 \u0431\u043b\u044e\u0434\u0430...";
    els.aiRecommendButton.disabled = true;
    els.aiResult.hidden = true;

    fetch("https://bubble-cigarettes-inter-chosen.trycloudflare.com/ai/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        exclude_ids: aiShownProductIds
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: " + response.status);
        }

        return response.json();
      })
      .then(function (data) {
        addAIBotMessage(data);
        renderAIRecommendations(data);
        els.aiStatus.textContent = "";
      })
      .catch(function (error) {
        console.error("AI error:", error);
        addAIBotMessageError();
        els.aiStatus.textContent = "";
      })
      .finally(function () {
        els.aiRecommendButton.disabled = false;
      });
  }

  function getAnotherAIRecommendation() {
    if (!window.lastAIMessage) {
      return;
    }

    els.aiStatus.textContent = "Подбираю другой вариант...";
    els.aiRecommendButton.disabled = true;

    fetch("https://bubble-cigarettes-inter-chosen.trycloudflare.com/ai/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: window.lastAIMessage,
        exclude_ids: aiShownProductIds
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Ошибка сервера: " + response.status);
        }

        return response.json();
      })
      .then(function (data) {
        addAIBotMessage(data);
        renderAIRecommendations(data);
        els.aiStatus.textContent = "";
      })
      .catch(function (error) {
        console.error("AI error:", error);
        addAIBotMessageError();
        els.aiStatus.textContent = "";
      })
      .finally(function () {
        els.aiRecommendButton.disabled = false;
      });
  }

  function addAllAIProductsToCart() {
    if (!window.lastAIRecommendations || !window.lastAIRecommendations.length) {
      return;
    }

    var token = localStorage.getItem("monami_customer_token");

    if (!token) {
      openAuthModal(window.lastAIRecommendations[0].id, 1);
      return;
    }

    verifyCustomerToken(token).then(function (valid) {
      if (!valid) {
        localStorage.removeItem("monami_customer_token");
        openAuthModal(window.lastAIRecommendations[0].id, 1);
        return;
      }

      window.lastAIRecommendations.forEach(function (product) {
        addToCart(product.id, 1, {
          openCart: false,
        });
      });

      showToast({
        title: "AI-подборка добавлена",
        message: "Все блюда добавлены в корзину",
        tone: "success",
        action: "Корзина",
      });
    });
  }

  function addAIUserMessage(message) {
    if (!els.aiMessages) return;

    var messageElement = document.createElement("div");
    var text = document.createElement("p");

    messageElement.className = "ai-user-message";
    text.textContent = message;
    messageElement.appendChild(text);
    els.aiMessages.appendChild(messageElement);

    scrollAIChat();
  }

  function addAIBotMessage(data) {
    if (!els.aiMessages) return;

    var messageElement = document.createElement("div");
    var avatar = document.createElement("div");
    var content = document.createElement("div");
    var name = document.createElement("span");
    var text = document.createElement("p");
    var recommendationCount = data.recommendations.length;

    messageElement.className = "ai-message ai-message-bot";
    avatar.className = "ai-mini-avatar";
    avatar.textContent = "✦";
    content.className = "ai-message-content";
    name.className = "ai-name";
    name.textContent = "Mon Ami AI";
    text.textContent =
      "Я подобрал " +
      recommendationCount +
      " блюд для вас. Проверьте подборку ниже ✦";

    content.appendChild(name);
    content.appendChild(text);
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    els.aiMessages.appendChild(messageElement);

    scrollAIChat();
  }

  function addAIBotMessageError() {
    if (!els.aiMessages) return;

    var messageElement = document.createElement("div");
    var avatar = document.createElement("div");
    var content = document.createElement("div");
    var name = document.createElement("span");
    var text = document.createElement("p");

    messageElement.className = "ai-message ai-message-bot";
    avatar.className = "ai-mini-avatar";
    avatar.textContent = "✦";
    content.className = "ai-message-content";
    name.className = "ai-name";
    name.textContent = "Mon Ami AI";
    text.textContent =
      "Не получилось подобрать блюда. Попробуйте сформулировать запрос немного иначе.";

    content.appendChild(name);
    content.appendChild(text);
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    els.aiMessages.appendChild(messageElement);

    scrollAIChat();
  }

  function scrollAIChat() {
    if (!els.aiMessages) return;

    els.aiMessages.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  function renderAIRecommendations(data) {
    window.lastAIRecommendations = data.recommendations;
    data.recommendations.forEach(function (product) {
      if (!aiShownProductIds.includes(product.id)) {
        aiShownProductIds.push(product.id);
      }
    });

    console.log("AI REQUEST:", data.request);
    console.log("AI RECOMMENDATIONS:", data.recommendations);
    if (!els.aiProducts || !els.aiTotal || !els.aiResult) return;

    els.aiProducts.innerHTML = "";
    els.aiTotal.textContent = data.total + " сом";

    data.recommendations.forEach(function (product) {
      var card = document.createElement("div");
      var image = document.createElement("img");
      var info = document.createElement("div");
      var name = document.createElement("h3");
      var description = document.createElement("p");
      var price = document.createElement("strong");
      var addButton = document.createElement("button");

      card.className = "ai-product-card";
      image.src = getProductImage(productById.get(product.id) || product);
      image.alt = product.name;
      info.className = "ai-product-info";
      name.textContent = product.name;
      description.textContent = product.description;
      price.textContent = product.price + " сом";
      addButton.className = "ai-product-add";
      addButton.textContent = "Добавить";
      addButton.type = "button";

      addButton.addEventListener("click", function () {
        handleAddToCart(product.id, 1);
      });

      info.appendChild(name);
      info.appendChild(description);
      info.appendChild(price);
      info.appendChild(addButton);
      card.appendChild(image);
      card.appendChild(info);
      els.aiProducts.appendChild(card);
    });

    els.aiResult.hidden = false;
  }
})();
