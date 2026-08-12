/* ==========================================================================
   GreenLeaf Organics - Real Supabase Database Engine (db.js)
   ========================================================================== */

window.escapeHTML = function(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
};

class SupabaseDatabaseEngine {
  constructor() {
    this.SUPABASE_URL = 'https://pltyhdnmxzkpkypmfoop.supabase.co/rest/v1';
    this.API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdHloZG5teHprcGt5cG1mb29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NTcxMjgsImV4cCI6MjEwMTIzMzEyOH0.aaPRSIMFd-qaH1hLLb6_I40ECNlqjo8giMHc6z8T7Eo';
    
    this.headers = {
      'apikey': this.API_KEY,
      'Authorization': `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    this.cache = {
      customers: [],
      products: [],
      orders: [],
      order_items: [],
      order_tracking: [],
      notifications: [],
      coupons: [],
      payment_settings: null,
      site_settings: null
    };

    // Initial sync with Supabase PostgreSQL
    this.syncAll();
  }

  async fetchFromSupabase(table, queryParams = '') {
    try {
      const res = await fetch(`${this.SUPABASE_URL}/${table}${queryParams}`, {
        method: 'GET',
        headers: this.headers
      });
      if (!res.ok) throw new Error(`Supabase GET error: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.warn(`Supabase fetch failed for table ${table}:`, e);
      return [];
    }
  }

