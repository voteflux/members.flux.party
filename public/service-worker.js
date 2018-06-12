const staticAssets = [
    './',
    './app.js',
    './img/flux-mark-optimised.svg',
    './img/flux-text-logo.svg',
]



self.addEventListener("install", async event => {
    const cache = await caches.open('flux-static')
    cache.addAll(staticAssets)
})

self.addEventListener('fetch', event => {
    const req = event.request;
    event.respondWith(cacheFirst(req));
})

async function cacheFirst(req) {
    const cachedResp = await caches.match(req);
    return cachedResp || fetch(req);
}
