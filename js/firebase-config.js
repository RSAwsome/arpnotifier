/* ============================================================
   Firebase Config — Pre-configured with user's Firebase project
   ============================================================ */

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyC_oP-Plzzy4bfudCzOoley-5qGZ272byY",
  authDomain: "arp-notifier.firebaseapp.com",
  projectId: "arp-notifier",
  storageBucket: "arp-notifier.firebasestorage.app",
  messagingSenderId: "993366142005",
  appId: "1:993366142005:web:943e2689bad5aa5fa5557c",
  measurementId: "G-K53XWG604C"
};

let _db = null;
let _auth = null;
let _app = null;

const FirebaseManager = {
  initialized: false,

  /** Initialize with preset or stored user config */
  async init() {
    const cfg = this.getConfig();
    if (!cfg || !cfg.apiKey) {
      console.log('Firebase: No config found. Storing locally.');
      return false;
    }
    try {
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js');
      const { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, onSnapshot }
        = await import('https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js');

      if (getApps().length === 0) {
        _app = initializeApp(cfg);
      }

      _db = getFirestore(_app);
      this.initialized = true;
      this._firestore = { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, onSnapshot };
      console.log('Firebase: Connected to project "arp-notifier" ✓');
      return true;
    } catch (err) {
      console.error('Firebase init error:', err);
      return false;
    }
  },

  /** Get stored Firebase config or fall back to default */
  getConfig() {
    try {
      const raw = localStorage.getItem('firebase_config');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_FIREBASE_CONFIG;
  },

  /** Save Firebase config */
  saveConfig(cfg) {
    localStorage.setItem('firebase_config', JSON.stringify(cfg));
  },

  /** Save a user event to Firestore */
  async saveEvent(event) {
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
    remote.forEach(e => map.set(e.id, e));
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  },
};

/** Generate unique ID */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

window.FirebaseManager = FirebaseManager;
window.generateId = generateId;
window.DEFAULT_FIREBASE_CONFIG = DEFAULT_FIREBASE_CONFIG;
