/* ============================================================
   App.js — Main Application Controller
   ARP Notifier PWA
   ============================================================ */

'use strict';

/* ── App State ── */
const AppState = {
  currentTab: 'dashboard',
  theme: localStorage.getItem('theme') || 'dark',
  countdownTimer: null,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth() + 1,
  calendarMode: 'month', // 'month', '6m', 'year'
  selectedCalDate: null,
  trainSearch: { from: '', to: '', date: '', trains: [], selected: null },
  pnrSearch: { pnr: '', result: null },
};

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(AppState.theme);
  registerServiceWorker();
  
  // Render visual UI immediately first (no blocking on network)
  setupNavigation();
  setupTopNav();
  setupThemeToggle();
  renderDashboard();
  renderCalendar();
  setupTrainTab();
  setupSettingsModal();
  startGlobalCountdown();

  // Async cloud sync in background
  try {
    await FirebaseManager.init();
    await EventsManager.init();
    renderDashboard();
    renderCalendar();
  } catch (err) {
    console.warn('Background sync deferred:', err);
  }

  // Handle PWA install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredInstall = e;
    showInstallBanner();
  });

  // Smoothly hide splash screen after animation
  setTimeout(() => {
    const splash = document.getElementById('app-splash');
    if (splash) splash.classList.add('hidden-splash');
  }, 1100);
});

/* ── Service Worker ── */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('SW registered:', reg.scope);
    }).catch(console.error);
  }
}

/* ── Theme ── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  AppState.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content', theme === 'dark' ? '#080812' : '#f0f0f8'
  );
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  updateThemeIcon();
  btn.addEventListener('click', () => {
    const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    updateThemeIcon();
    UI.toast(`${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'success');
  });
}

function updateThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
  btn.title = AppState.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

/* ── Navigation ── */
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const tab = item.dataset.tab;
      if (!tab) return;
      UI.ripple(item, e);
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  AppState.currentTab = tab;

  // Update panels
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `tab-${tab}`);
  });

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });

  // Lazy render on first visit
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'calendar') renderCalendar();
  if (tab === 'trains') { /* already set up */ }
}

/* ── Top Nav ── */
function setupTopNav() {
  document.getElementById('settings-btn')?.addEventListener('click', () => {
    UI.openModal('settings-modal');
  });
  document.getElementById('install-btn')?.addEventListener('click', () => {
    if (window.deferredInstall) {
      window.deferredInstall.prompt();
    } else {
      UI.toast('Open in Chrome and tap menu → "Add to Home screen"', 'info', 4000);
    }
  });
}

/* ── PWA Install Banner ── */
function showInstallBanner() {
  document.getElementById('install-btn')?.classList.remove('hidden');
}

/* ── Global Countdown Timer ── */
function startGlobalCountdown() {
  if (AppState.countdownTimer) clearInterval(AppState.countdownTimer);
  AppState.countdownTimer = setInterval(() => {
    updateCountdownDisplays();
  }, 1000);
  updateCountdownDisplays();
}

function updateCountdownDisplays() {
  // Dashboard today's ARP countdown
  const journeyInput = document.getElementById('dash-journey-date');
  const dateVal = journeyInput?.value;
  if (dateVal) {
    const arp = ARPCalc.computeARP(dateVal);
    if (arp) updateDashboardARP(arp);
  }
}

/* ═══════════════════════════════════════════════
   TAB 1: DASHBOARD
   ═══════════════════════════════════════════════ */

function renderDashboard() {
  const todayInfo = ARPCalc.getTodaysARPInfo();
  const upcomingARPs = ARPCalc.getUpcomingARPs(5);
  const upcomingEvents = EventsManager.getUpcomingEvents(3);

  // Today's headline
  document.getElementById('today-journey-date').textContent = todayInfo.journeyDateShort;
  document.getElementById('today-arp-time').textContent = `Booking opens at 8:00 AM IST`;

  // Upcoming ARP list
  const upcomingEl = document.getElementById('upcoming-arp-list');
  if (upcomingEl) {
    upcomingEl.innerHTML = upcomingARPs.map((item, i) => `
      <div class="glass-card stat-card row row-between" style="border-radius:14px;padding:12px 14px;">
        <div class="card-content">
          <div class="row row-gap-sm">
            <div class="stat-icon" style="font-size:18px;margin:0;">🚂</div>
            <div>
              <p class="text-xs text-muted">Journey: <span class="font-semibold text-primary">${item.journeyDateStr}</span></p>
              <p class="text-xs font-bold text-accent">Book on: ${item.arpDateStr}</p>
            </div>
          </div>
        </div>
        ${i === 0 ? '<span class="badge badge-success">Today\'s ARP</span>' : ''}
      </div>`).join('');
  }

  // My events on dashboard
  const eventsEl = document.getElementById('dash-events-list');
  if (eventsEl) {
    if (upcomingEvents.length === 0) {
      UI.empty(eventsEl, '📅', 'No upcoming events', 'Go to Calendar tab to add events');
    } else {
      eventsEl.innerHTML = upcomingEvents.map(e => UI.renderEventCard(e, null)).join('');
    }
  }

  // Setup ARP calculator on dashboard
  setupDashARPCalc();
}

function setupDashARPCalc() {
  const form = document.getElementById('dash-arp-form');
  if (!form || form.dataset.setup) return;
  form.dataset.setup = '1';

  const dateInput = document.getElementById('dash-journey-date');
  const resultEl  = document.getElementById('dash-arp-result');

  // Set min date to today, max to 1 year
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  dateInput.min = today;
  dateInput.max = maxDate.toISOString().split('T')[0];

  dateInput.addEventListener('change', () => {
    const arp = ARPCalc.computeARP(dateInput.value);
    if (!arp) return;
    updateDashboardARP(arp);
    resultEl.classList.remove('hidden');
  });
}

function updateDashboardARP(arp) {
  document.getElementById('result-arp-date').textContent = arp.arpDateFull;
  document.getElementById('result-arp-time').textContent = 'at 8:00 AM IST';
  document.getElementById('result-journey-date').textContent = arp.journeyDateStr;
  document.getElementById('result-days-from-now').textContent =
    arp.daysFromNow > 0 ? `${arp.daysFromNow} days from today` : 'Today!';

  const cdEl = document.getElementById('result-countdown');
  if (cdEl) {
    cdEl.innerHTML = UI.renderCountdown(arp.countdown);
  }

  // Progress bar
  const progressEl = document.getElementById('arp-progress');
  if (progressEl) {
    const pct = arp.countdown.opened
      ? 100
      : Math.max(0, 100 - (arp.countdown.days / ARPCalc.ARP_DAYS) * 100);
    progressEl.querySelector('.progress-fill')?.setAttribute('style', `width:${pct}%`);
  }
}

