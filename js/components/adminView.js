/**
 * AuraCore Admin / Management Portal View Component
 */
import { store } from '../store.js';
import { renderLocationMap } from '../location.js';

export function renderAdminView(container) {
  const data = store.data;

  // Calculate Key Admin Statistics
  const totalTrainers = data.trainers.length;
  const totalClients = data.clients.length;
  const totalCompletedClasses = data.clients.reduce((acc, c) => acc + (c.totalCompletedClassesAllTime || 0), 0);
  const pendingSalaryPayouts = data.salaryPayouts.filter(s => s.status !== 'Paid');
  const pendingSalaryTotal = pendingSalaryPayouts.reduce((acc, s) => acc + s.amount, 0);

  container.innerHTML = `
    <!-- Key Statistics Overview -->
    <div class="grid-4" style="margin-bottom: 2rem;">
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(0, 229, 255, 0.15); color: var(--accent-cyan);">👟</div>
        <div>
          <div class="stat-value">${totalTrainers}</div>
          <div class="stat-label">Active Trainers</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(124, 77, 255, 0.15); color: var(--accent-purple);">🏋️</div>
        <div>
          <div class="stat-value">${totalClients}</div>
          <div class="stat-label">Total Clients</div>
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

    <!-- Main Admin Dashboard Grid -->
    <div class="grid-2" style="margin-bottom: 2rem;">
      <!-- Live Geolocation Monitor -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📍 Live Trainer Location Monitor</h3>
          <span class="badge badge-cyan">Real-Time</span>
        </div>
        <div id="admin-map-container"></div>
        <div style="margin-top: 1rem; max-height: 140px; overflow-y: auto;">
          <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Recent Location Check-Ins</h4>
          <ul style="list-style: none; font-size: 0.85rem;">
            ${data.locationPins.map(pin => `
              <li style="padding: 0.4rem 0; border-bottom: 1px dashed var(--border-color); display: flex; justify-content: space-between;">
                <span><strong>${pin.trainerName}</strong> @ ${pin.clientName}</span>
                <span style="color: var(--accent-cyan);">${pin.timestamp}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Broadcast Announcements -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📢 Broadcast Announcements</h3>
          <button class="btn btn-secondary btn-sm" id="btn-open-broadcast-modal">+ New Broadcast</button>
        </div>
        <div style="max-height: 320px; overflow-y: auto;">
          ${data.broadcasts.map(brd => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <strong style="color: var(--accent-cyan);">${brd.title}</strong>
                <span class="badge badge-purple">${brd.target}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 0.35rem;">${brd.message}</p>
              <span style="font-size: 0.75rem; color: var(--text-dim);">${brd.timestamp}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Trainer Management Section -->
    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <h3 class="card-title">👟 Trainer Management & Schedules</h3>
        <button class="btn btn-primary btn-sm" id="btn-add-trainer">+ Register New Trainer</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Trainer Details</th>
              <th>Phone / Aadhaar</th>
              <th>Specialty</th>
              <th>Assigned Clients</th>
              <th>Weekly Schedule</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.trainers.map(trn => {
              const assignedNames = trn.assignedClientIds
                .map(id => data.clients.find(c => c.id === id)?.name)
                .filter(Boolean)
                .join(', ') || 'Unassigned';
              return `
                <tr>
                  <td>
                    <strong>${trn.name}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">User: ${trn.username}</span>
                  </td>
                  <td>${trn.phone}<br><span style="font-size: 0.75rem; color: var(--text-dim);">Aadhaar: ${trn.aadhaar}</span></td>
                  <td><span class="badge badge-purple">${trn.specialty}</span></td>
                  <td>${assignedNames}</td>
                  <td>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Mon-Fri: ${trn.weeklySchedule?.Mon || '06:30 AM'}</span>
                  </td>
                  <td><span class="badge badge-emerald">${trn.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Client / Student Management Section -->
    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-header">
        <h3 class="card-title">🏋️ Client / Student Roster</h3>
        <button class="btn btn-emerald btn-sm" id="btn-add-client">+ Add New Client</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Client Name & Phone</th>
              <th>Service / Goal</th>
              <th>Assigned Trainer</th>
              <th>Batch Dates</th>
              <th>12-Class Cycle Progress</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.clients.map(cli => {
              const trainer = data.trainers.find(t => t.id === cli.assignedTrainerId);
              const pct = Math.round((cli.currentCycleClasses / cli.totalCycleClasses) * 100);
              return `
                <tr>
                  <td>
                    <strong>${cli.name}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${cli.phone}</span>
                  </td>
                  <td><span class="badge badge-cyan">${cli.goals}</span></td>
                  <td>${trainer ? trainer.name : 'Unassigned'}</td>
                  <td>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${cli.batchStartDate} to ${cli.batchEndDate}</span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <div class="progress-bar-bg" style="width: 80px;">
                        <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                      </div>
                      <span style="font-weight: 700; font-size: 0.8rem;">${cli.currentCycleClasses}/${cli.totalCycleClasses}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${cli.paymentStatus === 'Paid' ? 'badge-emerald' : 'badge-amber'}">${cli.paymentStatus}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Salary & Attendance Tracker (12-Class Cycle) -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">💰 Trainer Salary & Attendance Cycle Payouts</h3>
        <span class="badge badge-amber">12-Class Milestone Tracker</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Trainer</th>
              <th>Client</th>
              <th>Completed Cycle</th>
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
                <td>Cycle #${sal.cycleNumber} (${sal.classesCount}/12 Classes)</td>
                <td><strong style="color: var(--accent-emerald);">₹${sal.amount.toLocaleString()}</strong></td>
                <td>
                  <span class="badge ${sal.status === 'Paid' ? 'badge-emerald' : 'badge-amber'}">${sal.status}</span>
                </td>
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

  // Render Live Map Component
  renderLocationMap('admin-map-container', data.locationPins);

  // Bind Admin Action Event Listeners
  const addTrainerBtn = container.querySelector('#btn-add-trainer');
  if (addTrainerBtn) {
    addTrainerBtn.addEventListener('click', () => openTrainerModal());
  }

  const addClientBtn = container.querySelector('#btn-add-client');
  if (addClientBtn) {
    addClientBtn.addEventListener('click', () => openClientModal());
  }

  const broadcastBtn = container.querySelector('#btn-open-broadcast-modal');
  if (broadcastBtn) {
    broadcastBtn.addEventListener('click', () => openBroadcastModal());
  }

  container.querySelectorAll('.mark-salary-paid-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const salId = e.target.getAttribute('data-id');
      store.markSalaryPaid(salId);
      alert('Salary payout marked as completed!');
    });
  });
}

function openTrainerModal() {
  const modalHTML = `
    <div class="modal-overlay active" id="trainer-modal">
      <div class="modal-container">
        <h3 style="font-family: var(--font-heading); margin-bottom: 1rem; color: var(--accent-cyan);">👟 Register New Trainer</h3>
        <form id="trainer-form">
          <div class="form-group">
            <label class="form-label">Trainer Name</label>
            <input type="text" id="trn-name" class="form-control" placeholder="e.g. Ramesh V." required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" id="trn-phone" class="form-control" placeholder="e.g. 98765 12345" required />
          </div>
          <div class="form-group">
            <label class="form-label">Aadhaar Number</label>
            <input type="text" id="trn-aadhaar" class="form-control" placeholder="e.g. 1234 5678 9012" required />
          </div>
          <div class="form-group">
            <label class="form-label">Specialty (Enter Manually)</label>
            <input type="text" id="trn-specialty" class="form-control" placeholder="Enter trainer specialty manually (e.g. Weight Loss & Functional Fitness)" required />
          </div>
          <div class="form-group">
            <label class="form-label">Login Username</label>
            <input type="text" id="trn-username" class="form-control" placeholder="e.g. ramesh_fit" required />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('trainer-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Trainer Profile</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('trainer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    store.saveTrainer({
      name: document.getElementById('trn-name').value,
      phone: document.getElementById('trn-phone').value,
      aadhaar: document.getElementById('trn-aadhaar').value,
      specialty: document.getElementById('trn-specialty').value,
      username: document.getElementById('trn-username').value,
      password: 'password123'
    });
    document.getElementById('trainer-modal').remove();
    alert('New Trainer registered successfully!');
  });
}

function openClientModal() {
  const trainers = store.data.trainers;
  const modalHTML = `
    <div class="modal-overlay active" id="client-modal">
      <div class="modal-container">
        <h3 style="font-family: var(--font-heading); margin-bottom: 1rem; color: var(--accent-emerald);">🏋️ Add New Student</h3>
        <form id="client-form">
          <div class="form-group">
            <label class="form-label">Student Name</label>
            <input type="text" id="cli-name" class="form-control" placeholder="e.g. Anand Kumar" required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" id="cli-phone" class="form-control" placeholder="e.g. 98400 99887" required />
          </div>
          <div class="form-group">
            <label class="form-label">Student Goal / Fitness Focus</label>
            <input type="text" id="cli-goals" class="form-control" placeholder="e.g. Weight Loss & Body Toning" required />
          </div>
          <div class="form-group">
            <label class="form-label">Address / Location</label>
            <input type="text" id="cli-location" class="form-control" placeholder="e.g. Anna Nagar, Chennai" required />
          </div>
          <div class="form-group">
            <label class="form-label">Assign Trainer</label>
            <select id="cli-trainer" class="form-control">
              ${trainers.map(t => `<option value="${t.id}">${t.name} (${t.specialty})</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('client-modal').remove()">Cancel</button>
            <button type="submit" class="btn btn-emerald">Add Client</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    store.saveClient({
      name: document.getElementById('cli-name').value,
      phone: document.getElementById('cli-phone').value,
      goals: document.getElementById('cli-goals').value,
      location: document.getElementById('cli-location').value,
      assignedTrainerId: document.getElementById('cli-trainer').value,
      batchStartDate: new Date().toISOString().split('T')[0],
      batchEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'Paid',
      feeAmount: 6000
    });
    document.getElementById('client-modal').remove();
    alert('Client added successfully!');
  });
}

function openBroadcastModal() {
  const modalHTML = `
    <div class="modal-overlay active" id="broadcast-modal">
      <div class="modal-container">
        <h3 style="font-family: var(--font-heading); margin-bottom: 1rem; color: var(--accent-purple);">📢 Broadcast New Notice</h3>
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
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
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
