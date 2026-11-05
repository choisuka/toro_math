// 심화 문제를 "아이디어 주고받기"로 푼다 — 소인수분해 동굴 "심화 문제 도전"(완전제곱수 만들기 유형)
// 이 유형은 4지선다 보기를 두지 않고, 문제 바로 아래에서 토로와 4단계 아이디어를 따라가며 푼다(단계마다 학생 A / 학생 B / 잘 모르겠어요 중 선택).
// 끝까지 가면 기본 +1P, 맞는 생각을 먼저 고른 단계가 3개 이상이면 +2P(기존 오답 +1P·정답 +2P와 같은 크기). 기존 "📖 풀이 보기"는 끝난 뒤에 그대로 쓴다.
// 문제 숫자는 매판 다르므로 문장은 q.data(n, f, fStr, minN, result, sqrtRes)로 채운다.
var IDEA = null;

function ideaEsc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

// 완전제곱수 만들기: n에 자연수를 곱해 완전제곱수가 되게 하는 최솟값. 숫자 목록의 n은 모두 지수가 홀수인 소인수가 하나뿐이다.
function ideaPerfectSq(q){
  var d = q.data, f = d.f, ps = Object.keys(f).map(Number);
  var odd = ps.filter(function(p){ return f[p] % 2 !== 0; }), even = ps.filter(function(p){ return f[p] % 2 === 0; });
  if(odd.length !== 1 || !even.length) return null;
  var p = odd[0], e = f[p], r = even[0], er = f[r], n = d.n, fs = d.fStr, m = d.minN, res = d.result, sq = d.sqrtRes;
  return [
    {ask: '완전제곱수 36, 100, 144를 소인수분해하면 어떤 모양일까?',
     ok: {text: '지수가 모두 짝수예요! 36 = 2²×3², 100 = 2²×5²', react: '맞아! 제곱은 같은 수를 두 번 곱한 거라서, 소인수도 둘씩 짝을 이뤄.'},
     no: {text: '일의 자리가 0, 1, 4, 5, 6, 9로 끝나요', react: '좋은 관찰이야. 그런데 14도 일의 자리가 4인데 제곱수가 아니야. 만들 때는 쓰기 어려워서, 소인수분해 모양을 보자.'},
     hint: '36 = 2²×3², 100 = 2²×5², 144 = 2⁴×3². 지수를 한번 봐!',
     right: '완전제곱수는 소인수분해하면 모든 소인수의 지수가 짝수야.'},
    {ask: n + ' = ' + fs + '은 어디가 문제일까?',
     ok: {text: p + '의 지수가 ' + e + '(홀수)라서 문제예요.', react: '맞아! ' + r + '의 지수는 ' + er + '(짝수)라서 괜찮아.'},
     no: {text: '소인수 ' + r + ' 쪽이 문제예요. ' + r + eul(r) + ' 더 곱해야 해요.', react: r + '의 지수는 이미 ' + er + '(짝수)야. 홀수인 건 ' + p + ' 쪽이야.'},
     hint: fs + '에서 지수를 하나씩 봐. 짝수가 아닌 건 어느 쪽일까?',
     right: p + '의 지수 ' + e + '가 홀수라서 ' + p + eul(p) + ' 더 곱해야 해.'},
    {ask: p + '의 지수 ' + e + superscriptNote(e) + ' 짝수로 만들려면 ' + p + eul(p) + ' 몇 번 더 곱해야 할까?',
     ok: {text: '한 번요. ' + p + superscript(e) + ' × ' + p + ' = ' + p + superscript(e + 1), react: '지수가 ' + (e + 1) + '이 됐어. 짝수야!'},
     no: {text: '두 번요.', react: p + superscript(e) + ' × ' + p + '² = ' + p + superscript(e + 2) + '이야. 지수가 ' + (e + 2) + '(홀수)라서 다시 안 맞아.'},
     hint: p + eul(p) + ' 한 번 곱할 때마다 지수가 1씩 커져. ' + e + '에서 짝수가 되려면?',
     right: p + eul(p) + ' 한 번만 더 곱하면 지수가 ' + (e + 1) + '(짝수)이 돼.'},
    {ask: '그럼 n의 최솟값은? 그런데 n = ' + n + '도 ' + n + ' × ' + n + ' = ' + (n * n) + ' = ' + n + '²이라 제곱수가 되는데, 왜 답이 아닐까?',
     ok: {text: 'n = ' + m + ': ' + n + ' × ' + m + ' = ' + res + ' = ' + sq + '², 그리고 ' + m + ' < ' + n, react: '맞아! ' + m + '이 더 작으니까 최솟값이야.'},
     no: {text: 'n = ' + n + ', ' + n + ' × ' + n + ' = ' + (n * n) + ' = ' + n + '²이잖아요.', react: '맞는 방법이야! 자기 자신을 곱하면 항상 제곱수가 되지. 그런데 문제는 "가장 작은 n"이야. ' + m + ' < ' + n + '이니까 ' + m + '이 더 작지?'},
     hint: '③에서 ' + p + eul(p) + ' 한 번 더 곱하면 된다고 했지? 그게 n이야. n = ?',
     right: '최소 n = ' + m + '. 검산: ' + n + ' × ' + m + ' = ' + res + ' = ' + sq + '².'}
  ];
}
// "e를" 뒤에 붙이는 조사(숫자 e가 1이나 3일 때)
function superscriptNote(e){ return eul(e); }