/* ═══════════════════════════════════════════════
   TAB 2: TRAIN SEARCH
   ═══════════════════════════════════════════════ */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setupTrainTab() {
  const trainForm = document.getElementById('train-number-form');
  const trainInput = document.getElementById('train-number-input');
  const boardingSelect = document.getElementById('train-boarding-select');
  const boardingDateInput = document.getElementById('train-boarding-date');
  const pnrForm = document.getElementById('pnr-form');
  const toggleRouteBtn = document.getElementById('toggle-route-btn');

  if (trainForm && !trainForm.dataset.setup) {
    trainForm.dataset.setup = '1';

    // Submit handler for Train Number form
    trainForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const num = trainInput?.value.trim();
      if (num) await fetchAndDisplayTrainSchedule(num);
    });

    // Auto-fetch on typing 5 digits
    trainInput?.addEventListener('input', async (e) => {
      const val = e.target.value.trim();
      if (val.length === 5 && /^\d{5}$/.test(val)) {
        await fetchAndDisplayTrainSchedule(val);
      }
    });

    // Quick train chips
    const chips = document.querySelectorAll('.train-quick-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', async () => {
        const trainNum = chip.dataset.train;
        if (trainInput) trainInput.value = trainNum;
        chips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        await fetchAndDisplayTrainSchedule(trainNum);
      });
    });

    // Boarding station change handler
    boardingSelect?.addEventListener('change', () => {
      calculateAndRenderTrainARP();
      const stations = AppState.currentTrainSchedule?.stations || [];
      renderTrainFullRoute(stations, boardingSelect.value);
    });

    // Boarding date change handler
    boardingDateInput?.addEventListener('change', () => {
      calculateAndRenderTrainARP();
    });

    // Toggle station route list
    toggleRouteBtn?.addEventListener('click', () => {
      const routeList = document.getElementById('train-full-route');
      const toggleIcon = document.getElementById('route-toggle-icon');
      if (routeList) {
        const isHidden = routeList.classList.toggle('hidden');
        if (toggleIcon) toggleIcon.textContent = isHidden ? '▼ Show' : '▲ Hide';
      }
    });

    // PNR Form submit
    pnrForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await checkPNR();
    });

    // Default: auto-load popular train 12723 (Telangana Express) on first tab visit
    if (trainInput && !trainInput.value) {
      trainInput.value = '12723';
      fetchAndDisplayTrainSchedule('12723');
    }
  }
}

/**
 * Fetches train schedule and all boarding points using live backend / fallback APIs.
 */
async function fetchAndDisplayTrainSchedule(trainNumber) {
  trainNumber = String(trainNumber || '').trim();
  if (!trainNumber || !/^\d{3,6}$/.test(trainNumber)) {
    UI.toast('Please enter a valid train number (e.g. 12723)', 'warning');
    return;
  }

  const loadingEl = document.getElementById('train-loading-status');
  const errorEl = document.getElementById('train-error-status');
  const errorTextEl = document.getElementById('train-error-text');
  const scheduleSection = document.getElementById('train-schedule-section');

  loadingEl?.classList.remove('hidden');
  errorEl?.classList.add('hidden');
  scheduleSection?.classList.add('hidden');

  const res = await TRAIN_API.fetchTrainSchedule(trainNumber);
  loadingEl?.classList.add('hidden');

  if (!res.success || !res.data) {
    if (errorTextEl) errorTextEl.textContent = res.error || `Train ${trainNumber} not found. Please verify the train number.`;
    errorEl?.classList.remove('hidden');
    return;
  }

  const trainData = res.data;
  AppState.currentTrainSchedule = trainData;

  // Render Train Banner
  const dispNum = document.getElementById('disp-train-number');
  const dispName = document.getElementById('disp-train-name');
  const dispOrigin = document.getElementById('disp-train-origin');
  const dispDest = document.getElementById('disp-train-destination');
  const dispStats = document.getElementById('disp-train-stats');

  if (dispNum) dispNum.textContent = trainData.train_number;
  if (dispName) dispName.textContent = trainData.train_name;

  const originStn = trainData.source_station || trainData.stations?.[0];
  const destStn = trainData.destination_station || trainData.stations?.[trainData.stations.length - 1];

  if (dispOrigin) dispOrigin.textContent = originStn ? `${originStn.station_name} (${originStn.station_code})` : 'Origin';
  if (dispDest) dispDest.textContent = destStn ? `${destStn.station_name} (${destStn.station_code})` : 'Destination';

  const maxDay = destStn?.day || 1;
  const dist = destStn?.distance_km ? `${destStn.distance_km} km` : 'Complete Route';
  if (dispStats) {
    dispStats.textContent = `${trainData.total_stations || trainData.stations?.length} Stops • ${dist} • Runs across ${maxDay} Day(s)`;
  }

  // Populate Boarding Stations Select
  const selectEl = document.getElementById('train-boarding-select');
  if (selectEl) {
    selectEl.innerHTML = '';
    (trainData.stations || []).forEach((stn, idx) => {
      const opt = document.createElement('option');
      opt.value = stn.station_code;
      opt.dataset.day = stn.day || 1;
      opt.dataset.name = stn.station_name;
      opt.dataset.arr = stn.arrival_time || 'Start';
      opt.dataset.dep = stn.departure_time || 'End';
      opt.dataset.dist = stn.distance_km || 0;

      const dayLabel = `Day ${stn.day || 1}`;
      const timeLabel = stn.departure_time ? `Dep: ${stn.departure_time}` : (stn.arrival_time ? `Arr: ${stn.arrival_time}` : '');
      opt.textContent = `[${stn.station_code}] ${stn.station_name} — ${dayLabel} • ${timeLabel} • ${stn.distance_km}km`;

      if (idx === 0) opt.selected = true;
      selectEl.appendChild(opt);
    });
  }

  // Set default Boarding Date
  const boardingDateInput = document.getElementById('train-boarding-date');
  if (boardingDateInput) {
    const today = new Date();
    const defDate = new Date();
    defDate.setDate(today.getDate() + 60);
    const defDateStr = defDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    boardingDateInput.min = todayStr;
    if (!boardingDateInput.value || boardingDateInput.value < todayStr) {
      boardingDateInput.value = defDateStr;
    }
  }

  // Populate Route Timeline
  renderTrainFullRoute(trainData.stations, selectEl?.value);

  // Show schedule section and calculate ARP
  scheduleSection?.classList.remove('hidden');
  calculateAndRenderTrainARP();
}

/**
 * Calculates and renders exact ARP opening date based on train origin departure date vs boarding date.
 */
