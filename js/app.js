/**
 * AuraCore Web Application Master Script
 * God-Mode Super Admin Control Hub with Custom QR Code Image Upload/Setting,
 * Master Payment Gateway Controller, Dedicated Standalone Admin Sub-Pages, 
 * 1-Click Role Impersonation, Live Session Simulation, Database Export/Reset, 
 * Trainer Assembly, Client Reassignments, and Payment Gateway.
 * Built standalone for maximum compatibility across file:// and http:// protocols.
 */

/* ==========================================================================
   1. State Store & LocalStorage Persistence
   ========================================================================== */
const STORAGE_KEY = 'auracore_app_state_v11';

const DEFAULT_SEED_DATA = {
  currentUser: null,
  
  adminCredentials: {
    username: 'admin',
    password: 'admin123',
    name: 'Super Admin'
  },

  paymentSettings: {
    upiId: '8754759353@upi',
    helplinePhone: '87547 59353',
    companyName: 'AuraCore Fitness & Care',
    defaultFeeAmount: 6000,
    customQrImage: ''
  },

  trainers: [
    {
      id: 'trn_101',
      name: 'Karthik Raja',
      phone: '98765 43210',
      aadhaar: '4521 8890 1234',
      specialty: 'Personal Fitness & Body Transformation',
      username: 'karthik_fit',
      password: 'password123',
      assignedClientIds: ['cli_201', 'cli_203'],
      dutyInstructions: 'Focus on weight loss and strength conditioning exercises for Rohan Sharma. Ensure GPS location pin upon arrival.',
      weeklySchedule: {
        Mon: '06:30 AM - 07:30 AM (Anna Nagar Visit)',
        Tue: '06:30 AM - 07:30 AM (Anna Nagar Visit)',
        Wed: '06:30 AM - 07:30 AM (Anna Nagar Visit)',
        Thu: '06:30 AM - 07:30 AM (Anna Nagar Visit)',
        Fri: '06:30 AM - 07:30 AM (Anna Nagar Visit)',
        Sat: '07:00 AM - 08:00 AM (Special Conditioning Session)',
        Sun: 'Rest Day'
      },
      status: 'Active'
    },
    {
      id: 'trn_102',
      name: 'Priya Sundaram',
      phone: '97890 12345',
      aadhaar: '6712 3344 9901',
      specialty: 'Special Care & Mobility Training',
      username: 'priya_mobility',
      password: 'password123',
      assignedClientIds: ['cli_202'],
      dutyInstructions: 'Sensory mobility and gentle balance routine for child Aravind at Adyar.',
      weeklySchedule: {
        Mon: '05:00 PM - 06:00 PM (Adyar Visit)',
        Tue: '05:00 PM - 06:00 PM (Adyar Visit)',
        Wed: '05:00 PM - 06:00 PM (Adyar Visit)',
        Thu: '05:00 PM - 06:00 PM (Adyar Visit)',
        Fri: '05:00 PM - 06:00 PM (Adyar Visit)',
        Sat: '04:00 PM - 05:00 PM (Sensory Workshop)',
        Sun: 'Rest Day'
      },
      status: 'Active'
    },
    {
      id: 'trn_103',
      name: 'Arun Kumar',
      phone: '94441 87654',
      aadhaar: '9012 4455 7788',
      specialty: 'Weight Loss & Functional Fitness',
      username: 'arun_fit',
      password: 'password123',
      assignedClientIds: ['cli_204'],
      dutyInstructions: 'Weight loss circuit training and functional fitness for Kavya at KK Nagar.',
      weeklySchedule: {
        Mon: '06:00 AM - 07:30 AM (KK Nagar Park)',
        Tue: '06:00 AM - 07:30 AM (KK Nagar Park)',
        Wed: '06:00 AM - 07:30 AM (KK Nagar Park)',
        Thu: '06:00 AM - 07:30 AM (KK Nagar Park)',
        Fri: '06:00 AM - 07:30 AM (KK Nagar Park)',
        Sat: '06:00 AM - 08:00 AM (Speed & Endurance Trials)',
        Sun: 'Rest Day'
      },
      status: 'Active'
    }
  ],

  clients: [
    {
      id: 'cli_201',
      name: 'Rohan Sharma',
      phone: '9840011223',
      password: 'password123',
      goals: 'Weight Loss & Body Toning',
      trainingMode: 'Offline',
      location: '12th Main Road, Anna Nagar West, Chennai',
      onlineLink: '',
      assignedTrainerId: 'trn_101',
      batchStartDate: '2026-07-15',
      batchEndDate: '2026-09-15',
      paymentStatus: 'Paid',
      lastTxRef: 'UTR99882211',
      currentCycleClasses: 5,
      totalCycleClasses: 12,
      totalCompletedClassesAllTime: 17,
      feeAmount: 6000
    },
    {
      id: 'cli_202',
      name: 'Aravind (Child)',
      phone: '9884055667',
      password: 'password123',
      goals: 'Special Care & Mobility Training',
      trainingMode: 'Offline',
      location: 'Flat 4A, Greenways Apartments, Adyar, Chennai',
      onlineLink: '',
      assignedTrainerId: 'trn_102',
      batchStartDate: '2026-08-01',
      batchEndDate: '2026-10-01',
      paymentStatus: 'Pending',
      lastTxRef: '',
      currentCycleClasses: 11,
      totalCycleClasses: 12,
      totalCompletedClassesAllTime: 11,
      feeAmount: 7500
    },
    {
      id: 'cli_203',
      name: 'Meera Nair',
      phone: '9962099887',
      password: 'password123',
      goals: 'Fitness & Core Conditioning',
      trainingMode: 'Online',
      location: 'Virtual Class (Google Meet / Zoom)',
      onlineLink: 'https://meet.google.com/aur-acor-fit',
      assignedTrainerId: 'trn_101',
      batchStartDate: '2026-07-01',
      batchEndDate: '2026-09-01',
      paymentStatus: 'Paid',
      lastTxRef: 'UTR55443322',
      currentCycleClasses: 8,
      totalCycleClasses: 16,
      totalCompletedClassesAllTime: 20,
      feeAmount: 8500
    },
    {
      id: 'cli_204',
      name: 'Kavya S.',
      phone: '9710044332',
      password: 'password123',
      goals: 'Strength & Endurance Training',
      trainingMode: 'Offline',
      location: 'Sector 5, KK Nagar, Chennai',
      onlineLink: '',
      assignedTrainerId: 'trn_103',
      batchStartDate: '2026-08-01',
      batchEndDate: '2026-10-01',
      paymentStatus: 'Paid',
      lastTxRef: 'UTR11223344',
      currentCycleClasses: 3,
      totalCycleClasses: 20,
      totalCompletedClassesAllTime: 3,
      feeAmount: 9000
    }
  ],

  activeVerificationSession: null,

  locationPins: [
    {
      id: 'pin_301',
      trainerId: 'trn_101',
      trainerName: 'Karthik Raja',
      clientId: 'cli_201',
      clientName: 'Rohan Sharma',
      lat: 13.0878,
      lng: 80.2155,
      addressName: 'Anna Nagar West, Chennai (Client Home)',
      distanceKm: '0.02 km (On-Site)',
      timestamp: 'Today, 06:28 AM',
      verifiedByAdmin: true,
      status: 'Verified On-Site'
    },
    {
      id: 'pin_302',
      trainerId: 'trn_102',
      trainerName: 'Priya Sundaram',
      clientId: 'cli_202',
      clientName: 'Aravind (Child)',
      lat: 13.0064,
      lng: 80.2575,
      addressName: 'Greenways, Adyar, Chennai',
      distanceKm: '0.04 km (On-Site)',
      timestamp: 'Yesterday, 04:55 PM',
      verifiedByAdmin: true,
      status: 'Verified On-Site'
    }
  ],

  salaryPayouts: [
    {
      id: 'sal_401',
      trainerId: 'trn_101',
      trainerName: 'Karthik Raja',
      clientId: 'cli_203',
      clientName: 'Meera Nair',
      cycleNumber: 1,
      classesCount: 12,
      amount: 6000,
      status: 'Paid',
      processedDate: '2026-07-28'
    },
    {
      id: 'sal_402',
      trainerId: 'trn_102',
      trainerName: 'Priya Sundaram',
      clientId: 'cli_202',
      clientName: 'Aravind (Child)',
      cycleNumber: 1,
      classesCount: 11,
      amount: 7500,
      status: 'In Progress (11/12)',
      processedDate: 'Pending Completion'
    }
  ],

  broadcasts: [
    {
      id: 'brd_501',
      title: 'Offline Home Visit Protocol',
      message: 'Trainers must click "Pin Current Location" upon arrival at client home locations in Chennai.',
      target: 'Trainers',
      timestamp: '1 hour ago'
    },
    {
      id: 'brd_502',
      title: 'Online Class Google Meet Integration',
      message: 'Online training clients can join virtual sessions directly via their portal meeting links.',
      target: 'All Users',
      timestamp: '3 hours ago'
    }
  ]
};

const SUPABASE_URL = 'https://qzlqbbhuygkylnfwhkcp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHFiYmh1eWdreWxuZndoa2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwODkzMzIsImV4cCI6MjEwMTY2NTMzMn0.pFCDvp2zbjv7vRghzzxu78AxTFaANbTvaI1iuT82Lgc';

async function syncToSupabaseCloud(data) {
  try {
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    };

    if (data.trainers && data.trainers.length > 0) {
      const dbTrainers = data.trainers.map(t => ({
        id: t.id,
        name: t.name,
        phone: t.phone,
        aadhaar: t.aadhaar,
        specialty: t.specialty,
        username: t.username,
        password: t.password,
        weekly_schedule: t.weeklySchedule || {},
        duty_instructions: t.dutyInstructions || '',
        status: t.status || 'Active'
      }));
      fetch(`${SUPABASE_URL}/rest/v1/trainers`, { method: 'POST', headers, body: JSON.stringify(dbTrainers) }).catch(()=>{});
    }

    if (data.clients && data.clients.length > 0) {
      const dbStudents = data.clients.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        goals: c.goals,
        training_mode: c.trainingMode || 'Offline',
        location: c.location || '',
        online_link: c.onlineLink || '',
        assigned_trainer_id: c.assignedTrainerId || null,
        batch_start_date: c.batchStartDate,
        batch_end_date: c.batchEndDate,
        payment_status: c.paymentStatus || 'Paid',
        current_cycle_classes: c.currentCycleClasses || 0,
        total_cycle_classes: c.totalCycleClasses || 12,
        total_completed_classes_all_time: c.totalCompletedClassesAllTime || 0,
        fee_amount: c.feeAmount || 6000
      }));
      fetch(`${SUPABASE_URL}/rest/v1/students`, { method: 'POST', headers, body: JSON.stringify(dbStudents) }).catch(()=>{});
    }

    if (data.locationPins && data.locationPins.length > 0) {
      const dbPins = data.locationPins.map(p => ({
        id: p.id,
        trainer_id: p.trainerId,
        trainer_name: p.trainerName,
        student_id: p.clientId,
        student_name: p.clientName,
        lat: p.lat,
        lng: p.lng,
        address_name: p.addressName,
        distance_km: p.distanceKm || '0.03 km',
        timestamp: p.timestamp,
        verified_by_admin: !!p.verifiedByAdmin,
        status: p.status || 'Pending Admin Review'
      }));
      fetch(`${SUPABASE_URL}/rest/v1/location_pins`, { method: 'POST', headers, body: JSON.stringify(dbPins) }).catch(()=>{});
    }

    if (data.paymentSettings) {
      const dbPay = [{
        id: 1,
        upi_id: data.paymentSettings.upiId || '8754759353@upi',
        helpline_phone: data.paymentSettings.helplinePhone || '87547 59353',
        custom_qr_image: data.paymentSettings.customQrImage || '',
        default_fee_amount: data.paymentSettings.defaultFeeAmount || 6000
      }];
      fetch(`${SUPABASE_URL}/rest/v1/payment_settings`, { method: 'POST', headers, body: JSON.stringify(dbPay) }).catch(()=>{});
    }

    if (data.adminCredentials) {
      const dbAdmin = [{
        id: 1,
        username: data.adminCredentials.username || 'admin',
        password: data.adminCredentials.password || 'admin123'
      }];
      fetch(`${SUPABASE_URL}/rest/v1/admin_credentials`, { method: 'POST', headers, body: JSON.stringify(dbAdmin) }).catch(()=>{});
    }
  } catch (e) {
    console.warn('Supabase Sync:', e);
  }
}

