// 단계로 풀기 (듀오링고식 워밍업) — 카드 하나의 풀이를 "질문 → 빈칸 → 확인 → 그 단계 풀이" 순서로 한 단계씩 보여 준다.
// 카드 본문과 기존 정답/풀이 버튼은 건드리지 않고, 카드 아래 칸(cv-interactive)에 시작 버튼만 붙인다.
// 데이터: MS_DATA['세트:카드번호'] = {steps: [{q, fields: [{pre, post, accept}], model, sol, wrong}]}
//   accept: 맞는 답 목록(문자열은 공백·단위를 뺀 뒤 같은지, 정규식은 그대로 검사). wrong: [{re, msg}] 자주 하는 오답에 주는 말.
// 채점 순서: ① 허용 답 목록과 맞으면 정답 ② 목록에 없고 AI 채점(window.toroAiGrader)이 연결돼 있으면 AI ③ 그래도 못 정하면 모범 답을 보고 스스로 확인.
//   toroAiGrader 규약은 정원과 같다: 입력 {question, solution, key, answer} → Promise<{tier:'full'|'part'|'tried'}>. 15초 안에 답이 없으면 스스로 확인.
var MS_DATA = {};
var MS_AI_TIMEOUT_MS = 15000;
var MS_RUN = null;

function msKey(){ return CS.set + ':' + CS.cur; }
function msNorm(s){
  return String(s == null ? '' : s).toLowerCase().replace(/\s+/g, '').replace(/[.,!?。]/g, '').replace(/(분뒤|분후|분|뒤|후|시|초|번|개|오후|오전)$/, '');
}
function msFieldOk(f, v){
  var raw = String(v == null ? '' : v).replace(/\s+/g, ''), n = msNorm(v);
  return f.accept.some(function(a){ return a instanceof RegExp ? a.test(raw) : msNorm(a) === n; });
}
function msEsc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