function calculateAndRenderTrainARP() {
  const trainData = AppState.currentTrainSchedule;
  if (!trainData) return;

  const selectEl = document.getElementById('train-boarding-select');
  const dateInput = document.getElementById('train-boarding-date');
  const resultCard = document.getElementById('boarding-arp-card');
  if (!selectEl || !dateInput || !resultCard) return;

  const selectedOption = selectEl.options[selectEl.selectedIndex];
  if (!selectedOption) return;

  const stationCode = selectedOption.value;
  const stationName = selectedOption.dataset.name || stationCode;
  const stationDay = parseInt(selectedOption.dataset.day || '1', 10);
  const departureTime = selectedOption.dataset.dep || 'Scheduled Departure';
  const boardingDateStr = dateInput.value;

  if (!boardingDateStr) {
    resultCard.innerHTML = `<p class="text-xs text-muted">Please select a valid boarding date.</p>`;
    return;
  }

  const originStn = trainData.source_station || trainData.stations?.[0] || { station_name: 'Origin Station', station_code: '' };

  const arp = ARPCalc.computeBoardingARP(boardingDateStr, stationDay);
  if (!arp) return;

  // Google Calendar URL generator
  const arpYear = arp.arpDate.getFullYear();
  const arpMonth = String(arp.arpDate.getMonth() + 1).padStart(2, '0');
  const arpDay = String(arp.arpDate.getDate()).padStart(2, '0');
  const calStart = `${arpYear}${arpMonth}${arpDay}T022500Z`;
  const calEnd   = `${arpYear}${arpMonth}${arpDay}T024500Z`;
  const calTitle = encodeURIComponent(`IRCTC Booking Opens: Train ${trainData.train_number} (${stationCode})`);
  const calDesc  = encodeURIComponent(`Indian Railways ARP 60-Day booking opens today at 8:00 AM IST for Train ${trainData.train_number} (${trainData.train_name}). Boarding at ${stationName} on ${arp.boardingDateStr}. Train origin departs on ${arp.originDateStr}.`);
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${calStart}/${calEnd}&details=${calDesc}`;

  const countdownText = arp.isOpened
    ? `<span class="badge badge-success" style="font-size:12px;padding:6px 12px;">🟢 BOOKING OPEN NOW</span>`
    : `<span class="badge badge-warning" style="font-size:12px;padding:6px 12px;">⏳ Opens in ${ARPCalc.formatCountdownShort(arp.countdown)}</span>`;

  resultCard.innerHTML = `
    <!-- Multi-Day Origin Alert (Crucial for Avoiding Wrong Date) -->
    ${arp.isMultiDay ? `
      <div class="glass-card" style="background:rgba(245,158,11,0.12);border:1.5px solid rgba(245,158,11,0.4);border-radius:16px;padding:16px;">
        <div class="card-content">
          <div class="row row-gap-sm mb-2" style="align-items:center;">
            <span style="font-size:18px;">⚠️</span>
            <span class="text-xs font-bold uppercase tracking-wide" style="color:#fbbf24;">Indian Railways ARP Multi-Day Departure Rule</span>
          </div>
          <p class="text-xs text-primary mb-2 leading-relaxed">
            You are boarding at <strong>${escapeHtml(stationName)} (${escapeHtml(stationCode)})</strong> on <strong class="text-accent">Day ${arp.stationDay}</strong> of the train's journey (${arp.boardingDateShort}).
          </p>
          <div style="background:rgba(0,0,0,0.25);border-radius:10px;padding:10px 12px;" class="mb-2">
            <p class="text-xs" style="color:#fde68a;">
              🚂 Train <strong>${trainData.train_number}</strong> departs from origin (<strong>${escapeHtml(originStn.station_name)}</strong>) on <strong style="text-decoration:underline;">${arp.originDateShort}</strong> (<span class="font-bold text-accent">${arp.offsetDays} day(s) earlier</span>).
            </p>
          </div>
          <p class="text-xs text-muted leading-relaxed">
            <strong>Why this matters:</strong> Indian Railways 60-day reservation opens <strong>60 days before the train departs from its originating station</strong>, NOT your intermediate boarding date!
          </p>
        </div>
      </div>
    ` : `
      <div class="glass-card" style="background:rgba(52,211,153,0.1);border:1.5px solid rgba(52,211,153,0.3);border-radius:16px;padding:14px;">
        <div class="card-content">
          <p class="text-xs text-primary">
            ✅ <strong>Day 1 Origin Boarding:</strong> Your boarding station is the train starting point. Train departs on your boarding date (<strong>${arp.boardingDateShort}</strong>).
          </p>
        </div>
      </div>
    `}

    <!-- Main ARP Booking Card -->
    <div class="glass-card" style="background:var(--accent-glass);border:1.5px solid var(--accent-dim);border-radius:18px;padding:18px;">
      <div class="card-content">
        <div class="row row-between mb-3" style="align-items:flex-start;">
          <div>
            <span class="text-xs text-muted uppercase tracking-wide font-bold">Ticket Booking Opens On (ARP 60 Days)</span>
            <p class="text-xl font-black text-accent tracking-tight mt-1" id="calculated-arp-date">${arp.arpDateFull}</p>
            <p class="text-xs font-semibold text-secondary">at 8:00 AM IST (IRCTC Online & PRS Counters)</p>
          </div>
          <div>
            ${countdownText}
          </div>
        </div>

        <!-- Live Countdown Timer -->
        ${!arp.isOpened ? `
          <div class="glass-card mb-3" style="padding:14px;background:rgba(0,0,0,0.3);border-radius:12px;">
            <p class="text-xs text-muted text-center uppercase tracking-wide font-semibold mb-2">Countdown to 8:00 AM Opening</p>
            <div id="train-live-countdown">${UI.renderCountdown(arp.countdown)}</div>
          </div>
        ` : `
          <div class="glass-card mb-3" style="padding:12px;background:rgba(16,185,129,0.15);border-radius:12px;text-align:center;">
            <p class="text-xs text-success font-bold">🎉 The 60-day reservation window for this train is currently active!</p>
          </div>
        `}

        <!-- Journey Summary Grid -->
        <div class="grid-2 mt-3 row-gap-md" style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;">
          <div>
            <p class="text-xs text-muted font-semibold">Train Origin Departs (Day 1)</p>
            <p class="text-sm font-bold text-primary">${arp.originDateShort}</p>
            <p class="text-xs text-muted">${escapeHtml(originStn.station_name)}</p>
          </div>
          <div>
            <p class="text-xs text-muted font-semibold">Your Boarding (Day ${arp.stationDay})</p>
            <p class="text-sm font-bold text-accent">${arp.boardingDateShort}</p>
            <p class="text-xs text-muted">${escapeHtml(stationName)} (${departureTime})</p>
          </div>
          <div>
            <p class="text-xs text-muted font-semibold">Tatkal AC Opens (10 AM)</p>
            <p class="text-xs font-bold text-primary">${arp.tatkalDateStr} @ 10:00 AM</p>
          </div>
          <div>
            <p class="text-xs text-muted font-semibold">Tatkal Sleeper Opens (11 AM)</p>
            <p class="text-xs font-bold text-primary">${arp.tatkalDateStr} @ 11:00 AM</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="stack stack-sm mt-4">
          <div class="grid-2 row-gap-sm">
            <button type="button" class="btn btn-primary btn-sm text-center" onclick="saveTrainARPEvent('${trainData.train_number}', '${escapeHtml(trainData.train_name)}', '${stationCode}', '${escapeHtml(stationName)}', '${boardingDateStr}', '${arp.originDate.toISOString().split('T')[0]}', '${arp.arpDate.toISOString().split('T')[0]}')">
              <span>📌 Save as My Event</span>
            </button>
            <a href="${gCalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm text-center" style="display:flex;align-items:center;justify-content:center;text-decoration:none;">
              <span>📅 Google Calendar</span>
            </a>
          </div>
          <a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm text-center w-full" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;">
            <span>🎫 Book Official on IRCTC Portal →</span>
          </a>
          <div class="row row-between mt-2 pt-2" style="border-top:1px dashed rgba(255,255,255,0.1);font-size:11px;">
            <span class="text-muted">Official Verification:</span>
            <div class="row row-gap-sm">
              <a href="https://enquiry.indianrail.gov.in/mntes/q?opt=TrainServiceSchedule&subOpt=main&trainNo=${trainData.train_number}" target="_blank" rel="noopener noreferrer" class="text-accent" style="text-decoration:underline;">
                CRIS NTES Schedule ↗
              </a>
              <span class="text-muted">•</span>
              <a href="https://www.irctc.co.in/nget/booking/check-train-schedule" target="_blank" rel="noopener noreferrer" class="text-accent" style="text-decoration:underline;">
                IRCTC Timetable ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Start live countdown ticking
  if (!arp.isOpened) {
    if (AppState.arpCountdownTimer) clearInterval(AppState.arpCountdownTimer);
    AppState.arpCountdownTimer = setInterval(() => {
      const cdEl = document.getElementById('train-live-countdown');
      if (!cdEl) {
        clearInterval(AppState.arpCountdownTimer);
        return;
      }
      const updatedCd = ARPCalc.getCountdownToARP(arp.originDate);
      cdEl.innerHTML = UI.renderCountdown(updatedCd);
    }, 1000);
  }
}

