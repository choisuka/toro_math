"""hs_math/index.html 생성 스크립트"""
import re, os

# 1. toro_math에서 hs-* 카드 데이터 추출
with open('index.html', 'r', encoding='utf-8') as f:
    src = f.read()

# CARD_DATA 안의 hs-* 섹션만 추출
m = re.search(r'/\* ════.*?고등 수학 전 단원.*?\*/(.*?)\n\}; // end CARD_DATA', src, re.DOTALL)
hs_cards = m.group(1).strip() if m else ''

# 2. hs_math/index.html 생성
html = r"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🎓 고등 수학의 탑 — 아르모니아</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f0f1a;color:#e2e8f0;font-family:'Nanum Gothic',sans-serif;min-height:100vh}

/* ── 헤더 ── */
.header{background:linear-gradient(135deg,#1e1b4b,#312e81);padding:16px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(165,180,252,.2)}
.header-back{background:rgba(255,255,255,.08);border:none;color:#a5b4fc;font-size:1.1rem;padding:8px 14px;border-radius:10px;cursor:pointer;font-family:inherit}
.header-back:hover{background:rgba(165,180,252,.2)}
.header-title{font-family:'Jua',sans-serif;font-size:1.3rem;color:#c4b5fd}
.header-sub{font-size:.75rem;color:#7c6cd4;margin-top:2px}

/* ── 탭 ── */
.tab-wrap{background:#13112b;border-bottom:1px solid rgba(165,180,252,.15);padding:0 16px;display:flex;gap:4px;overflow-x:auto}
.tab-wrap::-webkit-scrollbar{display:none}
.tab-btn{background:none;border:none;color:#7c6cd4;font-family:'Nanum Gothic',sans-serif;font-size:.82rem;font-weight:700;padding:12px 14px;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all .2s}
.tab-btn.active{color:#a5b4fc;border-bottom-color:#a5b4fc}
.tab-btn:hover{color:#c4b5fd}

/* ── 단원 그리드 ── */
#screen-hub{padding:20px 16px}
.subject-title{font-size:.75rem;color:#7c6cd4;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px;padding-left:4px}
.unit-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:24px}
.unit-btn{background:rgba(165,180,252,.06);border:1px solid rgba(165,180,252,.2);border-radius:14px;padding:16px 12px;cursor:pointer;text-align:center;transition:all .2s;font-family:inherit}
.unit-btn:hover{background:rgba(165,180,252,.14);border-color:rgba(165,180,252,.5);transform:translateY(-2px)}
.unit-btn .icon{font-size:1.5rem;margin-bottom:6px}
.unit-btn .name{font-size:.82rem;color:#e2e8f0;font-weight:700;line-height:1.3}
.unit-btn .count{font-size:.7rem;color:#7c6cd4;margin-top:4px}

/* ── 카드뷰어 ── */
#screen-card{display:none;padding:16px}
.card-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.card-back{background:rgba(255,255,255,.08);border:none;color:#a5b4fc;font-size:.9rem;padding:8px 14px;border-radius:10px;cursor:pointer;font-family:inherit}
.card-info{font-size:.8rem;color:#7c6cd4}
.card-box{background:rgba(30,27,75,.6);border:1px solid rgba(165,180,252,.2);border-radius:18px;padding:20px;margin-bottom:14px;min-height:180px}
.card-tag{display:inline-block;font-size:.72rem;font-weight:700;padding:4px 10px;border-radius:20px;margin-bottom:12px;border:1px solid transparent}
.card-body{font-size:.88rem;line-height:1.8}
.ans-toggle{width:100%;background:rgba(165,180,252,.1);border:1px solid rgba(165,180,252,.3);border-radius:12px;padding:12px;color:#a5b4fc;font-family:inherit;font-size:.88rem;font-weight:700;cursor:pointer;margin-bottom:10px;transition:all .2s}
.ans-toggle:hover{background:rgba(165,180,252,.2)}
.ans-box{background:rgba(253,230,138,.05);border:1px solid rgba(253,230,138,.2);border-radius:14px;padding:16px;font-size:.85rem;line-height:1.8;display:none}
.ans-box.show{display:block}
.card-btns{display:flex;gap:10px;margin-top:14px}
.card-btns button{flex:1;padding:12px;border-radius:12px;border:none;font-family:inherit;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s}
.btn-prev{background:rgba(255,255,255,.06);color:#94a3b8}
.btn-prev:hover{background:rgba(255,255,255,.12)}
.btn-next{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff}
.btn-next:hover{filter:brightness(1.1)}
.progress-bar{background:rgba(255,255,255,.08);border-radius:99px;height:4px;margin-bottom:16px}
.progress-fill{background:linear-gradient(90deg,#6366f1,#a855f7);height:4px;border-radius:99px;transition:width .3s}
</style>
</head>
<body>

<!-- 헤더 -->
<div class="header">
  <button class="header-back" onclick="goHub()">← 허브</button>
  <div>
    <div class="header-title">🎓 고등 수학의 탑</div>
    <div class="header-sub">아르모니아 수학왕국</div>
  </div>
</div>

<!-- 탭 -->
<div class="tab-wrap">
  <button class="tab-btn active" onclick="setTab(0)">수학(공통)</button>
  <button class="tab-btn" onclick="setTab(1)">수학 I</button>
  <button class="tab-btn" onclick="setTab(2)">수학 II</button>
  <button class="tab-btn" onclick="setTab(3)">확률과 통계</button>
  <button class="tab-btn" onclick="setTab(4)">기하</button>
</div>

<!-- 단원 허브 화면 -->
<div id="screen-hub"></div>

<!-- 카드뷰어 화면 -->
<div id="screen-card">
  <div class="card-nav">
    <button class="card-back" onclick="showHub()">← 단원 목록</button>
    <span class="card-info" id="card-info"></span>
  </div>
  <div class="progress-bar"><div class="progress-fill" id="prog"></div></div>
  <div class="card-box">
    <div class="card-tag" id="c-tag"></div>
    <div class="card-body" id="c-body"></div>
  </div>
  <button class="ans-toggle" id="ans-btn" onclick="toggleAns()">💡 풀이 보기</button>
  <div class="ans-box" id="ans-box"></div>
  <div class="card-btns">
    <button class="btn-prev" onclick="move(-1)">◀ 이전</button>
    <button class="btn-next" onclick="move(1)">다음 ▶</button>
  </div>
</div>

<script>
const TABS = [
  { name:'수학(공통)', units:[
    { icon:'📐', name:'다항식', sub:'나머지·인수·이항정리', key:'hs-poly' },
    { icon:'⚖️', name:'방정식과 부등식', sub:'판별식·근과계수', key:'hs-equation' },
    { icon:'🔵', name:'도형의 방정식', sub:'직선·원·평행이동', key:'hs-geometry' }
  ]},
  { name:'수학 I', units:[
    { icon:'📈', name:'지수·로그함수', sub:'지수·로그·방정식', key:'hs-exp-log' },
    { icon:'🌊', name:'삼각함수', sub:'사인·코사인·방정식', key:'hs-trig' },
    { icon:'🔢', name:'수열', sub:'등차·등비·귀납법', key:'hs-sequence' }
  ]},
  { name:'수학 II', units:[
    { icon:'♾️', name:'극한과 연속', sub:'극한·연속·중간값', key:'hs-limit' },
    { icon:'📉', name:'미분', sub:'도함수·극값·접선', key:'hs-diff' },
    { icon:'∫', name:'적분', sub:'부정·정적분·넓이', key:'hs-integral' }
  ]},
  { name:'확률과 통계', units:[
    { icon:'🎲', name:'확률과 통계', sub:'조합·확률·정규분포', key:'hs-prob' }
  ]},
  { name:'기하', units:[
    { icon:'🌀', name:'이차곡선·벡터', sub:'포물선·타원·쌍곡선', key:'hs-conic' }
  ]}
];

""" + f"const CARD_DATA = {{{hs_cards}\n}};" + r"""

let curTab = 0, curKey = '', curIdx = 0, showAns = false;

function setTab(i) {
  curTab = i;
  document.querySelectorAll('.tab-btn').forEach((b,j)=>b.classList.toggle('active',i===j));
  renderHub();
}

function renderHub() {
  const tab = TABS[curTab];
  let html = '';
  html += `<p class="subject-title">${tab.name}</p>`;
  html += '<div class="unit-grid">';
  tab.units.forEach(u => {
    const cnt = (CARD_DATA[u.key]||[]).length;
    html += `<div class="unit-btn" onclick="startCards('${u.key}')">
      <div class="icon">${u.icon}</div>
      <div class="name">${u.name}</div>
      <div class="count">${u.sub}</div>
      <div class="count" style="margin-top:6px;color:#6366f1">${cnt}장</div>
    </div>`;
  });
  html += '</div>';
  document.getElementById('screen-hub').innerHTML = html;
  document.getElementById('screen-hub').style.display='block';
  document.getElementById('screen-card').style.display='none';
}

function startCards(key) {
  curKey = key; curIdx = 0; showAns = false;
  document.getElementById('screen-hub').style.display='none';
  document.getElementById('screen-card').style.display='block';
  renderCard();
}

function renderCard() {
  const cards = CARD_DATA[curKey]||[];
  const c = cards[curIdx];
  if(!c) return;
  const total = cards.length;
  document.getElementById('card-info').textContent = `${curIdx+1} / ${total}`;
  document.getElementById('prog').style.width = ((curIdx+1)/total*100)+'%';
  const tag = document.getElementById('c-tag');
  tag.textContent = c.tag;
  tag.style.background = (c.bg||'rgba(165,180,252,.1)');
  tag.style.color = (c.tagColor||'#a5b4fc');
  tag.style.borderColor = (c.bd||'rgba(165,180,252,.3)');
  document.getElementById('c-body').innerHTML = c.body;
  showAns = false;
  const ansBox = document.getElementById('ans-box');
  const ansBtn = document.getElementById('ans-btn');
  ansBox.classList.remove('show');
  if(c.ans) {
    ansBtn.style.display='block';
    ansBtn.textContent='💡 풀이 보기';
    ansBox.innerHTML = c.ans;
  } else {
    ansBtn.style.display='none';
  }
}

function toggleAns() {
  showAns = !showAns;
  document.getElementById('ans-box').classList.toggle('show', showAns);
  document.getElementById('ans-btn').textContent = showAns ? '🙈 풀이 닫기' : '💡 풀이 보기';
}

function move(d) {
  const cards = CARD_DATA[curKey]||[];
  curIdx = Math.max(0, Math.min(cards.length-1, curIdx+d));
  showAns = false;
  renderCard();
}

function showHub() {
  document.getElementById('screen-hub').style.display='block';
  document.getElementById('screen-card').style.display='none';
}

function goHub() {
  location.href = '../armoonia_hub/index.html';
}

renderHub();
</script>
</body>
</html>"""

os.makedirs('../hs_math', exist_ok=True)
with open('../hs_math/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("hs_math/index.html 생성 완료")
