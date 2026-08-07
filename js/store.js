/**
 * AuraCore State Management & LocalStorage Persistence
 * Synchronizes Admin, Trainer, and Client data with real-time Event Emitters.
 */

const STORAGE_KEY = 'auracore_app_state_v11';

const DEFAULT_SEED_DATA = {
  activeRole: 'admin', // 'admin' | 'trainer' | 'client'
  currentTrainerId: 'trn_101',
  currentClientId: 'cli_201',
  
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
      weeklySchedule: {
        Mon: '06:30 AM - 07:30 AM',
        Tue: '06:30 AM - 07:30 AM',
        Wed: '06:30 AM - 07:30 AM',
        Thu: '06:30 AM - 07:30 AM',
        Fri: '06:30 AM - 07:30 AM',
        Sat: '07:00 AM - 08:00 AM',
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
      weeklySchedule: {
        Mon: '05:00 PM - 06:00 PM',
        Tue: '05:00 PM - 06:00 PM',
        Wed: '05:00 PM - 06:00 PM',
        Thu: '05:00 PM - 06:00 PM',
        Fri: '05:00 PM - 06:00 PM',
        Sat: '04:00 PM - 05:00 PM',
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
      weeklySchedule: {
        Mon: '06:00 AM - 07:30 AM',
        Tue: '06:00 AM - 07:30 AM',
        Wed: '06:00 AM - 07:30 AM',
        Thu: '06:00 AM - 07:30 AM',
        Fri: '06:00 AM - 07:30 AM',
        Sat: '06:00 AM - 08:00 AM',
        Sun: 'Rest Day'
      },
      status: 'Active'
    }
  ],

  clients: [
    {
      id: 'cli_201',
      name: 'Rohan Sharma',
      phone: '98400 11223',
      goals: 'Weight Loss & Body Toning',
      location: '12th Main Road, Anna Nagar West, Chennai',
      assignedTrainerId: 'trn_101',
      batchStartDate: '2026-07-15',
      batchEndDate: '2026-09-15',
      paymentStatus: 'Paid',
      currentCycleClasses: 5,
      totalCycleClasses: 12,
      totalCompletedClassesAllTime: 17,
      feeAmount: 6000
    },
    {
      id: 'cli_202',
      name: 'Aravind (Child)',
      phone: '98840 55667',
      goals: 'Special Care & Mobility Training',
      location: 'Flat 4A, Greenways Apartments, Adyar, Chennai',
      assignedTrainerId: 'trn_102',
      batchStartDate: '2026-08-01',
      batchEndDate: '2026-10-01',
      paymentStatus: 'Pending',
      currentCycleClasses: 11,
      totalCycleClasses: 12,
      totalCompletedClassesAllTime: 11,
      feeAmount: 7500
    },
    {
      id: 'cli_203',
      name: 'Meera Nair',
      phone: '99620 99887',
      goals: 'Fitness & Core Conditioning',
      location: '3rd Cross Street, T. Nagar, Chennai',
      assignedTrainerId: 'trn_101',
      batchStartDate: '2026-07-01',
      batchEndDate: '2026-09-01',
      paymentStatus: 'Paid',
      currentCycleClasses: 8,
      totalCycleClasses: 16,
      totalCompletedClassesAllTime: 20,
      feeAmount: 8500
    },
    {
      id: 'cli_204',
      name: 'Kavya S.',
      phone: '97100 44332',
      goals: 'Strength & Endurance Training',
      location: 'Sector 5, KK Nagar, Chennai',
      assignedTrainerId: 'trn_103',
      batchStartDate: '2026-08-01',
      batchEndDate: '2026-10-01',
      paymentStatus: 'Paid',
      currentCycleClasses: 3,
      totalCycleClasses: 20,
      totalCompletedClassesAllTime: 3,
      feeAmount: 9000
    }
  ],

  activeVerificationSession: null, // { id, trainerId, clientId, startedAt, status: 'PENDING_CLIENT_CONFIRM' }

  locationPins: [
    {
      id: 'pin_301',
      trainerId: 'trn_101',
      trainerName: 'Karthik Raja',
      clientId: 'cli_201',
      clientName: 'Rohan Sharma',
      lat: 13.0878,
      lng: 80.2155,
      addressName: 'Anna Nagar West (On-Site Client Location)',
      timestamp: 'Today, 06:28 AM',
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
      addressName: 'Greenways, Adyar',
      timestamp: 'Yesterday, 04:55 PM',
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
      title: 'Monthly Assessment Notice',
      message: 'All trainers please submit client fitness progress reports before 10th August.',
      target: 'Trainers',
      timestamp: '2 hours ago'
    },
    {
      id: 'brd_502',
      title: 'Welcome to AuraCore Platform!',
      message: 'Client mutual attendance verification is live. Always verify class status with your assigned trainer.',
      target: 'All Users',
      timestamp: '1 day ago'
    }
  ]
};

