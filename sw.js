// 自動產生（vite.config.js pwaServiceWorker），勿手改
const CACHE = 'b2past-2026-11-21T12:37:05.388Z'
const MUSIC_CACHE = 'b2past-music'
// 目前版本用得到的配樂檔（相對 SW 所在目錄）；不在清單裡的舊檔在 activate 時清掉
const MUSIC_FILES = ["music/battle_lose.44d84079ea.webm","music/battle_lose.44d84079ea.m4a","music/battle_mob.aecb9838c6.webm","music/battle_mob.aecb9838c6.m4a","music/battle_win.529d15efa2.webm","music/battle_win.529d15efa2.m4a","music/boss_ch1.48087703d3.webm","music/boss_ch1.48087703d3.m4a","music/boss_ch2.f252d21e33.webm","music/boss_ch2.f252d21e33.m4a","music/boss_ch3.c99ef4195b.webm","music/boss_ch3.c99ef4195b.m4a","music/boss_ch4.035f0faaef.webm","music/boss_ch4.035f0faaef.m4a","music/boss_ch5.fc41bb552a.webm","music/boss_ch5.fc41bb552a.m4a","music/boss_ch6.c39990db61.webm","music/boss_ch6.c39990db61.m4a","music/boss_ch7.a98b3c7a45.webm","music/boss_ch7.a98b3c7a45.m4a","music/cut_light1.6c8645a62c.webm","music/cut_light1.6c8645a62c.m4a","music/end_jiyanran.6df16d74f8.webm","music/end_jiyanran.6df16d74f8.m4a","music/end_zhaoqian.b96b4f63f4.webm","music/end_zhaoqian.b96b4f63f4.m4a","music/end_cycle.d967614315.webm","music/end_cycle.d967614315.m4a","music/end_qinqing.04dba9efe1.webm","music/end_qinqing.04dba9efe1.m4a","music/map_ch1.03c438fe5c.webm","music/map_ch1.03c438fe5c.m4a","music/map_ch2.e87a2f5aaa.webm","music/map_ch2.e87a2f5aaa.m4a","music/map_ch3.2e910d82f7.webm","music/map_ch3.2e910d82f7.m4a","music/map_ch4.ebeeda6333.webm","music/map_ch4.ebeeda6333.m4a","music/map_ch5.74b7b84a75.webm","music/map_ch5.74b7b84a75.m4a","music/map_ch6.304a1c7a5b.webm","music/map_ch6.304a1c7a5b.m4a","music/map_ch7.809813ddbe.webm","music/map_ch7.809813ddbe.m4a","music/pool_b1.0987224cff.webm","music/pool_b1.0987224cff.m4a","music/pool_r6.ba673e4c4f.webm","music/pool_r6.ba673e4c4f.m4a","music/pool_b7.a735de1fe7.webm","music/pool_b7.a735de1fe7.m4a","music/pool_b3.1f1f81d406.webm","music/pool_b3.1f1f81d406.m4a","music/pool_r4.5a4349ba2d.webm","music/pool_r4.5a4349ba2d.m4a","music/pool_b2.24978ef6ad.webm","music/pool_b2.24978ef6ad.m4a","music/rboss_ch1.4269b991d2.webm","music/rboss_ch1.4269b991d2.m4a","music/rboss_ch2.d81546df43.webm","music/rboss_ch2.d81546df43.m4a","music/rboss_ch3.cbe3e9cf94.webm","music/rboss_ch3.cbe3e9cf94.m4a","music/rboss_ch4.534437c3e0.webm","music/rboss_ch4.534437c3e0.m4a","music/rboss_ch5.cff239ca74.webm","music/rboss_ch5.cff239ca74.m4a","music/rboss_ch6.30644c1bb6.webm","music/rboss_ch6.30644c1bb6.m4a","music/end_wutingfang.6b23d70096.webm","music/end_wutingfang.6b23d70096.m4a","music/rboss_ch7.1d8c3b56e6.webm","music/rboss_ch7.1d8c3b56e6.m4a","music/end_alone.ec885097be.webm","music/end_alone.ec885097be.m4a"]
// app shell：只有這些在安裝時預抓（其餘資產用到才快取，見 fetch handler）
const FILES = ["assets/index-k7wQHeEV.css","assets/index-BkK28i7r.js","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png"]

self.addEventListener('install', (e) => {
  // 逐檔抓、不用 addAll：單一檔案失敗不該讓整個安裝失敗（否則離線永遠不會生效）
  e.waitUntil(caches.open(CACHE).then((c) =>
    Promise.all(FILES.map((f) => c.add(f).catch(() => {})))
  ))
})

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting() })

self.addEventListener('activate', (e) => {
  const keepMusic = new Set(MUSIC_FILES.map((f) => new URL(f, self.registration.scope).href))
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k.startsWith('b2past-') && k !== CACHE && k !== MUSIC_CACHE).map((k) => caches.delete(k)))
  ).then(() => caches.open(MUSIC_CACHE)).then((c) => c.keys().then((reqs) =>
    Promise.all(reqs.filter((r) => !keepMusic.has(r.url)).map((r) => c.delete(r)))
  )).then(() => self.clients.claim()))
})

const isMusic = (url) => //music/[^/]+.(webm|m4a)$/.test(url.pathname)

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  // 頁面本身：先問網路（才拿得到新版），沒網路才用快取
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req, { cache: 'no-store' }).catch(() => caches.match('index.html')))
    return
  }
  // 配樂：獨立快取（跨版本保留），先用快取、沒有才下載並回填
  if (isMusic(new URL(req.url))) {
    e.respondWith(caches.open(MUSIC_CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') c.put(req, res.clone()).catch(() => {})
      return res
    }))))
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
