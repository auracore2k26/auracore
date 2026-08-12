/* ==========================================================================
   GreenLeaf Organics - Dedicated Admin Panel Application Logic (admin-app.js)
   ========================================================================== */

let currentAdminTab = 'dashboard';
let adminSearchTerm = '';
let adminStatusFilterVal = 'All';

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});

function checkAdminAuth() {
  const user = window.auth.currentUser;
  if (!user || user.role !== 'admin') {
    renderAdminLoginOverlay();
  } else {
    renderAdminPortal();
  }
}

// Render Admin Login Overlay
function renderAdminLoginOverlay() {
  const overlayHTML = `
    <div class="admin-modal-overlay open" id="adminAuthOverlay">
      <div class="admin-modal-box" style="max-width: 400px; text-align: center;">
        <h2 style="color: var(--admin-primary); margin-bottom: 6px;">⚙️ Admin Login</h2>
        <p style="font-size: 0.85rem; color: var(--text-sub); margin-bottom: 20px;">Please enter admin credentials to access the Portal.</p>

        <form onsubmit="handleAdminPortalLogin(event)">
          <div class="form-group">
            <label style="text-align: left;">Admin Email *</label>
            <input type="email" id="adminEmailInput" class="search-input-field" style="width: 100%;" placeholder="Enter Admin Email" autocomplete="off" required>
          </div>

          <div class="form-group">
            <label style="text-align: left;">Password *</label>
            <div class="password-input-wrapper">
              <input type="password" id="adminPasswordInput" class="search-input-field" style="width: 100%;" placeholder="Enter Admin Password" autocomplete="off" required>
              <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('adminPasswordInput', this)">👁️</button>
            </div>
          </div>

          <div id="adminLoginErr" style="color: #dc3545; font-size: 0.825rem; margin-bottom: 12px; display: none;"></div>

          <button type="submit" class="btn-admin-primary" style="width: 100%;">Unlock Admin Panel</button>
        </form>

        <div style="margin-top: 16px; font-size: 0.8rem; color: var(--text-sub);">
          <a href="index.html" style="color: var(--admin-primary); font-weight: 700;">← Back to Customer Website</a>
        </div>
      </div>
    </div>
  `;
  document.body.innerHTML = overlayHTML;
}

window.handleAdminPortalLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmailInput').value;
  const pwd = document.getElementById('adminPasswordInput').value;

  const res = window.auth.login(email, pwd);
  if (res.success && res.user.role === 'admin') {
    location.reload();
  } else {
    const errBox = document.getElementById('adminLoginErr');
    if (errBox) {
      errBox.textContent = 'Invalid Admin credentials. Please check your email and password.';
      errBox.style.display = 'block';
    }
  }
};

// Render Main Admin Portal
function renderAdminPortal() {
  const user = window.auth.currentUser;
  
  const portalHTML = `
    <div class="admin-wrapper">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <svg style="width: 32px; height: 32px;" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="23" fill="#ffffff"/>
            <path d="M25 8 C15 18 10 28 25 42 C40 28 35 18 25 8 Z" fill="#28a745"/>
          </svg>
          <div>
            <h2>GreenLeaf</h2>
            <span style="font-size: 0.65rem; letter-spacing: 2px; color: #a3d9b1;">ADMIN PORTAL</span>
          </div>
        </div>

        <nav class="sidebar-menu">
          <button class="nav-link-btn ${currentAdminTab === 'dashboard' ? 'active' : ''}" onclick="switchAdminTab('dashboard')">
            📊 Dashboard
          </button>
          <button class="nav-link-btn ${currentAdminTab === 'orders' ? 'active' : ''}" onclick="switchAdminTab('orders')">
            📦 Orders & Tracking
          </button>
          <button class="nav-link-btn ${currentAdminTab === 'products' ? 'active' : ''}" onclick="switchAdminTab('products')">
            🛍️ Products Manager
          </button>
          <button class="nav-link-btn ${currentAdminTab === 'customers' ? 'active' : ''}" onclick="switchAdminTab('customers')">
            👥 Customer Directory
          </button>
          <button class="nav-link-btn ${currentAdminTab === 'payments' ? 'active' : ''}" onclick="switchAdminTab('payments')">
            💳 Payments & Gateways
          </button>
          <button class="nav-link-btn ${currentAdminTab === 'coupons' ? 'active' : ''}" onclick="switchAdminTab('coupons')">
            🏷️ Discount Coupons
          </button>
          <button class="nav-link-btn ${currentAdminTab === 'settings' ? 'active' : ''}" onclick="switchAdminTab('settings')">
            ⚙️ Site & Store Settings
          </button>
        </nav>

        <div class="sidebar-footer">
          <button class="nav-link-btn" style="color: #ff9999;" onclick="handleAdminLogout()">
            🚪 Admin Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <!-- Topbar -->
        <header class="admin-topbar">
          <div class="topbar-title" id="tabTitle">${getTabTitle(currentAdminTab)}</div>
          <div class="topbar-actions">
            <span style="font-size: 0.875rem; font-weight: 600;">👋 ${user.full_name}</span>
            <a href="index.html" target="_blank" class="go-store-btn">🌐 View Live Store</a>
          </div>
        </header>

        <!-- Dynamic Content Body -->
        <div class="admin-content" id="adminContentBody">
          ${renderTabBody()}
        </div>
      </main>
    </div>

    <div id="adminModalContainer"></div>
  `;

  document.body.innerHTML = portalHTML;
}

