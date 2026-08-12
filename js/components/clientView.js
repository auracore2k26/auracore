/**
 * AuraCore Student / Client Portal View Component
 */
import { store } from '../store.js';
import { generateUPILink, renderQRCodeOnCanvas, AURACORE_UPI_ID, AURACORE_PHONE } from '../payment.js';

export function renderClientView(container) {
  const data = store.data;
  const currentClient = data.clients.find(c => c.id === data.currentClientId) || data.clients[0];
  const assignedTrainer = data.trainers.find(t => t.id === currentClient.assignedTrainerId);

  const activeSess = data.activeVerificationSession;
  const isClassPendingForMe = activeSess && activeSess.clientId === currentClient.id;

  const pct = Math.round((currentClient.currentCycleClasses / currentClient.totalCycleClasses) * 100);

  container.innerHTML = `
    <!-- Client Switcher Bar & Profile Summary -->
    <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(20, 27, 41, 0.9), rgba(0, 230, 118, 0.12)); border: 1px solid var(--border-glow);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: #000;">
            ${currentClient.name.charAt(0)}
          </div>
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #FFF;">Welcome, ${currentClient.name}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Goal: <span style="color: var(--accent-emerald); font-weight: 600;">${currentClient.goals}</span> • Location: ${currentClient.location}
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <label style="font-size: 0.85rem; color: var(--text-muted);">Switch Client View:</label>
          <select id="client-profile-select" class="form-control" style="width: auto; min-width: 180px;">
            ${data.clients.map(c => `<option value="${c.id}" ${c.id === currentClient.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- MUTUAL ATTENDANCE VERIFICATION PROMPT (High Priority) -->
    ${isClassPendingForMe ? `
      <div class="live-notification-bar" style="background: linear-gradient(90deg, rgba(0, 230, 118, 0.25), rgba(0, 229, 255, 0.25)); border-color: var(--accent-emerald);">
        <div class="notification-content">
          <div class="notification-icon" style="background: var(--accent-emerald);">🔔</div>
          <div class="notification-text">
            <h4>Class In Session! Trainer ${activeSess.trainerName} started class at ${activeSess.startedAt}.</h4>
            <p>Please click "Confirm Class" to approve mutual attendance for today's session.</p>
          </div>
        </div>
        <button class="btn btn-emerald" id="btn-confirm-class" data-session-id="${activeSess.id}">
          ✅ Confirm Class
        </button>
      </div>
    ` : ''}

    <!-- Main Client Dashboard Grid -->
    <div class="grid-2" style="margin-bottom: 2rem;">

      <!-- Class Package Attendance Tracker -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🎯 Attendance Progress Tracker</h3>
          <span class="badge badge-emerald">${currentClient.currentCycleClasses} / ${currentClient.totalCycleClasses || 12} Completed</span>
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

        <!-- Milestone Steps Visualizer -->
        <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">Class Package Milestones (${currentClient.totalCycleClasses || 12} Total Classes):</h4>
        <div style="display: grid; grid-template-columns: repeat(${Math.min(currentClient.totalCycleClasses || 12, 6)}, 1fr); gap: 0.5rem; margin-bottom: 1.5rem;">
          ${Array.from({ length: currentClient.totalCycleClasses || 12 }).map((_, i) => {
            const stepNum = i + 1;
            const isDone = stepNum <= currentClient.currentCycleClasses;
            return `
              <div style="
                background: ${isDone ? 'linear-gradient(135deg, var(--accent-emerald), #00C853)' : 'rgba(255,255,255,0.05)'};
                border: 1px solid ${isDone ? 'var(--accent-emerald)' : 'var(--border-color)'};
                color: ${isDone ? '#000' : 'var(--text-muted)'};
                border-radius: var(--radius-sm);
                padding: 0.5rem;
                text-align: center;
                font-family: var(--font-heading);
                font-weight: 700;
                font-size: 0.85rem;
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

      <!-- Trainer Details & Batch Validity -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">👟 Your Assigned Trainer</h3>
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
              <p style="font-size: 0.85rem; color: var(--accent-cyan);">AuraCore Helpline: ${AURACORE_PHONE}</p>
            </div>
          </div>
        ` : `<p style="color: var(--text-muted);">No trainer assigned yet.</p>`}

        <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-size: 0.85rem; line-height: 1.6;">
          <p><strong>📅 Batch Duration:</strong> ${currentClient.batchStartDate} to ${currentClient.batchEndDate}</p>
          <p><strong>💳 Payment Status:</strong> 
            <span class="badge ${currentClient.paymentStatus === 'Paid' ? 'badge-emerald' : 'badge-amber'}">${currentClient.paymentStatus}</span>
          </p>
          <p><strong>💰 Package Fee:</strong> ₹${(currentClient.feeAmount || 6000).toLocaleString()}</p>
        </div>

        <button class="btn btn-primary" id="btn-open-payment-modal" style="width: 100%;">
          💳 Pay Fees / Renew Batch (UPI & QR)
        </button>
      </div>

    </div>
  `;

  // Bind Event Listeners
  const clientSelect = container.querySelector('#client-profile-select');
  if (clientSelect) {
    clientSelect.addEventListener('change', (e) => {
      store.setCurrentClient(e.target.value);
    });
  }

  // Confirm Class Mutual Verification
  const confirmBtn = container.querySelector('#btn-confirm-class');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      const sessId = e.target.getAttribute('data-session-id');
      const success = store.confirmClassSession(sessId);
      if (success) {
        alert('🎉 Attendance Confirmed!\n\nYour mutual attendance has been verified and registered into AuraCore system.');
      }
    });
  }

  // Open Payment Integration Modal
  const payBtn = container.querySelector('#btn-open-payment-modal');
  if (payBtn) {
    payBtn.addEventListener('click', () => openPaymentModal(currentClient));
  }
}

function openPaymentModal(client) {
  const upiLink = generateUPILink(client.feeAmount || 6000, `AuraCore Fee - ${client.name}`);

  const modalHTML = `
    <div class="modal-overlay active" id="payment-modal">
      <div class="modal-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="font-family: var(--font-heading); color: var(--accent-emerald);">💳 AuraCore Instant Payment</h3>
          <button style="background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;" onclick="document.getElementById('payment-modal').remove()">×</button>
        </div>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <p style="font-size: 0.85rem; color: var(--text-muted);">Amount Due:</p>
          <h2 style="font-family: var(--font-heading); font-size: 2.2rem; color: var(--accent-emerald); font-weight: 800;">₹${(client.feeAmount || 6000).toLocaleString()}</h2>
          <p style="font-size: 0.8rem; color: var(--accent-cyan); margin-top: 0.2rem;">Official UPI ID: <strong>${AURACORE_UPI_ID}</strong></p>
        </div>

        <!-- Desktop QR Code Canvas Container -->
        <div style="text-align: center; background: #FFF; padding: 1rem; border-radius: var(--radius-md); display: inline-block; margin: 0 auto 1.25rem; width: 100%;">
          <canvas id="upi-qr-canvas" style="display: block; margin: 0 auto; border-radius: 8px;"></canvas>
          <p style="color: #000; font-size: 0.75rem; margin-top: 0.5rem; font-weight: 700;">Scan with GPay, PhonePe, Paytm, or BHIM</p>
        </div>

        <!-- Mobile Direct Deep Links -->
        <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem;">
          <a href="${upiLink}" class="btn btn-emerald" style="width: 100%; text-decoration: none;">
            📱 Pay directly via UPI Apps (GPay / PhonePe)
          </a>
        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;">
          <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin-bottom: 0.75rem;">Need help with payment? Call Helpline:</p>
          <a href="tel:8754759353" class="contact-badge" style="justify-content: center; width: 100%; font-size: 0.9rem;">
            📞 Call Support: ${AURACORE_PHONE}
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Render Visual QR Code on Canvas
  renderQRCodeOnCanvas('upi-qr-canvas', upiLink, 180);
}
