/* ==========================================================================
   GreenLeaf Organics - Authentication Service (auth.js)
   ========================================================================== */

class AuthService {
  constructor() {
    this.SESSION_KEY = 'GLO_AUTH_SESSION';
    this.currentUser = this.loadSession();
  }

  loadSession() {
    const raw = localStorage.getItem(this.SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  saveSession(user) {
    this.currentUser = user;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    this.onAuthStateChanged(user);
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.SESSION_KEY);
    this.onAuthStateChanged(null);
    if (typeof showToast === 'function') {
      showToast("Successfully logged out.");
    }
  }

  register(data) {
    // Validations
    if (!data.full_name || !data.email || !data.mobile || !data.password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    if (data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    if (data.password !== data.confirm_password) {
      return { success: false, message: 'Password and Confirm Password do not match.' };
    }

    // Check Duplicate Email or Mobile
    const existing = window.db.findCustomerByEmailOrMobile(data.email) || window.db.findCustomerByEmailOrMobile(data.mobile);
    if (existing) {
      return { success: false, message: 'An account with this Email or Mobile Number already exists.' };
    }

    // Create Customer
    const newCustomer = window.db.createCustomer({
      full_name: data.full_name,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      profile_image: data.profile_image || ''
    });

    // Auto Login
    const sessionUser = {
      id: newCustomer.auth_user_id,
      customer_id: newCustomer.id,
      full_name: newCustomer.full_name,
      email: newCustomer.email,
      mobile: newCustomer.mobile,
      role: newCustomer.role
    };

    this.saveSession(sessionUser);
    return { success: true, user: sessionUser };
  }

  login(identifier, password) {
    if (!identifier || !password) {
      return { success: false, message: 'Please enter Email/Mobile and Password.' };
    }

    const customer = window.db.findCustomerByEmailOrMobile(identifier);
    if (!customer || customer.password_hash !== password) {
      return { success: false, message: 'Invalid email, mobile number, or password.' };
    }

    const sessionUser = {
      id: customer.auth_user_id,
      customer_id: customer.id,
      full_name: customer.full_name,
      email: customer.email,
      mobile: customer.mobile,
      role: customer.role
    };

    this.saveSession(sessionUser);
    return { success: true, user: sessionUser };
  }

  requireAuth(callback, promptMessage = "Please login to continue your purchase.") {
    if (this.currentUser) {
      callback(this.currentUser);
    } else {
      openAuthModal('login', promptMessage);
    }
  }

  onAuthStateChanged(user) {
    // Update Header Account Button Text
    const accountVal = document.getElementById('headerAccountVal');
    const accountLbl = document.getElementById('headerAccountLbl');

    if (accountVal && accountLbl) {
      if (user) {
        accountLbl.textContent = 'Welcome';
        accountVal.textContent = user.full_name.split(' ')[0] + (user.role === 'admin' ? ' (Admin)' : '');
      } else {
        accountLbl.textContent = 'My Account';
        accountVal.textContent = 'Login / Register';
      }
    }

    // Trigger UI updates
    if (window.updateDashboardUI) window.updateDashboardUI();
    if (window.updateNotificationBadge) window.updateNotificationBadge();
  }
}

// Global Auth Service Singleton Instance
window.auth = new AuthService();
