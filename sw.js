/* The Inner Grail — offline shell (cache-first for the app, network for the Oracle) */
const CACHE = "inner-grail-v1";
const SHELL = ["./", "index.html", "astronomy-engine.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.pathname.includes("oracle") || u.pathname.includes("feed")) return; // live lanes stay live
  e.respondWith(
    caches.match(e.request).then(hit => hit ||
      fetch(e.request).then(r => {
        if (r.ok && u.origin === location.origin) { const cl = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
        return r;
      }).catch(() => caches.match("index.html"))
    )
  );
});
