// SERVICE WORKER UNINSTALL - Removes all caching
console.log('[SW] Self-destructing service worker');

self.addEventListener('install', (event) => {
  console.log('[SW] Uninstalling self');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating - clearing all caches');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('[SW] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});
