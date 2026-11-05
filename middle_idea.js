// 심화 문제를 "아이디어 주고받기"로 푼다 — 소인수분해 동굴 "심화 문제 도전"(완전제곱수 만들기 유형)
// 이 유형은 4지선다 보기를 두지 않고, 문제 바로 아래에서 토로와 3단계(같은 수를 둘씩 짝짓기)로 푼 뒤,
// 4번 질문 "그럼 n이 될 수 있는 수는?"(확장 문제)은 3단계 화면 위쪽의 이모지 버튼을 누르면 전체 화면을 새로 열어 푼다. 단계마다 학생 A / 학생 B / 잘 모르겠어요 중 선택.
// 점수: 3단계를 끝까지 가면 기본 +1P, 맞는 생각을 먼저 고른 단계가 2개 이상이면 +2P(기존 오답 +1P·정답 +2P와 같은 크기). 확장 문제는 점수 없음.
// 문제 숫자는 매판 다르므로 문장은 q.data(n, f, fStr, minN, result, sqrtRes)로 채운다. 지수 표기 대신 "같은 수가 몇 개인지"로 센다.
var IDEA = null;
var EXT = null;
var IDEA_COLORS = ['#fbbf24', '#38bdf8', '#f472b6', '#4ade80'];

function ideaEsc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function ideaTimes(p, e){ var a = []; for(var i = 0; i < e; i++) a.push(p); return a.join(' × '); }
function ideaExp(d){ return Object.keys(d.f).map(Number).map(function(q){ return ideaTimes(q, d.f[q]); }).join(' × '); }

// 같은 수를 둘씩 짝지은 그림. extra = 소인수 p를 더 곱한 개수
function ideaPairsHtml(d, p, extra, note){
  var ps = Object.keys(d.f).map(Number), h = '<div style="background:#0f1c33;border:1px solid #243b63;border-radius:12px;padding:10px;margin:0 0 10px"><div style="font-size:.76rem;color:#94a3b8;margin-bottom:6px">같은 수를 둘씩 짝지어 볼까요? (짝 = 같은 수 2개)</div><div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span style="font-size:.9rem;color:#cbd5e1;margin-right:2px">' + d.n + ' =</span>';
  ps.forEach(function(q, gi){
    var c0 = d.f[q], cnt = c0 + (q === p ? extra : 0), col = IDEA_COLORS[gi % IDEA_COLORS.length], pairs = Math.floor(cnt / 2), lone = cnt % 2;
    for(var i = 0; i < pairs; i++){
      var isNew = q === p && extra > 0 && i >= Math.floor(c0 / 2);
      h += '<span class="idp' + (isNew ? ' idp-new' : '') + '"><span class="idt' + (isNew ? ' idt-add' : '') + '" style="background:' + col + '">' + q + '</span><span class="idt' + (isNew ? ' idt-add' : '') + '" style="background:' + col + '">' + q + '</span></span>';
    }
    if(lone) h += '<span class="idp idp-lone"><span class="idt" style="background:' + col + '">' + q + '</span><span class="idt idt-ph">?</span></span>';
  });
  h += '</div>' + (note ? '<div style="margin-top:8px;font-size:.82rem;line-height:1.7;color:#e2e8f0">' + note + '</div>' : '') + '</div>';
  return h;
}

