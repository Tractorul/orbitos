const CACHE_NAME = "orbit-app-shell-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/tasks",
  "/calendar",
  "/notes",
  "/more",
  "/login",
];

// Install event - precache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn("[SW] Cache install warning:", err);
      })
  );
});

// Activate event - cleanup stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - network-first with cache fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and http/https schemes
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith("http")
  ) {
    return;
  }

  // Handle Supabase API requests separately (let IndexedDB/data layer handle offline data sync)
  if (event.request.url.includes("/rest/v1/") || event.request.url.includes("/auth/v1/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses for static assets and HTML pages
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === "basic" || networkResponse.type === "cors")
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network failed: attempt offline cache fallback
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fallback for navigation requests (HTML pages)
        if (event.request.mode === "navigate") {
          const fallbackShell = await caches.match("/");
          if (fallbackShell) {
            return fallbackShell;
          }
        }

        return new Response("Offline - Orbit cached shell unavailable", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({ "Content-Type": "text/plain" }),
        });
      })
  );
});
