# 3단계: 변화와 관계의 산맥 — 가상학생 검토 리포트

> 검토일: 2026-04-10  
> 가상학생: 민준 (중2~3, 일차함수·이차방정식 처음 배우는 학생) + 고1 수학 상 진입 학생  
> 검토 범위: linear-func-guide, linear-func-havruta, linear-func-deep, quadratic-guide, quadratic-havruta, poly-guide, poly-hard, poly-havruta, quad-eq-guide, quad-eq-havruta, complex-guide, complex-havruta, quad-func-guide, quad-func-havruta

---

## 검토 결과 요약

| 세트 | 카드 수 (허브 표시) | 실제 카드 수 | 발견 문제 | 조치 |
|------|---------------------|--------------|-----------|------|
| linear-func-guide | 16장 | 16장 | 1건 | ✅ 수정 완료 |
| linear-func-havruta | 8편 | 8편 | 없음 | — |
| linear-func-deep | 4장 | 4장 | 없음 (미분 복선 의도적) | — |
| quadratic-guide | **3장** | **6장** | 1건 | ✅ 수정 완료 |
| quadratic-havruta | 1편 | 1편 | 없음 | — |
| poly-guide | 14장 | 14장 | 없음 | — |
| poly-hard | 4장 | 4장 | 없음 | — |
| poly-havruta | 8편 | 8편 | 없음 | — |
| quad-eq-guide | 1장 | 1장 | 없음 | — |
| quad-eq-havruta | 1편 | 1편 | 없음 | — |
| complex-guide | 7장 | 7장 | 없음 | — |
| complex-havruta | 3편 | 3편 | 없음 | — |
| quad-func-guide | 1장 | 1장 | 없음 | — |
| quad-func-havruta | 3편 | 3편 | 없음 | — |

---

## 수정 내역

### 1. quadratic-guide — 허브 카드 수 표시 오류 수정

- **문제:** 허브 버튼에 `(3장)`으로 표시되어 있으나, 실제 카드는 6장
  - 1~3장: 핀란드·싱가포르·유대인 짧은 버전
  - 4~6장: 동일 주제의 "면적의 논리" 상세 버전
- **조치:** 허브 버튼 표시를 `(6장)` 으로 수정

### 2. linear-func-guide — 16장 내부 구조 안내 추가

- **문제:** 16장 안에 짧은 개념 3장 → 상세 개념 3장 → 심화 미션 → 킬러 문항 순으로 구성되어 있는데, 카드에 번호 태그가 없어 학생이 위치를 파악하기 어려움 (다른 세트는 "기본 1/10" 형식 사용)
- **의도 확인:** 진행 바(progress bar)가 있어 위치 파악 자체는 가능. 다만 같은 주제가 짧은 버전→상세 버전으로 두 번 나와서 처음 보는 학생은 "왜 또 핀란드식이 나오지?" 하고 혼란 가능
- **조치:** 첫 번째 카드(🇫🇮 핀란드식 — 마법의 상자)에 안내 문구 추가
  - "📌 1~3장: 핵심 요약 / 4~6장: 상세 설명 / 7장~: 실전 미션"
  - 학생이 자신의 수준에 맞게 선택적으로 깊이 들어갈 수 있도록 안내

---

## 흐름 평가 (수정 후)

```
3단계: 변화와 관계의 산맥 (중2~중3)
  📈 일차함수 (linear-func-hub)
    → linear-func-guide (16장: 요약 3장 + 상세 3장 + 심화 미션 7장 + 킬러 3장) ← 안내 추가
    → linear-func-havruta (8편: 기울기 철학 5편 + 도형·모델링 3편)
    → linear-func-deep (4장: 기울기 심화, 미분 복선 포함)

  🌊 이차방정식 (quadratic-hub)
    → quadratic-guide (6장) ← 허브 표시 수정
    → quadratic-havruta (1편: 공 던지기, 두 답의 비밀)

5단계: 고등수학의 설산 (고1 수학 상)
  📜 다항식 (poly-hub)
    → poly-guide (14장)
    → poly-hard (4장)
    → poly-havruta (8편)

  🌀 복소수 (complex-hub)
    → complex-guide (7장: 1~4 3국+회전, 5 탐험가 스토리, 6 통합 정리 포함)
    → complex-havruta (3편)

  📐 이차방정식 실근의 위치 (quad-eq-hub)
    → quad-eq-guide (1장: 3국 통합)
    → quad-eq-havruta (1편: 울타리 안의 두 괴물)

  📊 이차함수 (quad-func-hub)
    → quad-func-guide (1장)
    → quad-func-havruta (3편)
```

### 특이사항 — 의도적 복선 확인

- **linear-func-deep 1/4**: "기울기는 직선만의 성질 — 곡선의 기울기는 미분이 필요"
  → eq-hard 9번의 부등식 복선처럼, 미분(고등 수학)으로의 연결고리를 의도적으로 심어둔 구조. 수정 불필요.

- **linear-func-havruta 6/8 구간별 함수**: "모퉁이를 돌면 기울기가 바뀌는 꺾인 선"
  → 이차방정식·이차함수의 구간별 함수 개념 복선. 의도적. 수정 불필요.

---

## 다음 단계

- [ ] 4단계: 질서와 예측의 바다 검토 (기본도형 → 평균·통계)
