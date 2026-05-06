const CACHE_NAME = 'evaluandonos-v2026-final';
const urlsToCache = [
  './',
  './index.html',
  './app-manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  console.log('SW Evaluándonos: Instalando...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW Evaluándonos: Cacheando archivos...');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('SW Evaluándonos: Error al cachear:', err);
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('SW Evaluándonos: Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).catch(() => {
          // Opcional: retornar fallback offline aquí
        });
      })
  );
});

