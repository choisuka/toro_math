# -*- coding: utf-8 -*-
"""
index.html(원본, 라이브 홈)을 index_pwa.html(구글플레이 앱용 사본)에 동기화한다.

사용법: index.html을 고친 뒤 이 스크립트를 실행하면 된다.
    python _dev/sync_pwa.py

동작:
  1) index.html 전체를 그대로 읽는다.
  2) manifest/아이콘 연결(<head>)과 서비스워커 등록 스크립트(<body> 시작 직후)
     딱 두 곳만 추가해서 index_pwa.html로 새로 쓴다.
  3) index.html에는 아무 영향도 주지 않는다.

기준이 되는 두 앵커 문자열이 index.html에서 사라지면(=head/body 구조가 크게 바뀌면)
조용히 잘못된 사본을 만드는 대신 에러로 멈춘다.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"
DST = ROOT / "index_pwa.html"

HEAD_ANCHOR = '<meta property="og:description" content="직관 · 시각 · 논리 — 세 가지 방식으로 수학을 정복하세요">\n'
HEAD_INSERT = (
    '<link rel="manifest" href="manifest.json">\n'
    '<meta name="theme-color" content="#0f1923">\n'
    '<link rel="icon" href="icons/icon-192.png">\n'
    '<link rel="apple-touch-icon" href="icons/icon-512.png">\n'
)

# 주의: "<body>\n"만 쓰면 인쇄 팝업을 만드는 JS 문자열 안의
# "</style></head><body>" 줄도 우연히 걸린다(그 줄도 "<body>\n"으로 끝나기 때문).
# </head>와 <body>가 줄바꿈으로 분리된 진짜 위치만 잡도록 앞부분까지 포함한다.
BODY_ANCHOR = "</head>\n<body>\n"
BODY_INSERT = (
    "<script>\n"
    "if ('serviceWorker' in navigator) {\n"
    "  window.addEventListener('load', () => {\n"
    "    navigator.serviceWorker.register('./sw.js').catch(() => {});\n"
    "  });\n"
    "}\n"
    "</script>\n"
)


def main():
    text = SRC.read_text(encoding="utf-8")

    if text.count(HEAD_ANCHOR) != 1:
        sys.exit(
            f"[중단] head 기준 문자열이 index.html에서 {text.count(HEAD_ANCHOR)}번 발견됨(1이어야 함). "
            "index.html의 <head> 구조가 바뀐 것 같습니다 — 이 스크립트의 HEAD_ANCHOR를 먼저 확인해 주세요."
        )
    if text.count(BODY_ANCHOR) != 1:
        sys.exit(
            f"[중단] body 기준 문자열이 index.html에서 {text.count(BODY_ANCHOR)}번 발견됨(1이어야 함). "
            "index.html의 <body> 구조가 바뀐 것 같습니다 — 이 스크립트의 BODY_ANCHOR를 먼저 확인해 주세요."
        )

    text = text.replace(HEAD_ANCHOR, HEAD_ANCHOR + HEAD_INSERT, 1)
    text = text.replace(BODY_ANCHOR, BODY_ANCHOR + BODY_INSERT, 1)

    DST.write_text(text, encoding="utf-8")
    print(f"완료: {SRC.name} -> {DST.name} ({len(text.splitlines())}줄)")


if __name__ == "__main__":
    main()
