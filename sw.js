// 토로매쓰 서비스워커 — 최소한의 "앱 껍질"만 캐시한다.
// 이 저장소는 middle.html/high.html/gongsu2.html처럼 자주 바뀌는 대용량 단일 파일이 많아서,
// 그런 파일까지 적극 캐시하면 낡은 내용을 보여줄 위험이 크다. 그래서:
//  - 홈(index.html)과 아이콘/매니페스트만 설치 시점에 캐시한다.
//  - 탐색(navigate) 요청은 항상 네트워크를 먼저 쓰고, 실패할 때만 캐시/오프라인 페이지로 대체한다.
//  - 그 외 페이지(middle.html 등)는 캐시하지 않고 네트워크에만 맡긴다 — 오프라인에서는 안 열리는 게 정상이다.
const CACHE_NAME = 'toro-math-shell-v1';
const SHELL = [
  './',
  './index_pwa.html',
  './manifest.json',
  './offline.html',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // 페이지 이동(주소 직접 입력, 링크 클릭, TWA 시작 등)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then((cached) => cached || caches.match('./offline.html'))
      )
    );
    return;
  }

  // 앱 껍질에 포함된 파일만 캐시 우선, 나머지는 그냥 네트워크로
  // ('./'는 endsWith('')가 항상 참이 되어 모든 요청에 걸리므로 매칭 대상에서 제외)
  const url = new URL(req.url);
  const shellFiles = SHELL.filter((p) => p !== './');
  if (url.origin === self.location.origin && shellFiles.some((p) => url.pathname.endsWith(p.replace('./', '')))) {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
  }
});