/**
 * Renders complete station route timeline.
 */
function renderTrainFullRoute(stations, selectedCode) {
  const container = document.getElementById('train-full-route');
  const countEl = document.getElementById('route-stops-count');
  if (!container) return;
  if (countEl) countEl.textContent = stations.length;

  container.innerHTML = stations.map((stn, idx) => {
    const isSelected = stn.station_code === selectedCode;
    return `
      <div class="glass-card row row-between" style="padding:10px 14px;border-radius:12px;border:${isSelected ? '1.5px solid var(--accent)' : '1px solid var(--glass-border)'};background:${isSelected ? 'var(--accent-glass)' : 'transparent'};cursor:pointer;" onclick="selectRouteStation('${stn.station_code}')">
        <div class="row row-gap-sm" style="align-items:center;">
          <span class="font-mono text-xs text-muted" style="width:24px;">${idx + 1}</span>
          <div>
            <div class="row row-gap-xs" style="align-items:center;">
              <span class="font-bold text-sm text-primary">${escapeHtml(stn.station_name)}</span>
              <span class="font-mono text-xs text-accent font-bold">(${escapeHtml(stn.station_code)})</span>
              <span class="badge" style="font-size:9px;padding:2px 6px;background:rgba(255,255,255,0.1);">Day ${stn.day}</span>
            </div>
            <p class="text-xs text-muted">
              ${stn.arrival_time ? `Arr: ${stn.arrival_time}` : 'Starts'} • ${stn.departure_time ? `Dep: ${stn.departure_time}` : 'Ends'} • Halt: ${stn.halt_time || '0m'} • ${stn.distance_km} km
            </p>
          </div>
        </div>
        <div>
          ${isSelected ? '<span class="badge badge-accent">Selected</span>' : '<button type="button" class="btn btn-glass btn-sm" style="padding:4px 8px;font-size:11px;">Board Here</button>'}
        </div>
      </div>
    `;
  }).join('');
}

window.selectRouteStation = function(code) {
  const selectEl = document.getElementById('train-boarding-select');
  if (selectEl) {
    selectEl.value = code;
    calculateAndRenderTrainARP();
    renderTrainFullRoute(AppState.currentTrainSchedule?.stations || [], code);
  }
};

async function saveTrainARPEvent(trainNum, trainName, stationCode, stationName, boardingDate, originDate, arpDate) {
  try {
    const event = {
      name: `${trainNum} ${trainName} (${stationCode})`,
      date: boardingDate,
      trainNumber: trainNum,
      trainName: trainName,
      fromStation: stationCode,
      boardingStation: `${stationName} (${stationCode})`,
      notes: `Origin departs on ${originDate}. 60-day ARP opens on ${arpDate} at 8:00 AM IST.`
    };
    await EventsManager.addEvent(event);
    UI.toast(`Saved to My Events! ARP opens on ${arpDate} at 8:00 AM IST.`, 'success');
    renderDashboard();
    renderCalendar();
  } catch (err) {
    console.error('Failed to save event:', err);
    UI.toast('Event saved locally!', 'success');
  }
}
window.saveTrainARPEvent = saveTrainARPEvent;

/**
 * Live PNR Status Checker without any external redirects.
 */
