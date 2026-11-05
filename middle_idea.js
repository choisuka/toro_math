// 심화 문제 풀이를 "아이디어 주고받기"로 따라가기 — 소인수분해 동굴 "심화 문제 도전"(완전제곱수 만들기 유형)
// 답을 고른 뒤 결과 칸에 "🎮 아이디어로 풀이 따라가기" 버튼을 붙이고, 누르면 토로와 단계마다 보기 3개(학생 A / 학생 B / 잘 모르겠어요) 중 하나를 골라 가며 풀이를 따라간다.
// 점수·포인트와는 상관없고, 기존 "📖 풀이 보기"는 그대로 둔다. 문제 숫자는 매판 다르므로 문장은 q.data(n, f, fStr, minN, result, sqrtRes)로 채운다.
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

function ideaButtonHtml(){
  return '<button id="qc-idea-btn" onclick="ideaToggle()" style="background:linear-gradient(135deg,rgba(168,85,247,.28),rgba(99,102,241,.25));border:1px solid #a855f7;color:#e9d5ff;border-radius:8px;padding:7px 16px;font-size:.85rem;cursor:pointer;margin-right:6px;margin-bottom:8px">🎮 아이디어로 풀이 따라가기</button>'
    + '<div id="qc-idea" style="display:none;margin:4px 0 10px"></div>';
}

function ideaToggle(){
  var box = document.getElementById('qc-idea'); if(!box) return;
  if(box.style.display !== 'none'){ box.style.display = 'none'; return; }
  var q = ST.qs[ST.cur], steps = ideaStepsFor(q); if(!steps) return;
  // 틀린 생각과 맞는 생각이 학생 A·B 어느 쪽에 오는지는 단계마다 무작위로 정한다
  IDEA = {cur: ST.cur, steps: steps, i: 0, right: 0, flips: steps.map(function(){ return Math.random() < .5; }), picked: null};
  box.style.display = '';
  ideaRender();
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
  var q = ST.qs[ST.cur], d = q.data, n = IDEA.steps.length;
  IDEA.i = n; IDEA.picked = null;
  var box = document.getElementById('qc-idea');
  box.innerHTML = ideaWrap(
    '<div style="text-align:center;font-size:2rem;margin-bottom:4px">🎉</div>'
    + '<div style="text-align:center;font-family:Jua,sans-serif;color:#d8b4fe;font-size:1rem;margin-bottom:8px">아이디어를 끝까지 따라갔어요!</div>'
    + '<div style="font-size:.86rem;color:#e2e8f0;line-height:1.85;margin-bottom:10px">🔑 <b style="color:#fde68a">비밀 정리</b><br>지수가 홀수인 소인수를 한 번씩만 곱하면 최소야.<br>검산: ' + d.n + ' × ' + d.minN + ' = ' + d.result + ' = ' + d.sqrtRes + '²<br><span style="color:#94a3b8;font-size:.78rem">' + n + '단계 중 ' + IDEA.right + '단계에서 맞는 생각을 먼저 골랐어요.</span></div>'
    + '<button onclick="ideaToggle();ideaToggle()" style="display:block;width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">🔄 처음부터 다시</button>'
  );
}

// 답을 고른 뒤 결과 칸의 "📖 풀이 보기" 앞에 버튼을 끼운다(심화 모드 + 소인수분해 + 완전제곱수 유형만)
window.addEventListener('load', function(){
  if(typeof checkQChoice !== 'function') return;
  var orig = checkQChoice;
  checkQChoice = function(val){
    var first = !ST.answered;
    orig(val);
    var q = ST.qs && ST.qs[ST.cur], eb = document.getElementById('qc-explain-btn');
    if(first && eb && ST.hardMode && ST.topic === 'prime' && ideaStepsFor(q)) eb.insertAdjacentHTML('beforebegin', ideaButtonHtml());
  };
});
