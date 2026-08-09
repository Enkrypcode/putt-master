const CACHE_NAME = "putting-v3";

const FILES_TO_CACHE = [
    "./",
    "./logo.png",
    "./index.html",
    "./manifest.json",
    "./service-worker.js",
    "./icon-192.png",
    "./icon-512.png",

    // Fonts
    "./fonts/Inter-Regular.ttf",
    "./fonts/BebasNeue-Regular.ttf",
    "./fonts/JetBrainsMono-Regular.ttf"
];


// ─────────────────────────────────────
// INSTALL
// ─────────────────────────────────────

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

});


// ─────────────────────────────────────
// ACTIVATE
// ─────────────────────────────────────

self.addEventListener("activate", event => {

    event.waitUntil(

        Promise.all([

            clients.claim(),

            caches.keys().then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))

                );

            })

        ])

    );

});


// ─────────────────────────────────────
// FETCH
// ─────────────────────────────────────

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
            .then(response => {

                return response || fetch(event.request);

            })

    );

});