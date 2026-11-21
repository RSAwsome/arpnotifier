/* ============================================================
   Train API — Integrates with RapidAPI Indian Railway API
   Users must provide their own RapidAPI key in Settings
   ============================================================ */

const TRAIN_API = {
  // Store key in localStorage (user sets it in Settings)
  get apiKey() {
    return localStorage.getItem('rapidapi_key') || '';
  },

  baseHost: 'irctc1.p.rapidapi.com',
  baseUrl: 'https://irctc1.p.rapidapi.com',

  headers() {
    return {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': this.baseHost,
    };
  },

  /** Search trains between stations */
  async searchTrains(fromCode, toCode, date) {
    if (!this.apiKey) {
      return { error: 'no_key', message: 'Please add your RapidAPI key in Settings ⚙️' };
    }
    try {
      // date format: YYYYMMDD
      const dateStr = date.replace(/-/g, '');
      const url = `${this.baseUrl}/api/v3/trainBetweenStations?fromStationCode=${fromCode}&toStationCode=${toCode}&dateOfJourney=${dateStr}`;
      const resp = await fetch(url, { headers: this.headers() });
      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      const data = await resp.json();
      return data;
    } catch (err) {
      console.error('Train search error:', err);
      return { error: 'fetch_error', message: err.message };
    }
  },

  /** Get train schedule / route */
  async getTrainSchedule(trainNumber) {
    if (!this.apiKey) {
      return { error: 'no_key', message: 'Please add your RapidAPI key in Settings ⚙️' };
    }
    try {
      const url = `${this.baseUrl}/api/v1/liveTrainStatus?trainNo=${trainNumber}&startDay=1`;
      const resp = await fetch(url, { headers: this.headers() });
      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      return await resp.json();
    } catch (err) {
      return { error: 'fetch_error', message: err.message };
    }
  },

  /** Get seat availability */
  async getSeatAvailability(trainNumber, fromCode, toCode, date, classCode = 'SL', quota = 'GN') {
    if (!this.apiKey) {
      return { error: 'no_key', message: 'Please add your RapidAPI key in Settings ⚙️' };
    }
    try {
      const dateStr = date.replace(/-/g, '');
      const url = `${this.baseUrl}/api/v1/checkSeatAvailability?classType=${classCode}&fromStationCode=${fromCode}&quota=${quota}&toStationCode=${toCode}&trainNo=${trainNumber}&date=${dateStr}`;
      const resp = await fetch(url, { headers: this.headers() });
      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      return await resp.json();
    } catch (err) {
      return { error: 'fetch_error', message: err.message };
    }
  },

  /** Get PNR status */
  async getPNRStatus(pnr) {
    if (!this.apiKey) {
      return { error: 'no_key', message: 'Please add your RapidAPI key in Settings ⚙️' };
    }
    try {
      const url = `${this.baseUrl}/api/v1/pnrStatus?pnrNumber=${pnr}`;
      const resp = await fetch(url, { headers: this.headers() });
      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      return await resp.json();
    } catch (err) {
      return { error: 'fetch_error', message: err.message };
    }
  },

  /** Search station by name */
  async searchStation(query) {
    if (!this.apiKey) {
      return { error: 'no_key', message: 'Please add your RapidAPI key in Settings ⚙️' };
    }
    try {
      const url = `${this.baseUrl}/api/v1/searchStation?query=${encodeURIComponent(query)}`;
      const resp = await fetch(url, { headers: this.headers() });
      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      return await resp.json();
    } catch (err) {
      return { error: 'fetch_error', message: err.message };
    }
  },

  /** Get train name by number (uses local fallback data first) */
  async getTrainInfo(trainNumber) {
    // Check local popular trains first
    const local = POPULAR_TRAINS.find(t => t.number === String(trainNumber));
    if (local) return { found: true, ...local };
    // Try API
    try {
      const schedule = await this.getTrainSchedule(trainNumber);
      if (schedule?.data) {
        return { found: true, number: trainNumber, name: schedule.data.train_name || 'Unknown Train' };
      }
    } catch {}
    return { found: false, number: trainNumber, name: 'Train ' + trainNumber };
  },
};

