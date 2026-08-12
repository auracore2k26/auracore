/* ==========================================================================
   GreenLeaf Organics - Interactive E-Commerce & Checkout Guard Logic
   ========================================================================== */

// Product Data Registry
const products = [
  // Vetiver Products
  { id: 'v1', name: 'Vetiver Grow Bag Small Size (20 x 30 inches)', unit: 'Per Bag', price: 26, category: 'vetiver', image: 'assets/images/vetiver_grow_bag.jpg', badge: 'Popular' },
  { id: 'v2', name: 'Kushmol Vetiver Saplings', unit: '1 Bundle (50 Pieces)', price: 300, category: 'vetiver', image: 'assets/images/vetiver_grow_bag.jpg', badge: 'Best Value' },
  { id: 'v3', name: 'Kushmol Vetiver', unit: 'Dried Root (Per Kg)', price: 300, category: 'vetiver', image: 'assets/images/vetiver_dried_roots.jpg', badge: 'Organic' },
  { id: 'v4', name: 'Wholesale Kushmol Vetiver Root', unit: 'Minimum Quantity 50 Kg', price: 250, category: 'vetiver', image: 'assets/images/vetiver_dried_roots.jpg', badge: 'Wholesale' },
  { id: 'v5', name: 'Vetiver Grow Bag Big Size (24 x 36 inches)', unit: 'Per Bag', price: 36, category: 'vetiver', image: 'assets/images/vetiver_grow_bag.jpg', badge: '' },
  { id: 'v6', name: 'Kushmol Vetiver Saplings', unit: 'Per Plant', price: 8, category: 'vetiver', image: 'assets/images/vetiver_grow_bag.jpg', badge: '' },
  { id: 'v7', name: 'Vetiver Malai', unit: 'Aromatic Root Garland', price: 150, category: 'vetiver', image: 'assets/images/vetiver_dried_roots.jpg', badge: 'Handmade' },

  // Fertilisers
  { id: 'f1', name: 'Fish Amino', unit: '500ml Bottle', price: 250, category: 'fertiliser', image: 'assets/images/organic_fertilizer.jpg', badge: '100% Bio' },
  { id: 'f2', name: 'Panjakavya', unit: '1 Litre Bottle', price: 250, category: 'fertiliser', image: 'assets/images/organic_fertilizer.jpg', badge: 'Traditional' },
  { id: 'f3', name: 'Neem Oil', unit: 'Cold Pressed 250ml', price: 250, category: 'fertiliser', image: 'assets/images/organic_fertilizer.jpg', badge: 'Pure' },
  { id: 'f4', name: 'Seaweed', unit: '500ml Liquid Extract', price: 250, category: 'fertiliser', image: 'assets/images/organic_fertilizer.jpg', badge: '' },
  { id: 'f5', name: 'Organic Complex', unit: '50 Kg Bag', price: 1200, category: 'fertiliser', image: 'assets/images/organic_fertilizer.jpg', badge: 'Bulk Pack' },
  { id: 'f6', name: 'Humic', unit: '1 Kg Pack', price: 850, category: 'fertiliser', image: 'assets/images/organic_fertilizer.jpg', badge: '' },

  // Seeds
  { id: 's1', name: 'Siru Keerai Seeds', unit: 'High Germination Seeds', price: 20, category: 'seeds', image: 'assets/images/keerai_seeds.jpg', badge: 'Fresh' },
  { id: 's2', name: 'Thandu Keerai Seeds', unit: 'High Germination Seeds', price: 20, category: 'seeds', image: 'assets/images/keerai_seeds.jpg', badge: 'Fresh' },
  { id: 's3', name: 'Agathi Keerai Seeds', unit: 'High Germination Seeds', price: 20, category: 'seeds', image: 'assets/images/keerai_seeds.jpg', badge: 'Fresh' },
  { id: 's4', name: 'Arai Keerai Seeds', unit: 'High Germination Seeds', price: 20, category: 'seeds', image: 'assets/images/keerai_seeds.jpg', badge: 'Fresh' }
];

window.defaultProducts = products;

function getAllProducts() {
  if (window.db && typeof window.db.getProducts === 'function') {
    const dbProds = window.db.getProducts();
    if (dbProds && dbProds.length > 0) return dbProds;
  }
  return products;
}

// App State
let cart = [];
let wishlist = new Set();
let currentSlide = 0;

// SVG Icons
const cartSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;

// --- Wishlist Functions ---
window.toggleWishlist = function(productId, event) {
  if (event) event.stopPropagation();
  const currentProducts = getAllProducts();
  const prod = currentProducts.find(p => p.id === productId);
  if (!prod) return;

  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    showToast(`Removed "${window.escapeHTML ? window.escapeHTML(prod.name) : prod.name}" from Wishlist.`);
  } else {
    wishlist.add(productId);
    showToast(`❤️ Added "${window.escapeHTML ? window.escapeHTML(prod.name) : prod.name}" to Wishlist!`);
  }
  updateWishlistUI();
  renderProducts();
};

