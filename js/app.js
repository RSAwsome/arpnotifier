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

function setupTrainTab() {
  // Form setup
  const trainForm = document.getElementById('train-search-form');
  if (trainForm && !trainForm.dataset.setup) {
    trainForm.dataset.setup = '1';

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('train-date').value = today;
    document.getElementById('train-date').min = today;

    // Auto-suggest for stations
    setupStationAutocomplete('from-station', 'from-suggestions');
    setupStationAutocomplete('to-station', 'to-suggestions');

    trainForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await searchTrains();
    });

    // PNR form
    const pnrForm = document.getElementById('pnr-form');
    pnrForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await checkPNR();
    });

    // Swap button
    document.getElementById('swap-stations')?.addEventListener('click', () => {
      const f = document.getElementById('from-station');
      const t = document.getElementById('to-station');
      [f.value, t.value] = [t.value, f.value];
    });

    // Render popular trains
    renderPopularTrains();
  }
}

function renderPopularTrains() {
  const listEl = document.getElementById('popular-trains-list');
  if (!listEl) return;

  const popular = window.POPULAR_TRAINS || [];
  listEl.innerHTML = popular.slice(0, 8).map(t => `
    <div class="glass-card stat-card row row-between" style="border-radius:12px;padding:10px 14px;cursor:pointer;" onclick="selectPopularTrain('${t.number}', '${t.from}', '${t.to}')">
      <div class="card-content">
        <div class="row row-gap-sm">
          <span class="train-number-badge">${t.number}</span>
          <div>
            <p class="text-xs font-bold text-primary">${t.name}</p>
            <p class="text-xs text-muted">${t.from} → ${t.to} <span class="badge badge-accent" style="font-size:9px;margin-left:4px;">${t.type}</span></p>
          </div>
        </div>
      </div>
      <span class="text-accent text-sm font-bold">Search →</span>
    </div>
  `).join('');
}

window.selectPopularTrain = function(num, from, to) {
  document.getElementById('from-station').value = from;
  document.getElementById('to-station').value = to;
  searchTrains();
};

/* Station autocomplete using local popular stations */
const POPULAR_STATIONS = [
  { code: 'SC', name: 'Secunderabad Junction' },
  { code: 'HYB', name: 'Hyderabad Deccan' },
  { code: 'KCG', name: 'Kacheguda' },
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'CSTM', name: 'Mumbai CSMT' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'SBC', name: 'Bangalore City' },
  { code: 'YPR', name: 'Yeshvantpur Junction' },
  { code: 'VSKP', name: 'Visakhapatnam' },
  { code: 'BZA', name: 'Vijayawada Junction' },
  { code: 'GNT', name: 'Guntur Junction' },
  { code: 'OGL', name: 'Ongole' },
  { code: 'NLDA', name: 'Nalgonda' },
  { code: 'WL', name: 'Warangal' },
  { code: 'KZJ', name: 'Kazipet Junction' },
  { code: 'RJY', name: 'Rajahmundry' },
  { code: 'EE', name: 'Eluru' },
  { code: 'TPTY', name: 'Tirupati' },
  { code: 'RU', name: 'Renigunta Junction' },
  { code: 'MTM', name: 'Mangalagiri' },
  { code: 'NLR', name: 'Nellore' },
  { code: 'GDR', name: 'Gudur Junction' },
  { code: 'AWB', name: 'Aurangabad' },
  { code: 'NGP', name: 'Nagpur Junction' },
  { code: 'ADI', name: 'Ahmedabad Junction' },
  { code: 'HWH', name: 'Howrah Junction' },
  { code: 'PNBE', name: 'Patna Junction' },
  { code: 'LKO', name: 'Lucknow' },
  { code: 'JP', name: 'Jaipur Junction' },
  { code: 'CBE', name: 'Coimbatore Junction' },
  { code: 'TVC', name: 'Thiruvananthapuram Central' },
  { code: 'ERS', name: 'Ernakulam Junction' },
  { code: 'MDU', name: 'Madurai Junction' },
  { code: 'RMM', name: 'Rameswaram' },
  { code: 'MS', name: 'Chennai Egmore' },
];

function setupStationAutocomplete(inputId, suggId) {
  const input = document.getElementById(inputId);
  const sugg  = document.getElementById(suggId);
  if (!input || !sugg) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toUpperCase();
    if (!q || q.length < 2) { sugg.classList.add('hidden'); return; }
    const matches = POPULAR_STATIONS.filter(s =>
      s.code.includes(q) || s.name.toUpperCase().includes(q)
    ).slice(0, 5);
    if (!matches.length) { sugg.classList.add('hidden'); return; }
    sugg.innerHTML = matches.map(s => `
      <div class="suggestion-item" data-code="${s.code}" data-name="${s.name}">
        <span class="font-mono font-bold text-accent text-sm">${s.code}</span>
        <span class="text-sm text-secondary ml-2">${s.name}</span>
      </div>`).join('');
    sugg.classList.remove('hidden');
  });

  sugg.addEventListener('click', (e) => {
    const item = e.target.closest('[data-code]');
    if (!item) return;
    input.value = item.dataset.code;
    input.dataset.name = item.dataset.name;
    sugg.classList.add('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !sugg.contains(e.target)) {
      sugg.classList.add('hidden');
    }
  });
}