function msStartBtn(){
  return '<button onclick="msStart()" style="display:block;width:100%;background:linear-gradient(135deg,#065f46,#10b981);border:none;color:#fff;border-radius:12px;padding:13px;font-family:Jua,sans-serif;font-size:.95rem;cursor:pointer">🎮 단계로 풀기</button>'
    + '<div style="text-align:center;font-size:.72rem;color:rgba(255,255,255,.5);margin-top:6px">질문에 답을 쓰면서 한 단계씩 풀어 봐요</div>';
}
function msOnCard(){
  var box = document.getElementById('cv-interactive'); if(!box || !MS_DATA[msKey()]) return;
  MS_RUN = null; box.style.display = ''; box.innerHTML = msStartBtn();
}
function msStart(){
  MS_RUN = {key: msKey(), i: 0, res: [], tries: 0, seen: false};
  msRender();
}
function msDots(){
  var n = MS_DATA[MS_RUN.key].steps.length, h = '';
  for(var i = 0; i < n; i++){
    var r = MS_RUN.res[i], cur = i === MS_RUN.i && r === undefined;
    h += '<span style="display:inline-block;width:' + (cur ? 26 : 14) + 'px;height:14px;border-radius:7px;margin:0 3px;background:' + (r !== undefined ? '#10b981' : cur ? '#fde68a' : 'rgba(255,255,255,.18)') + '"></span>';
  }
  return '<div style="text-align:center;margin-bottom:12px">' + h + '</div>';
}
function msWrap(inner){
  return '<div style="background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:14px">' + msDots() + inner + '</div>';
}
function msRender(){
  var box = document.getElementById('cv-interactive'), st = MS_DATA[MS_RUN.key].steps[MS_RUN.i], n = MS_DATA[MS_RUN.key].steps.length;
  var fields = st.fields.map(function(f, k){
    return '<span style="white-space:nowrap">' + (f.pre ? msEsc(f.pre) + ' ' : '')
      + '<input id="ms-in-' + k + '" autocomplete="off" onkeydown="if(event.key===\'Enter\')msCheck()" style="width:' + (f.wide ? '100%;max-width:340px' : '64px') + ';background:#0f172a;border:2px solid #64748b;color:#fde68a;border-radius:8px;padding:7px 8px;font-size:1rem;text-align:center;font-family:inherit">'
      + (f.post ? ' ' + msEsc(f.post) : '') + '</span>';
  }).join(' &nbsp; ');
  box.innerHTML = msWrap(
    '<div style="font-family:Jua,sans-serif;color:#86efac;font-size:.75rem;margin-bottom:6px">' + (MS_RUN.i + 1) + ' / ' + n + ' 단계</div>'
    + '<div style="font-size:.88rem;color:#e2e8f0;line-height:1.85;margin-bottom:12px">' + st.q + '</div>'
    + '<div style="margin-bottom:12px;color:#e2e8f0;font-size:.95rem;line-height:2.4">' + fields + '</div>'
    + '<div id="ms-msg"></div>'
    + '<button id="ms-check" onclick="msCheck()" style="display:block;width:100%;background:linear-gradient(135deg,#065f46,#10b981);border:none;color:#fff;border-radius:10px;padding:11px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer">확인</button>'
  );
  MS_RUN.tries = 0; MS_RUN.seen = false;
  var f0 = document.getElementById('ms-in-0'); if(f0) f0.focus();
}
function msVals(){
  return MS_DATA[MS_RUN.key].steps[MS_RUN.i].fields.map(function(_, k){ return document.getElementById('ms-in-' + k).value; });
}
function msCheck(){
  if(!MS_RUN) return;
  var st = MS_DATA[MS_RUN.key].steps[MS_RUN.i], vals = msVals();
  if(vals.some(function(v){ return !String(v).trim(); })){ msMsg('#fbbf24', '✏️ 빈칸을 모두 써 주세요.'); return; }
  MS_RUN.tries++;
  if(st.fields.every(function(f, k){ return msFieldOk(f, vals[k]); })){ msRight(); return; }
  var wrong = (st.wrong || []).filter(function(w){ return w.re.test(vals.join(' ').replace(/\s+/g, '')); })[0];
  var tryAi = typeof window.toroAiGrader === 'function' && !wrong;
  if(!tryAi){ msWrong(wrong && wrong.msg); return; }
  var btn = document.getElementById('ms-check'); btn.disabled = true; btn.textContent = '채점 중…';
  var call = Promise.resolve().then(function(){ return window.toroAiGrader({question: st.q, solution: st.sol, key: st.model, answer: vals.join(' ')}); });
  var timeout = new Promise(function(res){ setTimeout(function(){ res(null); }, MS_AI_TIMEOUT_MS); });
  Promise.race([call, timeout]).catch(function(){ return null; }).then(function(res){
    if(!MS_RUN) return;
    if(res && res.tier === 'full') msRight(); else msWrong();
  });
}
function msMsg(color, html){ document.getElementById('ms-msg').innerHTML = '<div style="color:' + color + ';font-size:.82rem;line-height:1.8;margin-bottom:10px">' + html + '</div>'; }
function msWrong(extra){
  var btn = document.getElementById('ms-check'); btn.disabled = false; btn.textContent = '다시 확인';
  var h = '🤔 아쉬워요. ' + (extra || '다시 한 번 생각해 볼까요?');
  if(MS_RUN.tries >= 2 && !MS_RUN.seen) h += '<br><button onclick="msShowModel()" style="margin-top:8px;background:rgba(253,230,138,.1);border:1px solid rgba(253,230,138,.35);color:#fde68a;border-radius:8px;padding:7px 12px;font-family:Jua,sans-serif;font-size:.78rem;cursor:pointer">💡 모범 답 보기</button>';
  msMsg('#fca5a5', h);
}
// 모범 답을 보면 그 단계는 "봤어요"로 남기고, 내 답이 맞았는지는 학생이 스스로 정한다.
function msShowModel(){
  var st = MS_DATA[MS_RUN.key].steps[MS_RUN.i];
  MS_RUN.seen = true;
  document.getElementById('ms-check').style.display = 'none';
  document.getElementById('ms-msg').innerHTML =
    '<div style="background:rgba(253,230,138,.08);border:1px solid rgba(253,230,138,.3);border-radius:10px;padding:10px;margin-bottom:10px;font-size:.84rem;color:#e2e8f0;line-height:1.85">'
    + '<b style="color:#fde68a">모범 답: ' + st.model + '</b><br>' + st.sol + '</div>'
    + '<div style="font-size:.8rem;color:#cbd5e1;margin-bottom:8px">내 답과 비교해 보세요.</div>'
    + '<div style="display:flex;gap:8px"><button onclick="msDone(\'self\')" style="flex:1;background:#065f46;border:none;color:#fff;border-radius:10px;padding:10px;font-family:Jua,sans-serif;cursor:pointer">내 답도 맞았어요</button>'
    + '<button onclick="msDone(\'seen\')" style="flex:1;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:10px;font-family:Jua,sans-serif;cursor:pointer">아쉬워요, 다음으로</button></div>';
}
function msRight(){
  var st = MS_DATA[MS_RUN.key].steps[MS_RUN.i], first = MS_RUN.tries === 1;
  document.getElementById('ms-check').style.display = 'none';
  Array.prototype.forEach.call(document.querySelectorAll('[id^="ms-in-"]'), function(e){ e.disabled = true; e.style.borderColor = '#10b981'; });
  document.getElementById('ms-msg').innerHTML =
    '<div style="background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.4);border-radius:10px;padding:10px;margin-bottom:10px;font-size:.84rem;color:#e2e8f0;line-height:1.85">'
    + '<b style="color:#86efac">🎉 ' + (first ? '맞아요!' : '이번엔 맞았어요!') + '</b><br>' + st.sol + '</div>'
    + msNextBtn(first ? 'first' : 'retry');
}
function msNextBtn(kind){
  var last = MS_RUN.i === MS_DATA[MS_RUN.key].steps.length - 1;
  return '<button onclick="msDone(\'' + kind + '\')" style="display:block;width:100%;background:linear-gradient(135deg,#065f46,#10b981);border:none;color:#fff;border-radius:10px;padding:11px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer">' + (last ? '끝내기 🏁' : '다음 단계 →') + '</button>';
}
function msDone(kind){
  MS_RUN.res[MS_RUN.i] = kind;
  if(MS_RUN.i < MS_DATA[MS_RUN.key].steps.length - 1){ MS_RUN.i++; msRender(); return; }
  var r = MS_RUN.res, n = r.length, first = r.filter(function(x){ return x === 'first'; }).length;
  var box = document.getElementById('cv-interactive');
  box.innerHTML = msWrap(
    '<div style="text-align:center;font-size:2rem;margin-bottom:4px">🎉</div>'
    + '<div style="text-align:center;font-family:Jua,sans-serif;color:#86efac;font-size:1rem;margin-bottom:6px">모든 단계를 끝냈어요!</div>'
    + '<div style="text-align:center;font-size:.85rem;color:#e2e8f0;line-height:1.8;margin-bottom:12px">' + n + '단계 중 <b style="color:#fde68a">' + first + '단계</b>를 한 번에 맞혔어요.<br>아래 "정답/풀이 보기"에서 한 번에 이어진 풀이도 볼 수 있어요.</div>'
    + '<button onclick="msStart()" style="display:block;width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:10px;font-family:Jua,sans-serif;cursor:pointer">🔄 처음부터 다시</button>'
  );
}

window.addEventListener('load', function(){
  if(typeof renderCard !== 'function') return;
  var orig = renderCard;
  renderCard = function(){ orig(); msOnCard(); };
});
