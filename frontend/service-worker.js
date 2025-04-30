const cacheName = 'crowdfund-v1';
const staticAssets = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/assets/logo.png',
  '/assets/bg.jpg',
  '/assets/banner.jpg',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching static assets...');
      return cache.addAll(staticAssets);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (!cacheWhitelist.includes(cache)) {
            console.log('Removing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
