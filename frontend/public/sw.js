// Service Worker for offline caching and performance
const CACHE_NAME = 'gadgetplan-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/offline.html',
    '/logo-gadgetplan-biru.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                    .map((key) => caches.delete(key))
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API calls (always fetch fresh)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version
                return cachedResponse;
            }

            // Fetch from network
            return fetch(request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone response
                    const responseToCache = response.clone();

                    // Cache images and static assets
                    if (
                        request.destination === 'image' ||
                        request.destination === 'style' ||
                        request.destination === 'script'
                    ) {
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }

                    return response;
                })
                .catch(() => {
                    // Offline fallback
                    if (request.destination === 'document') {
                        return caches.match('/offline.html');
                    }
                });
        })
    );
});
