/* ==========================================================================
   GreenLeaf Organics - Admin Management Panel Logic (admin.js)
   ========================================================================== */

let adminSearchQuery = '';
let adminStatusFilter = 'All';

window.openAdminPanel = function() {
  if (!window.auth.currentUser || window.auth.currentUser.role !== 'admin') {
    alert("Access Denied. Only Admin accounts can access the Admin Panel. (Default Admin: admin@greenleaforganics.com / admin123)");
    openAuthModal('login', 'Please login with Admin credentials to access Admin Panel.');
    return;
  }

  renderAdminModal();
};

function renderAdminModal() {
  const orders = window.db.getAllOrders();
  const customers = window.db.getAllCustomers();

  const filteredOrders = orders.filter(order => {
    const query = adminSearchQuery.toLowerCase();
    const matchesSearch = 
      order.order_number.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_email.toLowerCase().includes(query) ||
      order.customer_mobile.toLowerCase().includes(query) ||
      order.user_id.toLowerCase().includes(query);

    const matchesStatus = adminStatusFilter === 'All' || order.order_status === adminStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const modalHTML = `
    <div class="modal-overlay open" id="adminOverlay" onclick="closeAdminPanel()">
      <div class="admin-container" onclick="event.stopPropagation()">
        <!-- Admin Header -->
        <div class="admin-header">
          <div>
            <h3>⚙️ GreenLeaf Organics - Admin Panel</h3>
            <p style="font-size: 0.8rem; opacity: 0.8;">Manage Customer Orders, Tracking Numbers, Status Updates & Customer Profiles</p>
          </div>
          <button class="close-btn" onclick="closeAdminPanel()">&times;</button>
        </div>

        <!-- Admin Layout Body -->
        <div class="admin-body">
          <!-- Control Bar -->
          <div class="admin-controls">
            <input type="text" class="input-field" placeholder="Search by Order ID, Customer Name, Email, Mobile, User ID..." value="${adminSearchQuery}" oninput="window.adminSearch(this.value)">
            
            <select class="input-field" onchange="window.adminFilterStatus(this.value)">
              <option value="All">All Statuses</option>
              <option value="Order Placed" ${adminStatusFilter === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
              <option value="Payment Confirmed" ${adminStatusFilter === 'Payment Confirmed' ? 'selected' : ''}>Payment Confirmed</option>
              <option value="Processing" ${adminStatusFilter === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Packed" ${adminStatusFilter === 'Packed' ? 'selected' : ''}>Packed</option>
              <option value="Shipped" ${adminStatusFilter === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Out for Delivery" ${adminStatusFilter === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="Delivered" ${adminStatusFilter === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${adminStatusFilter === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>

          <!-- Orders Table -->
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer Info</th>
                  <th>User ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Courier / Tracking</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOrders.length === 0 ? '<tr><td colspan="8" style="text-align:center;">No orders found.</td></tr>' : filteredOrders.map(order => `
                  <tr>
                    <td><strong>#${order.order_number}</strong></td>
                    <td>
                      <div><strong>${order.customer_name}</strong></div>
                      <div style="font-size: 0.75rem; color: #666;">${order.customer_email}</div>
                      <div style="font-size: 0.75rem; color: #666;">${order.customer_mobile}</div>
                    </td>
                    <td><code style="font-size: 0.75rem;">${order.user_id}</code></td>
                    <td>${new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    <td><strong>₹${order.total_amount}</strong></td>
                    <td><span class="status-badge ${getStatusClass(order.order_status)}">${order.order_status}</span></td>
                    <td>
                      <div style="font-size: 0.8rem;"><strong>${order.courier_name}</strong></div>
                      <div style="font-size: 0.75rem; color: #555;">${order.tracking_number}</div>
                    </td>
                    <td>
                      <button class="btn-sm btn-primary" onclick="openAdminUpdateModal('${order.id}')">Update Status</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;
}

window.adminSearch = function(query) {
  adminSearchQuery = query;
  renderAdminModal();
};

window.adminFilterStatus = function(status) {
  adminStatusFilter = status;
  renderAdminModal();
};

window.closeAdminPanel = function() {
  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = '';
};

// Admin Status Updater Popup
window.openAdminUpdateModal = function(orderId) {
  const order = window.db.getOrderById(orderId);
  if (!order) return;

  const modalHTML = `
    <div class="modal-overlay open" id="adminUpdateOverlay" onclick="closeAdminUpdateModal()">
      <div style="position: relative; background: #fff; width: 90%; max-width: 500px; margin: 60px auto; padding: 24px; border-radius: 12px; box-shadow: var(--shadow-lg);" onclick="event.stopPropagation()">
        <button style="position: absolute; top: 16px; right: 16px; font-size: 1.5rem; background: none;" onclick="closeAdminUpdateModal()">&times;</button>
        
        <h3 style="color: var(--primary); margin-bottom: 4px;">Update Order #${order.order_number}</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">Customer: ${order.customer_name} (${order.customer_email})</p>

        <form onsubmit="handleAdminStatusUpdate(event, '${order.id}')" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label>Order Status</label>
            <select id="updateStatusSelect" class="input-field" required>
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
            <label>Courier Partner Company</label>
            <input type="text" id="updateCourierInput" class="input-field" value="${order.courier_name || 'ST Courier'}" placeholder="e.g. ST Courier, DTDC, BlueDart">
          </div>

          <div class="form-group">
            <label>Tracking AWB / Consignment Number</label>
            <input type="text" id="updateTrackingInput" class="input-field" value="${order.tracking_number || ''}" placeholder="e.g. ST99281726IN">
          </div>

          <div class="form-group">
            <label>Estimated Delivery Date</label>
            <input type="date" id="updateDateInput" class="input-field" value="${order.estimated_delivery_date || ''}">
          </div>

          <div class="form-group">
            <label>Status Update Note for Customer</label>
            <textarea id="updateNoteInput" class="input-field" style="height: 60px;" placeholder="e.g. Order handed over to courier. Expected delivery by Thursday."></textarea>
          </div>

          <button type="submit" class="btn-primary" style="margin-top: 10px;">Save & Notify Customer</button>
        </form>
      </div>
    </div>
  `;

  const container = document.getElementById('modalContainer');
  if (container) container.innerHTML = modalHTML;
};

window.closeAdminUpdateModal = function() {
  renderAdminModal();
};

window.handleAdminStatusUpdate = function(e, orderId) {
  e.preventDefault();
  const status = document.getElementById('updateStatusSelect').value;
  const courier = document.getElementById('updateCourierInput').value;
  const tracking = document.getElementById('updateTrackingInput').value;
  const date = document.getElementById('updateDateInput').value;
  const note = document.getElementById('updateNoteInput').value;

  window.db.updateOrderStatus(orderId, {
    order_status: status,
    courier_name: courier,
    tracking_number: tracking,
    estimated_delivery_date: date,
    status_note: note
  });

  showToast(`Order status updated to "${status}" and customer notified!`);
  renderAdminModal();
};

function getStatusClass(status) {
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