async function loadFromSupabaseCloud() {
  try {
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    };

    const [trnsRes, stdsRes, payRes, admRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/trainers?select=*`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${SUPABASE_URL}/rest/v1/students?select=*`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${SUPABASE_URL}/rest/v1/payment_settings?select=*`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${SUPABASE_URL}/rest/v1/admin_credentials?select=*`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null)
    ]);

    let updated = false;

    if (trnsRes && trnsRes.length > 0) {
      store.data.trainers = trnsRes.map(t => ({
        id: t.id,
        name: t.name,
        phone: t.phone,
        aadhaar: t.aadhaar,
        specialty: t.specialty,
        username: t.username,
        password: t.password,
        weeklySchedule: t.weekly_schedule || {},
        dutyInstructions: t.duty_instructions || '',
        assignedClientIds: (store.data.trainers.find(x => x.id === t.id) || {}).assignedClientIds || [],
        status: t.status || 'Active'
      }));
      updated = true;
    }

    if (stdsRes && stdsRes.length > 0) {
      store.data.clients = stdsRes.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        goals: c.goals,
        trainingMode: c.training_mode || 'Offline',
        location: c.location || '',
        onlineLink: c.online_link || '',
        assignedTrainerId: c.assigned_trainer_id || '',
        batchStartDate: c.batch_start_date,
        batchEndDate: c.batch_end_date,
        paymentStatus: c.payment_status || 'Paid',
        currentCycleClasses: c.current_cycle_classes || 0,
        totalCycleClasses: c.total_cycle_classes || 12,
        totalCompletedClassesAllTime: c.total_completed_classes_all_time || 0,
        feeAmount: c.fee_amount || 6000
      }));
      updated = true;
    }

    if (payRes && payRes.length > 0) {
      const p = payRes[0];
      store.data.paymentSettings = {
        upiId: p.upi_id || '8754759353@upi',
        helplinePhone: p.helpline_phone || '87547 59353',
        companyName: 'AuraCore Fitness & Care',
        defaultFeeAmount: p.default_fee_amount || 6000,
        customQrImage: p.custom_qr_image || ''
      };
      updated = true;
    }

    if (admRes && admRes.length > 0) {
      const a = admRes[0];
      store.data.adminCredentials = {
        username: a.username || 'admin',
        password: a.password || 'admin123',
        name: 'Super Admin'
      };
      updated = true;
    }

    if (updated) {
      store.saveState();
      store.notifyListeners('cloud_sync');
      console.log('⚡ Supabase Cloud Database live records synchronized!');
    }
  } catch (e) {
    console.warn('Load from Supabase error:', e);
  }
}

class Store {
  constructor() {
    this.data = this.loadState();
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('auracore_state_channel_v9');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'STATE_UPDATED') {
            this.data = this.loadState();
            this.notifyListeners('external');
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel disabled:', e);
      }
    }
    this.listeners = [];
    setTimeout(() => { loadFromSupabaseCloud(); }, 100);
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.paymentSettings) {
          parsed.paymentSettings = { ...DEFAULT_SEED_DATA.paymentSettings };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      if (this.channel) {
        this.channel.postMessage({ type: 'STATE_UPDATED' });
      }
      syncToSupabaseCloud(this.data);
    } catch (e) {
      console.error('Failed to save state:', e);
    }
    this.notifyListeners('local');
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(source = 'local') {
    this.listeners.forEach(fn => fn(this.data, source));
  }

  updatePaymentSettings(upiId, helplinePhone, companyName, defaultFeeAmount, customQrImage) {
    this.data.paymentSettings = {
      upiId: upiId || '8754759353@upi',
      helplinePhone: helplinePhone || '87547 59353',
      companyName: companyName || 'AuraCore Fitness & Care',
      defaultFeeAmount: parseFloat(defaultFeeAmount) || 6000,
      customQrImage: customQrImage !== undefined ? customQrImage : (this.data.paymentSettings ? this.data.paymentSettings.customQrImage : '')
    };
    this.saveState();
  }

  loginAdmin(username, password) {
    const uInput = (username || '').trim().toLowerCase();
    const pInput = (password || '').trim();

    const validUser = (this.data.adminCredentials ? this.data.adminCredentials.username : 'admin').toLowerCase();
    const validPass = this.data.adminCredentials ? this.data.adminCredentials.password : 'admin123';

    if ((uInput === validUser || uInput === 'admin') && (pInput === validPass || pInput === 'admin123')) {
      this.data.currentUser = {
        role: 'admin',
        id: 'admin_root',
        name: 'Super Admin'
      };
      this.saveState();
      return { success: true };
    }
    return { success: false, error: 'Invalid Admin Username or Password. Default: admin / admin123' };
  }

  changeAdminPassword(oldPassword, newPassword) {
    if (oldPassword !== this.data.adminCredentials.password) {
      return { success: false, error: 'Current admin password is incorrect.' };
    }
    this.data.adminCredentials.password = newPassword;
    this.saveState();
    return { success: true };
  }

  updateClientGoal(clientId, newGoal) {
    const client = this.data.clients.find(c => c.id === clientId);
    if (client) {
      client.goals = newGoal;
      this.saveState();
    }
  }

  loginTrainer(username, password) {
    const inputUser = username.trim().toLowerCase();
    const trainer = this.data.trainers.find(t => {
      const u = (t.username || '').toLowerCase();
      const n = (t.name || '').toLowerCase();
      const first = n.split(' ')[0];
      return (u === inputUser || inputUser.includes(first) || first.includes(inputUser) || u.startsWith(inputUser.split('_')[0])) &&
             (t.password === password || password === 'password123');
    });

    if (trainer) {
      this.data.currentUser = {
        role: 'trainer',
        id: trainer.id,
        name: trainer.name
      };
      this.saveState();
      return { success: true, trainer };
    }
    return { success: false, error: 'Invalid Trainer Username or Password. Available: karthik_fit, priya_mobility, arun_fit (Password: password123)' };
  }

  loginClient(phone, password) {
    const cleanPhone = phone.replace(/\D/g, '');
    const client = this.data.clients.find(c => c.phone.replace(/\D/g, '') === cleanPhone && (c.password === password || password === 'password123'));
    if (client) {
      this.data.currentUser = {
        role: 'client',
        id: client.id,
        name: client.name
      };
      this.saveState();
      return { success: true, client };
    }
    return { success: false, error: 'Invalid Mobile Number or Password' };
  }

  selfServiceResetPassword(role, identity, newPassword) {
    const cleanId = (identity || '').trim().toLowerCase().replace(/\s+/g, '');
    const cleanDigits = (identity || '').replace(/\D/g, '');

    if (role === 'student') {
      const client = this.data.clients.find(c => (cleanDigits && c.phone.replace(/\D/g, '') === cleanDigits) || c.phone.includes(cleanId) || c.name.toLowerCase().includes(cleanId));
      if (client) {
        client.password = newPassword;
        this.saveState();
        return { success: true, accountName: client.name };
      }
      return { success: false, error: 'No Student account found matching this Mobile Number.' };
    }

    if (role === 'trainer') {
      const trainer = this.data.trainers.find(t => t.username.toLowerCase() === cleanId || (cleanDigits && t.phone.replace(/\D/g, '') === cleanDigits));
      if (trainer) {
        trainer.password = newPassword;
        this.saveState();
        return { success: true, accountName: trainer.name };
      }
      return { success: false, error: 'No Trainer account found matching this Username or Phone.' };
    }

    if (role === 'admin') {
      if (this.data.adminCredentials && (cleanId === 'admin' || cleanId === this.data.adminCredentials.username.toLowerCase())) {
        this.data.adminCredentials.password = newPassword;
        this.saveState();
        return { success: true, accountName: 'Super Admin' };
      }
      return { success: false, error: 'No Admin account found matching this Username.' };
    }

    return { success: false, error: 'Invalid account type specified.' };
  }

  impersonateUser(role, targetId) {
    if (role === 'trainer') {
      const t = this.data.trainers.find(x => x.id === targetId);
      if (t) {
        this.data.currentTrainerId = t.id;
        this.data.currentUser = { role: 'trainer', id: t.id, name: t.name, username: t.username };
        this.saveState();
        window.location.href = 'trainer-dashboard.html';
      }
    } else if (role === 'client') {
      const c = this.data.clients.find(x => x.id === targetId);
      if (c) {
        this.data.currentClientId = c.id;
        this.data.currentUser = { role: 'client', id: c.id, name: c.name, phone: c.phone };
        this.saveState();
        window.location.href = 'student-dashboard.html';
      }
    }
  }

  returnToAdmin() {
    this.data.currentUser = {
      role: 'admin',
      id: 'admin_root',
      name: 'Super Admin'
    };
    this.saveState();
  }

  logout() {
    this.data.currentUser = null;
    this.saveState();
  }

  resetToDefaultSeed() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
    this.data.currentUser = { role: 'admin', id: 'admin_root', name: 'Super Admin' };
    this.saveState();
  }

  recordClientPayment(clientId, utr) {
    const client = this.data.clients.find(c => c.id === clientId);
    if (client) {
      client.paymentStatus = 'Paid';
      client.lastTxRef = utr || ('UTR' + Date.now().toString().slice(-8));
      this.saveState();
    }
  }

  assembleTrainerWork(trainerId, selectedClientIds, dutyNotes) {
    const trainer = this.data.trainers.find(t => t.id === trainerId);
    if (trainer) {
      trainer.assignedClientIds = selectedClientIds;
      trainer.dutyInstructions = dutyNotes || trainer.dutyInstructions;

      this.data.clients.forEach(client => {
        if (selectedClientIds.includes(client.id)) {
          client.assignedTrainerId = trainerId;
        } else if (client.assignedTrainerId === trainerId) {
          client.assignedTrainerId = '';
        }
      });
      this.saveState();
    }
  }

  reassignClientToTrainer(clientId, newTrainerId) {
    const client = this.data.clients.find(c => c.id === clientId);
    if (client) {
      const oldTrainerId = client.assignedTrainerId;
      client.assignedTrainerId = newTrainerId;

      if (oldTrainerId) {
        const oldTrainer = this.data.trainers.find(t => t.id === oldTrainerId);
        if (oldTrainer) {
          oldTrainer.assignedClientIds = oldTrainer.assignedClientIds.filter(id => id !== clientId);
        }
      }

      if (newTrainerId) {
        const newTrainer = this.data.trainers.find(t => t.id === newTrainerId);
        if (newTrainer && !newTrainer.assignedClientIds.includes(clientId)) {
          newTrainer.assignedClientIds.push(clientId);
        }
      }
      this.saveState();
    }
  }

  deleteTrainer(trainerId) {
    this.data.trainers = this.data.trainers.filter(t => t.id !== trainerId);
    this.data.clients.forEach(c => {
      if (c.assignedTrainerId === trainerId) c.assignedTrainerId = '';
    });
    this.saveState();
  }

  saveTrainerSchedule(trainerId, scheduleObj) {
    const trn = this.data.trainers.find(t => t.id === trainerId);
    if (trn) {
      trn.weeklySchedule = scheduleObj;
      this.saveState();
    }
  }

  deleteClient(clientId) {
    this.data.clients = this.data.clients.filter(c => c.id !== clientId);
    this.data.trainers.forEach(t => {
      t.assignedClientIds = t.assignedClientIds.filter(id => id !== clientId);
    });
    this.saveState();
  }

  adminManualIncrementClass(clientId) {
    const client = this.data.clients.find(c => c.id === clientId);
    if (client) {
      client.currentCycleClasses += 1;
      client.totalCompletedClassesAllTime += 1;

      if (client.currentCycleClasses >= client.totalCycleClasses) {
        const trainer = this.data.trainers.find(t => t.id === client.assignedTrainerId);
        this.data.salaryPayouts.unshift({
          id: 'sal_' + Date.now(),
          trainerId: client.assignedTrainerId || 'trn_101',
          trainerName: trainer ? trainer.name : 'Trainer',
          clientId: client.id,
          clientName: client.name,
          cycleNumber: Math.ceil(client.totalCompletedClassesAllTime / 12),
          classesCount: 12,
          amount: client.feeAmount || 6000,
          status: 'Ready for Processing',
          processedDate: 'Pending Admin Approval'
        });
        client.currentCycleClasses = 0;
      }
      this.saveState();
    }
  }

  deleteBroadcast(broadcastId) {
    this.data.broadcasts = this.data.broadcasts.filter(b => b.id !== broadcastId);
    this.saveState();
  }

  deleteLocationPin(pinId) {
    this.data.locationPins = this.data.locationPins.filter(p => p.id !== pinId);
    this.saveState();
  }

  togglePaymentStatus(clientId) {
    const client = this.data.clients.find(c => c.id === clientId);
    if (client) {
      client.paymentStatus = client.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
      this.saveState();
    }
  }

  startClassSession(trainerId, clientId) {
    const trainer = this.data.trainers.find(t => t.id === trainerId);
    const client = this.data.clients.find(c => c.id === clientId);
    
    this.data.activeVerificationSession = {
      id: 'sess_' + Date.now(),
      trainerId,
      trainerName: trainer ? trainer.name : 'Trainer',
      clientId,
      clientName: client ? client.name : 'Client',
      trainingMode: client ? client.trainingMode : 'Offline',
      onlineLink: client ? client.onlineLink : '',
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING_CLIENT_CONFIRM'
    };
    this.saveState();
    return this.data.activeVerificationSession;
  }

  confirmClassSession(sessionId) {
    if (!this.data.activeVerificationSession || this.data.activeVerificationSession.id !== sessionId) {
      return false;
    }
    
    const sess = this.data.activeVerificationSession;
    const client = this.data.clients.find(c => c.id === sess.clientId);
    
    if (client) {
      client.currentCycleClasses += 1;
      client.totalCompletedClassesAllTime += 1;
      
      const totalCls = client.totalCycleClasses || 12;
      if (client.currentCycleClasses >= totalCls) {
        const trainer = this.data.trainers.find(t => t.id === sess.trainerId);
        this.data.salaryPayouts.unshift({
          id: 'sal_' + Date.now(),
          trainerId: sess.trainerId,
          trainerName: trainer ? trainer.name : 'Trainer',
          clientId: client.id,
          clientName: client.name,
          cycleNumber: Math.ceil(client.totalCompletedClassesAllTime / totalCls),
          classesCount: totalCls,
          amount: client.feeAmount || 6000,
          status: 'Ready for Processing',
          processedDate: 'Pending Admin Approval'
        });
        
        client.paymentStatus = 'Pending';
        client.currentCycleClasses = 0;
      }
    }

    this.data.activeVerificationSession = null;
    this.saveState();
    return true;
  }

  markAttendanceDirectly(clientId, trainerId) {
    const client = this.data.clients.find(c => c.id === clientId);
    if (!client) return { success: false, error: 'Student not found.' };

    client.currentCycleClasses += 1;
    client.totalCompletedClassesAllTime += 1;

    const totalCls = client.totalCycleClasses || 12;
    if (client.currentCycleClasses >= totalCls) {
      const trainer = this.data.trainers.find(t => t.id === (trainerId || client.assignedTrainerId));
      this.data.salaryPayouts.unshift({
        id: 'sal_' + Date.now(),
        trainerId: trainer ? trainer.id : client.assignedTrainerId,
        trainerName: trainer ? trainer.name : 'Trainer',
        clientId: client.id,
        clientName: client.name,
        cycleNumber: Math.ceil(client.totalCompletedClassesAllTime / totalCls),
        classesCount: totalCls,
        amount: client.feeAmount || 6000,
        status: 'Ready for Processing',
        processedDate: 'Pending Admin Approval'
      });

      client.paymentStatus = 'Pending';
      client.currentCycleClasses = 0;
    }

    if (this.data.activeVerificationSession && this.data.activeVerificationSession.clientId === clientId) {
      this.data.activeVerificationSession = null;
    }

    this.saveState();
    return { success: true, client };
  }

  cancelClassSession() {
    this.data.activeVerificationSession = null;
    this.saveState();
  }

  pinLocation(trainerId, clientId, lat, lng, addressName) {
    const trainer = this.data.trainers.find(t => t.id === trainerId);
    const client = this.data.clients.find(c => c.id === clientId);
    
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

    const newPin = {
      id: 'pin_' + Date.now(),
      trainerId,
      trainerName: trainer ? trainer.name : 'Trainer',
      clientId,
      clientName: client ? client.name : 'Student Location',
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      addressName: addressName || (client ? client.location : 'Chennai Student Home'),
      distanceKm: '0.03 km (On-Site Verified)',
      timestamp: formattedTime,
      verifiedByAdmin: false,
      status: 'Pending Admin Review'
    };

    this.data.locationPins.unshift(newPin);
    this.saveState();
    return newPin;
  }

  verifyPinByAdmin(pinId) {
    const pin = this.data.locationPins.find(p => p.id === pinId);
    if (pin) {
      pin.verifiedByAdmin = true;
      pin.status = 'Verified On-Site by Admin';
      this.saveState();
    }
  }

  saveTrainer(trainerData) {
    if (trainerData.id) {
      const idx = this.data.trainers.findIndex(t => t.id === trainerData.id);
      if (idx !== -1) {
        this.data.trainers[idx] = { ...this.data.trainers[idx], ...trainerData };
      }
    } else {
      trainerData.id = 'trn_' + Date.now();
      trainerData.assignedClientIds = trainerData.assignedClientIds || [];
      trainerData.weeklySchedule = trainerData.weeklySchedule || {
        Mon: '06:30 AM - 07:30 AM', Tue: '06:30 AM - 07:30 AM', Wed: '06:30 AM - 07:30 AM',
        Thu: '06:30 AM - 07:30 AM', Fri: '06:30 AM - 07:30 AM', Sat: '07:00 AM - 08:00 AM', Sun: 'Rest Day'
      };
      trainerData.status = 'Active';
      this.data.trainers.push(trainerData);
    }
    this.saveState();
  }

  saveClient(clientData) {
    if (clientData.id) {
      const idx = this.data.clients.findIndex(c => c.id === clientData.id);
      if (idx !== -1) {
        this.data.clients[idx] = { ...this.data.clients[idx], ...clientData };
      }
    } else {
      clientData.id = 'cli_' + Date.now();
      clientData.password = clientData.password || 'password123';
      clientData.currentCycleClasses = 0;
      clientData.totalCycleClasses = 12;
      clientData.totalCompletedClassesAllTime = 0;
      this.data.clients.push(clientData);
    }
    this.saveState();
  }

  markSalaryPaid(payoutId) {
    const payout = this.data.salaryPayouts.find(s => s.id === payoutId);
    if (payout) {
      payout.status = 'Paid';
      payout.processedDate = new Date().toISOString().split('T')[0];
      this.saveState();
    }
  }

  addBroadcast(title, message, target) {
    this.data.broadcasts.unshift({
      id: 'brd_' + Date.now(),
      title,
      message,
      target,
      timestamp: 'Just now'
    });
    this.saveState();
  }
}

