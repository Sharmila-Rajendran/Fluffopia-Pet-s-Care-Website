// ============================
// 💬 Chatbot Logic
// ============================
const chatInput = document.getElementById("chatInput");
const chatbox = document.getElementById("chatboxBody");
const sendBtn = document.getElementById("sendBtn");

function sendMessage(message, sender = "user") {
  const div = document.createElement("div");
  div.className = `text-${sender === "user" ? "end" : "start"} mb-2`;
  div.innerHTML = `<span class="badge bg-${sender === "user" ? "primary" : "secondary"}">${message}</span>`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

if (sendBtn && chatInput) {
  sendBtn.addEventListener("click", () => {
    const msg = chatInput.value.trim();
    if (msg !== "") {
      sendMessage(msg, "user");
      chatInput.value = "";
      setTimeout(() => {
        sendMessage("Thanks for your message. We'll get back to you shortly.", "bot");
      }, 800);
    }
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });
}

// ============================
// ✅ Toast Notification
// ============================
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast-popup";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    toast.remove();
  }, 3000);
}

// ============================
// ✅ Animation on Scroll
// ============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.animate').forEach(el => observer.observe(el));

// ============================
// 📩 Contact Form
// ============================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    showToast("Your message has been sent! 🐾");
    this.reset();
  });
}

// ============================
// 🛒 Cart Logic
// ============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? "inline-block" : "none";
  }
}

// ✅ Add to Cart
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.title;
    const price = parseFloat(btn.dataset.price);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showToast(`${name} added to cart!`);
  });
});

// Initial cart count on load
updateCartCount();

// ✅ Cart Page Logic
function renderCartPage() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");

  if (!cartItemsContainer || !cartTotalEl) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty 🐾</p>";
    cartTotalEl.textContent = "";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "mb-3 border-bottom pb-2";
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>${item.name}</strong><br>
          <span>₹${item.price} × ${item.quantity}</span>
          <div class="d-flex align-items-center mt-2 gap-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQty(${index})">−</button>
            <span>${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="increaseQty(${index})">+</button>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeCartPageItem(${index})">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = `Total: ₹${total.toFixed(2)}`;
}

function increaseQty(index) {
  cart[index].quantity++;
  saveCart();
  renderCartPage();
  updateCartCount();
}

function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  renderCartPage();
  updateCartCount();
}

function removeCartPageItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartPage();
  updateCartCount();
}

// Clear Cart
const clearCartBtn = document.getElementById("clearCart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCartPage();
    updateCartCount();
  });
}

// Render cart if on cart.html
renderCartPage();

// ============================
// 🛍️ Checkout Page Logic
// ============================
function renderCheckoutPage() {
  const checkoutCartItems = document.getElementById("checkoutCartItems");
  const checkoutCartTotal = document.getElementById("checkoutCartTotal");

  if (!checkoutCartItems || !checkoutCartTotal) return;

  checkoutCartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    checkoutCartItems.innerHTML = "<p>Your cart is empty 🐾</p>";
    checkoutCartTotal.textContent = "";
    return;
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "mb-2 border-bottom pb-2";
    div.innerHTML = `
      <div class="d-flex justify-content-between">
        <span>${item.name} × ${item.quantity}</span>
        <span>₹${itemTotal.toFixed(2)}</span>
      </div>
    `;
    checkoutCartItems.appendChild(div);
  });

  checkoutCartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
}

const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("lastOrder", JSON.stringify(cart));
    cart = [];
    saveCart();
    updateCartCount();
    window.location.href = "checkout.html?order=success";
  });

  renderCheckoutPage();
}

// ============================
// ✅ Show Last Order Summary
// ============================
const lastOrderSummary = document.getElementById("lastOrderSummary");
if (lastOrderSummary && new URLSearchParams(window.location.search).get("order") === "success") {
  const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
  if (lastOrder && lastOrder.length > 0) {
    let total = 0;
    let html = `<h3 class="mb-3">✅ Order Confirmed</h3>
                <p>Thank you for your order! Here's your invoice:</p>
                <ul class="list-group mb-3">`;

    lastOrder.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      html += `<li class="list-group-item d-flex justify-content-between align-items-center">
                 ${item.name} × ${item.quantity}
                 <span>₹${itemTotal.toFixed(2)}</span>
               </li>`;
    });

    html += `</ul><h5>Total Paid: ₹${total.toFixed(2)}</h5>`;
    lastOrderSummary.innerHTML = html;
  } else {
    lastOrderSummary.innerHTML = "<p>No recent order found.</p>";
  }
}

// ============================
// 🔍 Product Search
// ============================
const searchInput = document.getElementById("productSearch");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const search = searchInput.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
      const name = card.querySelector("h4")?.textContent.toLowerCase() || "";
      card.style.display = name.includes(search) ? "block" : "none";
    });
  });
}

// ============================
// 💳 Buy Now Button
// ============================
document.querySelectorAll(".buy-now").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.title;
    const price = parseFloat(btn.dataset.price);
    cart = [{ name, price, quantity: 1 }];
    saveCart();
    updateCartCount();
    window.location.href = "checkout.html";
  });
});

// ============================
// 🔗 Smooth Scroll
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById(this.getAttribute("href").substring(1));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ============================
// ☀️ Dark Mode
// ============================
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark);
    darkModeToggle.textContent = isDark ? "🌞 Light Mode" : "🌙 Dark Mode";
    document.querySelectorAll(".dark-mode-toggle").forEach(el => {
      el.classList.toggle("dark-mode", isDark);
    });
  });

  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "🌞 Light Mode";
    document.querySelectorAll(".dark-mode-toggle").forEach(el => {
      el.classList.add("dark-mode");
    });
  }
}

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    // Toggle active class on buttons
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Loop through each category block
    document.querySelectorAll(".product-category").forEach(categoryBlock => {
      const productCards = categoryBlock.querySelectorAll(".product-card");
      let visibleCount = 0;

      productCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      // Show the whole category only if it has visible products
      categoryBlock.style.display = visibleCount > 0 ? "block" : "none";
    });
  });
});



