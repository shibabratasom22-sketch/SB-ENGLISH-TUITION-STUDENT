const CACHE_NAME = "sb-english-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./students.html",
  "./admin.html",
  "./css/style.css",
  "./js/app.js",
  "./js/auth.js",
  "./js/students.js",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
