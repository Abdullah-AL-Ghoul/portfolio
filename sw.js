/* ============================================
   Abdullah AL-Ghoul · Portfolio Service Worker
   Offline support + same-origin asset caching.
   Strategy: cache-first for assets, network-first
   for navigations (fresh HTML wins when online).
   ============================================ */

const CACHE = 'abdullah-portfolio-v5';
const MAX_CACHE_ITEMS = 60;

// Core shell — cached at install time for offline first paint.
const CORE = [
  './',
  './index.html',
  './404.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './assets/profile-600.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Trim cache to max items (keep newest)
async function trimCache(name, maxItems) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await Promise.all(keys.slice(0, keys.length - maxItems).map((key) => cache.delete(key)));
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Navigations: network-first, fall back to cache, then to cached index.html.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match('./index.html'))
        )
    );
    return;
  }

  // Same-origin static assets: cache-first, then network + fill cache.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((hit) => {
        if (hit) return hit;
        return fetch(request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => {
              cache.put(request, copy);
              trimCache(CACHE, MAX_CACHE_ITEMS);
            });
          }
          return response;
        }).catch(() => new Response('', { status: 408, statusText: 'Offline' }));
      })
    );
    return;
  }

  // Third-party CDN assets (fallback): stale-while-revalidate.
  if (url.origin === 'https://unpkg.com') {
    event.respondWith(
      caches.match(request).then((hit) => {
        const network = fetch(request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => {
              cache.put(request, copy);
              trimCache(CACHE, MAX_CACHE_ITEMS);
            });
          }
          return response;
        }).catch(() => hit);
        return hit || network;
      })
    );
  }
});
