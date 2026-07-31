const CACHE_NAME = "sb-english-tuition-v4.0-student-1";
const urlsToCache=[
"./",
"./index.html",
"./manifest.json",
"./icon-192.png",
"./icon-512.png",
"./css/style.css",
"./js/app.js",
"./js/auth.js",
"./js/students.js",
"./students.html",
"./admin.html"
];

self.addEventListener("install",e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET") return;
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