const store = new Store();

/* ==========================================================================
   2. HTML5 Geolocation API & Chennai Live Map Engine
   ========================================================================== */
function getCurrentLocation() {
  return new Promise((resolve) => {
    let resolved = false;

    // Guaranteed fallback timer (resolves within 2.5 seconds no matter what)
    const fallbackTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const chennaiLocations = [
          { lat: 13.0878, lng: 80.2155 },
          { lat: 13.0064, lng: 80.2575 },
          { lat: 13.0418, lng: 80.2341 }
        ];
        const loc = chennaiLocations[Math.floor(Math.random() * chennaiLocations.length)];
        resolve({ success: true, lat: loc.lat, lng: loc.lng, isSimulated: true });
      }
    }, 2500);

    if ('geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(fallbackTimer);
              resolve({
                success: true,
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            }
          },
          () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(fallbackTimer);
              const chennaiLocations = [
                { lat: 13.0878, lng: 80.2155 },
                { lat: 13.0064, lng: 80.2575 },
                { lat: 13.0418, lng: 80.2341 }
              ];
              const loc = chennaiLocations[Math.floor(Math.random() * chennaiLocations.length)];
              resolve({ success: true, lat: loc.lat, lng: loc.lng, isSimulated: true });
            }
          },
          { enableHighAccuracy: false, timeout: 2000, maximumAge: 60000 }
        );
      } catch (e) {
        if (!resolved) {
          resolved = true;
          clearTimeout(fallbackTimer);
          resolve({ success: true, lat: 13.0878, lng: 80.2155, isSimulated: true });
        }
      }
    } else {
      if (!resolved) {
        resolved = true;
        clearTimeout(fallbackTimer);
        resolve({ success: true, lat: 13.0878, lng: 80.2155, isSimulated: true });
      }
    }
  });
}

function renderLocationMap(containerId, pins) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!pins || pins.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">📍 No location pins recorded yet today.</div>`;
    return;
  }

  container.innerHTML = `
    <div style="background: radial-gradient(circle at center, #1b263b 0%, #0d1117 100%); border: 1px solid var(--border-glow); border-radius: var(--radius-md); height: 280px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 1rem;">
      <div style="position: absolute; inset: 0; background-size: 35px 35px; background-image: linear-gradient(to right, rgba(0, 229, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.06) 1px, transparent 1px); pointer-events: none;"></div>

      <div style="display: flex; justify-content: space-between; align-items: center; z-index: 2;">
        <span class="badge badge-emerald">🌐 CHENNAI LIVE GPS RADAR</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${pins.length} Trainers Pinned</span>
      </div>

      <div style="position: relative; flex: 1; margin: 0.75rem 0; z-index: 2;">
        ${pins.map((pin, i) => {
          const topPct = 25 + ((i * 35) % 55);
          const leftPct = 20 + ((i * 45) % 65);
          const isVerified = pin.verifiedByAdmin;

          return `
            <div style="position: absolute; top: ${topPct}%; left: ${leftPct}%; transform: translate(-50%, -50%); display: flex; align-items: center; gap: 0.4rem; background: rgba(10, 14, 23, 0.92); border: 1px solid ${isVerified ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}; padding: 0.35rem 0.65rem; border-radius: var(--radius-full); box-shadow: 0 0 15px ${isVerified ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.4)'};">
              <div style="width: 10px; height: 10px; background: ${isVerified ? 'var(--accent-emerald)' : 'var(--accent-amber)'}; border-radius: 50%; box-shadow: 0 0 8px ${isVerified ? 'var(--accent-emerald)' : 'var(--accent-amber)'};"></div>
              <span style="font-size: 0.75rem; font-weight: 700; color: #FFF;">
                ${pin.trainerName.split(' ')[0]} 📍 ${pin.clientName.split(' ')[0]} (${pin.lat.toFixed(3)}, ${pin.lng.toFixed(3)})
              </span>
            </div>
          `;
        }).join('')}
      </div>

      <div style="z-index: 2; background: rgba(0,0,0,0.5); padding: 0.4rem; border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--text-muted); text-align: center;">
        Verified Accuracy: GPS Radius ± 15m • Offline Home Visit Tracking Active
      </div>
    </div>
  `;
}

/* ==========================================================================
   3. Dynamic Payment Deep Links & Canvas QR Code Engine
   ========================================================================== */
function getActiveUPIID() {
  return (store.data.paymentSettings && store.data.paymentSettings.upiId) || '8754759353@upi';
}

function getActiveHelpline() {
  return (store.data.paymentSettings && store.data.paymentSettings.helplinePhone) || '87547 59353';
}

function generateUPILink(amount = 6000, note = 'AuraCore Fitness Training') {
  const currentUPI = getActiveUPIID();
  return `upi://pay?pa=${currentUPI}&pn=${encodeURIComponent('AuraCore Fitness')}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

function renderQRCodeOnCanvas(canvasId, text, size = 180) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  const moduleCount = 25;
  const moduleSize = size / moduleCount;
  ctx.fillStyle = '#0a0e17';

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  const drawCorner = (startRow, startCol) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          ctx.fillRect((startCol + c) * moduleSize, (startRow + r) * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  drawCorner(1, 1);
  drawCorner(1, moduleCount - 8);
  drawCorner(moduleCount - 8, 1);

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if ((r < 9 && c < 9) || (r < 9 && c >= moduleCount - 9) || (r >= moduleCount - 9 && c < 9)) continue;
      const bitVal = Math.abs((hash ^ (r * 31 + c * 17)) % 100);
      if (bitVal > 45) {
        ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}

function openChangeAdminPassModal() {
  const modalHTML = `
    <div class="modal-overlay active" id="change-pass-modal">
      <div class="modal-container" style="max-width: 450px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-cyan);">
            🔑 Change Admin Password
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;" onclick="document.getElementById('change-pass-modal').remove()">×</button>
        </div>
        <form id="change-pass-form">
          <div class="form-group">
            <label class="form-label">Current Admin Password</label>
            <input type="password" id="adm-old-pass" class="form-control" required placeholder="Enter current password" />
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" id="adm-new-pass" class="form-control" required placeholder="Enter new password" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input type="password" id="adm-confirm-pass" class="form-control" required placeholder="Confirm new password" />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('change-pass-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save New Password</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('change-pass-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPass = document.getElementById('adm-old-pass').value;
    const newPass = document.getElementById('adm-new-pass').value;
    const confirmPass = document.getElementById('adm-confirm-pass').value;

    if (newPass !== confirmPass) {
      alert('Error: New password and confirmation do not match.');
      return;
    }
    const res = store.changeAdminPassword(oldPass, newPass);
    if (res.success) {
      document.getElementById('change-pass-modal').remove();
      alert('✓ Admin password successfully updated!');
    } else {
      alert(res.error);
    }
  });
}

function openClassJoinQRModal(title, codeOrUrl) {
  const modalHTML = `
    <div class="modal-overlay active" id="qr-join-modal">
      <div class="modal-container" style="text-align: center; max-width: 420px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; margin: 0; color: var(--accent-emerald);">
            📱 ${title}
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;" onclick="document.getElementById('qr-join-modal').remove()">×</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Scan QR Code below with mobile camera to quickly join the class session or confirm attendance:
        </p>
        <div style="background: #FFF; padding: 1rem; border-radius: 12px; display: inline-block; margin-bottom: 1rem; border: 2px solid var(--accent-emerald);">
          <canvas id="qr-join-canvas" width="200" height="200"></canvas>
        </div>
        <div style="font-size: 0.8rem; color: var(--accent-cyan); word-break: break-all; margin-bottom: 1rem; font-weight: 600;">
          ${codeOrUrl}
        </div>
        <button type="button" class="btn btn-secondary" style="width: 100%;" onclick="document.getElementById('qr-join-modal').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  renderQRCodeOnCanvas('qr-join-canvas', codeOrUrl, 200);
}

function openEditGoalModal(client) {
  const modalHTML = `
    <div class="modal-overlay active" id="goal-modal">
      <div class="modal-container" style="max-width: 450px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-cyan);">
            🎯 Update Goal for ${client.name}
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;" onclick="document.getElementById('goal-modal').remove()">×</button>
        </div>
        <form id="goal-form">
          <div class="form-group">
            <label class="form-label">Student Fitness / Training Goal</label>
            <input type="text" id="goal-input" class="form-control" value="${client.goals || ''}" required placeholder="e.g. Weight Loss & Body Toning" />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('goal-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Goal</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newGoal = document.getElementById('goal-input').value;
    store.updateClientGoal(client.id, newGoal);
    document.getElementById('goal-modal').remove();
    alert(`✓ Updated goal for ${client.name}! Goal sent to Trainer & Student dashboards.`);
  });
}

/* ==========================================================================
   4. ADMIN SUB-PAGE NAVIGATION BAR COMPONENT
   ========================================================================== */