function getTabTitle(tab) {
  switch (tab) {
    case 'dashboard': return '📊 Dashboard Overview';
    case 'orders': return '📦 Orders & Tracking Control';
    case 'products': return '🛍️ Products Catalog Manager';
    case 'customers': return '👥 Customer Profiles Directory';
    case 'payments': return '💳 Payment Gateways & Transaction Control';
    case 'coupons': return '🏷️ Discount Coupons Manager';
    case 'settings': return '⚙️ Site Branding, Logo & Password Management';
    default: return 'Admin Panel';
  }
}

window.switchAdminTab = function(tab) {
  currentAdminTab = tab;
  renderAdminPortal();
};

function renderTabBody() {
  const orders = window.db.getAllOrders();
  const products = window.db.getProducts();
  const customers = window.db.getAllCustomers();
  const coupons = window.db.getCoupons();

  if (currentAdminTab === 'dashboard') {
    const totalRevenue = orders.reduce((sum, o) => o.order_status !== 'Cancelled' ? sum + o.total_amount : sum, 0);

    return `
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card bg-revenue">
          <div class="stat-num">₹${totalRevenue}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
        <div class="stat-card bg-orders">
          <div class="stat-num">${orders.length}</div>
          <div class="stat-label">Total Orders</div>
        </div>
        <div class="stat-card bg-customers">
          <div class="stat-num">${customers.length}</div>
          <div class="stat-label">Registered Customers</div>
        </div>
        <div class="stat-card bg-products">
          <div class="stat-num">${products.length}</div>
          <div class="stat-label">Active Catalog Products</div>
        </div>
      </div>

      <h3 style="color: var(--admin-primary); margin-bottom: 16px;">Recent Orders</h3>
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.slice(0, 5).map(o => `
              <tr>
                <td><strong>#${window.escapeHTML ? window.escapeHTML(o.order_number) : o.order_number}</strong></td>
                <td>${window.escapeHTML ? window.escapeHTML(o.customer_name) : o.customer_name} (${window.escapeHTML ? window.escapeHTML(o.customer_email) : o.customer_email})</td>
                <td>${new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                <td><strong>₹${o.total_amount}</strong></td>
                <td><span class="status-pill ${getStatusPillClass(o.order_status)}">${o.order_status}</span></td>
                <td><button class="btn-admin-primary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="openOrderModal('${o.id}')">Manage</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (currentAdminTab === 'orders') {
    const filteredOrders = orders.filter(o => {
      const q = adminSearchTerm.toLowerCase();
      const matchQuery = o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q) || o.customer_mobile.toLowerCase().includes(q) || o.user_id.toLowerCase().includes(q);
      const matchStatus = adminStatusFilterVal === 'All' || o.order_status === adminStatusFilterVal;
      return matchQuery && matchStatus;
    });

    return `
      <div class="control-bar">
        <input type="text" class="search-input-field" placeholder="Search Order ID, Name, Email, Mobile, User ID..." value="${adminSearchTerm}" oninput="adminSearchOrders(this.value)">
        <select class="search-input-field" style="width: 200px;" onchange="adminFilterOrdersStatus(this.value)">
          <option value="All">All Statuses</option>
          <option value="Order Placed" ${adminStatusFilterVal === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
          <option value="Payment Confirmed" ${adminStatusFilterVal === 'Payment Confirmed' ? 'selected' : ''}>Payment Confirmed</option>
          <option value="Processing" ${adminStatusFilterVal === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Packed" ${adminStatusFilterVal === 'Packed' ? 'selected' : ''}>Packed</option>
          <option value="Shipped" ${adminStatusFilterVal === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Out for Delivery" ${adminStatusFilterVal === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
          <option value="Delivered" ${adminStatusFilterVal === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${adminStatusFilterVal === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer Details</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Courier & AWB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredOrders.length === 0 ? '<tr><td colspan="8" style="text-align:center;">No matching orders found.</td></tr>' : filteredOrders.map(o => `
              <tr>
                <td><strong>#${o.order_number}</strong></td>
                <td>
                  <div><strong>${o.customer_name}</strong></div>
                  <div style="font-size: 0.75rem; color: var(--text-sub);">${o.customer_email} | ${o.customer_mobile}</div>
                </td>
                <td><code style="font-size: 0.75rem;">${o.user_id}</code></td>
                <td>${new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                <td><strong>₹${o.total_amount}</strong></td>
                <td><span class="status-pill ${getStatusPillClass(o.order_status)}">${o.order_status}</span></td>
                <td>
                  <div style="font-size: 0.8rem;"><strong>${o.courier_name}</strong></div>
                  <div style="font-size: 0.75rem; color: var(--text-sub);">${o.tracking_number}</div>
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn-admin-primary" style="padding: 5px 10px; font-size: 0.78rem;" onclick="openOrderModal('${o.id}')">Update</button>
                    <button class="go-store-btn" style="padding: 5px 10px; font-size: 0.78rem;" onclick="window.generateAndPrintInvoice('${o.id}')">Invoice</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (currentAdminTab === 'products') {
    return `
      <div class="control-bar">
        <input type="text" class="search-input-field" placeholder="Search catalog products..." oninput="adminFilterProducts(this.value)">
        <button class="btn-admin-primary" onclick="openAddProductModal()">+ Add New Product</button>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Unit / Pack</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="productTableBody">
            ${products.map(p => `
              <tr>
                <td><img src="${p.image}" style="width: 44px; height: 44px; object-fit: contain; background: #fafcfb; border-radius: 4px;"></td>
                <td><strong>${p.name}</strong> ${p.badge ? `<span style="font-size: 0.65rem; background: var(--admin-primary); color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">${p.badge}</span>` : ''}</td>
                <td style="text-transform: capitalize;">${p.category}</td>
                <td>${p.unit}</td>
                <td><strong>₹${p.price}</strong></td>
                <td>
                  <button class="status-pill ${p.in_stock !== false ? 'green' : 'red'}" onclick="toggleStock('${p.id}')">
                    ${p.in_stock !== false ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td>
                  <button class="btn-admin-primary" style="padding: 4px 10px; font-size: 0.78rem; background: #dc3545;" onclick="adminDeleteProduct('${p.id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (currentAdminTab === 'customers') {
    return `
      <h3 style="color: var(--admin-primary); margin-bottom: 16px;">Customer Directory (${customers.length})</h3>
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>User ID</th>
              <th>Joined Date</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(c => {
              const custOrders = orders.filter(o => o.user_id === c.auth_user_id);
              const totalSpent = custOrders.reduce((sum, o) => sum + o.total_amount, 0);

              return `
                <tr>
                  <td><strong>${c.full_name}</strong></td>
                  <td>${c.email}</td>
                  <td>${c.mobile}</td>
                  <td><code>${c.auth_user_id}</code></td>
                  <td>${new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  <td><strong>${custOrders.length} orders</strong></td>
                  <td><strong style="color: var(--admin-primary);">₹${totalSpent}</strong></td>
                  <td>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      <button class="btn-admin-primary" style="padding: 5px 10px; font-size: 0.78rem;" onclick="viewCustomerOrders('${c.auth_user_id}')">View Orders</button>
                      <button class="btn-admin-primary" style="padding: 5px 10px; font-size: 0.78rem; background: #6c757d;" onclick="adminResetCustomerPassword('${c.auth_user_id}', '${c.full_name}')">🔑 Reset Password</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (currentAdminTab === 'payments') {
    const paySettings = window.db.getPaymentSettings();

    return `
      <!-- Payment Gateway Configuration -->
      <div style="background: #ffffff; padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 30px;">
        <h3 style="color: var(--admin-primary); margin-bottom: 4px;">⚙️ Payment Gateways & UPI QR Configuration</h3>
        <p style="color: var(--text-sub); font-size: 0.85rem; margin-bottom: 20px;">Control which payment methods are enabled on the customer checkout page and configure your business UPI ID.</p>

        <form onsubmit="handleSavePaymentSettings(event)">
          <div class="form-group" style="max-width: 450px;">
            <label>Admin Business UPI VPA ID *</label>
            <input type="text" id="setUPIId" class="search-input-field" style="width: 100%;" value="${paySettings.upi_id}" placeholder="e.g. greenleaforganics@upi" required>
          </div>

          <!-- Custom QR Image Upload & URL input -->
          <div class="form-group" style="max-width: 450px; background: #f4f8f5; padding: 14px; border-radius: 8px; border: 1px dashed var(--admin-primary); margin-top: 14px;">
            <label style="color: var(--admin-primary); font-weight: 700;">📸 Upload Business QR Code Photo (GPay / PhonePe / Paytm / Shop QR)</label>
            <input type="file" id="setQRFile" accept="image/*" class="search-input-field" style="width: 100%; margin-top: 6px; background: #fff;" onchange="previewAdminQRImage(this)">
            <p style="font-size: 0.75rem; color: var(--text-sub); margin-top: 4px;">Choose an image file of your Shop's Official UPI QR Code, or paste image URL below:</p>
            
            <input type="text" id="setQRUrl" class="search-input-field" style="width: 100%; margin-top: 8px; background: #fff;" value="${paySettings.custom_qr_image || ''}" placeholder="Or paste Custom QR Image URL..." oninput="previewAdminQRUrl(this.value)">

            <div style="text-align: center; margin-top: 12px;">
              <span style="font-size: 0.78rem; font-weight: 600; display: block; margin-bottom: 4px;">Active Admin QR Preview:</span>
              <img id="adminQRPreview" src="${paySettings.custom_qr_image || ''}" style="max-width: 180px; max-height: 180px; object-fit: contain; border-radius: 8px; border: 2px solid var(--admin-primary); background: #fff; padding: 4px; ${paySettings.custom_qr_image ? 'display: inline-block;' : 'display: none;'}">
            </div>
          </div>

          <div style="display: flex; gap: 24px; flex-wrap: wrap; margin: 18px 0;">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
              <input type="checkbox" id="setUPIEnabled" ${paySettings.upi_enabled ? 'checked' : ''}>
              📲 UPI / Online QR Payment Gateway
            </label>

            <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
              <input type="checkbox" id="setCardEnabled" ${paySettings.card_enabled ? 'checked' : ''}>
              💳 Debit / Credit Card Payment
            </label>

            <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
              <input type="checkbox" id="setCODEnabled" ${paySettings.cod_enabled ? 'checked' : ''}>
              💵 Cash on Delivery (COD)
            </label>
          </div>

          <button type="submit" class="btn-admin-primary">Save Gateway & Custom QR Settings</button>
        </form>
      </div>

      <!-- Transaction Ledger & Payment Controls -->
      <h3 style="color: var(--admin-primary); margin-bottom: 16px;">💳 Customer Transaction & Payment Control Ledger</h3>
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Payment Status</th>
              <th>Admin Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong>#${o.order_number}</strong></td>
                <td>
                  <div><strong>${o.customer_name}</strong></div>
                  <div style="font-size: 0.75rem; color: var(--text-sub);">${o.customer_email}</div>
                </td>
                <td><strong style="color: var(--admin-primary); font-size: 1.05rem;">₹${o.total_amount}</strong></td>
                <td>${o.payment_method}</td>
                <td><code>${o.transaction_id || 'N/A'}</code></td>
                <td>
                  <span class="status-pill ${o.payment_status === 'Paid' ? 'green' : (o.payment_status === 'Refunded' ? 'purple' : 'yellow')}">
                    ${o.payment_status}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button class="btn-admin-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #28a745;" onclick="adminSetPaymentStatus('${o.id}', 'Paid')">Mark Paid</button>
                    <button class="btn-admin-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #ffc107; color: #333;" onclick="adminSetPaymentStatus('${o.id}', 'Pending')">Mark Pending</button>
                    <button class="btn-admin-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #6f42c1;" onclick="adminSetPaymentStatus('${o.id}', 'Refunded')">Refund</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (currentAdminTab === 'coupons') {
    return `
      <div class="control-bar">
        <h3>Promo Discount Coupons</h3>
        <button class="btn-admin-primary" onclick="openAddCouponModal()">+ Add New Coupon</button>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Min Order Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${coupons.map(cp => `
              <tr>
                <td><strong style="letter-spacing: 1px; color: var(--admin-primary);">${cp.code}</strong></td>
                <td style="text-transform: capitalize;">${cp.discount_type}</td>
                <td><strong>${cp.discount_type === 'percent' ? cp.discount_value + '%' : '₹' + cp.discount_value}</strong></td>
                <td>₹${cp.min_order}</td>
                <td><span class="status-pill green">Active</span></td>
                <td>
                  <button class="btn-admin-primary" style="padding: 4px 10px; font-size: 0.78rem; background: #dc3545;" onclick="adminDeleteCoupon('${cp.id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (currentAdminTab === 'settings') {
    const siteSettings = window.db.getSiteSettings ? window.db.getSiteSettings() : {};

    return `
      <!-- Store Branding & Logo Upload Section -->
      <div style="background: #ffffff; padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 30px;">
        <h3 style="color: var(--admin-primary); margin-bottom: 4px;">🖼️ Store Branding & Custom Logo Upload</h3>
        <p style="color: var(--text-sub); font-size: 0.85rem; margin-bottom: 20px;">Upload your official Store Logo image file or URL, and configure your brand name & tagline.</p>

        <form onsubmit="handleSaveSiteBranding(event)">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label>Store / Business Name *</label>
              <input type="text" id="setStoreName" class="search-input-field" style="width: 100%;" value="${siteSettings.store_name || 'GreenLeaf Organics'}" required>
            </div>
            <div class="form-group">
              <label>Store Subtitle / Tagline</label>
              <input type="text" id="setStoreTagline" class="search-input-field" style="width: 100%;" value="${siteSettings.store_tagline || 'ORGANICS'}">
            </div>
          </div>

          <!-- Logo Upload Box -->
          <div class="form-group" style="background: #f4f8f5; padding: 16px; border-radius: 8px; border: 1px dashed var(--admin-primary); margin-top: 14px;">
            <label style="color: var(--admin-primary); font-weight: 700;">📸 Upload Store Official Logo Image</label>
            <input type="file" id="setLogoFile" accept="image/*" class="search-input-field" style="width: 100%; margin-top: 6px; background: #fff;" onchange="previewAdminLogoImage(this)">
            <p style="font-size: 0.75rem; color: var(--text-sub); margin-top: 4px;">Choose an image file from your computer (PNG, JPG, WebP, SVG) or paste direct image URL below:</p>
            
            <input type="text" id="setLogoUrl" class="search-input-field" style="width: 100%; margin-top: 8px; background: #fff;" value="${siteSettings.logo_url || ''}" placeholder="Or paste Custom Logo Image URL..." oninput="previewAdminLogoUrl(this.value)">

            <div style="text-align: center; margin-top: 14px;">
              <span style="font-size: 0.78rem; font-weight: 600; display: block; margin-bottom: 6px;">Active Store Logo Preview:</span>
              <img id="adminLogoPreview" src="${siteSettings.logo_url || ''}" style="max-height: 80px; max-width: 220px; object-fit: contain; border-radius: 8px; border: 2px solid var(--admin-primary); background: #fff; padding: 6px; ${siteSettings.logo_url ? 'display: inline-block;' : 'display: none;'}">
            </div>
          </div>

          <button type="submit" class="btn-admin-primary" style="margin-top: 14px;">Save Branding & Logo</button>
        </form>
      </div>

      <!-- Top Bar Announcement & Contact Info -->
      <div style="background: #ffffff; padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 30px;">
        <h3 style="color: var(--admin-primary); margin-bottom: 4px;">📢 Announcement Bar & Contact Information</h3>
        <p style="color: var(--text-sub); font-size: 0.85rem; margin-bottom: 20px;">Control the top announcement bar text and support contact details across all pages.</p>

        <form onsubmit="handleSaveSiteContact(event)">
          <div class="form-group">
            <label>Top Announcement Bar Banner Text</label>
            <input type="text" id="setAnnouncementText" class="search-input-field" style="width: 100%;" value="${siteSettings.announcement_text || 'Free Shipping on orders above ₹999'}">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label>Support Phone Number *</label>
              <input type="text" id="setSupportPhone" class="search-input-field" style="width: 100%;" value="${siteSettings.support_phone || '+91 96263 88886'}" required>
            </div>
            <div class="form-group">
              <label>Support Email Address *</label>
              <input type="email" id="setSupportEmail" class="search-input-field" style="width: 100%;" value="${siteSettings.support_email || 'support@greenleaforganics.com'}" required>
            </div>
          </div>

          <div class="form-group">
            <label>Store Physical Address</label>
            <input type="text" id="setStoreAddress" class="search-input-field" style="width: 100%;" value="${siteSettings.store_address || 'Tamil Nadu, India, Pin - 626101'}">
          </div>

          <button type="submit" class="btn-admin-primary" style="margin-top: 10px;">Save Banner & Contact Info</button>
        </form>
      </div>

      <!-- Password Management Section -->
      <div style="background: #ffffff; padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <h3 style="color: var(--admin-primary); margin-bottom: 4px;">🔐 Admin Account Password Management</h3>
        <p style="color: var(--text-sub); font-size: 0.85rem; margin-bottom: 20px;">Change your Admin login password for security.</p>

        <form onsubmit="handleChangeAdminPassword(event)">
          <div class="form-group" style="max-width: 450px;">
            <label>Current Admin Password *</label>
            <div class="password-input-wrapper">
              <input type="password" id="adminCurrPwd" class="search-input-field" style="width: 100%;" placeholder="Enter current admin password" required>
              <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('adminCurrPwd', this)">👁️</button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; max-width: 600px;">
            <div class="form-group">
              <label>New Password (Min 6 characters) *</label>
              <div class="password-input-wrapper">
                <input type="password" id="adminNewPwd" class="search-input-field" style="width: 100%;" placeholder="New password" required>
                <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('adminNewPwd', this)">👁️</button>
              </div>
            </div>
            <div class="form-group">
              <label>Confirm New Password *</label>
              <div class="password-input-wrapper">
                <input type="password" id="adminConfirmPwd" class="search-input-field" style="width: 100%;" placeholder="Confirm new password" required>
                <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('adminConfirmPwd', this)">👁️</button>
              </div>
            </div>
          </div>

          <div id="adminPwdErr" style="color: #dc3545; font-size: 0.85rem; margin: 8px 0; display: none;"></div>

          <button type="submit" class="btn-admin-primary" style="margin-top: 10px;">Update Admin Password</button>
        </form>
      </div>
    `;
  }
}

window.uploadedAdminQRImage = '';

window.previewAdminQRImage = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.uploadedAdminQRImage = e.target.result;
      const preview = document.getElementById('adminQRPreview');
      const urlField = document.getElementById('setQRUrl');
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = 'inline-block';
      }
      if (urlField) urlField.value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
};

window.previewAdminQRUrl = function(url) {
  window.uploadedAdminQRImage = url.trim();
  const preview = document.getElementById('adminQRPreview');
  if (preview) {
    if (url.trim()) {
      preview.src = url.trim();
      preview.style.display = 'inline-block';
    } else {
      preview.style.display = 'none';
    }
  }
};

window.handleSavePaymentSettings = function(e) {
  e.preventDefault();
  const upi_id = document.getElementById('setUPIId').value.trim();
  const upi_enabled = document.getElementById('setUPIEnabled').checked;
  const card_enabled = document.getElementById('setCardEnabled').checked;
  const cod_enabled = document.getElementById('setCODEnabled').checked;
  const urlVal = document.getElementById('setQRUrl') ? document.getElementById('setQRUrl').value.trim() : '';

  const custom_qr_image = window.uploadedAdminQRImage || urlVal;

  window.db.updatePaymentSettings({ upi_id, custom_qr_image, upi_enabled, card_enabled, cod_enabled });
  alert("✅ Payment Gateway & Admin Custom QR Code photo updated successfully!");
  renderAdminPortal();
};

window.adminSetPaymentStatus = function(orderId, status) {
  window.db.updateOrderPaymentStatus(orderId, status);
  alert(`Payment status for order updated to "${status}"!`);
  renderAdminPortal();
};

window.handleAdminLogout = function() {
  window.auth.logout();
  location.reload();
};

window.uploadedAdminLogoImage = '';

window.previewAdminLogoImage = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.uploadedAdminLogoImage = e.target.result;
      const preview = document.getElementById('adminLogoPreview');
      const urlField = document.getElementById('setLogoUrl');
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = 'inline-block';
      }
      if (urlField) urlField.value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
};

window.previewAdminLogoUrl = function(url) {
  window.uploadedAdminLogoImage = url.trim();
  const preview = document.getElementById('adminLogoPreview');
  if (preview) {
    if (url.trim()) {
      preview.src = url.trim();
      preview.style.display = 'inline-block';
    } else {
      preview.style.display = 'none';
    }
  }
};

window.handleSaveSiteBranding = function(e) {
  e.preventDefault();
  const store_name = document.getElementById('setStoreName').value.trim();
  const store_tagline = document.getElementById('setStoreTagline').value.trim();
  const urlVal = document.getElementById('setLogoUrl') ? document.getElementById('setLogoUrl').value.trim() : '';

  const logo_url = window.uploadedAdminLogoImage || urlVal;

  window.db.updateSiteSettings({ store_name, store_tagline, logo_url });
  alert("✅ Store Logo & Branding updated successfully across all pages!");
  renderAdminPortal();
};

window.handleSaveSiteContact = function(e) {
  e.preventDefault();
  const announcement_text = document.getElementById('setAnnouncementText').value.trim();
  const support_phone = document.getElementById('setSupportPhone').value.trim();
  const support_email = document.getElementById('setSupportEmail').value.trim();
  const store_address = document.getElementById('setStoreAddress').value.trim();

  window.db.updateSiteSettings({ announcement_text, support_phone, support_email, store_address });
  alert("✅ Top Announcement Bar & Contact Information updated successfully!");
  renderAdminPortal();
};

window.handleChangeAdminPassword = function(e) {
  e.preventDefault();
  const currPwd = document.getElementById('adminCurrPwd').value.trim();
  const newPwd = document.getElementById('adminNewPwd').value.trim();
  const confirmPwd = document.getElementById('adminConfirmPwd').value.trim();
  const errBox = document.getElementById('adminPwdErr');

  const adminUser = window.auth.currentUser;
  const adminCust = window.db.findCustomerByEmailOrMobile(adminUser.email);

  if (adminCust && adminCust.password_hash !== currPwd) {
    if (errBox) { errBox.textContent = "Current password is incorrect!"; errBox.style.display = "block"; }
    return;
  }

  if (newPwd.length < 6) {
    if (errBox) { errBox.textContent = "New password must be at least 6 characters!"; errBox.style.display = "block"; }
    return;
  }

  if (newPwd !== confirmPwd) {
    if (errBox) { errBox.textContent = "New password and Confirm password do not match!"; errBox.style.display = "block"; }
    return;
  }

  window.db.updateUserPassword(adminUser.email, newPwd);
  alert("🔑 Admin Password changed successfully!");
  renderAdminPortal();
};

window.adminResetCustomerPassword = function(userId, customerName) {
  const newPwd = prompt(`Enter new password for customer ${customerName}:`, "123456");
  if (newPwd) {
    if (newPwd.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    window.db.updateUserPassword(userId, newPwd);
    alert(`🔑 Password for customer "${customerName}" updated successfully to "${newPwd}"!`);
  }
};

// Helpers & Filter triggers
window.adminSearchOrders = function(query) {
  adminSearchTerm = query;
  renderAdminPortal();
};

window.adminFilterOrdersStatus = function(status) {
  adminStatusFilterVal = status;
  renderAdminPortal();
};

window.viewCustomerOrders = function(userId) {
  adminSearchTerm = userId;
  currentAdminTab = 'orders';
  renderAdminPortal();
};

// Modal Operations: Update Order Status
window.openOrderModal = function(orderId) {
  const order = window.db.getOrderById(orderId);
  if (!order) return;

  const modalHTML = `
    <div class="admin-modal-overlay open" id="orderModal" onclick="closeAdminModal()">
      <div class="admin-modal-box" onclick="event.stopPropagation()">
        <button class="close-modal-btn" onclick="closeAdminModal()">&times;</button>
        <h3 style="color: var(--admin-primary); margin-bottom: 4px;">Update Order #${order.order_number}</h3>
        <p style="color: var(--text-sub); font-size: 0.85rem; margin-bottom: 16px;">Customer: ${order.customer_name} (${order.customer_email})</p>

        <form onsubmit="saveOrderStatusUpdate(event, '${order.id}')">
          <div class="form-group">
            <label>Order Status *</label>
            <select id="modalStatusSelect" class="search-input-field" style="width: 100%;" required>
              <option value="Order Placed" ${order.order_status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
              <option value="Payment Confirmed" ${order.order_status === 'Payment Confirmed' ? 'selected' : ''}>Payment Confirmed</option>
              <option value="Processing" ${order.order_status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Packed" ${order.order_status === 'Packed' ? 'selected' : ''}>Packed</option>
              <option value="Shipped" ${order.order_status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Out for Delivery" ${order.order_status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="Delivered" ${order.order_status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.order_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>

          <div class="form-group">
            <label>Courier Company Name</label>
            <input type="text" id="modalCourierInput" class="search-input-field" style="width: 100%;" value="${order.courier_name || 'ST Courier'}">
          </div>

          <div class="form-group">
            <label>Tracking AWB / Consignment Number</label>
            <input type="text" id="modalTrackingInput" class="search-input-field" style="width: 100%;" value="${order.tracking_number || ''}">
          </div>

          <div class="form-group">
            <label>Estimated Delivery Date</label>
            <input type="date" id="modalDateInput" class="search-input-field" style="width: 100%;" value="${order.estimated_delivery_date || ''}">
          </div>

          <div class="form-group">
            <label>Status Update Note for Customer</label>
            <textarea id="modalNoteInput" class="search-input-field" style="width: 100%; height: 60px;"></textarea>
          </div>

          <button type="submit" class="btn-admin-primary" style="width: 100%; margin-top: 10px;">Save & Broadcast Update</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('adminModalContainer').innerHTML = modalHTML;
};

window.saveOrderStatusUpdate = function(e, orderId) {
  e.preventDefault();
  const status = document.getElementById('modalStatusSelect').value;
  const courier = document.getElementById('modalCourierInput').value;
  const tracking = document.getElementById('modalTrackingInput').value;
  const date = document.getElementById('modalDateInput').value;
  const note = document.getElementById('modalNoteInput').value;

  window.db.updateOrderStatus(orderId, {
    order_status: status,
    courier_name: courier,
    tracking_number: tracking,
    estimated_delivery_date: date,
    status_note: note
  });

  alert(`Order #${orderId} updated to ${status}!`);
  closeAdminModal();
  renderAdminPortal();
};

// Global Image Upload State
window.uploadedProductImage = '';

window.previewSelectedImage = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.uploadedProductImage = e.target.result;
      const preview = document.getElementById('pImgPreview');
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

window.selectPresetImage = function(url) {
  window.uploadedProductImage = url;
  const imgInput = document.getElementById('pImage');
  const preview = document.getElementById('pImgPreview');
  if (imgInput) imgInput.value = url;
  if (preview) {
    preview.src = url;
    preview.style.display = 'block';
  }
};

window.handleCategorySelectChange = function(select) {
  const customBox = document.getElementById('pCustomCategoryBox');
  if (select.value === '__new__') {
    if (customBox) customBox.style.display = 'block';
  } else {
    if (customBox) customBox.style.display = 'none';
  }
};

// Modal Operations: Add Product
window.openAddProductModal = function() {
  window.uploadedProductImage = '';
  const categories = window.db.getCategories();

  const modalHTML = `
    <div class="admin-modal-overlay open" id="productModal" onclick="closeAdminModal()">
      <div class="admin-modal-box" onclick="event.stopPropagation()">
        <button class="close-modal-btn" onclick="closeAdminModal()">&times;</button>
        <h3 style="color: var(--admin-primary); margin-bottom: 16px;">🛍️ Add New Product to Store</h3>

        <form onsubmit="handleCreateProduct(event)">
          <div class="form-group">
            <label>Product Name *</label>
            <input type="text" id="pName" class="search-input-field" style="width: 100%;" placeholder="e.g. Organic Vermicompost 5Kg" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label>Product Category *</label>
              <select id="pCategory" class="search-input-field" style="width: 100%;" onchange="handleCategorySelectChange(this)" required>
                ${categories.map(cat => `<option value="${cat}">${cat.toUpperCase()}</option>`).join('')}
                <option value="__new__" style="font-weight: 700; color: var(--admin-primary);">+ Add Custom Category...</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price (₹) *</label>
              <input type="number" id="pPrice" class="search-input-field" style="width: 100%;" placeholder="250" required>
            </div>
          </div>

          <!-- Custom Category Input Box -->
          <div class="form-group" id="pCustomCategoryBox" style="display: none; background: #fff3cd; padding: 10px; border-radius: 6px; border: 1px solid #ffebaa;">
            <label style="color: #856404; font-weight: 700;">✍️ Enter New Custom Category Name *</label>
            <input type="text" id="pCustomCategoryInput" class="search-input-field" style="width: 100%; margin-top: 4px; background: #fff;" placeholder="e.g. Garden Tools, Indoor Plants, Bio Pesticides">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label>Unit / Pack *</label>
              <input type="text" id="pUnit" class="search-input-field" style="width: 100%;" placeholder="e.g. 500ml / 1 Kg / Per Bag" required>
            </div>
            <div class="form-group">
              <label>Badge Tag (Optional)</label>
              <input type="text" id="pBadge" class="search-input-field" style="width: 100%;" placeholder="e.g. 100% Bio / Organic">
            </div>
          </div>

          <!-- Product Image Upload Section -->
          <div class="form-group" style="background: #f4f8f5; padding: 14px; border-radius: 8px; border: 1px dashed var(--admin-primary);">
            <label style="color: var(--admin-primary); font-weight: 700;">📸 Upload Product Image (Choose File or Select Preset)</label>
            
            <input type="file" id="pImageFile" accept="image/*" class="search-input-field" style="width: 100%; margin-top: 6px; background: #fff;" onchange="previewSelectedImage(this)">
            <p style="font-size: 0.75rem; color: var(--text-sub); margin-top: 4px;">Choose an image file from your computer (JPG, PNG, WebP)</p>

            <div style="margin-top: 10px;">
              <span style="font-size: 0.78rem; font-weight: 600;">Or Select Quick Preset:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
                <button type="button" class="btn-admin-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #28a745;" onclick="selectPresetImage('assets/images/vetiver_grow_bag.jpg')">🌿 Vetiver Bag</button>
                <button type="button" class="btn-admin-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #856404;" onclick="selectPresetImage('assets/images/vetiver_dried_roots.jpg')">🌾 Dried Root</button>
                <button type="button" class="btn-admin-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #007bff;" onclick="selectPresetImage('assets/images/organic_fertilizer.jpg')">🧪 Fertilizer</button>
                <button type="button" class="btn-admin-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #17a2b8;" onclick="selectPresetImage('assets/images/keerai_seeds.jpg')">🌱 Keerai Seeds</button>
              </div>
            </div>

            <input type="text" id="pImage" class="search-input-field" style="width: 100%; margin-top: 10px; background: #fff;" placeholder="Or paste Custom Image URL here..." value="assets/images/organic_fertilizer.jpg">

            <div style="text-align: center; margin-top: 10px;">
              <img id="pImgPreview" src="assets/images/organic_fertilizer.jpg" style="max-width: 130px; max-height: 130px; object-fit: contain; border-radius: 8px; border: 2px solid var(--admin-primary); background: #fff; padding: 4px; display: inline-block;">
            </div>
          </div>

          <button type="submit" class="btn-admin-primary" style="width: 100%; margin-top: 10px;">Publish Product to Live Store</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('adminModalContainer').innerHTML = modalHTML;
};

window.handleCreateProduct = function(e) {
  e.preventDefault();
  const name = document.getElementById('pName').value;
  let category = document.getElementById('pCategory').value;

  if (category === '__new__') {
    const customVal = document.getElementById('pCustomCategoryInput').value.trim();
    if (!customVal) {
      alert("Please type a custom category name!");
      return;
    }
    category = customVal.toLowerCase();
  }

  const price = document.getElementById('pPrice').value;
  const unit = document.getElementById('pUnit').value;
  const badge = document.getElementById('pBadge').value;
  const urlInput = document.getElementById('pImage').value;

  const image = window.uploadedProductImage || urlInput || 'assets/images/organic_fertilizer.jpg';

  window.db.addProduct({ name, category, price, unit, badge, image });
  alert(`Product "${name}" under category "${category.toUpperCase()}" successfully created!`);
  closeAdminModal();
  renderAdminPortal();
};

window.toggleStock = function(prodId) {
  window.db.toggleProductStock(prodId);
  renderAdminPortal();
};

window.adminDeleteProduct = function(prodId) {
  if (confirm("Are you sure you want to delete this product?")) {
    window.db.deleteProduct(prodId);
    renderAdminPortal();
  }
};

// Modal Operations: Add Coupon
window.openAddCouponModal = function() {
  const modalHTML = `
    <div class="admin-modal-overlay open" onclick="closeAdminModal()">
      <div class="admin-modal-box" onclick="event.stopPropagation()">
        <button class="close-modal-btn" onclick="closeAdminModal()">&times;</button>
        <h3 style="color: var(--admin-primary); margin-bottom: 16px;">Add New Discount Coupon</h3>

        <form onsubmit="handleCreateCoupon(event)">
          <div class="form-group">
            <label>Coupon Code *</label>
            <input type="text" id="cpCode" class="search-input-field" style="width: 100%; text-transform: uppercase;" placeholder="e.g. GREEN20" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label>Discount Type *</label>
              <select id="cpType" class="search-input-field" style="width: 100%;" required>
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Value *</label>
              <input type="number" id="cpValue" class="search-input-field" style="width: 100%;" placeholder="e.g. 10 or 50" required>
            </div>
          </div>

          <div class="form-group">
            <label>Minimum Order Amount (₹)</label>
            <input type="number" id="cpMin" class="search-input-field" style="width: 100%;" value="500">
          </div>

          <button type="submit" class="btn-admin-primary" style="width: 100%; margin-top: 10px;">Create Coupon</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('adminModalContainer').innerHTML = modalHTML;
};

window.handleCreateCoupon = function(e) {
  e.preventDefault();
  const code = document.getElementById('cpCode').value;
  const discount_type = document.getElementById('cpType').value;
  const discount_value = document.getElementById('cpValue').value;
  const min_order = document.getElementById('cpMin').value;

  window.db.addCoupon({ code, discount_type, discount_value, min_order });
  alert(`Coupon "${code}" created!`);
  closeAdminModal();
  renderAdminPortal();
};

window.adminDeleteCoupon = function(id) {
  if (confirm("Delete this coupon code?")) {
    window.db.deleteCoupon(id);
    renderAdminPortal();
  }
};

window.closeAdminModal = function() {
  document.getElementById('adminModalContainer').innerHTML = '';
};

function getStatusPillClass(status) {
  switch (status) {
    case 'Pending': case 'Order Placed': return 'yellow';
    case 'Confirmed': case 'Payment Confirmed': return 'blue';
    case 'Processing': case 'Packed': return 'purple';
    case 'Shipped': return 'indigo';
    case 'Out for Delivery': return 'orange';
    case 'Delivered': return 'green';
    case 'Cancelled': return 'red';
    default: return 'blue';
  }
}