class Store {
  constructor() {
    this.data = this.loadState();
    // Setup cross-tab sync channel if supported
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel('auracore_state_channel');
      this.channel.onmessage = (event) => {
        if (event.data && event.data.type === 'STATE_UPDATED') {
          this.data = this.loadState();
          this.notifyListeners('external');
        }
      };
    }
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      if (this.channel) {
        this.channel.postMessage({ type: 'STATE_UPDATED' });
      }
      this.notifyListeners('local');
    } catch (e) {
      console.error('Failed to save state:', e);
    }
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

  /* --- Actions --- */

  setActiveRole(role) {
    this.data.activeRole = role;
    this.saveState();
  }

  setCurrentTrainer(trainerId) {
    this.data.currentTrainerId = trainerId;
    this.saveState();
  }

  setCurrentClient(clientId) {
    this.data.currentClientId = clientId;
    this.saveState();
  }

  // Trainer Starts Class -> Initiates Mutual Verification
  startClassSession(trainerId, clientId) {
    const trainer = this.data.trainers.find(t => t.id === trainerId);
    const client = this.data.clients.find(c => c.id === clientId);
    
    this.data.activeVerificationSession = {
      id: 'sess_' + Date.now(),
      trainerId,
      trainerName: trainer ? trainer.name : 'Trainer',
      clientId,
      clientName: client ? client.name : 'Client',
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING_CLIENT_CONFIRM'
    };
    this.saveState();
    return this.data.activeVerificationSession;
  }

  // Client Approves / Confirms Class -> Mutual Attendance Registered!
  confirmClassSession(sessionId) {
    if (!this.data.activeVerificationSession || this.data.activeVerificationSession.id !== sessionId) {
      return false;
    }
    
    const sess = this.data.activeVerificationSession;
    const client = this.data.clients.find(c => c.id === sess.clientId);
    
    if (client) {
      client.currentCycleClasses += 1;
      client.totalCompletedClassesAllTime += 1;
      
      // Check if 12 classes cycle is completed
      if (client.currentCycleClasses >= client.totalCycleClasses) {
        // Auto trigger salary payout entry for trainer!
        const trainer = this.data.trainers.find(t => t.id === sess.trainerId);
        this.data.salaryPayouts.unshift({
          id: 'sal_' + Date.now(),
          trainerId: sess.trainerId,
          trainerName: trainer ? trainer.name : 'Trainer',
          clientId: client.id,
          clientName: client.name,
          cycleNumber: Math.ceil(client.totalCompletedClassesAllTime / 12),
          classesCount: 12,
          amount: client.feeAmount || 6000,
          status: 'Ready for Processing',
          processedDate: 'Pending Admin Approval'
        });
        
        // Reset cycle classes for next 12-class batch
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

  // Trainer Location Check-in Pin
  pinLocation(trainerId, clientId, lat, lng, addressName) {
    const trainer = this.data.trainers.find(t => t.id === trainerId);
    const client = this.data.clients.find(c => c.id === clientId);
    
    const newPin = {
      id: 'pin_' + Date.now(),
      trainerId,
      trainerName: trainer ? trainer.name : 'Trainer',
      clientId,
      clientName: client ? client.name : 'Client Location',
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      addressName: addressName || 'Pinned GPS Coordinates',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      status: 'Verified On-Site'
    };

    this.data.locationPins.unshift(newPin);
    this.saveState();
    return newPin;
  }

  // Admin Add / Update Trainer
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
        Mon: '06:00 AM - 07:00 AM', Tue: '06:00 AM - 07:00 AM', Wed: '06:00 AM - 07:00 AM',
        Thu: '06:00 AM - 07:00 AM', Fri: '06:00 AM - 07:00 AM', Sat: '07:00 AM - 08:00 AM', Sun: 'Rest Day'
      };
      trainerData.status = 'Active';
      this.data.trainers.push(trainerData);
    }
    this.saveState();
  }

  // Admin Add / Update Client
  saveClient(clientData) {
    if (clientData.id) {
      const idx = this.data.clients.findIndex(c => c.id === clientData.id);
      if (idx !== -1) {
        this.data.clients[idx] = { ...this.data.clients[idx], ...clientData };
      }
    } else {
      clientData.id = 'cli_' + Date.now();
      clientData.currentCycleClasses = 0;
      clientData.totalCycleClasses = 12;
      clientData.totalCompletedClassesAllTime = 0;
      this.data.clients.push(clientData);
    }
    this.saveState();
  }

  // Admin Process Salary Payout
  markSalaryPaid(payoutId) {
    const payout = this.data.salaryPayouts.find(s => s.id === payoutId);
    if (payout) {
      payout.status = 'Paid';
      payout.processedDate = new Date().toISOString().split('T')[0];
      this.saveState();
    }
  }

  // Admin Broadcast Message
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

  // Client Record Payment
  recordClientPayment(clientId, txId) {
    const client = this.data.clients.find(c => c.id === clientId);
    if (client) {
      client.paymentStatus = 'Paid';
      this.saveState();
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
    this.saveState();
  }
}

export const store = new Store();
