/* ============================================================
   Festivals & Holidays Data
   Telugu + Indian national holidays 2025, 2026, 2027 & 2028
   Supports month view, multi-month / next 6 months, and full-year view
   ============================================================ */

const FESTIVALS_DATA = {
  2025: [
    { date: '2025-01-13', name: 'Bhogi', type: 'telugu', emoji: '🔥' },
    { date: '2025-01-14', name: 'Makara Sankranti / Pongal', type: 'telugu', emoji: '🌾' },
    { date: '2025-01-15', name: 'Kanuma', type: 'telugu', emoji: '🐄' },
    { date: '2025-01-26', name: 'Republic Day', type: 'national', emoji: '🇮🇳' },
    { date: '2025-02-26', name: 'Maha Shivaratri', type: 'telugu', emoji: '🔱' },
    { date: '2025-03-14', name: 'Holi', type: 'indian', emoji: '🎨' },
    { date: '2025-03-30', name: 'Ugadi (Telugu New Year)', type: 'telugu', emoji: '🌸' },
    { date: '2025-03-31', name: 'Id-ul-Fitr (Ramzan)', type: 'indian', emoji: '🌙' },
    { date: '2025-04-06', name: 'Sri Rama Navami', type: 'telugu', emoji: '🏹' },
    { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national', emoji: '📚' },
    { date: '2025-04-18', name: 'Good Friday', type: 'indian', emoji: '✝️' },
    { date: '2025-06-02', name: 'Telangana Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2025-06-07', name: 'Bakrid (Eid al-Adha)', type: 'indian', emoji: '🌙' },
    { date: '2025-08-08', name: 'Varalakshmi Vratham', type: 'telugu', emoji: '🌸' },
    { date: '2025-08-15', name: 'Independence Day', type: 'national', emoji: '🇮🇳' },
    { date: '2025-08-16', name: 'Sri Krishnashtami', type: 'telugu', emoji: '🦚' },
    { date: '2025-08-27', name: 'Vinayaka Chavithi', type: 'telugu', emoji: '🐘' },
    { date: '2025-09-05', name: 'Milad-un-Nabi', type: 'indian', emoji: '🌙' },
    { date: '2025-09-28', name: 'Dussehra / Vijayadasami', type: 'telugu', emoji: '⚔️' },
    { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'national', emoji: '🕊️' },
    { date: '2025-10-20', name: 'Deepavali (Diwali)', type: 'telugu', emoji: '🪔' },
    { date: '2025-11-01', name: 'AP Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2025-12-25', name: 'Christmas', type: 'indian', emoji: '🎄' },
  ],
  2026: [
    { date: '2026-01-14', name: 'Bhogi', type: 'telugu', emoji: '🔥' },
    { date: '2026-01-15', name: 'Makara Sankranti / Pongal', type: 'telugu', emoji: '🌾' },
    { date: '2026-01-16', name: 'Kanuma', type: 'telugu', emoji: '🐄' },
    { date: '2026-01-26', name: 'Republic Day', type: 'national', emoji: '🇮🇳' },
    { date: '2026-02-15', name: 'Maha Shivaratri', type: 'telugu', emoji: '🔱' },
    { date: '2026-03-03', name: 'Holi', type: 'indian', emoji: '🎨' },
    { date: '2026-03-19', name: 'Ugadi (Telugu New Year)', type: 'telugu', emoji: '🌸' },
    { date: '2026-03-20', name: 'Id-ul-Fitr (Eid)', type: 'indian', emoji: '🌙' },
    { date: '2026-03-27', name: 'Sri Rama Navami', type: 'telugu', emoji: '🏹' },
    { date: '2026-04-03', name: 'Good Friday', type: 'indian', emoji: '✝️' },
    { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national', emoji: '📚' },
    { date: '2026-05-31', name: 'Buddha Purnima', type: 'indian', emoji: '☸️' },
    { date: '2026-06-02', name: 'Telangana Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2026-06-27', name: 'Bakrid (Eid al-Adha)', type: 'indian', emoji: '🌙' },
    { date: '2026-08-15', name: 'Independence Day', type: 'national', emoji: '🇮🇳' },
    { date: '2026-08-28', name: 'Raksha Bandhan', type: 'indian', emoji: '🎗️' },
    { date: '2026-09-04', name: 'Sri Krishnashtami', type: 'telugu', emoji: '🦚' },
    { date: '2026-09-14', name: 'Vinayaka Chavithi', type: 'telugu', emoji: '🐘' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national', emoji: '🕊️' },
    { date: '2026-10-20', name: 'Dussehra / Vijayadasami', type: 'telugu', emoji: '⚔️' },
    { date: '2026-11-01', name: 'AP Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2026-11-08', name: 'Deepavali (Diwali)', type: 'telugu', emoji: '🪔' },
    { date: '2026-12-25', name: 'Christmas', type: 'indian', emoji: '🎄' },
  ],
  2027: [
    { date: '2027-01-14', name: 'Bhogi', type: 'telugu', emoji: '🔥' },
    { date: '2027-01-15', name: 'Makara Sankranti / Pongal', type: 'telugu', emoji: '🌾' },
    { date: '2027-01-16', name: 'Kanuma', type: 'telugu', emoji: '🐄' },
    { date: '2027-01-26', name: 'Republic Day', type: 'national', emoji: '🇮🇳' },
    { date: '2027-03-06', name: 'Maha Shivaratri', type: 'telugu', emoji: '🔱' },
    { date: '2027-03-23', name: 'Holi', type: 'indian', emoji: '🎨' },
    { date: '2027-03-26', name: 'Good Friday', type: 'indian', emoji: '✝️' },
    { date: '2027-04-07', name: 'Ugadi (Telugu New Year)', type: 'telugu', emoji: '🌸' },
    { date: '2027-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national', emoji: '📚' },
    { date: '2027-04-15', name: 'Sri Rama Navami', type: 'telugu', emoji: '🏹' },
    { date: '2027-06-02', name: 'Telangana Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2027-06-16', name: 'Bakrid (Eid al-Adha)', type: 'indian', emoji: '🌙' },
    { date: '2027-08-13', name: 'Varalakshmi Vratham', type: 'telugu', emoji: '🌸' },
    { date: '2027-08-15', name: 'Independence Day', type: 'national', emoji: '🇮🇳' },
    { date: '2027-08-17', name: 'Raksha Bandhan', type: 'indian', emoji: '🎗️' },
    { date: '2027-08-25', name: 'Sri Krishnashtami', type: 'telugu', emoji: '🦚' },
    { date: '2027-09-04', name: 'Vinayaka Chavithi', type: 'telugu', emoji: '🐘' },
    { date: '2027-10-02', name: 'Gandhi Jayanti', type: 'national', emoji: '🕊️' },
    { date: '2027-10-10', name: 'Dussehra / Vijayadasami', type: 'telugu', emoji: '⚔️' },
    { date: '2027-10-29', name: 'Deepavali (Diwali)', type: 'telugu', emoji: '🪔' },
    { date: '2027-11-01', name: 'AP Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2027-12-25', name: 'Christmas', type: 'indian', emoji: '🎄' },
  ],
  2028: [
    { date: '2028-01-14', name: 'Bhogi', type: 'telugu', emoji: '🔥' },
    { date: '2028-01-15', name: 'Makara Sankranti / Pongal', type: 'telugu', emoji: '🌾' },
    { date: '2028-01-16', name: 'Kanuma', type: 'telugu', emoji: '🐄' },
    { date: '2028-01-26', name: 'Republic Day', type: 'national', emoji: '🇮🇳' },
    { date: '2028-02-24', name: 'Maha Shivaratri', type: 'telugu', emoji: '🔱' },
    { date: '2028-03-11', name: 'Holi', type: 'indian', emoji: '🎨' },
    { date: '2028-03-27', name: 'Ugadi (Telugu New Year)', type: 'telugu', emoji: '🌸' },
    { date: '2028-04-03', name: 'Sri Rama Navami', type: 'telugu', emoji: '🏹' },
    { date: '2028-04-14', name: 'Good Friday & Ambedkar Jayanti', type: 'national', emoji: '📚' },
    { date: '2028-08-15', name: 'Independence Day', type: 'national', emoji: '🇮🇳' },
    { date: '2028-09-23', name: 'Vinayaka Chavithi', type: 'telugu', emoji: '🐘' },
    { date: '2028-09-29', name: 'Dussehra / Vijayadasami', type: 'telugu', emoji: '⚔️' },
    { date: '2028-10-02', name: 'Gandhi Jayanti', type: 'national', emoji: '🕊️' },
    { date: '2028-10-18', name: 'Deepavali (Diwali)', type: 'telugu', emoji: '🪔' },
    { date: '2028-12-25', name: 'Christmas', type: 'indian', emoji: '🎄' },
  ]
};

/** Get all events for a given month (YYYY-MM) */
function getEventsForMonth(year, month) {
  const yearData = FESTIVALS_DATA[year] || [];
  const monthStr = String(month).padStart(2, '0');
  return yearData.filter(f => f.date.startsWith(`${year}-${monthStr}`));
}

/** Get all events for an entire year (YYYY) */
function getEventsForYear(year) {
  return FESTIVALS_DATA[year] || [];
}

/** Get all events for a date range [startDate, endDate] inclusive */
function getEventsForRange(startDateStr, endDateStr) {
  const startYear = parseInt(startDateStr.split('-')[0]);
  const endYear = parseInt(endDateStr.split('-')[0]);
  const results = [];
  
  for (let y = startYear; y <= endYear; y++) {
    const list = FESTIVALS_DATA[y] || [];
    list.forEach(item => {
      if (item.date >= startDateStr && item.date <= endDateStr) {
        results.push(item);
      }
    });
  }
  return results.sort((a,b) => a.date.localeCompare(b.date));
}

/** Get events for the next N months from a reference date */
function getEventsForNextNMonths(startDate, n = 6) {
  const start = new Date(startDate);
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + n);

  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  return getEventsForRange(startStr, endStr);
}

/** Get events for a specific date (YYYY-MM-DD) */
function getEventsForDate(dateStr) {
  const year = parseInt(dateStr.split('-')[0]);
  const yearData = FESTIVALS_DATA[year] || [];
  return yearData.filter(f => f.date === dateStr);
}

function isSunday(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay() === 0;
}

function isFriday(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay() === 5;
}

function isFestival(dateStr) {
  const year = parseInt(dateStr.split('-')[0]);
  const yearData = FESTIVALS_DATA[year] || [];
  return yearData.some(f => f.date === dateStr);
}

function getSpecialDays(year, month) {
  const result = {};
  const festivals = getEventsForMonth(year, month);
  festivals.forEach(f => {
    result[f.date] = result[f.date] || [];
    result[f.date].push(f);
  });
  return result;
}

window.FESTIVALS_DATA = FESTIVALS_DATA;
window.FestivalsUtil = {
  getEventsForMonth,
  getEventsForYear,
  getEventsForRange,
  getEventsForNextNMonths,
  getEventsForDate,
  isSunday,
  isFriday,
  isFestival,
  getSpecialDays,
};
