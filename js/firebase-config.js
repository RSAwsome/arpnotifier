/* ============================================================
   Firebase Config — User fills in their own project credentials
   ============================================================ */

// Firebase SDK loaded via CDN in index.html
// User provides their config via Settings modal

let _db = null;
let _auth = null;
let _app = null;

const FirebaseManager = {
  initialized: false,

  /** Initialize with user's config (stored in localStorage) */
  async init() {
    const cfg = this.getConfig();
    if (!cfg || !cfg.apiKey) {
      console.log('Firebase: No config found. Data stored locally only.');
      return false;
    }
    try {
      // Dynamic import of Firebase modules
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js');
      const { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, onSnapshot }
        = await import('https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js');

      if (getApps().length === 0) {
        _app = initializeApp(cfg);
      }

      _db = getFirestore(_app);
      this.initialized = true;
      this._firestore = { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, onSnapshot };
      console.log('Firebase: Initialized successfully ✓');
      return true;
    } catch (err) {
      console.error('Firebase init error:', err);
      return false;
    }
  },

  /** Get stored Firebase config */
  getConfig() {
    try {
      const raw = localStorage.getItem('firebase_config');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  /** Save Firebase config */
  saveConfig(cfg) {
    localStorage.setItem('firebase_config', JSON.stringify(cfg));
  },

  /** Save a user event to Firestore */
  async saveEvent(event) {
    // Always save to localStorage first (offline-first)
    this._saveEventLocal(event);

    if (!this.initialized || !_db) return { success: true, local: true };

    try {
      const { doc, setDoc } = this._firestore;
      await setDoc(doc(_db, 'events', event.id), event);
      return { success: true, synced: true };
    } catch (err) {
      console.error('Firestore save error:', err);
      return { success: true, local: true, error: err.message };
    }
  },

  /** Load all events */
  async loadEvents() {
    const local = this._loadEventsLocal();
    if (!this.initialized || !_db) return local;

    try {
      const { collection, getDocs, query, orderBy } = this._firestore;
      const q = query(collection(_db, 'events'), orderBy('date'));
      const snap = await getDocs(q);
      const events = [];
      snap.forEach(d => events.push(d.data()));
      // Merge with local (Firestore wins for conflicts)
      const merged = this._mergeEvents(local, events);
      this._saveAllEventsLocal(merged);
      return merged;
    } catch (err) {
      console.error('Firestore load error:', err);
      return local;
    }
  },

  /** Delete an event */
  async deleteEvent(eventId) {
    this._deleteEventLocal(eventId);
    if (!this.initialized || !_db) return;
    try {
      const { doc, deleteDoc } = this._firestore;
      await deleteDoc(doc(_db, 'events', eventId));
    } catch (err) {
      console.error('Firestore delete error:', err);
    }
  },

  // ── Local storage helpers ──

  _loadEventsLocal() {
    try {
      return JSON.parse(localStorage.getItem('user_events') || '[]');
    } catch { return []; }
  },

  _saveAllEventsLocal(events) {
    localStorage.setItem('user_events', JSON.stringify(events));
  },

  _saveEventLocal(event) {
    const events = this._loadEventsLocal();
    const idx = events.findIndex(e => e.id === event.id);
    if (idx >= 0) events[idx] = event;
    else events.push(event);
    this._saveAllEventsLocal(events);
  },

  _deleteEventLocal(eventId) {
    const events = this._loadEventsLocal().filter(e => e.id !== eventId);
    this._saveAllEventsLocal(events);
  },

  _mergeEvents(local, remote) {
    const map = new Map();
    local.forEach(e => map.set(e.id, e));
    remote.forEach(e => map.set(e.id, e)); // remote wins
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  },
};

/** Generate unique ID */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

window.FirebaseManager = FirebaseManager;
window.generateId = generateId;
