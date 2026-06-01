const CACHE_NAME = 'eval-cache-v112';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json',
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
  self.clients.claim(); // Toma el control inmediatamente
});

// Estrategia Network First (Red primero, luego caché)
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET o esquemas no soportados por la caché (ej. chrome-extension)
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Actualizamos la caché con la respuesta de red si es válida
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache).catch(err => console.log("Cache ignorada:", err));
          });
        }
        return response;
      })
      .catch(() => {
        // Si no hay red, buscamos en la caché
        return caches.match(event.request);
      })
  );
});
