// 自動產生（vite.config.js pwaServiceWorker），勿手改
const CACHE = 'b2past-2026-11-28T16:24:00.287Z'
const MUSIC_CACHE = 'b2past-music'
// 目前版本用得到的配樂檔（相對 SW 所在目錄）；不在清單裡的舊檔在 activate 時清掉
const MUSIC_FILES = ["music/battle_lose.44d84079ea.webm","music/battle_lose.44d84079ea.m4a","music/battle_mob.aecb9838c6.webm","music/battle_mob.aecb9838c6.m4a","music/battle_win.529d15efa2.webm","music/battle_win.529d15efa2.m4a","music/boss_ch1.48087703d3.webm","music/boss_ch1.48087703d3.m4a","music/boss_ch2.f252d21e33.webm","music/boss_ch2.f252d21e33.m4a","music/boss_ch3.c99ef4195b.webm","music/boss_ch3.c99ef4195b.m4a","music/boss_ch4.035f0faaef.webm","music/boss_ch4.035f0faaef.m4a","music/boss_ch5.fc41bb552a.webm","music/boss_ch5.fc41bb552a.m4a","music/boss_ch6.c39990db61.webm","music/boss_ch6.c39990db61.m4a","music/boss_ch7.a98b3c7a45.webm","music/boss_ch7.a98b3c7a45.m4a","music/cut_light1.6c8645a62c.webm","music/cut_light1.6c8645a62c.m4a","music/cut_light2.ff4af4f6ed.webm","music/cut_light2.ff4af4f6ed.m4a","music/end_alone.ec885097be.webm","music/end_alone.ec885097be.m4a","music/end_cycle.d967614315.webm","music/end_cycle.d967614315.m4a","music/end_jiyanran.6df16d74f8.webm","music/end_jiyanran.6df16d74f8.m4a","music/end_qinqing.04dba9efe1.webm","music/end_qinqing.04dba9efe1.m4a","music/end_shanrou.ffa79af92d.webm","music/end_shanrou.ffa79af92d.m4a","music/end_wutingfang.6b23d70096.webm","music/end_wutingfang.6b23d70096.m4a","music/end_zhaoqian.b96b4f63f4.webm","music/end_zhaoqian.b96b4f63f4.m4a","music/ending_soft.15305c4ee2.webm","music/ending_soft.15305c4ee2.m4a","music/map_ch1.03c438fe5c.webm","music/map_ch1.03c438fe5c.m4a","music/map_ch2.e87a2f5aaa.webm","music/map_ch2.e87a2f5aaa.m4a","music/map_ch3.2e910d82f7.webm","music/map_ch3.2e910d82f7.m4a","music/map_ch4.ebeeda6333.webm","music/map_ch4.ebeeda6333.m4a","music/map_ch5.74b7b84a75.webm","music/map_ch5.74b7b84a75.m4a","music/map_ch6.304a1c7a5b.webm","music/map_ch6.304a1c7a5b.m4a","music/map_ch7.809813ddbe.webm","music/map_ch7.809813ddbe.m4a","music/pool_b1.0987224cff.webm","music/pool_b1.0987224cff.m4a","music/pool_b2.24978ef6ad.webm","music/pool_b2.24978ef6ad.m4a","music/pool_b3.1f1f81d406.webm","music/pool_b3.1f1f81d406.m4a","music/pool_b5.c89e5b08b5.webm","music/pool_b5.c89e5b08b5.m4a","music/pool_b6.8665adbbc5.webm","music/pool_b6.8665adbbc5.m4a","music/pool_b7.a735de1fe7.webm","music/pool_b7.a735de1fe7.m4a","music/pool_r1.e132d014ea.webm","music/pool_r1.e132d014ea.m4a","music/pool_r2.98b9c44d6e.webm","music/pool_r2.98b9c44d6e.m4a","music/pool_r4.5a4349ba2d.webm","music/pool_r4.5a4349ba2d.m4a","music/pool_r6.ba673e4c4f.webm","music/pool_r6.ba673e4c4f.m4a","music/rboss_ch1.4269b991d2.webm","music/rboss_ch1.4269b991d2.m4a","music/rboss_ch2.d81546df43.webm","music/rboss_ch2.d81546df43.m4a","music/rboss_ch3.cbe3e9cf94.webm","music/rboss_ch3.cbe3e9cf94.m4a","music/rboss_ch4.534437c3e0.webm","music/rboss_ch4.534437c3e0.m4a","music/rboss_ch5.cff239ca74.webm","music/rboss_ch5.cff239ca74.m4a","music/rboss_ch6.30644c1bb6.webm","music/rboss_ch6.30644c1bb6.m4a","music/rboss_ch7.1d8c3b56e6.webm","music/rboss_ch7.1d8c3b56e6.m4a"]
// app shell：只有這些在安裝時預抓（其餘資產用到才快取，見 fetch handler）
const FILES = ["assets/index-BxVBswAx.css","assets/index-DM3ZKpR5.js","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png"]

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

