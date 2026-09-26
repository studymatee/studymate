const CACHE_NAME = 'mizkarati-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/help.html',
  '/manifest.json',
  '/Logo.png'
];

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(urlsToCache).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; })
             .map(function(n){ return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request).catch(function(){
        return caches.match('/index.html');
      });
    })
  );
});
