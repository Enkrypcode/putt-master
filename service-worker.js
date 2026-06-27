const CACHE_NAME = "putting-v2";

const FILES_TO_CACHE = [
    "./",
    "./logo.png",
    "./index.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./fonts/Inter-Regular.otf",
    "./fonts/BebasNeue-Regular.ttf",
    "./fonts/JetBrainsMono-Regular.ttf"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("fetch", event => {

    if (event.request.mode === "navigate") {

        event.respondWith(
            fetch(event.request)
                .then(response => response)
                .catch(() => caches.match("./index.html"))
        );

        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );

});

self.addEventListener("activate", event => {

    event.waitUntil(
        Promise.all([
            clients.claim(),
            caches.keys().then(keys =>
                Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                )
            )
        ])
    );

});

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

});