  async postToSupabase(table, data) {
    try {
      const res = await fetch(`${this.SUPABASE_URL}/${table}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Supabase POST error: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error(`Supabase insert failed for table ${table}:`, e);
      return null;
    }
  }

  async patchToSupabase(table, matchQuery, data) {
    try {
      const res = await fetch(`${this.SUPABASE_URL}/${table}?${matchQuery}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Supabase PATCH error: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error(`Supabase update failed for table ${table}:`, e);
      return null;
    }
  }

  async deleteFromSupabase(table, matchQuery) {
    try {
      const res = await fetch(`${this.SUPABASE_URL}/${table}?${matchQuery}`, {
        method: 'DELETE',
        headers: this.headers
      });
      return res.ok;
    } catch (e) {
      console.error(`Supabase delete failed for table ${table}:`, e);
      return false;
    }
  }

  async syncAll() {
    this.cache.customers = await this.fetchFromSupabase('customers') || [];
    const fetchedProducts = await this.fetchFromSupabase('products');
    if (fetchedProducts && fetchedProducts.length > 0) {
      this.cache.products = fetchedProducts;
    } else if ((!this.cache.products || this.cache.products.length === 0) && window.defaultProducts) {
      this.cache.products = [...window.defaultProducts];
    }
    this.cache.orders = await this.fetchFromSupabase('orders') || [];
    this.cache.order_items = await this.fetchFromSupabase('order_items') || [];
    this.cache.order_tracking = await this.fetchFromSupabase('order_tracking') || [];
    this.cache.notifications = await this.fetchFromSupabase('notifications') || [];
    this.cache.coupons = await this.fetchFromSupabase('coupons') || [];
    const settings = await this.fetchFromSupabase('payment_settings', '?id=eq.1');
    if (settings && settings[0]) {
      this.cache.payment_settings = settings[0];
      try { localStorage.setItem('glo_payment_settings', JSON.stringify(settings[0])); } catch(e) {}
    } else {
      const local = localStorage.getItem('glo_payment_settings');
      if (local) {
        try { this.cache.payment_settings = JSON.parse(local); } catch(e) {}
      }
      if (!this.cache.payment_settings || this.cache.payment_settings.upi_id === 'greenleaforganics@upi') {
        this.cache.payment_settings = {
          id: 1,
          upi_id: 'adithyarajvalar@okaxis',
          custom_qr_image: 'assets/images/admin_upi_qr.jpg',
          upi_enabled: true,
          card_enabled: true,
          cod_enabled: false
        };
        try { localStorage.setItem('glo_payment_settings', JSON.stringify(this.cache.payment_settings)); } catch(e) {}
      } else {
        this.cache.payment_settings.cod_enabled = false;
        try { localStorage.setItem('glo_payment_settings', JSON.stringify(this.cache.payment_settings)); } catch(e) {}
      }
    }

    const siteConfig = await this.fetchFromSupabase('site_settings', '?id=eq.1');
    if (siteConfig && siteConfig[0]) {
      this.cache.site_settings = siteConfig[0];
      try { localStorage.setItem('glo_site_settings', JSON.stringify(siteConfig[0])); } catch(e) {}
    } else {
      const localSite = localStorage.getItem('glo_site_settings');
      if (localSite) {
        try { this.cache.site_settings = JSON.parse(localSite); } catch(e) {}
      }
      if (!this.cache.site_settings) {
        this.cache.site_settings = {
          id: 1,
          store_name: 'GreenLeaf Organics',
          store_tagline: 'ORGANICS',
          logo_url: '',
          announcement_text: 'Free Shipping on orders above ₹999',
          support_phone: '+91 96263 88886',
          support_email: 'support@greenleaforganics.com',
          store_address: 'Tamil Nadu, India, Pin - 626101'
        };
      }
    }

    if (window.applySiteSettings) window.applySiteSettings();
    if (window.renderProducts) window.renderProducts();
    if (window.renderAdminPortal && window.currentAdminTab) window.renderAdminPortal();
  }

  // --- Customer Operations ---
  createCustomer(data) {
    const newCust = {
      id: 'cust_' + Date.now(),
      auth_user_id: 'usr_' + Date.now(),
      full_name: data.full_name,
      email: data.email.toLowerCase(),
      mobile: data.mobile,
      password_hash: data.password,
      profile_image: data.profile_image || '',
      role: 'customer',
      created_at: new Date().toISOString()
    };

    this.cache.customers.push(newCust);
    this.postToSupabase('customers', newCust);
    return newCust;
  }

  findCustomerByEmailOrMobile(identifier) {
    const clean = identifier.toLowerCase().trim();
    return this.cache.customers.find(c => c.email === clean || c.mobile === clean);
  }

  getCustomerByAuthId(userId) {
    return this.cache.customers.find(c => c.auth_user_id === userId);
  }

  getAllCustomers() {
    return this.cache.customers;
  }

  // --- Product Operations (CRUD) ---
  getProducts() {
    if ((!this.cache.products || this.cache.products.length === 0) && window.defaultProducts) {
      this.cache.products = [...window.defaultProducts];
    }
    return this.cache.products || [];
  }

  getCategories() {
    const products = this.getProducts();
    const cats = new Set((products || []).map(p => (p.category || 'general').toLowerCase().trim()));
    cats.add('vetiver');
    cats.add('fertiliser');
    cats.add('seeds');
    return Array.from(cats);
  }

  addProduct(prodData) {
    this.getProducts();
    const newProd = {
      id: 'p_' + Date.now(),
      name: prodData.name,
      unit: prodData.unit || 'Pack',
      price: parseFloat(prodData.price),
      category: prodData.category,
      image: prodData.image || 'assets/images/vetiver_grow_bag.jpg',
      badge: prodData.badge || '',
      in_stock: true
    };

    this.cache.products.push(newProd);
    this.postToSupabase('products', newProd);
    if (window.renderProducts) window.renderProducts();
    return newProd;
  }

  updateProduct(id, prodData) {
    const prod = this.cache.products.find(p => p.id === id);
    if (!prod) return null;

    if (prodData.name) prod.name = prodData.name;
    if (prodData.unit) prod.unit = prodData.unit;
    if (prodData.price) prod.price = parseFloat(prodData.price);
    if (prodData.category) prod.category = prodData.category;
    if (prodData.badge !== undefined) prod.badge = prodData.badge;
    if (prodData.image) prod.image = prodData.image;

    this.patchToSupabase('products', `id=eq.${id}`, prodData);
    if (window.renderProducts) window.renderProducts();
    return prod;
  }

  toggleProductStock(id) {
    const prod = this.cache.products.find(p => p.id === id);
    if (prod) {
      prod.in_stock = !prod.in_stock;
      this.patchToSupabase('products', `id=eq.${id}`, { in_stock: prod.in_stock });
    }
    if (window.renderProducts) window.renderProducts();
    return prod;
  }

  deleteProduct(id) {
    this.cache.products = this.cache.products.filter(p => p.id !== id);
    this.deleteFromSupabase('products', `id=eq.${id}`);
    if (window.renderProducts) window.renderProducts();
  }

  // --- Coupon Operations ---
  getCoupons() {
    return this.cache.coupons || [];
  }

  addCoupon(couponData) {
    const newCoupon = {
      id: 'cpn_' + Date.now(),
      code: couponData.code.toUpperCase().trim(),
      discount_type: couponData.discount_type,
      discount_value: parseFloat(couponData.discount_value),
      min_order: parseFloat(couponData.min_order || 0),
      is_active: true
    };

    this.cache.coupons.push(newCoupon);
    this.postToSupabase('coupons', newCoupon);
    return newCoupon;
  }

  deleteCoupon(id) {
    this.cache.coupons = this.cache.coupons.filter(c => c.id !== id);
    this.deleteFromSupabase('coupons', `id=eq.${id}`);
  }

  // --- Payment Settings Operations ---
  getPaymentSettings() {
    if (!this.cache.payment_settings) {
      const local = localStorage.getItem('glo_payment_settings');
      if (local) {
        try { this.cache.payment_settings = JSON.parse(local); } catch(e) {}
      }
    }
    if (!this.cache.payment_settings || this.cache.payment_settings.upi_id === 'greenleaforganics@upi') {
      this.cache.payment_settings = {
        id: 1,
        upi_id: 'adithyarajvalar@okaxis',
        custom_qr_image: 'assets/images/admin_upi_qr.jpg',
        upi_enabled: true,
        card_enabled: true,
        cod_enabled: false
      };
      try { localStorage.setItem('glo_payment_settings', JSON.stringify(this.cache.payment_settings)); } catch(e) {}
    } else {
      this.cache.payment_settings.cod_enabled = false;
      try { localStorage.setItem('glo_payment_settings', JSON.stringify(this.cache.payment_settings)); } catch(e) {}
    }
    return this.cache.payment_settings;
  }

  updatePaymentSettings(settings) {
    this.cache.payment_settings = {
      ...this.getPaymentSettings(),
      ...settings
    };
    try {
      localStorage.setItem('glo_payment_settings', JSON.stringify(this.cache.payment_settings));
    } catch(e) {}
    this.patchToSupabase('payment_settings', 'id=eq.1', this.cache.payment_settings);
    return this.cache.payment_settings;
  }

  // --- Site & Store Settings Operations ---
  getSiteSettings() {
    if (!this.cache.site_settings) {
      const local = localStorage.getItem('glo_site_settings');
      if (local) {
        try { this.cache.site_settings = JSON.parse(local); } catch(e) {}
      }
    }
    if (!this.cache.site_settings) {
      this.cache.site_settings = {
        id: 1,
        store_name: 'GreenLeaf Organics',
        store_tagline: 'ORGANICS',
        logo_url: '',
        announcement_text: 'Free Shipping on orders above ₹999',
        support_phone: '+91 96263 88886',
        support_email: 'support@greenleaforganics.com',
        store_address: 'Tamil Nadu, India, Pin - 626101'
      };
    }
    return this.cache.site_settings;
  }

  updateSiteSettings(settings) {
    this.cache.site_settings = {
      ...this.getSiteSettings(),
      ...settings
    };
    try {
      localStorage.setItem('glo_site_settings', JSON.stringify(this.cache.site_settings));
    } catch(e) {}
    this.patchToSupabase('site_settings', 'id=eq.1', this.cache.site_settings);
    if (window.applySiteSettings) window.applySiteSettings();
    return this.cache.site_settings;
  }

  // --- User Password Operations ---
  updateUserPassword(identifier, newPassword) {
    const cust = this.cache.customers.find(c => c.email === identifier || c.mobile === identifier || c.auth_user_id === identifier || c.id === identifier);
    if (!cust) return false;

    cust.password_hash = newPassword;
    this.patchToSupabase('customers', `id=eq.${cust.id}`, { password_hash: newPassword });

    if (window.auth && window.auth.currentUser && (window.auth.currentUser.id === cust.auth_user_id || window.auth.currentUser.email === cust.email)) {
      window.auth.currentUser.password = newPassword;
    }
    return true;
  }

  // --- Order Operations ---
  createOrder(orderData, itemsData) {
    const orderId = 'ord_' + Date.now();
    const orderNum = 'GLO-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();

    const newOrder = {
      id: orderId,
      order_number: orderNum,
      user_id: orderData.user_id,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_mobile: orderData.customer_mobile,
      delivery_address: orderData.delivery_address,
      subtotal: orderData.subtotal,
      delivery_charge: orderData.delivery_charge,
      discount: orderData.discount || 0,
      tax: orderData.tax || 0,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      payment_status: 'Paid',
      transaction_id: 'TXN' + Math.floor(100000000 + Math.random() * 900000000),
      order_status: 'Order Placed',
      courier_name: 'Pending Assignment',
      tracking_number: 'Pending',
      tracking_url: '',
      estimated_delivery_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      created_at: now,
      updated_at: now
    };

    this.cache.orders.push(newOrder);
    this.postToSupabase('orders', newOrder);

    itemsData.forEach(item => {
      const itemObj = {
        id: 'item_' + Math.random().toString(36).substr(2, 9),
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      };
      this.cache.order_items.push(itemObj);
      this.postToSupabase('order_items', itemObj);
    });

    const trackingObj = {
      id: 'tr_' + Date.now(),
      order_id: orderId,
      status: 'Order Placed',
      description: 'Your order has been received.',
      updated_by: 'Customer',
      created_at: now
    };
    this.cache.order_tracking.push(trackingObj);
    this.postToSupabase('order_tracking', trackingObj);

    const notifObj = {
      id: 'notif_' + Date.now(),
      user_id: orderData.user_id,
      order_id: orderId,
      title: 'Order Placed Successfully! 🎉',
      message: `Your order ${orderNum} for ₹${orderData.total_amount} was placed successfully.`,
      is_read: false,
      created_at: now
    };
    this.cache.notifications.push(notifObj);
    this.postToSupabase('notifications', notifObj);

    return newOrder;
  }

  getOrdersByUserId(userId) {
    return (this.cache.orders || []).filter(o => o.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getOrderById(orderId) {
    const order = (this.cache.orders || []).find(o => o.id === orderId);
    if (!order) return null;

    const items = (this.cache.order_items || []).filter(i => i.order_id === orderId);
    const tracking = (this.cache.order_tracking || []).filter(t => t.order_id === orderId).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return { ...order, items, tracking };
  }

  getAllOrders() {
    return (this.cache.orders || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  updateOrderStatus(orderId, updateData) {
    const order = (this.cache.orders || []).find(o => o.id === orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    order.order_status = updateData.order_status || order.order_status;
    if (updateData.payment_status) order.payment_status = updateData.payment_status;
    if (updateData.courier_name) order.courier_name = updateData.courier_name;
    if (updateData.tracking_number) order.tracking_number = updateData.tracking_number;
    if (updateData.tracking_url) order.tracking_url = updateData.tracking_url;
    if (updateData.estimated_delivery_date) order.estimated_delivery_date = updateData.estimated_delivery_date;
    order.updated_at = now;

    this.patchToSupabase('orders', `id=eq.${orderId}`, order);

    const trackingObj = {
      id: 'tr_' + Date.now(),
      order_id: orderId,
      status: updateData.order_status,
      description: updateData.status_note || `Order status updated to ${updateData.order_status}`,
      updated_by: 'Admin',
      created_at: now
    };
    this.cache.order_tracking.push(trackingObj);
    this.postToSupabase('order_tracking', trackingObj);

    const notifObj = {
      id: 'notif_' + Date.now(),
      user_id: order.user_id,
      order_id: orderId,
      title: `Order Update: ${updateData.order_status} 📦`,
      message: `Your order ${order.order_number} status updated to: ${updateData.order_status}. ${updateData.status_note || ''}`,
      is_read: false,
      created_at: now
    };
    this.cache.notifications.push(notifObj);
    this.postToSupabase('notifications', notifObj);

    return order;
  }

  updateOrderPaymentStatus(orderId, paymentStatus, transactionId = '') {
    const order = (this.cache.orders || []).find(o => o.id === orderId);
    if (!order) return null;

    order.payment_status = paymentStatus;
    if (transactionId) order.transaction_id = transactionId;
    order.updated_at = new Date().toISOString();

    this.patchToSupabase('orders', `id=eq.${orderId}`, { payment_status: paymentStatus, transaction_id: order.transaction_id });

    const notifObj = {
      id: 'notif_' + Date.now(),
      user_id: order.user_id,
      order_id: orderId,
      title: `Payment Update: ${paymentStatus}`,
      message: `Your payment status for order ${order.order_number} has been updated to: ${paymentStatus}.`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.cache.notifications.push(notifObj);
    this.postToSupabase('notifications', notifObj);

    return order;
  }

  getNotifications(userId) {
    return (this.cache.notifications || []).filter(n => n.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  markNotificationsRead(userId) {
    if (!this.cache.notifications) return;
    this.cache.notifications.forEach(n => {
      if (n.user_id === userId) {
        n.is_read = true;
        this.patchToSupabase('notifications', `id=eq.${n.id}`, { is_read: true });
      }
    });
  }
}

// Global Supabase Database Singleton Instance
window.db = new SupabaseDatabaseEngine();