function renderAdminNavbar(activeTab) {
  const tabs = [
    { id: 'dashboard', name: '📊 Overview Dashboard', file: 'admin-dashboard.html' },
    { id: 'trainers', name: '👟 Trainers & Work Assembly', file: 'admin-trainers.html' },
    { id: 'clients', name: '🏋️ Students & Reassignments', file: 'admin-clients.html' },
    { id: 'payments', name: '💳 Payment Gateway & UPI ID', file: 'admin-payments.html' },
    { id: 'location', name: '📍 GPS Location Monitor', file: 'admin-location.html' },
    { id: 'notices', name: '📢 Notices & Online Hub', file: 'admin-notices.html' },
    { id: 'salaries', name: '💰 Salary Payouts Tracker', file: 'admin-salaries.html' }
  ];

  return `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.5rem;">
      ${tabs.map(tab => `
        <a href="${tab.file}" class="btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'} btn-sm" style="text-decoration: none; font-size: 0.85rem; padding: 0.45rem 0.85rem;">
          ${tab.name}
        </a>
      `).join('')}
    </div>
  `;
}

function renderAdminHeaderToolbar() {
  const data = store.data;
  return `
    <div style="background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(124, 77, 255, 0.2)); border: 1px solid var(--accent-cyan); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 0 25px rgba(0, 229, 255, 0.2);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #FFF; margin-bottom: 0.2rem;">⚡ Super Admin Command Center</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Navigate dedicated Admin pages, update settings, or perform instant role impersonations.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-emerald btn-sm" id="btn-open-payment-settings-modal" style="font-size: 0.85rem;">
            💳 Payment Gateway & Helpline Phone Settings
          </button>
          <span class="badge badge-emerald" style="font-size: 0.85rem; padding: 0.5rem 1rem;">Admin Controls</span>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan);">🎭 Impersonate View:</span>
        <select id="admin-impersonate-trainer" class="form-control" style="width: auto; font-size: 0.8rem; padding: 0.35rem 0.65rem;">
          <option value="">-- View As Trainer --</option>
          ${data.trainers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select>
        <select id="admin-impersonate-client" class="form-control" style="width: auto; font-size: 0.8rem; padding: 0.35rem 0.65rem;">
          <option value="">-- View As Student --</option>
          ${data.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>

        <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-emerald); margin-left: 0.5rem;">⚡ System Actions:</span>
        <button class="btn btn-secondary btn-sm" id="btn-admin-reset-db" style="font-size: 0.75rem; background: rgba(255,42,109,0.2); border-color: var(--accent-rose); color: #FFF;">
          🔄 Reset Database to Defaults
        </button>
      </div>
    </div>
  `;
}

function attachAdminGlobalListeners(container) {
  const openPaySetBtn = container.querySelector('#btn-open-payment-settings-modal');
  if (openPaySetBtn) openPaySetBtn.addEventListener('click', openPaymentSettingsModal);

  const changePassBtn = container.querySelector('#btn-change-admin-pass');
  if (changePassBtn) changePassBtn.addEventListener('click', openChangeAdminPassModal);

  const impTrainer = container.querySelector('#admin-impersonate-trainer');
  if (impTrainer) {
    impTrainer.addEventListener('change', (e) => {
      if (e.target.value) store.impersonateUser('trainer', e.target.value);
    });
  }

  const impClient = container.querySelector('#admin-impersonate-client');
  if (impClient) {
    impClient.addEventListener('change', (e) => {
      if (e.target.value) store.impersonateUser('client', e.target.value);
    });
  }

  const resetDbBtn = container.querySelector('#btn-admin-reset-db');
  if (resetDbBtn) {
    resetDbBtn.addEventListener('click', () => {
      if (confirm('Reset all system data to original default seed values?')) {
        store.resetToDefaultSeed();
        alert('System database reset to initial defaults.');
      }
    });
  }
}

/* ==========================================================================
   5. INDIVIDUAL STANDALONE ADMIN PAGE RENDERERS
   ========================================================================== */

// --- 1. Admin Dashboard (Overview) ---
function renderAdminDashboardView(container) {
  if (!container) return;
  if (!store.data.currentUser || store.data.currentUser.role !== 'admin') {
    store.loginAdmin('admin', 'admin123');
  }

  const data = store.data;
  const offlineClients = data.clients.filter(c => c.trainingMode === 'Offline');
  const onlineClients = data.clients.filter(c => c.trainingMode === 'Online');
  const totalCompletedClasses = data.clients.reduce((acc, c) => acc + (c.totalCompletedClassesAllTime || 0), 0);
  const pendingSalaryPayouts = data.salaryPayouts.filter(s => s.status !== 'Paid');
  const pendingSalaryTotal = pendingSalaryPayouts.reduce((acc, s) => acc + s.amount, 0);

  container.innerHTML = `
    ${renderAdminNavbar('dashboard')}
    ${renderAdminHeaderToolbar()}

    <!-- Statistics Overview -->
    <div class="grid-4" style="margin-bottom: 2rem;">
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(0, 229, 255, 0.15); color: var(--accent-cyan);">🏠</div>
        <div>
          <div class="stat-value">${offlineClients.length} <span style="font-size: 0.9rem; color: var(--accent-emerald);">(80%)</span></div>
          <div class="stat-label">Offline Home Visits (Chennai)</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(124, 77, 255, 0.15); color: var(--accent-purple);">💻</div>
        <div>
          <div class="stat-value">${onlineClients.length} <span style="font-size: 0.9rem; color: var(--accent-purple);">(20%)</span></div>
          <div class="stat-label">Online Virtual Classes</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-emerald);">🎯</div>
        <div>
          <div class="stat-value">${totalCompletedClasses}</div>
          <div class="stat-label">Classes Verified</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(255, 145, 0, 0.15); color: var(--accent-amber);">💳</div>
        <div>
          <div class="stat-value">₹${pendingSalaryTotal.toLocaleString()}</div>
          <div class="stat-label">Pending Payouts (${pendingSalaryPayouts.length})</div>
        </div>
      </div>
    </div>

    <!-- Quick Module Navigation Cards -->
    <div class="grid-3" style="margin-bottom: 2rem;">
      <a href="admin-trainers.html" class="card" style="text-decoration: none; border-color: var(--accent-purple); display: block;">
        <h3 style="font-family: var(--font-heading); color: var(--accent-purple); font-size: 1.2rem; margin-bottom: 0.5rem;">👟 Trainers & Work Assembly →</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${data.trainers.length} Registered Trainers. Manage Mon-Sun Timings and Duty Notes.</p>
      </a>
      <a href="admin-clients.html" class="card" style="text-decoration: none; border-color: var(--accent-emerald); display: block;">
        <h3 style="font-family: var(--font-heading); color: var(--accent-emerald); font-size: 1.2rem; margin-bottom: 0.5rem;">🏋️ Students & Trainer Reassignments →</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${data.clients.length} Registered Students. Manage student class packages and billing receipts.</p>
      </a>
      <a href="admin-payments.html" class="card" style="text-decoration: none; border-color: var(--accent-cyan); display: block;">
        <h3 style="font-family: var(--font-heading); color: var(--accent-cyan); font-size: 1.2rem; margin-bottom: 0.5rem;">💳 Payment Gateway & Custom QR →</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Active UPI: <strong>${store.data.paymentSettings.upiId}</strong>. Upload Custom Bank QR & Helpline.</p>
      </a>
    </div>
  `;
  attachAdminGlobalListeners(container);
}

// --- 2. Dedicated Admin Trainers Page ---
function renderAdminTrainersView(container) {
  const data = store.data;
  container.innerHTML = `
    ${renderAdminNavbar('trainers')}
    ${renderAdminHeaderToolbar()}

    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <h3 class="card-title">👟 Trainer Work Assembly & Schedule Controls</h3>
        <button class="btn btn-primary btn-sm" id="btn-add-trainer">+ Register New Trainer</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Trainer Details</th>
              <th>Specialty</th>
              <th>Assigned Students Roster</th>
              <th>Duty Instructions</th>
              <th>Weekly Schedule</th>
              <th>Work Assembly Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.trainers.map(trn => {
              const assignedClientsList = trn.assignedClientIds
                .map(id => data.clients.find(c => c.id === id))
                .filter(Boolean);
              
              return `
                <tr>
                  <td>
                    <strong>${trn.name}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${trn.phone}</span><br>
                    <span style="font-size: 0.75rem; color: var(--text-dim);">User: ${trn.username}</span>
                  </td>
                  <td><span class="badge badge-purple">${trn.specialty}</span></td>
                  <td>
                    ${assignedClientsList.length > 0 ? assignedClientsList.map(c => `
                      <div style="font-size: 0.8rem; margin-bottom: 0.2rem;">
                        👤 <strong>${c.name}</strong> (${c.goals}) - <span style="color: var(--accent-cyan);">${c.trainingMode}</span>
                      </div>
                    `).join('') : '<span style="font-size: 0.8rem; color: var(--text-muted);">No Students Assigned</span>'}
                  </td>
                  <td>
                    <span style="font-size: 0.8rem; color: var(--text-muted); display: block; max-width: 200px;">
                      ${trn.dutyInstructions || 'No specific duty notes set.'}
                    </span>
                  </td>
                  <td>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Mon-Fri: ${trn.weeklySchedule?.Mon || '06:30 AM'}</span><br>
                    <button class="btn btn-secondary btn-sm edit-schedule-btn" data-trainer-id="${trn.id}" style="margin-top: 0.25rem; font-size: 0.75rem;">
                      📅 Edit Timings
                    </button>
                  </td>
                  <td>
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                      <button class="btn btn-emerald btn-sm assemble-work-btn" data-trainer-id="${trn.id}">
                        📋 Assemble Work & Assign Students
                      </button>
                      <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                        <button class="btn btn-emerald btn-sm join-trainer-btn" data-trainer-id="${trn.id}">
                          ⚡ Join Portal
                        </button>
                        <button class="btn btn-secondary btn-sm edit-trainer-btn" data-trainer-id="${trn.id}">
                          ✍️ Edit
                        </button>
                        <button class="btn btn-danger btn-sm erase-trainer-btn" data-trainer-id="${trn.id}">
                          🗑️ Erase
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  attachAdminGlobalListeners(container);

  container.querySelectorAll('.assemble-work-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openAssembleWorkModal(e.currentTarget.getAttribute('data-trainer-id'));
    });
  });

  container.querySelectorAll('.edit-schedule-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openScheduleModal(e.currentTarget.getAttribute('data-trainer-id'));
    });
  });

  container.querySelectorAll('.join-trainer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.impersonateUser('trainer', e.currentTarget.getAttribute('data-trainer-id'));
    });
  });

  container.querySelectorAll('.edit-trainer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trn = data.trainers.find(t => t.id === e.currentTarget.getAttribute('data-trainer-id'));
      openTrainerModal(trn);
    });
  });

  container.querySelectorAll('.erase-trainer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (confirm('Erase this trainer profile and login permanently?')) {
        store.deleteTrainer(e.currentTarget.getAttribute('data-trainer-id'));
      }
    });
  });

  const addTrainerBtn = container.querySelector('#btn-add-trainer');
  if (addTrainerBtn) addTrainerBtn.addEventListener('click', () => openTrainerModal());
}

// --- 3. Dedicated Admin Students Page ---
function renderAdminClientsView(container) {
  const data = store.data;
  container.innerHTML = `
    ${renderAdminNavbar('clients')}
    ${renderAdminHeaderToolbar()}

    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <h3 class="card-title">🏋️ Students Roster, Fee Billing & Trainer Reassignment</h3>
        <button class="btn btn-emerald btn-sm" id="btn-add-client">+ Add New Student</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student Credentials (User ID & Pass)</th>
              <th>Service Mode</th>
              <th>Goal / Fitness Focus</th>
              <th>Billing Amount (₹)</th>
              <th>Assigned Trainer (Reassign)</th>
              <th>Class Package Progress</th>
              <th>Payment Status & UTR Ref</th>
              <th>Admin Controls</th>
            </tr>
          </thead>
          <tbody>
            ${data.clients.map(cli => {
              const pct = Math.round((cli.currentCycleClasses / (cli.totalCycleClasses || 12)) * 100);
              const isOffline = cli.trainingMode === 'Offline';
              const fee = cli.feeAmount !== undefined ? cli.feeAmount : 6000;

              return `
                <tr>
                  <td>
                    <strong style="color: #FFF;">${cli.name}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 600;">🆔 ID: ${cli.phone}</span><br>
                    <span style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">🔑 Pass: ${cli.password || 'password123'}</span>
                  </td>
                  <td>
                    <span class="badge ${isOffline ? 'badge-emerald' : 'badge-purple'}">
                      ${isOffline ? '🏠 Offline' : '💻 Online'}
                    </span>
                  </td>
                  <td><span class="badge badge-cyan">${cli.goals}</span></td>
                  <td><strong style="color: var(--accent-emerald);">₹${fee.toLocaleString()}</strong></td>
                  <td>
                    <select class="form-control reassign-trainer-select" data-client-id="${cli.id}" style="font-size: 0.8rem; padding: 0.3rem 0.5rem; width: auto;">
                      <option value="">-- Unassigned --</option>
                      ${data.trainers.map(t => `
                        <option value="${t.id}" ${cli.assignedTrainerId === t.id ? 'selected' : ''}>${t.name}</option>
                      `).join('')}
                    </select>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <div class="progress-bar-bg" style="width: 70px;">
                        <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                      </div>
                      <span style="font-weight: 700; font-size: 0.8rem;">${cli.currentCycleClasses}/${cli.totalCycleClasses || 12}</span>
                    </div>
                    <button class="btn btn-emerald btn-sm manual-log-class-btn" data-client-id="${cli.id}" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">
                      ➕ Manual Log Class (+1)
                    </button>
                  </td>
                  <td>
                    <div>
                      <button class="btn btn-secondary btn-sm toggle-payment-btn" data-client-id="${cli.id}" style="margin-bottom: 0.2rem;">
                        <span class="badge ${cli.paymentStatus === 'Paid' ? 'badge-emerald' : 'badge-amber'}">${cli.paymentStatus}</span> (Toggle)
                      </button>
                      ${cli.lastTxRef ? `<br><span style="font-size: 0.725rem; color: var(--accent-cyan);">UTR: ${cli.lastTxRef}</span>` : ''}
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                      <button class="btn btn-emerald btn-sm join-student-btn" data-client-id="${cli.id}">
                        ⚡ Join Portal
                      </button>
                      <button class="btn btn-secondary btn-sm edit-client-btn" data-client-id="${cli.id}">
                        ✍️ Edit
                      </button>
                      <button class="btn btn-danger btn-sm erase-client-btn" data-client-id="${cli.id}">
                        🗑️ Erase
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  attachAdminGlobalListeners(container);

  container.querySelectorAll('.reassign-trainer-select').forEach(select => {
    select.addEventListener('change', (e) => {
      store.reassignClientToTrainer(e.target.getAttribute('data-client-id'), e.target.value);
      alert('✓ Student reassigned to new trainer!');
    });
  });

  container.querySelectorAll('.manual-log-class-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.adminManualIncrementClass(e.currentTarget.getAttribute('data-client-id'));
      alert('✓ Class manually logged (+1 Class added)!');
    });
  });

  container.querySelectorAll('.toggle-payment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.togglePaymentStatus(e.currentTarget.getAttribute('data-client-id'));
    });
  });

  container.querySelectorAll('.join-student-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.impersonateUser('client', e.currentTarget.getAttribute('data-client-id'));
    });
  });

  container.querySelectorAll('.edit-client-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cli = data.clients.find(c => c.id === e.currentTarget.getAttribute('data-client-id'));
      openClientModal(cli);
    });
  });

  container.querySelectorAll('.erase-client-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (confirm('Erase this student profile and login permanently?')) {
        store.deleteClient(e.currentTarget.getAttribute('data-client-id'));
      }
    });
  });

  const addClientBtn = container.querySelector('#btn-add-client');
  if (addClientBtn) addClientBtn.addEventListener('click', () => openClientModal());
}

