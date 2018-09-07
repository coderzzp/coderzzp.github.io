'use strict';

var cacheVersion = 0;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'offline.html';

// 注册service workder时会触发一次,缓存资源
this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      // 缓存
      return cache.addAll([
          './offline.svg',
          offlineUrl
      ]);
    })
  );
});

this.addEventListener('fetch', event => {
  console.log('event request ------->'+ event.request)
  // 请求页面
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        // Return the offline page
        return caches.match(offlineUrl);
      })
    );
  }
  // 请求图片
  else{
    event.respondWith(caches.match(event.request)
        .then(function (response) {
        return response || fetch('https://www.apiopen.top/satinApi?type=1&page=1').then(res=>{res.json().then(({data})=>console.log(data[0].text))})
      })
    );
  }
});