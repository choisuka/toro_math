// ══════════════════════════════════════════════
//  🦕 TORO AI — 통합 멘트 시스템 v1.0
//  사용법: <script src="../toro_ai.js"></script>
//  호출:   toroSay('math', 'correct')
// ══════════════════════════════════════════════

const TORO_MESSAGES = {

  // ── 수학 앱 ──────────────────────────────────
  math: {
    correct: [
      "맞아! 역시 너는 수학 천재야! 🦕✨",
      "완벽해! 토로도 그렇게 풀었어! 🎉",
      "오오! 분수도 무섭지 않지? 💪",
      "정답! 탄천 물고기들도 박수 치고 있어! 🐟👏",
    ],
    wrong: [
      "괜찮아, 토로도 처음엔 틀렸었어. 다시 해보자! 🦕",
      "아깝다! 한 번만 더 — 넌 할 수 있어! 💚",
      "틀려도 괜찮아. 틀려야 기억에 남거든! 🧠",
      "조금만 더 생각해봐. 토로가 응원할게! 🌱",
    ],
    start: [
      "자, 오늘도 수학 탐험 시작! 🗺️🦕",
      "준비됐어? 토로랑 같이 풀어보자! ✏️",
      "숫자들아, 우리가 간다! 🚀",
    ],
    complete: [
      "모든 미션 완료! 너 진짜 대단하다! 🏆🦕",
      "끝까지 해냈어! 탄천에 별이 하나 더 생겼어! ⭐",
      "오늘 수학, 완전 정복! 내일도 기대할게! 🎊",
    ],
    hint: [
      "힌트! 분모끼리 먼저 살펴봐 👀",
      "토로의 비밀: 최소공배수가 핵심이야! 🔑",
      "천천히, 단계별로! 서두르지 않아도 돼 🐢",
    ],
  },

  // ── 과학 앱 ──────────────────────────────────
  science: {
    correct: [
      "과학자 토로도 감탄했어! 훌륭해! 🔭🦕",
      "실험 성공! 세상의 비밀 하나 더 알아냈어! ⚗️",
      "정답! 언젠가 노벨상 받을 것 같은데? 🏅",
    ],
    wrong: [
      "과학은 실패해도 배움이야! 다시 관찰해봐 🔍",
      "틀려도 돼 — 갈릴레오도 처음엔 틀렸었어! 🌍",
      "더 자세히 살펴봐. 답이 숨어있어! 🧩",
    ],
    start: [
      "오늘의 과학 탐험 시작! 호기심을 켜봐! 💡🦕",
      "자연의 비밀을 함께 파헤쳐보자! 🌿",
    ],
    complete: [
      "과학 미션 완료! 토로가 자랑스러워! 🦕🔬",
      "대단해! 오늘 하나의 과학자가 탄생했어! 🎓",
    ],
  },

  // ── 탐정 게임 ────────────────────────────────
  detective: {
    correct: [
      "딩동댕! 토로 탐정이 인정하는 추리야! 🕵️🦕",
      "사건 해결! 셜록 토로도 놀랐어! 🔎✨",
      "완벽한 추리! 범인이 덜덜 떨고 있어! 😱",
    ],
    wrong: [
      "음... 단서를 다시 살펴봐. 뭔가 놓쳤을 거야! 🔍",
      "아깝다! 토로도 처음엔 이 단서를 놓쳤었어 👀",
      "다시 처음부터 생각해봐. 진실은 하나야! 💭",
    ],
    start: [
      "사건 발생! 토로 탐정, 출동! 🚨🦕",
      "오늘의 미스터리를 풀어줘! 🗂️",
    ],
    complete: [
      "사건 종결! 최고의 탐정 등극! 🏆🕵️",
      "모든 단서를 찾았어! 토로도 감탄! 🎉",
    ],
  },

  // ── 해피데이 / 감정 기록 ─────────────────────
  happy_day: {
    write: [
      "오늘 하루를 기록해줘서 고마워! 🦕💚",
      "네 이야기가 소중해. 토로도 같이 읽었어! 📖",
      "일기 쓰는 너, 멋있어! 나중에 작가 될 것 같아 ✍️",
    ],
    good: [
      "오늘 좋은 하루였구나! 탄천도 맑은 날이었어! ☀️🦕",
      "행복한 날! 그 기분 내일도 이어가자! 🌈",
    ],
    bad: [
      "힘든 날도 있어. 토로가 옆에 있을게! 🦕💙",
      "괜찮아. 내일은 더 좋은 날이 올 거야! 🌱",
      "오늘 수고했어. 잘 자고 일어나면 달라질 거야! 🌙",
    ],
    streak: [
      "연속 기록 중! 꾸준한 너가 최고야! 🔥🦕",
      "매일매일 기록하는 습관, 대단해! 📅✨",
    ],
  },

  // ── 시/독서 앱 ───────────────────────────────
  poem: {
    read: [
      "시를 읽었구나! 마음이 따뜻해지지 않아? 🦕📜",
      "시인 토로도 이 시 좋아해! 감성이 쑥쑥 자라고 있어! 🌸",
      "글을 읽는 너는 세상을 더 넓게 보는 거야! 👁️",
    ],
    complete: [
      "시 완독! 수학 포인트 +3 적립! 📚➡️🔢",
      "독서 완료! 토로의 마음에도 꽃이 피었어! 🌺",
    ],
  },

  // ── 음악 앱 ──────────────────────────────────
  music: {
    play: [
      "음악이 흐르니 탄천 물고기들도 춤추고 있어! 🐟🎵🦕",
      "좋은 선택! 이 음악은 토로도 좋아해! 🎶",
    ],
    complete: [
      "오늘의 음악 미션 완료! 귀가 행복했겠다! 🎧✨",
    ],
  },

  // ── 공통 ─────────────────────────────────────
  common: {
    levelup: [
      "레벨 업! 토로도 같이 성장하는 것 같아! 🆙🦕",
      "한 단계 더! 이 속도면 전설이 될 거야! ⚡",
    ],
    points: [
      "포인트 적립! 탄천 친구들에게 기부할 수 있어! 💰🌿",
      "포인트가 쌓이고 있어! 열심히 하는 증거야! 🏅",
    ],
    idle: [
      "토로가 기다리고 있어... 오늘 뭐 해볼까? 🦕💭",
      "어서 와! 오늘은 어떤 탐험을 할 거야? 🗺️",
    ],
    first_visit: [
      "처음 왔구나! 토로야, 반가워! 🦕🎉",
      "환영해! 여기선 뭐든 배울 수 있어! ✨",
    ],
  },
};