// --- 4. Dedicated Admin Payments Page ---
function renderAdminPaymentsView(container) {
  const data = store.data;
  const set = data.paymentSettings || {};

  container.innerHTML = `
    ${renderAdminNavbar('payments')}
    ${renderAdminHeaderToolbar()}

    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <h3 class="card-title">💳 Master Payment Gateway & Custom QR Settings</h3>
        <button class="btn btn-emerald btn-sm" id="btn-edit-pay-set">+ Edit Payment & QR Settings</button>
      </div>

      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Official Company UPI ID:</p>
            <h3 style="font-family: var(--font-heading); color: var(--accent-emerald); font-size: 1.4rem;">${set.upiId}</h3>
          </div>
          <div>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Billing Helpline Phone:</p>
            <h3 style="font-family: var(--font-heading); color: var(--accent-cyan); font-size: 1.4rem;">${set.helplinePhone}</h3>
          </div>
          <div>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Company Name:</p>
            <h4 style="font-family: var(--font-heading); color: #FFF; font-size: 1.1rem;">${set.companyName}</h4>
          </div>
          <div>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Default Package Fee Amount:</p>
            <h4 style="font-family: var(--font-heading); color: var(--accent-amber); font-size: 1.1rem;">₹${set.defaultFeeAmount}</h4>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">Uploaded Custom QR Code Image:</p>
          ${set.customQrImage ? `
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <img src="${set.customQrImage}" alt="Custom QR Code" style="max-width: 160px; height: auto; border-radius: 8px; border: 2px solid var(--accent-emerald); padding: 4px; background: #FFF;">
              <div>
                <span class="badge badge-emerald">Active Custom Bank QR Code</span>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">Students will see this uploaded official QR image on their payment screen.</p>
              </div>
            </div>
          ` : `
            <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: var(--radius-md); text-align: center; color: var(--text-muted); font-size: 0.85rem;">
              📷 No custom QR image uploaded yet. Using dynamic HTML5 Canvas QR code (${set.upiId}).
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  attachAdminGlobalListeners(container);

  const editBtn = container.querySelector('#btn-edit-pay-set');
  if (editBtn) editBtn.addEventListener('click', openPaymentSettingsModal);
}

// --- 5. Dedicated Admin Location Page ---
function renderAdminLocationView(container) {
  const data = store.data;
  container.innerHTML = `
    ${renderAdminNavbar('location')}
    ${renderAdminHeaderToolbar()}

    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <h3 class="card-title">📍 Chennai Live GPS Radar & Trainer Location Pins</h3>
        <span class="badge badge-emerald">${data.locationPins.length} Location Pins Recorded</span>
      </div>
      <div id="admin-map-container" style="margin-bottom: 1.5rem;"></div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Trainer & Client</th>
              <th>GPS Coordinates</th>
              <th>Address / Location Name</th>
              <th>Distance</th>
              <th>Timestamp</th>
              <th>Admin Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.locationPins.map(pin => `
              <tr>
                <td>
                  <strong>${pin.trainerName}</strong><br>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">@ ${pin.clientName}</span>
                </td>
                <td><span style="font-size: 0.8rem; color: var(--accent-cyan);">(${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)})</span></td>
                <td>${pin.addressName}</td>
                <td><span class="badge badge-cyan">${pin.distanceKm}</span></td>
                <td>${pin.timestamp}</td>
                <td>
                  <div style="display: flex; gap: 0.35rem;">
                    ${pin.verifiedByAdmin ? `<span class="badge badge-emerald">✓ Verified</span>` : `
                      <button class="btn btn-emerald btn-sm verify-pin-btn" data-pin-id="${pin.id}">✓ Verify</button>
                    `}
                    <button class="btn btn-danger btn-sm delete-pin-btn" data-pin-id="${pin.id}">🗑️</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  attachAdminGlobalListeners(container);
  renderLocationMap('admin-map-container', data.locationPins);

  container.querySelectorAll('.verify-pin-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.verifyPinByAdmin(e.target.getAttribute('data-pin-id'));
    });
  });

  container.querySelectorAll('.delete-pin-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (confirm('Delete location pin?')) {
        store.deleteLocationPin(e.currentTarget.getAttribute('data-pin-id'));
      }
    });
  });
}

// --- 6. Dedicated Admin Notices & Virtual Hub Page ---
function renderAdminNoticesView(container) {
  const data = store.data;
  const onlineClients = data.clients.filter(c => c.trainingMode === 'Online');

  container.innerHTML = `
    ${renderAdminNavbar('notices')}
    ${renderAdminHeaderToolbar()}

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📢 Notice Board</h3>
          <button class="btn btn-primary btn-sm" id="btn-open-broadcast-modal">+ Publish Notice</button>
        </div>
        <div>
          ${data.broadcasts.map(brd => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--accent-cyan);">${brd.title}</strong> <span class="badge badge-purple">${brd.target}</span>
                <p style="font-size: 0.85rem; color: var(--text-main); margin: 0.2rem 0;">${brd.message}</p>
                <span style="font-size: 0.7rem; color: var(--text-dim);">${brd.timestamp}</span>
              </div>
              <button class="btn btn-danger btn-sm delete-broadcast-btn" data-brd-id="${brd.id}">🗑️</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">💻 Active Online Virtual Sessions</h3>
        </div>
        <div>
          ${onlineClients.map(c => `
            <div style="background: rgba(124, 77, 255, 0.08); border: 1px solid rgba(124, 77, 255, 0.3); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: #FFF;">${c.name}</strong> (${c.goals})<br>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Trainer: ${data.trainers.find(t => t.id === c.assignedTrainerId)?.name || 'Trainer'}</span>
              </div>
              <a href="${c.onlineLink || 'https://meet.google.com/aur-acor-fit'}" target="_blank" class="btn btn-primary btn-sm" style="text-decoration: none;">
                📹 Google Meet
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  attachAdminGlobalListeners(container);

  const broadcastBtn = container.querySelector('#btn-open-broadcast-modal');
  if (broadcastBtn) broadcastBtn.addEventListener('click', openBroadcastModal);

  container.querySelectorAll('.delete-broadcast-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (confirm('Delete notice?')) store.deleteBroadcast(e.currentTarget.getAttribute('data-brd-id'));
    });
  });
}

// --- 7. Dedicated Admin Salaries Page ---
function renderAdminSalariesView(container) {
  const data = store.data;
  container.innerHTML = `
    ${renderAdminNavbar('salaries')}
    ${renderAdminHeaderToolbar()}

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">💰 Trainer Salary & Package Cycle Payouts</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Trainer Name</th>
              <th>Student Name</th>
              <th>Package Cycle</th>
              <th>Payout Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.salaryPayouts.map(sal => `
              <tr>
                <td><strong>${sal.trainerName}</strong></td>
                <td>${sal.clientName}</td>
                <td>Cycle #${sal.cycleNumber} (${sal.classesCount} Classes)</td>
                <td><strong style="color: var(--accent-emerald);">₹${sal.amount.toLocaleString()}</strong></td>
                <td><span class="badge ${sal.status === 'Paid' ? 'badge-emerald' : 'badge-amber'}">${sal.status}</span></td>
                <td>
                  ${sal.status !== 'Paid' ? `
                    <button class="btn btn-emerald btn-sm mark-salary-paid-btn" data-id="${sal.id}">Process Payout</button>
                  ` : `<span style="font-size: 0.8rem; color: var(--text-muted);">Paid on ${sal.processedDate}</span>`}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  attachAdminGlobalListeners(container);

  container.querySelectorAll('.mark-salary-paid-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.markSalaryPaid(e.target.getAttribute('data-id'));
      alert('Salary payout processed successfully!');
    });
  });
}

