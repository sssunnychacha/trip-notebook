// 저장해 둔 것을 바로 보여 주고(빠르고 로밍 데이터 아낌), 뒤에서 새 것을 받아 다음에 열 때 반영
const C = 'trip-20261127152809';
const FILES = ['./', 'index.html', 'vault.json', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const net = fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); return caches.open(C).then(c => c.put(e.request, cp)).then(() => r); } return r; });
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || net.catch(() => caches.match('index.html'))));
  e.waitUntil(net.catch(() => {}));
});
