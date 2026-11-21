const CACHE_NAME = 'arp-notifier-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/themes.css',
  './css/animations.css',
  './js/app.js',
  './js/firebase-config.js',
  './js/arp-calculator.js',
  './js/train-api.js',
  './js/festivals.js',
  './js/events-manager.js',
  './js/ui-components.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch(() => {})
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - Network First for API, Cache First for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin API calls (let them go to network)
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('rapidapi') || url.hostname.includes('firestore')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// Background sync for saving events
self.addEventListener('sync', (event) => {
  if (event.tag === 'save-event') {
    event.waitUntil(syncSavedEvents());
  }
});

async function syncSavedEvents() {
  // Sync pending events when back online
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'SYNC_EVENTS' }));
}