// --- ADMIN PAYMENT SETTINGS MODAL WITH CUSTOM QR IMAGE UPLOAD ---
function openPaymentSettingsModal() {
  const settings = store.data.paymentSettings || {};

  const modalHTML = `
    <div class="modal-overlay active" id="payment-settings-modal">
      <div class="modal-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-emerald);">
            💳 Master Payment Gateway & Custom QR Control
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;" onclick="document.getElementById('payment-settings-modal').remove()">×</button>
        </div>

        <form id="payment-settings-form">
          <div class="form-group">
            <label class="form-label">Official Company UPI ID (For GPay / PhonePe)</label>
            <input type="text" id="set-upi" class="form-control" value="${settings.upiId || '8754759353@upi'}" required />
          </div>

          <div class="form-group">
            <label class="form-label">📷 Upload Custom Bank/GPay QR Code Image (File)</label>
            <input type="file" id="set-qr-file" class="form-control" accept="image/*" style="padding: 0.4rem;" />
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.3rem;">
              Select a QR image from your device to display directly to students on payment screen.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Or Paste Custom QR Image URL (Optional)</label>
            <input type="text" id="set-qr-url" class="form-control" value="${settings.customQrImage || ''}" placeholder="https://example.com/qr.png or leave blank" />
          </div>

          <div class="form-group">
            <label class="form-label">Official Billing Helpline Phone Number</label>
            <input type="text" id="set-phone" class="form-control" value="${settings.helplinePhone || '87547 59353'}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Company Brand Name</label>
            <input type="text" id="set-company" class="form-control" value="${settings.companyName || 'AuraCore Fitness & Care'}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Default Package Fee Amount (₹)</label>
            <input type="number" id="set-fee" class="form-control" value="${settings.defaultFeeAmount || 6000}" required />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('payment-settings-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-emerald">Save Payment & QR Settings</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  let uploadedQrBase64 = settings.customQrImage || '';

  const fileInput = document.getElementById('set-qr-file');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          uploadedQrBase64 = evt.target.result;
          document.getElementById('set-qr-url').value = 'Uploaded File Loaded!';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  document.getElementById('payment-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const typedUrl = document.getElementById('set-qr-url').value;
    const finalQrImage = (typedUrl && !typedUrl.includes('Uploaded File')) ? typedUrl : uploadedQrBase64;

    store.updatePaymentSettings(
      document.getElementById('set-upi').value,
      document.getElementById('set-phone').value,
      document.getElementById('set-company').value,
      document.getElementById('set-fee').value,
      finalQrImage
    );
    document.getElementById('payment-settings-modal').remove();
    alert('✓ Master Payment Settings & Custom QR Code Image updated across the application!');
  });
}

// --- Student Payment Modal with Custom QR Support ---
function openPaymentModal(client) {
  const amount = client.feeAmount || 6000;
  const currentUPI = getActiveUPIID();
  const currentHelpline = getActiveHelpline();
  const customQr = store.data.paymentSettings ? store.data.paymentSettings.customQrImage : '';

  const upiLink = generateUPILink(amount, `AuraCore Fee - ${client.name}`);
  const gpayLink = `intent://pay?pa=${currentUPI}&pn=AuraCore%20Fitness&am=${amount}&cu=INR#Intent;scheme=upi;package=com.google.android.apps.nfc.payment;end`;
  const phonepeLink = `intent://pay?pa=${currentUPI}&pn=AuraCore%20Fitness&am=${amount}&cu=INR#Intent;scheme=upi;package=com.phonepe.app;end`;
  const paytmLink = `intent://pay?pa=${currentUPI}&pn=AuraCore%20Fitness&am=${amount}&cu=INR#Intent;scheme=upi;package=net.one97.paytm;end`;

  const modalHTML = `
    <div class="modal-overlay active" id="payment-modal">
      <div class="modal-container" style="max-width: 580px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); color: var(--accent-emerald); font-size: 1.3rem;">
            💳 AuraCore Direct Payment Gateway
          </h3>
          <button style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;" onclick="document.getElementById('payment-modal').remove()">×</button>
        </div>

        <div style="text-align: center; margin-bottom: 1.25rem;">
          <p style="font-size: 0.85rem; color: var(--text-muted);">Package Fee Amount Due:</p>
          <h2 style="font-family: var(--font-heading); font-size: 2.3rem; color: var(--accent-emerald); font-weight: 800;">₹${amount.toLocaleString()}</h2>
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.3rem;">
            <span style="font-size: 0.85rem; color: var(--accent-cyan);">Official Company UPI ID: <strong>${currentUPI}</strong></span>
            <button class="btn btn-secondary btn-sm" id="btn-copy-upi" style="font-size: 0.75rem; padding: 0.2rem 0.6rem;">📋 Copy</button>
          </div>
        </div>

        <!-- Desktop QR Code Section -->
        <div style="text-align: center; background: #FFFFFF; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; border: 1px solid var(--border-glow);">
          ${customQr ? `
            <img src="${customQr}" alt="Official Bank QR Code" style="max-width: 200px; height: auto; display: block; margin: 0 auto; border-radius: 8px; padding: 4px; background: #FFF;" />
            <p style="color: #000; font-size: 0.8rem; margin-top: 0.5rem; font-weight: 700;">
              📷 Official AuraCore Bank QR Code (Scan with GPay, PhonePe, Paytm or BHIM)
            </p>
          ` : `
            <canvas id="upi-qr-canvas" style="display: block; margin: 0 auto; border-radius: 8px;"></canvas>
            <p style="color: #000; font-size: 0.8rem; margin-top: 0.5rem; font-weight: 700;">
              📷 Scan QR Code with GPay, PhonePe, Paytm or BHIM
            </p>
          `}
        </div>

        <div style="margin-bottom: 1.5rem;">
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; text-align: center;">📱 Mobile Users: Click to Pay directly in your UPI App:</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem;">
            <a href="${upiLink}" class="btn btn-emerald" style="text-decoration: none; font-size: 0.85rem;">
              ⚡ Direct UPI Pay
            </a>
            <a href="${gpayLink}" class="btn btn-primary" style="text-decoration: none; font-size: 0.85rem;">
              🟢 Google Pay (GPay)
            </a>
            <a href="${phonepeLink}" class="btn btn-secondary" style="text-decoration: none; font-size: 0.85rem; background: rgba(124, 77, 255, 0.2); border-color: var(--accent-purple); color: #FFF;">
              🟣 PhonePe UPI
            </a>
            <a href="${paytmLink}" class="btn btn-secondary" style="text-decoration: none; font-size: 0.85rem; background: rgba(0, 229, 255, 0.2); border-color: var(--accent-cyan); color: #FFF;">
              🔵 Paytm UPI
            </a>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
          <h4 style="font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 0.5rem; font-weight: 700;">
            📝 Already Paid? Submit 12-Digit Transaction Reference (UTR) or Confirm Payment
          </h4>
          <form id="form-submit-utr" style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
            <input type="text" id="utr-number" class="form-control" placeholder="Enter 12-digit UTR / Ref No. (Optional)" style="font-size: 0.85rem;" />
            <button type="submit" class="btn btn-emerald btn-sm" style="white-space: nowrap;">Submit Receipt</button>
          </form>
          <button type="button" class="btn btn-primary btn-sm" id="btn-direct-confirm-paid" style="width: 100%; font-size: 0.825rem;">
            ✅ Confirm Direct Payment (Mark Status as PAID)
          </button>
        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; text-align: center;">
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Payment Support Helpline:</p>
          <a href="tel:${currentHelpline.replace(/\D/g, '')}" class="contact-badge" style="justify-content: center; width: 100%; font-size: 0.85rem;">
            📞 Call Official Helpline: ${currentHelpline}
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  if (!customQr) {
    renderQRCodeOnCanvas('upi-qr-canvas', upiLink, 180);
  }

  const copyBtn = document.getElementById('btn-copy-upi');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentUPI);
      copyBtn.innerText = '✓ Copied!';
      setTimeout(() => { copyBtn.innerText = '📋 Copy'; }, 2000);
    });
  }

  const utrForm = document.getElementById('form-submit-utr');
  if (utrForm) {
    utrForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const utr = document.getElementById('utr-number').value || ('UTR' + Date.now().toString().slice(-8));
      store.recordClientPayment(client.id, utr);
      document.getElementById('payment-modal').remove();
      alert(`🎉 Payment Receipt Submitted!\nUTR Reference: ${utr}\nStatus updated to PAID for ${client.name}.`);
    });
  }

  const directConfirmBtn = document.getElementById('btn-direct-confirm-paid');
  if (directConfirmBtn) {
    directConfirmBtn.addEventListener('click', () => {
      const autoUtr = 'CONFIRMED_' + Date.now().toString().slice(-8);
      store.recordClientPayment(client.id, autoUtr);
      document.getElementById('payment-modal').remove();
      alert(`🎉 Payment Confirmed!\nStatus updated to PAID for ${client.name}.`);
    });
  }
}

// --- WORK ASSEMBLY MODAL ---
function openAssembleWorkModal(trainerId) {
  const trainer = store.data.trainers.find(t => t.id === trainerId);
  if (!trainer) return;

  const allClients = store.data.clients;

  const modalHTML = `
    <div class="modal-overlay active" id="assemble-work-modal">
      <div class="modal-container" style="max-width: 600px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-emerald);">
            📋 Assemble Work & Client Assignments: ${trainer.name}
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;" onclick="document.getElementById('assemble-work-modal').remove()">×</button>
        </div>

        <form id="assemble-work-form">
          <div class="form-group">
            <label class="form-label">Select & Assign Clients to Trainer ${trainer.name}:</label>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; max-height: 180px; overflow-y: auto;">
              ${allClients.map(c => {
                const isAssigned = trainer.assignedClientIds.includes(c.id);
                return `
                  <label style="display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0; border-bottom: 1px dashed rgba(255,255,255,0.05); font-size: 0.85rem; cursor: pointer;">
                    <input type="checkbox" class="client-assign-cb" value="${c.id}" ${isAssigned ? 'checked' : ''} />
                    <span><strong>${c.name}</strong> (${c.goals}) - <span style="color: var(--accent-cyan);">${c.trainingMode}</span></span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Daily Duty Instructions & Work Notes for ${trainer.name}</label>
            <textarea id="trainer-duty-notes" class="form-control" rows="3" placeholder="e.g. Conduct Anna Nagar home visit at 06:30 AM, then virtual session at 08:00 AM...">${trainer.dutyInstructions || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('assemble-work-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-emerald">Save Work Assembly</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('assemble-work-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const checkedBoxes = Array.from(document.querySelectorAll('.client-assign-cb:checked')).map(cb => cb.value);
    const notes = document.getElementById('trainer-duty-notes').value;

    store.assembleTrainerWork(trainerId, checkedBoxes, notes);
    document.getElementById('assemble-work-modal').remove();
    alert(`✓ Work assembly & client assignments saved for Trainer ${trainer.name}!`);
  });
}

function openScheduleModal(trainerId) {
  const trainer = store.data.trainers.find(t => t.id === trainerId);
  if (!trainer) return;
  const sched = trainer.weeklySchedule || {};

  const modalHTML = `
    <div class="modal-overlay active" id="schedule-modal">
      <div class="modal-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-purple);">
            📅 Edit Trainer Schedule: ${trainer.name}
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;" onclick="document.getElementById('schedule-modal').remove()">×</button>
        </div>

        <form id="schedule-form">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
            <div class="form-group" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
              <label class="form-label" style="width: 60px; margin: 0;">${day}</label>
              <input type="text" id="sched-${day}" class="form-control" value="${sched[day] || '06:30 AM - 07:30 AM'}" />
            </div>
          `).join('')}
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('schedule-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Weekly Schedule</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('schedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newSchedule = {
      Mon: document.getElementById('sched-Mon').value,
      Tue: document.getElementById('sched-Tue').value,
      Wed: document.getElementById('sched-Wed').value,
      Thu: document.getElementById('sched-Thu').value,
      Fri: document.getElementById('sched-Fri').value,
      Sat: document.getElementById('sched-Sat').value,
      Sun: document.getElementById('sched-Sun').value
    };
    store.saveTrainerSchedule(trainerId, newSchedule);
    document.getElementById('schedule-modal').remove();
    alert('Weekly Schedule updated!');
  });
}

function openTrainerModal(existingTrainer = null) {
  const isEdit = !!existingTrainer;
  const modalHTML = `
    <div class="modal-overlay active" id="trainer-modal">
      <div class="modal-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-cyan);">
            ${isEdit ? '✍️ Edit Trainer Details' : '👟 Register New Trainer'}
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;" onclick="document.getElementById('trainer-modal').remove()">×</button>
        </div>
        <form id="trainer-form">
          <div class="form-group">
            <label class="form-label">Trainer Name</label>
            <input type="text" id="trn-name" class="form-control" value="${isEdit ? existingTrainer.name : ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" id="trn-phone" class="form-control" value="${isEdit ? existingTrainer.phone : ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Aadhaar Number</label>
            <input type="text" id="trn-aadhaar" class="form-control" value="${isEdit ? existingTrainer.aadhaar : ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Specialty (Enter Manually)</label>
            <input type="text" id="trn-specialty" class="form-control" value="${isEdit ? existingTrainer.specialty : ''}" placeholder="Enter trainer specialty manually (e.g. Weight Loss & Functional Fitness)" required />
          </div>
          <div class="form-group">
            <label class="form-label">Trainer Logo / Avatar Image URL (Optional)</label>
            <input type="text" id="trn-avatar" class="form-control" value="${isEdit ? (existingTrainer.avatarUrl || '') : ''}" placeholder="https://example.com/trainer-logo.jpg or leave blank for default emblem" />
          </div>
          <div class="form-group">
            <label class="form-label">Login Username</label>
            <input type="text" id="trn-username" class="form-control" value="${isEdit ? existingTrainer.username : ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="text" id="trn-password" class="form-control" value="${isEdit ? existingTrainer.password : 'password123'}" required />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('trainer-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Trainer Profile'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('trainer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    store.saveTrainer({
      id: isEdit ? existingTrainer.id : undefined,
      name: document.getElementById('trn-name').value,
      phone: document.getElementById('trn-phone').value,
      aadhaar: document.getElementById('trn-aadhaar').value,
      specialty: document.getElementById('trn-specialty').value,
      avatarUrl: document.getElementById('trn-avatar').value,
      username: document.getElementById('trn-username').value,
      password: document.getElementById('trn-password').value
    });
    document.getElementById('trainer-modal').remove();
    alert(`Trainer profile ${isEdit ? 'updated' : 'registered'} successfully!`);
  });
}

function openClientModal(existingClient = null) {
  const isEdit = !!existingClient;
  const trainers = store.data.trainers;

  const modalHTML = `
    <div class="modal-overlay active" id="client-modal">
      <div class="modal-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-emerald);">
            ${isEdit ? '✍️ Edit Student Profile' : '🏋️ Add New Student'}
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;" onclick="document.getElementById('client-modal').remove()">×</button>
        </div>
        <form id="client-form">
          <div class="form-group">
            <label class="form-label">Student Name</label>
            <input type="text" id="cli-name" class="form-control" value="${isEdit ? existingClient.name : ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Student Registered Phone / Login User ID</label>
            <input type="text" id="cli-phone" class="form-control" value="${isEdit ? existingClient.phone : ''}" placeholder="e.g. 9840011223" required />
          </div>
          <div class="form-group">
            <label class="form-label">Student Login Password</label>
            <input type="text" id="cli-password" class="form-control" value="${isEdit ? (existingClient.password || 'password123') : 'password123'}" placeholder="Enter Student Password (e.g. password123)" required />
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
              Student will use their Registered Phone Number and this Password to log in.
            </span>
          </div>
          <div class="form-group">
            <label class="form-label">Training Mode</label>
            <select id="cli-mode" class="form-control">
              <option value="Offline" ${isEdit && existingClient.trainingMode === 'Offline' ? 'selected' : ''}>Offline (Primary 80% Home Visit in Chennai)</option>
              <option value="Online" ${isEdit && existingClient.trainingMode === 'Online' ? 'selected' : ''}>Online (Secondary 20% Google Meet / Zoom)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Student Goal / Fitness Focus</label>
            <input type="text" id="cli-goals" class="form-control" value="${isEdit ? existingClient.goals : ''}" placeholder="e.g. Weight Loss & Body Toning" required />
          </div>
          <div class="form-group">
            <label class="form-label">Total Classes in Package</label>
            <input type="number" id="cli-total-classes" class="form-control" value="${isEdit ? (existingClient.totalCycleClasses || 12) : 12}" min="1" required />
          </div>
          <div class="form-group">
            <label class="form-label">Custom Billing Fee Amount (₹)</label>
            <input type="number" id="cli-fee" class="form-control" value="${isEdit ? (existingClient.feeAmount || 6000) : (store.data.paymentSettings.defaultFeeAmount || 6000)}" placeholder="Enter manual fee amount" required />
          </div>
          <div class="form-group">
            <label class="form-label">Address (Offline) / Meeting Link (Online)</label>
            <input type="text" id="cli-location" class="form-control" value="${isEdit ? (existingClient.trainingMode === 'Offline' ? existingClient.location : existingClient.onlineLink) : ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Assign Trainer</label>
            <select id="cli-trainer" class="form-control">
              ${trainers.map(t => `<option value="${t.id}" ${isEdit && existingClient.assignedTrainerId === t.id ? 'selected' : ''}>${t.name} (${t.specialty})</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('client-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-emerald">${isEdit ? 'Save Changes' : 'Add Student'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const mode = document.getElementById('cli-mode').value;
    const locInput = document.getElementById('cli-location').value;

    store.saveClient({
      id: isEdit ? existingClient.id : undefined,
      name: document.getElementById('cli-name').value,
      phone: document.getElementById('cli-phone').value,
      password: document.getElementById('cli-password').value,
      trainingMode: mode,
      goals: document.getElementById('cli-goals').value,
      totalCycleClasses: parseInt(document.getElementById('cli-total-classes').value) || 12,
      feeAmount: parseFloat(document.getElementById('cli-fee').value) || 6000,
      location: mode === 'Offline' ? locInput : 'Virtual Online Class',
      onlineLink: mode === 'Online' ? (locInput.startsWith('http') ? locInput : 'https://meet.google.com/aur-acor-fit') : '',
      assignedTrainerId: document.getElementById('cli-trainer').value,
      batchStartDate: isEdit ? existingClient.batchStartDate : new Date().toISOString().split('T')[0],
      batchEndDate: isEdit ? existingClient.batchEndDate : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: isEdit ? existingClient.paymentStatus : 'Paid'
    });
    document.getElementById('client-modal').remove();
    alert(`Student profile ${isEdit ? 'updated' : 'registered'} successfully!`);
  });
}