async function checkPNR() {
  const pnrInput = document.getElementById('pnr-input');
  const pnr = pnrInput?.value.trim();
  if (!pnr || pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
    UI.toast('Please enter a valid 10-digit PNR number', 'warning');
    return;
  }

  const resultEl = document.getElementById('pnr-result');
  UI.loader(resultEl, 'Checking live PNR status from railway PRS database...');
  resultEl.classList.remove('hidden');

  const res = await TRAIN_API.getPNRStatus(pnr);

  if (!res.success || !res.data) {
    resultEl.innerHTML = `
      <div class="glass-card" style="border-left:3px solid #ef4444;padding:16px;">
        <div class="row row-gap-sm mb-1">
          <span>⚠️</span>
          <p class="text-sm font-bold text-danger">PNR Status Unavailable</p>
        </div>
        <p class="text-xs text-secondary mb-2">${escapeHtml(res.message || 'PNR details could not be retrieved.')}</p>
        <p class="text-xs text-muted">Note: Flushed PNRs (for past journeys) are purged from IRCTC PRS database after a few days.</p>
      </div>
    `;
    return;
  }

  const p = res.data;
  const trainNo = p.TrainNo || '—';
  const trainName = p.TrainName || 'Indian Railways';
  const doj = p.Doj || p.SourceDoj || '—';
  const from = p.BoardingStationName || p.BoardingPoint || p.From || '—';
  const to = p.ReservationUptoName || p.ReservationUpto || p.To || '—';
  const cls = p.Class || '—';
  const quota = p.Quota || 'GN';
  const chartPrepared = !!p.ChartPrepared;
  const passengers = Array.isArray(p.PassengerStatus) ? p.PassengerStatus : [];

  resultEl.innerHTML = `
    <div class="glass-card stack stack-sm" style="padding:16px;border-radius:16px;border:1.5px solid var(--accent-dim);">
      <!-- PNR Header -->
      <div class="row row-between mb-2">
        <div>
          <span class="text-xs text-muted uppercase font-bold">PNR: <span class="text-accent font-mono text-base font-bold">${p.Pnr || pnr}</span></span>
          <h3 class="text-base font-bold text-primary mt-1">${trainNo} — ${escapeHtml(trainName)}</h3>
        </div>
        <div>
          ${chartPrepared
            ? '<span class="badge badge-success">🟢 Chart Prepared</span>'
            : '<span class="badge badge-warning">🟡 Chart Not Prepared</span>'}
        </div>
      </div>

      <!-- Route & Journey Info -->
      <div class="grid-2 row-gap-sm mb-3" style="background:rgba(0,0,0,0.25);border-radius:12px;padding:12px;">
        <div>
          <p class="text-xs text-muted">From (Boarding)</p>
          <p class="text-xs font-bold text-primary">${escapeHtml(from)}</p>
          <p class="text-xs text-muted">${p.DepartureTime ? `Dep: ${p.DepartureTime}` : ''}</p>
        </div>
        <div>
          <p class="text-xs text-muted">To (Destination)</p>
          <p class="text-xs font-bold text-primary">${escapeHtml(to)}</p>
          <p class="text-xs text-muted">${p.ArrivalTime ? `Arr: ${p.ArrivalTime}` : ''}</p>
        </div>
        <div>
          <p class="text-xs text-muted">Journey Date</p>
          <p class="text-xs font-bold text-accent">${doj}</p>
        </div>
        <div>
          <p class="text-xs text-muted">Class & Quota</p>
          <p class="text-xs font-bold text-primary">${cls} • ${quota}</p>
        </div>
      </div>

      <!-- Passenger Status Table -->
      <div>
        <p class="text-xs text-muted uppercase font-bold mb-2">Passenger Berth / Seat Status (${passengers.length || 1})</p>
        <div class="stack stack-xs">
          ${passengers.length ? passengers.map((pass, i) => `
            <div class="glass-card row row-between" style="padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.03);">
              <div>
                <span class="text-xs font-bold text-primary">Passenger ${pass.Number || (i + 1)}</span>
                <p class="text-xs text-muted">Booking: <span class="font-mono text-secondary">${pass.BookingStatus || '—'}</span></p>
              </div>
              <div class="text-right">
                <span class="badge ${pass.CurrentStatus?.includes('CNF') || pass.CurrentStatus?.includes('CONFIRM') ? 'badge-success' : 'badge-warning'}">
                  ${pass.CurrentStatus || '—'}
                </span>
                ${pass.Coach ? `<p class="text-xs font-mono font-bold text-accent mt-1">${pass.Coach} / ${pass.Berth || '—'} ${pass.BerthType ? `(${pass.BerthType})` : ''}</p>` : ''}
              </div>
            </div>
          `).join('') : `
            <div class="glass-card" style="padding:10px 12px;border-radius:10px;">
              <p class="text-xs text-secondary">${escapeHtml(p.InformationMessage || 'Status: Confirmed')}</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════
   TAB 3: CALENDAR
   ═══════════════════════════════════════════════ */

function renderCalendar() {
  const year  = AppState.calendarYear;
  const month = AppState.calendarMonth;
  setupCalendarSelectors(year, month);
  
  if (AppState.calendarMode === 'month') {
    document.getElementById('month-view-container')?.classList.remove('hidden');
    document.getElementById('multi-month-container')?.classList.add('hidden');
    document.getElementById('cal-nav-bar')?.classList.remove('hidden');
    renderCalendarGrid(year, month);
  } else if (AppState.calendarMode === '6m') {
    document.getElementById('month-view-container')?.classList.add('hidden');
    document.getElementById('multi-month-container')?.classList.remove('hidden');
    document.getElementById('cal-nav-bar')?.classList.remove('hidden');
    renderMultiMonthCalendar(year, month, 6);
  } else if (AppState.calendarMode === 'year') {
    document.getElementById('month-view-container')?.classList.add('hidden');
    document.getElementById('multi-month-container')?.classList.remove('hidden');
    document.getElementById('cal-nav-bar')?.classList.remove('hidden');
    renderMultiMonthCalendar(year, 1, 12);
  }

  renderEventsListForMode();
  setupCalendarNav();
  setupAddEventButton();
}

function setCalendarMode(mode) {
  AppState.calendarMode = mode;
  ['month', '6m', 'year'].forEach(m => {
    document.getElementById(`cal-mode-${m}`)?.classList.toggle('selected', m === mode);
  });
  renderCalendar();
}

function setupCalendarSelectors(currYear, currMonth) {
  const monthSelect = document.getElementById('cal-month-select');
  const yearSelect = document.getElementById('cal-year-select');
  if (!monthSelect || !yearSelect) return;

  const monthNames = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];

  if (monthSelect.children.length === 0) {
    monthSelect.innerHTML = monthNames.map((m, idx) => 
      `<option value="${idx + 1}">${m}</option>`
    ).join('');

    monthSelect.addEventListener('change', () => {
      AppState.calendarMonth = parseInt(monthSelect.value);
      renderCalendar();
    });
  }
  monthSelect.value = currMonth;

  if (yearSelect.children.length === 0) {
    const years = [2025, 2026, 2027, 2028];
    yearSelect.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('');

    yearSelect.addEventListener('change', () => {
      AppState.calendarYear = parseInt(yearSelect.value);
      renderCalendar();
    });
  }
  yearSelect.value = currYear;
}

