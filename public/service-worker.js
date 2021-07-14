// Service Worker
const FILES_TO_CACHE = [
	"/",
	"/index.html",
	"/index.js",
	"/styles.css",
	"/icons/icon-192x192.png",
	"/icons/icon-512x512.png",
	"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
	"https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

// Pre-cache, installing service-worker
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(PRECACHE)
			.then((cache) => cache.addAll(FILES_TO_CACHE))
			.then(self.skipWaiting())
	);
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
	const currentCaches = [PRECACHE, RUNTIME];
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return cacheNames.filter(
					(cacheName) => !currentCaches.includes(cacheName)
				);
			})
			.then((cachesToDelete) => {
				return Promise.all(
					cachesToDelete.map((cacheToDelete) => {
						return caches.delete(cacheToDelete);
					})
				);
			})
			.then(() => self.clients.claim())
	);
});

// Information retrieval from cache
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				// if cache is available, respond with cache
				console.log("Responding with cache ---> " + cachedResponse);
				return cachedResponse;
			} else {
				// else try fetching event.request
				console.log("No cachedResponse, running fetch ---> " + event.request);
				return fetch(event.request)
			}

			// return caches.open(RUNTIME).then((cache) => {
			// 	return fetch(event.request).then((response) => {
			// 		return cache.put(event.request, response.clone()).then(() => {
			// 			return response;
			// 		});
			// 	});
			// });
		})
	);
});

