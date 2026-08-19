# Google Play 등록 방법 (TWA)

## 전제 조건
- ✅ Netlify 배포 완료 (예: https://math-games-kingdom.netlify.app)
- ✅ Google Play 개발자 계정 ($25 일회성 등록비)
  - https://play.google.com/console/signup

---

## 방법: PWABuilder 사용 (가장 쉬움, 무료)

### 1단계: PWABuilder에서 APK 생성
1. https://www.pwabuilder.com 접속
2. Netlify URL 입력 후 "Start" 클릭
3. PWA 점수 확인 (manifest, sw.js가 있으면 높은 점수)
4. "Package for stores" → "Android" 선택
5. 아래 설정 입력:
   - **Package ID**: `com.mathgames.kingdom`
   - **App name**: `수학 게임 왕국`
   - **App version**: `1`
   - **Version name**: `1.0.0`
   - **Signing key**: "New" 선택 (처음이면 자동 생성)
6. "Generate" → ZIP 파일 다운로드

### 2단계: SHA256 지문 업데이트
PWABuilder가 서명 키를 생성하면 SHA256 fingerprint를 알려줍니다.
→ `.well-known/assetlinks.json` 파일의 "REPLACE_WITH_YOUR_SHA256_FINGERPRINT" 부분을
   실제 값으로 교체 후 Netlify에 재업로드

### 3단계: Google Play Console 업로드
1. https://play.google.com/console 접속
2. "앱 만들기" → "앱 이름: 수학 게임 왕국" → 게임 선택
3. 왼쪽 메뉴 → "프로덕션" → "새 버전 만들기"
4. PWABuilder에서 받은 `.aab` 파일 업로드
5. 스토어 등록 정보 입력:
   - **앱 설명**: 중학교 수학을 게임으로 재미있게 배우는 앱
   - **스크린샷**: 최소 2장 (핸드폰 화면 캡처)
   - **아이콘**: 512×512 PNG (make_icons.py로 생성한 파일)
   - **카테고리**: 교육
6. "검토를 위해 제출"

### 4단계: 심사 대기
- 일반적으로 3~7일 소요
- 승인 후 Play Store에서 "수학 게임 왕국" 검색 가능

---

## 비용 요약
| 항목 | 비용 |
|------|------|
| Google Play 개발자 계정 | $25 (일회성) |
| PWABuilder | 무료 |
| Netlify 호스팅 | 무료 |
| **합계** | **$25 (약 35,000원)** |

---

## 업데이트 방법 (이후)
게임 내용 수정 → copy_games.bat 실행 → Netlify 재업로드
→ 앱을 새로 제출할 필요 없음! (Netlify URL 내용이 바뀌면 앱도 자동 업데이트)

이것이 TWA의 최대 장점: 웹을 수정하면 앱도 즉시 업데이트됨.