function renderCalendarGrid(year, month) {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const today = new Date().toISOString().split('T')[0];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun

  const festivals = FestivalsUtil.getSpecialDays(year, month);
  const userEvents = EventsManager.getEventsForMonth(year, month);
  const userEventDates = new Set(userEvents.map(e => e.date));

  let html = '';

  for (let i = 0; i < firstDayOfWeek; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isTodayD = dateStr === today;
    const isSundayD = FestivalsUtil.isSunday(dateStr);
    const isFridayD = FestivalsUtil.isFriday(dateStr);
    const isFest = !!festivals[dateStr];
    const hasUserEvent = userEventDates.has(dateStr);
    const isSelected = dateStr === AppState.selectedCalDate;

    const classes = [
      'cal-day',
      isTodayD ? 'today' : '',
      isSelected ? 'selected' : '',
      isSundayD ? 'sunday' : '',
      isFridayD ? 'friday' : '',
      isFest ? 'holiday' : '',
      hasUserEvent ? 'has-event' : '',
    ].filter(Boolean).join(' ');

    const festInfo = festivals[dateStr];
    const festEmoji = festInfo ? festInfo[0].emoji : (isSundayD ? '🔴' : (isFridayD ? '🟡' : ''));

    html += `
      <div class="${classes}" data-date="${dateStr}" onclick="onCalDayClick('${dateStr}')">
        <span>${d}</span>
        ${festEmoji ? `<span style="font-size:8px;line-height:1;">${festEmoji}</span>` : ''}
      </div>`;
  }

  grid.innerHTML = html;
}

