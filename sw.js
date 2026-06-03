const CACHE_NAME = "amx-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles.css",
  "./specs.xlsx",
  "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"
];

// INSTALAR
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ACTIVAR
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// FETCH (modo offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return new Response(`
          <h2>Sin conexión</h2>
          <p>La app no puede cargar sin internet.</p>
        `, {
          headers: { "Content-Type": "text/html" }
        });
      })
  );
});