// 완전제곱수 만들기: n에 자연수를 곱해 완전제곱수가 되게 하는 최솟값. 숫자 목록의 n은 모두 지수가 홀수인 소인수가 하나뿐이다.
function ideaPerfectSq(q){
  var d = q.data, f = d.f, ps = Object.keys(f).map(Number);
  var odd = ps.filter(function(p){ return f[p] % 2 !== 0; }), even = ps.filter(function(p){ return f[p] % 2 === 0; });
  if(odd.length !== 1 || !even.length) return null;
  var p = odd[0], e = f[p], r = even[0], er = f[r], n = d.n, exp1 = ideaTimes(p, e), exp2 = ideaTimes(p, e + 1);
  return [
    {ask: '완전제곱수 36, 100, 144를 풀어서 곱셈으로 써 보면 어떤 모양일까?',
     ok: {text: '같은 수가 둘씩 짝이에요! 36 = 2×2×3×3, 100 = 2×2×5×5', react: '맞아! 제곱은 같은 수를 두 번 곱한 거라서, 소인수도 둘씩 짝을 이뤄. 2가 2개, 3이 2개 — 모두 짝이 있지?'},
     no: {text: '일의 자리가 0, 1, 4, 5, 6, 9로 끝나요', react: '좋은 관찰이야. 그런데 14도 일의 자리가 4인데 제곱수가 아니야. 만들 때는 쓰기 어려워서, 곱셈으로 풀어서 보자.'},
     hint: '36 = 2×2×3×3, 100 = 2×2×5×5, 144 = 2×2×2×2×3×3. 같은 수가 몇 개씩인지 세어 봐!',
     right: '완전제곱수는 풀어서 곱하면 같은 수가 모두 둘씩 짝이 지어져(짝이 없는 수가 하나도 없어).'},
    {ask: n + ' = ' + ideaExp(d) + '. 같은 수끼리 둘씩 짝을 지으면 짝이 없는 수는?', pairs: {kind: 'before'},
     ok: {text: p + '가 ' + e + '개라서 짝을 못 찾은 ' + p + ' 하나가 남아요.', react: '맞아! ' + r + '는 ' + er + '개라서 딱 짝이 맞아.'},
     no: {text: r + '가 짝을 못 찾아요.', react: r + '는 ' + er + '개라서 둘씩 딱 짝이 맞아. 짝이 모자란 건 ' + p + ' 쪽이야.'},
     hint: '같은 수끼리 모아서 둘씩 묶어 봐. 어느 수가 하나 남을까?',
     right: p + '가 ' + e + '개(홀수)라서 짝 없는 ' + p + ' 하나가 남아. 이 ' + p + '에게 짝을 만들어 줘야 해.',
     note: '노란 점선 상자가 <b>짝을 못 찾은 ' + p + '</b>예요.'},
    {ask: '짝을 못 찾은 ' + p + '에게 짝을 만들어 주려면, ' + p + eul(p) + ' 몇 개 더 곱해야 할까?', pairs: {kind: 'after', extraOk: 1, extraNo: 2},
     ok: {text: '한 개요. ' + p + '가 ' + e + '개에서 ' + (e + 1) + '개가 되니까 모두 짝이 맞아요.', react: exp1 + '에 ' + p + ' 하나를 더 곱하면 ' + exp2 + ', ' + p + '가 ' + (e + 1) + '개가 되어 둘씩 딱 맞아!'},
     no: {text: '두 개요.', react: p + eul(p) + ' 두 개 곱하면 ' + p + '가 ' + (e + 2) + '개가 돼. 또 하나가 짝 없이 남아.'},
     hint: '짝이 없는 ' + p + ' 하나가 외로워. 같은 ' + p + ' 하나만 더 있으면 어떻게 될까?',
     right: p + ' 하나만 더 곱하면 ' + p + '가 ' + (e + 1) + '개가 되어서 모두 둘씩 짝이 맞아. 그래서 최소 n = ' + d.minN + '이고, ' + n + ' × ' + d.minN + ' = ' + d.result + ' = ' + d.sqrtRes + '²이야.',
     noteOk: '초록 상자가 새로 생긴 짝이에요. <b>짝 없는 수가 하나도 없어요! 🎉</b>', noteNo: '또 하나가 짝 없이 남았어요. 하나만 더 곱하면 되는 거예요.', noteBefore: '아직 곱하기 전이에요. ' + p + '가 ' + e + '개 → 짝 없는 ' + p + ' 하나가 남아 있어요.'}
  ];
}

function ideaStepsFor(q){
  if(!q || q.subtype !== 'perfect_sq' || !q.data || !q.data.f) return null;
  return ideaPerfectSq(q);
}

