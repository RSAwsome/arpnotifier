/* ============================================================
   ARP Calculator — Core logic
   ARP = 60 days before journey (excluding journey date)
   Opens at 8:00 AM IST
   ============================================================ */

const ARP_DAYS = 60; // As of Nov 1, 2024
const ARP_OPEN_HOUR = 8; // 8:00 AM IST
const ARP_OPEN_MIN  = 0;

/** Returns journey date's ARP opening datetime (IST) */
function getARPDateTime(journeyDate) {
  // journeyDate: Date object in local timezone
  const jd = new Date(journeyDate);
  jd.setHours(0, 0, 0, 0);

  // ARP = journey_date - 60 days
  const arpDate = new Date(jd);
  arpDate.setDate(arpDate.getDate() - ARP_DAYS);

  // Opens at 8:00 AM IST
  // IST = UTC + 5:30
  const arpIST = new Date(arpDate);
  arpIST.setHours(ARP_OPEN_HOUR, ARP_OPEN_MIN, 0, 0);

  return arpIST;
}

/** Returns ARP date string formatted for display */
function formatARPDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
}

/** Returns short ARP date */
function formatARPDateShort(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
}

/** Returns time string "8:00 AM" */
function formatARPTime() {
  return '8:00 AM IST';
}

/** Returns countdown object { days, hours, minutes, seconds, opened } */
function getCountdownToARP(journeyDate) {
  const arpDT = getARPDateTime(journeyDate);
  const now = new Date();
  const diff = arpDT - now;

  if (diff <= 0) {
    return { opened: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { opened: false, days, hours, minutes, seconds };
}

/** Today's ARP window */
function getTodaysARPInfo() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Journey date that opens TODAY:
  // today = journey - 60 → journey = today + 60
  const journeyDate = new Date(today);
  journeyDate.setDate(journeyDate.getDate() + ARP_DAYS);

  return {
    today,
    journeyDate,
    arpOpenTime: formatARPTime(),
    journeyDateStr: formatARPDate(journeyDate),
    journeyDateShort: formatARPDateShort(journeyDate),
  };
}

/** Returns ARP date for a given journey date (formatted) */
function computeARP(journeyDateStr) {
  if (!journeyDateStr) return null;
  const jd = new Date(journeyDateStr + 'T00:00:00');
  if (isNaN(jd)) return null;

  const arpDT = getARPDateTime(jd);
  const now = new Date();
  const countdown = getCountdownToARP(jd);
  const daysFromNow = Math.ceil((jd - now) / 86400000);

  return {
    journeyDate: jd,
    journeyDateStr: formatARPDate(jd),
    arpDate: arpDT,
    arpDateStr: formatARPDateShort(arpDT),
    arpDateFull: formatARPDate(arpDT),
    arpTime: formatARPTime(),
    countdown,
    daysFromNow,
    isOpened: countdown.opened,
    arpdaysAgo: countdown.opened ? Math.abs(Math.floor((now - arpDT) / 86400000)) : null,
  };
}

/** Returns next N ARP windows from today */
function getUpcomingARPs(n = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const list = [];
  for (let i = 0; i <= n; i++) {
    const jd = new Date(today);
    jd.setDate(jd.getDate() + ARP_DAYS + i);
    const arpDT = getARPDateTime(jd);
    list.push({
      journeyDate: jd,
      journeyDateStr: formatARPDateShort(jd),
      arpDate: arpDT,
      arpDateStr: formatARPDateShort(arpDT),
      isToday: i === 0,
    });
  }
  return list;
}

/** Pad number to 2 digits */
function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Format countdown as HH:MM:SS */
function formatCountdownShort(cd) {
  if (cd.opened) return 'OPENED';
  if (cd.days > 0) {
    return `${cd.days}d ${pad2(cd.hours)}h ${pad2(cd.minutes)}m`;
  }
  return `${pad2(cd.hours)}:${pad2(cd.minutes)}:${pad2(cd.seconds)}`;
}

/** Format countdown verbose */
function formatCountdownVerbose(cd) {
  if (cd.opened) return 'Booking window is open!';
  const parts = [];
  if (cd.days > 0)    parts.push(`${cd.days} day${cd.days > 1 ? 's' : ''}`);
  if (cd.hours > 0)   parts.push(`${cd.hours} hr${cd.hours > 1 ? 's' : ''}`);
  if (cd.minutes > 0) parts.push(`${cd.minutes} min`);
  if (cd.days === 0 && cd.hours === 0) parts.push(`${cd.seconds} sec`);
  return parts.join(' ') + ' to open';
}

window.ARPCalc = {
  ARP_DAYS,
  getARPDateTime,
  formatARPDate,
  formatARPDateShort,
  formatARPTime,
  getCountdownToARP,
  getTodaysARPInfo,
  computeARP,
  getUpcomingARPs,
  pad2,
  formatCountdownShort,
  formatCountdownVerbose,
};
