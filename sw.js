// Agenda VD Gestantes · service worker
// Guarda la app para abrirla rápido y sin internet. Los datos de la hoja NO se guardan aquí.
const VERSION = 'agenda-vd-v10';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon-32.png'];

self.addEventListener('install', e => {
  // si falta algún archivo, el resto igual se guarda (no bloquea la instalación)
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // las lecturas/escrituras a Google van directo
  const url = new URL(req.url);
  if (url.hostname.endsWith('script.google.com') || url.hostname.endsWith('googleusercontent.com')) return;
  // la página: primero internet (para recibir actualizaciones), si no hay, la copia guardada
  if (req.mode === 'navigate' || url.pathname.endsWith('index.html')) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('./index.html', c)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // íconos, manifiesto y fuentes: copia guardada primero
  if (url.origin === location.origin || url.hostname.includes('fonts.g')) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); }
      return r;
    })));
  }
});
