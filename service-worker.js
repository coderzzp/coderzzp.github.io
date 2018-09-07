'use strict';

var cacheVersion = 0;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'offline.html';

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
          './offline.svg',
          offlineUrl
      ]);
    })
  );
});

// 当service-woker注册后，监听页面的请求
this.addEventListener('fetch', event => {
  // 直接请求，请求不到返回离线页面
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
      event.respondWith(
        fetch(event.request.url).catch(error => {
          // Return the offline page
          return caches.match(offlineUrl);
        })
     );
  }
  // 先请求缓存
  else{
    event.respondWith(caches.match(event.request)
        .then(function (response) {
        return response || fetch('https://www.apiopen.top/satinApi?type=1&page=1').then(res=>{res.json().then(({data})=>console.log(data[0].text))})
      })
    );
  }
});