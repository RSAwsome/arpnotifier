const CACHE_NAME = 'arp-notifier-v2.1.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/themes.css',
  './css/animations.css',
  './js/app.js?v=2.0.0',
  './js/firebase-config.js?v=2.0.0',
  './js/arp-calculator.js?v=2.0.0',
  './js/train-api.js?v=2.0.0',
  './js/festivals.js?v=2.0.0',
  './js/events-manager.js?v=2.0.0',
  './js/ui-components.js?v=2.0.0',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch(() => {})
  );
});

// Activate - Purge all old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - Network First for app scripts, Cache fallback for offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('firestore') || url.hostname.includes('firebase')) return;
  if (url.pathname.startsWith('/api/')) return;

  // Network-first for HTML and JS to ensure latest updates
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname === '/' || url.pathname.endsWith('/arpnotifier/')) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache first for static images and styles
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
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