async function searchTrains() {
  const from = document.getElementById('from-station').value.trim().toUpperCase();
  const to   = document.getElementById('to-station').value.trim().toUpperCase();
  const date = document.getElementById('train-date').value;
  const cls  = document.getElementById('train-class').value;
  const quota= document.getElementById('train-quota').value;

  if (!from || !to || !date) {
    UI.toast('Please fill in all fields', 'warning');
    return;
  }

  const resultsEl = document.getElementById('train-results');
  UI.loader(resultsEl, 'Searching trains...');
  document.getElementById('train-results-section').classList.remove('hidden');

  const data = await TRAIN_API.searchTrains(from, to, date);

  if (data.error || !data.data || !data.data.length) {
    UI.empty(resultsEl, '🚂', 'No trains found', 'Try popular stations like SC, BZA, HYB, VSKP, NDLS, or MAS');
    return;
  }

  const trains = Array.isArray(data.data) ? data.data : [data.data];
  AppState.trainSearch = { from, to, date, trains, selected: null, cls, quota };

  if (!trains.length) {
    UI.empty(resultsEl, '🚂', 'No trains found', 'Try different stations or travel date');
    return;
  }

  // Show ARP info for searched date
  const arpInfo = ARPCalc.computeARP(date);
  document.getElementById('search-arp-info').innerHTML = arpInfo ? `
    <div class="glass-card row row-between" style="padding:12px 14px;border-radius:12px;border:1.5px solid var(--accent-dim);">
      <div class="card-content">
        <p class="text-xs text-muted">ARP for <span class="font-semibold">${formatDateDisplay(date)}</span></p>
        <p class="text-sm font-bold text-accent">Book on: ${arpInfo.arpDateStr} at 8AM</p>
      </div>
      ${arpInfo.countdown.opened
        ? '<span class="badge badge-success">🟢 Open</span>'
        : `<span class="badge badge-warning">${ARPCalc.formatCountdownShort(arpInfo.countdown)}</span>`}
    </div>` : '';

  resultsEl.innerHTML = '';
  trains.forEach(train => {
    const card = UI.renderTrainCard(train, (t) => openTrainDetail(t, date, from, to, cls, quota));
    resultsEl.appendChild(card);
  });
}

