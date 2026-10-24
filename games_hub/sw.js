// Service Worker for 수학 게임 왕국
const CACHE_NAME = 'math-games-v29';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './games/math_kingdom.html',
  './games/algebra.html',
  './games/detective.html',
  './games/graph.html',
  './games/factor.html',
  './games/sqrt.html',
  './study/gongsu1.html',
  './study/micalc2.html',
  './study/micalc2_4pt.html',
  './study/gongsu1_4pt.html',
  './study/micalc2_killer.html',
  './study/equation.html',
  './study/divisor.html',
  './study/ratio.html',
  './study/poly_eq.html',
  './study/middle1.html',
  './study/middle2.html',
  './study/middle3.html',
  './study/finland.html',
  './study/korea_prob.html',
  './study/finland_adv.html',
];

// Install: pre-cache all game files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching game files...');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      console.log('[SW] Pre-cache complete');
      return self.skipWaiting();
    })
  );
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy (offline support)
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache successful GET responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        if (event.request.method !== 'GET') return response;

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