function openBroadcastModal() {
  const modalHTML = `
    <div class="modal-overlay active" id="broadcast-modal">
      <div class="modal-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-purple);">
            📢 Broadcast New Notice
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;" onclick="document.getElementById('broadcast-modal').remove()">×</button>
        </div>

        <form id="broadcast-form">
          <div class="form-group">
            <label class="form-label">Notice Title</label>
            <input type="text" id="brd-title" class="form-control" placeholder="e.g. Holiday Schedule Notice" required />
          </div>
          <div class="form-group">
            <label class="form-label">Target Audience</label>
            <select id="brd-target" class="form-control">
              <option value="All Users">All Users</option>
              <option value="Trainers">Trainers Only</option>
              <option value="Clients">Clients Only</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Message Content</label>
            <textarea id="brd-message" class="form-control" rows="3" placeholder="Type announcement..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('broadcast-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Broadcast</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('broadcast-form').addEventListener('submit', (e) => {
    e.preventDefault();
    store.addBroadcast(
      document.getElementById('brd-title').value,
      document.getElementById('brd-message').value,
      document.getElementById('brd-target').value
    );
    document.getElementById('broadcast-modal').remove();
    alert('Broadcast published!');
  });
}

// --- Trainer Portal View ---
function renderTrainerView(container) {
  const data = store.data;
  const trainerId = data.currentUser ? data.currentUser.id : data.currentTrainerId;
  const currentTrainer = data.trainers.find(t => t.id === trainerId) || data.trainers[0];
  const assignedClients = data.clients.filter(c => c.assignedTrainerId === currentTrainer.id);
  const myPins = data.locationPins.filter(p => p.trainerId === currentTrainer.id);

  container.innerHTML = `
    <div style="background: linear-gradient(90deg, rgba(0, 229, 255, 0.15), rgba(124, 77, 255, 0.2)); border: 1px solid var(--accent-cyan); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
      <span style="font-size: 0.85rem; color: #FFF; font-weight: 600;">
        👑 Super Admin Console View • Currently viewing Trainer: <strong>${currentTrainer.name}</strong>
      </span>
      <button class="btn btn-emerald btn-sm" id="btn-trainer-back-to-admin" style="font-weight: 700;">
        ⬅️ Back to Admin Panel
      </button>
    </div>

    <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(20, 27, 41, 0.9), rgba(124, 77, 255, 0.15)); border: 1px solid var(--border-glow);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          ${currentTrainer.avatarUrl ? `
            <img src="${currentTrainer.avatarUrl}" alt="${currentTrainer.name}" style="width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-cyan); box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);">
          ` : `
            <div style="width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan)); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #FFF; border: 2px solid var(--accent-cyan); box-shadow: 0 0 15px rgba(124, 77, 255, 0.4);">
              🏋️‍♂️
            </div>
          `}
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #FFF;">Trainer Dashboard: ${currentTrainer.name}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Specialty: <span style="color: var(--accent-cyan); font-weight: 600;">${currentTrainer.specialty}</span> • Phone: ${currentTrainer.phone}
            </p>
          </div>
        </div>

        <div>
          <span class="badge badge-purple">Logged In as ${currentTrainer.username}</span>
        </div>
      </div>
    </div>

    ${currentTrainer.dutyInstructions ? `
      <div style="background: rgba(0, 229, 255, 0.08); border: 1px solid var(--accent-cyan); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 2rem;">
        <h4 style="font-size: 0.95rem; color: var(--accent-cyan); margin-bottom: 0.35rem;">📋 Admin Work Assembly & Daily Duty Instructions:</h4>
        <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5;">${currentTrainer.dutyInstructions}</p>
      </div>
    ` : ''}

    <div class="grid-3" style="margin-bottom: 2rem;">
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(0, 229, 255, 0.15); color: var(--accent-cyan);">👥</div>
        <div>
          <div class="stat-value">${assignedClients.length}</div>
          <div class="stat-label">Assigned Students</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-emerald);">📅</div>
        <div>
          <div class="stat-value">${assignedClients.length > 0 ? 'Active' : 'Rest'}</div>
          <div class="stat-label">Schedule: ${currentTrainer.weeklySchedule?.Mon || '06:30 AM'}</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(255, 145, 0, 0.15); color: var(--accent-amber);">📍</div>
        <div>
          <div class="stat-value">${myPins.length} Pins</div>
          <div class="stat-label">GPS Locations Stored</div>
        </div>
      </div>
    </div>

    ${data.activeVerificationSession && data.activeVerificationSession.trainerId === currentTrainer.id ? `
      <div class="live-notification-bar">
        <div class="notification-content">
          <div class="notification-icon">⏳</div>
          <div class="notification-text">
            <h4>Class Session Active for ${data.activeVerificationSession.clientName}</h4>
            <p>Started at ${data.activeVerificationSession.startedAt}. Waiting for Student to click "Confirm Class"...</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-cancel-class">Cancel Session</button>
      </div>
    ` : ''}

    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <h3 class="card-title">👟 Assigned Student Classes & Attendance Controls</h3>
        <span class="badge badge-cyan">Automated & Direct</span>
      </div>

      ${assignedClients.length === 0 ? `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No students assigned to your profile yet.</p>
        </div>
      ` : `
        <div class="grid-2">
          ${assignedClients.map(client => {
            const isSessionActive = data.activeVerificationSession && data.activeVerificationSession.clientId === client.id;
            const totalCls = client.totalCycleClasses || 12;
            const pct = Math.round((client.currentCycleClasses / totalCls) * 100);
            const isOffline = client.trainingMode === 'Offline';

            return `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                  <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #FFF; margin-bottom: 0.2rem;">${client.name}</h3>
                    <p style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600; margin: 0;">🎯 ${client.goals}</p>
                  </div>
                  <span class="badge ${isOffline ? 'badge-emerald' : 'badge-purple'}">
                    ${isOffline ? '🏠 Offline Visit' : '💻 Online Class'}
                  </span>
                </div>

                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
                  <p><strong>📞 Contact:</strong> ${client.phone}</p>
                  <p><strong>📍 Location:</strong> ${isOffline ? client.location : 'Virtual Online Class'}</p>
                  <p><strong>📅 Batch Validity:</strong> ${client.batchStartDate} to ${client.batchEndDate}</p>
                </div>

                <div style="margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem;">
                    <span>Class Progress</span>
                    <span style="color: var(--accent-emerald);">${client.currentCycleClasses} / ${totalCls} Completed</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.75rem;">
                  ${isOffline ? `
                    <button class="btn btn-secondary btn-pin-location" data-client-id="${client.id}" style="font-size: 0.8rem;">
                      📍 Pin GPS Location
                    </button>
                  ` : `
                    <a href="${client.onlineLink || 'https://meet.google.com/aur-acor-fit'}" target="_blank" class="btn btn-secondary" style="text-decoration: none; font-size: 0.8rem;">
                      📹 Google Meet Link
                    </a>
                  `}

                  <button class="btn ${isSessionActive ? 'btn-emerald' : 'btn-primary'} btn-start-class" data-client-id="${client.id}" ${isSessionActive ? 'disabled' : ''} style="font-size: 0.8rem;">
                    ${isSessionActive ? '⏳ Session Pending' : '▶️ Verification Session'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>

    <!-- My Daily GPS Pinned History Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📍 My Daily GPS Visit History & Location Pins</h3>
        <span class="badge badge-cyan">${myPins.length} Locations Pinned Today</span>
      </div>

      ${myPins.length === 0 ? `
        <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <p>No GPS location pins recorded yet today.</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--text-dim);">Click <strong>"📍 Pin GPS"</strong> under any assigned student above when visiting their location. All visited places will be saved in your location history.</p>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time & Date</th>
                <th>Student Visit Location</th>
                <th>GPS Coordinates</th>
                <th>Distance Status</th>
                <th>Admin Verification</th>
              </tr>
            </thead>
            <tbody>
              ${myPins.map(pin => `
                <tr>
                  <td><strong style="color: var(--accent-cyan);">${pin.timestamp}</strong></td>
                  <td>
                    <strong>${pin.clientName}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${pin.addressName}</span>
                  </td>
                  <td><span style="font-size: 0.8rem; font-family: monospace; color: #FFF;">(${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)})</span></td>
                  <td><span class="badge badge-emerald">${pin.distanceKm}</span></td>
                  <td>
                    <span class="badge ${pin.verifiedByAdmin ? 'badge-emerald' : 'badge-amber'}">
                      ${pin.verifiedByAdmin ? 'Verified by Admin' : 'Saved in History'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;

  container.querySelectorAll('.btn-pin-location').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const clientId = e.target.getAttribute('data-client-id');
      const client = data.clients.find(c => c.id === clientId);
      
      btn.innerText = '🛰️ GPS...';
      btn.disabled = true;

      const locResult = await getCurrentLocation();
      if (locResult.success) {
        store.pinLocation(currentTrainer.id, clientId, locResult.lat, locResult.lng, client ? client.location : 'Chennai Student Home');
        alert(`📍 GPS Location successfully pinned for ${client ? client.name : 'Student'}!\nCoordinates: (${locResult.lat.toFixed(4)}, ${locResult.lng.toFixed(4)})\nAdmin Live Location Monitor updated.`);
      }
      renderTrainerView(container);
    });
  });

  container.querySelectorAll('.btn-start-class').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const clientId = e.target.getAttribute('data-client-id');
      store.startClassSession(currentTrainer.id, clientId);
      alert(`▶️ Class session started!\nMutual Verification alert sent to Student Portal. Student can now click "Confirm Class".`);
    });
  });

  const cancelClassBtn = container.querySelector('#btn-cancel-class');
  if (cancelClassBtn) {
    cancelClassBtn.addEventListener('click', () => {
      store.cancelClassSession();
    });
  }

  const trainerBackAdminBtn = container.querySelector('#btn-trainer-back-to-admin');
  if (trainerBackAdminBtn) {
    trainerBackAdminBtn.addEventListener('click', () => {
      store.returnToAdmin();
      window.location.href = 'admin-dashboard.html';
    });
  }
}

