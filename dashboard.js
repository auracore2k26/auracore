/* ==========================================================================
   GreenLeaf Organics - Customer Dashboard & Order Tracking (dashboard.js)
   ========================================================================== */

let activeDashboardTab = 'summary';
let activeOrderFilter = 'All';

// 8 Stages Progress Definition
const trackingStages = [
  'Order Placed',
  'Payment Confirmed',
  'Order Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

window.openDashboard = function(tab = 'summary') {
  if (!window.auth.currentUser) {
    openAuthModal('login', 'Please login to access your customer dashboard.');
    return;
  }

  activeDashboardTab = tab;
  renderDashboardModal();
};

function renderDashboardModal() {
  const user = window.auth.currentUser;
  const orders = window.db.getOrdersByUserId(user.id);
  const notifications = window.db.getNotifications(user.id);

  // Status Metrics
  const totalCount = orders.length;
  const processingCount = orders.filter(o => o.order_status === 'Processing' || o.order_status === 'Order Placed' || o.order_status === 'Confirmed' || o.order_status === 'Packed').length;
  const shippedCount = orders.filter(o => o.order_status === 'Shipped' || o.order_status === 'Out for Delivery').length;
  const deliveredCount = orders.filter(o => o.order_status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.order_status === 'Cancelled').length;

  const modalHTML = `
    <div class="modal-overlay open" id="dashboardOverlay" onclick="closeDashboard()">
      <div class="dashboard-container" onclick="event.stopPropagation()">
        <!-- Header Bar -->
        <div class="dashboard-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="avatar-circle">${user.full_name.charAt(0).toUpperCase()}</div>
            <div>
              <h3>Welcome, ${user.full_name}</h3>
              <p style="font-size: 0.8rem; opacity: 0.8;">${user.email} | ${user.mobile}</p>
            </div>
          </div>
          <button class="close-btn" onclick="closeDashboard()">&times;</button>
        </div>

        <!-- Dashboard Layout -->
        <div class="dashboard-layout">
          <!-- Sidebar Nav -->
          <div class="dashboard-sidebar">
            <button class="sidebar-item ${activeDashboardTab === 'summary' ? 'active' : ''}" onclick="switchDashboardTab('summary')">
              📊 Dashboard
            </button>
            <button class="sidebar-item ${activeDashboardTab === 'orders' ? 'active' : ''}" onclick="switchDashboardTab('orders')">
              📦 My Orders (${totalCount})
            </button>
            <button class="sidebar-item ${activeDashboardTab === 'notifications' ? 'active' : ''}" onclick="switchDashboardTab('notifications')">
              🔔 Notifications (${notifications.filter(n => !n.is_read).length})
            </button>
            <button class="sidebar-item ${activeDashboardTab === 'profile' ? 'active' : ''}" onclick="switchDashboardTab('profile')">
              👤 My Profile
            </button>
            ${user.role === 'admin' ? `
              <button class="sidebar-item" style="background: #0b572a; color: #fff; margin-top: 10px;" onclick="closeDashboard(); openAdminPanel();">
                ⚙️ Admin Panel
              </button>
            ` : ''}
            <button class="sidebar-item text-danger" style="margin-top: auto;" onclick="window.auth.logout(); closeDashboard();">
              🚪 Logout
            </button>
          </div>

          <!-- Main Content View -->
          <div class="dashboard-content">
            ${renderTabContent(orders, notifications, { totalCount, processingCount, shippedCount, deliveredCount, cancelledCount })}
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;
}

window.switchDashboardTab = function(tab) {
  activeDashboardTab = tab;
  renderDashboardModal();
};

window.closeDashboard = function() {
  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = '';
};

function renderTabContent(orders, notifications, metrics) {
  if (activeDashboardTab === 'summary') {
    return `
      <h3 style="color: var(--primary); margin-bottom: 16px;">Dashboard Overview</h3>
      <div class="metrics-grid">
        <div class="metric-card bg-blue">
          <div class="metric-num">${metrics.totalCount}</div>
          <div class="metric-lbl">Total Orders</div>
        </div>
        <div class="metric-card bg-purple">
          <div class="metric-num">${metrics.processingCount}</div>
          <div class="metric-lbl">Processing Orders</div>
        </div>
        <div class="metric-card bg-indigo">
          <div class="metric-num">${metrics.shippedCount}</div>
          <div class="metric-lbl">Shipped Orders</div>
        </div>
        <div class="metric-card bg-green">
          <div class="metric-num">${metrics.deliveredCount}</div>
          <div class="metric-lbl">Delivered Orders</div>
        </div>
        <div class="metric-card bg-red">
          <div class="metric-num">${metrics.cancelledCount}</div>
          <div class="metric-lbl">Cancelled Orders</div>
        </div>
      </div>

      <h4 style="color: var(--primary); margin: 24px 0 12px 0;">Recent Activity</h4>
      ${renderOrdersList(orders.slice(0, 3))}
    `;
  }

  if (activeDashboardTab === 'orders') {
    const filteredOrders = activeOrderFilter === 'All' ? orders : orders.filter(o => o.order_status === activeOrderFilter);

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <h3 style="color: var(--primary);">My Order History</h3>
        
        <!-- Filter Tabs -->
        <div class="filter-pills">
          ${['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(filter => `
            <button class="pill-btn ${activeOrderFilter === filter ? 'active' : ''}" onclick="setOrderFilter('${filter}')">
              ${filter}
            </button>
          `).join('')}
        </div>
      </div>

      ${renderOrdersList(filteredOrders)}
    `;
  }

  if (activeDashboardTab === 'notifications') {
    window.db.markNotificationsRead(window.auth.currentUser.id);

    return `
      <h3 style="color: var(--primary); margin-bottom: 16px;">Notifications & Updates</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${notifications.length === 0 ? '<p style="color: var(--text-muted);">No notifications yet.</p>' : notifications.map(n => `
          <div class="notification-card">
            <div style="font-weight: 700; color: var(--primary);">${n.title}</div>
            <div style="font-size: 0.875rem; color: var(--text-dark); margin: 4px 0;">${n.message}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(n.created_at).toLocaleString('en-IN')}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (activeDashboardTab === 'profile') {
    const user = window.auth.currentUser;
    return `
      <h3 style="color: var(--primary); margin-bottom: 16px;">My Customer Profile</h3>
      <div class="profile-box">
        <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
          <div class="avatar-circle-lg">${user.full_name.charAt(0).toUpperCase()}</div>
          <div>
            <h4>${user.full_name}</h4>
            <p style="color: var(--text-muted);">Customer ID: ${user.customer_id}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" class="input-field" value="${user.full_name}" readonly>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="text" class="input-field" value="${user.email}" readonly>
          </div>
          <div class="form-group">
            <label>Mobile Number</label>
            <input type="text" class="input-field" value="${user.mobile}" readonly>
          </div>
          <div class="form-group">
            <label>Account Role</label>
            <input type="text" class="input-field" value="${user.role.toUpperCase()}" readonly>
          </div>
        </div>
      </div>
    `;
  }
}

