// 익명 학습 기록 수집(Supabase). 이름 등 개인정보는 받지 않고 브라우저에서 만든 무작위 익명 ID만 쓴다.
// 2026-11-21 사용자 결정으로 항상 켜짐이다(SYNC_ENABLED = true). 주소에 ?sync=0 을 붙이면 그 브라우저에서 끈다. 끄려면 SYNC_ENABLED 를 false 로 바꾼다.
// 미성년 학생 데이터 수집의 동의 절차는 아직 확인되지 않았다.
// 단계 풀이 화면(middle_eqwalk.js)은 건드리지 않고, 불러온 뒤 함수를 감싸서 기록만 덧붙인다. 전송이 실패해도 학습 화면은 그대로 동작한다.
(function(){
  var SYNC_ENABLED = true;
  var URL = 'https://gzgpiayrvgrpyfwluzmd.supabase.co/rest/v1/';
  var KEY = 'sb_publishable_XiAzBm9_Wf8TtU4a1j5XNA_24RAOO0n'; // 공개용 키(쓰기만 허용). 비밀 키는 절대 넣지 않는다.
  var K_LID = 'toroSync_lid', K_Q = 'toroSync_q', K_ON = 'toroSync_on', K_FB = 'toroSync_fb_', QMAX = 200;

  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k, v){ try{ localStorage.setItem(k, v); return true; }catch(e){ return false; } }

  function isOn(){
    var m = /[?&]sync=([01])/.exec(location.search);
    if(m){ lsSet(K_ON, m[1]); }
    return SYNC_ENABLED ? lsGet(K_ON) !== '0' : lsGet(K_ON) === '1';
  }
  function uuid(){
    if(window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){ var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function lid(){ var v = lsGet(K_LID); if(!v){ v = uuid(); lsSet(K_LID, v); } return v; }
  function readQ(){ try{ var q = JSON.parse(lsGet(K_Q) || '[]'); return Array.isArray(q) ? q : []; }catch(e){ return []; } }
  function writeQ(q){ lsSet(K_Q, JSON.stringify(q.slice(-QMAX))); }

  var busy = false;
  function flush(){
    if(busy || !isOn() || (navigator.onLine === false)) return;
    var q = readQ(); if(!q.length) return;
    busy = true;
    (function next(){
      var q2 = readQ();
      if(!q2.length){ busy = false; return; }
      var item = q2[0];
      fetch(URL + item.t, {method: 'POST', keepalive: true,
        headers: {apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal'},
        body: JSON.stringify(item.r)})
        .then(function(res){
          if(res.ok || (res.status >= 400 && res.status < 500)){ var cur = readQ(); cur.shift(); writeQ(cur); next(); } // 4xx는 다시 보내도 같아서 버린다
          else { busy = false; }
        })
        .catch(function(){ busy = false; });
    })();
  }
  function send(table, row){
    try{
      if(!isOn()) return;
      row.learner_id = lid();
      var q = readQ(); q.push({t: table, r: row}); writeQ(q);
      flush();
    }catch(e){}
  }
  window.addEventListener('online', flush);

  function clamp(n, lo, hi){ n = parseInt(n, 10); return isNaN(n) ? lo : Math.max(lo, Math.min(hi, n)); }

  // 단계 하나가 끝날 때 결과를 기록한다.
  function outcomeOf(w){
    if(w.revealed) return 'seen';
    if(w.mode === 'blank' && w.solved) return w.tries === 1 ? 'first' : 'retry';
    if(w.picked !== null && w.picked !== undefined) return w.picked === 0 ? 'choice_right' : 'choice_wrong';
    return '';
  }
  function recordStep(){
    var w = window.EQW && EQW.w; if(!w || w.done) return;
    var o = outcomeOf(w); if(!o) return;
    send('events', {card_set: window.EQW_SET || 'eq-basic-walk', card_idx: clamp(w.idx, 0, 200), step_idx: clamp(w.i, 0, 50),
      style: (w.style === 'A' || w.style === 'B') ? w.style : null, outcome: o, tries: clamp(w.tries, 0, 50)});
  }

  // 학생 한 줄 피드백: 단계 풀이 마지막 카드 결과 화면에 붙는다. 하루에 한 번만 남길 수 있다.
  function today(){ var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function addFeedback(box){
    var unit = window.EQW_SET || 'eq-basic-walk';
    if(!box || box.querySelector('#toro-fb')) return;
    var wrap = document.createElement('div');
    wrap.id = 'toro-fb';
    wrap.style.cssText = 'margin-top:12px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.35);border-radius:12px;padding:14px;color:#e2e8f0;font-size:.86rem;line-height:1.8';
    if(lsGet(K_FB + unit) === today()){ wrap.textContent = '🙏 오늘은 이미 의견을 남겨 주셨어요. 고마워요!'; box.appendChild(wrap); return; }
    var title = document.createElement('div'); title.style.cssText = 'font-family:Jua,sans-serif;color:#a5b4fc;margin-bottom:6px'; title.textContent = '💬 오늘 공부, 이해가 됐나요?';
    var row = document.createElement('div'); row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px';
    var picked = 0, btns = [];
    [[1, '😕 아직 어려워요'], [2, '🙂 조금 알겠어요'], [3, '😄 잘 이해했어요']].forEach(function(o){
      var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1];
      b.style.cssText = 'flex:1;min-width:96px;background:#1e293b;color:#e2e8f0;border:2px solid #334155;border-radius:10px;padding:9px 6px;font:inherit;font-size:.82rem;cursor:pointer';
      b.onclick = function(){ picked = o[0]; btns.forEach(function(x){ x.style.borderColor = '#334155'; }); b.style.borderColor = '#fde68a'; go.disabled = false; go.style.opacity = '1'; };
      btns.push(b); row.appendChild(b);
    });
    var inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 200; inp.placeholder = '한 줄로 남겨도 좋아요 (안 써도 돼요)'; inp.autocomplete = 'off';
    inp.style.cssText = 'width:100%;background:#0f172a;border:2px solid #475569;color:#e2e8f0;border-radius:8px;padding:9px 10px;font:inherit;font-size:.9rem;margin-bottom:8px';
    var note = document.createElement('div'); note.style.cssText = 'font-size:.72rem;color:#94a3b8;margin-bottom:8px'; note.textContent = '이름은 받지 않고, 누구인지 알 수 없게 저장돼요.';
    var go = document.createElement('button'); go.type = 'button'; go.textContent = '남기기'; go.disabled = true; go.style.opacity = '.5';
    go.style.cssText += ';display:block;width:100%;padding:10px;border:0;border-radius:10px;font-family:Jua,sans-serif;font-size:.9rem;color:#fff;background:linear-gradient(135deg,#4338ca,#6366f1);cursor:pointer';
    go.onclick = function(){
      if(!picked) return;
      var text = inp.value.replace(/\s+/g, ' ').trim().slice(0, 200);
      send('feedback', {unit: unit, understood: picked, note: text || null});
      lsSet(K_FB + unit, today());
      wrap.textContent = '🙏 고마워요! 의견을 남겼어요.';
    };
    wrap.appendChild(title); wrap.appendChild(row); wrap.appendChild(inp); wrap.appendChild(note); wrap.appendChild(go);
    box.appendChild(wrap);
  }

  window.addEventListener('load', function(){
    if(typeof window.eqwNext !== 'function' || typeof window.eqwReveal !== 'function' || typeof window.eqwRender !== 'function') return;
    var nx = window.eqwNext, rv = window.eqwReveal, rd = window.eqwRender;
    window.eqwNext = function(){
      try{ recordStep(); }catch(e){}
      var r = nx.apply(this, arguments);
      try{ if(window.EQW && EQW.w) EQW.w.revealed = false; }catch(e){}
      return r;
    };
    window.eqwReveal = function(){
      try{ if(window.EQW && EQW.w) EQW.w.revealed = true; }catch(e){}
      return rv.apply(this, arguments);
    };
    window.eqwRender = function(){
      var r = rd.apply(this, arguments);
      try{
        var w = window.EQW && EQW.w;
        if(isOn() && w && w.done && window.EQW_CARDS && w.idx === EQW_CARDS.length - 1) addFeedback(document.getElementById('cv-interactive'));
      }catch(e){}
      return r;
    };
    flush();
  });

  window.toroSync = {isOn: isOn, flush: flush, queue: readQ, learnerId: lid};
})();
