/* ============================================================
   Events Manager — User events, ARP events, festival overlays
   ============================================================ */

const EventsManager = {
  events: [],

  async init() {
    this.events = await FirebaseManager.loadEvents();
    return this.events;
  },

  async addEvent(eventData) {
    const event = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...eventData,
    };
    const result = await FirebaseManager.saveEvent(event);
    this.events = await FirebaseManager.loadEvents();
    return { event, result };
  },

  async deleteEvent(eventId) {
    await FirebaseManager.deleteEvent(eventId);
    this.events = this.events.filter(e => e.id !== eventId);
    return true;
  },

  getEventsForDate(dateStr) {
    return this.events.filter(e => e.date === dateStr);
  },

  getEventsForMonth(year, month) {
    const prefix = `${year}-${String(month).padStart(2,'0')}`;
    return this.events.filter(e => e.date && e.date.startsWith(prefix));
  },

  getAllEvents() {
    return [...this.events].sort((a,b) => a.date.localeCompare(b.date));
  },

  getUpcomingEvents(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    return this.events
      .filter(e => e.date >= today)
      .sort((a,b) => a.date.localeCompare(b.date))
      .slice(0, limit);
  },
};

/** Build a new user-event object */
function buildUserEvent({ name, date, trainNumber, trainName, fromStation, toStation, boardingStation, notes }) {
  const arpInfo = ARPCalc.computeARP(date);
  return {
    name,
    date,
    trainNumber: trainNumber || '',
    trainName: trainName || '',
    fromStation: fromStation || '',
    toStation: toStation || '',
    boardingStation: boardingStation || '',
    notes: notes || '',
    isSpecial: true,
    arpDate: arpInfo ? arpInfo.arpDateStr : '',
    arpDateFull: arpInfo ? arpInfo.arpDateFull : '',
    arpOpened: arpInfo ? arpInfo.isOpened : false,
    type: 'user-event',
    emoji: '📌',
  };
}

window.EventsManager = EventsManager;
window.buildUserEvent = buildUserEvent;