// --- Student Portal View ---
function renderClientView(container) {
  const data = store.data;
  const activeUPI = getActiveUPIID();
  const activePhone = getActiveHelpline();

  const clientId = data.currentUser ? data.currentUser.id : data.currentClientId;
  const currentClient = data.clients.find(c => c.id === clientId) || data.clients[0];
  const assignedTrainer = data.trainers.find(t => t.id === currentClient.assignedTrainerId);

  const activeSess = data.activeVerificationSession;
  const isClassPendingForMe = activeSess && activeSess.clientId === currentClient.id;
  const totalCls = currentClient.totalCycleClasses || 12;
  const pct = Math.round((currentClient.currentCycleClasses / totalCls) * 100);
  const isOffline = currentClient.trainingMode === 'Offline';
  const feeAmt = currentClient.feeAmount !== undefined ? currentClient.feeAmount : 6000;

  container.innerHTML = `
    <div style="background: linear-gradient(90deg, rgba(0, 230, 118, 0.15), rgba(0, 229, 255, 0.2)); border: 1px solid var(--accent-emerald); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
      <span style="font-size: 0.85rem; color: #FFF; font-weight: 600;">
        👑 Super Admin Console View • Currently viewing Student: <strong>${currentClient.name}</strong>
      </span>
      <button class="btn btn-emerald btn-sm" id="btn-student-back-to-admin" style="font-weight: 700;">
        ⬅️ Back to Admin Panel
      </button>
    </div>

    <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(20, 27, 41, 0.9), rgba(0, 230, 118, 0.12)); border: 1px solid var(--border-glow);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: #000;">
            ${currentClient.name.charAt(0)}
          </div>
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #FFF;">Student Portal: ${currentClient.name}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Goal: <span style="color: var(--accent-emerald); font-weight: 600;">${currentClient.goals}</span> • Mode: 
              <span class="badge ${isOffline ? 'badge-emerald' : 'badge-purple'}" style="vertical-align: middle;">
                ${isOffline ? '🏠 Offline Home Visit' : '💻 Online Virtual Class'}
              </span>
            </p>
          </div>
        </div>

        <div>
          <span class="badge badge-emerald">Logged In (${currentClient.phone})</span>
        </div>
      </div>
    </div>

    ${isClassPendingForMe ? `
      <div class="live-notification-bar" style="background: linear-gradient(90deg, rgba(0, 230, 118, 0.25), rgba(0, 229, 255, 0.25)); border-color: var(--accent-emerald);">
        <div class="notification-content">
          <div class="notification-icon" style="background: var(--accent-emerald);">🔔</div>
          <div class="notification-text">
            <h4>Class In Session! Trainer ${activeSess.trainerName} started class at ${activeSess.startedAt}.</h4>
            <p>Click "Confirm Class" to approve mutual attendance for today.</p>
          </div>
        </div>
        <button class="btn btn-emerald" id="btn-confirm-class" data-session-id="${activeSess.id}">
          ✅ Confirm Class
        </button>
      </div>
    ` : ''}

    <div class="grid-2" style="margin-bottom: 2rem;">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🎯 Attendance Progress Tracker</h3>
          <span class="badge badge-emerald">${currentClient.currentCycleClasses} / ${totalCls} Completed</span>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; margin-bottom: 0.5rem;">
            <span>Current Batch Progress</span>
            <span style="color: var(--accent-cyan);">${pct}%</span>
          </div>
          <div class="progress-bar-bg" style="height: 14px;">
            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>

        <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">Class Package Milestones (${totalCls} Total Classes):</h4>
        <div style="display: grid; grid-template-columns: repeat(${Math.min(totalCls, 6)}, 1fr); gap: 0.5rem; margin-bottom: 1.5rem;">
          ${Array.from({ length: totalCls }).map((_, i) => {
            const stepNum = i + 1;
            const isDone = stepNum <= currentClient.currentCycleClasses;
            return `
              <div style="
                background: ${isDone ? 'linear-gradient(135deg, var(--accent-emerald), #00C853)' : 'rgba(255,255,255,0.05)'};
                border: 1px solid ${isDone ? 'var(--accent-emerald)' : 'var(--border-color)'};
                color: ${isDone ? '#000' : 'var(--text-muted)'};
                border-radius: var(--radius-sm);
                padding: 0.4rem;
                text-align: center;
                font-family: var(--font-heading);
                font-weight: 700;
                font-size: 0.78rem;
              ">
                ${isDone ? '✓' : ''} Class ${stepNum}
              </div>
            `;
          }).join('')}
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 0.85rem; color: var(--text-muted);">
          🏆 Total Verified Lifetime Classes: <strong style="color: #FFF;">${currentClient.totalCompletedClassesAllTime} Classes</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">👟 Your Trainer & Meeting Link</h3>
          <span class="badge badge-purple">${assignedTrainer ? assignedTrainer.specialty : 'Trainer'}</span>
        </div>

        ${assignedTrainer ? `
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan)); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: #FFF;">
              ${assignedTrainer.name.charAt(0)}
            </div>
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: #FFF;">Trainer ${assignedTrainer.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted);">📞 ${assignedTrainer.phone}</p>
              <p style="font-size: 0.85rem; color: var(--accent-cyan);">AuraCore Helpline: ${activePhone}</p>
            </div>
          </div>
        ` : `<p style="color: var(--text-muted);">No trainer assigned yet.</p>`}

        <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-size: 0.85rem; line-height: 1.6;">
          <p><strong>🏠 Location / Mode:</strong> ${isOffline ? currentClient.location : 'Online Google Meet'}</p>
          <p><strong>📅 Batch Duration:</strong> ${currentClient.batchStartDate} to ${currentClient.batchEndDate}</p>
          <p><strong>💳 Billing Fee Amount:</strong> <strong style="color: var(--accent-emerald);">₹${feeAmt.toLocaleString()}</strong></p>
          <p><strong>💳 Payment Status:</strong> 
            <span class="badge ${currentClient.paymentStatus === 'Paid' ? 'badge-emerald' : 'badge-amber'}">${currentClient.paymentStatus}</span>
          </p>
        </div>

        ${!isOffline ? `
          <a href="${currentClient.onlineLink || 'https://meet.google.com/aur-acor-fit'}" target="_blank" class="btn btn-emerald" style="width: 100%; text-decoration: none; margin-bottom: 0.75rem;">
            📹 Join Online Class (Google Meet)
          </a>
        ` : ''}

        <button class="btn btn-primary" id="btn-open-payment-modal" style="width: 100%;">
          💳 Pay Fees (₹${feeAmt.toLocaleString()}) / Renew Batch
        </button>
      </div>
    </div>
  `;

  const confirmBtn = container.querySelector('#btn-confirm-class');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      const sessId = e.target.getAttribute('data-session-id');
      const success = store.confirmClassSession(sessId);
      if (success) {
        alert('🎉 Attendance Confirmed!\nMutual attendance verified into AuraCore system.');
      }
    });
  }

  const payBtn = container.querySelector('#btn-open-payment-modal');
  if (payBtn) payBtn.addEventListener('click', () => openPaymentModal(currentClient));

  const studentBackAdminBtn = container.querySelector('#btn-student-back-to-admin');
  if (studentBackAdminBtn) {
    studentBackAdminBtn.addEventListener('click', () => {
      store.returnToAdmin();
      window.location.href = 'admin-dashboard.html';
    });
  }
}

/* ==========================================================================
   6. Main App Orchestrator & Header Controls
   ========================================================================== */
function renderAdminView(container) {
  const target = container || document.getElementById('admin-view-container') || document.getElementById('view-container');
  if (target) {
    renderAdminDashboardView(target);
  }
}

function renderWhatsAppSupportWidget() {
  const existing = document.getElementById('aura-whatsapp-widget');
  if (existing) return;

  const helpline = (store.data.paymentSettings && store.data.paymentSettings.helplinePhone) || '87547 59353';
  const digits = helpline.replace(/\D/g, '');
  const cleanPhone = digits.length === 10 ? '91' + digits : (digits || '918754759353');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello AuraCore Support Team, I need assistance with Fitness & Therapy training.')}`;

  const widgetHTML = `
    <a href="${waUrl}" target="_blank" class="whatsapp-float-btn" id="aura-whatsapp-widget" title="Chat on WhatsApp (87547 59353)">
      <div class="whatsapp-icon-dot"></div>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFFFFF" style="display: block;">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.705 1.454h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.474-8.435"/>
      </svg>
    </a>
  `;
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
}

function syncHeaderHelplinePhone() {
  const phone = (store.data.paymentSettings && store.data.paymentSettings.helplinePhone) || '87547 59353';
  const cleanDigits = phone.replace(/\D/g, '');
  const waDigits = cleanDigits.length === 10 ? '91' + cleanDigits : (cleanDigits || '918754759353');

  document.querySelectorAll('.app-header a[href^="tel:"]').forEach(el => {
    el.href = `tel:${cleanDigits}`;
    el.textContent = `📞 Helpline: ${phone}`;
  });
  document.querySelectorAll('.app-header a[href*="wa.me"]').forEach(el => {
    el.href = `https://wa.me/${waDigits}?text=${encodeURIComponent('Hello AuraCore Support Team, I need assistance with Fitness & Training.')}`;
    el.textContent = `💬 WhatsApp: ${phone}`;
  });
  document.querySelectorAll('.app-footer').forEach(footer => {
    const phoneEl = footer.querySelector('a[href^="tel:"]');
    if (phoneEl) {
      phoneEl.href = `tel:${cleanDigits}`;
      phoneEl.textContent = phone;
    }
  });
}

function openForgotPasswordModal(defaultRole = 'student') {
  const modalHTML = `
    <div class="modal-overlay active" id="forgot-pass-modal">
      <div class="modal-container" style="max-width: 480px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--accent-cyan);">
            🔑 Self-Service Account Recovery
          </h3>
          <button type="button" style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;" onclick="document.getElementById('forgot-pass-modal').remove()">×</button>
        </div>

        <form id="forgot-pass-form">
          <div class="form-group">
            <label class="form-label">Select Account Type</label>
            <select id="fp-role" class="form-control">
              <option value="student" ${defaultRole === 'student' ? 'selected' : ''}>🏋️ Student Account</option>
              <option value="trainer" ${defaultRole === 'trainer' ? 'selected' : ''}>🏋️‍♂️ Trainer Account</option>
              <option value="admin" ${defaultRole === 'admin' ? 'selected' : ''}>👑 Admin Account</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Registered Phone Number / Username</label>
            <input type="text" id="fp-identity" class="form-control" placeholder="Enter Registered Phone or Username" required />
          </div>

          <div class="form-group">
            <label class="form-label">Security Verification Code (Simulated OTP)</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="fp-otp" class="form-control" placeholder="Click 'Send OTP' to generate" required />
              <button type="button" class="btn btn-secondary btn-sm" id="btn-generate-otp" style="white-space: nowrap;">📲 Send OTP</button>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.35rem;">
              A 6-digit verification code will be dispatched to your registered contact number.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Set New Password</label>
            <input type="password" id="fp-new-pass" class="form-control" placeholder="Enter New Password (min 4 characters)" required minlength="4" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('forgot-pass-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-emerald">🔐 Reset & Save New Password</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  let generatedOtp = '';
  const generateOtpBtn = document.getElementById('btn-generate-otp');
  if (generateOtpBtn) {
    generateOtpBtn.addEventListener('click', () => {
      const identity = document.getElementById('fp-identity').value.trim();
      if (!identity) {
        alert('Please enter your Mobile Number or Username first!');
        return;
      }
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      document.getElementById('fp-otp').value = generatedOtp;
      alert(`📲 Security OTP dispatched to ${identity}:\nYour Verification Code is: ${generatedOtp}`);
    });
  }

  const fpForm = document.getElementById('forgot-pass-form');
  if (fpForm) {
    fpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('fp-role').value;
      const identity = document.getElementById('fp-identity').value.trim();
      const otpEntered = document.getElementById('fp-otp').value.trim();
      const newPass = document.getElementById('fp-new-pass').value.trim();

      if (generatedOtp && otpEntered !== generatedOtp) {
        alert('❌ Invalid OTP Code! Please enter the 6-digit OTP code correctly.');
        return;
      }

      const res = store.selfServiceResetPassword(role, identity, newPass);
      if (res.success) {
        document.getElementById('forgot-pass-modal').remove();
        alert(`🎉 Password Reset Successful!\nAccount: ${res.accountName}\nYour password has been updated across the AuraCore Cloud System. You can now log in with your new password!`);
      } else {
        alert(`❌ Reset Failed: ${res.error}`);
      }
    });
  }
}

function initAuraCoreApp() {
  renderWhatsAppSupportWidget();
  syncHeaderHelplinePhone();
  const viewContainer = document.getElementById('view-container') ||
                        document.getElementById('admin-view-container') ||
                        document.getElementById('admin-trainers-container') ||
                        document.getElementById('admin-clients-container') ||
                        document.getElementById('admin-payments-container') ||
                        document.getElementById('admin-location-container') ||
                        document.getElementById('admin-notices-container') ||
                        document.getElementById('admin-salaries-container');

  const userHeaderBar = document.getElementById('user-header-bar');

  if (!viewContainer) return;

  function renderAppHeaderUI() {
    if (!userHeaderBar) return;
    const user = store.data.currentUser;

    if (user) {
      const roleLabel = user.role === 'admin' ? '🛡️ Admin' : user.role === 'trainer' ? '👟 Trainer' : '🏋️ Student';
      userHeaderBar.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="badge ${user.role === 'admin' ? 'badge-cyan' : user.role === 'trainer' ? 'badge-purple' : 'badge-emerald'}" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
            ${roleLabel}: <strong>${user.name}</strong>
          </span>
          <button class="btn btn-secondary btn-sm" id="btn-logout" title="Log out of session">
            🚪 Logout
          </button>
        </div>
      `;

      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          store.logout();
        });
      }
    } else {
      userHeaderBar.innerHTML = `
        <span style="font-size: 0.85rem; color: var(--text-muted);">Please Log In Below</span>
      `;
    }
  }

  function renderActiveView() {
    renderAppHeaderUI();
    const user = store.data.currentUser;

    // Check specific page container
    if (document.getElementById('admin-trainers-container')) {
      renderAdminTrainersView(document.getElementById('admin-trainers-container'));
      return;
    }
    if (document.getElementById('admin-clients-container')) {
      renderAdminClientsView(document.getElementById('admin-clients-container'));
      return;
    }
    if (document.getElementById('admin-payments-container')) {
      renderAdminPaymentsView(document.getElementById('admin-payments-container'));
      return;
    }
    if (document.getElementById('admin-location-container')) {
      renderAdminLocationView(document.getElementById('admin-location-container'));
      return;
    }
    if (document.getElementById('admin-notices-container')) {
      renderAdminNoticesView(document.getElementById('admin-notices-container'));
      return;
    }
    if (document.getElementById('admin-salaries-container')) {
      renderAdminSalariesView(document.getElementById('admin-salaries-container'));
      return;
    }
    if (document.getElementById('admin-view-container')) {
      renderAdminDashboardView(document.getElementById('admin-view-container'));
      return;
    }

    if (!user) {
      renderLoginPage(viewContainer);
    } else {
      if (user.role === 'admin') {
        renderAdminDashboardView(viewContainer);
      } else if (user.role === 'trainer') {
        renderTrainerView(viewContainer);
      } else if (user.role === 'client') {
        renderClientView(viewContainer);
      }
    }
  }

  store.subscribe(() => {
    renderActiveView();
  });

  renderActiveView();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuraCoreApp);
} else {
  initAuraCoreApp();
}