function ideaStepsFor(q){
  if(!q || q.subtype !== 'perfect_sq' || !q.data || !q.data.f) return null;
  return ideaPerfectSq(q);
}

function ideaDots(){
  var h = '';
  for(var k = 0; k < IDEA.steps.length; k++){
    var done = k < IDEA.i || (k === IDEA.i && IDEA.picked !== null), cur = k === IDEA.i && IDEA.picked === null;
    h += '<span style="display:inline-block;width:' + (cur ? 24 : 12) + 'px;height:12px;border-radius:6px;margin:0 3px;background:' + (done ? '#a855f7' : cur ? '#fde68a' : 'rgba(255,255,255,.18)') + '"></span>';
  }
  return '<div style="text-align:center;margin-bottom:10px">' + h + '</div>';
}
function ideaWrap(inner){
  return '<div style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.35);border-radius:12px;padding:12px">' + ideaDots() + inner + '</div>';
}
function ideaRender(){
  var box = document.getElementById('qc-idea'); if(!box || !IDEA || IDEA.cur !== ST.cur) return;
  var S = IDEA, st = S.steps[S.i], n = S.steps.length;
  var a = S.flips[S.i] ? st.no : st.ok, b = S.flips[S.i] ? st.ok : st.no;
  var opts = [{k: 'A', o: a}, {k: 'B', o: b}], h = '';
  h += '<div style="font-family:Jua,sans-serif;color:#d8b4fe;font-size:.78rem;margin-bottom:6px">' + (S.i + 1) + ' / ' + n + ' 단계</div>'
    + '<div style="font-size:.9rem;color:#e2e8f0;line-height:1.8;margin-bottom:10px">🦕 ' + ideaEsc(st.ask) + '</div>';
  opts.forEach(function(x, idx){
    var chosen = S.picked === idx;
    h += '<button ' + (S.picked !== null ? 'disabled ' : '') + 'onclick="ideaPick(' + idx + ')" style="display:block;width:100%;text-align:left;margin-bottom:8px;background:' + (chosen ? 'rgba(168,85,247,.28)' : 'rgba(255,255,255,.05)') + ';border:1px solid ' + (chosen ? '#a855f7' : 'rgba(255,255,255,.18)') + ';color:#e2e8f0;border-radius:10px;padding:10px 12px;font-size:.84rem;line-height:1.6;cursor:pointer">학생 ' + x.k + ': "' + ideaEsc(x.o.text) + '"</button>';
  });
  h += '<button ' + (S.picked !== null ? 'disabled ' : '') + 'onclick="ideaPick(2)" style="display:block;width:100%;text-align:left;margin-bottom:8px;background:' + (S.picked === 2 ? 'rgba(168,85,247,.28)' : 'rgba(255,255,255,.05)') + ';border:1px solid ' + (S.picked === 2 ? '#a855f7' : 'rgba(255,255,255,.18)') + ';color:#e2e8f0;border-radius:10px;padding:10px 12px;font-size:.84rem;cursor:pointer">잘 모르겠어요 🤔</button>';
  if(S.picked !== null){
    var react = S.picked === 2 ? st.hint : opts[S.picked].o.react, good = S.picked !== 2 && opts[S.picked].o === st.ok;
    h += '<div style="background:rgba(253,230,138,.08);border:1px solid rgba(253,230,138,.3);border-radius:10px;padding:10px;font-size:.84rem;color:#e2e8f0;line-height:1.8;margin-bottom:8px">🦕 <b style="color:#fde68a">' + (S.picked === 2 ? '힌트' : (good ? '오!' : '음~')) + '</b> ' + ideaEsc(react) + '</div>'
      + '<div style="background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.3);border-radius:10px;padding:10px;font-size:.84rem;color:#e2e8f0;line-height:1.8;margin-bottom:10px">✅ <b style="color:#86efac">정리</b> ' + ideaEsc(st.right) + '</div>'
      + '<button onclick="ideaNext()" style="display:block;width:100%;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:#fff;border-radius:10px;padding:10px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer">' + (S.i === n - 1 ? '끝내기 🏁' : '다음 →') + '</button>';
  }
  box.innerHTML = ideaWrap(h);
}
function ideaPick(idx){
  if(!IDEA || IDEA.picked !== null) return;
  var st = IDEA.steps[IDEA.i], a = IDEA.flips[IDEA.i] ? st.no : st.ok, b = IDEA.flips[IDEA.i] ? st.ok : st.no;
  IDEA.picked = idx;
  if(idx < 2 && (idx === 0 ? a : b) === st.ok) IDEA.right++;
  ideaRender();
}
function ideaNext(){
  if(!IDEA) return;
  if(IDEA.i < IDEA.steps.length - 1){ IDEA.i++; IDEA.picked = null; ideaRender(); return; }
  ideaFinish();
}
// 끝: 점수(처음 한 번만)와 정답 줄·풀이 보기·다음 버튼을 붙이고, 아이디어 칸에는 비밀 정리를 보여 준다
function ideaFinish(){
  var q = ST.qs[ST.cur], d = q.data, n = IDEA.steps.length, good = IDEA.right >= 3, earn = good ? 2 : 1;
  IDEA.i = n; IDEA.picked = null;
  if(!IDEA.scored){
    IDEA.scored = true; ST.answered = true;
    if(good) ST.score++;
    ST.points += earn; updatePoints();
    document.getElementById('qc-result').innerHTML =
      '<div style="font-size:.95rem;color:var(--green);margin-bottom:8px">✅ 정답: n의 최솟값 = <b style="color:var(--yellow)">' + q.answer + '</b></div>'
      + '<button id="qc-explain-btn" onclick="toggleQCExplain()" style="background:rgba(99,102,241,.2);border:1px solid #6366f1;color:#a5b4fc;border-radius:8px;padding:7px 16px;font-size:.85rem;cursor:pointer">📖 풀이 보기</button>';
    var fb = document.getElementById('feedback-area');
    fb.style.display = 'block'; fb.className = 'feedback ' + (good ? 'correct' : 'wrong');
    fb.innerHTML = '<div class="feedback-title">' + (good ? '🎉 잘했어! +' : '👏 수고했어! +') + earn + 'P</div>';
    document.getElementById('btn-next').style.display = '';
    document.getElementById('btn-skip').style.display = 'none';
  }
  document.getElementById('qc-idea').innerHTML = ideaWrap(
    '<div style="text-align:center;font-size:2rem;margin-bottom:4px">🎉</div>'
    + '<div style="text-align:center;font-family:Jua,sans-serif;color:#d8b4fe;font-size:1rem;margin-bottom:8px">아이디어를 끝까지 따라갔어요!</div>'
    + '<div style="font-size:.86rem;color:#e2e8f0;line-height:1.85;margin-bottom:10px">🔑 <b style="color:#fde68a">비밀 정리</b><br>지수가 홀수인 소인수를 한 번씩만 곱하면 최소야.<br>검산: ' + d.n + ' × ' + d.minN + ' = ' + d.result + ' = ' + d.sqrtRes + '²<br><span style="color:#94a3b8;font-size:.78rem">' + n + '단계 중 ' + IDEA.right + '단계에서 맞는 생각을 먼저 골랐어요.</span></div>'
    + ideaCtaHtml()
    + '<button onclick="ideaRestart()" style="display:block;width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">🔄 처음부터 다시 (점수는 그대로)</button>'
  );
}
function ideaRestart(){
  if(!IDEA) return;
  var ex = document.getElementById('qc-ext'); if(ex){ ex.style.display = 'none'; ex.innerHTML = ''; } EXT = null;
  IDEA.i = 0; IDEA.right = 0; IDEA.picked = null; IDEA.flips = IDEA.steps.map(function(){ return Math.random() < .5; });
  ideaRender();
}

