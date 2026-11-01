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
// w: 같은 카드가 다른 화면에도 그려질 때 칸 id가 겹치지 않게 붙이는 구분 접두어(없으면 카드 화면용)
function mrBoxId(u, id, w){ return 'rvq-' + (w ? w + '-' : '') + u + '-' + id; }
function mrAsk(u, id, w){
  var box = document.getElementById(mrBoxId(u, id, w));
  if(box.innerHTML){ box.innerHTML = ''; return; }
  box.innerHTML = '<div style="margin-top:8px;font-size:.82rem">언제 복습할까요?</div>'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">'
    + [1, 2, 3, 7].map(function(d){ return '<button type="button" class="btn btn-ghost" style="width:auto;padding:6px 12px" onclick="mrSave(\'' + u + '\',\'' + id + '\',' + d + (w ? ',\'' + w + '\'' : '') + ')">' + d + '일 후</button>'; }).join('')
    + '<button type="button" class="btn btn-ghost" style="width:auto;padding:6px 12px" onclick="mrSave(\'' + u + '\',\'' + id + '\',0' + (w ? ',\'' + w + '\'' : '') + ')">오늘</button></div>';
}
function mrSave(u, id, days, w){
  var box = document.getElementById(mrBoxId(u, id, w)), r = MR_UNITS[u].make(id);
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
function mrCardBox(u, id, ask, w, extra){
  return '<div style="margin-top:14px"><div style="display:flex;gap:8px;align-items:stretch">'
    + '<button type="button" class="btn btn-ghost" style="flex:1 1 0;width:auto;min-width:0;padding:11px 8px" onclick="mrAsk(\'' + u + '\',\'' + id + '\'' + (w ? ',\'' + w + '\'' : '') + ')">📌 ' + (ask || '이 내용을 나중에 다시 읽어 볼까요?') + '</button>'
    + (extra || '') + '</div>'
    + '<div id="' + mrBoxId(u, id, w) + '"></div></div>';
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

// ── 카드 세트 복습(open / self / choice) ──
// 단원이 mrCardUnit으로 설정을 등록하면, 그 세트의 카드 화면에 "복습할래요"가 붙고 정원이 편지의 주소로 카드를 열 수 있다.
//   cfg = { sets:[세트키...], home:'카드를 닫고 돌아갈 화면'(세트마다 다르면 home(set) 함수),
//           kindOf(set, card)     → 'open'(문제 없는 카드) | 'self'(문제 카드) | 'choice'(선택형) | null,
//           question(set, card)   → 정원에 보낼 문제 HTML(힌트·정답 암시를 뺀 것),
//           solution(set, card)   → 풀이 HTML,
//           ask(set, card)        → (선택) self 편지의 입력칸 위 안내 문구,
//           choiceOf(set, card)   → {stem, options, answer}  (choice일 때만) }
// 카드는 "세트 이름 + 그 세트 안의 번호"(c-세트-번호)로 가리키고, 번호가 밀려도 찾을 수 있게 카드 제목(tag)을 주소에 같이 적는다.
var MR_CARD_UNIT = {};
var MR_CARD_HOOKED = false;
function mrCardUnit(u, cfg){
  MR_UNITS[u] = {cfg: cfg, make: function(id){ return mrCardMake(u, id); }};
  cfg.sets.forEach(function(s){ MR_CARD_UNIT[s] = u; });
  if(!MR_CARD_HOOKED){
    MR_CARD_HOOKED = true;
    var orig = renderCard;
    renderCard = function(){ orig(); mrOnCard(); };
    var origShow = showScreen;
    showScreen = function(name){ if(name !== 'cardviewer') MR_BACK = ''; origShow(name); };
  }
}
function mrCardMake(u, id){
  var cfg = MR_UNITS[u].cfg, m = /^c-(.+)-(\d+)$/.exec(id); if(!m) return null;
  var c = (CARD_DATA[m[1]] || [])[+m[2]]; if(!c) return null;
  var kind = cfg.kindOf(m[1], c);
  if(kind === 'open') return {
    spec: {kind: 'open', card: +m[2], title: c.tag, url: location.href.split('#')[0].split('?')[0] + '?open=' + m[1] + ':' + m[2] + '&t=' + encodeURIComponent(c.tag)},
    q: '', s: ''
  };
  if(kind === 'self'){
    var spec = {kind: 'self'}, ask = cfg.ask && cfg.ask(m[1], c); if(ask) spec.ask = ask;
    return {spec: spec, q: mrSnapWrap(cfg.question(m[1], c)), s: mrSnapWrap(cfg.solution(m[1], c))};
  }
  if(kind === 'choice'){
    var ch = cfg.choiceOf(m[1], c); if(!ch) return null;
    return {spec: {kind: 'choice', options: ch.options.slice(), answer: ch.answer, reason: null}, q: mrSnapWrap(ch.stem), s: mrSnapWrap(cfg.solution(m[1], c))};
  }
  return null;
}
function mrCardBoxFor(u, set, idx, w){
  var c = (CARD_DATA[set] || [])[idx], kind = c && MR_UNITS[u].cfg.kindOf(set, c);
  return kind ? mrCardBox(u, 'c-' + set + '-' + idx, kind === 'open' ? '' : '이 문제를 나중에 다시 풀어 볼까요?', w) : '';
}
function mrOnCard(){
  if(MR_BACK) document.getElementById('cv-inner').insertAdjacentHTML('afterbegin', mrBackButton());
  var u = MR_CARD_UNIT[CS.set], d = CS.cards && CS.cards[CS.cur]; if(!u || !d) return;
  var kind = MR_UNITS[u].cfg.kindOf(CS.set, d); if(!kind) return;
  var id = 'c-' + CS.set + '-' + CS.cur, note = MR_BACK && kind === 'open';
  var inner = document.getElementById('cv-inner');
  inner.insertAdjacentHTML('beforeend', mrCardBox(u, id, kind === 'open' ? '' : '이 문제를 나중에 다시 풀어 볼까요?', '', note ? mrCardNoteBtn() : ''));
  if(note){ inner.insertAdjacentHTML('beforeend', '<div id="mrcn-panel" style="display:none"></div>'); if(mrCardNoteList().length) mrCardNoteToggle(); }
  if(kind === 'open') mrTouch(u, id);
}
// ── 핵심 내용 써 보기(정원 링크로 연 다시 읽기 카드에만) ──
// 읽고 나서 내 말로 쓴 핵심을 이 브라우저의 교재에 저장하고, 같은 카드를 다시 읽을 때 보여 준다. 정원으로는 보내지 않는다.
// 저장: {"세트|카드 제목": [{date, text}, ...]} 카드당 최근 5건
var MR_CARDNOTE_KEY = 'toro_card_notes_v1';
function mrEsc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
function mrCardNoteAll(){
  try{ var o = JSON.parse(localStorage.getItem(MR_CARDNOTE_KEY) || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; }catch(e){ return {}; }
}
function mrCardNoteName(){ return CS.set + '|' + CS.cards[CS.cur].tag; }
function mrCardNoteList(){ var l = mrCardNoteAll()[mrCardNoteName()]; return Array.isArray(l) ? l : []; }
function mrCardNoteStore(list){
  var all = mrCardNoteAll(); if(list.length) all[mrCardNoteName()] = list; else delete all[mrCardNoteName()];
  try{ localStorage.setItem(MR_CARDNOTE_KEY, JSON.stringify(all)); return true; }catch(e){ return false; }
}
function mrCardNoteBtn(){
  var n = mrCardNoteList().length;
  return '<button type="button" id="mrcn-btn" class="btn btn-ghost" style="flex:0 0 36%;width:auto;min-width:0;padding:11px 6px" onclick="mrCardNoteToggle()">✏️ 핵심 내용 써 보기' + (n ? ' (' + n + ')' : '') + '</button>';
}
function mrCardNoteToggle(){
  var p = document.getElementById('mrcn-panel'); if(!p) return;
  if(p.style.display === 'none'){ mrCardNoteRender(); p.style.display = ''; } else p.style.display = 'none';
}
function mrCardNoteRender(msg){
  var p = document.getElementById('mrcn-panel'), list = mrCardNoteList(), btn = '<button type="button" class="btn btn-ghost" style="flex:none;width:auto;padding:6px 10px;font-size:.78rem"';
  p.innerHTML = '<div style="margin-top:10px;padding:12px;border:1px dashed rgba(255,255,255,.25);border-radius:10px;font-size:.84rem;line-height:1.7;color:#e2e8f0">'
    + (list.length ? '<div style="font-family:Jua,sans-serif;color:#fbbf24;margin-bottom:6px">지난번에 내가 쓴 핵심</div>' + list.map(function(e, i){
        return '<div style="margin-bottom:8px"><span style="font-size:.72rem;color:#94a3b8">' + mrEsc(e.date || '') + '</span>'
          + '<div id="mrcn-t-' + i + '" style="white-space:pre-wrap">' + mrEsc(e.text) + '</div>'
          + '<div id="mrcn-b-' + i + '" style="display:flex;gap:6px;margin-top:4px">' + btn + ' onclick="mrCardNoteEdit(' + i + ')">✏️ 수정</button>' + btn + ' onclick="mrCardNoteDel(' + i + ')">🗑 삭제</button></div></div>';
      }).join('') : '')
    + '<div style="font-family:Jua,sans-serif;color:#fde68a;margin:6px 0">읽고 나서 핵심을 내 말로 써 보세요 (선택)</div>'
    + '<textarea id="mrcn-ta" rows="3" maxlength="300" placeholder="예) 약수는 어떤 수를 나누어떨어지게 하는 수" style="width:100%;box-sizing:border-box;background:#ffffff;border:1px solid #c5ccd8;border-radius:10px;color:#1d2433;padding:10px;font-size:.9rem;font-family:inherit;resize:vertical"></textarea>'
    + '<button type="button" class="btn btn-ghost" style="width:100%;margin-top:8px;padding:10px" onclick="mrCardNoteSave()">💾 저장</button>'
    + '<div id="mrcn-msg" style="margin-top:6px;font-size:.8rem;color:#fde68a">' + (msg || '') + '</div></div>';
  var b = document.getElementById('mrcn-btn'); if(b) b.outerHTML = mrCardNoteBtn();
}
function mrCardNoteSave(){
  var ta = document.getElementById('mrcn-ta'), text = ta.value.trim();
  if(!text){ document.getElementById('mrcn-msg').textContent = '글을 먼저 써 주세요.'; return; }
  var list = mrCardNoteList().concat([{date: mrDateStr(new Date()), text: text}]).slice(-5);
  if(!mrCardNoteStore(list)){ document.getElementById('mrcn-msg').textContent = MR_MSG.save; return; }
  mrCardNoteRender('저장했어요 🌱');
}
function mrCardNoteDel(i){
  if(!confirm('이 핵심 내용을 삭제할까요?')) return;
  var list = mrCardNoteList(); list.splice(i, 1);
  mrCardNoteStore(list); mrCardNoteRender();
}
function mrCardNoteEdit(i){
  var e = mrCardNoteList()[i], t = document.getElementById('mrcn-t-' + i), b = document.getElementById('mrcn-b-' + i); if(!e || !t || !b) return;
  t.innerHTML = '<textarea id="mrcn-e-' + i + '" rows="3" maxlength="300" style="width:100%;box-sizing:border-box;background:#ffffff;border:1px solid #c5ccd8;border-radius:10px;color:#1d2433;padding:10px;font-size:.9rem;font-family:inherit"></textarea>';
  document.getElementById('mrcn-e-' + i).value = e.text;
  var btn = '<button type="button" class="btn btn-ghost" style="flex:none;width:auto;padding:6px 10px;font-size:.78rem"';
  b.innerHTML = btn + ' onclick="mrCardNoteEditSave(' + i + ')">저장</button>' + btn + ' onclick="mrCardNoteRender()">취소</button>';
}
function mrCardNoteEditSave(i){
  var ta = document.getElementById('mrcn-e-' + i); if(!ta) return;
  var text = ta.value.trim(), list = mrCardNoteList(); if(!list[i]) return;
  if(text) list[i] = {date: list[i].date, text: text}; else list.splice(i, 1);
  mrCardNoteStore(list); mrCardNoteRender();
}
// 정원이 편지의 주소로 열면(?open=세트:번호&t=제목&from=정원 주소) 카드 화면 맨 위에 "정원으로 돌아가기"를 보여 준다.
// from은 http·https·file 주소만 받는다. 카드 화면을 벗어나면 지워서, 허브에서 일반으로 연 카드에는 나타나지 않는다.
var MR_BACK = '';
function mrBackUrl(){
  var m = /[?&]from=([^&]*)/.exec(location.search); if(!m) return '';
  try{ var u = decodeURIComponent(m[1]); return /^(https?|file):/i.test(u) ? u : ''; }catch(e){ return ''; }
}
function mrBackButton(){
  return '<button type="button" class="btn btn-ghost" style="width:100%;padding:11px;margin-bottom:12px" onclick="location.href=MR_BACK">🌱 정원으로 돌아가기</button>';
}
function mrOpenFromUrl(){
  var m = /[?&]open=([^:&]+):(\d+)/.exec(location.search); if(!m) return;
  var u = MR_CARD_UNIT[m[1]], cards = CARD_DATA[m[1]], idx = +m[2], t = /[?&]t=([^&]*)/.exec(location.search);
  if(!u || !cards) return;
  try{ t = t ? decodeURIComponent(t[1]) : ''; }catch(e){ t = ''; }
  if(t && (!cards[idx] || cards[idx].tag !== t)) idx = cards.findIndex(function(c){ return c.tag === t; });
  if(idx < 0 || !cards[idx]) return;
  var home = MR_UNITS[u].cfg.home; if(typeof home === 'function') home = home(m[1]);
  showScreen(home); startCards(m[1], home); CS.cur = idx;
  MR_BACK = mrBackUrl();
  renderCard();
}
window.addEventListener('load', mrOpenFromUrl);

// ── 오늘 배운 것 적기 ──
// AI 없이 규칙으로만 판정한다(초등과 같은 기준): 10자 이상 · 글자/어절 다양성 · 이전 기록과 중복 금지 · 카드 본문(과 예시 답안) 베끼기 금지 · 핵심 낱말만 나열 금지 · 핵심어 묶음.
// 정원이 단원·날짜마다 1번 포인트를 준다(합격 10P, 보너스 +5P).
//   cfg = { groups:{A:정규식, B:..., C:...}, words:낱말 정규식(/g), keywordMsg, prompt, sampleAnswer, texts() → 카드 본문 글(문자열) }
var MR_NOTE_KEY = 'toro_study_log_v1';
var MR_NOTES = {};
var MR_NOTE_FAIL = {};
var MR_NOTE_MSG = {
  short: '조금 더 길게 써 볼까요? 10글자 이상 적어 주세요.',
  repeat: '여러 가지 글자와 낱말로 문장을 만들어 써 보세요.',
  list: '낱말만 적지 말고 문장으로 써 볼까요?',
  dup: '전에 쓴 글과 똑같아요. 오늘 내 생각으로 새로 써 볼까요?',
  copy: '카드의 문장과 너무 비슷해요. 내 말로 바꿔 써 볼까요?',
  save: '저장하지 못했어요. 브라우저 설정에서 저장이 막혀 있는지 확인해 주세요.'
};
function mrNoteUnit(u, cfg){ cfg.corpus = null; MR_NOTES[u] = cfg; }
function mrNorm(s){ return String(s).replace(/[^가-힣a-zA-Z0-9]/g, ''); }
function mrGrams(s){ var o = []; for(var i = 0; i + 6 <= s.length; i++) o.push(s.slice(i, i + 6)); return o; }
function mrNoteCorpus(u){
  var c = MR_NOTES[u];
  if(!c.corpus){
    c.corpus = {};
    mrGrams(mrNorm(c.texts() + (c.sampleAnswer || ''))).forEach(function(g){ c.corpus[g] = 1; });
  }
  return c.corpus;
}
// 반환: {ok, code, groups, bonus}
function mrNoteJudge(u, text, prevNorm){
  var c = MR_NOTES[u], norm = mrNorm(text), distinct = {};
  norm.split('').forEach(function(ch){ distinct[ch] = 1; });
  if(norm.length < 10) return {ok: false, code: 'short'};
  if(Object.keys(distinct).length < 5 || text.trim().split(/\s+/).length < 2) return {ok: false, code: 'repeat'};
  if(prevNorm.indexOf(norm) >= 0) return {ok: false, code: 'dup'};
  var grams = mrGrams(norm);
  if(grams.length){
    var corpus = mrNoteCorpus(u), hit = grams.filter(function(g){ return corpus[g]; }).length;
    if(hit / grams.length >= 0.7) return {ok: false, code: 'copy'};
  }
  if(norm.replace(c.words, '').length < 6) return {ok: false, code: 'list'};
  var groups = Object.keys(c.groups).filter(function(k){ return c.groups[k].test(norm); });
  if(groups.indexOf('A') < 0 || groups.length < 2) return {ok: false, code: 'keyword'};
  return {ok: true, groups: groups, bonus: groups.length >= 3};
}
function mrNoteSubmit(u){
  var c = MR_NOTES[u], ta = document.getElementById('mrn-text-' + u), out = document.getElementById('mrn-result-' + u);
  var log = mrList(MR_NOTE_KEY);
  var r = mrNoteJudge(u, ta.value, log.map(function(e){ return mrNorm(e.text || ''); }));
  if(r.ok){
    log.push({unit: u, date: mrDateStr(new Date()), text: ta.value.trim(), groups: r.groups, bonus: r.bonus, ts: Date.now()});
    try{ localStorage.setItem(MR_NOTE_KEY, JSON.stringify(log)); }catch(e){ r = {ok: false, code: 'save'}; }
  }
  if(r.ok){
    MR_NOTE_FAIL[u] = 0;
    out.innerHTML = '<div style="color:#86efac;font-size:.9rem">' + (r.bonus ? '와, 여러 가지를 빠짐없이 적었어요! 보너스 기록까지 저장됐어요 🌟' : '잘 적었어요! 오늘 기록이 저장됐어요 🌱') + '</div>';
    ta.value = '';
  }else{
    MR_NOTE_FAIL[u] = (MR_NOTE_FAIL[u] || 0) + 1;
    out.innerHTML = '<div style="color:#fde68a;font-size:.85rem">' + (r.code === 'keyword' ? c.keywordMsg : MR_NOTE_MSG[r.code]) + '</div>'
      + (MR_NOTE_FAIL[u] >= 2 && c.sampleAnswer
        ? '<div style="margin-top:10px;padding:10px;border:1px dashed rgba(255,255,255,.25);border-radius:10px;font-size:.82rem;line-height:1.7"><b style="color:#fbbf24">📖 이렇게도 써볼 수 있어요</b><br>' + c.sampleAnswer + '</div>' : '');
  }
}
// 카드 본문 HTML(카드 객체의 body로 넣는다)
function mrNoteBody(u){
  var c = MR_NOTES[u];
  return '<div style="font-size:.84rem;line-height:1.85;color:#e2e8f0"><p>공부를 마쳤나요? 오늘 배운 것을 내 말로 적어 봐요. 카드의 문장을 그대로 베끼면 인정되지 않아요.</p>'
    + '<div style="font-family:Jua,sans-serif;color:#fde68a;margin:10px 0 6px">' + c.prompt + '</div>'
    + '<textarea id="mrn-text-' + u + '" rows="4" maxlength="300" placeholder="여기에 써 보세요 (10글자 이상)" style="width:100%;box-sizing:border-box;background:#ffffff;border:1px solid #c5ccd8;border-radius:10px;color:#1d2433;padding:10px;font-size:.9rem;font-family:inherit;resize:vertical"></textarea>'
    + '<button type="button" class="btn btn-ghost" style="width:100%;margin-top:8px;padding:11px" onclick="mrNoteSubmit(\'' + u + '\')">✅ 제출하기</button>'
    + '<div id="mrn-result-' + u + '" style="margin-top:10px"></div></div>';
}
