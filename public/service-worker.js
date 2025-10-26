// Basic offline caching service worker
const CACHE_NAME = 'toolchest-cache-v1';
const URLS_TO_CACHE = ['/', '/index.html', '/manifest.json'];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

    
      return fetch(event.request).catch(() => {

        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});


// Activate (clean up old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});
