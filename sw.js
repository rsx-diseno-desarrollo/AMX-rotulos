// sw.js

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      await self.clients.claim(); // ⚠️ IMPORTANTE
    })()
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // ✅ SOLO CONTROLAR NAVEGACIÓN (esto activa modo PWA)
  if (event.request.mode === 'navigate') {

    event.respondWith(
      fetch(event.request).catch(() => {

        return new Response(`
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <title>Sin conexión</title>
            <style>
              body {
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                height:100vh;
                font-family:'Segoe UI', Tahoma, sans-serif;
                text-align:center;
                color:#424242;
                margin:0;
                background:#F4F6F8;
              }
              h2 { color:#1E73BE; margin-bottom:10px; }
              p { font-size:1.2em; }
            </style>
          </head>
          <body>
            <h2>Sin conexión</h2>
            <p>No se puede cargar la app.</p>
          </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });

      })
    );

  } else {
    // 🔹 Todo lo demás: no interceptar (simple)
    return;
  }
});