window.updateWishlistUI = function() {
  const badge = document.getElementById('wishlistBadge');
  const countText = document.getElementById('wishlistHeaderCount');
  if (badge) badge.textContent = wishlist.size;
  if (countText) countText.textContent = `${wishlist.size} Saved`;

  const container = document.getElementById('wishlistItemsList');
  if (!container) return;

  if (wishlist.size === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">Your Wishlist is empty. ❤️ Click the heart icon on any product to save it for later!</div>`;
    return;
  }

  const currentProducts = getAllProducts();
  const savedItems = currentProducts.filter(p => wishlist.has(p.id));

  container.innerHTML = savedItems.map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--border-color); background: #fff; border-radius: 8px; margin-bottom: 8px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${item.image}" alt="${window.escapeHTML ? window.escapeHTML(item.name) : item.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 6px;">
        <div>
          <h4 style="font-size: 0.88rem; color: var(--primary);">${window.escapeHTML ? window.escapeHTML(item.name) : item.name}</h4>
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">₹${item.price} / ${window.escapeHTML ? window.escapeHTML(item.unit) : item.unit}</div>
        </div>
      </div>
      <div style="display: flex; gap: 6px;">
        <button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="addToCart('${item.id}')">Add to Cart</button>
        <button style="background: none; border: none; color: #dc3545; font-size: 1.2rem; cursor: pointer;" onclick="toggleWishlist('${item.id}')">&times;</button>
      </div>
    </div>
  `).join('');
};

window.openWishlistDrawer = function() {
  const overlay = document.getElementById('wishlistOverlay');
  const drawer = document.getElementById('wishlistDrawer');
  if (overlay) overlay.classList.add('open');
  if (drawer) drawer.classList.add('open');
  updateWishlistUI();
};

window.closeWishlistDrawer = function() {
  const overlay = document.getElementById('wishlistOverlay');
  const drawer = document.getElementById('wishlistDrawer');
  if (overlay) overlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
};

// --- Password Visibility Toggle ---
window.togglePasswordVisibility = function(fieldId, btn) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  if (field.type === 'password') {
    field.type = 'text';
    btn.textContent = '🙈';
  } else {
    field.type = 'password';
    btn.textContent = '👁️';
  }
};

window.applySiteSettings = function() {
  if (!window.db || !window.db.getSiteSettings) return;
  const settings = window.db.getSiteSettings();
  if (!settings) return;

  // 1. Update Brand Logo & Title
  const brandNameEls = document.querySelectorAll('.brand-name');
  brandNameEls.forEach(el => el.textContent = settings.store_name || 'GreenLeaf Organics');

  const brandTaglineEls = document.querySelectorAll('.brand-tagline');
  brandTaglineEls.forEach(el => el.textContent = settings.store_tagline || 'ORGANICS');

  const brandLogoLink = document.querySelector('a.brand-logo');
  if (brandLogoLink) {
    if (settings.logo_url) {
      brandLogoLink.innerHTML = `
        <img src="${settings.logo_url}" alt="${settings.store_name}" style="max-height: 48px; max-width: 160px; object-fit: contain; border-radius: 6px;">
        <div class="brand-title">
          <span class="brand-name">${settings.store_name}</span>
          <span class="brand-tagline">${settings.store_tagline}</span>
        </div>
      `;
    }
  }

  // 2. Update Top Bar Announcement Text
  const topBarItemSpan = document.querySelector('.top-bar-center .top-bar-item span');
  if (topBarItemSpan && settings.announcement_text) {
    topBarItemSpan.textContent = settings.announcement_text;
  }

  // 3. Update Support Phone
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  if (phoneLinks && settings.support_phone) {
    phoneLinks.forEach(link => {
      link.href = `tel:${settings.support_phone.replace(/\s+/g, '')}`;
      link.textContent = settings.support_phone;
    });
  }

  // 4. Update Support Email
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (emailLinks && settings.support_email) {
    emailLinks.forEach(link => {
      link.href = `mailto:${settings.support_email}`;
      link.textContent = settings.support_email;
    });
  }

  // 5. Update Floating WhatsApp Link
  const waFloatBtn = document.getElementById('whatsappFloatBtn');
  if (waFloatBtn && settings.support_phone) {
    const cleanPhone = settings.support_phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    waFloatBtn.href = `https://wa.me/${phoneWithCountry}?text=Hello%20${encodeURIComponent(settings.store_name || 'GreenLeaf Organics')},%20I%20want%20to%20order%20products%20/%20enquire.`;
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  applySiteSettings();
  renderProducts();
  setupSlider();
  setupEventListeners();
  updateCartUI();
  updateWishlistUI();
  if (window.auth) window.auth.onAuthStateChanged(window.auth.currentUser);
});

// Render Products Grid
function renderProducts() {
  const currentProducts = getAllProducts();
  const vetiverContainer = document.getElementById('vetiver-grid');
  const fertiliserContainer = document.getElementById('fertiliser-grid');
  const seedsContainer = document.getElementById('seeds-grid');

  if (vetiverContainer) vetiverContainer.innerHTML = generateProductHTML(currentProducts.filter(p => p.category === 'vetiver'));
  if (fertiliserContainer) fertiliserContainer.innerHTML = generateProductHTML(currentProducts.filter(p => p.category === 'fertiliser'));
  if (seedsContainer) seedsContainer.innerHTML = generateProductHTML(currentProducts.filter(p => p.category === 'seeds'));

  // Dynamically render custom categories added via Admin Panel
  const defaultCats = ['vetiver', 'fertiliser', 'seeds'];
  const allCats = Array.from(new Set(currentProducts.map(p => (p.category || 'general').toLowerCase().trim())));
  const customCats = allCats.filter(c => !defaultCats.includes(c));

  let customContainer = document.getElementById('custom-categories-container');
  if (!customContainer) {
    customContainer = document.createElement('div');
    customContainer.id = 'custom-categories-container';
    const main = document.querySelector('main.container');
    if (main) main.appendChild(customContainer);
  }

  if (customContainer) {
    customContainer.innerHTML = customCats.map(cat => {
      const catProducts = currentProducts.filter(p => (p.category || '').toLowerCase().trim() === cat);
      if (catProducts.length === 0) return '';

      const title = cat.charAt(0).toUpperCase() + cat.slice(1);
      return `
        <section class="section-padding" id="${cat}-section">
          <div class="section-header">
            <h2 class="section-title">${window.escapeHTML ? window.escapeHTML(title) : title}</h2>
            <p class="section-subtitle">Premium ${window.escapeHTML ? window.escapeHTML(title) : title} products for your farm and garden</p>
          </div>
          <div class="product-grid">
            ${generateProductHTML(catProducts)}
          </div>
        </section>
      `;
    }).join('');
  }
}

