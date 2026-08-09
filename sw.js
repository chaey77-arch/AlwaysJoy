// 캐시 이름 — 앱 파일을 수정하면 이 버전을 올린다
// (이름이 바뀌면 activate 에서 예전 캐시를 지운다. localStorage 의
//  'ajoy_' 접두사는 건드리지 않는다 — 그건 사용자 기록이라 바꾸면 다 날아간다)
const CACHE_NAME = 'alwaysjoy-v22';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  // 시간대별 테마 — 오프라인에서도 세 시간대 모두 정상 표시되도록 전부 캐시
  './css/theme-sky.css',
  './css/theme-mint.css',
  './css/theme-peach.css',
  // 유리(F) — 이제 평소 화면이다. 없으면 오프라인에서 덧칠이 안 입혀져
  // 예전 화면이 나온다. 위의 세 시간대 테마는 ?theme=sky 로 견줘 볼 때 쓴다.
  './css/theme-glass.css',
  './css/theme-glass-night.css',
  './js/data.js',
  './js/bible-story.js',
  './js/bible-read.js',
  './js/cloud.js',
  './js/photos.js',
  './js/voice.js',
  './js/games.js',
  './js/app.js',
  './manifest.json',
  './icons/icon.svg',
  // 시간대별 캐릭터
  './icons/char-sun.svg',
  './icons/char-forest.svg',
  './icons/char-jesus.svg'
];

// 설치: 핵심 파일 캐시
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 활성화: 구 캐시 정리
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 요청: 네트워크 우선 + 캐시 폴백 (stale-while-revalidate)
// 캐시 우선이면 수정한 HTML/CSS/JS 가 영구히 반영되지 않으므로 순서를 뒤집었다.
// 오프라인일 때만 캐시를 쓰기 때문에 PWA 오프라인 지원은 그대로 유지된다.
self.addEventListener('fetch', e => {
  const req = e.request;

  // GET 이외(POST 등)와 외부 도메인(구글 폰트 등)은 그대로 통과
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        // 정상 응답이면 캐시를 갱신해 다음 오프라인 접속에 대비
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        // 네트워크 실패(오프라인) → 캐시, 그마저 없으면 index.html
        caches.match(req).then(cached => cached || caches.match('./index.html'))
      )
  );
});

// 동반자 알림: 메인 앱에서 메시지로 스케줄 요청
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_COMPANION') {
    scheduleCompanionNotification(e.data.payload);
  }
});

function scheduleCompanionNotification({ title, body, delay }) {
  setTimeout(() => {
    self.registration.showNotification(title, {
      body,
      icon: './icons/icon.svg',
      badge: './icons/icon.svg',
      vibrate: [200, 100, 200],
      tag: 'companion',
      renotify: true,
      actions: [
        { action: 'open', title: '열기' },
        { action: 'pray', title: '🙏 기도할게요' }
      ]
    });
  }, delay || 0);
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