// 위쪽 점: 풀이 3단계 + 4번째(확장 문제)
function ideaDots(){
  var n = IDEA.steps.length, h = '';
  for(var k = 0; k < n; k++){
    var done = k < IDEA.i || (k === IDEA.i && IDEA.picked !== null), cur = k === IDEA.i && IDEA.picked === null;
    h += '<span style="display:inline-block;width:' + (cur ? 24 : 12) + 'px;height:12px;border-radius:6px;margin:0 3px;background:' + (done ? '#a855f7' : cur ? '#fde68a' : 'rgba(255,255,255,.18)') + '"></span>';
  }
  var extDone = !!(EXT && EXT.i >= EXT.steps.length);
  h += '<span title="확장 문제" style="display:inline-block;width:12px;height:12px;border-radius:6px;margin:0 3px;background:' + (extDone ? '#ec4899' : 'rgba(236,72,153,.35)') + '"></span>';
  return '<div style="text-align:center;margin-bottom:10px">' + h + '</div>';
}
function ideaWrap(inner){
  return '<div style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.35);border-radius:12px;padding:12px">' + ideaDots() + inner + '</div>';
}
function ideaRender(){
  var box = document.getElementById('qc-idea'); if(!box || !IDEA || IDEA.cur !== ST.cur) return;
  var S = IDEA, st = S.steps[S.i], n = S.steps.length, d = ST.qs[ST.cur].data;
  var a = S.flips[S.i] ? st.no : st.ok, b = S.flips[S.i] ? st.ok : st.no;
  var opts = [{k: 'A', o: a}, {k: 'B', o: b}], h = '', p = S.p;
  var lab = '<div style="font-family:Jua,sans-serif;color:#d8b4fe;font-size:.78rem">' + (S.i + 1) + ' / ' + n + ' 단계</div>';
  h += (S.i === n - 1)
    ? '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">' + lab + ideaSideCtaHtml() + '</div>'
    : '<div style="margin-bottom:6px">' + lab + '</div>';
  // 같은 수 둘씩 짝짓기 그림(2·3단계)
  if(st.pairs){
    if(st.pairs.kind === 'before') h += ideaPairsHtml(d, p, 0, st.note);
    else {
      var extra = 0, note = st.noteBefore;
      if(S.picked !== null){
        var good0 = S.picked !== 2 && opts[S.picked].o === st.ok;
        if(S.picked === 2 || good0){ extra = st.pairs.extraOk; note = st.noteOk; } else { extra = st.pairs.extraNo; note = st.noteNo; }
      }
      h += ideaPairsHtml(d, p, extra, note);
    }
  }
  h += '<div style="font-size:.9rem;color:#e2e8f0;line-height:1.8;margin-bottom:10px">🦕 ' + ideaEsc(st.ask) + '</div>';
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
// 3단계가 끝나면: 점수(처음 한 번만)와 정답 줄·풀이 보기·다음 버튼을 붙이고, 아이디어 칸에는 비밀 정리와 4번 질문(확장 문제) 버튼을 보여 준다
function ideaFinalHtml(){
  var d = ST.qs[ST.cur].data, n = IDEA.steps.length;
  return ideaWrap(
    '<div style="text-align:center;font-size:2rem;margin-bottom:4px">🎉</div>'
    + '<div style="text-align:center;font-family:Jua,sans-serif;color:#d8b4fe;font-size:1rem;margin-bottom:8px">아이디어를 끝까지 따라갔어요!</div>'
    + '<div style="font-size:.86rem;color:#e2e8f0;line-height:1.85;margin-bottom:10px">🔑 <b style="color:#fde68a">비밀 정리</b><br>짝이 없는 수에게 짝을 하나씩 만들어 주면 최소야.<br>검산: ' + d.n + ' × ' + d.minN + ' = ' + d.result + ' = ' + d.sqrtRes + '²<br><span style="color:#94a3b8;font-size:.78rem">' + n + '단계 중 ' + IDEA.right + '단계에서 맞는 생각을 먼저 골랐어요.</span></div>'
    + '<button onclick="ideaRestart()" style="display:block;width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">🔄 처음부터 다시 (점수는 그대로)</button>'
  );
}
function ideaFinish(){
  var q = ST.qs[ST.cur], good = IDEA.right >= 2, earn = good ? 2 : 1;
  IDEA.i = IDEA.steps.length; IDEA.picked = null;
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
  document.getElementById('qc-idea').innerHTML = ideaFinalHtml();
}
function ideaRestart(){
  if(!IDEA) return;
  extClose(); EXT = null;
  IDEA.i = 0; IDEA.right = 0; IDEA.picked = null; IDEA.flips = IDEA.steps.map(function(){ return Math.random() < .5; });
  ideaRender();
}

function ideaEligible(q){ return !!(ST.hardMode && ST.topic === 'prime' && ideaStepsFor(q)); }
// 보기 4개를 만드는 renderQChoices 대신 이 자리에 아이디어 칸을 놓고 바로 시작한다
function ideaStart(){
  var q = ST.qs[ST.cur];
  ideaCss();
  document.getElementById('q-steps-wrap').innerHTML =
    '<div id="qc-idea" style="margin-top:12px"></div><div id="qc-result" style="margin-top:12px"></div>'
    + '<div id="qc-explain" style="display:none;margin-top:10px;background:rgba(99,102,241,.1);border-left:3px solid #6366f1;padding:12px 14px;border-radius:8px;font-size:.9rem;line-height:1.7;color:#c0d0e0"></div>';
  var steps = ideaStepsFor(q), odd = Object.keys(q.data.f).map(Number).filter(function(p){ return q.data.f[p] % 2 !== 0; });
  extClose(); EXT = null;
  IDEA = {cur: ST.cur, steps: steps, p: odd[0], i: 0, right: 0, scored: false, flips: steps.map(function(){ return Math.random() < .5; }), picked: null};
  ideaRender();
}

// ── 4번 질문: "그럼 n이 될 수 있는 수는?" (확장 문제) ──
// a × n이 완전제곱수 ⇔ n = (최소 n) × (제곱수). 범위 R 이하로 정하고 n의 개수를 세게 한다.
// 점수는 따로 주지 않는다. 범위 R은 가능한 n이 3~6개가 되도록 정한다. 이모지 버튼으로 연다.
var IDEA_FACES = ['🤩', '😎', '🤔', '😆', '🥳', '😮', '🧐', '😜'], ideaFi = 0;

function ideaCss(){
  if(document.getElementById('idx-css')) return;
  var st = document.createElement('style'); st.id = 'idx-css';
  st.textContent = '.idx-cta{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:linear-gradient(135deg,rgba(168,85,247,.25),rgba(236,72,153,.2));border:1px solid #c084fc;border-radius:16px;padding:12px 14px;color:#f5e9ff;cursor:pointer;font-family:Jua,sans-serif;margin:0 0 10px}'
    + '.idx-cta .txt{font-size:1rem;line-height:1.35}.idx-cta .txt small{display:block;font-family:"Nanum Gothic",sans-serif;font-size:.74rem;color:#e9d5ff;opacity:.85;margin-top:2px}'
    + '.idx-side{display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,rgba(168,85,247,.25),rgba(236,72,153,.2));border:1px solid #c084fc;border-radius:16px;padding:4px 10px 4px 5px;color:#f5e9ff;cursor:pointer;font-family:Jua,sans-serif}'
    + '.idx-side .txt{font-size:.74rem;line-height:1.3;text-align:left}.idx-side .idx-lv{width:46px;height:46px}.idx-side .idx-lv .face{font-size:1.5rem}.idx-side .idx-lv .core{inset:4px}'
    + '.idx-lv{position:relative;flex:none;width:62px;height:62px;display:flex;align-items:center;justify-content:center}'
    + '.idx-lv .ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#f472b6,#fbbf24,#4ade80,#38bdf8,#a78bfa,#f472b6);opacity:.9;animation:idxSpin 4s linear infinite,idxHue 7s linear infinite}'
    + '.idx-lv .core{position:absolute;inset:5px;border-radius:50%;background:#1e1b4b}'
    + '.idx-lv .face{position:relative;font-size:2rem;line-height:1;animation:idxPulse 1.9s ease-in-out infinite}'
    + '.idx-lv.idx-hop{animation:idxHop .9s ease-in-out}'
    + '@keyframes idxSpin{to{transform:rotate(360deg)}}@keyframes idxHue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}'
    + '@keyframes idxPulse{0%,100%{transform:scale(.88)}50%{transform:scale(1.28)}}'
    + '@keyframes idxHop{0%{transform:translateY(0) rotate(0)}18%{transform:translateY(-14px) rotate(-14deg)}36%{transform:translateY(0) rotate(10deg)}54%{transform:translateY(-8px) rotate(-8deg)}72%{transform:translateY(0) rotate(5deg)}100%{transform:translateY(0) rotate(0)}}'
    + '.idp{display:inline-flex;gap:3px;padding:4px 6px;border-radius:12px;background:rgba(99,102,241,.18);border:2px solid #818cf8}'
    + '.idp-lone{background:rgba(251,191,36,.12);border:2px dashed #fbbf24;animation:idxLone 1.2s ease-in-out infinite}.idp-new{border-color:#4ade80;background:rgba(74,222,128,.18)}'
    + '.idt{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Jua,sans-serif;font-size:1rem;color:#0f172a}'
    + '.idt-ph{background:transparent;border:2px dotted #fbbf24;color:#fbbf24}.idt-add{animation:idxPop .45s ease-out}'
    + '@keyframes idxPop{0%{transform:scale(.2)}70%{transform:scale(1.25)}100%{transform:scale(1)}}@keyframes idxLone{0%,100%{box-shadow:0 0 0 rgba(251,191,36,0)}50%{box-shadow:0 0 12px rgba(251,191,36,.7)}}'
    + '@media (prefers-reduced-motion:reduce){.idx-lv .ring,.idx-lv .face,.idx-lv.idx-hop,.idp-lone,.idt-add{animation:none}}';
  document.head.appendChild(st);
}
function ideaSideCtaHtml(){
  return '<button class="idx-side" onclick="extOpen()" title="확장 문제 열기"><span class="idx-lv" id="idx-lv"><span class="ring"></span><span class="core"></span><span class="face" id="idx-face">🤩</span></span>'
    + '<span class="txt">🚀 그럼 n이 될<br>수 있는 수는?</span></button>';
}
function ideaHopNow(){
  var e = document.getElementById('idx-lv'); if(!e) return;
  e.classList.remove('idx-hop'); void e.offsetWidth; e.classList.add('idx-hop');
  setTimeout(function(){ e.classList.remove('idx-hop'); }, 950);
}

function extMake(q){
  var d = q.data, a = d.n, m = d.minN;
  // 범위 R: 절반쯤은 100·150·200·250·300·400·500 같은 평범한 수(가능한 n이 3~12개인 것만), 나머지는 가능한 n이 3~6개가 되는 임의의 수
  var R, J = 0, ks = [], rounds = [100, 150, 200, 250, 300, 400, 500].filter(function(v){ var k = 0; while(m * (k + 1) * (k + 1) <= v) k++; return k >= 3 && k <= 12; });
  if(rounds.length && Math.random() < .5){
    R = rounds[Math.floor(Math.random() * rounds.length)];
    while(m * (J + 1) * (J + 1) <= R) J++;
  } else {
    J = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
    var lo = m * J * J, hi = m * (J + 1) * (J + 1) - 1;
    R = lo + Math.floor(Math.random() * (hi - lo + 1));
  }
  for(var j = 1; j <= J; j++) ks.push(m * j * j);
  var last = ks[ks.length - 1], sq = Math.round(Math.sqrt(a * last)), self = ks.indexOf(a) >= 0;
  return {a: a, m: m, R: R, J: J, ks: ks, steps: [
    {ask: a + ' × n이 완전제곱수가 되려면 n은 어떤 모양이어야 할까?',
     ok: {text: 'n = ' + m + ' × (제곱수)예요. 제곱수는 1, 4, 9, 16, …이라서 n = ' + m + '×1, ' + m + '×4, ' + m + '×9, …', react: '맞아! ' + a + ' × ' + m + '이 이미 제곱수(' + (a * m) + ' = ' + Math.round(Math.sqrt(a * m)) + '²)라서, 거기에 제곱수(같은 수 둘씩)를 곱해도 계속 짝이 맞아.'},
     no: {text: 'n은 ' + m + '의 배수면 아무거나 돼요.', react: (2 * m) + '도 ' + m + '의 배수인데 ' + a + ' × ' + (2 * m) + ' = ' + (a * 2 * m) + '은 제곱수가 아니야. 제곱수를 곱해야 해.'},
     hint: '가장 작은 n은 앞 문제에서 구한 ' + m + '이야. 거기에 ×4, ×9처럼 어떤 수를 곱해야 짝이 계속 맞을까?',
     right: 'n = ' + m + '×1, ' + m + '×4, ' + m + '×9, … (최솟값 ' + m + '에 제곱수를 곱한 수)'},
    {ask: 'n이 ' + R + ' 이하이려면 ' + m + ' × (제곱수) ≤ ' + R + '. 제곱수 j×j에서 j는 어디까지 갈 수 있을까?',
     ok: {text: 'j = 1부터 ' + J + '까지요. ' + m + '×' + J + '² = ' + (m * J * J) + ' ≤ ' + R + '이고, ' + m + '×' + (J + 1) + '² = ' + (m * (J + 1) * (J + 1)) + ' > ' + R + '이에요.', react: '맞아! ' + (J + 1) + '부터는 ' + R + '을 넘어 버려.'},
     no: {text: 'j가 ' + R + ' ÷ ' + m + ' 이하이면 돼요.', react: 'j가 아니라 j×j에 ' + m + '을 곱한 값이 ' + R + ' 이하여야 해. j = ' + (J + 1) + '만 해도 ' + m + '×' + (J + 1) + '² = ' + (m * (J + 1) * (J + 1)) + '로 ' + R + '을 넘어.'},
     hint: 'j = 1, 2, 3, … 을 차례로 넣어서 ' + m + ' × j × j를 계산해 봐. 언제 ' + R + '을 넘을까?',
     right: 'j = 1, 2, …, ' + J + ' (' + (J + 1) + '부터는 ' + R + '을 넘음)'},
    {ask: '그럼 ' + a + ' × n이 완전제곱수가 되는 n은 ' + R + ' 이하에서 모두 몇 개일까?',
     ok: {text: J + '개요. n = ' + ks.join(', ') + '.', react: '정답! ' + a + ' × ' + last + ' = ' + (a * last) + ' = ' + sq + '²이야.' + (self ? ' 참고로 n = ' + a + '도 이 가운데 하나야(' + a + ' × ' + a + ' = ' + (a * a) + '). 가능한 n 중 하나일 뿐, 가장 작은 n은 아니지.' : '')},
     no: {text: (J + 1) + '개요. j = 0도 세야 해요.', react: 'j = 0이면 n = 0인데 n은 자연수여야 해. 0은 세지 않아.'},
     hint: 'j = 1, 2, …, ' + J + '에서 j가 몇 개인지 세어 봐.',
     right: '모두 ' + J + '개 → n = ' + ks.join(', ')}
  ]};
}
function extDots(){
  var h = '';
  for(var k = 0; k < EXT.steps.length; k++){
    var done = k < EXT.i || (k === EXT.i && EXT.picked !== null), cur = k === EXT.i && EXT.picked === null;
    h += '<span style="display:inline-block;width:' + (cur ? 24 : 12) + 'px;height:12px;border-radius:6px;margin:0 3px;background:' + (done ? '#ec4899' : cur ? '#fde68a' : 'rgba(255,255,255,.18)') + '"></span>';
  }
  return '<div style="text-align:center;margin-bottom:10px">' + h + '</div>';
}
function extStart(){
  var x = extMake(ST.qs[ST.cur]);
  EXT = {cur: ST.cur, data: x, steps: x.steps, i: 0, picked: null, right: 0, flips: x.steps.map(function(){ return Math.random() < .5; })};
  extRender();
}
// 이모지를 누르면 아래로 펼치지 않고 전체 화면을 새로 연다. 풀이 화면의 상태(IDEA)는 그대로 두고 "← 돌아가기"로 돌아온다
function extOpen(){
  if(!IDEA || IDEA.cur !== ST.cur || document.getElementById('idx-screen')) return;
  var sc = document.createElement('div'); sc.id = 'idx-screen';
  sc.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:9500;background:#0b1220;overflow:auto;padding:16px';
  sc.innerHTML = '<div style="max-width:1200px;margin:0 auto"><button onclick="extClose()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#e2e8f0;border-radius:10px;padding:8px 14px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer;margin-bottom:12px">← 돌아가기</button>'
    + '<div style="font-family:Jua,sans-serif;color:#f0abfc;font-size:1.05rem;margin:0 0 10px">🚀 확장 문제</div><div id="qc-ext"></div></div>';
  document.body.appendChild(sc); document.body.style.overflow = 'hidden';
  if(!EXT || EXT.cur !== ST.cur || EXT.i >= EXT.steps.length) extStart(); else extRender();
  sc.scrollTop = 0;
}
function extClose(){
  var sc = document.getElementById('idx-screen'); if(sc) sc.parentNode.removeChild(sc);
  document.body.style.overflow = '';
  // 풀이 화면의 위쪽 점(4번째)을 최신으로
  if(IDEA && IDEA.cur === ST.cur){
    if(IDEA.i >= IDEA.steps.length) document.getElementById('qc-idea').innerHTML = ideaFinalHtml(); else ideaRender();
  }
}
function extWrap(inner){
  return '<div style="background:rgba(236,72,153,.07);border:1px solid rgba(236,72,153,.35);border-radius:12px;padding:12px">' + extDots() + inner + '</div>';
}
function extRender(){
  var box = document.getElementById('qc-ext'); if(!box || !EXT || EXT.cur !== ST.cur) return;
  var S = EXT, st = S.steps[S.i], n = S.steps.length, x = S.data;
  var a = S.flips[S.i] ? st.no : st.ok, b = S.flips[S.i] ? st.ok : st.no, opts = [a, b], h = '';
  h += '<div style="font-family:Jua,sans-serif;color:#f0abfc;font-size:.78rem;margin-bottom:6px">🚀 4번 질문 · 확장 문제 (' + (S.i + 1) + ' / ' + n + ')</div>';
  if(S.i === 0) h += '<div style="background:rgba(236,72,153,.1);border:1px solid rgba(236,72,153,.35);border-radius:10px;padding:10px;font-size:.88rem;line-height:1.8;color:#e2e8f0;margin-bottom:10px"><b style="color:#fbcfe8">👑 그럼 n이 될 수 있는 수는?</b><br>최소 n은 ' + x.m + ' 하나였지만, 같은 문제에서 가능한 n이 더 있어요.<br>' + x.a + ' × n이 완전제곱수가 되는 자연수 n 중에서 <b style="color:#fde68a">' + x.R + ' 이하</b>인 것은 모두 몇 개일까요?</div>';
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
    + '<div style="display:flex;gap:8px"><button onclick="extStart()" style="flex:1;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">🔄 다른 범위로 다시</button>'
    + '<button onclick="extClose()" style="flex:1;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:#fff;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">← 풀이로 돌아가기</button></div>'
  );
}