async function openTrainDetail(train, date, from, to, cls, quota) {
  AppState.trainSearch.selected = train;
  UI.openModal('train-detail-modal');

  const detailEl = document.getElementById('train-detail-content');
  UI.loader(detailEl, 'Loading train details...');

  const trainNum = train.train_number || train.number;
  const trainName = train.train_name || train.name;

  // ARP info
  const arpInfo = ARPCalc.computeARP(date);

  // Fetch schedule
  const scheduleData = await TRAIN_API.getTrainSchedule(trainNum);
  const stops = scheduleData?.data?.stops || scheduleData?.data?.train_route || [];

  const confirmTktSeatsUrl = `https://www.confirmtkt.com/trains/${from}-to-${to}`;
  const confirmTktScheduleUrl = `https://www.confirmtkt.com/train-schedule/${trainNum}`;
  const irctcUrl = 'https://www.irctc.co.in/nget/train-search';

  detailEl.innerHTML = `
    <div class="stack stack-lg">
      <!-- Train Header -->
      <div class="hero-card" style="padding:18px;">
        <div class="hero-content">
          <div class="row row-between mb-2">
            <span class="font-mono font-bold" style="font-size:13px;opacity:0.8;">${trainNum}</span>
            <span class="badge" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);">
              ${train.train_type || 'EXPRESS'}
            </span>
          </div>
          <h2 class="text-xl font-bold mb-3">${trainName}</h2>
          <div class="row row-gap-md">
            <div>
              <p style="opacity:0.7;font-size:11px;">FROM</p>
              <p class="font-mono font-bold text-lg">${from}</p>
              <p style="opacity:0.7;font-size:11px;">${train.departure_time || '—'}</p>
            </div>
            <div style="font-size:24px;opacity:0.7;">→</div>
            <div>
              <p style="opacity:0.7;font-size:11px;">TO</p>
              <p class="font-mono font-bold text-lg">${to}</p>
              <p style="opacity:0.7;font-size:11px;">${train.arrival_time || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Travel Date & ARP -->
      <div class="glass-card">
        <div class="card-content">
          <p class="text-xs text-muted uppercase tracking-wide font-semibold mb-2">Journey & Booking Info</p>
          <div class="grid-2">
            <div>
              <p class="text-xs text-muted">Travel Date</p>
              <p class="text-sm font-bold text-primary">${formatDateDisplay(date)}</p>
            </div>
            <div>
              <p class="text-xs text-muted">ARP Opens</p>
              ${arpInfo
                ? `<p class="text-sm font-bold text-accent">${arpInfo.arpDateStr}</p>
                   <p class="text-xs text-muted">at 8:00 AM IST</p>`
                : '<p class="text-sm text-muted">—</p>'}
            </div>
          </div>
          ${arpInfo && !arpInfo.isOpened ? `
            <div class="mt-3">
              <p class="text-xs text-muted mb-1">Booking opens in</p>
              <div id="detail-countdown"></div>
            </div>` : ''}
          ${arpInfo && arpInfo.isOpened ? `
            <div class="mt-3">
              <span class="badge badge-success">🟢 ARP is Open — Book Now!</span>
            </div>` : ''}
        </div>
      </div>

      <!-- Live ConfirmTkt & IRCTC Action Buttons -->
      <div class="glass-card">
        <div class="card-content">
          <p class="text-xs text-muted uppercase tracking-wide font-semibold mb-2">Live Availability & Booking</p>
          <p class="text-xs text-secondary mb-3">Check live real-time coach availability & book directly without any API key or subscription:</p>
          <div class="grid-2 row-gap-sm">
            <a href="${confirmTktSeatsUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm text-center" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;">
              <span>🎫 Check Seats on ConfirmTkt</span>
            </a>
            <a href="${confirmTktScheduleUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm text-center" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;">
              <span>🕒 Live Status on ConfirmTkt</span>
            </a>
          </div>
          <a href="${irctcUrl}" target="_blank" rel="noopener" class="btn btn-accent btn-sm mt-2 w-full text-center" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;">
            <span>📱 Book Official on IRCTC</span>
          </a>
        </div>
      </div>

      <!-- Running Days -->
      ${train.train_run_days ? `
        <div class="glass-card">
          <div class="card-content">
            <p class="text-xs text-muted uppercase tracking-wide font-semibold mb-2">Runs On</p>
            <div class="row row-gap-sm">
              ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => `
                <span class="chip ${train.train_run_days[i] === '1' ? 'selected' : ''}" style="padding:4px 8px;font-size:11px;">${d}</span>
              `).join('')}
            </div>
          </div>
        </div>` : ''}

      <!-- Route Timeline -->
      <div class="glass-card">
        <div class="card-content">
          <p class="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
            Intermediate Stations Route ${stops.length ? `(${stops.length} stations)` : ''}
          </p>
          ${stops.length
            ? UI.renderRouteTimeline(stops, from)
            : `<div class="text-center" style="padding:16px;">
                 <p class="text-xs text-muted mb-2">Complete route available on ConfirmTkt</p>
                 <a href="${confirmTktScheduleUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary">View Station Route on ConfirmTkt →</a>
               </div>`}
        </div>
      </div>

      <!-- Add to Events button -->
      <button class="btn btn-primary btn-full" onclick="prefillEventFromTrain('${trainNum}','${trainName}','${from}','${to}','${date}')">
        📌 Save as My Event
      </button>
    </div>`;

  // Start countdown in detail
  if (arpInfo && !arpInfo.isOpened) {
    const cdEl = document.getElementById('detail-countdown');
    if (cdEl) {
      const updateCd = () => {
        const cd = ARPCalc.getCountdownToARP(new Date(date + 'T00:00:00'));
        cdEl.innerHTML = UI.renderCountdown(cd);
      };
      updateCd();
      const timer = setInterval(updateCd, 1000);
      // Clear when modal closes
      document.getElementById('train-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'train-detail-modal') clearInterval(timer);
      }, { once: true });
    }
  }
}

async function checkPNR() {
  const pnr = document.getElementById('pnr-input').value.trim();
  if (pnr.length !== 10) {
    UI.toast('PNR must be 10 digits', 'warning');
    return;
  }
  const resultEl = document.getElementById('pnr-result');
  UI.loader(resultEl, 'Checking PNR status...');
  resultEl.classList.remove('hidden');

  const data = await TRAIN_API.getPNRStatus(pnr);

  if (data.error || !data.data) {
    UI.error(resultEl, data.message || 'PNR format invalid');
    return;
  }

  const p = data.data;
  resultEl.innerHTML = `
    <div class="glass-card stack stack-sm">
      <div class="card-content">
        <div class="row row-between mb-3">
          <div>
            <p class="text-xs text-muted">PNR Number</p>
            <p class="font-mono font-bold text-lg text-accent">${pnr}</p>
          </div>
          <span class="badge badge-accent">
            ${p.zone || 'Indian Railways'}
          </span>
        </div>
        <p class="text-xs text-secondary mb-3">${p.message}</p>
        <a href="${p.confirmTktUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-full text-center" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;">
          <span>📋 View Live PNR Status on ConfirmTkt →</span>
        </a>
      </div>
    </div>`;
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
window.searchTrains = searchTrains;
window.checkPNR = checkPNR;
window.openTrainDetail = openTrainDetail;
window.setCalendarMode = setCalendarMode;
window.jumpToSingleMonth = jumpToSingleMonth;