function ideaEligible(q){ return !!(ST.hardMode && ST.topic === 'prime' && ideaStepsFor(q)); }
// 보기 4개를 만드는 renderQChoices 대신 이 자리에 아이디어 칸을 놓고 바로 시작한다
function ideaStart(){
  var q = ST.qs[ST.cur];
  document.getElementById('q-steps-wrap').innerHTML =
    '<div id="qc-idea" style="margin-top:12px"></div><div id="qc-ext" style="display:none;margin-top:12px"></div><div id="qc-result" style="margin-top:12px"></div>'
    + '<div id="qc-explain" style="display:none;margin-top:10px;background:rgba(99,102,241,.1);border-left:3px solid #6366f1;padding:12px 14px;border-radius:8px;font-size:.9rem;line-height:1.7;color:#c0d0e0"></div>';
  var steps = ideaStepsFor(q);
  IDEA = {cur: ST.cur, steps: steps, i: 0, right: 0, scored: false, flips: steps.map(function(){ return Math.random() < .5; }), picked: null};
  ideaRender();
}

// 심화 모드 + 소인수분해 + 완전제곱수 유형만 보기 4개 대신 아이디어 칸을 쓴다(나머지 유형·일반 모드는 그대로)
window.addEventListener('load', function(){
  if(typeof renderQChoices !== 'function') return;
  var orig = renderQChoices;
  renderQChoices = function(){
    if(ideaEligible(ST.qs[ST.cur])) ideaStart(); else orig();
  };
});

