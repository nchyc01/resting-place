// 小夜的旅行 - Service Worker
// 让游戏可以安装为PWA应用

const CACHE_NAME = 'ye-travel-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // 网络优先，缓存后备
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // 缓存成功的响应（只缓存图片和静态资源）
        if (res.status === 200 && e.request.method === 'GET') {
          const url = new URL(e.request.url);
          const ext = url.pathname.split('.').pop().toLowerCase();
          if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'ico', 'css', 'js', 'html', 'json'].includes(ext)) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          }
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