// 심화 모드 + 소인수분해 + 완전제곱수 유형만 보기 4개 대신 아이디어 칸을 쓴다(나머지 유형·일반 모드는 그대로)
window.addEventListener('load', function(){
  if(typeof renderQChoices !== 'function') return;
  var orig = renderQChoices;
  renderQChoices = function(){
    if(ideaEligible(ST.qs[ST.cur])) ideaStart(); else orig();
  };
});
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
// middle.html?demo=ext → 위와 같고, 풀이 3단계를 바로 끝내서 4번 질문(확장 문제)이 열린 화면으로 간다
window.addEventListener('load', function(){
  if(!/[?&]demo=idea(&|$)/.test(location.search) || typeof startQuizHard !== 'function') return;
  startQuizHard('prime', 'prime-hub');
  ST.qs[0] = genPerfectSquare(); ST.cur = 0; ST.answered = false; renderQ();
});
window.addEventListener('load', function(){
  if(!/[?&]demo=ext(&|$)/.test(location.search) || typeof startQuizHard !== 'function') return;
  startQuizHard('prime', 'prime-hub');
  ST.qs[0] = genPerfectSquare(); ST.cur = 0; ST.answered = false; renderQ();
  for(var k = 0; k < 3; k++){ var S = IDEA, st = S.steps[S.i]; ideaPick((S.flips[S.i] ? st.no : st.ok) === st.ok ? 0 : 1); ideaNext(); }
  extOpen();
});