const NAV_TIMEOUT_MS = 5000
// 沒有快取時，網路再多等這麼久（總共）才放棄，給「需要網路才能第一次載入」的提示，不要無限白畫面
const NAV_NO_CACHE_MAX_MS = 20000

// 頁面請求：網路與 5 秒計時賽跑。網路先回（就算是 404/500 也照舊交給頁面）→ 用新版；
// 網路失敗或 5 秒到 → 有快取就用快取；連快取都沒有 → 繼續等網路到上限，再不行就回離線提示頁。
function navigate(req) {
  const ctrl = new AbortController()
  const net = fetch(req, { cache: 'no-store', signal: ctrl.signal })
  const cached = () => caches.match('index.html')
  return new Promise((done) => {
    let settled = false
    const finish = (res) => { if (!settled) { settled = true; done(res) } }
    const useCacheOr = (fallback) => cached().then((hit) => {
      if (settled) return
      if (hit) { ctrl.abort(); finish(hit) } else fallback()
    }, fallback)
    // 已經交出回應就不能再 abort（會把正在傳的網路回應砍斷）
    const giveUp = () => { if (settled) return; ctrl.abort(); finish(offlinePage()) }
    const timer = setTimeout(() => useCacheOr(() => {
      // 沒快取：再等網路一下（慢但有回應的網路還是拿得到），到上限就給提示
      setTimeout(giveUp, NAV_NO_CACHE_MAX_MS - NAV_TIMEOUT_MS)
    }), NAV_TIMEOUT_MS)
    net.then((res) => { clearTimeout(timer); finish(res) },
      () => { clearTimeout(timer); useCacheOr(giveUp) })
  })
}

function offlinePage() {
  const html = '<!doctype html><html lang="zh-Hant"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><title>逆旅千年</title></head>' +
    '<body style="margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
    'gap:16px;background:#000;color:#e8c770;font-size:17px;letter-spacing:1px;text-align:center;padding:0 20px">' +
    '<div>目前連不上網路</div><div style="font-size:14px;color:#b7a889">第一次開啟遊戲需要網路才能下載，請連上網路後再試</div>' +
    '<button onclick="location.reload()" style="padding:10px 22px;font-size:16px;background:#46361a;color:#ffe08a;' +
    'border:1px solid #c9a24b;border-radius:8px">重新載入</button></body></html>'
  return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

// 注意：這段是 template literal，regex 的反斜線要寫兩次。原本寫一次 → 產出的 sw.js 變成
// (url) => //music/... 被當成註解，下一行的 fetch 監聽器被吞進 isMusic 的函式本體，
// **sw.js 從 #212 起完全沒有 fetch handler**，離線快取從來沒生效（gh#441 查到；build 時有 checkSw 把關）。
const isMusic = (url) => /\/music\/[^/]+\.(webm|m4a)$/.test(url.pathname)

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  // 頁面本身：先問網路（才拿得到新版），**最多等 NAV_TIMEOUT_MS**，逾時或失敗就用快取（gh#441）。
  // 原本 fetch 沒有逾時：完全斷線會很快失敗走快取，但「有訊號連不上」（行動網路很弱、Wi-Fi 沒對外、
  // 公共 Wi-Fi 要登入）時 fetch 會一直掛著、不會進 catch，畫面就卡死進不了遊戲。
  if (req.mode === 'navigate') {
    e.respondWith(navigate(req))
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
