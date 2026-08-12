/**
 * AuraCore Trainer Portal View Component
 */
import { store } from '../store.js';
import { getCurrentLocation } from '../location.js';

export function renderTrainerView(container) {
  const data = store.data;
  const currentTrainer = data.trainers.find(t => t.id === data.currentTrainerId) || data.trainers[0];

  // Get Assigned Clients for current Trainer
  const assignedClients = data.clients.filter(c => c.assignedTrainerId === currentTrainer.id);

  container.innerHTML = `
    <!-- Trainer Switcher Bar & Profile Summary -->
    <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(20, 27, 41, 0.9), rgba(124, 77, 255, 0.15)); border: 1px solid var(--border-glow);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: #FFF;">
            ${currentTrainer.name.charAt(0)}
          </div>
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #FFF;">Welcome, Trainer ${currentTrainer.name}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Specialty: <span style="color: var(--accent-cyan); font-weight: 600;">${currentTrainer.specialty}</span> • Phone: ${currentTrainer.phone}
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <label style="font-size: 0.85rem; color: var(--text-muted);">Switch Active Trainer Profile:</label>
          <select id="trainer-profile-select" class="form-control" style="width: auto; min-width: 180px;">
            ${data.trainers.map(t => `<option value="${t.id}" ${t.id === currentTrainer.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- Trainer Quick Stats -->
    <div class="grid-3" style="margin-bottom: 2rem;">
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(0, 229, 255, 0.15); color: var(--accent-cyan);">👥</div>
        <div>
          <div class="stat-value">${assignedClients.length}</div>
          <div class="stat-label">Assigned Clients</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(0, 230, 118, 0.15); color: var(--accent-emerald);">📅</div>
        <div>
          <div class="stat-value">${assignedClients.length > 0 ? 'Today' : 'Rest'}</div>
          <div class="stat-label">Schedule Slot: ${currentTrainer.weeklySchedule?.Mon || '06:30 AM'}</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background: rgba(255, 145, 0, 0.15); color: var(--accent-amber);">📍</div>
        <div>
          <div class="stat-value">GPS Pin</div>
          <div class="stat-label">Location Check-In Status</div>
        </div>
      </div>
    </div>

    <!-- Active Class Verification Controller -->
    ${data.activeVerificationSession && data.activeVerificationSession.trainerId === currentTrainer.id ? `
      <div class="live-notification-bar">
        <div class="notification-content">
          <div class="notification-icon">⏳</div>
          <div class="notification-text">
            <h4>Class Session Active for ${data.activeVerificationSession.clientName}</h4>
            <p>Started at ${data.activeVerificationSession.startedAt}. Waiting for Client to click "Confirm Class" on their portal...</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-cancel-class">Cancel Session</button>
      </div>
    ` : ''}

    <!-- Assigned Clients & Execution Grid -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">👟 Assigned Client Classes & Mutual Verification</h3>
        <span class="badge badge-cyan">Automated Verification</span>
      </div>

      ${assignedClients.length === 0 ? `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No clients assigned to your profile yet.</p>
        </div>
      ` : `
        <div class="grid-2">
          ${assignedClients.map(client => {
            const isSessionActive = data.activeVerificationSession && data.activeVerificationSession.clientId === client.id;
            const pct = Math.round((client.currentCycleClasses / client.totalCycleClasses) * 100);

            return `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                  <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #FFF; margin-bottom: 0.2rem;">${client.name}</h3>
                    <p style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 600;">🎯 ${client.goals}</p>
                  </div>
                  <span class="badge badge-purple">${client.totalCycleClasses || 12}-Class Package</span>
                </div>

                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
                  <p><strong>📞 Contact:</strong> ${client.phone}</p>
                  <p><strong>📍 Address:</strong> ${client.location}</p>
                  <p><strong>📅 Batch Validity:</strong> ${client.batchStartDate} to ${client.batchEndDate}</p>
                </div>

                <!-- Class Cycle Counter -->
                <div style="margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem;">
                    <span>Class Progress</span>
                    <span style="color: var(--accent-emerald);">${client.currentCycleClasses} / ${client.totalCycleClasses || 12} Completed</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                  </div>
                </div>

                <!-- Action Controls: Pin Location & Start Class -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <button class="btn btn-secondary btn-pin-location" data-client-id="${client.id}">
                    📍 Pin Location
                  </button>

                  <button class="btn ${isSessionActive ? 'btn-emerald' : 'btn-primary'} btn-start-class" data-client-id="${client.id}" ${isSessionActive ? 'disabled' : ''}>
                    ${isSessionActive ? '⏳ Class Pending' : '▶️ Start Class'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  // Bind Trainer Event Listeners
  const profileSelect = container.querySelector('#trainer-profile-select');
  if (profileSelect) {
    profileSelect.addEventListener('change', (e) => {
      store.setCurrentTrainer(e.target.value);
    });
  }

  // Location Pinning Action
  container.querySelectorAll('.btn-pin-location').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const clientId = e.target.getAttribute('data-client-id');
      const client = data.clients.find(c => c.id === clientId);
      
      btn.innerText = '🛰️ Pinning...';
      btn.disabled = true;

      const locResult = await getCurrentLocation();
      if (locResult.success) {
        store.pinLocation(currentTrainer.id, clientId, locResult.lat, locResult.lng, client ? client.location : 'On-Site Client Location');
        alert(`📍 Location successfully pinned for ${client ? client.name : 'Client'}!\nCoordinates: (${locResult.lat.toFixed(4)}, ${locResult.lng.toFixed(4)})\nAdmin Live Monitor updated.`);
      }
      renderTrainerView(container);
    });
  });

  // Start Class Session Action (Mutual Verification Trigger)
  container.querySelectorAll('.btn-start-class').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const clientId = e.target.getAttribute('data-client-id');
      store.startClassSession(currentTrainer.id, clientId);
      alert(`▶️ Class session initiated for client!\n\nMutual Verification Alert has been sent to the Client Portal. Client must now click "Confirm Class" to log attendance.`);
    });
  });

  const cancelClassBtn = container.querySelector('#btn-cancel-class');
  if (cancelClassBtn) {
    cancelClassBtn.addEventListener('click', () => {
      store.cancelClassSession();
    });
  }
}
