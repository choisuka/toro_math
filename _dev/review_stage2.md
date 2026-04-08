# 2단계: 논리의 평원 — 가상학생 검토 리포트

> 검토일: 2026-04-09  
> 가상학생: 민준 (중1~2, 방정식·부등식·연립방정식 처음 배우는 학생)  
> 검토 범위: eq-guide, eq-basic, eq-hard, eq-identity, inequality-guide, inequality-havruta, simultaneous-guide, simultaneous-basic, simultaneous-hard

---

## 검토 결과 요약

| 세트 | 카드 수 | 발견 문제 | 조치 |
|------|---------|-----------|------|
| eq-guide | 3장 | 없음 | — |
| eq-basic | 10문항 | 1건 | ✅ 수정 완료 |
| eq-hard | 10+1장 | 없음 (부등식 복선은 의도적) | — |
| eq-identity | 10문항 | 없음 | — |
| inequality-guide | 3장 | 1건 | ✅ 4장으로 확장 |
| inequality-havruta | 1편 | 없음 | — |
| simultaneous-guide | 3장 | 없음 | — |
| simultaneous-basic | 3장 | 1건 | ✅ 수정 완료 |
| simultaneous-hard | 3장 | 없음 | — |

---

## 수정 내역

### 1. eq-basic 6번 — 항등식 개념 첫 등장 설명 추가
- **문제:** eq-guide(3장)에서 항등식을 한 번도 언급하지 않았는데, eq-basic 6번에서 갑자기 "방정식 아님 → 항등식"이라는 답이 나옴
- **조치:** 답변 카드에 "항등식이란?" 박스 추가
  - "x가 어떤 값이든 항상 성립하는 등식 (방정식은 특정 x값에서만 성립)"
- **의도 유지:** eq-basic에서 힌트 → eq-identity에서 심화 학습하는 교수법 구조는 그대로

### 2. inequality-guide — 부등호 방향 뒤집기 규칙 카드 추가 (4/4)
- **문제:** 3장 모두 '개념 도입(시소, 수직선, 최악 가정)' 내용인데, 부등식에서 가장 중요한 기계적 규칙인 "음수로 곱/나누면 부등호 방향이 바뀐다"는 설명이 없음
- **조치:** 4번째 카드 신규 추가
  - 양수 곱: 방향 유지 (2 < 4 → ×3 → 6 < 12)
  - 음수 곱: 방향 뒤집기 (2 < 4 → ×(−1) → −2 > −4)
  - "왜 뒤집히나?" 수직선 직관 설명
  - 실수 방지 강조

### 3. simultaneous-basic 2/3 — 풀이 오류 수정
- **문제:** 풀이 중간에 작성 중 삭제 안 된 메모가 그대로 노출됨
  - "①−②×3: 7x = 800 — 아니, ①×3−②×9 대신" 문구
- **조치:** 올바른 소거법 풀이로 정리
  - ②×3: 3x+9y=6600 … ③
  - ③−①: 7y=4200 → y=600
  - ②에 대입: x=400

---

## 흐름 평가 (수정 후)

```
방정식:
  eq-guide (시소/막대/변수 3장)
  → eq-basic (기본 10문항, 6번에서 항등식 복선)
  → eq-hard (심화 10문항, 9번에서 부등식 복선)
  → eq-identity (항등식 심화 10문항) ← 복선 해소
  → eq-identity-havruta / eq-guarantee

부등식:
  inequality-guide (3개국 개념 + 부등호 방향 규칙 4장) ← 수정됨
  → inequality-havruta (토론 1편)
  → ineq-hard10 (심화 10선)
  → ineq-gemini5 (최고난도 5선)

연립방정식:
  simultaneous-guide (두 시소/비교막대/조건논리 3장)
  → simultaneous-basic (기본 3문항) ← 풀이 오류 수정
  → simultaneous-hard (심화 3문항)
  → simultaneous-havruta (토론 2편)
```

---

## 다음 단계

- [ ] 3단계: 변화와 관계의 산맥 검토 (일차함수 → 이차방정식(중3) → 다항식 → 복소수 → 이차함수)
