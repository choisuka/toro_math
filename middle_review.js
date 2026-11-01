// 중등 교재 복습 예약 공통 모듈. 교재(middle.html)는 편지를 넣기만 하고, 정원이 채점·삭제·포인트를 맡는다.
// 정원과는 같은 localStorage 키로만 연결된다(키·필드 약속은 CLAUDE.md 6번). 단원은 MR_UNITS[단원id]에 설정을 등록해 붙인다.
//   MR_UNITS[u] = { make: function(id){ return {spec, q, s}; } }   // 못 보내는 문제면 null
var MR_REVIEW_KEY = 'toro_review_v1';
var MR_UNITS = {};
var MR_MSG = {
  save: '저장하지 못했어요. 브라우저 설정에서 저장이 막혀 있는지 확인해 주세요.',
  dup: '이 문제는 이미 복습을 예약했어요.',
  none: '이 문제는 복습으로 보낼 수 없어요.'
};
function mrDateStr(d){ var p = function(n){ return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
function mrList(key){ try{ var a = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(a) ? a : []; }catch(e){ return []; } }
function mrHash(s){ var h = 5381; for(var i = 0; i < s.length; i++){ h = ((h << 5) + h + s.charCodeAt(i)) | 0; } return String(h); }
// 정원의 어두운 바탕에서도 교재의 밝은 글자색이 그대로 읽히도록 교재와 같은 어두운 판에 담아 보낸다
function mrSnapWrap(html){
  return '<div style="background:#1e293b;color:#e2e8f0;border-radius:10px;padding:12px">' + html + '</div>';
}
function mrMsg(box, text, color){ box.innerHTML = '<div style="margin-top:8px;font-size:.82rem;color:' + color + '">' + text + '</div>'; }
function mrAsk(u, id){
  var box = document.getElementById('rvq-' + u + '-' + id);
  if(box.innerHTML){ box.innerHTML = ''; return; }
  box.innerHTML = '<div style="margin-top:8px;font-size:.82rem">언제 복습할까요?</div>'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">'
    + [1, 2, 3, 7].map(function(d){ return '<button type="button" class="btn btn-ghost" style="width:auto;padding:6px 12px" onclick="mrSave(\'' + u + '\',\'' + id + '\',' + d + ')">' + d + '일 후</button>'; }).join('')
    + '<button type="button" class="btn btn-ghost" style="width:auto;padding:6px 12px" onclick="mrSave(\'' + u + '\',\'' + id + '\',0)">오늘</button></div>';
}
function mrSave(u, id, days){
  var box = document.getElementById('rvq-' + u + '-' + id), r = MR_UNITS[u].make(id);
  if(!r){ mrMsg(box, MR_MSG.none, '#fde68a'); return; }
  var h = mrHash(u + id + r.q), today = mrDateStr(new Date()), due = new Date(); due.setDate(due.getDate() + days);
  var dueStr = mrDateStr(due), log = mrList(MR_REVIEW_KEY);
  if(log.some(function(x){ return x.h === h && x.due >= today; })){ mrMsg(box, MR_MSG.dup, '#fde68a'); return; }
  log.push({id: u + '-' + id + '-' + Date.now().toString(36), h: h, type: u + ':' + id, created: today, due: dueStr, spec: r.spec, q: r.q, s: r.s});
  try{
    localStorage.setItem(MR_REVIEW_KEY, JSON.stringify(log));
    mrMsg(box, '📌 ' + days + '일 뒤(' + dueStr + ') 정원에서 복습 문제로 나와요.', '#86efac');
  }catch(e){ mrMsg(box, MR_MSG.save, '#fde68a'); }
}

// ── 카드 열어 보기(open 형) ──
// 편지에는 정원이 그 카드를 여는 완성된 주소(spec.url)를 적어 보낸다. 날짜가 지난 뒤 카드를 열면 "열어 봄" 기록만 남기고, 포인트·삭제는 정원이 한다.
var MR_OPEN_KEY = 'toro_review_open_v1';
function mrCardBox(u, id, ask){
  return '<div style="margin-top:14px;padding:12px;border:1px dashed rgba(255,255,255,.25);border-radius:10px">'
    + '<div style="font-size:.78rem;color:#94a3b8;margin-bottom:6px">' + (ask || '이 내용을 나중에 다시 읽어 볼까요?') + '</div>'
    + '<button type="button" class="btn btn-ghost" style="width:100%;padding:11px" onclick="mrAsk(\'' + u + '\',\'' + id + '\')">📌 복습할래요</button>'
    + '<div id="rvq-' + u + '-' + id + '"></div></div>';
}
function mrTouch(u, id){
  var today = mrDateStr(new Date()), type = u + ':' + id;
  var due = mrList(MR_REVIEW_KEY).filter(function(x){ return x && x.type === type && x.spec && x.spec.kind === 'open' && x.due <= today; });
  if(!due.length) return;
  var touched; try{ touched = JSON.parse(localStorage.getItem(MR_OPEN_KEY) || '{}'); }catch(e){ touched = {}; }
  if(!touched || typeof touched !== 'object' || Array.isArray(touched)) touched = {};
  var changed = false;
  due.forEach(function(x){ if(!touched[x.id]){ touched[x.id] = today; changed = true; } });
  if(changed){ try{ localStorage.setItem(MR_OPEN_KEY, JSON.stringify(touched)); }catch(e){} }
}