function generateProductHTML(items) {
  return items.map(product => {
    const isWishlisted = wishlist.has(product.id);
    const prodName = window.escapeHTML ? window.escapeHTML(product.name) : product.name;
    const prodUnit = window.escapeHTML ? window.escapeHTML(product.unit) : product.unit;
    const prodBadge = product.badge ? (window.escapeHTML ? window.escapeHTML(product.badge) : product.badge) : '';

    return `
      <div class="product-card" data-id="${product.id}" style="position: relative;">
        ${prodBadge ? `<span class="product-badge">${prodBadge}</span>` : ''}
        <button style="position: absolute; top: 10px; right: 10px; background: #ffffff; border: 1px solid var(--border-color); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; box-shadow: var(--shadow-sm);" onclick="toggleWishlist('${product.id}', event)" title="Save to Wishlist">
          <span style="font-size: 1rem; color: ${isWishlisted ? '#dc3545' : '#ccc'};">${isWishlisted ? '❤️' : '🤍'}</span>
        </button>
        <div class="product-img-container" onclick="openQuickView('${product.id}')">
          <img src="${product.image}" alt="${prodName}" loading="lazy">
        </div>
        <h3 class="product-title" onclick="openQuickView('${product.id}')">${prodName}</h3>
        <div class="product-unit">${prodUnit}</div>
        <div class="product-bottom">
          <span class="product-price">₹${product.price}</span>
          <button class="add-cart-btn" onclick="addToCart('${product.id}')" title="Add to Cart">
            ${cartSvg}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Hero Slider Functions
function setupSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const track = document.getElementById('slideTrack');
  const totalSlides = slides.length;

  if (!track || totalSlides === 0) return;

  window.goToSlide = function(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  };

  window.nextSlide = function() { window.goToSlide(currentSlide + 1); };
  window.prevSlide = function() { window.goToSlide(currentSlide - 1); };

  if (window.sliderInterval) clearInterval(window.sliderInterval);
  window.sliderInterval = setInterval(() => { window.nextSlide(); }, 5000);
}

// Cart Functions
window.addToCart = function(productId) {
  const currentProducts = getAllProducts();
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`Added "${product.name}" to cart!`);
  openCartDrawer();
};

window.updateQuantity = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  updateCartUI();
};

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadge');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartHeaderTotal = document.getElementById('cartHeaderTotal');
  const cartItemsList = document.getElementById('cartItemsList');
  const shippingFill = document.getElementById('shippingFill');
  const shippingText = document.getElementById('shippingText');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartBadge) cartBadge.textContent = totalCount;
  if (cartSubtotal) cartSubtotal.textContent = `₹${totalPrice}`;
  if (cartHeaderTotal) cartHeaderTotal.textContent = `₹${totalPrice}`;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  if (shippingFill) shippingFill.style.width = `${progressPercent}%`;

  if (shippingText) {
    if (totalPrice >= freeShippingThreshold) {
      shippingText.textContent = "🎉 Congratulations! You unlocked FREE Shipping!";
    } else {
      const remaining = freeShippingThreshold - totalPrice;
      shippingText.textContent = `Add ₹${remaining} more to get FREE Shipping!`;
    }
  }

  if (cartItemsList) {
    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <svg style="width: 48px; height: 48px; margin-bottom: 12px; stroke: #a3c4ab; fill: none;" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
          <p>Your shopping cart is empty.</p>
        </div>
      `;
    } else {
      cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" class="cart-item-img" alt="${item.name}">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">₹${item.price * item.quantity} (${item.unit})</div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
              <span style="font-weight: 700; font-size: 0.9rem;">${item.quantity}</span>
              <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

// Drawer & Modal Triggers
window.openCartDrawer = function() {
  document.getElementById('cartOverlay')?.classList.add('open');
  document.getElementById('cartDrawer')?.classList.add('open');
};

window.closeCartDrawer = function() {
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.getElementById('cartDrawer')?.classList.remove('open');
};

// --- AUTHENTICATION MODAL (LOGIN / REGISTER / FORGOT) ---
window.openAuthModal = function(type = 'login', promptMessage = '') {
  const isLogin = type === 'login';
  const isForgot = type === 'forgot';

  const modalHTML = `
    <div class="modal-overlay open" id="authOverlay" onclick="closeAuthModal()">
      <div style="position: relative; background: #fff; width: 92%; max-width: 440px; margin: 40px auto; padding: 28px; border-radius: 12px; box-shadow: var(--shadow-lg);" onclick="event.stopPropagation()">
        <button style="position: absolute; top: 16px; right: 16px; font-size: 1.5rem; background: none; border: none; cursor: pointer;" onclick="closeAuthModal()">&times;</button>
        
        <h3 style="color: var(--primary); margin-bottom: 6px; font-size: 1.35rem;">
          ${isForgot ? '🔑 Reset Your Password' : (isLogin ? 'Customer Login' : 'Create Customer Account')}
        </h3>
        ${promptMessage ? `<p style="color: #d97706; font-size: 0.85rem; font-weight: 600; margin-bottom: 14px; background: #fff3cd; padding: 8px; border-radius: 6px;">⚠️ ${promptMessage}</p>` : ''}

        ${isForgot ? `
          <form onsubmit="handleAuthForgot(event)">
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">Enter your registered Email or Mobile Number to reset your password.</p>
            <div class="form-group">
              <label>Email Address or Mobile Number *</label>
              <input type="text" id="forgotIdentifier" class="input-field" placeholder="e.g. kumar@example.com / 9876543210" required>
            </div>
            <div class="form-group">
              <label>New Password (Min 6 Characters) *</label>
              <div class="password-input-wrapper">
                <input type="password" id="forgotNewPassword" class="input-field" style="width: 100%;" placeholder="Enter new password" required>
                <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('forgotNewPassword', this)">👁️</button>
              </div>
            </div>
            <div id="authErrorMsg" style="color: #dc3545; font-size: 0.825rem; margin-bottom: 12px; display: none; text-align: center;"></div>
            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;">Update Password & Login</button>
          </form>
        ` : `
          <form onsubmit="${isLogin ? 'handleAuthLogin(event)' : 'handleAuthRegister(event)'}">
            ${!isLogin ? `
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" id="regName" class="input-field" placeholder="e.g. Kumar Selvam" required>
              </div>
            ` : ''}

            <div class="form-group">
              <label>Email Address or Mobile Number *</label>
              <input type="text" id="authIdentifier" class="input-field" placeholder="e.g. kumar@example.com / 9876543210" required>
            </div>

            ${!isLogin ? `
              <div class="form-group">
                <label>Mobile Number *</label>
                <input type="tel" id="regMobile" class="input-field" placeholder="10-digit mobile number" required>
              </div>
            ` : ''}

            <div class="form-group">
              <label>Password *</label>
              <div class="password-input-wrapper">
                <input type="password" id="authPassword" class="input-field" style="width: 100%;" placeholder="Enter password" required>
                <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('authPassword', this)">👁️</button>
              </div>
            </div>

            ${!isLogin ? `
              <div class="form-group">
                <label>Confirm Password *</label>
                <div class="password-input-wrapper">
                  <input type="password" id="regConfirmPassword" class="input-field" style="width: 100%;" placeholder="Re-enter password" required>
                  <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('regConfirmPassword', this)">👁️</button>
                </div>
              </div>
            ` : `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; margin-bottom: 16px;">
                <label style="display: flex; align-items: center; gap: 6px;">
                  <input type="checkbox" checked> Remember Me
                </label>
                <a href="#" style="color: var(--primary); font-weight: 600;" onclick="openAuthModal('forgot')">Forgot Password?</a>
              </div>
            `}

            <div id="authErrorMsg" style="color: #dc3545; font-size: 0.825rem; margin-bottom: 12px; display: none; text-align: center;"></div>

            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;">
              ${isLogin ? 'Login to Account' : 'Register & Login'}
            </button>
          </form>
        `}

        <div style="text-align: center; margin-top: 20px; font-size: 0.875rem; border-top: 1px solid var(--border-color); padding-top: 16px;">
          ${isLogin ? `
            Don't have an account? <a href="#" style="color: var(--primary); font-weight: 700;" onclick="openAuthModal('register', '${promptMessage}')">Create New Account</a>
          ` : `
            Already have an account? <a href="#" style="color: var(--primary); font-weight: 700;" onclick="openAuthModal('login', '${promptMessage}')">Login Here</a>
          `}
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;
};

window.handleAuthForgot = function(e) {
  e.preventDefault();
  const id = document.getElementById('forgotIdentifier').value.trim();
  const newPwd = document.getElementById('forgotNewPassword').value.trim();

  if (newPwd.length < 6) {
    const errBox = document.getElementById('authErrorMsg');
    if (errBox) { errBox.textContent = 'Password must be at least 6 characters long.'; errBox.style.display = 'block'; }
    return;
  }

  const customer = window.db.findCustomerByEmailOrMobile(id);
  if (!customer) {
    const errBox = document.getElementById('authErrorMsg');
    if (errBox) { errBox.textContent = 'No account found with this Email or Mobile Number.'; errBox.style.display = 'block'; }
    return;
  }

  customer.password_hash = newPwd;
  window.db.patchToSupabase('customers', `id=eq.${customer.id}`, { password_hash: newPwd });

  showToast('Password updated successfully! Logging you in...');
  closeAuthModal();
  window.auth.login(id, newPwd);
};

window.closeAuthModal = function() {
  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = '';
};

window.handleAuthLogin = function(e) {
  e.preventDefault();
  const id = document.getElementById('authIdentifier').value;
  const pwd = document.getElementById('authPassword').value;

  const res = window.auth.login(id, pwd);
  if (res.success) {
    showToast(`Welcome back, ${res.user.full_name}!`);
    closeAuthModal();
    if (window.pendingCheckout) {
      window.pendingCheckout = false;
      openCheckoutModal();
    }
  } else {
    const errBox = document.getElementById('authErrorMsg');
    if (errBox) {
      errBox.textContent = res.message;
      errBox.style.display = 'block';
    }
  }
};

window.handleAuthRegister = function(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('authIdentifier').value;
  const mobile = document.getElementById('regMobile').value;
  const pwd = document.getElementById('authPassword').value;
  const confirmPwd = document.getElementById('regConfirmPassword').value;

  const res = window.auth.register({
    full_name: name,
    email: email,
    mobile: mobile,
    password: pwd,
    confirm_password: confirmPwd
  });

  if (res.success) {
    showToast(`Account created successfully! Welcome, ${res.user.full_name}.`);
    closeAuthModal();
    if (window.pendingCheckout) {
      window.pendingCheckout = false;
      openCheckoutModal();
    }
  } else {
    const errBox = document.getElementById('authErrorMsg');
    if (errBox) {
      errBox.textContent = res.message;
      errBox.style.display = 'block';
    }
  }
};

// --- CHECKOUT AUTHENTICATION GUARD & MODAL ---
window.proceedToCheckout = function() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  closeCartDrawer();
  openCheckoutModal();
};

function openCheckoutModal() {
  const user = window.auth.currentUser || { full_name: '', email: '', mobile: '' };
  const paySettings = window.db.getPaymentSettings ? window.db.getPaymentSettings() : { upi_enabled: true, card_enabled: true, cod_enabled: true };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = totalPrice >= 999 ? 0 : 50;
  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + deliveryCharge + tax;

  const modalHTML = `
    <div class="modal-overlay open" id="checkoutOverlay" onclick="closeCheckoutModal()">
      <div style="position: relative; background: #fff; width: 92%; max-width: 620px; margin: 30px auto; padding: 24px; border-radius: 12px; box-shadow: var(--shadow-lg);" onclick="event.stopPropagation()">
        <button style="position: absolute; top: 16px; right: 16px; font-size: 1.5rem; background: none; border: none; cursor: pointer;" onclick="closeCheckoutModal()">&times;</button>
        
        <h3 style="color: var(--primary); margin-bottom: 4px;">🚚 Delivery Address & Order Details</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
          ${user.full_name ? `Logged in as: <strong>${user.full_name} (${user.mobile || user.email})</strong>` : 'Enter your name & delivery address below to place order:'}
        </p>

        <form onsubmit="handlePlaceOrder(event, ${totalPrice}, ${deliveryCharge}, ${tax}, ${grandTotal})">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label>Your Full Name *</label>
              <input type="text" id="coName" class="input-field" placeholder="e.g. Ramakrishnan" value="${user.full_name || ''}" required>
            </div>
            <div class="form-group">
              <label>Mobile Phone Number *</label>
              <input type="tel" id="coMobile" class="input-field" placeholder="10-digit mobile number" value="${user.mobile || ''}" required>
            </div>
          </div>

          <div class="form-group">
            <label>Delivery Address (Door No, Street, Area) *</label>
            <input type="text" id="coAddress" class="input-field" placeholder="e.g. No. 12, Main Road, Near Bus Stand" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label>City / Town *</label>
              <input type="text" id="coCity" class="input-field" placeholder="e.g. Madurai" required>
            </div>
            <div class="form-group">
              <label>State *</label>
              <input type="text" id="coState" class="input-field" value="Tamil Nadu" required>
            </div>
            <div class="form-group">
              <label>Pincode *</label>
              <input type="text" id="coPincode" class="input-field" placeholder="625001" required>
            </div>
          </div>

          <div class="form-group">
            <label>Payment Method *</label>
            <select id="coPaymentMethod" class="input-field" required>
              ${paySettings.upi_enabled !== false ? `<option value="UPI / Online Payment (GPay, PhonePe, Paytm)">📲 PhonePe / Google Pay / Paytm / UPI QR</option>` : ''}
              ${paySettings.card_enabled !== false ? `<option value="Debit / Credit Card">💳 Debit / Credit Card</option>` : ''}
              ${paySettings.cod_enabled === true ? `<option value="Cash on Delivery (COD)">💵 Cash on Delivery (COD)</option>` : ''}
            </select>
          </div>

          <!-- Order Cost Summary Box -->
          <div style="background: var(--accent-light); padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #d1e3d6; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Subtotal (${cart.length} items):</span>
              <span>₹${totalPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Delivery Charge:</span>
              <span>${deliveryCharge === 0 ? 'FREE' : '₹' + deliveryCharge}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>GST Tax (5% Included):</span>
              <span>₹${tax}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; color: var(--primary); border-top: 1px solid #b8d6bf; padding-top: 6px;">
              <span>Total Payable Amount:</span>
              <span>₹${grandTotal}</span>
            </div>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; font-size: 1.05rem;">
            Proceed to Payment (₹${grandTotal}) →
          </button>
        </form>
      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;
}

window.closeCheckoutModal = function() {
  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = '';
};

window.handlePlaceOrder = function(e, subtotal, deliveryCharge, tax, totalAmount) {
  e.preventDefault();
  const user = window.auth.currentUser;

  const address = `${document.getElementById('coAddress').value}, ${document.getElementById('coCity').value}, ${document.getElementById('coState').value} - ${document.getElementById('coPincode').value}`;
  const paymentMethod = document.getElementById('coPaymentMethod').value;
  const customerName = document.getElementById('coName').value;
  const customerMobile = document.getElementById('coMobile').value;

  const userId = user && user.id ? user.id : 'guest_' + Date.now();
  const userEmail = user && user.email ? user.email : (customerMobile + '@guest.com');

  const pendingOrder = {
    user_id: userId,
    customer_name: customerName,
    customer_email: userEmail,
    customer_mobile: customerMobile,
    delivery_address: address,
    subtotal: subtotal,
    delivery_charge: deliveryCharge,
    tax: tax,
    total_amount: totalAmount,
    payment_method: paymentMethod
  };

  // Check if UPI / Online Payment selected
  if (paymentMethod.includes('UPI') || paymentMethod.includes('Online') || paymentMethod.includes('PhonePe')) {
    closeCheckoutModal();
    openUPIPaymentQRModal(pendingOrder);
  } else {
    // Cash on Delivery / Card
    const newOrder = window.db.createOrder(pendingOrder, cart);
    showToast(`Order #${newOrder.order_number} placed successfully! 🎉`);
    cart = [];
    updateCartUI();
    closeCheckoutModal();
    if (window.auth.currentUser) {
      openDashboard('orders');
    }
  }
};

// --- LIVE UPI QR PAYMENT GATEWAY WITH DIRECT APP BUTTONS ---
window.upiTimerInterval = null;

window.triggerUPIPay = function(appName, upiId, amount) {
  const encUPI = encodeURIComponent(upiId);
  const upiUrl = `upi://pay?pa=${encUPI}&pn=GreenLeaf%20Organics&am=${amount}&cu=INR`;
  
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  let appUrl = upiUrl;

  if (isAndroid) {
    if (appName === 'gpay') {
      appUrl = `intent://pay?pa=${encUPI}&pn=GreenLeaf%20Organics&am=${amount}&cu=INR#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
    } else if (appName === 'phonepe') {
      appUrl = `intent://pay?pa=${encUPI}&pn=GreenLeaf%20Organics&am=${amount}&cu=INR#Intent;scheme=upi;package=com.phonepe.app;end`;
    } else if (appName === 'paytm') {
      appUrl = `intent://pay?pa=${encUPI}&pn=GreenLeaf%20Organics&am=${amount}&cu=INR#Intent;scheme=upi;package=net.one97.paytm;end`;
    }
  } else if (isIOS) {
    if (appName === 'gpay') {
      appUrl = `gpay://upi/pay?pa=${encUPI}&pn=GreenLeaf%20Organics&am=${amount}&cu=INR`;
    } else if (appName === 'phonepe') {
      appUrl = `phonepe://pay?pa=${encUPI}&pn=GreenLeaf%20Organics&am=${amount}&cu=INR`;
    } else if (appName === 'paytm') {
      appUrl = `paytmmp://pay?pa=${encUPI}&pn=GreenLeaf%20Organics&am=${amount}&cu=INR`;
    }
  }

  // Attempt opening target URL, with fallback to standard upi://
  window.location.href = appUrl;

  // Fallback timer if custom scheme isn't handled by browser
  setTimeout(() => {
    if (appUrl !== upiUrl) {
      window.location.href = upiUrl;
    }
  }, 800);
};

window.copyUPIIdToClipboard = function(upiId) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(upiId).then(() => {
      showToast('📋 UPI ID copied! Opening GPay/PhonePe...');
    }).catch(() => {
      prompt('Copy UPI ID:', upiId);
    });
  } else {
    prompt('Copy UPI ID:', upiId);
  }
};

window.openUPIPaymentQRModal = function(pendingOrder) {
  let timeLeftSeconds = 300; // 5 Minutes
  const paySettings = window.db.getPaymentSettings ? window.db.getPaymentSettings() : {};
  const adminUPIId = (paySettings.upi_id && paySettings.upi_id !== 'greenleaforganics@upi') ? paySettings.upi_id : 'adithyarajvalar@okaxis';
  const adminQRImage = paySettings.custom_qr_image || 'assets/images/admin_upi_qr.jpg';

  const modalHTML = `
    <div class="modal-overlay open" id="upiQRModal" onclick="event.stopPropagation()">
      <div style="position: relative; background: #fff; width: 95%; max-width: 460px; margin: 16px auto; padding: 18px 14px; border-radius: 16px; box-shadow: var(--shadow-lg); text-align: center; max-height: 92vh; overflow-y: auto;" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg style="width: 28px; height: 28px; fill: var(--primary);" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
            <h3 style="color: var(--primary); font-size: 1.25rem;">UPI Direct Payment</h3>
          </div>
          <button style="background: none; border: none; font-size: 1.5rem; cursor: pointer;" onclick="closeUPIQRModal()">&times;</button>
        </div>

        <!-- Total Payable Amount Box -->
        <div style="background: var(--accent-light); padding: 14px; border-radius: 10px; margin-bottom: 16px; border: 1px solid #cce3d2;">
          <div style="font-size: 0.825rem; color: var(--text-muted);">Amount to Pay</div>
          <div style="font-size: 1.9rem; font-weight: 800; color: var(--primary);">₹${pendingOrder.total_amount}</div>
          <div style="font-size: 0.8rem; color: var(--text-dark); margin-top: 6px; display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;">
            <span>UPI ID: <strong>${adminUPIId}</strong></span>
            <button type="button" onclick="copyUPIIdToClipboard('${adminUPIId}')" style="background: var(--primary); color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">📋 Copy ID</button>
          </div>
        </div>

        <!-- DIRECT CLICK-TO-OPEN UPI PAYMENT APPS -->
        <div style="margin-bottom: 18px;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-bottom: 10px;">
            📲 மொபைலில் நேரடியாக செயலியைத் திறந்து செலுத்த (Click App to Pay):
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <button type="button" onclick="triggerUPIPay('gpay', '${adminUPIId}', ${pendingOrder.total_amount})" class="upi-app-btn gpay-btn">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.98-3.1z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.98 3.1c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
              Google Pay
            </button>
            <button type="button" onclick="triggerUPIPay('phonepe', '${adminUPIId}', ${pendingOrder.total_amount})" class="upi-app-btn phonepe-btn">
              <span style="font-size: 1.1rem; font-weight: 900;">पे</span>
              PhonePe
            </button>
            <button type="button" onclick="triggerUPIPay('paytm', '${adminUPIId}', ${pendingOrder.total_amount})" class="upi-app-btn paytm-btn">
              <span style="font-size: 0.95rem; font-weight: 800; color: #00b9f1;">Paytm</span>
            </button>
            <button type="button" onclick="triggerUPIPay('bhim', '${adminUPIId}', ${pendingOrder.total_amount})" class="upi-app-btn bhim-btn">
              <span style="font-size: 0.95rem; font-weight: 800;">BHIM</span>
              Any UPI App
            </button>
          </div>

          <div style="background: #fff8e6; border: 1px solid #ffe599; padding: 10px 12px; border-radius: 8px; font-size: 0.78rem; color: #8a6d3b; text-align: left; margin-bottom: 8px;">
            💡 <strong>GPay-ல் "Bank limit exceeded" என்று வந்தால்:</strong><br>
            1. <strong>PhonePe</strong> அல்லது <strong>Paytm</strong> கிளிக் செய்து செலுத்தலாம்.<br>
            2. மேலே உள்ள <strong>"📋 Copy ID"</strong> கொடுத்து GPay-ல் நேரடி UPI முகவரியில் ஒட்டலாம்.<br>
            3. அல்லது கீழே உள்ள <strong>QR Code-ஐ Scan</strong> செய்து சுலபமாக செலுத்தலாம்!
          </div>
        </div>

        <!-- Custom Uploaded Admin QR Code -->
        <div style="border-top: 1px dashed var(--border-color); padding-top: 14px; margin-bottom: 16px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">
            அல்லது QR Code Scan செய்து செலுத்தலாம் (Or Scan QR Code):
          </div>
          <img src="${adminQRImage}" alt="Official Merchant UPI QR Code" style="max-width: 200px; max-height: 200px; width: 100%; object-fit: contain; border-radius: 12px; border: 3px solid var(--primary); padding: 6px; background: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
        </div>

        <!-- Real Customer Payment Verification Form -->
        <form onsubmit="handleUPIPaymentSubmit(event, '${encodeURIComponent(JSON.stringify(pendingOrder))}')">
          <div style="background: #f4f8f5; padding: 14px; border-radius: 8px; border: 1px solid #d1e3d6; margin-bottom: 16px; text-align: left;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--primary); display: block; margin-bottom: 6px;">
              ✍️ Enter 12-Digit UPI Ref / UTR No (Required) *
            </label>
            <input type="text" id="upiTxnInput" class="input-field" style="width: 100%; font-size: 0.95rem; background: #fff;" placeholder="e.g. 421890123456 / UTR Number" required>
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 6px;">
              GPay / PhonePe-ல் பணம் செலுத்திய பின் கிடைக்கும் 12-இலக்க UTR / Ref எண்ணை உள்ளிட்டு Submit செய்யவும்.
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="submit" class="btn-primary" style="width: 100%; font-size: 0.95rem;">
              ✅ Submit Payment UTR & Complete Order
            </button>
            <button type="button" style="background: none; border: none; color: #dc3545; font-size: 0.825rem; font-weight: 600; cursor: pointer; padding: 6px;" onclick="closeUPIQRModal()">
              Cancel Payment
            </button>
          </div>
        </form>

      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;

  // Start 5-Minute Timer Countdown (Informational Timer Only)
  if (window.upiTimerInterval) clearInterval(window.upiTimerInterval);

  window.upiTimerInterval = setInterval(() => {
    timeLeftSeconds--;
    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    const timerDisplay = document.getElementById('upiTimerDisplay');
    if (timerDisplay) {
      timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }

    if (timeLeftSeconds <= 0) {
      clearInterval(window.upiTimerInterval);
      if (timerDisplay) timerDisplay.textContent = '00:00';
    }
  }, 1000);
};

window.handleUPIPaymentSubmit = function(e, encodedOrder) {
  e.preventDefault();
  const utrInput = document.getElementById('upiTxnInput');
  const utr = utrInput ? utrInput.value.trim() : '';

  if (!utr) {
    alert("Please enter the 12-digit UPI UTR / Reference ID after completing payment!");
    return;
  }

  if (window.upiTimerInterval) clearInterval(window.upiTimerInterval);

  const pendingOrder = JSON.parse(decodeURIComponent(encodedOrder));
  pendingOrder.transaction_id = utr;
  pendingOrder.payment_status = 'Pending Verification';

  // Create Order with Customer Provided UTR
  const newOrder = window.db.createOrder(pendingOrder, cart);
  cart = [];
  updateCartUI();

  // Render Payment UTR Submitted Confirmation Screen
  const modalBox = document.querySelector('#upiQRModal > div');
  if (modalBox) {
    modalBox.innerHTML = `
      <div style="padding: 20px 10px; animation: fadeInScale 0.4s ease;">
        <div style="width: 84px; height: 84px; background: #28a745; border-radius: 50%; color: #fff; font-size: 3rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 10px 25px rgba(40,167,69,0.35);">
          ✓
        </div>

        <h2 style="color: #28a745; font-size: 1.7rem; font-weight: 700; margin-bottom: 6px;">Order Submitted Successfully! 🎉</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Your payment UTR reference has been submitted to Admin for verification.</p>

        <div style="background: var(--accent-light); padding: 16px; border-radius: 10px; border: 1px solid #cce3d2; margin-bottom: 24px; text-align: left; font-size: 0.9rem; line-height: 1.7;">
          <div style="display: flex; justify-content: space-between;"><span>Order Number:</span> <strong>#${newOrder.order_number}</strong></div>
          <div style="display: flex; justify-content: space-between;"><span>Amount:</span> <strong style="color: var(--primary); font-size: 1.05rem;">₹${newOrder.total_amount}</strong></div>
          <div style="display: flex; justify-content: space-between;"><span>Payment Method:</span> <strong>UPI QR Code</strong></div>
          <div style="display: flex; justify-content: space-between;"><span>Submitted UTR Ref:</span> <code>${utr}</code></div>
          <div style="display: flex; justify-content: space-between;"><span>Payment Status:</span> <span style="background: #ffc107; color: #333; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">PENDING VERIFICATION</span></div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Redirecting to your orders dashboard in <strong id="redirectCount" style="color: var(--primary); font-size: 1rem;">3</strong> seconds...</p>
        
        <button class="btn-primary" style="width: 100%;" onclick="closeUPIQRModal(); openDashboard('orders');">
          Go to My Orders Dashboard Now
        </button>
      </div>
    `;

    let redirectSecs = 3;
    const redirectTimer = setInterval(() => {
      redirectSecs--;
      const countSpan = document.getElementById('redirectCount');
      if (countSpan) countSpan.textContent = redirectSecs;
      if (redirectSecs <= 0) {
        clearInterval(redirectTimer);
        closeUPIQRModal();
        openDashboard('orders');
      }
    }, 1000);
  }
};

window.closeUPIQRModal = function() {
  if (window.upiTimerInterval) clearInterval(window.upiTimerInterval);
  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = '';
};

function generateUPIQRCodeSVG(upiId, name, amount) {
  return `
    <svg viewBox="0 0 200 200" style="width: 180px; height: 180px; background: #fff; padding: 10px; border-radius: 12px; border: 2px solid var(--primary); box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
      <rect x="10" y="10" width="50" height="50" fill="#0b572a" rx="6"/>
      <rect x="20" y="20" width="30" height="30" fill="#ffffff" rx="3"/>
      <rect x="27" y="27" width="16" height="16" fill="#0b572a" rx="2"/>

      <rect x="140" y="10" width="50" height="50" fill="#0b572a" rx="6"/>
      <rect x="150" y="20" width="30" height="30" fill="#ffffff" rx="3"/>
      <rect x="157" y="27" width="16" height="16" fill="#0b572a" rx="2"/>

      <rect x="10" y="140" width="50" height="50" fill="#0b572a" rx="6"/>
      <rect x="20" y="150" width="30" height="30" fill="#ffffff" rx="3"/>
      <rect x="27" y="157" width="16" height="16" fill="#0b572a" rx="2"/>

      <rect x="70" y="20" width="12" height="12" fill="#187d3d"/>
      <rect x="90" y="20" width="24" height="12" fill="#187d3d"/>
      <rect x="70" y="40" width="24" height="12" fill="#187d3d"/>
      <rect x="100" y="40" width="12" height="24" fill="#187d3d"/>

      <rect x="20" y="70" width="12" height="24" fill="#187d3d"/>
      <rect x="40" y="80" width="24" height="12" fill="#187d3d"/>
      <rect x="70" y="70" width="60" height="60" fill="#f4f8f5" rx="8"/>

      <circle cx="100" cy="100" r="22" fill="#0b572a"/>
      <path d="M100 86 C93 93 90 98 100 112 C110 98 107 93 100 86 Z" fill="#28a745"/>

      <rect x="140" y="70" width="12" height="24" fill="#187d3d"/>
      <rect x="160" y="80" width="24" height="12" fill="#187d3d"/>
      <rect x="140" y="100" width="36" height="12" fill="#187d3d"/>

      <rect x="70" y="140" width="24" height="12" fill="#187d3d"/>
      <rect x="100" y="150" width="12" height="24" fill="#187d3d"/>
      <rect x="120" y="140" width="36" height="12" fill="#187d3d"/>
      <rect x="140" y="160" width="24" height="24" fill="#187d3d"/>
    </svg>
  `;
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Search & Mobile Listeners
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      filterProducts(query);
    }, 300));
  }

  const mobileToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
}

function filterProducts(query) {
  const allCards = document.querySelectorAll('.product-card');
  allCards.forEach(card => {
    const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
    if (title.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Quick View Modal
window.openQuickView = function(productId) {
  const currentProducts = getAllProducts();
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const modalHTML = `
    <div class="modal-overlay open" id="quickViewOverlay" onclick="closeQuickView()">
      <div style="position: relative; background: #fff; width: 90%; max-width: 500px; margin: 100px auto; padding: 24px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" onclick="event.stopPropagation()">
        <button style="position: absolute; top: 12px; right: 16px; font-size: 1.5rem; background: none;" onclick="closeQuickView()">&times;</button>
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <img src="${product.image}" style="width: 140px; height: 140px; object-fit: contain; background: #f5f8f6; border-radius: 8px;">
          <div style="flex: 1;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">${product.category}</span>
            <h3 style="font-size: 1.2rem; color: var(--primary); margin: 4px 0;">${product.name}</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">${product.unit}</p>
            <div style="font-size: 1.4rem; font-weight: 700; color: var(--primary); margin-bottom: 16px;">₹${product.price}</div>
            <button class="btn-primary" style="width: 100%;" onclick="addToCart('${product.id}'); closeQuickView();">Add to Shopping Cart</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;
};

window.closeQuickView = function() {
  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = '';
};

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg style="width: 20px; height: 20px; fill: var(--primary);" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
