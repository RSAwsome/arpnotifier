/* ============================================================
   Festivals & Holidays Data
   Telugu + Indian national holidays 2025 & 2026
   ============================================================ */

const FESTIVALS_DATA = {
  2025: [
    // National
    { date: '2025-01-26', name: 'Republic Day', type: 'national', emoji: '🇮🇳' },
    { date: '2025-08-15', name: 'Independence Day', type: 'national', emoji: '🇮🇳' },
    { date: '2025-10-02', name: "Gandhi Jayanti", type: 'national', emoji: '🕊️' },

    // Telugu / AP-Telangana
    { date: '2025-01-13', name: 'Bhogi', type: 'telugu', emoji: '🔥' },
    { date: '2025-01-14', name: 'Makara Sankranti / Pongal', type: 'telugu', emoji: '🌾' },
    { date: '2025-01-15', name: 'Kanuma', type: 'telugu', emoji: '🐄' },
    { date: '2025-02-26', name: 'Maha Shivaratri', type: 'telugu', emoji: '🔱' },
    { date: '2025-03-14', name: 'Holi', type: 'indian', emoji: '🎨' },
    { date: '2025-03-30', name: 'Ugadi (Telugu New Year)', type: 'telugu', emoji: '🌸' },
    { date: '2025-03-31', name: 'Id-ul-Fitr (Eid)', type: 'indian', emoji: '🌙' },
    { date: '2025-04-06', name: 'Sri Rama Navami', type: 'telugu', emoji: '🏹' },
    { date: '2025-04-10', name: 'Mahavir Jayanti', type: 'indian', emoji: '☮️' },
    { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national', emoji: '📚' },
    { date: '2025-04-18', name: 'Good Friday', type: 'indian', emoji: '✝️' },
    { date: '2025-05-12', name: 'Buddha Purnima', type: 'indian', emoji: '☸️' },
    { date: '2025-06-02', name: 'Telangana Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2025-06-07', name: 'Bakrid (Eid al-Adha)', type: 'indian', emoji: '🌙' },
    { date: '2025-07-06', name: 'Muharram', type: 'indian', emoji: '🌙' },
    { date: '2025-08-08', name: 'Varalakshmi Vratham', type: 'telugu', emoji: '🌸' },
    { date: '2025-08-16', name: 'Sri Krishnashtami', type: 'telugu', emoji: '🦚' },
    { date: '2025-08-27', name: 'Vinayaka Chavithi', type: 'telugu', emoji: '🐘' },
    { date: '2025-09-05', name: 'Milad-un-Nabi', type: 'indian', emoji: '🌙' },
    { date: '2025-09-28', name: 'Dussehra / Vijayadasami', type: 'telugu', emoji: '⚔️' },
    { date: '2025-10-20', name: 'Deepavali (Diwali)', type: 'telugu', emoji: '🪔' },
    { date: '2025-11-01', name: 'AP Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2025-11-05', name: 'Guru Nanak Jayanti', type: 'indian', emoji: '☬' },
    { date: '2025-12-25', name: 'Christmas', type: 'indian', emoji: '🎄' },
  ],
  2026: [
    // National
    { date: '2026-01-26', name: 'Republic Day', type: 'national', emoji: '🇮🇳' },
    { date: '2026-08-15', name: 'Independence Day', type: 'national', emoji: '🇮🇳' },
    { date: '2026-10-02', name: "Gandhi Jayanti", type: 'national', emoji: '🕊️' },

    // Telugu / AP-Telangana
    { date: '2026-01-14', name: 'Bhogi', type: 'telugu', emoji: '🔥' },
    { date: '2026-01-15', name: 'Makara Sankranti / Pongal', type: 'telugu', emoji: '🌾' },
    { date: '2026-01-16', name: 'Kanuma', type: 'telugu', emoji: '🐄' },
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
    { date: '2026-09-14', name: 'Vinayaka Chavithi', type: 'telugu', emoji: '🐘' },
    { date: '2026-10-17', name: 'Dussehra / Vijayadasami', type: 'telugu', emoji: '⚔️' },
    { date: '2026-11-01', name: 'AP Formation Day', type: 'telugu', emoji: '🌟' },
    { date: '2026-11-08', name: 'Deepavali (Diwali)', type: 'telugu', emoji: '🪔' },
    { date: '2026-12-25', name: 'Christmas', type: 'indian', emoji: '🎄' },
  ]
};

/** Get all events for a given month (YYYY-MM) */
function getEventsForMonth(year, month) {
  const yearData = FESTIVALS_DATA[year] || [];
  const monthStr = String(month).padStart(2, '0');
  return yearData.filter(f => f.date.startsWith(`${year}-${monthStr}`));
}

/** Get events for a specific date (YYYY-MM-DD) */
function getEventsForDate(dateStr) {
  const year = parseInt(dateStr.split('-')[0]);
  const yearData = FESTIVALS_DATA[year] || [];
  return yearData.filter(f => f.date === dateStr);
}

/** Check if date is a Sunday */
function isSunday(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay() === 0;
}

/** Check if date is a Friday */
function isFriday(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay() === 5;
}

/** Check if date has a festival/holiday */
function isFestival(dateStr) {
  const year = parseInt(dateStr.split('-')[0]);
  const yearData = FESTIVALS_DATA[year] || [];
  return yearData.some(f => f.date === dateStr);
}

/** Get calendar "special days" for a month */
function getSpecialDays(year, month) {
  const result = {};
  const festivals = getEventsForMonth(year, month);
  festivals.forEach(f => {
    result[f.date] = result[f.date] || [];
    result[f.date].push(f);
  });
  return result;
}

/** Returns all Sundays and Fridays in a month */
function getSundaysAndFridays(year, month) {
  const days = { sundays: [], fridays: [] };
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const day = new Date(dateStr + 'T00:00:00').getDay();
    if (day === 0) days.sundays.push(dateStr);
    if (day === 5) days.fridays.push(dateStr);
  }
  return days;
}

window.FESTIVALS_DATA = FESTIVALS_DATA;
window.FestivalsUtil = {
  getEventsForMonth,
  getEventsForDate,
  isSunday,
  isFriday,
  isFestival,
  getSpecialDays,
  getSundaysAndFridays,
};
