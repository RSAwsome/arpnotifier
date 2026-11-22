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

/**
 * Computes ARP booking window accurately considering train departure day vs passenger boarding day.
 * If user boards on Day 2 or Day 3, the train actually departed (Day - 1) days earlier.
 * Indian Railways ARP booking opens 60 days before the train's ORIGIN departure, NOT the boarding date!
 */
function computeBoardingARP(boardingDateStr, stationDay = 1) {
  if (!boardingDateStr) return null;
  const bd = new Date(boardingDateStr + 'T00:00:00');
  if (isNaN(bd.getTime())) return null;

  const day = parseInt(stationDay, 10) || 1;
  const offsetDays = Math.max(0, day - 1);

  // Train Origin Departure Date = Boarding Date - offsetDays
  const od = new Date(bd);
  od.setDate(od.getDate() - offsetDays);

  // 60-day ARP opens 60 days before Origin Departure Date at 8:00 AM IST
  const arpDT = getARPDateTime(od);
  const now = new Date();
  const countdown = getCountdownToARP(od);
  const daysFromNowToOrigin = Math.ceil((od - now) / 86400000);
  const daysFromNowToBoarding = Math.ceil((bd - now) / 86400000);

  // Tatkal Dates (1 day before origin departure date)
  const tatkalDate = new Date(od);
  tatkalDate.setDate(tatkalDate.getDate() - 1);
  const tatkalAcDT = new Date(tatkalDate);
  tatkalAcDT.setHours(10, 0, 0, 0); // 10:00 AM IST
  const tatkalSlDT = new Date(tatkalDate);
  tatkalSlDT.setHours(11, 0, 0, 0); // 11:00 AM IST

  return {
    boardingDate: bd,
    boardingDateStr: formatARPDate(bd),
    boardingDateShort: formatARPDateShort(bd),
    originDate: od,
    originDateStr: formatARPDate(od),
    originDateShort: formatARPDateShort(od),
    stationDay: day,
    offsetDays,
    isMultiDay: offsetDays > 0,
    arpDate: arpDT,
    arpDateStr: formatARPDateShort(arpDT),
    arpDateFull: formatARPDate(arpDT),
    arpTime: formatARPTime(),
    countdown,
    daysFromNowToOrigin,
    daysFromNowToBoarding,
    isOpened: countdown.opened,
    arpDaysAgo: countdown.opened ? Math.abs(Math.floor((now - arpDT) / 86400000)) : null,
    tatkalDateStr: formatARPDateShort(tatkalDate),
    tatkalAcTime: '10:00 AM IST',
    tatkalSlTime: '11:00 AM IST',
    tatkalAcOpened: now >= tatkalAcDT,
    tatkalSlOpened: now >= tatkalSlDT,
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
  computeBoardingARP,
  getUpcomingARPs,
  pad2,
  formatCountdownShort,
  formatCountdownVerbose,
};