window.setOrderFilter = function(filter) {
  activeOrderFilter = filter;
  renderDashboardModal();
};

function renderOrdersList(orders) {
  if (!orders || orders.length === 0) {
    return `
      <div style="text-align: center; padding: 40px; background: #fff; border-radius: 8px; border: 1px dashed var(--border-color);">
        <p style="color: var(--text-muted);">No orders found matching the criteria.</p>
      </div>
    `;
  }

  return orders.map(order => {
    const fullOrder = window.db.getOrderById(order.id);
    const statusClass = getStatusBadgeClass(order.order_status);

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <span style="font-weight: 700; color: var(--primary);">Order #${order.order_number}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">(${new Date(order.created_at).toLocaleDateString('en-IN')})</span>
          </div>
          <span class="status-badge ${statusClass}">${order.order_status}</span>
        </div>

        <div class="order-items-preview">
          ${(fullOrder.items || []).map(item => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <img src="${item.product_image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: contain; background: #f5f8f6;">
              <div style="flex: 1; font-size: 0.85rem;">
                <strong>${item.product_name}</strong> × ${item.quantity}
              </div>
              <div style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">₹${item.total_price}</div>
            </div>
          `).join('')}
        </div>

        <div class="order-card-footer">
          <div>
            Total Amount: <strong style="color: var(--primary); font-size: 1.1rem;">₹${order.total_amount}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">(${order.payment_method})</span>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-sm btn-outline" onclick="openOrderTrackingModal('${order.id}')">
              📍 Track Order
            </button>
            <button class="btn-sm btn-outline" onclick="window.generateAndPrintInvoice('${order.id}')">
              📄 Invoice
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending': case 'Order Placed': return 'badge-yellow';
    case 'Confirmed': case 'Payment Confirmed': return 'badge-blue';
    case 'Processing': case 'Packed': return 'badge-purple';
    case 'Shipped': return 'badge-indigo';
    case 'Out for Delivery': return 'badge-orange';
    case 'Delivered': return 'badge-green';
    case 'Cancelled': return 'badge-red';
    default: return 'badge-blue';
  }
}

// Order Stepper Tracking Modal
window.openOrderTrackingModal = function(orderId) {
  const order = window.db.getOrderById(orderId);
  if (!order) return;

  const currentStageIndex = trackingStages.indexOf(order.order_status);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 3;

  const modalHTML = `
    <div class="modal-overlay open" id="trackingOverlay" onclick="closeTrackingModal()">
      <div style="position: relative; background: #fff; width: 92%; max-width: 680px; margin: 40px auto; padding: 24px; border-radius: 12px; box-shadow: var(--shadow-lg);" onclick="event.stopPropagation()">
        <button style="position: absolute; top: 16px; right: 16px; font-size: 1.5rem; background: none;" onclick="closeTrackingModal()">&times;</button>
        
        <h3 style="color: var(--primary); margin-bottom: 4px;">Live Order Tracking</h3>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 20px;">Order #${order.order_number} | Courier: <strong>${order.courier_name}</strong> | AWB: <strong>${order.tracking_number}</strong></p>

        <!-- Stepper Progress Bar -->
        <div class="stepper-wrapper">
          ${trackingStages.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            return `
              <div class="stepper-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                <div class="stepper-circle">${idx + 1}</div>
                <div class="stepper-label">${stage}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Tracking Details Info Box -->
        <div style="background: var(--accent-light); padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #d1e3d6; font-size: 0.875rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div><strong>Courier Partner:</strong> ${order.courier_name}</div>
            <div><strong>Tracking AWB:</strong> ${order.tracking_number}</div>
            <div><strong>Estimated Delivery:</strong> ${order.estimated_delivery_date || 'In 3-5 days'}</div>
            <div><strong>Delivery Address:</strong> ${order.delivery_address}</div>
          </div>
        </div>

        <!-- Detailed Tracking Logs Timeline -->
        <h4 style="color: var(--primary); margin-bottom: 12px;">Status Update Log</h4>
        <div class="timeline-log">
          ${(order.tracking || []).map(log => `
            <div class="timeline-log-item">
              <div class="timeline-dot"></div>
              <div style="flex: 1;">
                <div style="font-weight: 700; color: var(--primary);">${log.status}</div>
                <div style="font-size: 0.825rem; color: var(--text-dark);">${log.description}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${new Date(log.created_at).toLocaleString('en-IN')} by ${log.updated_by}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;
};

window.closeTrackingModal = function() {
  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = '';
};

window.updateNotificationBadge = function() {
  if (!window.auth.currentUser) return;
  const notifs = window.db.getNotifications(window.auth.currentUser.id);
  const unreadCount = notifs.filter(n => !n.is_read).length;
  
  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
};
