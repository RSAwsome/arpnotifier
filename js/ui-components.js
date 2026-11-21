/* ============================================================
   UI Components — Reusable render functions
   ============================================================ */

const UI = {
  /* ── Toast ── */
  toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  /* ── Loader ── */
  loader(container, label = 'Loading...') {
    if (typeof container === 'string') container = document.getElementById(container);
    if (!container) return;
    container.innerHTML = `
      <div class="stack stack-md" style="align-items:center;padding:32px 0;">
        <div class="loader-ring"></div>
        <span class="text-sm text-muted">${label}</span>
      </div>`;
  },

  /* ── Error state ── */
  error(container, message, retryFn) {
    if (typeof container === 'string') container = document.getElementById(container);
    if (!container) return;
    container.innerHTML = `
      <div class="glass-card stack stack-md" style="align-items:center;text-align:center;padding:28px;">
        <div style="font-size:40px;">😕</div>
        <p class="text-sm text-muted">${message}</p>
        ${retryFn ? `<button class="btn btn-glass btn-sm" onclick="(${retryFn.toString()})()">Try Again</button>` : ''}
      </div>`;
  },

  /* ── Empty state ── */
  empty(container, emoji, title, subtitle) {
    if (typeof container === 'string') container = document.getElementById(container);
    if (!container) return;
    container.innerHTML = `
      <div class="stack stack-md" style="align-items:center;text-align:center;padding:40px 0;">
        <div style="font-size:48px;">${emoji}</div>
        <div>
          <p class="text-base font-semibold text-primary">${title}</p>
          ${subtitle ? `<p class="text-sm text-muted mt-1">${subtitle}</p>` : ''}
        </div>
      </div>`;
  },

  /* ── Ripple ── */
  ripple(el, event) {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  },

  /* ── Modal ── */
  openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  },

  /* ── Render Train Card ── */
  renderTrainCard(train, onClick) {
    const card = document.createElement('div');
    card.className = 'train-card';
    card.innerHTML = `
      <div class="card-content">
        <div class="row row-between mb-2">
          <span class="train-number-badge">${train.train_number || train.number || '—'}</span>
          <span class="badge badge-accent text-xs">${train.train_type || 'EXP'}</span>
        </div>
        <p class="text-base font-semibold text-primary tracking-tight mb-1">
          ${train.train_name || train.name || 'Unknown Train'}
        </p>
        <div class="row row-gap-sm mb-3">
          <div class="text-center flex-1">
            <p class="text-xs text-muted font-semibold uppercase">From</p>
            <p class="font-mono text-sm font-bold text-accent">${train.from_station_code || train.from || '—'}</p>
            <p class="text-xs text-muted">${train.from_station_name || ''}</p>
            <p class="text-xs font-bold text-primary">${train.departure_time || train.dep || '—'}</p>
          </div>
          <div class="text-center" style="color:var(--text-disabled);font-size:20px;">🚂</div>
          <div class="text-center flex-1">
            <p class="text-xs text-muted font-semibold uppercase">To</p>
            <p class="font-mono text-sm font-bold text-accent">${train.to_station_code || train.to || '—'}</p>
            <p class="text-xs text-muted">${train.to_station_name || ''}</p>
            <p class="text-xs font-bold text-primary">${train.arrival_time || train.arr || '—'}</p>
          </div>
        </div>
        <div class="row row-gap-sm">
          <span class="chip">${train.duration || '—'}</span>
          ${(train.train_run_days || '').split('').map((d, i) =>
            `<span class="chip ${d === '1' ? 'selected' : ''}" style="padding:3px 7px;font-size:10px;">${['M','T','W','Th','F','Sa','Su'][i]}</span>`
          ).join('')}
        </div>
      </div>`;
    if (onClick) card.addEventListener('click', () => onClick(train));
    return card;
  },

  /* ── Render Route Timeline ── */
  renderRouteTimeline(stops, boardingCode) {
    if (!stops || !stops.length) return '<p class="text-sm text-muted">No route data</p>';

    return `
      <div class="route-timeline">
        ${stops.map((stop, i) => {
          const isOrigin = i === 0;
          const isDest = i === stops.length - 1;
          const isBoarding = stop.station_code === boardingCode;
          return `
            <div class="route-stop ${isOrigin ? 'origin' : ''} ${isDest ? 'destination' : ''}">
              <div class="card-content">
                <div class="row row-between">
                  <div class="flex-1">
                    <div class="row row-gap-sm">
                      <span class="font-mono text-xs font-bold text-accent">${stop.station_code || '—'}</span>
                      ${isBoarding ? '<span class="badge badge-success" style="font-size:9px;">BOARDING</span>' : ''}
                      ${isOrigin ? '<span class="badge badge-accent" style="font-size:9px;">ORIGIN</span>' : ''}
                      ${isDest ? '<span class="badge badge-warning" style="font-size:9px;">DEST</span>' : ''}
                    </div>
                    <p class="text-sm font-semibold text-primary mt-1">${stop.station_name || '—'}</p>
                    <p class="text-xs text-muted">Day ${stop.day || 1}</p>
                  </div>
                  <div class="text-right">
                    ${stop.arrival_time && !isOrigin
                      ? `<p class="text-xs text-muted">Arr: <span class="font-mono font-semibold">${stop.arrival_time}</span></p>`
                      : ''}
                    <p class="text-xs ${isOrigin ? 'text-accent' : 'text-muted'}">
                      ${isOrigin ? 'Dep' : 'Dep'}: <span class="font-mono font-semibold">${stop.departure_time || '—'}</span>
                    </p>
                    ${stop.halt_time ? `<p class="text-xs text-muted">Halt: ${stop.halt_time}m</p>` : ''}
                  </div>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  /* ── Render Event Card ── */
  renderEventCard(event, onDelete) {
    const arpInfo = ARPCalc.computeARP(event.date);
    const cd = arpInfo ? ARPCalc.getCountdownToARP(new Date(event.date + 'T00:00:00')) : null;

    return `
      <div class="glass-card event-card ${event.type || 'user-event'} stack stack-sm mb-3">
        <div class="card-content">
          <div class="row row-between mb-2">
            <div class="row row-gap-sm">
              <span style="font-size:20px;">${event.emoji || '📌'}</span>
              <div>
                <p class="text-base font-bold text-primary">${event.name}</p>
                <p class="text-xs text-muted">${formatDateDisplay(event.date)}</p>
              </div>
            </div>
            ${onDelete ? `<button class="icon-btn" style="width:30px;height:30px;border-radius:8px;font-size:14px;" 
              onclick="(${onDelete.toString()})('${event.id}')">🗑️</button>` : ''}
          </div>
          ${event.trainNumber ? `
            <div class="row row-gap-sm mb-2">
              <span class="train-number-badge">${event.trainNumber}</span>
              <span class="text-sm text-secondary">${event.trainName || ''}</span>
            </div>` : ''}
          ${event.fromStation ? `
            <div class="row row-gap-sm text-xs text-muted mb-2">
              <span class="font-mono font-bold">${event.fromStation}</span>
              <span>→</span>
              <span class="font-mono font-bold">${event.toStation}</span>
              ${event.boardingStation ? `<span class="badge badge-success" style="font-size:9px;">Board: ${event.boardingStation}</span>` : ''}
            </div>` : ''}
          ${arpInfo ? `
            <div class="glass-card mt-2" style="padding:10px 12px;border-radius:12px;">
              <div class="card-content">
                <div class="row row-between">
                  <div>
                    <p class="text-xs text-muted uppercase tracking-wide font-semibold">ARP Opens</p>
                    <p class="text-sm font-bold text-accent">${arpInfo.arpDateStr}</p>
                    <p class="text-xs text-muted">at 8:00 AM IST</p>
                  </div>
                  <div class="text-right">
                    ${cd && !cd.opened
                      ? `<p class="text-xs text-muted">Opens in</p>
                         <p class="text-sm font-bold text-warning">${ARPCalc.formatCountdownShort(cd)}</p>`
                      : `<span class="badge badge-success">🟢 Open Now!</span>`
                    }
                  </div>
                </div>
              </div>
            </div>` : ''}
          ${event.notes ? `<p class="text-xs text-muted mt-2 italic">${event.notes}</p>` : ''}
        </div>
      </div>`;
  },

  /* ── Countdown Display ── */
  renderCountdown(cd) {
    if (cd.opened) {
      return `<div class="text-center">
        <div class="success-icon" style="font-size:48px;margin-bottom:8px;">🟢</div>
        <p class="text-xl font-bold text-success">Booking is OPEN!</p>
        <p class="text-sm text-muted">Rush to book your ticket at irctc.co.in</p>
      </div>`;
    }
    return `
      <div class="text-center">
        <div class="row row-center row-gap-md" style="margin-bottom:8px;">
          ${renderCountdownBlock(cd.days, 'Days')}
          <span class="text-3xl font-bold text-muted" style="margin-top:-8px;">:</span>
          ${renderCountdownBlock(cd.hours, 'Hrs')}
          <span class="text-3xl font-bold text-muted" style="margin-top:-8px;">:</span>
          ${renderCountdownBlock(cd.minutes, 'Min')}
          <span class="text-3xl font-bold text-muted" style="margin-top:-8px;">:</span>
          ${renderCountdownBlock(cd.seconds, 'Sec')}
        </div>
      </div>`;
  },
};

function renderCountdownBlock(value, label) {
  return `
    <div class="text-center">
      <div class="font-mono text-4xl font-black tracking-tight text-primary">${ARPCalc.pad2(value)}</div>
      <div class="text-xs text-muted font-semibold uppercase tracking-wide">${label}</div>
    </div>`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

window.UI = UI;
window.formatDateDisplay = formatDateDisplay;