// ── 확장 문제: 같은 문제에서 "최소"가 아니라 "가능한 n이 모두 몇 개인지" ──
// a × n이 완전제곱수 ⇔ n = (최소 n) × (제곱수). 범위 R 이하로 정하고 n의 개수를 세게 한다(풀이 4단계를 끝낸 뒤 이모지 버튼으로 연다).
// 점수는 따로 주지 않는다. 문제 숫자는 풀이 4단계와 같은 문제의 숫자이고, 범위 R은 가능한 n이 3~6개가 되도록 정한다.
var EXT = null;
var IDEA_FACES = ['🤩', '😎', '🤔', '😆', '🥳', '😮', '🧐', '😜'], ideaFi = 0;

function ideaCss(){
  if(document.getElementById('idx-css')) return;
  var st = document.createElement('style'); st.id = 'idx-css';
  st.textContent = '.idx-cta{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:linear-gradient(135deg,rgba(168,85,247,.25),rgba(236,72,153,.2));border:1px solid #c084fc;border-radius:16px;padding:12px 14px;color:#f5e9ff;cursor:pointer;font-family:Jua,sans-serif;margin:0 0 10px}'
    + '.idx-cta .txt{font-size:1rem;line-height:1.35}.idx-cta .txt small{display:block;font-family:"Nanum Gothic",sans-serif;font-size:.74rem;color:#e9d5ff;opacity:.85;margin-top:2px}'
    + '.idx-lv{position:relative;flex:none;width:62px;height:62px;display:flex;align-items:center;justify-content:center}'
    + '.idx-lv .ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#f472b6,#fbbf24,#4ade80,#38bdf8,#a78bfa,#f472b6);opacity:.9;animation:idxSpin 4s linear infinite,idxHue 7s linear infinite}'
    + '.idx-lv .core{position:absolute;inset:5px;border-radius:50%;background:#1e1b4b}'
    + '.idx-lv .face{position:relative;font-size:2rem;line-height:1;animation:idxPulse 1.9s ease-in-out infinite}'
    + '.idx-lv.idx-hop{animation:idxHop .9s ease-in-out}'
    + '@keyframes idxSpin{to{transform:rotate(360deg)}}@keyframes idxHue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}'
    + '@keyframes idxPulse{0%,100%{transform:scale(.88)}50%{transform:scale(1.28)}}'
    + '@keyframes idxHop{0%{transform:translateY(0) rotate(0)}18%{transform:translateY(-14px) rotate(-14deg)}36%{transform:translateY(0) rotate(10deg)}54%{transform:translateY(-8px) rotate(-8deg)}72%{transform:translateY(0) rotate(5deg)}100%{transform:translateY(0) rotate(0)}}'
    + '@media (prefers-reduced-motion:reduce){.idx-lv .ring,.idx-lv .face,.idx-lv.idx-hop{animation:none}}';
  document.head.appendChild(st);
}
function ideaCtaHtml(){
  return '<button class="idx-cta" onclick="extOpen()"><span class="idx-lv" id="idx-lv"><span class="ring"></span><span class="core"></span><span class="face" id="idx-face">🤩</span></span>'
    + '<span class="txt">🚀 확장 문제 도전!<small>같은 문제에서 가능한 n이 모두 몇 개인지 세어 봐요</small></span></button>';
}
function ideaHopNow(){
  var e = document.getElementById('idx-lv'); if(!e) return;
  e.classList.remove('idx-hop'); void e.offsetWidth; e.classList.add('idx-hop');
  setTimeout(function(){ e.classList.remove('idx-hop'); }, 950);
}