// ── 핵심 함수 ────────────────────────────────────
/**
 * toroSay(app, event, options)
 * @param {string} app   - 'math' | 'science' | 'detective' | 'happy_day' | 'poem' | 'music' | 'common'
 * @param {string} event - 'correct' | 'wrong' | 'start' | 'complete' | 'hint' | ...
 * @param {object} options - { show: true(기본), target: '#toro-msg', duration: 3000 }
 * @returns {string} 선택된 멘트
 */
function toroSay(app, event, options = {}) {
  const msgs = (TORO_MESSAGES[app] && TORO_MESSAGES[app][event])
    || TORO_MESSAGES.common.idle;
  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  if (options.show !== false) {
    _toroDisplay(msg, options);
  }
  return msg;
}

// ── UI 표시 함수 ──────────────────────────────────
function _toroDisplay(msg, options = {}) {
  const duration = options.duration || 3500;
  const targetId = options.target || 'toro-bubble-msg';

  // 기존 말풍선 요소가 있으면 업데이트
  const existing = document.getElementById(targetId);
  if (existing) {
    existing.textContent = msg;
    existing.style.animation = 'none';
    setTimeout(() => existing.style.animation = '', 10);
    return;
  }

  // 없으면 플로팅 말풍선 생성
  const bubble = document.createElement('div');
  bubble.id = 'toro-floating-bubble';
  bubble.innerHTML = `<span style="font-size:1.6rem">🦕</span><span id="${targetId}" style="margin-left:8px">${msg}</span>`;
  bubble.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:linear-gradient(135deg,#1a2a3a,#0f1923);
    color:#f0f4f8; padding:12px 20px; border-radius:20px;
    border:1px solid rgba(46,204,113,.4); box-shadow:0 4px 20px rgba(0,0,0,.5);
    font-family:'Nanum Gothic',sans-serif; font-size:.95rem; line-height:1.5;
    display:flex; align-items:center; gap:4px; max-width:90vw;
    z-index:9999; animation:toroFadeIn .3s ease;
  `;

  // CSS 애니메이션 주입 (한 번만)
  if (!document.getElementById('toro-ai-style')) {
    const style = document.createElement('style');
    style.id = 'toro-ai-style';
    style.textContent = `
      @keyframes toroFadeIn{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      @keyframes toroFadeOut{from{opacity:1}to{opacity:0;transform:translateX(-50%) translateY(8px)}}
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(bubble);

  // 자동 제거
  setTimeout(() => {
    bubble.style.animation = 'toroFadeOut .4s ease forwards';
    setTimeout(() => bubble.remove(), 400);
  }, duration);
}

// ── 편의 함수들 ───────────────────────────────────
const toro = {
  correct : (app) => toroSay(app, 'correct'),
  wrong   : (app) => toroSay(app, 'wrong'),
  start   : (app) => toroSay(app, 'start'),
  complete: (app) => toroSay(app, 'complete'),
  hint    : (app) => toroSay(app, 'hint'),
  points  : ()    => toroSay('common', 'points'),
  levelup : ()    => toroSay('common', 'levelup'),
  say     : (msg) => _toroDisplay(msg),
};

// ── 포인트 크로스앱 시스템 ────────────────────────
const TORO_POINTS_KEY = 'toroMasterPoints';
const TORO_LOG_KEY    = 'toroActivityLog';

function toroAddPoints(app, event, amount) {
  const pts = parseInt(localStorage.getItem(TORO_POINTS_KEY) || '0') + amount;
  localStorage.setItem(TORO_POINTS_KEY, pts);

  const log = JSON.parse(localStorage.getItem(TORO_LOG_KEY) || '[]');
  log.push({ app, event, amount, pts, time: new Date().toISOString() });
  localStorage.setItem(TORO_LOG_KEY, JSON.stringify(log.slice(-100)));

  toroSay('common', 'points', { show: true });
  return pts;
}

function toroGetPoints() {
  return parseInt(localStorage.getItem(TORO_POINTS_KEY) || '0');
}
