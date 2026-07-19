/* The Inner Grail — offline shell.
   NETWORK-FIRST for the app page (so updates always arrive); cache is the offline fallback.
   Cache-first only for the big immutable assets (engine, icons). Live lanes never cached. */
const CACHE = "inner-grail-v2";
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
  const isPage = e.request.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith("index.html") || u.pathname.endsWith("inner_grail.html");
  if (isPage) {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r.ok) { const cl = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
        return r;
      }).catch(() => caches.match(e.request).then(h => h || caches.match("index.html")))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit ||
      fetch(e.request).then(r => {
        if (r.ok && u.origin === location.origin) { const cl = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
        return r;
      }).catch(() => caches.match("index.html"))
    )
  );
});