function extMake(q){
  var d = q.data, a = d.n, m = d.minN;
  var J = [3, 4, 5, 6][Math.floor(Math.random() * 4)], lo = m * J * J, hi = m * (J + 1) * (J + 1) - 1;
  var R = lo + Math.floor(Math.random() * (hi - lo + 1)), ks = [];
  for(var j = 1; j <= J; j++) ks.push(m * j * j);
  var last = ks[ks.length - 1], sq = Math.round(Math.sqrt(a * last));
  return {a: a, m: m, R: R, J: J, ks: ks, steps: [
    {ask: a + ' × n이 완전제곱수가 되려면 n은 어떤 모양이어야 할까?',
     ok: {text: 'n = ' + m + ' × (제곱수), 곧 ' + m + '×1², ' + m + '×2², ' + m + '×3², …', react: '맞아! ' + a + ' × ' + m + '이 이미 제곱수(' + (a * m) + ' = ' + Math.round(Math.sqrt(a * m)) + '²)라서, 거기에 제곱수를 곱한 것들만 다시 제곱수가 돼.'},
     no: {text: 'n은 ' + m + '의 배수면 아무거나 돼요.', react: (2 * m) + '도 ' + m + '의 배수인데 ' + a + ' × ' + (2 * m) + ' = ' + (a * 2 * m) + '은 제곱수가 아니야. 제곱수를 곱해야 해.'},
     hint: '가장 작은 n은 앞 문제에서 구한 ' + m + '이야. 거기에 ×4, ×9처럼 어떤 수를 곱해야 제곱수가 유지될까?',
     right: 'n = ' + m + '×1², ' + m + '×2², ' + m + '×3², … (최솟값 ' + m + '에 제곱수를 곱한 수)'},
    {ask: 'n이 ' + R + ' 이하이려면 ' + m + ' × j² ≤ ' + R + '. j는 어디까지 갈 수 있을까?',
     ok: {text: 'j = 1부터 ' + J + '까지요. ' + m + '×' + J + '² = ' + (m * J * J) + ' ≤ ' + R + '이고, ' + m + '×' + (J + 1) + '² = ' + (m * (J + 1) * (J + 1)) + ' > ' + R + '이에요.', react: '맞아! ' + (J + 1) + '부터는 ' + R + '을 넘어 버려.'},
     no: {text: 'j가 ' + R + ' ÷ ' + m + ' 이하이면 돼요.', react: 'j가 아니라 j²에 ' + m + '을 곱한 값이 ' + R + ' 이하여야 해. j = ' + (J + 1) + '만 해도 ' + m + '×' + (J + 1) + '² = ' + (m * (J + 1) * (J + 1)) + '로 ' + R + '을 넘어.'},
     hint: 'j = 1, 2, 3, … 을 차례로 넣어서 ' + m + ' × j²을 계산해 봐. 언제 ' + R + '을 넘을까?',
     right: 'j = 1, 2, …, ' + J + ' (' + (J + 1) + '부터는 ' + R + '을 넘음)'},
    {ask: '그럼 ' + a + ' × n이 완전제곱수가 되는 n은 ' + R + ' 이하에서 모두 몇 개일까?',
     ok: {text: J + '개요. n = ' + ks.join(', ') + '.', react: '정답! ' + a + ' × ' + last + ' = ' + (a * last) + ' = ' + sq + '²이야.'},
     no: {text: (J + 1) + '개요. j = 0도 세야 해요.', react: 'j = 0이면 n = 0인데 n은 자연수여야 해. 0은 세지 않아.'},
     hint: 'j = 1, 2, …, ' + J + '에서 j가 몇 개인지 세어 봐.',
     right: '모두 ' + J + '개 → n = ' + ks.join(', ')}
  ]};
}
function extDots(){
  var h = '';
  for(var k = 0; k < EXT.steps.length; k++){
    var done = k < EXT.i || (k === EXT.i && EXT.picked !== null), cur = k === EXT.i && EXT.picked === null;
    h += '<span style="display:inline-block;width:' + (cur ? 24 : 12) + 'px;height:12px;border-radius:6px;margin:0 3px;background:' + (done ? '#a855f7' : cur ? '#fde68a' : 'rgba(255,255,255,.18)') + '"></span>';
  }
  return '<div style="text-align:center;margin-bottom:10px">' + h + '</div>';
}
function extOpen(){
  var box = document.getElementById('qc-ext'); if(!box || !IDEA || IDEA.cur !== ST.cur) return;
  if(box.style.display !== 'none'){ box.style.display = 'none'; return; }
  var x = extMake(ST.qs[ST.cur]);
  EXT = {cur: ST.cur, data: x, steps: x.steps, i: 0, picked: null, right: 0, flips: x.steps.map(function(){ return Math.random() < .5; })};
  box.style.display = ''; extRender();
  if(box.scrollIntoView) box.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}
