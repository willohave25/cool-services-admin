/* Service Worker — CSAI Admin PWA */
var CACHE_NAME = 'csai-admin-v2';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(['/', '/index.html', '/logocesai-trans.png']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return; // ne jamais mettre l'API en cache
  e.respondWith(
    fetch(e.request).then(function (response) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(e.request, clone);
      });
      return response;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