function renderMultiMonthCalendar(startYear, startMonth, monthCount) {
  const container = document.getElementById('multi-month-container');
  if (!container) return;

  const monthNames = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  const today = new Date().toISOString().split('T')[0];

  let html = '';
  let y = startYear;
  let m = startMonth;

  for (let i = 0; i < monthCount; i++) {
    const daysInMonth = new Date(y, m, 0).getDate();
    const firstDayOfWeek = new Date(y, m - 1, 1).getDay();

    const festivals = FestivalsUtil.getSpecialDays(y, m);
    const userEvents = EventsManager.getEventsForMonth(y, m);
    const userEventDates = new Set(userEvents.map(e => e.date));

    let daysHtml = '';
    for (let k = 0; k < firstDayOfWeek; k++) {
      daysHtml += `<div class="cal-day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isTodayD = dateStr === today;
      const isSundayD = FestivalsUtil.isSunday(dateStr);
      const isFridayD = FestivalsUtil.isFriday(dateStr);
      const isFest = !!festivals[dateStr];
      const hasUserEvent = userEventDates.has(dateStr);
      const isSelected = dateStr === AppState.selectedCalDate;

      const classes = [
        'cal-day',
        isTodayD ? 'today' : '',
        isSelected ? 'selected' : '',
        isSundayD ? 'sunday' : '',
        isFridayD ? 'friday' : '',
        isFest ? 'holiday' : '',
        hasUserEvent ? 'has-event' : '',
      ].filter(Boolean).join(' ');

      const festInfo = festivals[dateStr];
      const festEmoji = festInfo ? festInfo[0].emoji : (isSundayD ? '🔴' : (isFridayD ? '🟡' : ''));

      daysHtml += `
        <div class="${classes}" data-date="${dateStr}" onclick="onCalDayClick('${dateStr}')">
          <span>${d}</span>
          ${festEmoji ? `<span style="font-size:7px;line-height:1;">${festEmoji}</span>` : ''}
        </div>`;
    }

    html += `
      <div class="glass-card" style="padding:14px;border-radius:14px;">
        <div class="row row-between mb-2">
          <span class="font-bold text-accent text-sm">${monthNames[m - 1]} ${y}</span>
          <button class="btn btn-glass btn-sm" style="padding:3px 8px;font-size:11px;" onclick="jumpToSingleMonth(${y}, ${m})">View Month</button>
        </div>
        <div class="calendar-grid mb-1" style="font-size:10px;">
          <div class="cal-day-header">S</div><div class="cal-day-header">M</div><div class="cal-day-header">T</div>
          <div class="cal-day-header">W</div><div class="cal-day-header">T</div><div class="cal-day-header">F</div><div class="cal-day-header">S</div>
        </div>
        <div class="calendar-grid">${daysHtml}</div>
      </div>`;

    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }

  container.innerHTML = html;
}

function jumpToSingleMonth(year, month) {
  AppState.calendarYear = year;
  AppState.calendarMonth = month;
  setCalendarMode('month');
}

function renderEventsListForMode() {
  const container = document.getElementById('month-events-list');
  const titleEl = document.getElementById('events-section-title');
  const subtitleEl = document.getElementById('events-range-subtitle');
  if (!container) return;

  let festivals = [];
  let userEvents = [];

  const currYear = AppState.calendarYear;
  const currMonth = AppState.calendarMonth;

  if (AppState.calendarMode === 'month') {
    festivals = FestivalsUtil.getEventsForMonth(currYear, currMonth);
    userEvents = EventsManager.getEventsForMonth(currYear, currMonth);
    if (titleEl) titleEl.textContent = `📌 Events for ${document.getElementById('cal-month-select')?.selectedOptions[0]?.text || ''} ${currYear}`;
    if (subtitleEl) subtitleEl.textContent = 'Selected Month';
  } else if (AppState.calendarMode === '6m') {
    const today = new Date();
    festivals = FestivalsUtil.getEventsForNextNMonths(today, 6);
    userEvents = EventsManager.getAllEvents().filter(e => {
      const d = new Date(e.date);
      const sixMonthsOut = new Date(today);
      sixMonthsOut.setMonth(sixMonthsOut.getMonth() + 6);
      return d >= today && d <= sixMonthsOut;
    });
    if (titleEl) titleEl.textContent = `📌 Upcoming Festivals & Public Holidays`;
    if (subtitleEl) subtitleEl.textContent = 'Next 6 Months Auto-Timeline';
  } else if (AppState.calendarMode === 'year') {
    festivals = FestivalsUtil.getEventsForYear(currYear);
    userEvents = EventsManager.getAllEvents().filter(e => e.date && e.date.startsWith(String(currYear)));
    if (titleEl) titleEl.textContent = `📌 Full Year Calendar: ${currYear}`;
    if (subtitleEl) subtitleEl.textContent = `All Holidays & Festivals in ${currYear}`;
  }

  const all = [
    ...festivals.map(f => ({ ...f, type: f.type, source: 'festival' })),
    ...userEvents.map(e => ({ ...e, source: 'user' }))
  ].sort((a,b) => a.date.localeCompare(b.date));

  if (!all.length) {
    UI.empty(container, '🌸', 'No events in this period', 'No public holidays or saved events found');
    return;
  }

  container.innerHTML = all.map(e => {
    const arp = ARPCalc.computeARP(e.date);
    return `
      <div class="glass-card event-card ${e.source === 'festival' ? e.type : 'user-event'}" style="padding:12px 14px;border-radius:12px;margin-bottom:8px;">
        <div class="card-content">
          <div class="row row-between">
            <div class="row row-gap-sm">
              <span style="font-size:20px;">${e.emoji || '📌'}</span>
              <div>
                <p class="text-sm font-bold text-primary">${e.name}</p>
                <p class="text-xs text-muted">${formatDateDisplay(e.date)}</p>
              </div>
            </div>
            ${e.source === 'festival'
              ? `<span class="badge badge-warning" style="font-size:10px;">${e.type}</span>`
              : `<span class="badge badge-accent" style="font-size:10px;">My Event</span>`}
          </div>
          ${arp ? `
            <div class="row row-between mt-2 pt-2" style="border-top:1px solid var(--glass-border);font-size:11px;">
              <span class="text-muted">ARP Opens: <strong class="text-accent">${arp.arpDateStr}</strong></span>
              <span class="badge ${arp.isOpened ? 'badge-success' : 'badge-warning'}" style="font-size:9px;">
                ${arp.isOpened ? '🟢 Open Now' : ARPCalc.formatCountdownShort(arp.countdown)}
              </span>
            </div>` : ''}
        </div>
      </div>`;
  }).join('');
}

function onCalDayClick(dateStr) {
  AppState.selectedCalDate = dateStr;
  renderCalendarGrid(AppState.calendarYear, AppState.calendarMonth);
  renderDateDetails(dateStr);
  document.getElementById('cal-date-details')?.classList.remove('hidden');
}

function renderDateDetails(dateStr) {
  const el = document.getElementById('cal-date-details');
  if (!el) return;

  const arpInfo = ARPCalc.computeARP(dateStr);
  const festivals = FestivalsUtil.getEventsForDate(dateStr);
  const userEvents = EventsManager.getEventsForDate(dateStr);
  const isSun = FestivalsUtil.isSunday(dateStr);
  const isFri = FestivalsUtil.isFriday(dateStr);

  el.innerHTML = `
    <div class="glass-card stack stack-md">
      <div class="card-content">
        <!-- Date heading -->
        <div class="row row-between mb-3">
          <div>
            <p class="text-xl font-bold text-primary">${formatDateDisplay(dateStr)}</p>
            ${isSun ? '<span class="badge badge-error ml-0 mt-1">Sunday 🔴</span>' : ''}
            ${isFri ? '<span class="badge badge-warning ml-0 mt-1">Friday 🟡</span>' : ''}
          </div>
          <button class="btn btn-primary btn-sm" onclick="openAddEventModal('${dateStr}')">+ Add Event</button>
        </div>

        <!-- ARP Info -->
        ${arpInfo ? `
          <div class="glass-card mb-3" style="border-left:3px solid var(--accent);border-radius:12px;padding:12px;">
            <div class="card-content">
              <p class="text-xs text-muted uppercase tracking-wide font-semibold">ARP Window for this date</p>
              <p class="text-base font-bold text-accent mt-1">📅 ${arpInfo.arpDateFull}</p>
              <p class="text-xs text-muted">at 8:00 AM IST</p>
              <div class="row row-between mt-2">
                <div>
                  <p class="text-xs text-muted">Journey ${arpInfo.daysFromNow > 0 ? 'in ' + arpInfo.daysFromNow + ' days' : 'today!'}</p>
                </div>
                ${arpInfo.isOpened
                  ? '<span class="badge badge-success">✅ Booking Open</span>'
                  : `<span class="badge badge-warning">${ARPCalc.formatCountdownShort(arpInfo.countdown)} to open</span>`}
              </div>
            </div>
          </div>` : ''}

        <!-- Festivals -->
        ${festivals.length ? `
          <p class="text-xs text-muted uppercase tracking-wide font-semibold mb-2">Festivals / Holidays</p>
          ${festivals.map(f => `
            <div class="event-card festival mb-2">
              <div class="row row-gap-sm">
                <span style="font-size:20px;">${f.emoji}</span>
                <div>
                  <p class="text-sm font-bold text-primary">${f.name}</p>
                  <span class="badge badge-warning mt-1" style="font-size:10px;">${f.type}</span>
                </div>
              </div>
            </div>`).join('')}` : ''}

        <!-- User Events -->
        ${userEvents.length ? `
          <p class="text-xs text-muted uppercase tracking-wide font-semibold mb-2 mt-2">My Events</p>
          ${userEvents.map(e => UI.renderEventCard(e, async (id) => {
            if (confirm('Delete this event?')) {
              await EventsManager.deleteEvent(id);
              renderCalendar();
              renderDateDetails(dateStr);
              renderDashboard();
              UI.toast('Event deleted', 'success');
            }
          })).join('')}` : ''}

        ${!festivals.length && !userEvents.length && !isSun && !isFri
          ? `<p class="text-sm text-muted text-center py-2">No special events on this date</p>` : ''}
      </div>
    </div>`;
}

function setupCalendarNav() {
  if (document.getElementById('cal-prev')?.dataset.setup) return;
  document.getElementById('cal-prev').dataset.setup = '1';

  document.getElementById('cal-prev')?.addEventListener('click', () => {
    if (AppState.calendarMonth === 1) {
      AppState.calendarMonth = 12;
      AppState.calendarYear--;
    } else {
      AppState.calendarMonth--;
    }
    renderCalendar();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    if (AppState.calendarMonth === 12) {
      AppState.calendarMonth = 1;
      AppState.calendarYear++;
    } else {
      AppState.calendarMonth++;
    }
    renderCalendar();
  });

  document.getElementById('cal-today')?.addEventListener('click', () => {
    const now = new Date();
    AppState.calendarYear = now.getFullYear();
    AppState.calendarMonth = now.getMonth() + 1;
    renderCalendar();
  });
}

function setupAddEventButton() {
  const btn = document.getElementById('add-event-fab');
  btn?.addEventListener('click', () => openAddEventModal(AppState.selectedCalDate));
}

/* ── Add Event Modal ── */
function openAddEventModal(prefillDate) {
  UI.openModal('add-event-modal');
  if (prefillDate) {
    document.getElementById('event-date').value = prefillDate;
  }
  // Setup train search in modal
  setupEventTrainSearch();
  setupEventFormPreview();
}

function prefillEventFromTrain(trainNum, trainName, from, to, date) {
  UI.closeModal('train-detail-modal');
  setTimeout(() => {
    UI.openModal('add-event-modal');
    document.getElementById('event-date').value = date;
    document.getElementById('event-train-number').value = trainNum;
    document.getElementById('event-train-name').value = trainName;
    document.getElementById('event-from-station').value = from;
    document.getElementById('event-to-station').value = to;
    document.getElementById('event-boarding-station').value = from;
    document.getElementById('event-name').value = `Train journey - ${trainName}`;
    updateEventPreview();
    setupEventTrainSearch();
  }, 300);
}

function setupEventTrainSearch() {
  const trainInput = document.getElementById('event-train-number');
  const suggBox    = document.getElementById('event-train-suggestions');
  if (!trainInput || trainInput.dataset.setup) return;
  trainInput.dataset.setup = '1';

  trainInput.addEventListener('input', () => {
    const q = trainInput.value.trim().toUpperCase();
    if (!q || q.length < 2) { suggBox.classList.add('hidden'); return; }
    const matches = POPULAR_TRAINS.filter(t =>
      t.number.includes(q) || t.name.toUpperCase().includes(q)
    ).slice(0, 5);
    if (!matches.length) { suggBox.classList.add('hidden'); return; }
    suggBox.innerHTML = matches.map(t => `
      <div class="suggestion-item" data-num="${t.number}" data-name="${t.name}"
           data-from="${t.from}" data-to="${t.to}">
        <span class="font-mono font-bold text-accent text-sm">${t.number}</span>
        <span class="text-sm text-secondary ml-2">${t.name}</span>
      </div>`).join('');
    suggBox.classList.remove('hidden');
  });

  suggBox.addEventListener('click', (e) => {
    const item = e.target.closest('[data-num]');
    if (!item) return;
    document.getElementById('event-train-number').value = item.dataset.num;
    document.getElementById('event-train-name').value = item.dataset.name;
    document.getElementById('event-from-station').value = item.dataset.from;
    document.getElementById('event-to-station').value = item.dataset.to;
    document.getElementById('event-boarding-station').value = item.dataset.from;
    if (!document.getElementById('event-name').value) {
      document.getElementById('event-name').value = `Train - ${item.dataset.name}`;
    }
    suggBox.classList.add('hidden');
    updateEventPreview();
  });
}

function setupEventFormPreview() {
  ['event-date','event-train-number','event-name'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateEventPreview);
    document.getElementById(id)?.addEventListener('change', updateEventPreview);
  });
}

function updateEventPreview() {
  const date = document.getElementById('event-date')?.value;
  const trainNum = document.getElementById('event-train-number')?.value;
  const previewEl = document.getElementById('event-arp-preview');
  if (!previewEl) return;
  if (!date) { previewEl.classList.add('hidden'); return; }

  const arp = ARPCalc.computeARP(date);
  if (!arp) { previewEl.classList.add('hidden'); return; }

  previewEl.classList.remove('hidden');
  previewEl.innerHTML = `
    <div class="glass-card" style="border:1.5px solid var(--accent-dim);border-radius:12px;padding:12px;">
      <div class="card-content">
        <p class="text-xs text-muted uppercase font-semibold tracking-wide mb-2">📋 Event Preview</p>
        <div class="row row-between">
          <div>
            <p class="text-xs text-muted">Journey Date</p>
            <p class="text-sm font-bold">${formatDateDisplay(date)}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-muted">ARP Opens</p>
            <p class="text-sm font-bold text-accent">${arp.arpDateStr}</p>
            <p class="text-xs text-muted">at 8:00 AM IST</p>
          </div>
        </div>
        ${trainNum ? `
          <div class="mt-2 row row-gap-sm">
            <span class="train-number-badge">${trainNum}</span>
            <span class="text-xs text-muted">${document.getElementById('event-train-name')?.value || ''}</span>
          </div>` : ''}
        <div class="mt-2">
          ${arp.isOpened
            ? '<span class="badge badge-success">✅ Booking Already Open!</span>'
            : `<span class="badge badge-warning">⏳ ${ARPCalc.formatCountdownVerbose(arp.countdown)}</span>`}
        </div>
      </div>
    </div>`;
}

/* ── Save Event Form ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-event-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const event = buildUserEvent({
      name: document.getElementById('event-name').value.trim(),
      date: document.getElementById('event-date').value,
      trainNumber: document.getElementById('event-train-number').value.trim(),
      trainName: document.getElementById('event-train-name').value.trim(),
      fromStation: document.getElementById('event-from-station').value.trim().toUpperCase(),
      toStation: document.getElementById('event-to-station').value.trim().toUpperCase(),
      boardingStation: document.getElementById('event-boarding-station').value.trim().toUpperCase(),
      notes: document.getElementById('event-notes').value.trim(),
    });

    const { result } = await EventsManager.addEvent(event);
    submitBtn.disabled = false;
    submitBtn.textContent = '💾 Save Event';

    UI.closeModal('add-event-modal');
    UI.toast('Event saved! 🎉', 'success');
    e.target.reset();
    document.getElementById('event-arp-preview')?.classList.add('hidden');

    // Refresh UI
    renderCalendar();
    if (AppState.selectedCalDate === event.date) renderDateDetails(event.date);
    renderDashboard();
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) UI.closeModal(overlay.id);
    });
  });
});

/* ── Settings Modal ── */
function setupSettingsModal() {
  // Load existing values
  const cfg = FirebaseManager.getConfig();
  if (cfg) {
    document.getElementById('firebase-api-key')?.setAttribute('value', cfg.apiKey || '');
    document.getElementById('firebase-project-id')?.setAttribute('value', cfg.projectId || '');
    document.getElementById('firebase-app-id')?.setAttribute('value', cfg.appId || '');
  }

  const rapidKey = localStorage.getItem('rapidapi_key') || '';
  if (rapidKey) {
    document.getElementById('rapidapi-key')?.setAttribute('value', rapidKey);
  }

  document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rapidKey = document.getElementById('rapidapi-key')?.value?.trim();
    if (rapidKey) localStorage.setItem('rapidapi_key', rapidKey);

    const fbApiKey = document.getElementById('firebase-api-key')?.value?.trim();
    const fbProjectId = document.getElementById('firebase-project-id')?.value?.trim();
    const fbAppId = document.getElementById('firebase-app-id')?.value?.trim();
    const fbMsgId = document.getElementById('firebase-messaging-id')?.value?.trim();

    if (fbApiKey && fbProjectId) {
      FirebaseManager.saveConfig({
        apiKey: fbApiKey,
        authDomain: `${fbProjectId}.firebaseapp.com`,
        projectId: fbProjectId,
        storageBucket: `${fbProjectId}.appspot.com`,
        messagingSenderId: fbMsgId,
        appId: fbAppId,
      });
      await FirebaseManager.init();
      UI.toast('Firebase connected! ✅', 'success');
    }

    if (rapidKey) UI.toast('Settings saved! ✅', 'success');
    UI.closeModal('settings-modal');
  });
}

/* ── Expose globals needed by inline handlers ── */
window.onCalDayClick = onCalDayClick;
window.openAddEventModal = openAddEventModal;
window.prefillEventFromTrain = prefillEventFromTrain;
window.updateEventPreview = updateEventPreview;
window.switchTab = switchTab;
window.fetchAndDisplayTrainSchedule = fetchAndDisplayTrainSchedule;
window.calculateAndRenderTrainARP = calculateAndRenderTrainARP;
window.renderTrainFullRoute = renderTrainFullRoute;
window.selectRouteStation = selectRouteStation;
window.saveTrainARPEvent = saveTrainARPEvent;
window.checkPNR = checkPNR;
window.setCalendarMode = setCalendarMode;
window.jumpToSingleMonth = jumpToSingleMonth;
