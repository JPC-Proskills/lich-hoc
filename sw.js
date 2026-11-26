/* Bump VERSION whenever application assets change. Public schedules bypass this cache. */
const VERSION='1.1.5';
const PREFIX='proskills-shell:'+new URL(self.registration.scope).pathname+':';
const CACHE=PREFIX+VERSION;
const ASSETS=["./","index.html","app.js","bvp-latin-400.woff2","bvp-latin-500.woff2","bvp-latin-600.woff2","bvp-latin-700.woff2","bvp-latin-ext-400.woff2","bvp-latin-ext-500.woff2","bvp-latin-ext-600.woff2","bvp-latin-ext-700.woff2","bvp-vietnamese-400.woff2","bvp-vietnamese-500.woff2","bvp-vietnamese-600.woff2","bvp-vietnamese-700.woff2","colors.js","config.js","core.js","feed-core.js","fonts.css","greetings.js","m3.css","manifest.webmanifest","material-symbols-rounded.woff2","mobile.css","polish.css","mobile-ui.js","modes.css","modes.js","nunito-variable.ttf","pwa.js","release.css","seed.js","student-sync.js","student-core.js","student-ui.js","schedule-navigation.js","lesson-order.js","workload.js","schedule.css","ui.js","assets/app-192.png","assets/app-512.png","assets/app-dark-192.png","assets/app-dark-512.png","assets/apple-touch-dark.png","assets/apple-touch-icon.png","assets/favicon-32.png","assets/launcher-dark.svg","assets/logo-goc.png","assets/maskable-512.png","assets/maskable-dark-512.png"];
const ROOT=new URL('./',self.registration.scope);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(p=>new URL(p,ROOT).href)))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname)||url.pathname===new URL('published-schedule.json',ROOT).pathname)return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(new URL('index.html',ROOT).href)||fetch(event.request);})());return;
 }
 const known=ASSETS.some(asset=>new URL(asset,ROOT).href===url.href);if(!known)return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),saved=await cache.match(event.request);return saved||fetch(event.request);})());
});
