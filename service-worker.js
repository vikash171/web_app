const CACHE_NAME = "web-app-cache-v1";

// ✅ Ye sab files offline available rahenge
const urlsToCache = [
  "/",               // Home page
  "/style.css",      // CSS
  "/script.js",      // JS
  "/download.jpeg",  // Image (download wali file)
  "/manifest.json"   // Manifest
];

self.addEventListener("install", (event) => {
  console.log("🛠 Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching files");
      return cache.addAll(urlsToCache);
    })
  );
});

// ✅ Activate event (purane cache delete karne ke liye)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  console.log("🚀 Service Worker activated");
});

// ✅ Fetch event (offline handling)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar cache me mile to return karo warna network se lao
      return response || fetch(event.request).catch(() => {
        // Agar offline hai aur request HTML hai to fallback page dikhao
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/");
        }
      });
    })
  );
});
