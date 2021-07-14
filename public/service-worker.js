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
	console.log("THIS IS A FETCH FOR ---> ", event)
	console.log("THIS IS A FETCH FOR EVENT URL ---> ", event.request.url)
	if (event.request.url.startsWith(self.location.origin)) {
		event.respondWith(
			caches.match(event.request).then((cachedResponse) => {
				if (cachedResponse) {
					return cachedResponse;
				}

				return caches.open(RUNTIME).then((cache) => {
					return fetch(event.request).then((response) => {
						return cache.put(event.request, response.clone()).then(() => {
							return response;
						});
					});
				});
			})
		);
	}
});
// self.addEventListener("fetch", (event) => {
// 	console.log("This is a fetch request ---> " + event.request.url);
// 	event.respondWith(
// 		caches.match(event.request).then((request) => {
// 			if (request) {
// 				// if cache is available, respond with cache
// 				console.log("Responding with cache ---> " + event.request.url);
// 				return request;
// 			} else {
// 				// else if no cache, try fetching request
// 				console.log("File was not cached, fetching ---> " + event.request.url);
// 				//   console.log(e.request.url)
// 				return fetch(event.request);
// 			}
// 		})
// 	);
// });
