// 自動產生（vite.config.js pwaServiceWorker），勿手改
const CACHE = 'b2past-2026-11-14T08:42:04.514Z'
// app shell：只有這些在安裝時預抓（其餘資產用到才快取，見 fetch handler）
const FILES = ["assets/index-jArjAWA7.css","assets/index-ROI7vvT_.js","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png"]

self.addEventListener('install', (e) => {
  // 逐檔抓、不用 addAll：單一檔案失敗不該讓整個安裝失敗（否則離線永遠不會生效）
  e.waitUntil(caches.open(CACHE).then((c) =>
    Promise.all(FILES.map((f) => c.add(f).catch(() => {})))
  ))
})

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting() })

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k.startsWith('b2past-') && k !== CACHE).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()))
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  // 頁面本身：先問網路（才拿得到新版），沒網路才用快取
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req, { cache: 'no-store' }).catch(() => caches.match('index.html')))
    return
  }
  // 其餘檔案名都帶 hash、不會變 → 先用快取；沒快取就抓網路**並回填**，
  // 這樣玩過的背景／頭像／CG 才會逐步離線可用（原本沒回填，預快取失敗就永遠沒快取）。
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res && res.ok && res.type === 'basic') {
      const copy = res.clone()
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {})
    }
    return res
  })))
})