/* ── Popular South Indian / common trains ── */
const POPULAR_TRAINS = [
  { number: '12163', name: 'Chennai Egmore - Dadar Express', from: 'MS', to: 'DR' },
  { number: '17229', name: 'Sabari Express', from: 'HYB', to: 'TVC' },
  { number: '12722', name: 'Dakshin Express', from: 'HYB', to: 'NDLS' },
  { number: '12723', name: 'Telangana Express', from: 'HYB', to: 'NDLS' },
  { number: '17057', name: 'Devagiri Express', from: 'HYB', to: 'CSTM' },
  { number: '12026', name: 'Shatabdi Express', from: 'SC', to: 'VSKP' },
  { number: '12863', name: 'Howrah SF Express', from: 'HWH', to: 'YPR' },
  { number: '12296', name: 'Sanghamitra Express', from: 'PNBE', to: 'SBC' },
  { number: '22416', name: 'AP Express (New)', from: 'HYB', to: 'NDLS' },
  { number: '12734', name: 'Narayanadri Express', from: 'SC', to: 'VSKP' },
  { number: '17015', name: 'Visakha Express', from: 'SC', to: 'VSKP' },
  { number: '12758', name: 'Kaghaznagar Express', from: 'SC', to: 'KGZ' },
  { number: '12760', name: 'Charminar Express', from: 'SC', to: 'MAS' },
  { number: '12709', name: 'Simhapuri Express', from: 'SC', to: 'VSKP' },
  { number: '12603', name: 'Hyderabad Express', from: 'MAS', to: 'HYB' },
  { number: '17001', name: 'Hyderabad - SC Intercity', from: 'HYB', to: 'SC' },
  { number: '12659', name: 'Gudan Express', from: 'SC', to: 'SHM' },
  { number: '22707', name: 'Vande Bharat Express', from: 'SC', to: 'VSKP' },
  { number: '20701', name: 'Vande Bharat Express (HYB-BZA)', from: 'HYB', to: 'BZA' },
  { number: '12647', name: 'Kongu Express', from: 'CBE', to: 'NDLS' },
  { number: '12621', name: 'Tamil Nadu Express', from: 'MAS', to: 'NDLS' },
  { number: '12433', name: 'Rajdhani Express', from: 'HWH', to: 'NDLS' },
  { number: '12951', name: 'Mumbai Rajdhani', from: 'MMCT', to: 'NDLS' },
  { number: '12309', name: 'Rajdhani Express', from: 'PNBE', to: 'NDLS' },
  { number: '19031', name: 'Yoga Express', from: 'ADI', to: 'HAWR' },
  { number: '16093', name: 'Lucknow - Coimbatore Express', from: 'LKO', to: 'CBE' },
  { number: '12076', name: 'Jan Shatabdi', from: 'BZA', to: 'SC' },
  { number: '17264', name: 'Narsapur Express', from: 'NSP', to: 'HYB' },
  { number: '12975', name: 'Jaipur SF Express', from: 'JP', to: 'MYSURU' },
  { number: '22691', name: 'Rajdhani Express', from: 'SBC', to: 'NDLS' },
];

/* ── Train class codes ── */
const TRAIN_CLASSES = [
  { code: '1A', label: '1A', name: 'First AC' },
  { code: '2A', label: '2A', name: 'Second AC' },
  { code: '3A', label: '3A', name: 'Third AC' },
  { code: '3E', label: '3E', name: 'Third AC Economy' },
  { code: 'SL', label: 'SL', name: 'Sleeper' },
  { code: 'CC', label: 'CC', name: 'Chair Car' },
  { code: 'EC', label: 'EC', name: 'Executive Chair Car' },
  { code: '2S', label: '2S', name: 'Second Sitting' },
];

const QUOTA_TYPES = [
  { code: 'GN', label: 'General' },
  { code: 'TQ', label: 'Tatkal' },
  { code: 'PT', label: 'Premium Tatkal' },
  { code: 'LD', label: 'Ladies' },
  { code: 'DF', label: 'Divyaang' },
];

window.TRAIN_API = TRAIN_API;
window.POPULAR_TRAINS = POPULAR_TRAINS;
window.TRAIN_CLASSES = TRAIN_CLASSES;
window.QUOTA_TYPES = QUOTA_TYPES;