function extWrap(inner){
  return '<div style="background:rgba(236,72,153,.07);border:1px solid rgba(236,72,153,.35);border-radius:12px;padding:12px">' + extDots() + inner + '</div>';
}
function extRender(){
  var box = document.getElementById('qc-ext'); if(!box || !EXT || EXT.cur !== ST.cur) return;
  var S = EXT, st = S.steps[S.i], n = S.steps.length, x = S.data;
  var a = S.flips[S.i] ? st.no : st.ok, b = S.flips[S.i] ? st.ok : st.no, opts = [a, b], h = '';
  h += '<div style="font-family:Jua,sans-serif;color:#f0abfc;font-size:.78rem;margin-bottom:6px">🚀 확장 문제 · ' + (S.i + 1) + ' / ' + n + ' 단계</div>';
  if(S.i === 0) h += '<div style="background:rgba(236,72,153,.1);border:1px solid rgba(236,72,153,.35);border-radius:10px;padding:10px;font-size:.88rem;line-height:1.8;color:#e2e8f0;margin-bottom:10px"><b style="color:#fbcfe8">👑 확장 문제</b><br>아까는 가장 작은 n만 찾았지? 이번엔 같은 문제에서 <b>가능한 n이 모두 몇 개</b>인지 구해요.<br>' + x.a + ' × n이 완전제곱수가 되는 자연수 n 중에서 <b style="color:#fde68a">' + x.R + ' 이하</b>인 것은 모두 몇 개일까요?</div>';
  h += '<div style="font-size:.9rem;color:#e2e8f0;line-height:1.8;margin-bottom:10px">🦕 ' + ideaEsc(st.ask) + '</div>';
  opts.forEach(function(o, idx){
    var chosen = S.picked === idx;
    h += '<button ' + (S.picked !== null ? 'disabled ' : '') + 'onclick="extPick(' + idx + ')" style="display:block;width:100%;text-align:left;margin-bottom:8px;background:' + (chosen ? 'rgba(168,85,247,.28)' : 'rgba(255,255,255,.05)') + ';border:1px solid ' + (chosen ? '#a855f7' : 'rgba(255,255,255,.18)') + ';color:#e2e8f0;border-radius:10px;padding:10px 12px;font-size:.84rem;line-height:1.6;cursor:pointer">학생 ' + 'AB'.charAt(idx) + ': "' + ideaEsc(o.text) + '"</button>';
  });
  h += '<button ' + (S.picked !== null ? 'disabled ' : '') + 'onclick="extPick(2)" style="display:block;width:100%;text-align:left;margin-bottom:8px;background:' + (S.picked === 2 ? 'rgba(168,85,247,.28)' : 'rgba(255,255,255,.05)') + ';border:1px solid ' + (S.picked === 2 ? '#a855f7' : 'rgba(255,255,255,.18)') + ';color:#e2e8f0;border-radius:10px;padding:10px 12px;font-size:.84rem;cursor:pointer">잘 모르겠어요 🤔</button>';
  if(S.picked !== null){
    var react = S.picked === 2 ? st.hint : opts[S.picked].react, good = S.picked !== 2 && opts[S.picked] === st.ok;
    h += '<div style="background:rgba(253,230,138,.08);border:1px solid rgba(253,230,138,.3);border-radius:10px;padding:10px;font-size:.84rem;color:#e2e8f0;line-height:1.8;margin-bottom:8px">🦕 <b style="color:#fde68a">' + (S.picked === 2 ? '힌트' : (good ? '오!' : '음~')) + '</b> ' + ideaEsc(react) + '</div>'
      + '<div style="background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.3);border-radius:10px;padding:10px;font-size:.84rem;color:#e2e8f0;line-height:1.8;margin-bottom:10px">✅ <b style="color:#86efac">정리</b> ' + ideaEsc(st.right) + '</div>'
      + '<button onclick="extNext()" style="display:block;width:100%;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:#fff;border-radius:10px;padding:10px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer">' + (S.i === n - 1 ? '끝내기 🏁' : '다음 →') + '</button>';
  }
  box.innerHTML = extWrap(h);
}
function extPick(idx){
  if(!EXT || EXT.picked !== null) return;
  var st = EXT.steps[EXT.i], a = EXT.flips[EXT.i] ? st.no : st.ok, b = EXT.flips[EXT.i] ? st.ok : st.no;
  EXT.picked = idx;
  if(idx < 2 && (idx === 0 ? a : b) === st.ok) EXT.right++;
  extRender();
}
function extNext(){
  if(!EXT) return;
  if(EXT.i < EXT.steps.length - 1){ EXT.i++; EXT.picked = null; extRender(); return; }
  var x = EXT.data, n = EXT.steps.length;
  EXT.i = n; EXT.picked = null;
  document.getElementById('qc-ext').innerHTML = extWrap(
    '<div style="text-align:center;font-size:2rem;margin-bottom:4px">🎉</div>'
    + '<div style="text-align:center;font-family:Jua,sans-serif;color:#f0abfc;font-size:1rem;margin-bottom:8px">확장 문제까지 해냈어요!</div>'
    + '<div style="font-size:.88rem;color:#e2e8f0;line-height:1.85;margin-bottom:10px">정답: <b style="color:#fde68a;font-size:1rem">' + x.J + '개</b> (n = ' + x.ks.join(', ') + ')<br>🔑 <b style="color:#fde68a">비밀</b>: ' + x.a + ' × n이 제곱수 ⇔ n = ' + x.m + ' × (제곱수)<br><span style="color:#94a3b8;font-size:.78rem">' + n + '단계 중 ' + EXT.right + '단계에서 맞는 생각을 먼저 골랐어요.</span></div>'
    + '<button onclick="extOpen();extOpen()" style="display:block;width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">🔄 다른 범위로 다시</button>'
  );
}

// 살아있는 이모지: 표정이 바뀌고(1.3초), 가끔 폴짝(4~8초마다). 크기·색은 CSS 애니메이션이 맡는다
window.addEventListener('load', function(){
  ideaCss();
  setInterval(function(){
    var f = document.getElementById('idx-face'); if(!f) return;
    ideaFi = (ideaFi + 1 + Math.floor(Math.random() * 2)) % IDEA_FACES.length; f.textContent = IDEA_FACES[ideaFi];
  }, 1300);
  (function schedule(){ setTimeout(function(){ ideaHopNow(); schedule(); }, 4000 + Math.random() * 4000); })();
});

// 바로가기: middle.html?demo=idea → 소인수분해 "심화 문제 도전"을 열고 첫 문제를 완전제곱수 만들기로 놓는다(무작위라 찾기 어려워서)
window.addEventListener('load', function(){
  if(!/[?&]demo=idea(&|$)/.test(location.search) || typeof startQuizHard !== 'function') return;
  startQuizHard('prime', 'prime-hub');
  ST.qs[0] = genPerfectSquare(); ST.cur = 0; ST.answered = false; renderQ();
});
